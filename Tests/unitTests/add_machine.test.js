const assert = require('assert');
const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();
const LocalDatabase = require('../../Databases/LocalDatabase/LocalDatabase');
LocalDatabase.init("root + \"/\" + \"db/database.db\"");
let localdb=LocalDatabase.get_instance();

test("test add machine",  ()=>{
    localdb.executeSearch("select * from DepartmentMachines",[],(rows)=>{
        let x = Object.keys(rows).length;
        manager.add_machine([{
            'department':'BGU',
            'machine':'testmachine'
        }],()=>{
            localdb.executeSearch("select * from DepartmentMachines",[],(rows2)=>{
                let y = Object.keys(rows2).length;
                expect(y).toBe(x+1)
            },()=>{
                fail()
            })
        },()=>{
            fail()
        })
    },()=>{
        fail();
    })

});

