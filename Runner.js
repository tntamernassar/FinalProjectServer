const Server = require('./NetworkLayer/Server');
const Services = require('./Services/Services');
const EmailService = require('./Services/EmailService/EmailService');



Services.init("C:\\Server", undefined, ()=>{
    const server = Server.createServer();
    server.server();
});
