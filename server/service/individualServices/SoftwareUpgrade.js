/**
 * @file This module provides functionality to migrate the data from the current version to the next version. 
 * @module SoftwareUpgrade
 **/

 const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
 const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
 const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
 const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
 const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
 const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
 const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
 const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
 const OperationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
 const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
 const OperationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
 const eventDispatcher = require('onf-core-model-ap/applicationPattern/rest/client/eventDispatcher');

 /**
  * This method performs the set of procedure to transfer the data from this version to next version 
  * of the application and bring the new release official
  * @param {boolean} isdataTransferRequired represents true if data transfer is required
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * **/
 exports.upgradeSoftwareVersion = async function (isdataTransferRequired, user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             if (isdataTransferRequired) {
                 await transferDataToTheNewRelease(user, xCorrelator, traceIndicator, customerJourney);
             }
             await redirectNotificationNewRelease(user, xCorrelator, traceIndicator, customerJourney);
             await replaceOldReleaseWithNewRelease(user, xCorrelator, traceIndicator, customerJourney);
             resolve();
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * This method performs the data transfer from the current instance to the new instance
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * The following are the list of forwarding-construct that will be automated to transfer the data from this current release to next release
  * 1. PromptForBequeathingDataCausesTransferOfListOfApplications
  * 2. PromptForBequeathingDataCausesTransferOfListOfRecords
  */
 async function transferDataToTheNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             await PromptForBequeathingDataCausesTransferOfListOfApplications(user, xCorrelator, traceIndicator, customerJourney);
             resolve();
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * This method performs the set of procedure to redirect the notification to the new release
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * The following are the list of forwarding-construct that will be automated to redirect the notification 
  * to the new release and to end the existing subscription
  * 1. PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease
  * 2. PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease
  * 3. PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease
  */
 async function redirectNotificationNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             await PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease(user, xCorrelator, traceIndicator, customerJourney);
             await PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease(user, xCorrelator, traceIndicator, customerJourney);
             await PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease(user, xCorrelator, traceIndicator, customerJourney)
             await PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease(user, xCorrelator, traceIndicator, customerJourney);
             await PromptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease(user, xCorrelator, traceIndicator, customerJourney)
             resolve();
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * This method performs the set of procedure to replace the old release with the new release
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * The following are the list of forwarding-construct that will be automated to replace the old release with the new release
  * 1. PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement
  * 2. PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease
  */
 async function replaceOldReleaseWithNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             await promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(user, xCorrelator, traceIndicator, customerJourney);
             await promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(user, xCorrelator, traceIndicator, customerJourney);
             resolve();
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * Prepare attributes and automate PromptForBequeathingDataCausesTransferOfListOfApplications
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
  */
 async function PromptForBequeathingDataCausesTransferOfListOfApplications(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             let result = true;
             let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesTransferOfListOfApplications";
 
             /***********************************************************************************
              * Preparing requestBody and transfering the data one by one
              ************************************************************************************/
 
             let requestForOamRequestInformationFCName = "CyclicOperationCausesOperationKeyUpdates";
             let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(requestForOamRequestInformationFCName);
             let operationClientUuidList = getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance);
 
             for (let i = 0; i < operationClientUuidList.length; i++) {
                 try {
                     let operationClientUuid = operationClientUuidList[i];
                     let httpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid))[0];
                     let tcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid))[0];
 
                     let applicationName = await httpClientInterface.getApplicationNameAsync(httpClientUuid);
                     let releaseNumber = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
                     let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuid);
                     let applicationPort = await tcpClientInterface.getRemotePortAsync(tcpClientUuid);
                     /***********************************************************************************
                      * PromptForBequeathingDataCausesTransferOfListOfApplications
                      *   /v1/regard-application
                      ************************************************************************************/
                     let requestBody = {};
                     requestBody.applicationName = applicationName;
                     requestBody.applicationReleaseNumber = releaseNumber;
                     requestBody.applicationAddress = applicationAddress;
                     requestBody.applicationPort = applicationPort;
                     requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                     result = await forwardRequest(
                         forwardingKindNameOfTheBequeathOperation,
                         requestBody,
                         user,
                         xCorrelator,
                         traceIndicator,
                         customerJourney
                     );
                     if (!result) {
                         throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                     }
 
                 } catch (error) {
                     console.log(error);
                     throw "operation is not success";
                 }
             }
             resolve(result);
         } catch (error) {
             reject(error);
         }
     });
 }
 

 /**
  * Prepare attributes and automate PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
  */
 async function PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             let result = true;
             let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease";
 
             /***********************************************************************************
              * Preparing requestBody 
              ************************************************************************************/
             try {
 
                 let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidAsync("NewRelease");
                 let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientUuid))[0];
 
                 let applicationName = await httpServerInterface.getApplicationNameAsync();
                 let releaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientUuid);
                 let regardApplicationOperation = await OperationServerInterface.getOperationNameAsync("okm-0-0-1-op-s-3001");
                 let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                 let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
 
                 /***********************************************************************************
                  * PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease
                  *   /v1/inquire-application-type-approvals
                  ************************************************************************************/
                 let requestBody = {};
                 requestBody.subscriberApplication = applicationName;
                 requestBody.subscriberReleaseNumber = releaseNumber;
                 requestBody.subscriberOperation = regardApplicationOperation;
                 requestBody.subscriberAddress = applicationAddress;
                 requestBody.subscriberPort = applicationPort;
                 requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                 result = await forwardRequest(
                     forwardingKindNameOfTheBequeathOperation,
                     requestBody,
                     user,
                     xCorrelator,
                     traceIndicator,
                     customerJourney
                 );
                 if (!result) {
                     throw forwardingKindNameOfTheBequeathOperation + " forwarding is not success for the input" + requestBody;
                 }
 
             } catch (error) {
                 console.log(error);
                 throw "operation is not success";
             }
 
             resolve(result);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * Prepare attributes and automate PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease<br>
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
  */
 async function PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             let result = true;
             let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease";
 
             /***********************************************************************************
              * Preparing requestBody 
              ************************************************************************************/
             try {
 
                 let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidAsync("NewRelease");
                 let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientUuid))[0];
 
                 let applicationName = await httpServerInterface.getApplicationNameAsync();
                 let releaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientUuid);
                 let disregardApplicationOperation = await OperationServerInterface.getOperationNameAsync("okm-0-0-1-op-s-3002");
                 let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                 let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
 
                 /***********************************************************************************
                  * PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease
                  *   /v1/withdrawn-approval-notification
                  ************************************************************************************/
                 let requestBody = {};
                 requestBody.subscriberApplication = applicationName;
                 requestBody.subscriberReleaseNumber = releaseNumber;
                 requestBody.subscriberOperation = disregardApplicationOperation;
                 requestBody.subscriberAddress = applicationAddress;
                 requestBody.subscriberPort = applicationPort;
                 requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                 result = await forwardRequest(
                     forwardingKindNameOfTheBequeathOperation,
                     requestBody,
                     user,
                     xCorrelator,
                     traceIndicator,
                     customerJourney
                 );
                 if (!result) {
                     throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                 }
 
             } catch (error) {
                 console.log(error);
                 throw "operation is not success";
             }
 
             resolve(result);
         } catch (error) {
             reject(error);
         }
     });
 }

 /**
  * Prepare attributes and automate promptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease<br>
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
*/
async function PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease(user, xCorrelator, traceIndicator, customerJourney, operationServerName) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease";

            /***********************************************************************************
                * Preparing requestBody 
            ************************************************************************************/
            try{
                let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidAsync("NewRelease");
                let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientUuid))[0];
 
                let applicationName = await httpServerInterface.getApplicationNameAsync();
                let releaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientUuid);
                let operationName = await OperationServerInterface.getOperationNameAsync("okm-0-0-1-op-s-3004");
                let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
                
                /***********************************************************************************
                  * PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease
                  * /v1/notify-link-updates
                ************************************************************************************/
                let requestBody = {};
                requestBody.subscriberApplication = applicationName;
                requestBody.subscriberReleaseNumber = releaseNumber;
                requestBody.subscriberOperation = operationName;
                requestBody.subscriberAddress = applicationAddress;
                requestBody.subscriberPort = applicationPort;
                requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                result = await forwardRequest(
                      forwardingKindNameOfTheBequeathOperation,
                      requestBody,
                      user,
                      xCorrelator,
                      traceIndicator,
                      customerJourney
                );
                if (!result) {
                    throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                }
  
            } catch (error) {
                  console.log(error);
                  throw "operation is not success";
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
  }
 
 /**
  * Prepare attributes and automate PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
  */
 async function PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             let result = true;
             let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease";
 
             let listOfOperationToBeUnsubscribed = [];
             let approvalOperationName = await operationClientInterface.getOperationNameAsync("okm-0-0-1-op-c-3020");
             let deregistrationOperationName = await operationClientInterface.getOperationNameAsync("okm-0-0-1-op-c-3021");
             listOfOperationToBeUnsubscribed.push(approvalOperationName);
             listOfOperationToBeUnsubscribed.push(deregistrationOperationName);
             /***********************************************************************************
              * Preparing requestBody 
              ************************************************************************************/
             try {
                 for (let i = 0; i < listOfOperationToBeUnsubscribed.length; i++) {
 
                     let applicationName = await httpServerInterface.getApplicationNameAsync();
                     let releaseNumber = await httpServerInterface.getReleaseNumberAsync();
                     let subscriptionName = listOfOperationToBeUnsubscribed[i];
 
                     /***********************************************************************************
                      * PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease
                      *   /v1/end-subscription
                      ************************************************************************************/
                     let requestBody = {};
                     requestBody.subscriberApplication = applicationName;
                     requestBody.subscriberReleaseNumber = releaseNumber;
                     requestBody.subscription = subscriptionName;
                     requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                     result = await forwardRequest(
                         forwardingKindNameOfTheBequeathOperation,
                         requestBody,
                         user,
                         xCorrelator,
                         traceIndicator,
                         customerJourney
                     );
                     if (!result) {
                         throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                     }
                 }
 
             } catch (error) {
                 console.log(error);
                 throw "operation is not success";
             }
 
             resolve(result);
         } catch (error) {
             reject(error);
         }
     });
 }

 /**
  * Prepare attributes and automate PromptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
  */
async function PromptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease(user, xCorrelator, traceIndicator, customerJourney) {
    return new Promise(async function (resolve, reject) {
        try {
            let result = true;
            let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease";
            
            /***********************************************************************************
             * Preparing requestBody 
             ************************************************************************************/
            try {
                    let applicationName = await httpServerInterface.getApplicationNameAsync();
                    let releaseNumber = await httpServerInterface.getReleaseNumberAsync();
                    let subscriptionName = await OperationClientInterface.getOperationNameAsync("okm-0-0-1-op-c-3070");

                    /***********************************************************************************
                     * PromptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease
                     *   /v1/end-subscription
                     ************************************************************************************/
                    let requestBody = {};
                    requestBody.subscriberApplication = applicationName;
                    requestBody.subscriberReleaseNumber = releaseNumber;
                    requestBody.subscription = subscriptionName;
                    requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                    result = await forwardRequest(
                        forwardingKindNameOfTheBequeathOperation,
                        requestBody,
                        user,
                        xCorrelator,
                        traceIndicator,
                        customerJourney
                    );
                    if (!result) {
                        throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                    }

            } catch (error) {
                console.log(error);
                throw "operation is not success";
            }

            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}
 
 /**
  * Prepare attributes and automate PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement<br>
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
  */
 async function promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             let result = true;
             let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement";
 
             /***********************************************************************************
              * Preparing requestBody 
              ************************************************************************************/
             try {
 
                 let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidAsync("NewRelease");
                 let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientUuid))[0];
 
                 let applicationName = await httpServerInterface.getApplicationNameAsync();
                 let oldReleaseNumber = await httpServerInterface.getReleaseNumberAsync();
                 let newReleaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientUuid);
                 let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
                 let applicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
 
                 /***********************************************************************************
                  * PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement
                  *   /v1/relay-server-replacement
                  ************************************************************************************/
                 let requestBody = {};
                 requestBody.applicationName = applicationName;
                 requestBody.oldApplicationReleaseNumber = oldReleaseNumber;
                 requestBody.newApplicationReleaseNumber = newReleaseNumber;
                 requestBody.newApplicationAddress = applicationAddress;
                 requestBody.newApplicationPort = applicationPort;
                 requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                 result = await forwardRequest(
                     forwardingKindNameOfTheBequeathOperation,
                     requestBody,
                     user,
                     xCorrelator,
                     traceIndicator,
                     customerJourney
                 );
                 if (!result) {
                     throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                 }
 
             } catch (error) {
                 console.log(error);
                 throw "operation is not success";
             }
 
             resolve(result);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 /**
  * Prepare attributes and automate PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease<br>
  * @param {String} user User identifier from the system starting the service call
  * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
  * @param {String} traceIndicator Sequence of request numbers along the flow
  * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
  * @returns {boolean} return true if the operation is success or else return false
  */
 async function promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             let result = true;
             let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease";
 
             /***********************************************************************************
              * Preparing requestBody 
              ************************************************************************************/
             try {
                 let newReleaseHttpClientUuid = await httpClientInterface.getHttpClientUuidAsync("NewRelease");
                 let oldApplicationName = await httpServerInterface.getApplicationNameAsync();
                 let oldReleaseNumber = await httpServerInterface.getReleaseNumberAsync();
                 let newReleaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientUuid);
                 if (oldReleaseNumber != newReleaseNumber) {
                     /***********************************************************************************
                      * PromptForBequeathingDataCausesRequestForDeregisteringOfOldRelease
                      *   /v1/deregister-application
                      ************************************************************************************/
                     let requestBody = {};
                     requestBody.applicationName = oldApplicationName;
                     requestBody.applicationReleaseNumber = oldReleaseNumber;
                     requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
                     result = await forwardRequest(
                         forwardingKindNameOfTheBequeathOperation,
                         requestBody,
                         user,
                         xCorrelator,
                         traceIndicator,
                         customerJourney
                     );
                     if (!result) {
                         throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + requestBody;
                     }
                 }
             } catch (error) {
                 console.log(error);
                 throw "operation is not success";
             }
 
             resolve(result);
         } catch (error) {
             reject(error);
         }
     });
 }
 
 
 /****************************************************************************************
  * Functions utilized by individual services
  ****************************************************************************************/
 function getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance) {
     try {
         let fcPortOutputLogicalTerminationPointList = [];
         let fcPortList = forwardingConstructInstance[
             onfAttributes.FORWARDING_CONSTRUCT.FC_PORT];
         for (let i = 0; i < fcPortList.length; i++) {
             let fcPort = fcPortList[i];
             let fcPortPortDirection = fcPort[onfAttributes.FC_PORT.PORT_DIRECTION];
             if (fcPortPortDirection == FcPort.portDirectionEnum.OUTPUT) {
                 let fclogicalTerminationPoint = fcPort[onfAttributes.FC_PORT.LOGICAL_TERMINATION_POINT];
                 fcPortOutputLogicalTerminationPointList.push(fclogicalTerminationPoint);
             }
         }
         return fcPortOutputLogicalTerminationPointList;
     } catch (error) {
         throw error;
     }
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
 function forwardRequest(forwardingKindName, attributeList, user, xCorrelator, traceIndicator, customerJourney) {
     return new Promise(async function (resolve, reject) {
         try {
             let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingKindName);
             let operationClientUuid = (getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance))[0];
             let operationKey = await OperationClientInterface.getOperationKeyAsync(
                 operationClientUuid);
             let operationName = await OperationClientInterface.getOperationNameAsync(
                 operationClientUuid);
             let remoteIpAndPort = await OperationClientInterface.getTcpIpAddressAndPortAsyncAsync(
                 operationClientUuid);
             let result = await eventDispatcher.dispatchEvent(
                 remoteIpAndPort,
                 operationName,
                 operationKey,
                 attributeList,
                 user,
                 xCorrelator,
                 traceIndicator,
                 customerJourney
             );
             resolve(result);
         } catch (error) {
             reject(error);
         }
     });
 }