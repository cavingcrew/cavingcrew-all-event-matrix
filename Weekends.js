function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  readDiet(stmt);
  readGear(stmt);
  readAdmin(stmt);
  readTransport(stmt);
  readBuddy(stmt);
  readVolunteering(stmt);

  eventListing();

  stmt.close();
  conn.close();
}

function eventListing() {
  // Implement the eventListing function here if it's not already defined elsewhere
  console.log("Event listing function called");
}

// ScriptApp.newTrigger('readData')
// .timeBased()
// .everyMinutes(30)
// .create();
