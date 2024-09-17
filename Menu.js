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
      .addItem('Refresh Diet', 'readDiet')
      .addItem('Refresh Gear', 'readGear')
      .addItem('Refresh Admin', 'readAdmin')
      .addItem('Refresh Transport', 'readTransport')
      .addItem('Refresh Buddy', 'readBuddy')
      .addSeparator()
      .addItem('Refresh Event Listings', 'eventListing')
      .addToUi();
}
