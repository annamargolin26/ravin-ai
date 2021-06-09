const { exec } = require('child_process');

var flow;
/*
Loads data file
*/
function loadFlowFile(){
    try {
        const fs = require('fs');
        const data = fs.readFileSync('./flow.json', 'utf8');
        flow=JSON.parse(data);
        return true;
    }catch (err){
        console.error(err);
        return false;
    }
}
/*
Gets random number in range between min and max
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
/*
Runs a task whis random execution time
 */
function timeoutPromise() {
    let interval=getRandomInt(1,10);
    //console.log("interval:"+interval);
    return new Promise((resolve, reject) => {
        setTimeout(function(){
          resolve("successful");
        }, interval*1000);
      });
};
/**
 * Gets formated datetime
 * @param {milliseconds} tm 
 * @returns 
 */
function getTime(tm){
    return new Date(tm).toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '') 
}
/**
 * Prints step data
 * @param {int} id -flow id 
 * @param {string} flowName -flow name
 * @param {string} step step name
 * @param {int} startTime -execution start milliseconds
 * @param {int} execTime -execution time in milliseconds
 */
function monitor(id,flowName,step,startTime,execTime){
    console.log("flow id:"+id);
    console.log("flow name:"+flowName);
    console.log("state:"+step);
    console.log("start:"+getTime(startTime));
    console.log("execution time:"+execTime);
}
/**
 * Runs a flow
 * @param {int} id flow id
 */
async function runFlow(id){
    let curStep="step-1";
    while(flow.states[curStep].end != true){
        try{
            let startTime = Date.now();
            await timeoutPromise();
            let finishTime = Date.now();
            let execTime = finishTime - startTime;
            if(execTime>9000)
                throw new Error("Timeout expired:"+execTime);
        	monitor(id,flow.flow,curStep,startTime,execTime);
            curStep=flow.states[curStep].next;
        }catch (err){
            console.error(err);
            curStep=flow.states[curStep].exception;
        };  
    }
}
/**
 * load data and on success execute 3 flows
 */
if(loadFlowFile()){
    runFlow(1);
    runFlow(2);
    runFlow(3);
}