const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
const LocalDatabase = require("../../Databases/LocalDatabase/LocalDatabase");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();

LocalDatabase.init(root + "/" + "db/database.db");
let db=LocalDatabase.get_instance();



let machine={
    'Department':'BGU',
    'machine':'testmachine'
};
let attributes=['att1','att2'];

test("remove machine attributes",()=>{

    manager.add_machine_attributes(machine,attributes,()=>{
        db.executeSearch("select * from MachineAttributes",[],(rows2)=>{
            let y=Object.keys(rows2).length;
            manager.remove_machine_attributes(machine,attributes,()=>{
                db.executeSearch("select * from MachineAttributes",[],(rows)=>{
                    let x=Object.keys(rows).length;
                    expect(x).toBe(y-2);
                },()=>{fail()})
            },()=>{fail()})
        },()=>{fail()})
    },()=>{
        fail()
    })
});

