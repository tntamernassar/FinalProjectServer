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
        }else if (action === "getAll_machines") {
            this.getAll_machines(connectionHandler, request)
        }else if (action === "request_login"){
            this.request_login(connectionHandler, request)
        }else if (action === "confirmation"){
            this.confirmation(connectionHandler, request);
        }else if (action == "get_report"){
            this.get_report(connectionHandler, request);
        }else if (action == "add_machine"){
            this.add_machine(connectionHandler, request);
        }else if (action == "remove_machines"){
            this.remove_machines(connectionHandler, request);
        }else if (action == "add_machine_attributes"){
            this.add_machine_attributes(connectionHandler, request);
        }else if (action == "remove_machine_attributes"){
            this.remove_machine_attributes(connectionHandler, request);
        }


        else if (action == "get_notification"){
            this.get_notification(connectionHandler, request);
        }

        else if (action == "remove_notification"){
            this.remove_notification(connectionHandler, request);
        }



        else if (action == "add_new_notification"){
            this.add_new_notification(connectionHandler, request);
        }




        


        else if (action == "get_users"){
            this.get_users(connectionHandler, request);
        }
        else if(action == "add_admin"){
                this.add_admin(connectionHandler, request);
        }
        else if(action == "remove_admin"){
            this.remove_admin(connectionHandler, request);
        }
        else if(action == "add_user"){
            this.add_user(connectionHandler, request);
        }
        else if(action == "remove_user"){
            this.remove_user(connectionHandler, request);
        }


        else if(action == "get_permissions"){
            this.get_permissions(connectionHandler, request);
        }
        else if(action == "get_user_permissions"){
            this.get_user_permissions(connectionHandler, request);
        }


        else if(action == "Add_machine_management_Permission"){
            this.Add_machine_management_Permission(connectionHandler, request);
        }
        else if(action == "remove_machine_management_permission"){
            this.remove_machine_management_permission(connectionHandler, request);
        }
        else if(action == "add_view_report_permission"){
            this.Add_machine_management_Permission(connectionHandler, request);
        }
        else if(action == "remove_view_report_permission"){
            this.remove_machine_management_permission(connectionHandler, request);
        }





        else {
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
            connectionHandler.sendMessage(JSON.stringify({
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


    /**
     * action: get_users
     *
     * return all users
     *
     * Preform DB operation to read the users from "Local database"
     * **/
    get_users(connectionHandler, request){
        let id = request["id"];

        this.usersManager.get_users((users)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
                users: users
            }));
        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }



     add_admin(connectionHandler, request) {
         let id = request["id"];
         let new_admins = request["usernames"];
         this.usersManager.add_admin(new_admins,()=>{
             connectionHandler.sendMessage(JSON.stringify({
                 id: id,
                 success:true,
             }));

         }, (e)=>{
             connectionHandler.sendMessage(JSON.stringify({
                 id: id,
                 success: false,
                 error: e
             }));
         });
     }

    remove_admin(connectionHandler, request) {
        let id = request["id"];
        let remove_admins = request["usernames"];
        this.usersManager.remove_admin(remove_admins,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }


    get_permissions(connectionHandler, request) {
        let id = request["id"];
        this.usersManager.get_permissions((permissions)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
                permissions: permissions

            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e

            }));
        });
    }

    get_user_permissions(connectionHandler, request) {
        let id = request["id"];
        this.usersManager.get_user_permissions((user_permissions)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
                user_permissions: user_permissions

            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    Add_machine_management_Permission(connectionHandler, request) {
        let id = request["id"];
        let new_user = request["usernames"];
        let num_Per = request["num_Per"];

        this.usersManager.Add_machine_management_Permission(new_user,num_Per,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }
/*
    add_view_report_permission(connectionHandler, request) {
        let id = request["id"];
        let new_user = request["usernames"];
        this.usersManager.add_view_report_permission(new_user,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }*/

    remove_machine_management_permission(connectionHandler, request) {
        let id = request["id"];
        let remove_user = request["usernames"];
        let num_Per = request["num_Per"];

        this.usersManager.remove_machine_management_Permission(remove_user, num_Per,() => {
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: true,
            }));

        }, (e) => {
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }


    remove_user(connectionHandler, request) {
        let id = request["id"];
        let remove_users = request["usernames"];
        this.usersManager.remove_user(remove_users,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }
/*
    remove_view_report_permission(connectionHandler, request) {
        let id = request["id"];
        let remove_user = request["usernames"];
        this.usersManager.remove_view_report_permission(remove_user, () => {
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: true,
            }));

        }, (e) => {
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }*/

    add_user(connectionHandler, request) {
        let id = request["id"];
        let email = request["email"];
        let fname = request["fname"];
        let lname = request["lname"];

        this.usersManager.Add_user(email,fname,lname,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    getAll_machines(connectionHandler, request) {
        let id = request["id"];
        this.machineManager.getAll_machines(connectionHandler, request, (result)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
                machines: result
            }));
        }, (err)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: err
            }));
        });
    }

    add_machine(connectionHandler, request) {
        let id = request["id"];
        let new_machines = request["new_machines"];

        this.usersManager.add_machine(new_machines,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    remove_machines(connectionHandler, request) {
        let id = request["id"];
        let remove_machines = request["remove_machines"];

        this.usersManager.remove_machines(remove_machines,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    add_machine_attributes(connectionHandler, request) {
        let id = request["id"];
        let new_attributes = request["new_attributes"];
        let machine = request["machine"];
        this.usersManager.add_machine_attributes(machine,new_attributes,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    remove_machine_attributes(connectionHandler, request) {
        let id = request["id"];
        let remove_attributes = request["remove_attributes"];
        let machine = request["machine"];
        this.usersManager.remove_machine_attributes(machine,remove_attributes,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    get_notification(connectionHandler, request) {
        let id = request["id"];

        this.usersManager.get_notification((notification)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
                notification: notification
            }));
        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    remove_notification(connectionHandler, request) {
        let id = request["id"];
        let notification = request["notification"];

        this.usersManager.remove_notification(notification,()=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
            }));

        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }

    add_new_notification(connectionHandler, request) {
        let id = request["id"];
        let notification = request["notification"];
        let user = request["user"];

        this.usersManager.add_new_notification(notification,user,(notification)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success:true,
                notification: notification
            }));
        }, (e)=>{
            connectionHandler.sendMessage(JSON.stringify({
                id: id,
                success: false,
                error: e
            }));
        });
    }
}


module.exports = Protocol;