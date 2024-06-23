// @ts-check
'use strict';


const LogicalTerminationPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInput');
const LogicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointServices');
const prepareALTForwardingAutomation = require('onf-core-model-ap-bs/basicServices/services/PrepareALTForwardingAutomation');
const forwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');
const ForwardingConstructConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/ConfigurationInput');
const forwardingConfigurationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructConfigurationServices');
const ProfileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
let FORWARDING_NAME = "LinkUpdateNotificationCausesOperationKeyUpdates"
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const tcpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const ConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/ConfigurationStatus');
const LogicalTerminationPointConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationStatus');
const operationKeyUpdateNotificationService = require('onf-core-model-ap/applicationPattern/onfModel/services/OperationKeyUpdateNotificationService');
const prepareForwardingAutomation = require('./individualServices/PrepareForwardingAutomation');
const individualServicesOperationsMapping = require('./individualServices/individualServicesOperationsMapping');
const softwareUpgrade = require('./individualServices/SoftwareUpgrade');
const profileConstants = require('../utils/profileConstants');
const stringProfileService = require('./StringProfileService');
const HttpClient = require('../utils/HttpClient');
const crypto = require('crypto');

const onfModelUtils = require("../utils/OnfModelUtils");
const TcpObject = require('onf-core-model-ap/applicationPattern/onfModel/services/models/TcpObject');

const FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES = 'CyclicOperationCausesOperationKeyUpdates';
const FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES = 'LinkUpdateNotificationCausesOperationKeyUpdates';
const UPDATE_OPERATION_KEY_OPERATION = '/v1/update-operation-key'
const DEFAULT_OPERATION_KEY = 'Operation key not yet provided.';
const NEW_RELEASE_FORWARDING_NAME = 'PromptForBequeathingDataCausesTransferOfListOfApplications';
const Integerprofile = require('onf-core-model-ap/applicationPattern/onfModel/models/profile/IntegerProfile');
const ForwardingConstructProcessingService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructProcessingServices');
const AsyncLock = require('async-lock');
const lock = new AsyncLock();

exports.regardUpdatedLink2 = async function (body, user, xCorrelator, traceIndicator, customerJourney) {
  // get data from request body
  const linkUuid = body['link-uuid'];
  const linkEndPoint = body["link-end-point-list"]

  const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES);
  const httpClient = new HttpClient(user, xCorrelator, traceIndicator, customerJourney);
  await updateOperationKeyForLink2(linkUuid, linkEndPoint, updateKeyOperationLtpUuidList, httpClient)
    .catch((error) => console.log(`regardUpdatedLink2 - failed update key for link ${linkUuid} with error: ${error.message}`));
}

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
exports.bequeathYourDataAndDie = async function (body, user, originator, xCorrelator, traceIndicator, customerJourney, operationServerName) {
  /****************************************************************************************
   * Setting up required local variables from the request body
   ****************************************************************************************/

  let applicationName = body["new-application-name"];
  let releaseNumber = body["new-application-release"];
  let address = body["new-application-address"];
  let protocol = body["new-application-protocol"];
  let port = body["new-application-port"];


  /****************************************************************************************
   * Updating the New Release application details
   ****************************************************************************************/
  let uuid = await softwareUpgrade.getHttpClientAndTcpClientUuid();
  let isUpdated = {};
  let currentNewReleaseApplicationName = await httpClientInterface.getApplicationNameAsync(uuid.httpClientUuid);
  let currentNewReleaseNumber = await httpClientInterface.getReleaseNumberAsync(uuid.httpClientUuid);
  let currentNewReleaseRemoteAddress = await tcpClientInterface.getRemoteAddressAsync(uuid.tcpClientUuid);
  let currentNewReleaseRemoteProtocol = await tcpClientInterface.getRemoteProtocolAsync(uuid.tcpClientUuid);
  let currentNewReleaseRemotePort = await tcpClientInterface.getRemotePortAsync(uuid.tcpClientUuid);
  if (applicationName != currentNewReleaseApplicationName) {
    isUpdated.applicationName = await httpClientInterface.setApplicationNameAsync(uuid.httpClientUuid, applicationName)
  }
  if (releaseNumber != currentNewReleaseNumber) {
    isUpdated.releaseNumber = await httpClientInterface.setReleaseNumberAsync(uuid.httpClientUuid, releaseNumber);
  }
  if (JSON.stringify(address) != JSON.stringify(currentNewReleaseRemoteAddress)) {
    isUpdated.address = await tcpClientInterface.setRemoteAddressAsync(uuid.tcpClientUuid, address);
  }
  if (port != currentNewReleaseRemotePort) {
    isUpdated.port = await tcpClientInterface.setRemotePortAsync(uuid.tcpClientUuid, port);
  }
  if (protocol != currentNewReleaseRemoteProtocol) {
    isUpdated.protocol = await tcpClientInterface.setRemoteProtocolAsync(uuid.tcpClientUuid, protocol);
  }

  /****************************************************************************************
   * Updating the Configuration Status based on the application information updated
   *****************************************************************************************/
  let isTcpInfoUpdated = false;
  let isHttpInfoUpdated = false;

  if (isUpdated.address || isUpdated.port || isUpdated.protocol) {
    isTcpInfoUpdated = true;
  }
  if (isUpdated.applicationName || isUpdated.releaseNumber) {
    isHttpInfoUpdated = true;
  }

  let tcpClientConfigurationStatus = new ConfigurationStatus(
    uuid.tcpClientUuid,
    '',
    isTcpInfoUpdated
  );
  let httpClientConfigurationStatus = new ConfigurationStatus(
    uuid.httpClientUuid,
    '',
    isHttpInfoUpdated
  );

  let logicalTerminationPointConfigurationStatus = new LogicalTerminationPointConfigurationStatus(
    false,
    httpClientConfigurationStatus,
    [tcpClientConfigurationStatus]
  );
  /****************************************************************************************
   * Prepare attributes to automate forwarding-construct
   ****************************************************************************************/
  let forwardingAutomationInputList = await prepareForwardingAutomation.bequeathYourDataAndDie(
    logicalTerminationPointConfigurationStatus
  );
  forwardingAutomationService.automateForwardingConstructAsync(
    operationServerName,
    forwardingAutomationInputList,
    user,
    xCorrelator,
    traceIndicator,
    customerJourney
  );

  softwareUpgrade.upgradeSoftwareVersion(user, xCorrelator, traceIndicator, customerJourney, forwardingAutomationInputList.length)
    .catch(err => console.log(`upgradeSoftwareVersion failed with error: ${err}`));
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
  const appReleaseNumber = body["release-number"];

  const httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
    appName, appReleaseNumber, NEW_RELEASE_FORWARDING_NAME
  )
  if (!httpClientUuid) {
    return;
  }

  let logicalTerminationPointConfigurationStatus = await LogicalTerminationPointService.deleteApplicationLtpsAsync(httpClientUuid);

  let applicationLayerTopologyForwardingInputList = prepareALTForwardingAutomation.getALTUnConfigureForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatus
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
 * returns List
 **/
exports.listApplications = async function () {
  const clientOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES);
  let applicationsList = [];

  for (const clientOperationLtpUuid of clientOperationLtpUuidList) {
    const httpLtpUuidList = await LogicalTerminationPoint.getServerLtpListAsync(clientOperationLtpUuid);
    if (httpLtpUuidList.length == 1) {
      const httpLtpAppName = await httpClientInterface.getApplicationNameAsync(httpLtpUuidList[0]);
      const httpLtpAppReleaseNumber = await httpClientInterface.getReleaseNumberAsync(httpLtpUuidList[0]);

      const tcpLtpUuidLilst = await LogicalTerminationPoint.getServerLtpListAsync(httpLtpUuidList[0])
      const tcpLtpRemoteAddress = await tcpClientInterface.getRemoteAddressAsync(tcpLtpUuidLilst[0]);
      const tcpLtpRemotePort = await tcpClientInterface.getRemotePortAsync(tcpLtpUuidLilst[0]);
      const tcpLtpRemoteProtocol = await tcpClientInterface.getRemoteProtocolAsync(tcpLtpUuidLilst[0]);
      let clientApplication = {};
      clientApplication.applicationName = httpLtpAppName;
      clientApplication.releaseNumber = httpLtpAppReleaseNumber;
      clientApplication.address = tcpLtpRemoteAddress;
      clientApplication.protocol = tcpLtpRemoteProtocol;
      clientApplication.port = tcpLtpRemotePort;

      let application = await onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(clientApplication);

      applicationsList.push(application);
    } else {
      console.log(`Could not find http client uuid in server ltps for operation client with uuid ${clientOperationLtpUuid}`);
    }
  }
  return applicationsList;
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
  return new Promise(async function (resolve, reject) {
    const appName = body['application-name'];
    const appReleaseNumber = body['release-number'];
    const tcpInfo = [new TcpObject(body['protocol'], body['address'], body['port'])];
    let operationsMapping = individualServicesOperationsMapping.individualServicesOperationsMapping;
    let operationNamesByAttributes = new Map();
    operationNamesByAttributes.set("update-operation-key", UPDATE_OPERATION_KEY_OPERATION);
    let applicationLayerResult;
    let headers = {
      user,
      xCorrelator,
      traceIndicator,
      customerJourney,
      operationServerName
    }
    headers.traceIndicatorIncrementer = 1;
    let forwardingConfigurationInputList;
    await lock.acquire("regard application", async () => {

      const httpClientUuid = await httpClientInterface.getHttpClientUuidExcludingOldReleaseAndNewRelease(
        appName, appReleaseNumber, NEW_RELEASE_FORWARDING_NAME
      )
      const ltpConfigurationInput = new LogicalTerminationPointConfigurationInput(
        httpClientUuid,
        appName,
        appReleaseNumber,
        tcpInfo,
        operationServerName,
        operationNamesByAttributes,
        operationsMapping
      );
      const ltpConfigurationStatus = await LogicalTerminationPointService.createOrUpdateApplicationLtpsAsync(ltpConfigurationInput);
      const operationClientUuid = ltpConfigurationStatus.operationClientConfigurationStatusList[0].uuid;
      const cyclicOperationInput = new ForwardingConstructConfigurationInput(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
      const linkUpdateNotificationInput = new ForwardingConstructConfigurationInput(FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
      forwardingConfigurationInputList = [cyclicOperationInput, linkUpdateNotificationInput];

      const forwardingConstructConfigurationStatus = await forwardingConfigurationService.
      configureForwardingConstructAsync(
        operationServerName,
        forwardingConfigurationInputList
      );
      let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
        ltpConfigurationStatus,
        forwardingConstructConfigurationStatus
      );

      headers.traceIndicatorIncrementer = headers.traceIndicatorIncrementer + applicationLayerTopologyForwardingInputList.length;

      forwardingAutomationService.automateForwardingConstructAsync(
        headers.operationServerName, applicationLayerTopologyForwardingInputList,
        headers.user,
        headers.xCorrelator,
        headers.traceIndicator,
        headers.customerJourney
      ).catch((error) => console.log(`regardApplication - automateForwardingConstructAsync for ${JSON.stringify({ xCorrelator, traceIndicator, user, originator })} failed with error: ${error.message}`));
    });
    applicationLayerResult = await prepareForwardingAutomation.CreateLinkForUpdatingOperationKeys(
      appName,
      appReleaseNumber,
      headers.user,
      headers.xCorrelator,
      headers.traceIndicator + "." + headers.traceIndicatorIncrementer++,
      headers.customerJourney
    );

    if (applicationLayerResult.success == true) {
      let OperationClientUuid = await prepareForwardingAutomation.getOperationClientUuid(FORWARDING_NAME, appName, appReleaseNumber);
      let timestampOfCurrentRequest = new Date()
      let maxwaitingperiod = await Integerprofile.getIntegerValueForTheIntegerProfileNameAsync("maximumWaitTimeToReceiveOperationKey")
      await operationKeyUpdateNotificationService.turnONNotificationChannel(timestampOfCurrentRequest)

      let waitUntilOperationKeyIsUpdated = await operationKeyUpdateNotificationService.waitUntilOperationKeyIsUpdated(OperationClientUuid, timestampOfCurrentRequest, maxwaitingperiod);
      await operationKeyUpdateNotificationService.turnOFFNotificationChannel(timestampOfCurrentRequest)
      if (!waitUntilOperationKeyIsUpdated) {
        applicationLayerResult.success = false
        applicationLayerResult.reasonForFailure = "OKM_MAXIMUM_WAIT_TIME_TO_RECEIVE_OPERATION_KEY_EXCEEDED";
      }
    }

    if (applicationLayerResult.success == false) {
      rollBackSubscriptionToOperationKeyUpdate(
        forwardingConfigurationInputList,
        headers
      )
    }
    var response = {};
    if (applicationLayerResult.success == true) {
      response['application/json'] = {
        "successfully-connected": applicationLayerResult.success,
      }
    } else {
      response['application/json'] = {
        "successfully-connected": applicationLayerResult.success,
        "reason-of-failure": applicationLayerResult.reasonForFailure
      }
    }

    if (Object.keys(response).length > 0) {
      console.log(response[Object.keys(response)])
      resolve(response[Object.keys(response)[0]]);
    } else {

    }

  });
}

async function rollBackSubscriptionToOperationKeyUpdate(forwardingConfigurationInputList, headers) {
  let forwardingConstructConfigurationStatusForRollback = await forwardingConfigurationService.unConfigureForwardingConstructAsync(
    headers.operationServerName,
    forwardingConfigurationInputList
  );
  let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getFDUnconfigureForwardingAutomationInputList(
    forwardingConstructConfigurationStatusForRollback
  );
  for (let index = 0; index < applicationLayerTopologyForwardingInputList.length; index++) {
    const applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[index];
    ForwardingConstructProcessingService.processForwardingConstructAsync(
      applicationLayerTopologyForwardingInput,
      headers.user,
      headers.xCorrelator,
      headers.traceIndicator + "." + headers.traceIndicatorIncrementer++,
      headers.customerJourney
    );
  }
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
  const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES);
  const httpClient = new HttpClient(user, xCorrelator, traceIndicator, customerJourney);
  await updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
    .catch((error) => console.log(`regardUpdatedLink - failed update key for link ${linkUuid} with error: ${error.message}`));
}

exports.scheduleKeyRotation = async function scheduleKeyRotation() {
  const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
  if (operationModeValue === profileConstants.OPERATION_MODE_REACTIVE) {
    console.log(`Reccurent update of operation keys is disabled, "operationMode" is "${profileConstants.OPERATION_MODE_REACTIVE}".`);
    return;
  }
  let timeIntervalInSeconds;
  let profileList = await ProfileCollection.getProfileListAsync();
  for (let i = 0; i < profileList.length; i++) {
    let profileInstance = profileList[i];
    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
    if (profileName == "integer-profile-1-0:PROFILE_NAME_TYPE_INTEGER_PROFILE") {
      let Integerval = profileInstance["integer-profile-1-0:integer-profile-pac"]['integer-profile-capability']['integer-name']
      if (Integerval == 'timeInterval') {
        timeIntervalInSeconds = profileInstance["integer-profile-1-0:integer-profile-pac"]["integer-profile-configuration"]["integer-value"]
        break;
      }
    }
  }

  setTimeout(reccurentUpdateKeys, timeIntervalInSeconds * 1000);
  console.log(`Update operation keys has been scheduled in ${timeIntervalInSeconds} seconds.`);
}

exports.updateKeys = async function () {
  const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES);
  const httpClient = new HttpClient();
  const linkUuidList = await fetchLinkUuidListFromAlt(httpClient);
  for (const linkUuid of linkUuidList) {
    await updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
      .catch((error) => console.log(`reccurentUpdateKeys - failed update key for link ${linkUuid} with error: ${error.message}`));
  }
}

async function reccurentUpdateKeys() {
  try {
    const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
    if (operationModeValue === profileConstants.OPERATION_MODE_REACTIVE) {
      // recurrentUpdateKeys has been scheduled but meanwhile operationMode changed and OKM should not update keys
      return;
    }

    const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES);
    const httpClient = new HttpClient();
    const linkUuidList = await fetchLinkUuidListFromAlt(httpClient);
    let traceIndicatorIncrementer = 0;
    let existingTraceIndicator = httpClient.getTraceIndicator();
    let newTraceIndicator = existingTraceIndicator + "." + traceIndicatorIncrementer++;
    httpClient.setTraceIndicator(newTraceIndicator);
    for (const linkUuid of linkUuidList) {
      await updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
        .catch((error) => console.log(`reccurentUpdateKeys - failed update key for link ${linkUuid} with error: ${error.message}`));
      newTraceIndicator = existingTraceIndicator + "." + traceIndicatorIncrementer++;     
      httpClient.setTraceIndicator(newTraceIndicator);
    }
  } catch (error) {
    if (error == undefined) {
      throw new Error('unknown error');
    }
    console.log(`reccurentUpdateKeys - failed with error: ${error.message}`);
  } finally {
    exports.scheduleKeyRotation();
  }
}

async function fetchLinkUuidListFromAlt(httpClient) {
  let operationClientUuidOfListLinkUuids = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName("CyclicOperationCausesRequestForListOfLinks"))[0];
  const resp = await httpClient.executeOperation(operationClientUuidOfListLinkUuids);
  if (resp['link-uuid-list'] === undefined) {
    return [];
  }

  return resp['link-uuid-list'];
}

async function updateOperationKeyForLink2(linkUuid, linkEndpointList, updateKeyOperationLtpUuidList, httpClient) {
  const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
  const operationKey = operationModeValue === profileConstants.OPERATION_MODE_OFF ? DEFAULT_OPERATION_KEY : generateOperationKey();
  for (const linkEndpoint of linkEndpointList) {
    const epAppName = linkEndpoint['application-name'];
    const epAppReleaseNumber = linkEndpoint['release-number'];
    const epOperationUuid = linkEndpoint['operation-uuid'];

    if (!epAppName || !epAppReleaseNumber || !epOperationUuid) {
      console.log(`Ignoring endpoint ${JSON.stringify(linkEndpoint)} during update operation key for link ${linkUuid} because the endpoint is missing data.`);
      continue;
    }

    const updateKeyOperationLtpUuid = await resolveUpdateKeyOperationLtpUuidForApplication(epAppName, epAppReleaseNumber, updateKeyOperationLtpUuidList);
    if (updateKeyOperationLtpUuid) {
      await httpClient.executeOperation(updateKeyOperationLtpUuid, {
          "operation-uuid": epOperationUuid,
          "new-operation-key": operationKey
        })
        .then(() => console.log(`Successfully updated operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid} for the trace ${httpClient.getTraceIndicator()}`))
        .catch(error => console.log(`Failed to update operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid} with error: ${error.message}`));
    } else {
      console.log(`Application ${epAppName} version ${epAppReleaseNumber} is not registered for key update. Skipping it during update operation key for link ${linkUuid}.`);
    }
  }
}

async function fetchLinkEndpointListFromAlt(linkUuid, httpClient) {
  let operationClientUuidOfListEndPointsOfLink = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName("CyclicOperationCausesRequestForLinkEndPoints"))[0];
  const resp = await httpClient.executeOperation(operationClientUuidOfListEndPointsOfLink, {
    'link-uuid': linkUuid
  });
  if (resp['link-end-point-list'] === undefined) {
    return [];
  }

  return resp['link-end-point-list'];
}

async function updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient) {
  const linkEndpointList = await fetchLinkEndpointListFromAlt(linkUuid, httpClient);
  const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
  const operationKey = operationModeValue === profileConstants.OPERATION_MODE_OFF ? DEFAULT_OPERATION_KEY : generateOperationKey();

  let existingTraceIndicator = httpClient.getTraceIndicator();
  httpClient.setTraceIndicator(existingTraceIndicator + ".0");
  for (const linkEndpoint of linkEndpointList) {
    const epAppName = linkEndpoint['application-name'];
    const epAppReleaseNumber = linkEndpoint['release-number'];
    const epOperationUuid = linkEndpoint['operation-uuid'];
    if (!epAppName || !epAppReleaseNumber || !epOperationUuid) {
      console.log(`Ignoring endpoint ${JSON.stringify(linkEndpoint)} during update operation key for link ${linkUuid} because the endpoint is missing data.`);
      continue;
    }

    const updateKeyOperationLtpUuid = await resolveUpdateKeyOperationLtpUuidForApplication(epAppName, epAppReleaseNumber, updateKeyOperationLtpUuidList);
    if (updateKeyOperationLtpUuid) {
      await httpClient.executeOperation(updateKeyOperationLtpUuid, {
          "operation-uuid": epOperationUuid,
          "new-operation-key": operationKey
        })
        .then(response => 
          console.log(`Successfully updated operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid} for the trace ${httpClient.getTraceIndicator()}`))
        .catch(error => console.log(`Failed to update operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid} with error: ${error.message}`));
    } else {
      console.log(`Application ${epAppName} version ${epAppReleaseNumber} is not registered for key update. Skipping it during update operation key for link ${linkUuid}.`);
    }
  }
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