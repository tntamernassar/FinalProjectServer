const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();


test("test get users1",  ()=>{
    manager.generate_uid(6,(text)=>{
        expect(text.length).toBe(6);
    })

});

