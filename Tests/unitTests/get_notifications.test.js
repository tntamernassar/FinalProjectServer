const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();


test("test get notifications",  ()=>{
    manager.get_notification((nots) => {
        let x = Object.keys(nots).length;
        expect(x).toBe(4);
    }, (e) => {
        fail("failed to get nots from the db");
    });

});

