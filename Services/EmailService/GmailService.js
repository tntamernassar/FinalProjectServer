const EmailService = require("./EmailService");
const NodeMail = require("nodemailer");


class GmailService extends EmailService{
    static instance;

    static init(email, password) {
        console.log("Initializing email service");
        this.instance = new GmailService(email, password);
    };

    static get_instance(){
        return this.instance;
    }

    constructor(email, password){
        super(email, password);
        this.transporter = NodeMail.createTransport({
                host: "smtp-mail.outlook.com", // hostname
                secureConnection: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                auth: {
                    user: email,
                    pass: password
                },
                tls: {
                    ciphers:'SSLv3'
                }
            }
        );
    }

    createMailOption(to, subject, text, html){
        return  {
            from: this.email,
            to: to,
            subject: subject,
            text: text,
            html: html
        };
    }

    sendMail(mailOptions, cont){
        this.transporter.sendMail(mailOptions, function(error, info){
            if (cont) {
                cont(error, info);
            }
        });
    }

    sendTextEmail(to, subject, body, cont){
        this.sendMail(this.createMailOption(to, subject, body, ''), cont);
        this.sleep(7);
    }

    sendHTMLEmail(to, subject, html, cont){
        this.sendMail(this.createMailOption(to, subject, '', html), cont);
    }

    sleep(seconds)
    {
        let e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) {}
    }

}

module.exports = GmailService;

