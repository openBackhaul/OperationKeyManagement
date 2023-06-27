'use strict';

const IndividualServices = require('../service/IndividualServicesService');
const responseCodeEnum = require('onf-core-model-ap/applicationPattern/rest/server/ResponseCode');
const restResponseHeader = require('onf-core-model-ap/applicationPattern/rest/server/ResponseHeader');
const restResponseBuilder = require('onf-core-model-ap/applicationPattern/rest/server/ResponseBuilder');
const executionAndTraceService = require('onf-core-model-ap/applicationPattern/services/ExecutionAndTraceService');

module.exports.bequeathYourDataAndDie = async function bequeathYourDataAndDie(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  try {
    let startTime = process.hrtime();
    let responseCode = responseCodeEnum.code.NO_CONTENT;
    let responseBodyToDocument = {};
    await IndividualServices.bequeathYourDataAndDie(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url)
      .then(async function (responseBody) {
        responseBodyToDocument = responseBody;
        let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
        restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
      })
      .catch(async function (responseBody) {
        let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
        let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
        responseCode = sentResp.code;
        responseBodyToDocument = sentResp.body;
      });
    executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
  } catch (error) {}
};

module.exports.disregardApplication = async function disregardApplication(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  try {
      let startTime = process.hrtime();
      let responseCode = responseCodeEnum.code.NO_CONTENT;
      let responseBodyToDocument = {};
      await IndividualServices.disregardApplication(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url)
        .then(async function (responseBody) {
          responseBodyToDocument = responseBody;
          let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
          restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
        })
        .catch(async function (responseBody) {
          let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
          let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
          responseCode = sentResp.code;
          responseBodyToDocument = sentResp.body;
        });
      executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
    } catch (error) {}
};

module.exports.listApplications = async function listApplications(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  try {
      let startTime = process.hrtime();
      let responseCode = responseCodeEnum.code.OK;
      let responseBodyToDocument = {};
      await IndividualServices.listApplications(user, originator, xCorrelator, traceIndicator, customerJourney)
        .then(async function (responseBody) {
          responseBodyToDocument = responseBody;
          let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
          restResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
        })
        .catch(async function (responseBody) {
          let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
          let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
          responseCode = sentResp.code;
          responseBodyToDocument = sentResp.body;
        });
      executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
    } catch (error) {}
};

module.exports.regardApplication = async function regardApplication(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  try {
      let startTime = process.hrtime();
      let responseCode = responseCodeEnum.code.NO_CONTENT;
      let responseBodyToDocument = undefined;
      await IndividualServices.regardApplication(body, user, originator, xCorrelator, traceIndicator, customerJourney, req.url)
        .then(async function (responseBody) {
          let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, responseBody.took);
          restResponseBuilder.buildResponse(res, responseCode, responseBodyToDocument, responseHeader);
        })
        .catch(async function (responseBody) {
          let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
          let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
          responseCode = sentResp.code;
          responseBodyToDocument = sentResp.body;
        });
      executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
    } catch (error) {}
};

module.exports.regardUpdatedLink = async function regardUpdatedLink(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  try {
    let startTime = process.hrtime();
    let responseCode = responseCodeEnum.code.NO_CONTENT;
    let responseBodyToDocument = undefined;
    await IndividualServices.regardUpdatedLink(body, user, originator, xCorrelator, traceIndicator, customerJourney)
      .then(async function (responseBody) {
        let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url, responseBody.took);
        restResponseBuilder.buildResponse(res, responseCode, responseBodyToDocument, responseHeader);
      })
      .catch(async function (responseBody) {
        let responseHeader = await restResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
        let sentResp = restResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
        responseCode = sentResp.code;
        responseBodyToDocument = sentResp.body;
      });
    executionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
  } catch (error) {}
};