const LocalDatabase = require('../../Databases/LocalDatabase/LocalDatabase');
const Services = require("../../Services/Services");


class MachinesManager{

    constructor() {
        this.local_database = LocalDatabase.get_instance();
        this.file_service = Services.file_service;
    }
    get_attributes(machine_name, attributes, MachinesInfo){
        let machine_json = MachinesInfo.filter((m)=>m["machine"] == machine_name)[0];
        if(machine_json) {
            let machine_attributes = {};
            for (let i in attributes) {
                let attribute_name = attributes[i];
                let attribute_value = machine_json["attributes"].filter((_) => _["name"] == attribute_name);
                if (attribute_value.length == 0) {
                    machine_attributes[attribute_name] = null;
                } else {
                    machine_attributes[attribute_name] = attribute_value[0]["value"];
                }
            }
            return {"state": machine_json["state"], "attributes": machine_attributes};
        }else{
            return null;
        }
    }


    get_machines(connectionHandler, request, cont, err){
        let department = request["department"];
        this.file_service.read_fs("MachinesInfo.json", (e, content)=>{
            if (e){
                err(e);
            }else {
                let MachinesInfo = JSON.parse(content)["machines"];
                //console.log(MachinesInfo);
                this.local_database.executeSearch("SELECT * FROM DepartmentMachines WHERE department=?", [department], (rows) => {
                    let machines = rows.map((row) => row["machine"]);
                    let done = 0;
                    let result = [];
                    machines.forEach((machine, index) => {
                        this.local_database.executeSearch("SELECT * FROM MachineAttributes WHERE department=? AND machine=?", [department, machine], (_rows) => {
                            let attributes = _rows.map((row) => row["attribute"]);
                            //console.log(attributes);
                            let machineInfo = this.get_attributes(machine, attributes, MachinesInfo);
                            if (machineInfo) {
                                result.push({
                                    name: machine,
                                    state: machineInfo["state"],
                                    attributes: machineInfo["attributes"]
                                });
                            }
                            done += 1;

                            if (done == machines.length) {
                                result = result.sort((e1, e2)=> e1.name.localeCompare(e2.name));
                                cont(result);
                            }
                        }, err);
                    });
                }, err);
            }
        });

    }

    getAll_machines(connectionHandler, request, cont, err) {
        let department = request["department"];
        this.file_service.read_fs("MachinesInfo.json", (e, content)=> {
            if (e) {
                err(e);
            } else {
                let MachinesInfo = JSON.parse(content)["machines"];
                cont(MachinesInfo);

            }
        })
    }
}

module.exports = MachinesManager;