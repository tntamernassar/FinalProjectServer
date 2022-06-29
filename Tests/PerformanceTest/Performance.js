const WebSocket = require('ws');

let socket = new WebSocket("ws://localhost:8080/");


const send = (request)=>{
    socket.send(JSON.stringify(request));
}

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
                    }else{
                        console.log(response);
                    }
                });
            }

            setTimeout(()=>{
                console.log(successes);
                if(successes == numOfUsers){
                    console.log("PASSED : Test 2000 New Users")
                }else{
                    console.log("FAILED : Test 2000 New Users")
                }
            }, 100000);
        });

    }

}

PerformanceTests.runTests();
