let moment = require("moment");
let utils = require('./OKMOperationModesTestUtils')

//filterOperationKeyUpdateFailedEndPoints();
test();

async function test() {
let time = moment().format("_YYYY_M_D_H_MM_SS"); 
let filename = "./OKMOperationModesTest"+ time + ".xlsx"   
let timeInterval = (await utils.getTimeIntervalForCyclicUpdationOfOperationKey())*1000;

console.log(timeInterval);

expectedOperationKeyList = await utils.testOperationModes("REACTIVE", "OffToReactive", filename);

if(expectedOperationKeyList) {
 console.log(expectedOperationKeyList.length); 
}

expectedOperationKeyList = await utils.testOperationModes("REACTIVE", "ReactiveToReactive", filename);


await utils.testOperationModes("OFF", "ReactiveToOff", filename, timeInterval);


expectedOperationKeyList = await utils.testOperationModes("PROTECTION", "OffToProtection", filename, timeInterval);

expectedOperationKeyList = await utils.testOperationModes("PROTECTION", "ProtectionToProtection", filename, timeInterval);

expectedOperationKeyList = await utils.testOperationModes("REACTIVE", "ProtectionToReactive", filename);

await utils.testOperationModes("PROTECTION", "ReactiveToProtection", filename, timeInterval);

await utils.testOperationModes("OFF", "ProtectionToOff", filename, timeInterval);

}

async function testFlow(){
    
}