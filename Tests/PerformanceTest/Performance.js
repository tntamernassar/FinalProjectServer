const WebSocket = require('ws');


const IDAllocator = {
    ID: 0,
    allocate: ()=>{
        let id = IDAllocator.ID;
        IDAllocator.ID += 1;
        return id;
    }
}

const SocketManager = {

    responses: {},

    makeSocket: (onopen)=>{
        let socket = new WebSocket("ws://localhost:8080/");
        socket.onmessage = (response)=>{
            let res = JSON.parse(response.data);
            let id = res["id"];
            SocketManager.responses[id](res);
        };
        socket.onopen = onopen;
        return socket;
    },

    sendMessage:(socket, request, response)=>{
        let id = IDAllocator.allocate();
        request["id"] = id;
        SocketManager.responses[id] = response;
        socket.send(JSON.stringify(request));
    }

}


const PerformanceTests = {

    runTests: ()=>{
        PerformanceTests.test2000NewUsers();
        PerformanceTests.test70ConcurrentUsers();
        PerformanceTests.test10SecondsResponse();
    },

    test2000NewUsers: ()=>{
        let socket = SocketManager.makeSocket(() => {
            let numOfUsers = 2000;
            let successes = 0;
            for(let i = 0; i < numOfUsers; i ++){
                SocketManager.sendMessage(socket, {
                    "action": "add_user",
                    "email": "test" + i + "@test.com",
                    "fname": "testtesttesttesttesttest",
                    "lname": "test"
                }, (response) => {
                    if (response["success"]){
                        successes++;
                    }
                });
            }

            setTimeout(()=>{
                if(successes == numOfUsers){
                    console.log("PASSED : Test 2000 New Users")
                }else{
                    console.log("FAILED : Test 2000 New Users")
                }
            }, 100000);
        });

    },

    test70ConcurrentUsers: ()=>{
        let sockets = [];
        let connects = 0;
        for(let i = 0; i< 70; i ++ ){
            sockets.push(SocketManager.makeSocket(()=>{
                connects ++;
            }));
        }
        setTimeout(()=>{
            if (connects === sockets.length){
                console.log("PASSED : Test 70 concurrent users");
            }else{
                console.log("FAILED: Test 70 concurrent users")
            }
        }, 3000);
    },

    test10SecondsResponse: ()=> {
        let socket = SocketManager.makeSocket(() => {
            let diff1 = 0, diff2 = 0;
            let time = new Date();
            SocketManager.sendMessage(socket, {
                "action": "get_report",
                "report": "e3"
            }, (response) => {
                let time2 = new Date();
                const diffTime = Math.abs(time2 - time);
                diff1 = Math.ceil(diffTime / (1000 * 60 * 60));

                time = new Date();
                SocketManager.sendMessage(socket, {
                    "action": "get_users",
                }, (response) => {
                    let time2 = new Date();
                    const diffTime = Math.abs(time2 - time);
                    diff2 = Math.ceil(diffTime / (1000 * 60 * 60));
                    if (diff1 <= 10 && diff2 <= 10){
                        console.log("PASSED : Test 10 seconds response");
                    }
                    else{
                        console.log("FAILED : Test 10 seconds response");
                    }
                });
            });
        });
    }

}

PerformanceTests.runTests();
