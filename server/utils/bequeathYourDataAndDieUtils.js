'use strict';

const ltpServerConstants = require("./ltpServerConstants");
const ltpClientConstants = require("./ltpClientConstants");
const LogicalTerminationPoint = require('../applicationPattern/onfModel/models/LogicalTerminationPoint');
const TcpClientInterface = require('../applicationPattern/onfModel/models/layerProtocols/TcpClientInterface');
const HttpClientInterface = require('../applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const HttpServerInterface = require('../applicationPattern/onfModel/models/layerProtocols/HttpServerInterface');
const OperationServerInterface = require('../applicationPattern/onfModel/models/layerProtocols/OperationServerInterface');
const ForwardingConstruct = require('../applicationPattern/onfModel/models/ForwardingConstruct');
const OperationClientInterface = require("../applicationPattern/onfModel/models/layerProtocols/OperationClientInterface");

const FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES_UUID = 'okm-0-0-1-op-fc-3001';

exports.promptForBequeathingDataCausesTransferOfListOfApplications = async function promptForBequeathingDataCausesTransferOfListOfApplications(httpClient) {
  const regardApplicationList = await resolveRegardApplicationList();
  const promiseList = [];
  for (const regardApplication of regardApplicationList) {
    const promise = httpClient.executeOperation(ltpClientConstants.HTTP_NEW_RELEASE_OPERATION_REGARD_APPLICATION, regardApplication);
    promiseList.push(promise);
  }
  return Promise.all(promiseList);
}

async function resolveRegardApplicationList() {
  const clientOperationLtpUuidList = await ForwardingConstruct.getFcPortOutputDirectionLogicalTerminationPointListForTheUuid(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES_UUID);
  const resultList = [];
  for (const clientOperationLtpUuid of clientOperationLtpUuidList) {
    const httpLtpUuids = await LogicalTerminationPoint.getServerLtpList(clientOperationLtpUuid);
    const httpLtpUuid = httpLtpUuids[0];  // operation has always one http server-ltp
    const appName = await HttpClientInterface.getApplicationName(httpLtpUuid);
    const appReleaseNumber = await HttpClientInterface.getReleaseNumber(httpLtpUuid);
    const tcpLtpUuids = await LogicalTerminationPoint.getServerLtpList(httpLtpUuid);
    const tcpLtpUuid = tcpLtpUuids[0]; // http has always one tcp server-ltp
    const remoteAddress = await TcpClientInterface.getRemoteAddress(tcpLtpUuid);
    const remotePort = await TcpClientInterface.getRemotePort(tcpLtpUuid);
    const resultObj = {
      'application-name': appName,
      'application-release-number': appReleaseNumber,
      'application-address': remoteAddress,
      'application-port': remotePort
    }
    resultList.push(resultObj);
  }
  return resultList;
}

exports.promptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease = async function promptForBequeathingDataCausesRObeingRequestedToNotifyApprovalsOfNewApplicationsToNewRelease(httpClient) {
  const thisAppName = await HttpServerInterface.getApplicationName();
  const newReleaseNumber = await HttpClientInterface.getReleaseNumber(ltpClientConstants.HTTP_NEW_RELEASE);
  const operationName = await OperationServerInterface.getOperationName(ltpServerConstants.HTTP_THIS_OPERATION_REGARD_APPLICATION);
  const newReleaseAddress = await TcpClientInterface.getRemoteAddress(ltpClientConstants.TCP_NEW_RELEASE);
  const newReleasePort = await TcpClientInterface.getRemotePort(ltpClientConstants.TCP_NEW_RELEASE);
  const body = {
    'subscriber-application': thisAppName,
    'subscriber-release-number': newReleaseNumber,
    'subscriber-operation': operationName,
    'subscriber-address': newReleaseAddress,
    'subscriber-port': newReleasePort
  }
  return httpClient.executeOperation(ltpClientConstants.HTTP_RO_OPERATION_NOTIFY_APPROVALS, body);
}

exports.promptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease = async function promptForBequeathingDataCausesRObeingRequestedToNotifyWithdrawnApprovalsToNewRelease(httpClient) {
  const thisAppName = await HttpServerInterface.getApplicationName();
  const newReleaseNumber = await HttpClientInterface.getReleaseNumber(ltpClientConstants.HTTP_NEW_RELEASE);
  const operationName = await OperationServerInterface.getOperationName(ltpServerConstants.HTTP_THIS_OPERATION_DISREGARD_APPLICATION);
  const newReleaseAddress = await TcpClientInterface.getRemoteAddress(ltpClientConstants.TCP_NEW_RELEASE);
  const newReleasePort = await TcpClientInterface.getRemotePort(ltpClientConstants.TCP_NEW_RELEASE);
  const body = {
    'subscriber-application': thisAppName,
    'subscriber-release-number': newReleaseNumber,
    'subscriber-operation': operationName,
    'subscriber-address': newReleaseAddress,
    'subscriber-port': newReleasePort
  }
  return httpClient.executeOperation(ltpClientConstants.HTTP_RO_OPERATION_NOTIFY_WITHDRAWN_APPROVALS, body);
}

exports.promptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease = async function promptForBequeathingDataCausesALTbeingRequestedToNotifyLinkUpdatesToNewRelease(httpClient) {
  const thisAppName = await HttpServerInterface.getApplicationName();
  const newReleaseNumber = await HttpClientInterface.getReleaseNumber(ltpClientConstants.HTTP_NEW_RELEASE);
  const operationName = await OperationServerInterface.getOperationName(ltpServerConstants.HTTP_THIS_OPERATION_REGARD_UPDATED_LINK);
  const newReleaseAddress = await TcpClientInterface.getRemoteAddress(ltpClientConstants.TCP_NEW_RELEASE);
  const newReleasePort = await TcpClientInterface.getRemotePort(ltpClientConstants.TCP_NEW_RELEASE);
  const body = {
    'subscriber-application': thisAppName,
    'subscriber-release-number': newReleaseNumber,
    'subscriber-operation': operationName,
    'subscriber-address': newReleaseAddress,
    'subscriber-port': newReleasePort
  }
  return httpClient.executeOperation(ltpClientConstants.HTTP_ALT_OPERATION_NOTIFY_LINK_UPDATES, body);
}

exports.promptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease = async function promptForBequeathingDataCausesRObeingRequestedToStopNotificationsToOldRelease(httpClient) {
  const thisAppName = await HttpServerInterface.getApplicationName();
  const oldReleaseNumber = await HttpClientInterface.getReleaseNumber(ltpClientConstants.HTTP_OLD_RELEASE);
  const notifyApprovalsOperationName = await OperationClientInterface.getOperationName(ltpClientConstants.HTTP_RO_OPERATION_NOTIFY_APPROVALS);
  const notifyApprovalsOperationBody = {
    'subscriber-application': thisAppName,
    'subscriber-release-number': oldReleaseNumber,
    'subscription': notifyApprovalsOperationName
  }
  const endSubscriptionForNofityApprovalsPromise = httpClient.executeOperation(ltpClientConstants.HTTP_RO_OPERATION_END_SUBSCRIPTION, notifyApprovalsOperationBody);

  const notifyWithdrawnApprovalsOperationName = await OperationClientInterface.getOperationName(ltpClientConstants.HTTP_RO_OPERATION_NOTIFY_WITHDRAWN_APPROVALS);
  const notifyWithdrawnApprovalsOperationBody = {
    'subscriber-application': thisAppName,
    'subscriber-release-number': oldReleaseNumber,
    'subscription': notifyWithdrawnApprovalsOperationName
  }
  const endSubscriptionForNofityWithdrawnApprovalsPromise = httpClient.executeOperation(ltpClientConstants.HTTP_RO_OPERATION_END_SUBSCRIPTION, notifyWithdrawnApprovalsOperationBody);

  return Promise.all([endSubscriptionForNofityApprovalsPromise, endSubscriptionForNofityWithdrawnApprovalsPromise]);
}

exports.promptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease = async function promptForBequeathingDataCausesALTbeingRequestedToStopNotificationsToOldRelease(httpClient) {
  const thisAppName = await HttpServerInterface.getApplicationName();
  const oldReleaseNumber = await HttpClientInterface.getReleaseNumber(ltpClientConstants.HTTP_OLD_RELEASE);
  const operationName = await OperationClientInterface.getOperationName(ltpClientConstants.HTTP_ALT_OPERATION_NOTIFY_LINK_UPDATES);
  const body = {
    'subscriber-application': thisAppName,
    'subscriber-release-number': oldReleaseNumber,
    'subscription': operationName
  }
  return httpClient.executeOperation(ltpClientConstants.HTTP_ALT_OPERATION_END_SUBSCRIPTION, body);
}

exports.promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement = async function promptForBequeathingDataCausesRequestForBroadcastingInfoAboutServerReplacement(httpClient) {
  const thisAppName = await HttpServerInterface.getApplicationName();
  const oldReleaseNumber = await HttpClientInterface.getReleaseNumber(ltpClientConstants.HTTP_OLD_RELEASE);
  const newReleaseNumber = await HttpClientInterface.getReleaseNumber(ltpClientConstants.HTTP_NEW_RELEASE);
  const newReleaseAddress = await TcpClientInterface.getRemoteAddress(ltpClientConstants.TCP_NEW_RELEASE);
  const newReleasePort = await TcpClientInterface.getRemotePort(ltpClientConstants.TCP_NEW_RELEASE);
  const body = {
    'application-name': thisAppName,
    'old-application-release-number': oldReleaseNumber,
    'new-application-release-number': newReleaseNumber,
    'new-application-address': newReleaseAddress,
    'new-application-port': newReleasePort
  }
  return httpClient.executeOperation(ltpClientConstants.HTTP_RO_OPERATION_RELAY_SERVER_REPLACEMENT, body);
}

exports.promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease = async function promptForBequeathingDataCausesRequestForDeregisteringOfOldRelease(httpClient) {
  const thisAppName = await HttpServerInterface.getApplicationName();
  const thisAppReleaseNumber = await HttpServerInterface.getReleaseNumber();
  const body = {
    'application-name': thisAppName,
    'application-release-number': thisAppReleaseNumber,
  }
  return httpClient.executeOperation(ltpClientConstants.HTTP_RO_OPERATION_DEREGISTER_APPLICATION, body);
}
