const Server = require('./NetworkLayer/Server');
const Services = require('./Services/Services');
const Databases = require('./Databases/Databases');

let root = "C:\\Server";

Services.init(root, undefined, ()=>{
    Databases.init(root + "/" + "db/database.db");
    const server = Server.createServer();
    server.server(8080, "localhost");
});