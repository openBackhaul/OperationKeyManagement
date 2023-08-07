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
const onfModelUtils = require("../../utils/OnfModelUtils");
var traceIncrementer = 1;

/**
 * This method performs the set of procedure to transfer the data from this version to next version 
 * of the application and bring the new release official
 * @param {String} user User identifier from the system starting the service call
 * @param {String} xCorrelator UUID for the service execution flow that allows to correlate requests and responses
 * @param {String} traceIndicator Sequence of request numbers along the flow
 * @param {String} customerJourney Holds information supporting customer’s journey to which the execution applies
   @returns {Promise} Promise is resolved if the operation succeeded else the Promise is rejected 
* **/
exports.upgradeSoftwareVersion = async function (user, xCorrelator, traceIndicator, customerJourney, _traceIncrementer) {
  if (_traceIncrementer !== 0) {
    traceIncrementer = _traceIncrementer;
  }
  await PromptForBequeathingDataCausesTransferOfListOfApplications(user, xCorrelator, traceIndicator, customerJourney);
  await redirectNotificationNewRelease(user, xCorrelator, traceIndicator, customerJourney);
  await replaceOldReleaseWithNewRelease(user, xCorrelator, traceIndicator, customerJourney);
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
 * 3. PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease
 * 4. PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease
 * 5. PromptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease
 */
async function redirectNotificationNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
  await PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease(user, xCorrelator, traceIndicator, customerJourney);
  await PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease(user, xCorrelator, traceIndicator, customerJourney);
  await PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease(user, xCorrelator, traceIndicator, customerJourney)
  await PromptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease(user, xCorrelator, traceIndicator, customerJourney);
  await PromptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease(user, xCorrelator, traceIndicator, customerJourney)
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
  await promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(user, xCorrelator, traceIndicator, customerJourney);
  await promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(user, xCorrelator, traceIndicator, customerJourney);
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

      let forwardingConstructName = "CyclicOperationCausesOperationKeyUpdates";
      let forwardingConstructInstance = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(forwardingConstructName);
      let operationClientUuidList = getFcPortOutputLogicalTerminationPointList(forwardingConstructInstance);

      for (let i = 0; i < operationClientUuidList.length; i++) {
        try {
          let operationClientUuid = operationClientUuidList[i];
          let httpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid))[0];
          let tcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid))[0];

          let applicationName = await httpClientInterface.getApplicationNameAsync(httpClientUuid);
          let releaseNumber = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
          let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(tcpClientUuid);
          let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(tcpClientUuid);
          let applicationPort = await tcpClientInterface.getRemotePortAsync(tcpClientUuid);
          /***********************************************************************************
           * PromptForBequeathingDataCausesTransferOfListOfApplications
           *   /v1/regard-application
           ************************************************************************************/
          let requestBody = {};
          requestBody.applicationName = applicationName;
          requestBody.releaseNumber = releaseNumber;
          requestBody.protocol = applicationProtocol;
          requestBody.address = applicationAddress;
          requestBody.port = applicationPort;
          requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
          result = await forwardRequest(
            forwardingKindNameOfTheBequeathOperation,
            requestBody,
            user,
            xCorrelator,
            traceIndicator + "." + traceIncrementer++,
            customerJourney
          );
          if (!result) {
            throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + JSON.stringify(requestBody);
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

        let uuid = await getHttpClientAndTcpClientUuid();

        let applicationName = await httpClientInterface.getApplicationNameAsync(uuid.httpClientUuid);
        let releaseNumber = await httpClientInterface.getReleaseNumberAsync(uuid.httpClientUuid);
        let regardApplicationOperation = await OperationServerInterface.getOperationNameAsync("okm-2-0-1-op-s-is-001");
        let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(uuid.tcpClientUuid);
        let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(uuid.tcpClientUuid);
        let applicationPort = await tcpClientInterface.getRemotePortAsync(uuid.tcpClientUuid);

        /***********************************************************************************
         * PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease
         *   /v1/inquire-application-type-approvals
         ************************************************************************************/
        let requestBody = {};
        requestBody.subscriberApplication = applicationName;
        requestBody.subscriberReleaseNumber = releaseNumber;
        requestBody.subscriberOperation = regardApplicationOperation;
        requestBody.subscriberAddress = applicationAddress;
        requestBody.subscriberProtocol = applicationProtocol;
        requestBody.subscriberPort = applicationPort;
        requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
        result = await forwardRequest(
          forwardingKindNameOfTheBequeathOperation,
          requestBody,
          user,
          xCorrelator,
          traceIndicator + "." + traceIncrementer++,
          customerJourney
        );
        if (!result) {
          throw forwardingKindNameOfTheBequeathOperation + " forwarding is not success for the input" + JSON.stringify(requestBody);
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

        let uuid = await getHttpClientAndTcpClientUuid();

        let applicationName = await httpServerInterface.getApplicationNameAsync();
        let releaseNumber = await httpClientInterface.getReleaseNumberAsync(uuid.httpClientUuid);
        let disregardApplicationOperation = await OperationServerInterface.getOperationNameAsync("okm-2-0-1-op-s-is-002");
        let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(uuid.tcpClientUuid);
        let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(uuid.tcpClientUuid);
        let applicationPort = await tcpClientInterface.getRemotePortAsync(uuid.tcpClientUuid);

        /***********************************************************************************
         * PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease
         *   /v1/withdrawn-approval-notification
         ************************************************************************************/
        let requestBody = {};
        requestBody.subscriberApplication = applicationName;
        requestBody.subscriberReleaseNumber = releaseNumber;
        requestBody.subscriberOperation = disregardApplicationOperation;
        requestBody.subscriberAddress = applicationAddress;
        requestBody.subscriberProtocol = applicationProtocol;
        requestBody.subscriberPort = applicationPort;
        requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
        result = await forwardRequest(
          forwardingKindNameOfTheBequeathOperation,
          requestBody,
          user,
          xCorrelator,
          traceIndicator + "." + traceIncrementer++,
          customerJourney
        );
        if (!result) {
          throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + JSON.stringify(requestBody);
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
async function PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease(user, xCorrelator, traceIndicator, customerJourney) {
  return new Promise(async function (resolve, reject) {
    try {
      let result = true;
      let forwardingKindNameOfTheBequeathOperation = "PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease";

      /***********************************************************************************
       * Preparing requestBody 
       ************************************************************************************/
      try {

        let uuid = await getHttpClientAndTcpClientUuid();

        let applicationName = await httpServerInterface.getApplicationNameAsync();
        let releaseNumber = await httpClientInterface.getReleaseNumberAsync(uuid.httpClientUuid);
        let operationName = await OperationServerInterface.getOperationNameAsync("okm-2-0-1-op-s-is-004");
        let applicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(uuid.tcpClientUuid);
        let applicationAddress = await tcpClientInterface.getRemoteAddressAsync(uuid.tcpClientUuid);
        let applicationPort = await tcpClientInterface.getRemotePortAsync(uuid.tcpClientUuid);

        /***********************************************************************************
         * PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease
         * /v1/notify-link-updates
         ************************************************************************************/
        let requestBody = {};
        requestBody.subscriberApplication = applicationName;
        requestBody.subscriberReleaseNumber = releaseNumber;
        requestBody.subscriberOperation = operationName;
        requestBody.subscriberAddress = applicationAddress;
        requestBody.subscriberProtocol = applicationProtocol;
        requestBody.subscriberPort = applicationPort;
        requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
        result = await forwardRequest(
          forwardingKindNameOfTheBequeathOperation,
          requestBody,
          user,
          xCorrelator,
          traceIndicator + "." + traceIncrementer++,
          customerJourney
        );
        if (!result) {
          throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + JSON.stringify(requestBody);
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

      let approvalOperationForwardingName = "PromptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease"
      let operationClientUuidOfApprovalOperation = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(approvalOperationForwardingName))[0];

      let withdrawnApprovalOperationForwardingName = "PromptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease"
      let operationClientUuidOfWithdrawnApprovalOperation = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(withdrawnApprovalOperationForwardingName))[0];

      let listOfOperationToBeUnsubscribed = [];
      let approvalOperationName = await operationClientInterface.getOperationNameAsync(operationClientUuidOfApprovalOperation);
      let deregistrationOperationName = await operationClientInterface.getOperationNameAsync(operationClientUuidOfWithdrawnApprovalOperation);
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
            traceIndicator + "." + traceIncrementer++,
            customerJourney
          );
          if (!result) {
            throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + JSON.stringify(requestBody);
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

      let notifyLinkUpdatesForwardingName = "PromptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease"
      let operationClientUuidOfNotifyLinkUpdatesOperation = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(notifyLinkUpdatesForwardingName))[0];

      /***********************************************************************************
       * Preparing requestBody 
       ************************************************************************************/
      try {
        let applicationName = await httpServerInterface.getApplicationNameAsync();
        let releaseNumber = await httpServerInterface.getReleaseNumberAsync();
        let subscriptionName = await OperationClientInterface.getOperationNameAsync(operationClientUuidOfNotifyLinkUpdatesOperation);

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
          traceIndicator + "." + traceIncrementer++,
          customerJourney
        );
        if (!result) {
          throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + JSON.stringify(requestBody);
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

        let forwardingName = "PromptForBequeathingDataCausesTransferOfListOfApplications"
        let newReleaseOperationClientUuid = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(forwardingName))[0];
        let newReleaseHttpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseOperationClientUuid))[0];
        let newReleaseTcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseHttpClientUuid))[0];

        let currentApplicationName = await httpServerInterface.getApplicationNameAsync();
        let currentReleaseNumber = await httpServerInterface.getReleaseNumberAsync();
        let newApplicationName = await httpClientInterface.getApplicationNameAsync(newReleaseHttpClientUuid);
        let newReleaseNumber = await httpClientInterface.getReleaseNumberAsync(newReleaseHttpClientUuid);
        let newApplicationAddress = await tcpClientInterface.getRemoteAddressAsync(newReleaseTcpClientUuid);
        let newApplicationPort = await tcpClientInterface.getRemotePortAsync(newReleaseTcpClientUuid);
        let newApplicationProtocol = await tcpClientInterface.getRemoteProtocolAsync(newReleaseTcpClientUuid);

        /***********************************************************************************
         * PromptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement
         *   /v1/relay-server-replacement
         ************************************************************************************/
        let requestBody = {};
        requestBody.currentApplicationName = currentApplicationName;
        requestBody.currentReleaseNumber = currentReleaseNumber;
        requestBody.futureApplicationName = newApplicationName;
        requestBody.futureReleaseNumber = newReleaseNumber;
        requestBody.futureProtocol = newApplicationProtocol;
        requestBody.futureAddress = newApplicationAddress;
        requestBody.futurePort = newApplicationPort;
        requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
        result = await forwardRequest(
          forwardingKindNameOfTheBequeathOperation,
          requestBody,
          user,
          xCorrelator,
          traceIndicator + "." + traceIncrementer++,
          customerJourney
        );
        if (!result) {
          throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + JSON.stringify(requestBody);
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
        let forwardingName = "PromptForBequeathingDataCausesTransferOfListOfApplications"
        let newReleaseOperationClientUuid = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(forwardingName))[0];
        let newReleaseHttpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(newReleaseOperationClientUuid))[0];

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
          requestBody.releaseNumber = oldReleaseNumber;
          requestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(requestBody);
          result = await forwardRequest(
            forwardingKindNameOfTheBequeathOperation,
            requestBody,
            user,
            xCorrelator,
            traceIndicator + "." + traceIncrementer++,
            customerJourney
          );
          if (!result) {
            throw forwardingKindNameOfTheBequeathOperation + "forwarding is not success for the input" + JSON.stringify(requestBody);
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
}

/**
 * @description This function automates the forwarding construct by calling the appropriate call back operations based on the fcPort input and output directions.
 * @param {String} forwardingKindName forwarding Name
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
      let result = await eventDispatcher.dispatchEvent(
        operationClientUuid,
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


/**
 * @description This function gets the http and tcp client uuid from the forwarding contruct 
 *                PromptForBequeathingDataCausesTransferOfListOfApplications
 * 
 * return {object} uuid
 **/
var getHttpClientAndTcpClientUuid = exports.getHttpClientAndTcpClientUuid = function getHttpClientAndTcpClientUuid() {
  return new Promise(async function (resolve, reject) {
    try {
      let uuidList = {};
      let forwardingName = "PromptForBequeathingDataCausesTransferOfListOfApplications"
      let operationClientUuid = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(forwardingName))[0];
      let httpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(operationClientUuid))[0];
      let tcpClientUuid = (await logicalTerminationPoint.getServerLtpListAsync(httpClientUuid))[0];
      uuidList = { httpClientUuid, tcpClientUuid }
      resolve(uuidList);
    } catch (error) {
      reject(error);
    }
  });
}
