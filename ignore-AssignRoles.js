function assignLiftSharingCoordinator() {
	var volunteerrole = "Lift Sharing Coordinator";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "transport_coordinator";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignActivitesCoordinator() {
	var volunteerrole = "Climbing & Activities Coordinator";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "climbing_coordinator";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignKitCoordinator() {
	var volunteerrole = "Gear and Kit Coordinator";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "kit_coordinator";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignBuddyCoordinator() {
	var volunteerrole = "Buddy Coordinator";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "buddy_coordinator";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignTripReporter() {
	var volunteerrole = "Trip Reporter";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "postpromo1";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignBreakfastMarshal() {
	var volunteerrole = "Breakfast Marshal";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "breakfast_marshal";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignLunchMarshal() {
	var volunteerrole = "Lunch Marshal";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "lunch_marshal";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignCovidMarshal() {
	var volunteerrole = "Covid Marshal";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "covid_marshal";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignEveningMealWashingUpMarshal() {
	var volunteerrole = "Evening Meal Washing Up Marshal";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "evening_meal_washingup_marshal";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignHeadChef() {
	var volunteerrole = "Head Chef";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "head_chef";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignEveningMealChef() {
	var volunteerrole = "Evening Meal Chef";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "evening_meal_chef";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignLunchAndBreakfastChef() {
	var volunteerrole = "Lunch and Breakfast Chef";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "lunch_breakfast_chef";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignTripDirector() {
	var volunteerrole = "Trip Director";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "trip_director";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignAssistantTripDirector() {
	var volunteerrole = "Assistant Trip Director";
	var metakey = "cc_volunteer";
	var orderstatus = "on-hold";
	var metavalue = "event_assistant";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function markVolunteerClear() {
	var volunteerrole = "No Role";
	var metakey = "cc_volunteer";
	var orderstatus = "processing";
	var metavalue = "none";

	assignRole(volunteerrole, orderstatus, metakey, metavalue);
}

function assignRole(volunteerrole, orderstatus, metakey, metavalue) {
	var spreadsheet = SpreadsheetApp.getActive();
	var sheet = spreadsheet.getSheetByName("Volunteering");
	var active_range = sheet.getActiveRange();
	var currentRow = active_range.getRowIndex();
	//var currentRow = "5";
	console.log(currentRow);

	if (currentRow <= 1) {
		Browser.msgBox("Select an actual signup", Browser.Buttons.OK);
		return;
	}
	if (currentRow >= 100) {
		Browser.msgBox("Select an actual signup", Browser.Buttons.OK);
		return;
	}

	var order_id = sheet.getRange(currentRow, 26, 1, 1).getValue(); /// get submission ID 1 BV ( was 67)
	var first_name = sheet.getRange(currentRow, 1, 1, 1).getValue(); /// get submission ID 1 BV ( was 67)

	console.log(order_id);

	if (order_id === "" || order_id === "order_id") {
		Browser.msgBox("No Order ID Found", Browser.Buttons.OK);
		return;
	}

	/**
  var encodedAuthInformation = Utilities.base64Encode(apiusername+ ":" + apipassword);
  var headers = {"Authorization" : "Basic " + encodedAuthInformation};
  var options = {
  'method' : 'get',
  'contentType': 'application/json',
    'headers': headers,  // Convert the JavaScript object to a JSON string.
  'payload' : JSON.stringify(data)
};
url="https://www."+ apidomain + "/wp-json/wc/v3/orders/" + order_id

var response = UrlFetchApp.fetch(url, options);
  console.log(response);
 */

	if (
		Browser.msgBox(
			"Assign " +
				volunteerrole +
				" to " +
				first_name +
				"? \n Order " +
				order_id,
			Browser.Buttons.OK_CANCEL,
		) == "ok"
	) {
		const datetime = Date.now();

		var cc_role_assigner = Session.getActiveUser().getEmail();

		var data = {
			meta_data: [
				{ key: metakey, value: metavalue },
				{ key: "cc_volunteer_role_assigned_by", value: cc_role_assigner },
				{ key: "cc_volunteer_role_assigned_at", value: datetime },
			],
			status: orderstatus,
		};
		console.log(orderstatus);

		var encodedAuthInformation = Utilities.base64Encode(
			apiusername + ":" + apipassword,
		);
		var headers = { Authorization: "Basic " + encodedAuthInformation };
		var options = {
			method: "post",
			contentType: "application/json",
			headers: headers, // Convert the JavaScript object to a JSON string.
			payload: JSON.stringify(data),
		};
		url = "https://www." + apidomain + "/wp-json/wc/v3/orders/" + order_id;

		var response = UrlFetchApp.fetch(url, options);
		console.log(response);

		const assignedrole = [[metavalue]];
		sheet.getRange(currentRow, 3, 1, 1).setValues(assignedrole); // paste the blank variables into the cells to delete contents
	}
}
