const stringProfileService = require('./StringProfileService');
const fileOperation = require('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');
const ProfileCollection = require('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
const individualServicesService = require('./IndividualServicesService');

jest.mock('./IndividualServicesService');
jest.mock('onf-core-model-ap/applicationPattern/onfModel/models/ProfileCollection');
jest.mock('onf-core-model-ap/applicationPattern/databaseDriver/JSONDriver');

const stringProfile = {
	"uuid": "okm-2-0-1-string-p-000",
	"profile-name": "string-profile-1-0:PROFILE_NAME_TYPE_STRING_PROFILE",
	"string-profile-1-0:string-profile-pac": {
		"string-profile-capability": {
			"string-name": "operationMode",
			"enumeration": [
				"string-profile-1-0:STRING_VALUE_TYPE_REACTIVE",
				"string-profile-1-0:STRING_VALUE_TYPE_PROTECTION",
				"string-profile-1-0:STRING_VALUE_TYPE_OFF"
			]
		},
		"string-profile-configuration": {
			"string-value": "string-profile-1-0:STRING_VALUE_TYPE_REACTIVE"
		}
	}
};

beforeEach(() => {
	jest.spyOn(ProfileCollection, 'getProfileListForProfileNameAsync').mockImplementation(() => [stringProfile]);
})

test("getOperationModeProfileStringValue", async () => {
	expect(await stringProfileService.getOperationModeProfileStringValue()).toBe("string-profile-1-0:STRING_VALUE_TYPE_REACTIVE");
});

test("putStringProfileStringValue -- with key rotation", async () => {
	const input = {
		"string-profile-1-0:string-value": "string-profile-1-0:STRING_VALUE_TYPE_OFF"
	};
	await stringProfileService.putStringProfileStringValue(input, "foo");
	expect(fileOperation.writeToDatabaseAsync).toBeCalledWith("foo", input, false);
	expect(individualServicesService.scheduleKeyRotation).toHaveBeenCalled();
});

test("putStringProfileStringValue -- without key rotation", async () => {
	const input = {
		"string-profile-1-0:string-value": "string-profile-1-0:STRING_VALUE_TYPE_REACTIVE"
	};
	await stringProfileService.putStringProfileStringValue(input, "foo");
	expect(fileOperation.writeToDatabaseAsync).toBeCalledWith("foo", input, false);
	expect(individualServicesService.scheduleKeyRotation).not.toHaveBeenCalled();
});

afterEach(() => {
	jest.resetAllMocks();
});
