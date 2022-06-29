const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();


test("test add users1",  ()=>{

    manager.Add_user("mohamad.agb@test.com","mohamad","agbaria",()=>{
        manager.get_users((users)=>{
            let x = Object.keys(users).length;
            manager.remove_user(["mohamad.agb"],()=>{
                manager.get_users((users2)=>{
                    let y=Object.keys(users2).length;
                    expect(y).toBe(x-1);
                },()=>{})
            },()=>{
                fail("failed at remove in remove")
            })
        },()=>{
            fail("failed at get users in remove")
        })
    },()=>{
        fail("failed add user in remove")
    })
});

