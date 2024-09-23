function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  var cell = setupCell("Dashboard", "B49");

  const reports = [
    readDiet,
    readGear,
    readAdmin,
    readTransport,
    readBuddy,
    // readVolunteering is commented out in the original code
  ];

  reports.forEach(report => report(stmt, cell));

  eventListing();

  stmt.close();
  conn.close();
}
