const prepareALTForwardingAutomation = require('onf-core-model-ap-bs/basicServices/services/PrepareALTForwardingAutomation');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');

const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const HttpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes')
const eventDispatcher = require('onf-core-model-ap/applicationPattern/rest/client/eventDispatcher');
const ForwardingProcessingInput = require('onf-core-model-ap/applicationPattern/onfModel/services/models/forwardingConstruct/ForwardingProcessingInput');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const ForwardingConstructProcessingService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructProcessingServices');


exports.bequeathYourDataAndDie = function (logicalTerminationPointconfigurationStatus) {
  return new Promise(async function (resolve, reject) {
    let forwardingConstructAutomationList = [];
    try {
      /***********************************************************************************
       * forwardings for application layer topology
       ************************************************************************************/
      let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputAsync(
        logicalTerminationPointconfigurationStatus,
        undefined
      );

      if (applicationLayerTopologyForwardingInputList) {
        for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
          let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
          forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
        }
      }

      resolve(forwardingConstructAutomationList);
    } catch (error) {
      reject(error);
    }
  });
}

exports.OAMLayerRequest = function (uuid) {
  return new Promise(async function (resolve, reject) {
    let forwardingConstructAutomationList = [];
    try {

      /***********************************************************************************
       * forwardings for application layer topology
       ************************************************************************************/
      let applicationLayerTopologyForwardingInputList = await prepareALTForwardingAutomation.getALTForwardingAutomationInputForOamRequestAsync(
        uuid
      );

      if (applicationLayerTopologyForwardingInputList) {
        for (let i = 0; i < applicationLayerTopologyForwardingInputList.length; i++) {
          let applicationLayerTopologyForwardingInput = applicationLayerTopologyForwardingInputList[i];
          forwardingConstructAutomationList.push(applicationLayerTopologyForwardingInput);
        }
      }

      resolve(forwardingConstructAutomationList);
    } catch (error) {
      reject(error);
    }
  });
}

exports.CreateLinkForUpdatingOperationKeys = async function (applicationName, applicationReleaseNumber, user, xCorrelator, traceIndicator, customerJourney, ) {
  return new Promise(async function (resolve, reject) {
    try {
      let result
      let CreateLinkForUpdatingOperationKeysForwardingName = "NewApplicationCausesRequestsForUpdatingOperationKeys.CreateLinkForUpdatingOperationKeys";
      let CreateLinkForUpdatingOperationKeysRequestBody = {};

      CreateLinkForUpdatingOperationKeysRequestBody.servingApplicationName = applicationName;
      CreateLinkForUpdatingOperationKeysRequestBody.servingApplicationReleaseNumber = applicationReleaseNumber;
      CreateLinkForUpdatingOperationKeysRequestBody.operationName = await operationServerInterface.getOperationNameAsync("okm-2-1-2-op-s-bm-010");
      CreateLinkForUpdatingOperationKeysRequestBody.consumingApplicationName = await HttpServerInterface.getApplicationNameAsync();
      CreateLinkForUpdatingOperationKeysRequestBody.consumingApplicationReleaseNumber = await HttpServerInterface.getReleaseNumberAsync();

      CreateLinkForUpdatingOperationKeysRequestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(CreateLinkForUpdatingOperationKeysRequestBody);
      let forwardingAutomation = new ForwardingProcessingInput(
        CreateLinkForUpdatingOperationKeysForwardingName,
        CreateLinkForUpdatingOperationKeysRequestBody
      );

      let response = await ForwardingConstructProcessingService.processForwardingConstructAsync(
        forwardingAutomation,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      )
      result = await getResponseValueList(response)
      resolve(result)

    } catch (error) {
      reject(error);
    }
  });

}



exports.RollBackInCaseOfTimeOut = async function (applicationName, appReleaseNumber, user, xCorrelator, traceIndicator, customerJourney, ) {
  return new Promise(async function (resolve, reject) {
    try {

      let result;
      let RollBackInCaseOfTimeOutForwardingName = "NewApplicationCausesRequestsForUpdatingOperationKeys.RollBackInCaseOfTimeOut";
      let RollBackInCaseOfTimeOutRequestBody = {};

      RollBackInCaseOfTimeOutRequestBody.applicationName = applicationName;
      RollBackInCaseOfTimeOutRequestBody.releaseNumber = appReleaseNumber;
      RollBackInCaseOfTimeOutRequestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(RollBackInCaseOfTimeOutRequestBody);

      result = await forwardRequest(
        RollBackInCaseOfTimeOutForwardingName,
        RollBackInCaseOfTimeOutRequestBody,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      );
      resolve(result)

    } catch (error) {
      reject(error);
    }
  });

}

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

async function getResponseValueList(resultValue) {
  let result = {};
  let responseCode = resultValue.status;

  if (responseCode.toString().startsWith("2")) {
    let responseData = resultValue.data
    if (responseData['client-successfully-added'] == true) {
      result.success = true
    } else {
      result.success = false,
      result.reasonForFailure = `OKM_${responseData['reason-of-failure']}`;
    }
  } 
  else if (responseCode.toString() == "408") {
    result.success = false;
    result.reasonForFailure = "OKM_DID_NOT_REACH_ALT";
  } 
  else if (responseCode.toString().startsWith("5") || responseCode.toString().startsWith("4")) {
    result.success = false,
      result.reasonForFailure = "OKM_UNKNOWN";
  }

  return result;
}


exports.getOperationClientUuid = async function (forwardingName, applicationName, releaseNumber) {
  let forwardingConstruct = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync(
    forwardingName);
  let fcPortList = forwardingConstruct["fc-port"];
  for (let fcPort of fcPortList) {
    let fcPortDirection = fcPort["port-direction"];
    if (fcPortDirection == FcPort.portDirectionEnum.OUTPUT) {
      let fcLogicalTerminationPoint = fcPort["logical-termination-point"];
      let serverLtpList = await logicalTerminationPoint.getServerLtpListAsync(fcLogicalTerminationPoint);
      let httpClientUuid = serverLtpList[0];
      let applicationNameOfClient = await httpClientInterface.getApplicationNameAsync(httpClientUuid);
      let releaseNumberOfClient = await httpClientInterface.getReleaseNumberAsync(httpClientUuid);
      if (applicationNameOfClient == applicationName && releaseNumberOfClient == releaseNumber) {
        return fcLogicalTerminationPoint;
      }
    }
  }
  return undefined;
}