//@ts-check
'use strict';

var BasicServices = require('onf-core-model-ap-bs/basicServices/BasicServicesService');
var responseCodeEnum = require('onf-core-model-ap/applicationPattern/rest/server/ResponseCode');
var RestResponseHeader = require('onf-core-model-ap/applicationPattern/rest/server/ResponseHeader');
var RestResponseBuilder = require('onf-core-model-ap/applicationPattern/rest/server/ResponseBuilder');
var ExecutionAndTraceService = require('onf-core-model-ap/applicationPattern/services/ExecutionAndTraceService');
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const ForwardingDomain = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingDomain');
const ForwardingConstruct = require('onf-core-model-ap/applicationPattern/onfModel/models/ForwardingConstruct');
const httpServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const logicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');


const NEW_RELEASE_FORWARDING_NAME = 'PromptForBequeathingDataCausesTransferOfListOfApplications';

module.exports.disposeRemaindersOfDeregisteredApplication = function disposeRemaindersOfDeregisteredApplication (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  BasicServices.disposeRemaindersOfDeregisteredApplication(body, user, originator, xCorrelator, traceIndicator, customerJourney)
  .then(async function (responseBody) {
    responseBodyToDocument = responseBody;
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  })
  .catch(async function (responseBody) {
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
    responseCode = sentResp.code;
    responseBodyToDocument = sentResp.body;
  });
ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};


module.exports.embedYourself = async function embedYourself(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.embedYourself(body, user, xCorrelator, traceIndicator, customerJourney, req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.endSubscription = async function endSubscription(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.endSubscription(body, user, xCorrelator, traceIndicator, customerJourney, req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.informAboutPrecedingRelease = function informAboutPrecedingRelease (req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  BasicServices.informAboutPrecedingRelease(user, originator, xCorrelator, traceIndicator, customerJourney)
  .then(async function (responseBody) {
    responseBodyToDocument = responseBody;
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  })
  .catch(async function (responseBody) {
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
    responseCode = sentResp.code;
    responseBodyToDocument = sentResp.body;
  });
ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.startApplicationInGenericRepresentation = async function startApplicationInGenericRepresentation(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await BasicServices.startApplicationInGenericRepresentation(req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.informAboutApplication = async function informAboutApplication(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await BasicServices.informAboutApplication()
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.informAboutApplicationInGenericRepresentation = async function informAboutApplicationInGenericRepresentation(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await BasicServices.informAboutApplicationInGenericRepresentation(req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.inquireBasicAuthRequestApprovals = function inquireBasicAuthRequestApprovals (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  BasicServices.inquireBasicAuthRequestApprovals(body, user, xCorrelator, traceIndicator, customerJourney, req.url,NEW_RELEASE_FORWARDING_NAME)
  .then(async function (responseBody) {
    responseBodyToDocument = responseBody;
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  })
  .catch(async function (responseBody) {
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
    responseCode = sentResp.code;
    responseBodyToDocument = sentResp.body;
  });
ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.informAboutReleaseHistory = async function informAboutReleaseHistory(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await BasicServices.informAboutReleaseHistory()
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.informAboutReleaseHistoryInGenericRepresentation = async function informAboutReleaseHistoryInGenericRepresentation(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await BasicServices.informAboutReleaseHistoryInGenericRepresentation(req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.inquireOamRequestApprovals = async function inquireOamRequestApprovals(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.inquireOamRequestApprovals(body, user, xCorrelator, traceIndicator, customerJourney, req.url, NEW_RELEASE_FORWARDING_NAME)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.listLtpsAndFcs = async function listLtpsAndFcs(req, res, next, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await BasicServices.listLtpsAndFcs()
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.redirectOamRequestInformation = async function redirectOamRequestInformation(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.redirectOamRequestInformation(body, user, xCorrelator, traceIndicator, customerJourney, req.url, NEW_RELEASE_FORWARDING_NAME)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.UpdateClientOfSubsequentRelease = function UpdateClientOfSubsequentRelease (req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  BasicServices.updateClientOfSubsequentRelease(body, user, xCorrelator, traceIndicator, customerJourney, req.url,NEW_RELEASE_FORWARDING_NAME)
  .then(async function (responseBody) {
    responseBodyToDocument = responseBody;
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
  })
  .catch(async function (responseBody) {
    let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
    let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
    responseCode = sentResp.code;
    responseBodyToDocument = sentResp.body;
  });
ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};


module.exports.redirectServiceRequestInformation = async function redirectServiceRequestInformation(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.redirectServiceRequestInformation(body, user, xCorrelator, traceIndicator, customerJourney, req.url, NEW_RELEASE_FORWARDING_NAME)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.redirectTopologyChangeInformation = async function redirectTopologyChangeInformation(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.OK;
  let responseBodyToDocument = {};
  await BasicServices.redirectTopologyChangeInformation(body, user, xCorrelator, traceIndicator, customerJourney, req.url, NEW_RELEASE_FORWARDING_NAME)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.registerYourself = async function registerYourself(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  if (Object.keys(req.body).length === 0) {
    body = req.body;
    user = req.headers["user"];
    originator = req.headers["originator"];
    xCorrelator = req.headers["x-correlator"];
    traceIndicator = req.headers["trace-indicator"];
    customerJourney = req.headers["customer-journey"];
  }
  await BasicServices.registerYourself(body, user, xCorrelator, traceIndicator, customerJourney, req.url)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.updateClient = async function updateClient(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.updateClient(body, user, xCorrelator, traceIndicator, customerJourney, req.url, NEW_RELEASE_FORWARDING_NAME)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.updateOperationClient = async function updateOperationClient(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.updateOperationClient(body, user, xCorrelator, traceIndicator, customerJourney, req.url, NEW_RELEASE_FORWARDING_NAME)
    .then(async function (responseBody) {
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};

module.exports.updateOperationKey = async function updateOperationKey(req, res, next, body, user, originator, xCorrelator, traceIndicator, customerJourney) {
  let startTime = process.hrtime();
  let responseCode = responseCodeEnum.code.NO_CONTENT;
  let responseBodyToDocument = {};
  await BasicServices.updateOperationKey(body)
    .then(async function (responseBody) {
      let uuidToBeUpdated = body["operation-uuid"];
      let operationServerOfUpdateOperationKeyInOKM = await operationServerInterface.getOperationServerUuidAsync(req.url)
      // get application name
      let serverApplicationName =  await httpServerInterface.getApplicationNameAsync()      
      if (uuidToBeUpdated == operationServerOfUpdateOperationKeyInOKM) {
        let operationClientUuid = await getOperationClientUuidForUpdatingOperationKey(serverApplicationName)
        let requestBodyToUpdateOperationClient = {
          "operation-uuid": operationClientUuid,
          "new-operation-key": body["new-operation-key"]
        }
        await BasicServices.updateOperationKey(requestBodyToUpdateOperationClient);
      }
      responseBodyToDocument = responseBody;
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      RestResponseBuilder.buildResponse(res, responseCode, responseBody, responseHeader);
    })
    .catch(async function (responseBody) {
      let responseHeader = await RestResponseHeader.createResponseHeader(xCorrelator, startTime, req.url);
      let sentResp = RestResponseBuilder.buildResponse(res, undefined, responseBody, responseHeader);
      responseCode = sentResp.code;
      responseBodyToDocument = sentResp.body;
    });
  ExecutionAndTraceService.recordServiceRequest(xCorrelator, traceIndicator, user, originator, req.url, responseCode, req.body, responseBodyToDocument);
};


async function getOperationClientUuidForUpdatingOperationKey(serverApplicationName) {
  let ForwardConstructName = await ForwardingDomain.getForwardingConstructForTheForwardingNameAsync("LinkUpdateNotificationCausesOperationKeyUpdates")
  let ForwardConstructUuid = ForwardConstructName.uuid
  let OutputFcPorts = await ForwardingConstruct.getOutputFcPortsAsync(ForwardConstructUuid)
  let OutputFcPortsLtps = []
  OutputFcPorts.forEach((OutputFcPortValue, OutputFcPortKey) => {
    OutputFcPortsLtps[OutputFcPortKey] = OutputFcPortValue['logical-termination-point']
  })

  for(let OutputFcPortsLtpsIndex = 0; OutputFcPortsLtpsIndex < OutputFcPortsLtps.length; OutputFcPortsLtpsIndex++){
    let httpClientUuidList =  await logicalTerminationPoint.getServerLtpListAsync(OutputFcPortsLtps[OutputFcPortsLtpsIndex]);
    let clientApplicationName = await httpClientInterface.getApplicationNameAsync(httpClientUuidList[0])
    if(clientApplicationName === serverApplicationName){
      return OutputFcPortsLtps[OutputFcPortsLtpsIndex]
    }
  }
}