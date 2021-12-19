const fs = require('fs')

class FileService {
    static instance;

    static init(local_dir, fs_dir){
        this.instance = new FileService(local_dir, fs_dir);
    }

    static get_instance(){
        return this.instance;
    }

    /**
     * local_dir - local directory containing local server files
     * fs_dor - "File System" directory
     * **/
    constructor(local_dir, fs_dir) {
        this.local_dir = local_dir;
        this.fs_dir = fs_dir;
    }


    read_local(path, cont){
        fs.readFile(this.local_dir + "/" + path, cont);
    }


}

module.exports = FileService;