'use strict';

const IndividualServices = require('../service/IndividualServicesService');
const responseCodeEnum = require('onf-core-model-ap/applicationPattern/rest/server/ResponseCode');
const restResponseHeader = require('onf-core-model-ap/applicationPattern/rest/server/ResponseHeader');
const restResponseBuilder = require('onf-core-model-ap/applicationPattern/rest/server/ResponseBuilder');
const executionAndTraceService = require('onf-core-model-ap/applicationPattern/services/ExecutionAndTraceService');

module.exports.bequeathYourDataAndDie = async function bequeathYourDataAndDie(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  const startTime = process.hrtime();
  let responseCode;
  let responseBody;
  try {
    responseCode = responseCodeEnum.code.NO_CONTENT;
    responseBody = await IndividualServices.bequeathYourDataAndDie(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`bequeathYourDataAndDie - failed with error: ${error.message}`)
    responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
    responseBody = { 'message': error.message };
  }
  let responseHeader;
  try {
    responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`bequeathYourDataAndDie - create response header failed with error: ${error.message}`)
  }
  restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBody)
    .catch((error) => console.log(`bequeathYourDataAndDie - record service request ${JSON.stringify({ xCorrelator, traceIndicator, user, originator, reqUrl: req.url, responseCode, reqBody: req.body, responseBody })} failed with error: ${error.message}`));
};

module.exports.disregardApplication = async function disregardApplication(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  const startTime = process.hrtime();
  let responseCode;
  let responseBody;
  // TODO check apiKeyAuth in req.headers.authorization
  try {
    responseCode = responseCodeEnum.code.NO_CONTENT;
    responseBody = await IndividualServices.disregardApplication(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url)
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`disregardApplication - disregard application failed with error: ${error.message}`)
    responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
    responseBody = { 'message': error.message };
  }
  let responseHeader;
  try {
    responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`disregardApplication - create response header failed with error: ${error.message}`)
  }
  restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBody)
    .catch((error) => console.log(`disregardApplication - record service request ${JSON.stringify({ xCorrelator, traceIndicator, user, originator, reqUrl: req.url, responseCode, reqBody: req.body, responseBody })} failed with error: ${error.message}`));
};

module.exports.listApplications = async function listApplications(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  const startTime = process.hrtime();
  let responseCode;
  let responseBody;
  try {
    responseCode = responseCodeEnum.code.OK;
    responseBody = await IndividualServices.listApplications(user, originator, xCorrelator, traceIndicator, customerJourney);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`listApplications - list applications failed with error: ${error.message}`)
    responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
    responseBody = { 'message': error.message };
  }
  let responseHeader;
  try {
    responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`listApplications - create response header failed with error: ${error.message}`)
  }
  restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBody)
    .catch((error) => console.log(`listApplications - record service request ${JSON.stringify({ xCorrelator, traceIndicator, user, originator, reqUrl: req.url, responseCode, reqBody: req.body, responseBody })} failed with error: ${error.message}`));
};

module.exports.regardApplication = async function regardApplication(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  const startTime = process.hrtime();
  let responseCode;
  let responseBody;
  try {
    responseCode = responseCodeEnum.code.NO_CONTENT;
    responseBody = await IndividualServices.regardApplication(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`regardApplication - regard application failed with error: ${error.message}`)
    responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
    responseBody = { 'message': error.message };
  }
  let responseHeader;
  try {
    responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`regardApplication - create response header failed with error: ${error.message}`)
  }
  restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBody)
    .catch((error) => console.log(`regardApplication - record service request ${JSON.stringify({ xCorrelator, traceIndicator, user, originator, reqUrl: req.url, responseCode, reqBody: req.body, responseBody })} failed with error: ${error.message}`));
};

module.exports.regardUpdatedLink = async function regardUpdatedLink(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  const startTime = process.hrtime();
  let responseCode;
  let responseBody;
  try {
    responseCode = responseCodeEnum.code.NO_CONTENT;
    responseBody = await IndividualServices.regardUpdatedLink(body, user, originator, xCorrelator, traceIndicator, customerJourney)
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`regardUpdatedLink - regard updated link failed with error: ${error.message}`)
    responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
    responseBody = { 'message': error.message };
  }
  let responseHeader;
  try {
    responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`regardUpdatedLink - create response header failed with error: ${error.message}`)
  }
  restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBody)
    .catch((error) => console.log(`regardUpdatedLink - record service request ${JSON.stringify({ xCorrelator, traceIndicator, user, originator, reqUrl: req.url, responseCode, reqBody: req.body, responseBody })} failed with error: ${error.message}`));
};

module.exports.startApplicationInGenericRepresentation = async function startApplicationInGenericRepresentation(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  const startTime = process.hrtime();
  let responseCode;
  let responseBody;
  try {
    responseCode = responseCodeEnum.code.OK;
    responseBody = await IndividualServices.startApplicationInGenericRepresentation(user, originator, xCorrelator, traceIndicator, customerJourney);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`startApplicationInGenericRepresentation - failed with error: ${error.message}`)
    responseCode = responseCodeEnum.code.INTERNAL_SERVER_ERROR;
    responseBody = { 'message': error.message };
  }
  let responseHeader;
  try {
    responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
  } catch (error) {
    if (error == undefined) {
      error = new Error('unknown error');
    }
    console.log(`startApplicationInGenericRepresentation - create response header failed with error: ${error.message}`)
  }
  restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBody)
    .catch((error) => console.log(`startApplicationInGenericRepresentation - record service request ${JSON.stringify({ xCorrelator, traceIndicator, user, originator, reqUrl: req.url, responseCode, reqBody: req.body, responseBody })} failed with error: ${error.message}`));
};
