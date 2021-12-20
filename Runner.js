const Server = require('./NetworkLayer/Server');
const Services = require('./Services/Services');
const EmailService = require('./Services/EmailService/EmailService');



Services.init("C:\\Server", undefined, ()=>{
    console.log("start")
    const server = Server.createServer();
    server.server();
});
