function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Mark an Attendance')
      .addItem('Mark Cancelled', 'markCancelled')
      .addItem('Mark Late Bail', 'markLateBail')
      .addItem('Mark No Show', 'markNoShow')
      .addSeparator()
      .addItem('Mark Duplicate', 'markDuplicate')
      .addSeparator()
      .addItem('Mark Attended', 'markAttended')
      .addSeparator()
      .addItem('Mark ALL Attended', 'markAttendedAndCloseEvent')
      .addToUi();

  ui.createMenu('Refresh Matrix')
      .addItem('Refresh All', 'readData')
      .addSeparator()
      .addItem('Refresh Diet', 'refreshDiet')
      .addItem('Refresh Gear', 'refreshGear')
      .addItem('Refresh Admin', 'refreshAdmin')
      .addItem('Refresh Transport', 'refreshTransport')
      .addItem('Refresh Buddy', 'refreshBuddy')
      .addSeparator()
      .addItem('Refresh Event Listings', 'eventListing')
      .addToUi();
}

function refreshDiet() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readDiet(stmt);
  stmt.close();
  conn.close();
}

function refreshGear() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readGear(stmt);
  stmt.close();
  conn.close();
}

function refreshAdmin() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readAdmin(stmt);
  stmt.close();
  conn.close();
}

function refreshTransport() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readTransport(stmt);
  stmt.close();
  conn.close();
}

function refreshBuddy() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readBuddy(stmt);
  stmt.close();
  conn.close();
}
