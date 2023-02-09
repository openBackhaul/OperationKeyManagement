// @ts-check
'use strict';

const LogicalTerminationPointConfigurationInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationInputWithMapping');
const logicalTerminationPointService = require('onf-core-model-ap/applicationPattern/onfModel/services/LogicalTerminationPointWithMappingServices');
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
const operationClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationClientInterface');
const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const ConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/ConfigurationStatus');
const LogicalTerminationPointConfigurationStatus = require('onf-core-model-ap/applicationPattern/onfModel/services/models/logicalTerminationPoint/ConfigurationStatus');


const prepareForwardingAutomation = require('./individualServices/PrepareForwardingAutomation');
const individualServicesOperationsMapping = require('./individualServices/individualServicesOperationsMapping');
const softwareUpgrade = require('./individualServices/SoftwareUpgrade');
const profileConstants = require('../utils/profileConstants');
const stringProfileService = require('./StringProfileService');
const HttpClient = require('../utils/HttpClient');
const crypto = require('crypto');

const ltpClientConstants = require('../utils/ltpClientConstants');
const ltpServerConstants = require('../utils/ltpServerConstants');
const onfModelUtils = require("../utils/OnfModelUtils");


const FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES = 'CyclicOperationCausesOperationKeyUpdates';
const FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES = 'LinkUpdateNotificationCausesOperationKeyUpdates';
const UPDATE_OPERATION_KEY_OPERATION = '/v1/update-operation-key'
const DEFAULT_OPERATION_KEY = 'Operation key not yet provided.';

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
  return new Promise(async function (resolve, reject) {
    try {
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
       * Check if data transfer is required
       *****************************************************************************************/
      let isDataTransferRequired = true;
      let serverAddress = await tcpServerInterface.getLocalAddressOfTheProtocol(protocol);
      let serverPort = await tcpServerInterface.getLocalPortOfTheProtocol(protocol);

      if (JSON.stringify(address) == JSON.stringify(serverAddress) && port === serverPort) {
        isDataTransferRequired = false;
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

      softwareUpgrade.upgradeSoftwareVersion(isDataTransferRequired, user, xCorrelator, traceIndicator, customerJourney)
        .catch(err => console.log(`upgradeSoftwareVersion failed with error: ${err}`));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
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

  const httpClientUuid = await httpClientInterface.getHttpClientUuidAsync(appName, appReleaseNumber);
  // http ltp for the given app does not exist 
  if (httpClientUuid == undefined) {
    return;
  }

  const operationClientUuid = await operationClientInterface.getOperationClientUuidAsync(httpClientUuid, UPDATE_OPERATION_KEY_OPERATION);

  const logicalTerminationPointConfigurationStatus = await logicalTerminationPointService.deleteApplicationInformationAsync(appName, appReleaseNumber);

  const cyclicOperationInput = new ForwardingConstructConfigurationInput(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
  const linkUpdateNotificationInput = new ForwardingConstructConfigurationInput(FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
  const forwardingConfigurationInputList = [cyclicOperationInput, linkUpdateNotificationInput];
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
  // get data from request body
  const appName = body['application-name'];
  const appReleaseNumber = body['relase-number'];
  const tcpInfo = [{
    "address": body['address'],
    "protocol": body['protocol'],
    "port": body['port']
  }]
  let operationsMapping = individualServicesOperationsMapping.individualServicesOperationsMapping;
  let operationNamesByAttributes = new Map();
  operationNamesByAttributes.set("update-operation-key", UPDATE_OPERATION_KEY_OPERATION);

  // create/update op, tcp, http logical-termination-points for the given app
  const logicalTerminatinPointConfigurationInput = new LogicalTerminationPointConfigurationInput(
    appName,
    appReleaseNumber,
    tcpInfo,
    operationServerName,
    operationNamesByAttributes,
    operationsMapping
  );
  const logicalTerminationPointConfigurationStatus = await logicalTerminationPointService.findOrCreateApplicationInformationAsync(logicalTerminatinPointConfigurationInput);

  const operationClientUuid = logicalTerminationPointConfigurationStatus.operationClientConfigurationStatusList[0].uuid;
  const cyclicOperationInput = new ForwardingConstructConfigurationInput(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
  const linkUpdateNotificationInput = new ForwardingConstructConfigurationInput(FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES, operationClientUuid);
  const forwardingConfigurationInputList = [cyclicOperationInput, linkUpdateNotificationInput];
  const forwardingConstructConfigurationStatus = await forwardingConfigurationService.configureForwardingConstructAsync(operationServerName, forwardingConfigurationInputList);

  let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
    logicalTerminationPointConfigurationStatus,
    forwardingConstructConfigurationStatus
  );

  forwardingAutomationService.automateForwardingConstructAsync(
    operationServerName, applicationLayerTopologyForwardingInputList,
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

  const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_LINK_UPDATE_NOTIFICATION_CAUSES_OPERATION_KEY_UPDATES);
  const httpClient = new HttpClient(user, xCorrelator, traceIndicator, customerJourney);
  updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
    .catch((error) => console.log(`regardUpdatedLink - failed update key for link ${linkUuid} with error: ${error.message}`));
}

exports.scheduleKeyRotation = async function scheduleKeyRotation() {
  const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
  if (operationModeValue === profileConstants.OPERATION_MODE_REACTIVE) {
    console.log(`Reccurent update of operation keys is disabled, "operationMode" is "${profileConstants.OPERATION_MODE_REACTIVE}".`);
    return;
  }

  const intervalInMinutes = 5; // TODO make it configurable via profile
  setTimeout(reccurentUpdateKeys, intervalInMinutes * 60000);
  console.log(`Update operation keys has been scheduled in ${intervalInMinutes} minutes.`);
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
    for (const linkUuid of linkUuidList) {
      updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
        .catch((error) => console.log(`reccurentUpdateKeys - failed update key for link ${linkUuid} with error: ${error.message}`));
    }
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
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

async function updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient) {
  const linkEndpointList = await fetchLinkEndpointListFromAlt(linkUuid, httpClient);
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
      httpClient.executeOperation(updateKeyOperationLtpUuid, {
          "operation-uuid": epOperationUuid,
          "new-operation-key": operationKey
        })
        .then(response => console.log(`Successfully updated operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid}`))
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