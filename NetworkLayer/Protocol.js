
class Protocol {

    constructor() {
        this.protocol_map = {
            "get_machines": this.get_machines
        };
    }


    static createProtocol(){
        return new Protocol();
    }

    on_message(connectionHandler, request){
        let action = request["action"];
        if (action in this.protocol_map){
            this.protocol_map[action](connectionHandler, request);
        }else{
            console.error("Unknown action :" + action)
        }
    }


    get_machines(connectionHandler, request){
        let id = request["id"];
        connectionHandler.sendMessage(JSON.stringify({
            id: id,
            machines: ["A1", "A2", "A3", "A4"]
        }));
    }

}


module.exports = Protocol;