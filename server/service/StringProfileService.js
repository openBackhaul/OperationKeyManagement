'use strict';

var fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

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
      await fileOperation.writeToDatabaseAsync(url, body, false);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

