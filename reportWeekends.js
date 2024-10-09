function readData() {
	const conn = Jdbc.getConnection(url, username, password);
	const stmt = conn.createStatement();
	const cell = setupCell("Dashboard", "B49");

	const reports = [
		readDiet,
		readGear,
		readAdmin,
		readTransport,
		readBuddy,
		// readVolunteering is commented out in the original code
	];

	for (const report of reports) {
		report(stmt, cell);
	}

	readEventListing(stmt, cell);

	stmt.close();
	conn.close();
}
