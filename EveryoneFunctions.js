function sendAllCragAssignments(action) {
	try {
		let data;
		const sconn = Jdbc.getConnection(url, username, password);
		const sstmt = sconn.createStatement();

		const product_id = setupCell("Dashboard", "B49");
		const active_user = Session.getActiveUser().getEmail();
		const currentUnixTime = Date.now();

		const order_results = sstmt.executeQuery(
			`SELECT distinct order_id from jtl_order_product_customer_lookup where product_id="${product_id}"  AND status="wc-processing" AND cc_attendance="pending" LIMIT 99`
		);

		while (order_results.next()) {
			const order_id = order_results.getString(1);
			console.log(order_id);

			if (action === "close") {
				data = {
					status: "completed",
					meta_data: [
						{
							key: "cc_attendance_set_by",
							value: active_user,
						},
						{
							key: "cc_attendance_set_at",
							value: currentUnixTime,
						},
						{
							key: "cc_attendance",
							value: "attended",
						},
					],
				};
				Logger.log(data);
				pokeToWordPressOrders(data, order_id);
				updateOrderStatus(order_id, "Attended");
			}
		}

		if (action === "close") {
			data = {
				status: "private",
				meta_data: [
					{
						key: "cc_post_set_private_set_by",
						value: active_user,
					},
					{
						key: "cc_post_set_private_set_at",
						value: currentUnixTime,
					},
				],
			};
			console.log(data);
			pokeToWordPressProducts(data, product_id);
		}

		sstmt.close();
		sconn.close();
	} catch (error) {
		showError(error.message);
	}
}

function markAttendedAndCloseEvent() {
	if (
		Browser.msgBox(
			"This will mark all those who haven't been cancelled as ATTENDED, close the event, and set it to private",
			Browser.Buttons.OK_CANCEL,
		) === "ok"
	) {
		if (
			Browser.msgBox(
				"This should be done after caving",
				Browser.Buttons.OK_CANCEL,
			) === "ok"
		) {
			if (
				Browser.msgBox("This cannot be undone", Browser.Buttons.OK_CANCEL) ===
				"ok"
			) {
				sendAllCragAssignments("close");
				readData(); // Refresh the data after closing the event
			}
		}
	}
}
