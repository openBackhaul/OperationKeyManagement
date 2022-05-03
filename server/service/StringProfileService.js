'use strict';


/**
 * Returns the name of the String
 *
 * returns inline_response_200_8
 **/
exports.getStringProfileStringName = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "string-profile-1-0:string-name" : "operationMode"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Returns the configured value of the String
 *
 * returns inline_response_200_9
 **/
exports.getStringProfileStringValue = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "string-profile-1-0:string-value" : "string-profile-1-0:STRING_VALUE_TYPE_SANITATION"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Configures value of the String
 *
 * body Stringprofileconfiguration_stringvalue_body 
 * no response value expected for this operation
 **/
exports.putStringProfileStringValue = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

