// @ts-check
'use strict';

var fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
var onfPaths = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfPaths');
var profileConstants = require('../utils/profileConstants');
var individualServicesService = require('./IndividualServicesService');

const operationModeStringValuePath = `${onfPaths.PROFILE}=okm-0-0-1-string-p-0000/string-profile-1-0:string-profile-pac/string-profile-configuration/string-value`;

/**
 * Returns the name of the String
 *
 * returns inline_response_200_8
 **/
exports.getStringProfileStringName = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      const value = await fileOperation.readFromDatabaseAsync(url);
      const response = {};
      response['application/json'] = {
        "string-profile-1-0:string-name": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}


/**
 * Returns the configured value of the String
 *
 * returns inline_response_200_9
 **/
exports.getStringProfileStringValue = function (url) {
  return new Promise(async function (resolve, reject) {
    try {
      const value = await fileOperation.readFromDatabaseAsync(url);
      const response = {};
      response['application/json'] = {
        "string-profile-1-0:string-value": value
      };
      if (Object.keys(response).length > 0) {
        resolve(response[Object.keys(response)[0]]);
      } else {
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}


/**
 * Configures value of the String
 *
 * body Stringprofileconfiguration_stringvalue_body 
 * no response value expected for this operation
 **/
exports.putStringProfileStringValue = function (body, url) {
  return new Promise(async function (resolve, reject) {
    try {
      const currentOperationModeValue = await exports.getOperationModeProfileStringValue();
      const newOperationModeValue = body['string-profile-1-0:string-value'];
      await fileOperation.writeToDatabaseAsync(url, body, false);
      console.log(`Profile "operationMode" changed from "${currentOperationModeValue}" to "${newOperationModeValue}"`);
      if (currentOperationModeValue === profileConstants.OPERATION_MODE_REACTIVE
        && newOperationModeValue !== profileConstants.OPERATION_MODE_REACTIVE) {
        individualServicesService.scheduleKeyRotation();
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Returns the configured value of the "operationMode" profile
 * @returns {Promise<string>}
 */
exports.getOperationModeProfileStringValue = async function() {
  return new Promise(async function (resolve, reject) {
    try {
      const value = await fileOperation.readFromDatabaseAsync(operationModeStringValuePath);
      resolve(value);
    } catch (err) {
      reject(err);
    }
  });
}