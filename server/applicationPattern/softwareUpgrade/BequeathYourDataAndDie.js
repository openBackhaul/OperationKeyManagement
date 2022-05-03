/**
 * @file This module provides functionality to migrate the data from the current version to the next version. 
 * This file should be modified accourding to the individual service forwarding requirements 
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       07.12.2021
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG
 * @module SoftwareUpgrade
 **/

const forwardingConstruct = require('../onfModel/models/ForwardingConstruct');
const operationClientInterface = require('../onfModel/models/layerprotocols/OperationClientInterface');
const logicalTerminationPoint = require('../onfModel/models/logicalTerminationPoint');
const httpServerInterface = require('../onfModel/models/layerprotocols/HttpServerInterface');
const httpClientInterface = require('../onfModel/models/layerprotocols/HttpClientInterface');
const tcpClientInterface = require('../onfModel/models/layerprotocols/TcpClientInterface');
const forwardingConstructService = require('../onfModel/services/ForwardingConstructService');
const profile = require("../onfModel/models/Profile");
const applicationProfile = require('../onfModel/models/profile/ApplicationProfile');


/**
 * This method performs the set of procedure to transfer the data from this version to next version of the application<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br>
 * The following are the list of forwarding-construct that will be automated to transfer the data from this current release to next release
 * 1. PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals
 * 2. PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals
 * 3. PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR
 * 4. PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications
 * 5. PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease
 * 6. PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement
 * 7. PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease
 */
exports.upgradeSoftwareVersion = async function (user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            await promptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesSubscriptionForDeregistrationNotifications(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesEndingSubscriptionsToOldRelease(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(user, xCorrelator, traceIndicator, customerJourney);
            await promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(user, xCorrelator, traceIndicator, customerJourney);
            resolve();
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. Get all applications that are subscribed for deregistration by using the fc-name "RegisteringCausesInfoAboutApprovalStatusToRegistryOffice"
 * 2. Collect the subscriber-application,subscriber-release-number,subscriber-operation,subscriber-address,subscriber-address information to formulate the request body
 * 3. push the collected attribute for each registered application and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let attributeList = [];
            let forwardingKindName = "PromptForBequeathingDataCausesNewTARbeingRequestedToRedirectInfoAboutApprovals";
            let infoAboutApprovalStatusFCName = "RegisteringCausesInfoAboutApprovalStatusToRegistryOffice";
            operationClientUuidList = await forwardingConstruct.getFcPortOutputDirectionLogicalTerminationPointListForTheForwardingName(infoAboutApprovalStatusFCName);
            for (let i = 0; i < operationClientUuidList.length; i++) {
                let httpClientUuid = (await logicalTerminationPoint.getServerLtpList(operationClientUuidList[i]))[0];
                let applicationName = await httpClientInterface.getApplicationName(httpClientUuid);
                let releaseNumber = await httpClientInterface.getReleaseNumber(httpClientUuid);
                let infoAboutApprovalStatusOperation = await operationClientInterface.getOperationName(operationClientUuidList[i]);
                let tcpClientUuid = (await logicalTerminationPoint.getServerLtpList(httpClientUuid))[0];
                let tcpClientIpAddress = await tcpClientInterface.getRemoteAddress(tcpClientUuid);
                let tcpClientPort = await tcpClientInterface.getRemotePort(tcpClientUuid);
                let attributeListForOperation = [{
                        "name": "subscriber-application",
                        "value": applicationName
                    },
                    {
                        "name": "subscriber-release-number",
                        "value": releaseNumber
                    },
                    {
                        "name": "subscriber-operation",
                        "value": infoAboutApprovalStatusOperation
                    },
                    {
                        "name": "subscriber-address",
                        "value": tcpClientIpAddress
                    },
                    {
                        "name": "subscriber-port",
                        "value": tcpClientPort
                    }
                ];
                attributeList.push(attributeListForOperation);
            }
            let result = await forwardingConstructService.automateForwardingConstructForNIteration("Individual", forwardingKindName,
                attributeList, user, xCorrelator, traceIndicator, customerJourney);
            if (result == false) {
                throw result;
            }
            resolve(result);
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. Get the list of application profiles
 * 2. Collect the application-name, release-number, approval-status to formulate the request body
 * 3. push the collected attribute for each registered application and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let attributeList = [];
            let forwardingKindName = "PromptForBequeathingDataCausesTransferOfListOfAlreadyGrantedTypeApprovals";
            let applicationProfileList = await profile.getUuidListForTheProfileName(applicationProfile.profileNameEnum.APPLICATION_PROFILE);
            for (let i = 0; i < applicationProfileList.length; i++) {
                let uuid = applicationProfileList[i];
                let applicationName = await applicationProfile.getApplicationNameForTheUuid(uuid);
                let releaseNumber = await applicationProfile.getApplicationReleaseNumberForTheUuid(uuid);
                let approvalStatus = await applicationProfile.getApprovalStatusForTheUuid(uuid);
                let approvalStatusJsonObject = applicationProfile.ApplicationProfilePac.ApplicationProfileConfiguration.approvalStatusEnum;
                for (let approvalStatusKey in approvalStatusJsonObject) {
                    if (approvalStatusJsonObject[approvalStatusKey] == approvalStatus) {
                        approvalStatus = approvalStatusKey;
                    }
                }
                let attributeListForOperation = [{
                        "name": "application-name",
                        "value": applicationName
                    },
                    {
                        "name": "application-release-number",
                        "value": releaseNumber
                    },
                    {
                        "name": "approval-status",
                        "value": approvalStatus
                    }
                ];
                attributeList.push(attributeListForOperation);
            }
            let result = await forwardingConstructService.automateForwardingConstructForNIteration("Individual", forwardingKindName,
                attributeList, user, xCorrelator, traceIndicator, customerJourney);
            if (result == false) {
                throw result;
            }
            resolve(result);
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. create attribute list with the details of the new application-name, release-number, tcp-ip-address , tcp-port of new release
 *    and /v1/regard-application as subscription operation for now.(need to receive it from bequeath-your-data-and-die requestbody later) 
 * 2. push the collected attribute and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let attributeList = [];
            let forwardingKindName = "PromptForBequeathingDataCausesRObeingRequestedToInquireForApplicationTypeApprovalsAtNewTAR";
            let newReleaseApplicationName = await httpServerInterface.getApplicationName();
            let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidForTheApplicationName("NewRelease");
            let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpList(newReleaseHttpClientUuid))[0];
            let newReleaseReleaseNumber = await httpClientInterface.getReleaseNumber(newReleaseHttpClientUuid);
            let newReleaseTcpIpAddress = await tcpClientInterface.getRemoteAddress(newReleaseTcpClientUuid);
            let newReleasePortNumber = await tcpClientInterface.getRemotePort(newReleaseTcpClientUuid);
            let newReleaseRegardOperation = "/v1/regard-application";
            let attributeListForOperation = [{
                    "name": "approval-application",
                    "value": newReleaseApplicationName
                },
                {
                    "name": "approval-application-release-number",
                    "value": newReleaseReleaseNumber
                },
                {
                    "name": "approval-operation",
                    "value": newReleaseRegardOperation
                },
                {
                    "name": "approval-application-address",
                    "value": newReleaseTcpIpAddress
                },
                {
                    "name": "approval-application-port",
                    "value": newReleasePortNumber
                }
            ];
            attributeList.push(attributeListForOperation);
            let result = await forwardingConstructService.automateForwardingConstructForNIteration("Individual", forwardingKindName,
                attributeList, user, xCorrelator, traceIndicator, customerJourney);
            if (result == false) {
                throw result;
            }
            resolve(result);
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. create attribute list with the details of the new application-name, release-number, tcp-ip-address , tcp-port of new release
 *    and /v1/disregard-application as subscription operation for now.(need to receive it from bequeath-your-data-and-die requestbody later) 
 * 2. push the collected attribute and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesSubscriptionForDeregistrationNotifications(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let attributeList = [];
            let forwardingKindName = "PromptForBequeathingDataCausesSubscriptionForDeregistrationNotifications";
            let newReleaseApplicationName = await httpServerInterface.getApplicationName();
            let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidForTheApplicationName("NewRelease");
            let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpList(newReleaseHttpClientUuid))[0];
            let newReleaseReleaseNumber = await httpClientInterface.getReleaseNumber(newReleaseHttpClientUuid);
            let newReleaseTcpIpAddress = await tcpClientInterface.getRemoteAddress(newReleaseTcpClientUuid);
            let newReleasePortNumber = await tcpClientInterface.getRemotePort(newReleaseTcpClientUuid);
            let newReleaseDisregardOperation = "/v1/disregard-application";
            let attributeListForOperation = [{
                    "name": "subscriber-application",
                    "value": newReleaseApplicationName
                },
                {
                    "name": "subscriber-release-number",
                    "value": newReleaseReleaseNumber
                },
                {
                    "name": "subscriber-operation",
                    "value": newReleaseDisregardOperation
                },
                {
                    "name": "subscriber-address",
                    "value": newReleaseTcpIpAddress
                },
                {
                    "name": "subscriber-port",
                    "value": newReleasePortNumber
                }
            ];
            attributeList.push(attributeListForOperation);
            let result = await forwardingConstructService.automateForwardingConstructForNIteration("Individual", forwardingKindName,
                attributeList, user, xCorrelator, traceIndicator, customerJourney);
            if (result == false) {
                throw result;
            }
            resolve(result);
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate promptForBequeathingDataCausesEndingSubscriptionsToOldRelease<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. create attribute list with the details of current application name, release number, subscription operation name "/v1/notify-deregistrations"
 * 2. prepare attribute to end subscription for "notify-deregistration"  
 * 2. push the collected attribute and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesEndingSubscriptionsToOldRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let attributeList = [];
            let forwardingKindName = "PromptForBequeathingDataCausesEndingSubscriptionsToOldRelease";
            let applicationName = await httpServerInterface.getApplicationName();
            let releaseNumber = await httpServerInterface.getReleaseNumber();
            let inquireApplicationTypeApprovalOperation = await operationClientInterface.getOperationName("tar-0-0-1-op-c-3021");
            let attributeListForOperation = [{
                    "name": "subscriber-application",
                    "value": applicationName
                },
                {
                    "name": "subscriber-release-number",
                    "value": releaseNumber
                },
                {
                    "name": "subscription",
                    "value": inquireApplicationTypeApprovalOperation
                }
            ];
            attributeList.push(attributeListForOperation);
            let result = await forwardingConstructService.automateForwardingConstructForNIteration("Individual", forwardingKindName,
                attributeList, user, xCorrelator, traceIndicator, customerJourney);
            if (result == false) {
                throw result;
            }
            resolve(result);
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. create attribute list with the details of the new application-name, old-application-release-number, new-application-release-number , 
 *    new-application-address,new-application-port of new release
 * 2. push the collected attribute and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let attributeList = [];
            let forwardingKindName = "PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement";
            let newReleaseApplicationName = await httpServerInterface.getApplicationName();
            let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidForTheApplicationName("NewRelease");
            let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpList(newReleaseHttpClientUuid))[0];
            let newReleaseReleaseNumber = await httpClientInterface.getReleaseNumber(newReleaseHttpClientUuid);
            let oldReleaseReleaseNumber = await httpServerInterface.getReleaseNumber();
            let newReleaseTcpIpAddress = await tcpClientInterface.getRemoteAddress(newReleaseTcpClientUuid);
            let newReleasePortNumber = await tcpClientInterface.getRemotePort(newReleaseTcpClientUuid);
            let attributeListForOperation = [{
                    "name": "application-name",
                    "value": newReleaseApplicationName
                },
                {
                    "name": "old-application-release-number",
                    "value": oldReleaseReleaseNumber
                },
                {
                    "name": "new-application-release-number",
                    "value": newReleaseReleaseNumber
                },
                {
                    "name": "new-application-address",
                    "value": newReleaseTcpIpAddress
                },
                {
                    "name": "new-application-port",
                    "value": newReleasePortNumber
                }
            ];
            attributeList.push(attributeListForOperation);
            let result = await forwardingConstructService.automateForwardingConstructForNIteration("Individual", forwardingKindName,
                attributeList, user, xCorrelator, traceIndicator, customerJourney);
            if (result == false) {
                throw result;
            }
            resolve(result);
        } catch (error) {
            reject();
        }
    });
}

/**
 * Prepare attributes and automate PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease<br>
 * @param {String} user String User identifier from the system starting the service call
 * @param {String} xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator String Sequence of request numbers along the flow
 * @param {String} customerJourney String Holds information supporting customer’s journey to which the execution applies
 * @returns {boolean} return true if the operation is success or else return false<br> 
 * steps :
 * 1. create attribute list with the details of the new application-name, old-application-release-number, new-application-release-number , 
 *    new-application-address,new-application-port of new release
 * 2. push the collected attribute and send it to the method automateForwardingConstructForNIteration 
 *    to automate the forwarding.
 */
async function promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let attributeList = [];
            let forwardingKindName = "PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease";
            let oldReleaseApplicationName = await httpServerInterface.getApplicationName();
            let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidForTheApplicationName("NewRelease");
            let newReleaseReleaseNumber = await httpClientInterface.getReleaseNumber(newReleaseHttpClientUuid);
            let oldReleaseReleaseNumber = await httpServerInterface.getReleaseNumber();
            if (oldReleaseReleaseNumber != newReleaseReleaseNumber) {
                let attributeListForOperation = [{
                        "name": "application-name",
                        "value": oldReleaseApplicationName
                    },
                    {
                        "name": "application-release-number",
                        "value": oldReleaseReleaseNumber
                    }
                ];
                attributeList.push(attributeListForOperation);
                result = await forwardingConstructService.automateForwardingConstructForNIteration("Individual", forwardingKindName,
                    attributeList, user, xCorrelator, traceIndicator, customerJourney);
                if (result == false) {
                    throw result;
                }
            }
            resolve(result);
        } catch (error) {
            reject();
        }
    });
}