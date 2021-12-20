

class MockEmailService{
    static instance;

    static init(email, password) {
        console.log("Initializing email service");
        this.instance = new MockEmailService(email, password);
    };

    static get_instance(){
        return this.instance;
    }

    constructor(email, password){
        this.email = email;
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
        console.log(mailOptions);
        if (cont) {
            cont(undefined, {success: true});
        }
    }

    sendTextEmail(to, subject, body, cont){
        this.sendMail(this.createMailOption(to, subject, body, ''), cont);
    }

    sendHTMLEmail(to, subject, html, cont){
        this.sendMail(this.createMailOption(to, subject, '', html), cont);
    }
}




module.exports = MockEmailService;

