package com.sebkal.sevenwondersextensionapp.config;


import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ServerCommandLineRunner implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(ServerCommandLineRunner.class);
    private final SocketIOServer server;

    public void run(String... args) throws Exception {
        this.server.start();
    }

    public ServerCommandLineRunner(final SocketIOServer server) {
        this.server = server;
    }

    @PreDestroy
    public void stopServer() {
        this.server.stop();
    }
}

