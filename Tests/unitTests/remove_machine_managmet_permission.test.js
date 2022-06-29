const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();


test("test add permission",  ()=>{
    manager.get_user_permissions((users) => {
        let x = Object.keys(users).length;
        manager.remove_machine_management_Permission(["mohamad.agb"],2,()=>{
            manager.get_user_permissions((perms)=>{
                let y = Object.keys(perms).length;
                expect(y).toBe(x-1);
            },()=>{fail()});
        },()=>{fail()});
    }, (e) => {
        fail("failed to get users from the db");
    });

});

