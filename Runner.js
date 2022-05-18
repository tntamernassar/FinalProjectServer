const Server = require('./NetworkLayer/Server');
const Services = require('./Services/Services');
const Databases = require('./Databases/Databases');

let root = "C:\\Server\\ROOT";
let file_system = "C:\\Server\\ROOT\\data";

Services.init(root, file_system, ()=>{
    Databases.init(root + "/" + "db/database.db");
    const server = Server.createServer();
    server.server(8080, "localhost");
});