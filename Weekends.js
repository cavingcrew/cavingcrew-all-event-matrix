function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  readDiet(stmt);
  readGear(stmt);
  readAdmin(stmt);
  readTransport(stmt);
  readBuddy(stmt);
  //readVolunteering(stmt);

  eventListing();

  stmt.close();
  conn.close();
}
