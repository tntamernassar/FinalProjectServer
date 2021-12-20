const sqlite3 = require('sqlite3').verbose();

class LocalDatabase{

    static instance;

    static init(db_name){
        console.log("Initializing Local database");
        this.instance = new LocalDatabase(db_name);
    }

    static get_instance(){
        return this.instance;
    }

    constructor(db_name) {
        this.db = new sqlite3.Database(db_name);
        this.create_default_tables();
    }

    create_default_tables(){

    }

    executeSearch(_sql, _params, _callback, _err) {
        let self = this;
        self.db.all(_sql, _params, (err, rows) => {
            if (err) {
                if (_err)
                    _err(err);
            } else {
                _callback(rows);
            }
        });
    }


    executeUpdate(_sql, _params, _cont, _err) {
        let self = this;
        self.db.run(_sql, _params, function (err) {
            if (err) {
                if (_err)
                    _err(err);
            }else if(_cont) {
                _cont(this.lastID);
            }
        });
    }



    close(){
        this.db.close();
    }
}

module.exports = LocalDatabase;