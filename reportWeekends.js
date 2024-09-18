function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  const reports = [
    readDiet,
    readGear,
    readAdmin,
    readTransport,
    readBuddy,
    // readVolunteering is commented out in the original code
  ];

  reports.forEach(report => report(stmt));

  eventListing();

  stmt.close();
  conn.close();
}
