const LocalDatabase = require('../../Databases/LocalDatabase/LocalDatabase');
const MockEmailService = require('../../Services/EmailService/MockEmailService');

class UsersManager{

    constructor() {
        this.db = LocalDatabase.get_instance();
        this.email_service = MockEmailService.get_instance();
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
                }else{
                    this.db.executeUpdate("INSERT INTO Users values(?,?,?,?,?)", [uid, email, "fname", "lname", uid], ()=>{
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
                console.log(user)
                let uid = user["uid"];
                if (uid === confirmation){
                    cont(true, user);
                }else {
                    cont(false, undefined);
                }
            }
        }, err);
    }

}
module.exports = UsersManager;