'use strict';
const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const prepareForwardingAutomation = require('./individualServices/PrepareForwardingAutomation');
const ForwardingAutomationService = require('onf-core-model-ap/applicationPattern/onfModel/services/ForwardingConstructAutomationServices');

/**
 * Returns name of application to be addressed
 *
 * url String 
 * returns inline_response_200_40
 **/
exports.getHttpClientApplicationName = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "http-client-interface-1-0:application-name": value
  };
}

/**
 * Returns release number of application to be addressed
 *
 * url String 
 * returns inline_response_200_41
 **/
exports.getHttpClientReleaseNumber = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "http-client-interface-1-0:release-number": value
  };
}

/**
 * Configures name of application to be addressed
 *
 * body Httpclientinterfaceconfiguration_applicationname_body
 * url String
 * uuid String 
 * no response value expected for this operation
 **/
exports.putHttpClientApplicationName = async function (url, body, uuid) {
  const isUpdated = await fileOperation.writeToDatabaseAsync(url, body, false);
  if (isUpdated) {
    const forwardingAutomationInputList = await prepareForwardingAutomation.OAMLayerRequest(
      uuid
    );
    ForwardingAutomationService.automateForwardingConstructWithoutInputAsync(
      forwardingAutomationInputList
    );
  }
}

/**
 * Configures release number of application to be addressed
 *
 * body Httpclientinterfaceconfiguration_releasenumber_body 
 * uuid String
 * url String
 * no response value expected for this operation
 **/
exports.putHttpClientReleaseNumber = async function (url, body, uuid) {
  const isUpdated = await fileOperation.writeToDatabaseAsync(url, body, false);
  if (isUpdated) {
    const forwardingAutomationInputList = await prepareForwardingAutomation.OAMLayerRequest(
      uuid
    );
    ForwardingAutomationService.automateForwardingConstructWithoutInputAsync(
      forwardingAutomationInputList
    );
  }
}
