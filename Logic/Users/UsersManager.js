const LocalDatabase = require('../../Databases/LocalDatabase/LocalDatabase');
const Services = require("../../Services/Services");
const NotificationsManager = require("../Notfications/NotificationsManager");



class UsersManager{

    constructor() {
        this.db = LocalDatabase.get_instance();
        this.email_service = Services.email_service;
        this.notification_manager = new NotificationsManager();
    }

    generate_uid(length, cont){
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        cont(text);
    }

    send_confirmation_email(email, uid, cont){
        this.email_service.sendTextEmail(email, "Dashboard confirmation", "Hi ! your confirmation code is : " + uid, cont);
    }

    request_login(email, cont, err){
        let _cont = (uid)=>{
            this.send_confirmation_email(email, uid, (error, info)=>{
               if (error){
                   err(error);
               } else {
                   cont();
               }
            });
        };
        this.db.executeSearch("SELECT * FROM Users WHERE email=?", [email], (rows)=>{
            this.generate_uid(6, (uid)=>{
                if (rows.length > 0 ){
                    this.db.executeUpdate("UPDATE Users SET uid=? WHERE email=?", [uid, email], ()=>{
                        _cont(uid);
                    }, err);
                }
            });

        }, err);
    }

    confirmation(email, confirmation, cont, err){
        this.db.executeSearch("SELECT * FROM Users WHERE email=?", [email], (rows)=>{
            if (rows.length == 0){
                err("Email not found");
            }else{
                let user = rows[0];
                let uid = user["uid"];
                if (uid === confirmation){
                    cont(true, user);
                }else {
                    cont(false, undefined);
                }
            }
        }, err);
    }

    get_users(cont, err){
        this.db.executeSearch("SELECT * FROM Users", [], (users)=>{
            cont(users);
        }, err);
    }

    add_admin(new_admins,cont,err){
        new_admins.forEach(new_admin =>
        this.db.executeUpdate("UPDATE Users SET admin=? WHERE username=?", [1, new_admin], ()=>{
            cont();
        }, err));
    }

    remove_admin(remove_admins, cont, err) {
        remove_admins.forEach(remove_admin =>
            this.db.executeUpdate("UPDATE Users SET admin=? WHERE username=?", [0, remove_admin], ()=>{
                cont();
            }, err));
    }

    get_permissions(cont, err) {
        this.db.executeSearch("SELECT * FROM Permissions", [], (permissions)=>{
            cont(permissions);
        }, err);
    }

    get_user_permissions(cont, err) {
        this.db.executeSearch("SELECT * FROM User_Permissions", [], (user_permissions)=>{
            cont(user_permissions);
        }, err);
    }

    Add_machine_management_Permission(new_user,num_Per, cont, err) {
        new_user.forEach(newuser =>
        this.db.executeUpdate("INSERT INTO User_Permissions values(?,?)", [newuser, num_Per], ()=>{
            cont();
        }, err))
    }

    remove_machine_management_Permission(remove_user,num_Per, cont, err) {
        remove_user.forEach(removeuser =>
            this.db.executeUpdate("DELETE FROM User_Permissions WHERE user_name =? AND Permissions_id =?", [removeuser, num_Per], ()=>{
                cont();
            }, err))
    }

/*
    add_view_report_permission(new_user, cont, err) {
        new_user.forEach(newuser =>
            this.db.executeUpdate("INSERT INTO User_Permissions values(?,?)", [newuser, 3], ()=>{
                cont();
            }, err))
    }

    remove_view_report_permission(remove_user,cont, err) {
        remove_user.forEach(removeuser =>
            this.db.executeUpdate("DELETE FROM User_Permissions WHERE user_name =? AND Permissions_id =?", [removeuser, 3], ()=>{
                cont();
            }, err))
    }*/
    remove_user(remove_users,cont, err) {
        remove_users.forEach(remove_user =>
            this.db.executeUpdate("DELETE FROM Users WHERE username =? ", [remove_user], ()=>{
                cont();
                //send_mail
                this.notification_manager.notifyAboutRemoveUser(remove_user);
            }, err));
    }

    Add_user(email,firstname,lastname, cont, err) {

        this.db.executeSearch("SELECT * FROM Users WHERE email=?", [email], (rows) => {
            this.db.executeUpdate("INSERT INTO Users values(?,?,?,?,?,?)", [firstname + "" + lastname, email, firstname, lastname, "", 0], () => {
                cont();
            }, err)
            this.notification_manager.notifyAboutNewUser(email, firstname, lastname);
        });
    }

    add_machine(new_machines, cont, err) {
        new_machines.forEach(new_machine =>
            this.db.executeUpdate("INSERT INTO DepartmentMachines values(?,?)", [new_machine["department"], new_machine["machine"]], ()=>{
                cont();
                this.notification_manager.notifyAboutNewMachineAdded(new_machine["department"], new_machine["machine"]);
            }, err))
    }

    remove_machines(remove_machines, cont, err) {
        remove_machines.forEach(remove_machine =>
            this.db.executeUpdate("DELETE FROM DepartmentMachines WHERE machine =?", [remove_machine["name"]], ()=>{
                cont();
                this.notification_manager.notifyAboutRemoveMachine(remove_machine["department"], remove_machine["name"]);
            }, err))

    }

    add_machine_attributes(machine,new_attributes,cont, err) {
        new_attributes.forEach(new_attribute =>
            this.db.executeUpdate("INSERT INTO MachineAttributes values(?,?,?)", [machine["department"],machine["machine"],new_attribute], ()=>{
                cont();
            }, err))
    }

    remove_machine_attributes(machine, remove_attributes,cont, err) {
        remove_attributes.forEach(remove_attribute =>
            this.db.executeUpdate("DELETE FROM MachineAttributes WHERE machine =? AND attribute =?", [machine["name"], remove_attribute], ()=>{
                cont();
            }, err))
    }

    get_notification(cont, err) {
        this.db.executeSearch("SELECT * FROM NotificationsSubscribers", [], (notification)=>{
            cont(notification);
        }, err);
    }

    remove_notification(notification, cont, err) {
        notification.forEach(notification1 =>
            this.db.executeUpdate("DELETE FROM NotificationsSubscribers WHERE email =? and notification_id = ?", [notification1["email"],notification1["notification_id"]], ()=>{
                cont();
            }, err))
    }

    add_new_notification(notification, user, cont, err) {
        notification.forEach(notification1 =>
            this.db.executeUpdate("INSERT INTO NotificationsSubscribers values(?,?)", [user["email"],notification1], ()=>{
                cont();
            }, err))
    }
}
module.exports = UsersManager;