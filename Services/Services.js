let EmailService = require("./EmailService/EmailService");
let FileService = require("./FileService/FileService");


class Services {

    static init(local_dir, fs_dir, cont){
        FileService.init(local_dir, fs_dir);
        FileService.get_instance().read_local("info/email.json", (err, data)=>{
            if(err){
                console.error("Can't read info/email.json");
            }else{
                let email_info = JSON.parse(data);
                EmailService.init(email_info.email, email_info.password);
                cont();
            }
        });
    }
}

module.exports = Services;