const Services = require("../../Services/Services");


class ReportsManager{

    static mappings = {
        "tracers": "Tracers.json",
    };

    constructor() {
        this.file_service = Services.file_service;
    }


    get_report_data(report, err, cont){
        if (report in ReportsManager.mappings) {
            this.file_service.read_fs(ReportsManager.mappings[report], (e, content) => {
                if(e){
                    err(e);
                }else {
                    cont(JSON.parse(content));
                }
            });
        }else {
            err("Can't find report " + report)
        }
    }

}

module.exports = ReportsManager;