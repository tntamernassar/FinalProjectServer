const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
const LocalDatabase = require("../../Databases/LocalDatabase/LocalDatabase");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();

LocalDatabase.init(root + "/" + "db/database.db");
let db=LocalDatabase.get_instance();
let x=-1,y=-1;
beforeAll(()=>{
    db.executeSearch("select * from MachineAttributes",[],(rows)=>{
        x=Object.keys(rows).length;
    },()=>{});
});

let machine={
    'Department':'BGU',
    'machine':'testmachine'
};
let attributes=['att1','att2'];

test("add attributes",()=>{
    manager.add_machine_attributes(machine,attributes,()=>{},()=>{});
    db.executeSearch("select * from MachineAttributes",[],(rows)=>{
        y=Object.keys(rows).length;

    },()=>{});
    expect(y).toBe(x+2);
});

afterAll(()=>{
    manager.remove_machine_attributes(machine,attributes,()=>{},()=>{});

})