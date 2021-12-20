let NodeMail = require('nodemailer');


class EmailService{
    static instance;

    static init(email, password) {
        console.log("Initializing email service");
        this.instance = new EmailService(email, password);
    };

    static get_instance(){
        return this.instance;
    }

    constructor(email, password){
        this.email = email;
        this.transporter = NodeMail.createTransport({
            host: 'outlook.intel.com',
            port:587,
            secureConnection:false,
            auth: {
                user: email,
                pass: password
            },
            tls:{
                ciphers:'SSLv3',
                rejectUnauthorized: false
            }
        });
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
    }

    sendHTMLEmail(to, subject, html, cont){
        this.sendMail(this.createMailOption(to, subject, '', html), cont);
    }
}




module.exports = EmailService;

