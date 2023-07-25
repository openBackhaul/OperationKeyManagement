// @ts-check
'use strict';

const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const profileConstants = require('../utils/profileConstants');
const individualServicesService = require('./IndividualServicesService');
const ProfileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
const Profile = require('onf-core-model-ap/applicationPattern/onfModel/models/Profile');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const createHttpError = require('http-errors');

/**
 * Returns the enumeration values of the String
 *
 * uuid String 
 * returns inline_response_200_18
 **/
exports.getStringProfileEnumeration = async function (url) {
  let value = await fileOperation.readFromDatabaseAsync(url);
  if (!value) {
    value = [];
  }
  return {
    "string-profile-1-0:enumeration": value
  };
}


/**
 * Returns the pattern of the String
 *
 * uuid String 
 * returns inline_response_200_19
 **/
exports.getStringProfilePattern = async function (url) {
  let value = await fileOperation.readFromDatabaseAsync(url);
  if (!value) {
    value = "";
  }
  return {
    "string-profile-1-0:pattern": value
  };
}


/**
 * Returns the name of the String
 *
 * returns inline_response_200_17
 **/
exports.getStringProfileStringName = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "string-profile-1-0:string-name": value
  };
}


/**
 * Returns the configured value of the String
 *
 * * returns inline_response_200_20
 **/
exports.getStringProfileStringValue = async function (url) {
  const value = await fileOperation.readFromDatabaseAsync(url);
  return {
    "string-profile-1-0:string-value": value
  };
}


/**
 * Configures value of the String
 *
 * body Stringprofileconfiguration_stringvalue_body 
 * no response value expected for this operation
 **/
exports.putStringProfileStringValue = async function (body, url) {
  const currentOperationModeValue = await exports.getOperationModeProfileStringValue();
  const newOperationModeValue = body['string-profile-1-0:string-value'];
  await fileOperation.writeToDatabaseAsync(url, body, false);
  console.log(`Profile "operationMode" changed from "${currentOperationModeValue}" to "${newOperationModeValue}"`);
  if (currentOperationModeValue === profileConstants.OPERATION_MODE_REACTIVE &&
    newOperationModeValue !== profileConstants.OPERATION_MODE_REACTIVE) {
    individualServicesService.scheduleKeyRotation();
  }
  if(currentOperationModeValue === profileConstants.OPERATION_MODE_OFF &&
    newOperationModeValue === profileConstants.OPERATION_MODE_REACTIVE) {
        individualServicesService.updateKeys();
    }
}

/**
 * Returns the configured value of the "operationMode" profile
 * @returns {Promise<String>}
 */
exports.getOperationModeProfileStringValue = async function () {
  let profiles = await ProfileCollection.getProfileListForProfileNameAsync(Profile.profileNameEnum.STRING_PROFILE);
  for (let profile of profiles) {
    let pac = profile[onfAttributes.STRING_PROFILE.PAC];
    let capability = pac[onfAttributes.STRING_PROFILE.CAPABILITY];
    if ("operationMode" === capability[onfAttributes.STRING_PROFILE.STRING_NAME]) {
      let configuration = pac[onfAttributes.STRING_PROFILE.CONFIGURATION];
      return configuration[onfAttributes.STRING_PROFILE.STRING_VALUE];
    }
  }
  throw new createHttpError.InternalServerError("OperationMode String profile not found.");
}