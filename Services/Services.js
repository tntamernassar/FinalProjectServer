let GmailService = require("./EmailService/GmailService");
let EmailService = require("./EmailService/EmailService");
let FileService = require("./FileService/FileService");
let MockEmailService = require("./EmailService/MockEmailService");


class Services {

    static file_service;
    static email_service;


    static init(local_dir, fs_dir, cont, err){
        FileService.init(local_dir, fs_dir);
        this.file_service = FileService.get_instance();
        this.file_service.read_local("info/email.json", (err, data)=>{
            if(err){
                err("Can't read info/email.json");
            }else{
                let email_info = JSON.parse(data);
                MockEmailService.init(email_info.email, email_info.password);
                this.email_service = MockEmailService.get_instance();
                cont();
            }
        });
    }
}

module.exports = Services;