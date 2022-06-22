const Services = require("../../Services/Services");
const LocalDatabase = require("../../Databases/LocalDatabase/LocalDatabase");


class NotificationsManager {


    constructor() {
        this.db = LocalDatabase.get_instance();
        this.email_service = Services.email_service;

    }

    notifyAboutNewUser(email, firstname, lastname){
        let subject = firstname + " " + lastname + " Joined our dashboard !";
        let body = firstname + " " + lastname + " Have joined our dashboard ! \n use this email to reach him out : " + email;
        this.db.executeSearch("SELECT email FROM NotificationsSubscribers Where notification_id=?", ["add_user"], (emails)=>{
            emails.forEach((email)=>{
               this.email_service.sendTextEmail(email["email"],subject,body, (e, info)=>{
                   if(e){
                       console.log(e);
                   }else{
                       console.log(info);
                   }
               })
            });
        }, console.error);
    }

    notifyAboutRemoveUser(remove_user) {
        let subject = remove_user + " Removed from our dashboard !";
        let body = remove_user + " Have removed from our dashboard ! \n ";
        this.db.executeSearch("SELECT email FROM NotificationsSubscribers Where notification_id=?", ["remove_user"], (emails)=>{
            emails.forEach((email)=>{
                this.email_service.sendTextEmail(email["email"],subject,body, (e, info)=>{
                    if(e){
                        console.log(e);
                    }else{
                        console.log(info);
                    }
                })
            });
        }, console.error);
    }

    notifyAboutNewMachineAdded(department, machine) {
        let subject = machine + " Machine added to dashboard !";
        let body = machine + " Machine Have added to dashboard  From "+ department +" Department! \n ";
        this.db.executeSearch("SELECT email FROM NotificationsSubscribers Where notification_id=?", ["add_machine"], (emails)=>{
            emails.forEach((email)=>{
                this.email_service.sendTextEmail(email["email"],subject,body, (e, info)=>{
                    if(e){
                        console.log(e);
                    }else{
                        console.log(info);
                    }
                })
            });
        }, console.error);
    }

    notifyAboutRemoveMachine(department, machine) {
        let subject = machine + " Machine Removed from our dashboard !";
        let body = machine + " Machine Have removed from our dashboard !\n ";
        this.db.executeSearch("SELECT email FROM NotificationsSubscribers Where notification_id=?", ["remove_machine"], (emails)=>{
            emails.forEach((email)=>{
                this.email_service.sendTextEmail(email["email"],subject,body, (e, info)=>{
                    if(e){
                        console.log(e);
                    }else{
                        console.log(info);
                    }
                })
            });
        }, console.error);
    }
}

module.exports = NotificationsManager;