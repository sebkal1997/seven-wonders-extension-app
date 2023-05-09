package com.sebkal.sevenwondersextensionapp.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Component
@Log4j2
public class SevenWonderExtenstionService {

    private final SocketIOServer socketServer;

    SevenWonderExtenstionService(SocketIOServer socketServer) {
        this.socketServer = socketServer;
        this.socketServer.addConnectListener(onConnected());
        this.socketServer.addDisconnectListener(onDisconnected());

    }


    private ConnectListener onConnected() {
        return (client) -> {
            String room = client.getHandshakeData().getSingleUrlParam("room");
            client.joinRoom(room);
            log.info("Socket ID[{}]  Connected to socket", client.getSessionId().toString());
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            log.info("Client[{}] - Disconnected from socket", client.getSessionId().toString());
        };
    }
}
