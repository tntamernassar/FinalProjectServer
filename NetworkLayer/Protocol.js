const UsersManager = require("../Logic/Users/UsersManager");
const MachinesManager = require("../Logic/Machines/MachinesManager");
const ReportsManager = require("../Logic/Reports/ReportsManager");

class Protocol {

    static createProtocol(){
        return new Protocol();
    }


    constructor() {
        this.usersManager = new UsersManager();
        this.machineManager = new MachinesManager();
        this.reportManager = new ReportsManager();
    }


    on_message(connectionHandler, request){
        let action = request["action"];
        if (action === "get_machines"){
            this.get_machines(connectionHandler, request);
        }else if (action === "request_login"){
            this.request_login(connectionHandler, request)
        }else if (action === "confirmation"){
            this.confirmation(connectionHandler, request);
        }else if (action == "get_report"){
            this.get_report(connectionHandler, request);
        }else {
            console.error("unknown action: " + action);
        }
    }


    /**
     * action: get_machines
     *
     * params: department - department name
     *
     * return list of all machines m for the given flat
     *
     * m = {
     *
     *     'name': name of the machine
     *
     *     'attributes': defined attribute and values of the machine
     *
     *     'state': UP/DOWN/PM
     *
     * }
     *
     * Preform DB operation to read configurations from "Local Database"
     *
     * Preform IO operation to read the data from the "FileSystem"
     * **/
    get_machines(connectionHandler, request){
        let id = request["id"];
        this.machineManager.get_machines(connectionHandler, request, (result)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
                machines: result
            }));
        }, (err)=>{
            connectionHandler.send(JSON.stringify({
                id: id,
                success: false,
                error: err
            }));
        });
    }


    /**
     * action: request_login
     *
     * params: email - corporate email of the user
     *
     * return success flag
     *
     * Preform DB operation to read/write from "Local Database"
     *
     * Preform Network operation to send confirmation email
     * **/
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

    /**
     * action: confirmation
     *
     * params:
     *
     * email - corporate email of the user
     *
     * confirmation - confirmation code of the user
     *
     * return success flag and user object
     *
     * Preform DB operation to read from "Local Database" and "Remote Database"
     * **/
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


    /**
     * action: get_report
     *
     * params:
     *
     * report - the desired report
     *
     * return report data
     *
     * Preform IO operation to read the report data from "FileSystem"
     * **/
    get_report(connectionHandler, request){
        let id = request["id"];
        let report = request["report"];

        this.reportManager.get_report_data(report, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        },(report_data)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: true,
                data: report_data
            }));
        });
    }
}


module.exports = Protocol;