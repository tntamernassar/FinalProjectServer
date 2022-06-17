const LocalDatabase = require('../../Databases/LocalDatabase/LocalDatabase');
const Services = require("../../Services/Services");

class UsersManager{

    constructor() {
        this.db = LocalDatabase.get_instance();
        this.email_service = Services.email_service;
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

    request_login(email,firstname,lastname, cont, err){
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
                }else{
                    this.db.executeUpdate("INSERT INTO Users values(?,?,?,?,?,?)", [firstname+" "+lastname, email, firstname, lastname, uid, 0], ()=>{
                        _cont(uid);
                    }, err)
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
}
module.exports = UsersManager;