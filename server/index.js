// @ts-check
'use strict';

var path = require('path');
var http = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = 8080;

const authorizingService = require('onf-core-model-ap-bs/basicServices/AuthorizingService');
const individualServicesService = require('./service/IndividualServicesService')
const operationServerInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');

async function validateOperationKey(request, scopes, securitySchema) {
    const operationUuid = await operationServerInterface.getOperationServerUuidAsync(request.url);
    const operationKeyFromLoadfile = await operationServerInterface.getOperationKeyAsync(operationUuid);
    const isAuthorized = operationKeyFromLoadfile === request.headers['operation-key'];
    return isAuthorized;
}

async function validateBasicAuth(request, scopes, schema) {
    const isAuthorized = await authorizingService.isAuthorized(request.headers.authorization, request.method);
    return isAuthorized;
}

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    openApiValidator: {
        validateResponses: true,
        validateSecurity: {
            handlers: {
                apiKeyAuth: validateOperationKey,
                basicAuth: validateBasicAuth
            }
        }
    }
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();
// format all json responses written via res.json()
app.set('json spaces', 2);

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

//setting the path to the database 
global.databasePath = './database/load.json'

individualServicesService.scheduleKeyRotation(5); // update operation key every 5 minutes