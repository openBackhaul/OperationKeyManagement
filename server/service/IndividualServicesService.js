// @ts-check
'use strict';

const LogicalTerminationPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInput');
const logicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointServices');
const prepareALTForwardingAutomation = require('onf-core-model-ap-bs/basicServices/services/PrepareALTForwardingAutomation');
const forwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');
const ForwardingConstructConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/ConfigurationInput');
const forwardingConfigurationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructConfigurationServices');

const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const tcpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpServerInterface');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const bequeathYourDataAndDieUtils = require('../utils/bequeathYourDataAndDieUtils');
const HttpClient = require('../utils/HttpClient');
const crypto = require('crypto');

const ltpClientConstants = require('../utils/ltpClientConstants');
const ltpServerConstants = require('../utils/ltpServerConstants');
const onfModelUtils = require("../utils/OnfModelUtils");

const FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES_UUID = 'okm-0-0-1-op-fc-3001';
const FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES = 'CyclicOperationCausesOperationKeyUpdates';

/**
 * Initiates process of embedding a new release
 *
 * body V1_bequeathyourdataanddie_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.bequeathYourDataAndDie = async function (body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  // get data from request body
  const newApplicationName = body["new-application-name"];
  const newReleaseNumber = body["new-application-release"];
  const newApplicationAddress = body["new-application-address"];
  const newApplicationPort = body["new-application-port"];

  // set app release number if it does not exist
  const appReleaseNumber = await httpClientInterface.getReleaseNumberAsync(ltpClientConstants.HTTP_NEW_RELEASE);
  if (appReleaseNumber == undefined) {
    await httpClientInterface.setReleaseNumberAsync(ltpClientConstants.HTTP_NEW_RELEASE, newReleaseNumber);
  }

  const tcpClientUuid = (await LogicalTerminationPoint.getServerLtpListAsync(ltpClientConstants.HTTP_NEW_RELEASE))[0];
  await tcpClientInterface.setRemoteAddressAsync(tcpClientUuid, newApplicationAddress);
  await tcpClientInterface.setRemotePortAsync(tcpClientUuid, newApplicationPort);

  const httpClient = new HttpClient(user, xCorrelator, traceIndicator, customerJourney);
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesTransferOfListOfApplications(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesTransferOfListOfApplications - failed with error: ${error.message}`));
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease - failed with error: ${error.message}`))
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease - failed with error: ${error.message}`))
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease - failed with error: ${error.message}`))
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease - failed with error: ${error.message}`))
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease - failed with error: ${error.message}`))
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement - failed with error: ${error.message}`))
  bequeathYourDataAndDieUtils.promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(httpClient)
    .catch((error) => console.log(`promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease - failed with error: ${error.message}`))
}

/**
 * Removes application from list of targets of operationKeys
 *
 * body V1_disregardapplication_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.disregardApplication = async function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  // get data from request body
  const appName = body["application-name"];
  const appReleaseNumber = body["application-release-number"];

  const httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(appName, appReleaseNumber);
  // http ltp for the given app does not exist 
  if (httpClientUuid == undefined) {
    return;
  }

  const logicalTerminationPointConfigurationStatus = await logicalTerminationPointService.deleteApplicationInformationAsync(appName, appReleaseNumber);

  const operationClientUuid = logicalTerminationPointConfigurationStatus.operationClientConfigurationStatusList[0].uuid;
  const forwardingConfigurationInput = new ForwardingConstructConfigurationInput(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
  const forwardingConfigurationInputList = [forwardingConfigurationInput];
  const forwardingConstructConfigurationStatus = await forwardingConfigurationService.unConfigureForwardingConstructAsync(operationServerName, forwardingConfigurationInputList);

  let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTUnConfigureForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatus,
    forwardingConstructConfigurationStatus
  );

  forwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    applicationLayerTopologyForwardingInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  ).catch((error) => console.log(`disregardApplication - automateForwardingConstructAsync for ${JSON.stringify({ xCorrelator, traceIndicator, user, originator })} failed with error: ${error.message}`));
}


/**
 * Provides list of applications that are receiving operationKeys
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns List
 **/
exports.listApplications = async function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  const clientOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForTheUuid(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES_UUID);
  const resultList = [];
  for (const clientOperationLtpUuid of clientOperationLtpUuidList) {
    const httpLtpUuidList = await LogicalTerminationPoint.getServerLtpListAsync(clientOperationLtpUuid);
    const httpLtpAppName = await httpClientInterface.getApplicationNameAsync(httpLtpUuidList[0]);
    const httpLtpAppReleaseNumber = await httpClientInterface.getReleaseNumberAsync(httpLtpUuidList[0]);

    const tcpLtpUuidLilst = await LogicalTerminationPoint.getServerLtpListAsync(httpLtpUuidList[0])
    const tcpLtpRemoteAddress = await tcpClientInterface.getRemoteAddressAsync(tcpLtpUuidLilst[0]);
    const tcpLtpRemotePort = await tcpClientInterface.getRemotePortAsync(tcpLtpUuidLilst[0]);
    const resultObj = {
      "application-name": httpLtpAppName,
      "application-release-number": httpLtpAppReleaseNumber,
      "application-address": tcpLtpRemoteAddress,
      "application-port": tcpLtpRemotePort
    }
    resultList.push(resultObj);
  }
  return resultList;
}


/**
 * Adds to the list of applications
 *
 * body V1_regardapplication_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.regardApplication = async function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  // get data from request body
  const appName = body['application-name'];
  const appReleaseNumber = body['application-release-number'];
  const appAddress = body['application-address'];
  const appPort = body['application-port'];

  // create/update op, tcp, http logical-termination-points for the given app
  const operationList = ['/v1/update-operation-key']; // TODO should this be part of request body?
  const logicalTerminatinPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
    appName,
    appReleaseNumber,
    appAddress,
    appPort,
    operationList
  );
  const logicalTerminationPointConfigurationStatus = await logicalTerminationPointService.createOrUpdateApplicationInformationAsync(logicalTerminatinPointConfigurationInput);

  const operationClientUuid = logicalTerminationPointConfigurationStatus.operationClientConfigurationStatusList[0].uuid;
  const forwardingConfigurationInput = new ForwardingConstructConfigurationInput(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
  const forwardingConfigurationInputList = [forwardingConfigurationInput];
  const forwardingConstructConfigurationStatus = await forwardingConfigurationService.configureForwardingConstructAsync(operationServerName, forwardingConfigurationInputList);

  let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatus,
    forwardingConstructConfigurationStatus
  );

  forwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    applicationLayerTopologyForwardingInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  ).catch((error) => console.log(`regardApplication - automateForwardingConstructAsync for ${JSON.stringify({ xCorrelator, traceIndicator, user, originator })} failed with error: ${error.message}`));
}


/**
 * Initiates OperationKey update
 *
 * body V1_regardupdatedlink_body 
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * no response value expected for this operation
 **/
exports.regardUpdatedLink = async function (body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  // get data from request body
  const linkUuid = body['link-uuid'];

  const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForTheUuid(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES_UUID);
  const httpClient = new HttpClient(user, xCorrelator, traceIndicator, customerJourney);
  await updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient);
}


/**
 * Starts application in generic representation
 *
 * user String User identifier from the system starting the service call
 * originator String 'Identification for the system consuming the API, as defined in  [/core-model-1-4:control-construct/logical-termination-point={uuid}/layer-protocol=0/http-client-interface-1-0:http-client-interface-pac/http-client-interface-capability/application-name]' 
 * xCorrelator String UUID for the service execution flow that allows to correlate requests and responses
 * traceIndicator String Sequence of request numbers along the flow
 * customerJourney String Holds information supporting customer’s journey to which the execution applies
 * returns inline_response_200
 **/
exports.startApplicationInGenericRepresentation = async function (user, originator, xCorrelator, traceIndicator, customerJourney) {
  // Preparing response-value-list for response body
  const responseValueList = [];
  const applicationName = await httpServerInterface.getApplicationNameAsync();
  const reponseValue = { 'field-name': "applicationName", 'value': applicationName, 'datatype': typeof applicationName };
  responseValueList.push(reponseValue);

  // Preparing consequent-action-list for response body
  const consequentActionList = [];
  const baseUrl = "http://" + await tcpServerInterface.getLocalAddress() + ":" + await tcpServerInterface.getLocalPort();
  const labelForInformAboutApplication = "Inform about Application";
  const requestForInformAboutApplication = baseUrl + await operationServerInterface.getOperationNameAsync(ltpServerConstants.HTTP_THIS_OPERATION_INFORM_ABOUT_APPLICATION_IN_GENERIC_REPRESENTATION);
  const consequentActionForInformAboutApplication = { 'label': labelForInformAboutApplication, 'request': requestForInformAboutApplication };
  consequentActionList.push(consequentActionForInformAboutApplication);

  return {
    'response-value-list': responseValueList,
    'consequent-action-list': consequentActionList
  };
}

exports.scheduleKeyRotation = function scheduleKeyRotation(intervalInMinutes) {
  console.log(`Scheduling update operation key every ${intervalInMinutes} minutes.`);
  return setInterval(reccurentUpdateKeys, intervalInMinutes * 60000);
}

async function reccurentUpdateKeys() {
  try {
    const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForTheUuid(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES_UUID);
    const httpClient = new HttpClient();
    const linkUuidList = await fetchLinkUuidListFromAlt(httpClient);
    for (const linkUuid of linkUuidList) {
      updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
        .catch((error) => console.log(`reccurentUpdateKeys - failed update key for link ${linkUuid} with error: ${error.message}`));
    }
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`reccurentUpdateKeys - failed with error: ${error.message}`);
  }
}

async function fetchLinkUuidListFromAlt(httpClient) {
  const resp = await httpClient.executeOperation(ltpClientConstants.HTTP_ALT_OPERATION_LIST_LINK_UUIDS);
  if (resp['link-uuid-list'] === undefined) {
    return [];
  }

  return resp['link-uuid-list'];
}

async function updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient) {
  const linkEndpointList = await fetchLinkEndpointListFromAlt(linkUuid, httpClient)
  const operationKey = generateOperationKey();
  for (const linkEndpoint of linkEndpointList) {
    const epAppName = linkEndpoint['application-name'];
    const epAppReleaseNumber = linkEndpoint['application-release-number'];
    const epOperationUuid = linkEndpoint['operation-uuid'];

    if (!epAppName || !epAppReleaseNumber || !epOperationUuid) {
      console.log(`Ignoring endpoint ${JSON.stringify(linkEndpoint)} during update operation key for link ${linkUuid} because the endpoint is missing data.`);
      continue;
    }

    const updateKeyOperationLtpUuid = await resolveUpdateKeyOperationLtpUuidForApplication(epAppName, epAppReleaseNumber, updateKeyOperationLtpUuidList);
    if (updateKeyOperationLtpUuid) {
      httpClient.executeOperation(updateKeyOperationLtpUuid, { "operation-uuid": epOperationUuid, "new-operation-key": operationKey })
        .then(response => console.log(`Successfully updated operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid}`))
        .catch(error => console.log(`Failed to update operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid} with error: ${error.message}`));
    } else {
      console.log(`Application ${epAppName} version ${epAppReleaseNumber} is not registered for key update. Skipping it during update operation key for link ${linkUuid}.`);
    }
  }
}

async function fetchLinkEndpointListFromAlt(linkUuid, httpClient) {
  const resp = await httpClient.executeOperation(ltpClientConstants.HTTP_ALT_OPERATION_LIST_ENDPOINTS_OF_LINK, { 'link-uuid': linkUuid });
  if (resp['link-end-point-list'] === undefined) {
    return [];
  }

  return resp['link-end-point-list'];
}

async function resolveUpdateKeyOperationLtpUuidForApplication(epAppName, epAppReleaseNumber, updateKeyOperationLtpUuidList) {
  for (const updateKeyOperationLtpUuid of updateKeyOperationLtpUuidList) {
    const httpLtpUuidList = await LogicalTerminationPoint.getServerLtpListAsync(updateKeyOperationLtpUuid);
    const httpLtpAppName = await httpClientInterface.getApplicationNameAsync(httpLtpUuidList[0]);
    const httpLtpAppReleaseNumber = await httpClientInterface.getReleaseNumberAsync(httpLtpUuidList[0]);
    if (isAppEqual(epAppName, epAppReleaseNumber, httpLtpAppName, httpLtpAppReleaseNumber)) {
      return updateKeyOperationLtpUuid;
    }
  }
  return null;
}

function isAppEqual(firstAppName, firstAppReleaseNumber, secondAppName, secondAppReleaseNumber) {
  if (firstAppName !== secondAppName) {
    return false;
  }
  if (firstAppReleaseNumber !== secondAppReleaseNumber) {
    return false;
  }
  return true;
}

function generateOperationKey() {
  return crypto.randomUUID().replaceAll('-', '');
}