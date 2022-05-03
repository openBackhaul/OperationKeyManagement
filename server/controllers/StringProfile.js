'use strict';

var utils = require('../utils/writer.js');
var StringProfile = require('../service/StringProfileService');

module.exports.getStringProfileStringName = function getStringProfileStringName (req, res, next) {
  StringProfile.getStringProfileStringName()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getStringProfileStringValue = function getStringProfileStringValue (req, res, next) {
  StringProfile.getStringProfileStringValue()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putStringProfileStringValue = function putStringProfileStringValue (req, res, next, body) {
  StringProfile.putStringProfileStringValue(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
