const forwardingConstructConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/ConfigurationInput');
const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const forwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');

exports.registerApplication = function (operationClientConfigurationStatusList, embeddingOperation) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientConfigurationStatusList.length; i++) {
                let configurationStatus = operationClientConfigurationStatusList[i];
                let operationClientUuid = configurationStatus.uuid;
                let operationClientName = await operationClientInterface.
                getOperationNameAsync(operationClientUuid);
                let forwardingConfigurationInput;
                let forwardingName;
                if (operationClientName == embeddingOperation) {
                    forwardingName =
                        "TypeApprovalCausesRequestForEmbedding";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                    forwardingConfigurationInputList.push(
                        forwardingConfigurationInput
                    );
                }
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.deregisterApplication = function (operationClientConfigurationStatusList) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientConfigurationStatusList.length; i++) {

                let configurationStatus = operationClientConfigurationStatusList[i];
                let operationClientUuid = configurationStatus.uuid;

                let forwardingConstructList = await forwardingDomain.getForwardingConstructListForTheFcPortAsync(
                    operationClientUuid,
                    FcPort.portDirectionEnum.OUTPUT);

                for (let j = 0; j < forwardingConstructList.length; j++) {
                    let fcNameList = forwardingConstructList[j]["name"];
                    let forwardingName = getValueFromKey(fcNameList, "ForwardingName");
                    let forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                    forwardingConfigurationInputList.push(
                        forwardingConfigurationInput
                    );
                }                
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.updateApprovalStatus = function (operationClientList, updateClientOperationName, updateOperationClientOperationName) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientList.length; i++) {
                let operationClientUuid = operationClientList[i];
                let operationClientName = await operationClientInterface.
                getOperationNameAsync(operationClientUuid);
                let forwardingConfigurationInput;
                let forwardingName;
                if (operationClientName == updateClientOperationName) {
                    forwardingName =
                        "ServerReplacementBroadcast";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                    forwardingConfigurationInputList.push(
                        forwardingConfigurationInput
                    );
                } else if (operationClientName == updateOperationClientOperationName) {
                    forwardingName =
                        "OperationUpdateBroadcast";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                    forwardingConfigurationInputList.push(
                        forwardingConfigurationInput
                    );
                }
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.notifyWithdrawnApprovals = function (operationClientConfigurationStatusList, subscriberOperation) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientConfigurationStatusList.length; i++) {
                let configurationStatus = operationClientConfigurationStatusList[i];
                let operationClientUuid = configurationStatus.uuid;
                let operationClientName = await operationClientInterface.
                getOperationNameAsync(operationClientUuid);
                let forwardingConfigurationInput;
                let forwardingName;
                if (operationClientName == subscriberOperation) {
                    forwardingName =
                        "WithdrawnApprovalNotification";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                }
                forwardingConfigurationInputList.push(
                    forwardingConfigurationInput
                );
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.notifyDeregistrations = function (operationClientConfigurationStatusList, subscriberOperation) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientConfigurationStatusList.length; i++) {
                let configurationStatus = operationClientConfigurationStatusList[i];
                let operationClientUuid = configurationStatus.uuid;
                let operationClientName = await operationClientInterface.
                getOperationNameAsync(operationClientUuid);
                let forwardingConfigurationInput;
                let forwardingName;
                if (operationClientName == subscriberOperation) {
                    forwardingName =
                        "DeregistrationNotification";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                }
                forwardingConfigurationInputList.push(
                    forwardingConfigurationInput
                );
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.notifyApprovals = function (operationClientConfigurationStatusList, subscriberOperation) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientConfigurationStatusList.length; i++) {
                let configurationStatus = operationClientConfigurationStatusList[i];
                let operationClientUuid = configurationStatus.uuid;
                let operationClientName = await operationClientInterface.
                getOperationNameAsync(operationClientUuid);
                let forwardingConfigurationInput;
                let forwardingName;
                if (operationClientName == subscriberOperation) {
                    forwardingName =
                        "ApprovalNotification";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                }
                forwardingConfigurationInputList.push(
                    forwardingConfigurationInput
                );
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}

exports.inquireApplicationTypeApprovals = function (operationClientConfigurationStatusList, subscriberOperation) {
    return new Promise(async function (resolve, reject) {
        let forwardingConfigurationInputList = [];
        try {
            for (let i = 0; i < operationClientConfigurationStatusList.length; i++) {
                let configurationStatus = operationClientConfigurationStatusList[i];
                let operationClientUuid = configurationStatus.uuid;
                let operationClientName = await operationClientInterface.
                getOperationNameAsync(operationClientUuid);
                let forwardingConfigurationInput;
                let forwardingName;
                if (operationClientName == subscriberOperation) {
                    forwardingName =
                        "RegistrationCausesInquiryForApplicationTypeApproval";
                    forwardingConfigurationInput = new forwardingConstructConfigurationInput(
                        forwardingName,
                        operationClientUuid
                    );
                }
                forwardingConfigurationInputList.push(
                    forwardingConfigurationInput
                );
            }
            resolve(forwardingConfigurationInputList);
        } catch (error) {
            reject(error);
        }
    });
}


/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} operationServerUuid operation server uuid of the request url
 * @param {list}   attributeList list of attributes required during forwarding construct automation(to send in the request body)
 * @param {String} user user who initiates this request
 * @param {string} originator originator of the request
 * @param {string} xCorrelator flow id of this request
 * @param {string} traceIndicator trace indicator of the request
 * @param {string} customerJourney customer journey of the request
 **/
function getValueFromKey(nameList, key) {
    for (let i = 0; i < nameList.length; i++) {
        let valueName = nameList[i]["value-name"];
        if (valueName == key) {
            return nameList[i]["value"];
        }
    }
    return undefined;
}