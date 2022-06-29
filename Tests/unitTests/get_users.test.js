const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();


test("test get users1",  ()=>{
    manager.get_users((users) => {
        let x = Object.keys(users).length;
        expect(x).toBe(14);
    }, (e) => {
        fail("failed to get users from the db");
    });

});

