/**
 * This class provides functionality to construct a rest request
 **/

const protocol = "http";
const inputFile = require('./OKMInput.json');
const axios = require('axios');
const xlsx = require('xlsx');
let outputBook = xlsx.utils.book_new();

exports.testOperationModes = async function (operationMode, sheetName, fileName, timeOut) {
    await putOperationMode(operationMode);
    if(timeOut){
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(timeOut)
    }
    let controlConstructOfALT = await getControlContruct(inputFile['applicationLayerTopologyApplicationDetails']);
    let operationKeyOfListLinkUuids = await getOperationKeyFromOperationName("/v1/list-link-uuids", controlConstructOfALT);
    let listOfLinkUuids = await getlistOfLinkUuidsFromALT(operationKeyOfListLinkUuids);
    if (listOfLinkUuids) {
        let listOfLinkUuidsWithEndPointDetails = [];
        console.log(listOfLinkUuids['link-uuid-list'].length);
        for (let linkUuid of listOfLinkUuids['link-uuid-list']) {
            let controlConstructOfALT = await getControlContruct(inputFile['applicationLayerTopologyApplicationDetails']);
            let operationKeyOfListEndPointsOfLink = await getOperationKeyFromOperationName("/v1/list-end-points-of-link", controlConstructOfALT);
            let endPointsOfLinkUuid = await getListEndPointsOfLink(operationKeyOfListEndPointsOfLink, linkUuid);
            let endPointsOfLinkUuidWithOperationKey = [];
            if (endPointsOfLinkUuid) {
                endPointsOfLinkUuidWithOperationKey = await getEndPointsOfLinkUuidWithOperationKey(endPointsOfLinkUuid,linkUuid);
                endPointsOfLinkUuidWithOperationKey = await filterOperationKeyUpdateFailedEndPoints(endPointsOfLinkUuidWithOperationKey);
                listOfLinkUuidsWithEndPointDetails.push(endPointsOfLinkUuidWithOperationKey);
            }
        }
      await writeToExcelFile(listOfLinkUuidsWithEndPointDetails, sheetName, fileName)        
      return listOfLinkUuidsWithEndPointDetails;
    }
}

exports.testFlow = async function (operationMode, sheetName, fileName) {
    let controlConstructOfALT = await getControlContruct(inputFile['applicationLayerTopologyApplicationDetails']);
    let operationKeyOfListLinkUuids = await getOperationKeyFromOperationName("/v1/list-link-uuids", controlConstructOfALT);
    let listOfLinkUuids = await getlistOfLinkUuidsFromALT(operationKeyOfListLinkUuids);
    if (listOfLinkUuids) {
        let listOfLinkUuidsWithEndPointDetails = [];
        listOfLinkUuids = listOfLinkUuids['link-uuid-list'];
        let linkUuid = listOfLinkUuids[(Math.floor(Math.random()*listOfLinkUuids.length))];
        console.log(linkUuid);
        let controlConstructOfRO = await getControlContruct(inputFile['registryOfficeApplicationDetails']);
        let operationKeyOfRegardUpdatedApprovalStatus = await getOperationKeyFromOperationName("/v1/regard-updated-approval-status", controlConstructOfRO);
        let response = await sendRegardUpdatedApprovalStatusRequest(operationKeyOfRegardUpdatedApprovalStatus, linkUuid);
        let endPointsOfLinkUuidWithOperationKey = [];
            if (endPointsOfLinkUuid) {
                endPointsOfLinkUuidWithOperationKey = await getEndPointsOfLinkUuidWithOperationKey(endPointsOfLinkUuid,linkUuid);

            }
        }
      await writeToExcelFile(listOfLinkUuidsWithEndPointDetails, sheetName, fileName)        
      return listOfLinkUuidsWithEndPointDetails;
}

async function filterOperationKeyUpdateFailedEndPoints(endPointsOfLinkUuidWithOperationKey){
    let operationServerOperationKey = endPointsOfLinkUuidWithOperationKey[0]["actual-operation-key"];
    for(let i=1 ; i<endPointsOfLinkUuidWithOperationKey.length ; i++ ){
        endPointsOfLinkUuidWithOperationKey[i]["expected-operation-key"] = operationServerOperationKey;
        if(endPointsOfLinkUuidWithOperationKey[i]["actual-operation-key"] === operationServerOperationKey){
            endPointsOfLinkUuidWithOperationKey[i]["PassOrFail"] = "Pass";
        } else {
            endPointsOfLinkUuidWithOperationKey[i]["PassOrFail"] = "Fail";
        }
    }
    return endPointsOfLinkUuidWithOperationKey;
}

async function getEndPointsOfLinkUuidWithOperationKey(endPointsOfLinkUuid, linkUuid){
    let i=1;
    let endPointsOfLinkUuidWithOperationKey = [];
    for (let endPoint of endPointsOfLinkUuid["link-end-point-list"]) {
        endPoint["link-uuid"] = linkUuid;
        let endPointApplicationAddressAndPort = await getApplicationDetailsOfEndPointFromListApplicationsOfOKM(endPoint);
        let controlConstructOfEndPointApplication = await getControlContruct(endPointApplicationAddressAndPort);
        let operationKey = await getOperationKeyFromOperationUuid(controlConstructOfEndPointApplication,
            endPoint["operation-uuid"]);
        endPoint["actual-operation-key"] = operationKey;
        if (endPoint["ltp-direction"] === "core-model-1-4:TERMINATION_DIRECTION_SOURCE") {
            endPointsOfLinkUuidWithOperationKey[0] = endPoint;
        } else {
            endPointsOfLinkUuidWithOperationKey[i] = endPoint;
            i++;
        }
    }
    return endPointsOfLinkUuidWithOperationKey;
}

async function writeToExcelFile(listOfLinkUuidsWithEndPointDetails, sheetName, fileName){
    console.log((listOfLinkUuidsWithEndPointDetails.flat()).length)
    let allLinkDetailsWorksheet = xlsx.utils.json_to_sheet(listOfLinkUuidsWithEndPointDetails.flat());
    xlsx.utils.book_append_sheet(outputBook, allLinkDetailsWorksheet, sheetName);
    await xlsx.writeFile(outputBook, fileName)
}

async function putOperationMode(operationMode) {
    let authorizationCode = inputFile['authorizationCode']
    console.log(inputFile['operationKeyManagementApplicationDetails']);
    let addressAndPortOfOKM = inputFile['operationKeyManagementApplicationDetails']['address'] + ":"
        + inputFile['operationKeyManagementApplicationDetails']['port'];
    let operationName = "/core-model-1-4:control-construct/profile-collection/profile=okm-2-1-2-string-p-000/string-profile-1-0:string-profile-pac/string-profile-configuration/string-value"
    let method = "PUT";
    let requestBody = {
        "string-profile-1-0:string-value": "string-profile-1-0:STRING_VALUE_TYPE_" + operationMode
    }
    let requestHeader = {
        "authorization": authorizationCode
    }
    let url = protocol + "://" + addressAndPortOfOKM + operationName;
    let request = {
        method: method,
        url: url,
        data: requestBody,
        headers: requestHeader
    }
    let response = await triggerRestRequest(request);
    if (response && response.toString().startsWith("2")) {
        console.log(`putOperationMode is successful for OperationMode ${operationMode}`)
    }
}

exports.getTimeIntervalForCyclicUpdationOfOperationKey = async function () {
    let authorizationCode = inputFile['authorizationCode']
    console.log(inputFile['operationKeyManagementApplicationDetails']);
    let addressAndPortOfOKM = inputFile['operationKeyManagementApplicationDetails']['address'] + ":"
        + inputFile['operationKeyManagementApplicationDetails']['port'];
    let operationName = "/core-model-1-4:control-construct/profile-collection/profile=okm-2-1-2-integer-p-000/integer-profile-1-0:integer-profile-pac/integer-profile-configuration/integer-value"
    let method = "GET";
    let requestHeader = {
        "authorization": authorizationCode
    }
    let url = protocol + "://" + addressAndPortOfOKM + operationName;
    let request = {
        method: method,
        url: url,
        data: {},
        headers: requestHeader
    }
    let response = await triggerRestRequest(request, true);
    if (response && response["integer-profile-1-0:integer-value"]) {
        console.log("GetTimeInterval is successful")
        response = response["integer-profile-1-0:integer-value"];
    }
    return response;
}

async function getlistOfLinkUuidsFromALT(operationKeyOfListLinkUuids) {
    let addressAndPortOfALT = inputFile['applicationLayerTopologyApplicationDetails']['address'] + ":" +
        inputFile['applicationLayerTopologyApplicationDetails']['port'];
    let operationName = "/v1/list-link-uuids"
    let method = "POST";
    let requestHeader = {
        "operation-key": operationKeyOfListLinkUuids,
        "user": "OKMTestScript",
        "originator": "OKMTestScript",
        "x-correlator": "550e8400-e29b-11d4-a716-446655440000",
        "trace-indicator": "1.3.1",
        "customer-journey": "OKMTestScript"
    }
    let url = protocol + "://" + addressAndPortOfALT + operationName;
    let request = {
        method: method,
        url: url,
        data: {},
        headers: requestHeader
    }
    let response = await triggerRestRequest(request, true);
    return response;
}

async function getListEndPointsOfLink(operationKeyOfListEndPointsOfLink, linkUuid) {
    let addressAndPortOfALT = inputFile['applicationLayerTopologyApplicationDetails']['address'] + ":" +
        inputFile['applicationLayerTopologyApplicationDetails']['port'];
    let operationName = "/v1/list-end-points-of-link"
    let method = "POST";
    let requestHeader = {
        "operation-key": operationKeyOfListEndPointsOfLink,
        "user": "OKMTestScript",
        "originator": "OKMTestScript",
        "x-correlator": "550e8400-e29b-11d4-a716-446655440000",
        "trace-indicator": "1.3.1",
        "customer-journey": "OKMTestScript"
    }
    let requestBody = {
        "link-uuid": linkUuid
    }
    let url = protocol + "://" + addressAndPortOfALT + operationName;
    let request = {
        method: method,
        url: url,
        data: requestBody,
        headers: requestHeader
    }
    let response = await triggerRestRequest(request, true);
    return response;
}

async function getApplicationDetailsOfEndPointFromListApplicationsOfOKM(endPoint) {
    let endPointApplicationAddressAndPort = {};
    let endPointApplicationName = endPoint["application-name"];
    let endPointReleaseNumber = endPoint["release-number"];
    let addressAndPortOfOKM = inputFile["operationKeyManagementApplicationDetails"]['address'] + ":"
        + inputFile["operationKeyManagementApplicationDetails"]['port'];
    let operationName = "/v1/list-applications"
    let method = "POST";
    let requestHeader = {
        "operation-key": "Operation key not yet provided.",
        "user": "OKMTestScript",
        "originator": "OKMTestScript",
        "x-correlator": "550e8400-e29b-11d4-a716-446655440000",
        "trace-indicator": "1.3.1",
        "customer-journey": "OKMTestScript"
    }
    let url = protocol + "://" + addressAndPortOfOKM + operationName;
    let request = {
        method: method,
        url: url,
        data: {},
        headers: requestHeader
    }
    let applicationsList = await triggerRestRequest(request, true);
    for (let application of applicationsList) {
        if (application["application-name"] === endPointApplicationName
            && application["release-number"] === endPointReleaseNumber
        ) {
            endPointApplicationAddressAndPort = {
                address: application["address"]["ip-address"]["ipv-4-address"],
                port: application["port"]
            }
            return endPointApplicationAddressAndPort;
        }
    }

}

async function getControlContruct(applicationDetails) {

    let authorizationCode = inputFile['authorizationCode'];
    let addressAndPort = applicationDetails["address"] + ":" + applicationDetails["port"];
    let operationName = "/core-model-1-4:control-construct";
    let method = "GET";
    let requestBody = {};
    let requestHeader = {
        "authorization": authorizationCode
    };
    let url = protocol + "://" + addressAndPort + operationName;
    let request = {
        method: method,
        url: url,
        data: requestBody,
        headers: requestHeader
    };
    let controlConstruct = await triggerRestRequest(request, true);
    return controlConstruct;

}

async function getOperationKeyFromOperationName(operationName, controlConstruct) {
    let operationKey = "";
    if (controlConstruct) {
        let logicalTerminationPointList = controlConstruct["core-model-1-4:control-construct"]["logical-termination-point"];
        for (let ltp of logicalTerminationPointList) {
            if (ltp["layer-protocol"][0]["layer-protocol-name"] ===
                "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER") {
                if (ltp["layer-protocol"][0]
                ["operation-server-interface-1-0:operation-server-interface-pac"]
                ["operation-server-interface-capability"]["operation-name"] ===
                    operationName) {
                    return ltp["layer-protocol"][0]
                    ["operation-server-interface-1-0:operation-server-interface-pac"]
                    ["operation-server-interface-configuration"]
                    ["operation-key"];
                }
            }
        }
        return operationKey;
    }
}

async function getOperationKeyFromOperationUuid(controlConstruct, operationUuid) {
    let operationKey = "";
    if (controlConstruct) {
        let logicalTerminationPointList = controlConstruct["core-model-1-4:control-construct"]["logical-termination-point"];
        let logicalTerminationPoint = logicalTerminationPointList.find(
            ltp => ltp["uuid"] === operationUuid);
        if (logicalTerminationPoint["layer-protocol"][0]["layer-protocol-name"] ===
            "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER") {
            operationKey = logicalTerminationPoint
            ["layer-protocol"][0]["operation-server-interface-1-0:operation-server-interface-pac"]
            ["operation-server-interface-configuration"]["operation-key"];
        } else {
            operationKey = logicalTerminationPoint
            ["layer-protocol"][0]["operation-client-interface-1-0:operation-client-interface-pac"]
            ["operation-client-interface-configuration"]["operation-key"];
        }
    }
    return operationKey;
}

async function triggerRestRequest(request, isResponseRequired) {
    try {

        let response = await axios(request);
        if (response.status.toString().startsWith(2)) {
            if (isResponseRequired) {
                return response.data;
            } else {
                return response.status;
            }
        }
        return;
    } catch (error) {
        if (error.response != undefined) {
            return;
        } else {
            return;
        }
    }
}