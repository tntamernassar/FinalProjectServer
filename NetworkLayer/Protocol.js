const UsersManager = require("../Logic/Users/UsersManager");
const LocalDatabase = require("../Databases/LocalDatabase/LocalDatabase");
const FileService = require("../Services/FileService/FileService");

class Protocol {

    constructor() {
        this.usersManager = new UsersManager();
        this.local_database = LocalDatabase.get_instance();
        this.file_service = FileService.get_instance();
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
        const get_attributes = (machine_name, attributes, MachineInfo)=>{
            let machine_json = MachineInfo.filter((m)=>m["machine"] == machine_name)[0];
            let machine_attributes = {};
            for (let i in attributes){
                let attribute_name = attributes[i];
                let attribute_value = machine_json["attributes"].filter((_)=>_["name"] == attribute_name);
                if (attribute_value.length == 0){
                    machine_attributes[attribute_name] = null;
                }else{
                    machine_attributes[attribute_name] = attribute_value[0]["value"];
                }
            }
            return machine_attributes;
        };
        let id = request["id"];
        let department = request["department"];
        this.file_service.read_fs("MachineInfo.json", (err, content)=>{
            let MachineInfo = JSON.parse(content)["machines"];

            this.local_database.executeSearch("SELECT * FROM DepartmentMachines WHERE department=?", [department], (rows)=>{
                let machines = rows.map((row)=> { return {"machine": row["machine"], "state": row["state"]}});
                let result = [];

                machines.forEach((machine_row, index)=>{
                    let machine = machine_row["machine"];
                    let state = machine_row["state"];
                    this.loc
                    this.local_database.executeSearch("SELECT * FROM MachineAttributes WHERE department=? AND machine=?",[department, machine], (_rows)=>{

                        let attributes = _rows.map((row)=>row["attribute"]);
                        // read values
                        result.push({
                            name: machine,
                            state: state,
                            attributes: get_attributes(machine, attributes, MachineInfo)
                        });

                        if (index == machines.length - 1){
                            connectionHandler.sendMessage(JSON.stringify({
                                id: id,
                                machines: result
                            }));
                        }

                    }, (err)=>{
                        connectionHandler.send(JSON.stringify({
                            id: id,
                            success: false,
                            error: err
                        }));
                    });
                });


            }, (err)=>{
                connectionHandler.send(JSON.stringify({
                    id: id,
                    success: false,
                    error: err
                }));
            });

        });

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