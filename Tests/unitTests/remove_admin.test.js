const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();


test("test remove admin",  ()=>{
    manager.Add_user("mohamad.agb@test.com","mohamad","agbaria",()=>{
        manager.add_admin(["mohamad.agb"],()=>{
            manager.remove_admin(["mohamad.agb"],()=>{
                manager.get_users((users)=>{
                    users.forEach(user=>{
                        if(user["username"]=="mohamad.agb")
                            expect(user["admin"]).toBe(0)
                        manager.remove_user(["mohamad.agb"],()=>{},()=>{})
                    })
                },()=>{
                    fail()
                })
            },()=>{
                fail()
            })
        },()=>{
            fail()
        })
    },()=>{
        fail("failed at add admin")
    })

});

