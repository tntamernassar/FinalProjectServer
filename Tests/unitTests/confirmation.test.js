const UsersManager = require("../../Logic/Users/UsersManager");
const Databases = require("../../Databases/Databases");
let root = "C:/Users/mohamad/source/repos/ROOT";
Databases.init(root + "/" + "db/database.db");
let manager=new UsersManager();

test("confirmation test",()=>{
    manager.confirmation("mohamad@intel.com","T8QBY",function (bol,user){
        expect(user).toBe(undefined);
    },(e) => {
        fail("failed to get users from the db");
    })
});