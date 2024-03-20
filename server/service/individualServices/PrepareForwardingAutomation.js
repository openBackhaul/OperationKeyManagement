const prepareALTForwardingAutomation = require('onf-core-model-ap-bs/basicServices/services/PrepareALTForwardingAutomation');

const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const HttpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const onfAttributeFormatter = require('onf-core-model-ap/applicationPattern/onfModel/utility/OnfAttributeFormatter');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const FcPort = require('onf-core-model-ap/applicationPattern/onfModel/models/FcPort');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');

const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes')
const eventDispatcher = require('onf-core-model-ap/applicationPattern/rest/client/eventDispatcher');

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

exports.CreateLinkForUpdatingOperationKeys = async function (applicationName, applicationReleaseNumber, user, xCorrelator, traceIndicator, customerJourney,) {
  return new Promise(async function (resolve, reject) {
    try {

      let result;
      let CreateLinkForUpdatingOperationKeysForwardingName = "NewApplicationCausesRequestsForUpdatingOperationKeys.CreateLinkForUpdatingOperationKeys";
      let CreateLinkForUpdatingOperationKeysRequestBody = {};

      CreateLinkForUpdatingOperationKeysRequestBody.servingApplicationName = applicationName;
      CreateLinkForUpdatingOperationKeysRequestBody.servingApplicationReleaseNumber = applicationReleaseNumber;
      CreateLinkForUpdatingOperationKeysRequestBody.operationName = await operationServerInterface.getOperationNameAsync("okm-2-1-0-op-s-bm-010");
      CreateLinkForUpdatingOperationKeysRequestBody.consumingApplicationName = await HttpServerInterface.getApplicationNameAsync();
      CreateLinkForUpdatingOperationKeysRequestBody.consumingApplicationReleaseNumber = await HttpServerInterface.getReleaseNumberAsync();

      CreateLinkForUpdatingOperationKeysRequestBody = onfAttributeFormatter.modifyJsonObjectKeysToKebabCase(CreateLinkForUpdatingOperationKeysRequestBody);

      result = await forwardRequest(
        CreateLinkForUpdatingOperationKeysForwardingName,
        CreateLinkForUpdatingOperationKeysRequestBody,
        user,
        xCorrelator,
        traceIndicator,
        customerJourney
      );

      resolve(result)

    }
    catch (error) {
      reject(error);
    }
  });

}


exports.RollBackInCaseOfTimeOut = async function (applicationName, appReleaseNumber, user, xCorrelator, traceIndicator, customerJourney,) {
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

    }
    catch (error) {
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