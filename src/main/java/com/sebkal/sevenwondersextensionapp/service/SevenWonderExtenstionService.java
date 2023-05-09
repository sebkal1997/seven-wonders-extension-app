package com.sebkal.sevenwondersextensionapp.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

@Component
public class SevenWonderExtenstionService {
    private static final Logger log = LogManager.getLogger(SevenWonderExtenstionService.class);
    private final SocketIOServer socketServer;

    SevenWonderExtenstionService(SocketIOServer socketServer) {
        this.socketServer = socketServer;
        this.socketServer.addConnectListener(this.onConnected());
        this.socketServer.addDisconnectListener(this.onDisconnected());
    }

    private ConnectListener onConnected() {
        return (client) -> {
            String room = client.getHandshakeData().getSingleUrlParam("room");
            client.joinRoom(room);
            log.info("Client ID[{}]  Connected to socket", client.getSessionId().toString());
        };
    }

    private DisconnectListener onDisconnected() {
        return (client) -> {
            log.info("Client ID[{}] - Disconnected from socket", client.getSessionId().toString());
        };
    }
}