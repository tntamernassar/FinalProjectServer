const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();


test("test get users permissions",  ()=>{
    manager.get_permissions((userspermissions) => {
        let x = Object.keys(userspermissions).length;
        expect(x).toBe(10);
    }, (e) => {
        fail("failed to get users permissions");
    });

});

