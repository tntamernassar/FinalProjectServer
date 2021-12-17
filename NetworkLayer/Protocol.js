
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


    /**
     * action: get_machines
     * params: flat - flat name
     *
     * return list of all machines m for the given flat
     * m = {
     *     'name': name of the machine
     *     'attributes': defined attribute and values of the machine
     *     'state': UP/DOWN/PM
     * }
     *
     * Preform DB operation to read configurations from "Local Database"
     * Preform IO operation to read the data from the "FileSystem"
     * **/
    get_machines(connectionHandler, request){
        let id = request["id"];
        connectionHandler.sendMessage(JSON.stringify({
            id: id,
            machines: [
                {
                    "name": "A1",
                    "state": "UP",
                    "attributes": [{"a1":1221, "a2": 62, "a3": "ABC"}]
                },
                {
                    "name": "A2",
                    "state": "PM",
                    "attributes": [{"a1":32, "a2": 8767, "a3": "XYZ"}]
                },
                {
                    "name": "A3",
                    "state": "DOWN",
                    "attributes": [{"a1":1245, "a2": 3234, "a3": "DFY"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                }
            ]
        }));
    }

}


module.exports = Protocol;