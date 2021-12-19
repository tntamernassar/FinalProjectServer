const http = require('http');
const fs = require('fs');
const WebSocketServer = require('websocket').server;
const Protocol = require("./Protocol");
const ConnectionHandler = require("./ConnectionHandler");



class Server{

    static createServer(){
        return new Server();
    }

    server() {
        const server = http.createServer();
        const protocol = Protocol.createProtocol();

        server.listen(8080, "localhost", ()=>{
            console.log("Running HTTP server");
        });

        const web_socketserver = new WebSocketServer({
            httpServer: server
        });

        web_socketserver.on('request', (request)=>{
            let connection = request.accept(null, request.origin);
            let connectionHandler = new ConnectionHandler(connection);
            connection.on('message', (message)=>{
                protocol.on_message(connectionHandler, JSON.parse(message['utf8Data']));
            });
        });
    }

}

module.exports = Server;