const LocalDatabase = require("./LocalDatabase/LocalDatabase");

/**
 * Initialize local and remote database connections
 * **/
class Databases{

    static init(local_db_name){
        LocalDatabase.init(local_db_name);
    }

}

module.exports = Databases;