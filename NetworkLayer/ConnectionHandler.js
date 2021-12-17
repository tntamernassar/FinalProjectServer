class ConnectionHandler {

    constructor(connection) {
        this.connection = connection;
    }


    sendMessage(msg){
        this.connection.sendUTF(msg);
    }
}


module.exports = ConnectionHandler;