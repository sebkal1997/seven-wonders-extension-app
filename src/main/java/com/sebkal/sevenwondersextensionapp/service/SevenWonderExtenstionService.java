package com.sebkal.sevenwondersextensionapp.service;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.sebkal.sevenwondersextensionapp.exception.GameFinishedException;
import com.sebkal.sevenwondersextensionapp.model.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class SevenWonderExtenstionService {

    private static final Logger log = LogManager.getLogger(SevenWonderExtenstionService.class);

    private static final Map<String, String> clientRoom = new HashMap<>();

    private final SocketIOServer socketServer;

    private final Game game = new Game();

    SevenWonderExtenstionService(SocketIOServer socketServer) {
        this.socketServer = socketServer;
        this.socketServer.addConnectListener(this.onConnected());
        this.socketServer.addDisconnectListener(this.onDisconnected());

        this.socketServer.addEventListener("addMember", String.class, onAddMember());
        this.socketServer.addEventListener("removeMember", String.class, onRemoveMember());
        this.socketServer.addEventListener("addResource", CreateResourceDto.class, onAddResource());
        this.socketServer.addEventListener("transferResources", TransferResourcesDto.class, onTransferResource());
        this.socketServer.addEventListener("nextRound", Void.class, onNextRound());
        this.socketServer.addEventListener("increaseProduction", IncreaseProductionDto.class, onIncreaseProduction());
    }

    private ConnectListener onConnected() {
        return (client) -> {
            String room = client.getHandshakeData().getSingleUrlParam("room");
            clientRoom.put(client.getSessionId().toString(), room);
            client.joinRoom(room);
            log.info("Client ID[{}]  Connected to socket", client.getSessionId().toString());
        };
    }

    private DisconnectListener onDisconnected() {
        return (client) -> {
            final String roomName = clientRoom.remove(client.getSessionId().toString());
            client.leaveRoom(roomName);
            log.info("Client ID[{}] - Disconnected from socket", client.getSessionId().toString());
        };
    }

    private DataListener<String> onAddMember() {
        return (client, data, ackSender) -> {
            log.info("Added new member to the game called {}", data);
            game.getMembers().add(Member.create(data));
            publishGameUpdate(client);
        };
    }

    private DataListener<String> onRemoveMember() {
        return (client, data, ackSender) -> {
            log.info("Added new member to the game called {}", data);
            game.getMembers().removeIf(member -> data.equals(member.getName()));
            publishGameUpdate(client);
        };
    }

    private DataListener<CreateResourceDto> onAddResource() {
        return (client, data, ackSender) -> {
            log.info("Added new member to the game called {}", data);
            game.getMembers()
                    .stream()
                    .filter(member -> data.getMemberName().equals(member.getName()))
                    .forEach(member -> member.getResources()
                            .stream()
                            .filter(resource -> data.getResourceType().equals(resource.getType()))
                            .forEach(resource -> resource.increaseAmount(data.getResourceAmount())));
            publishGameUpdate(client);
        };
    }

    private DataListener<TransferResourcesDto> onTransferResource() {
        return (client, data, ackSender) -> {
            log.info("Transfer resources from {} to {}", data.getFromMemberName(), data.getToMemberName());
            game.getMemberByName(data.getFromMemberName())
                    .transferResources(game.getMemberByName(data.getToMemberName()), data.getResources());
            publishGameUpdate(client);
        };
    }

    private DataListener<Void> onNextRound() {
        return (client, data, ackSender) -> {
            log.info("Change game round to " + (game.getRound() + 1));
            try {
                game.changeRound();
                publishGameUpdate(client);
            } catch (GameFinishedException ex) {
                publishGameOver(client);
            }
        };
    }

    private DataListener<IncreaseProductionDto> onIncreaseProduction() {
        return (client, data, ackSender) -> {
            log.info("Increase production of {} by {} for {}", data.getResourceType().toString(),
                    data.getProductionValue(), data.getMemberName());
            game.increaseProductionForMember(data);
            publishGameUpdate(client);
        };
    }

    private void publishGameUpdate(SocketIOClient client) {
        final String roomName = clientRoom.get(client.getSessionId().toString());
        if (roomName != null) {
            socketServer.getRoomOperations(roomName).sendEvent("gameUpdate", game);
        } else {
            log.error("Cannot find room name for client {}", client.getSessionId());
        }
    }

    private void publishGameOver(SocketIOClient client) {
        final String roomName = clientRoom.get(client.getSessionId().toString());
        if (roomName != null) {
            socketServer.getRoomOperations(roomName).sendEvent("gameOver", "Game Over!");
        } else {
            log.error("Cannot find room name for client {}", client.getSessionId());
        }
    }
}