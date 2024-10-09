function onOpen() {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu("Mark an Attendance")
		.addItem("Mark Cancelled", "markCancelled")
		.addItem("Mark Late Bail", "markLateBail")
		.addItem("Mark No Show", "markNoShow")
		.addSeparator()
		.addItem("Mark Cancelled by the Crew", "markCrewCancelled")
		.addSeparator()
		.addItem("Mark Duplicate", "markDuplicate")
		.addSeparator()
		.addItem("Mark Attended", "markAttended")
		.addSeparator()
		.addItem("Mark ALL Attended", "markAttendedAndCloseEvent")
		.addToUi();

	ui.createMenu("Refresh Matrix")
		.addItem("Refresh All", "readData")
		.addSeparator()
		.addItem("Refresh Diet", "refreshDiet")
		.addItem("Refresh Gear", "refreshGear")
		.addItem("Refresh Admin", "refreshAdmin")
		.addItem("Refresh Transport", "refreshTransport")
		.addItem("Refresh Buddy", "refreshBuddy")
		.addItem("Refresh Event Listing", "refreshEventListing")
		.addSeparator()
		.addItem("Refresh Event Listings", "eventListing")
		.addToUi();

	ui.createMenu("Event Management")
		.addItem("Open Event Spaces", "openEventSpaces")
		.addItem("Open Signup", "openSignup")
		.addItem("Close Signup", "closeSignup")
		.addItem("Cancel Whole Event", "cancelWholeEvent")
		.addToUi();
}

function refreshDiet() {
	const conn = Jdbc.getConnection(url, username, password);
	const stmt = conn.createStatement();
	readDiet(stmt);
	stmt.close();
	conn.close();
}

function refreshGear() {
	const conn = Jdbc.getConnection(url, username, password);
	const stmt = conn.createStatement();
	readGear(stmt);
	stmt.close();
	conn.close();
}

function refreshAdmin() {
	const conn = Jdbc.getConnection(url, username, password);
	const stmt = conn.createStatement();
	readAdmin(stmt);
	stmt.close();
	conn.close();
}

function refreshTransport() {
	const conn = Jdbc.getConnection(url, username, password);
	const stmt = conn.createStatement();
	readTransport(stmt);
	stmt.close();
	conn.close();
}

function refreshBuddy() {
	const conn = Jdbc.getConnection(url, username, password);
	const stmt = conn.createStatement();
	readBuddy(stmt);
	stmt.close();
	conn.close();
}

function refreshEventListing() {
	const conn = Jdbc.getConnection(url, username, password);
	const stmt = conn.createStatement();
	readEventListing(stmt);
	stmt.close();
	conn.close();
}
