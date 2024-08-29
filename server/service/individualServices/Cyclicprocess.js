const ProfileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
const onfAttributes = require('onf-core-model-ap/applicationPattern/onfModel/constants/OnfAttributes');
const LogicalTerminationPoint = require('onf-core-model-ap/applicationPattern/onfModel/models/LogicalTerminationPoint');
const httpClientInterface = require('onf-core-model-ap/applicationPattern/onfModel/models/layerProtocols/HttpClientInterface');
const profileConstants = require('../../utils/profileConstants');
const stringProfileService = require('../StringProfileService');
const HttpClient = require('../../utils/HttpClient');
const onfModelUtils = require("../../utils/OnfModelUtils");
const crypto = require('crypto');

exports.scheduleKeyRotation = async function scheduleKeyRotation() {
  const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
  if (operationModeValue === profileConstants.OPERATION_MODE_REACTIVE) {
    console.log(`Reccurent update of operation keys is disabled, "operationMode" is "${profileConstants.OPERATION_MODE_REACTIVE}".`);
    return;
  }
  let timeIntervalInSeconds;
  let profileList = await ProfileCollection.getProfileListAsync();
  for (let i = 0; i < profileList.length; i++) {
    let profileInstance = profileList[i];
    let profileName = profileInstance[onfAttributes.PROFILE.PROFILE_NAME];
    if (profileName == "integer-profile-1-0:PROFILE_NAME_TYPE_INTEGER_PROFILE") {
      let Integerval = profileInstance["integer-profile-1-0:integer-profile-pac"]['integer-profile-capability']['integer-name']
      if (Integerval == 'timeInterval') {
        timeIntervalInSeconds = profileInstance["integer-profile-1-0:integer-profile-pac"]["integer-profile-configuration"]["integer-value"]
        break;
      }
    }
  }

  setTimeout(reccurentUpdateKeys, timeIntervalInSeconds * 1000);
  console.log(`Update operation keys has been scheduled in ${timeIntervalInSeconds} seconds.`);
}

exports.updateKeys = async function () {
  const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES);
  const httpClient = new HttpClient();
  const linkUuidList = await fetchLinkUuidListFromAlt(httpClient);
  for (const linkUuid of linkUuidList) {
    await updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
      .catch((error) => console.log(`reccurentUpdateKeys - failed update key for link ${linkUuid} with error: ${error.message}`));
  }
}

async function reccurentUpdateKeys() {
  try {
    const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
    if (operationModeValue === profileConstants.OPERATION_MODE_REACTIVE) {
      // recurrentUpdateKeys has been scheduled but meanwhile operationMode changed and OKM should not update keys
      return;
    }

    const updateKeyOperationLtpUuidList = await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName(FC_CYCLIC_OPERATION_CAUSES_OPERATION_KEY_UPDATES);
    const httpClient = new HttpClient();
    const linkUuidList = await fetchLinkUuidListFromAlt(httpClient);
    let traceIndicatorIncrementer = 0;
    let existingTraceIndicator = httpClient.getTraceIndicator();
    let newTraceIndicator = existingTraceIndicator + "." + traceIndicatorIncrementer++;
    httpClient.setTraceIndicator(newTraceIndicator);
    for (const linkUuid of linkUuidList) {
      await updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient)
        .catch((error) => console.log(`reccurentUpdateKeys - failed update key for link ${linkUuid} with error: ${error.message}`));
      newTraceIndicator = existingTraceIndicator + "." + traceIndicatorIncrementer++;     
      httpClient.setTraceIndicator(newTraceIndicator);
    }
  } catch (error) {
    if (error == undefined) {
      throw new Error('unknown error');
    }
    console.log(`reccurentUpdateKeys - failed with error: ${error.message}`);
  } finally {
    exports.scheduleKeyRotation();
  }
}

async function fetchLinkUuidListFromAlt(httpClient) {
  let operationClientUuidOfListLinkUuids = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName("CyclicOperationCausesRequestForListOfLinks"))[0];
  const resp = await httpClient.executeOperation(operationClientUuidOfListLinkUuids);
  if (resp['link-uuid-list'] === undefined) {
    return [];
  }

  return resp['link-uuid-list'];
}

async function updateOperationKeyForLink(linkUuid, updateKeyOperationLtpUuidList, httpClient) {
    const linkEndpointList = await fetchLinkEndpointListFromAlt(linkUuid, httpClient);
    const operationModeValue = await stringProfileService.getOperationModeProfileStringValue();
    const operationKey = operationModeValue === profileConstants.OPERATION_MODE_OFF ? DEFAULT_OPERATION_KEY : generateOperationKey();
  
    let existingTraceIndicator = httpClient.getTraceIndicator();
    httpClient.setTraceIndicator(existingTraceIndicator + ".0");
    for (const linkEndpoint of linkEndpointList) {
      const epAppName = linkEndpoint['application-name'];
      const epAppReleaseNumber = linkEndpoint['release-number'];
      const epOperationUuid = linkEndpoint['operation-uuid'];
      if (!epAppName || !epAppReleaseNumber || !epOperationUuid) {
        console.log(`Ignoring endpoint ${JSON.stringify(linkEndpoint)} during update operation key for link ${linkUuid} because the endpoint is missing data.`);
        continue;
      }
  
      const updateKeyOperationLtpUuid = await resolveUpdateKeyOperationLtpUuidForApplication(epAppName, epAppReleaseNumber, updateKeyOperationLtpUuidList);
      if (updateKeyOperationLtpUuid) {
        await httpClient.executeOperation(updateKeyOperationLtpUuid, {
            "operation-uuid": epOperationUuid,
            "new-operation-key": operationKey
          })
          .then( () => 
            console.log(`Successfully updated operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid} for the trace ${httpClient.getTraceIndicator()}`))
          .catch(error => console.log(`Failed to update operation key for application ${epAppName} version ${epAppReleaseNumber} operation ${epOperationUuid} with error: ${error.message}`));
      } else {
        console.log(`Application ${epAppName} version ${epAppReleaseNumber} is not registered for key update. Skipping it during update operation key for link ${linkUuid}.`);
      }
    }
  }

  async function resolveUpdateKeyOperationLtpUuidForApplication(epAppName, epAppReleaseNumber, updateKeyOperationLtpUuidList) {
    for (const updateKeyOperationLtpUuid of updateKeyOperationLtpUuidList) {
      const httpLtpUuidList = await LogicalTerminationPoint.getServerLtpListAsync(updateKeyOperationLtpUuid);
      const httpLtpAppName = await httpClientInterface.getApplicationNameAsync(httpLtpUuidList[0]);
      const httpLtpAppReleaseNumber = await httpClientInterface.getReleaseNumberAsync(httpLtpUuidList[0]);
      if (isAppEqual(epAppName, epAppReleaseNumber, httpLtpAppName, httpLtpAppReleaseNumber)) {
        return updateKeyOperationLtpUuid;
      }
    }
    return null;
  }
  
  function isAppEqual(firstAppName, firstAppReleaseNumber, secondAppName, secondAppReleaseNumber) {
    if (firstAppName !== secondAppName) {
      return false;
    }
    if (firstAppReleaseNumber !== secondAppReleaseNumber) {
      return false;
    }
    return true;
  }
  async function fetchLinkEndpointListFromAlt(linkUuid, httpClient) {
    let operationClientUuidOfListEndPointsOfLink = (await onfModelUtils.getFcPortOutputDirectionLogicalTerminationPointListForForwardingName("CyclicOperationCausesRequestForLinkEndPoints"))[0];
    const resp = await httpClient.executeOperation(operationClientUuidOfListEndPointsOfLink, {
      'link-uuid': linkUuid
    });
    if (resp['link-end-point-list'] === undefined) {
      return [];
    }
  
    return resp['link-end-point-list'];
  }
  
  function generateOperationKey() {
    return crypto.randomUUID().replaceAll('-', '');
  }