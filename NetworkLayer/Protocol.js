const UsersManager = require("../Logic/Users/UsersManager");


class Protocol {

    constructor() {
        this.usersManager = new UsersManager();
    }


    static createProtocol(){
        return new Protocol();
    }

    on_message(connectionHandler, request){
        let action = request["action"];
        if (action === "get_machines"){
            this.get_machines(connectionHandler, request);
        }else if (action === "request_login"){
            this.request_login(connectionHandler, request)
        }else if (action === "confirmation"){
            this.confirmation(connectionHandler, request);
        }else {
            console.error("unknown action: " + action);
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
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                },
                {
                    "name": "A4",
                    "state": "UP",
                    "attributes": [{"a1":2, "a2": 312, "a3": "TLM"}]
                }
            ]
        }));
    }

    request_login(connectionHandler, request){
        let id = request["id"];
        let email = request["email"];
        if (email){
            this.usersManager.request_login(email, (uid)=>{
                connectionHandler.sendMessage(JSON.stringify({id: id, success: true}));
            }, (err)=>{
                connectionHandler.sendMessage(JSON.stringify({id: id, success: false}));
                console.error(err);
            });
        }
    }

    confirmation(connectionHandler, request){
        let id = request["id"];
        let email = request["email"];
        let confirmation = request["confirmation"];
        this.usersManager.confirmation(email, confirmation, (success, user)=>{
            if (success){
                connectionHandler.sendMessage(JSON.stringify({id: id, success: success, user: user}));
            }else{
                connectionHandler.sendMessage(JSON.stringify({id: id, success: success}));
            }
        }, (err)=>{
            console.error(err);
            connectionHandler.sendMessage(JSON.stringify({id: id, success: false}));
        });
    }

}


module.exports = Protocol;