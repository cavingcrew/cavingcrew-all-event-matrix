function markAttended() {
	const attendancetype = "Attended";
	const attendanceshow = "Attended";
	const metakey = "cc_attendance";
	const orderstatus = "completed";
	const metavalue = "attended";

	markAttendance(
		attendancetype,
		attendanceshow,
		orderstatus,
		metakey,
		metavalue,
	);
}

function markCancelled() {
	const attendancetype = "Cancel";
	const attendanceshow = "Cancelled";
	const metakey = "cc_attendance";
	const orderstatus = "completed";
	const metavalue = "cancelled";

	markAttendance(
		attendancetype,
		attendanceshow,
		orderstatus,
		metakey,
		metavalue,
	);
}

function markNoShow() {
	const attendancetype = "NoShow";
	const attendanceshow = "NoShow";
	const orderstatus = "completed";
	const metakey = "cc_attendance";
	const metavalue = "noshow";

	markAttendance(
		attendancetype,
		attendanceshow,
		orderstatus,
		metakey,
		metavalue,
	);
}

function markDuplicate() {
	const attendancetype = "Duplicate";
	const attendanceshow = "Duplicated";
	const orderstatus = "completed";
	const metakey = "cc_attendance";
	const metavalue = "duplicate";

	markAttendance(
		attendancetype,
		attendanceshow,
		orderstatus,
		metakey,
		metavalue,
	);
}

function markLateBail() {
	const attendancetype = "Late Bail";
	const attendanceshow = "Late Bail";
	const orderstatus = "completed";
	const metakey = "cc_attendance";
	const metavalue = "latebail";

	markAttendance(
		attendancetype,
		attendanceshow,
		orderstatus,
		metakey,
		metavalue,
	);
}

function markNoRegisterShow() {
	const attendancetype = "No Register Show";
	const attendanceshow = "No Register Show";
	const orderstatus = "completed";
	const metakey = "cc_attendance";
	const metavalue = "noregistershow";

	markAttendance(
		attendancetype,
		attendanceshow,
		orderstatus,
		metakey,
		metavalue,
	);
}

function markAttendance(
	attendancetype,
	attendanceshow,
	orderstatus,
	metakey,
	metavalue,
) {
	try {
		const order_id = getOrderIdFromActiveCell();
		const sheet = SpreadsheetApp.getActiveSheet();
		const activeRow = sheet.getActiveCell().getRow();
		const first_name = sheet.getRange(activeRow, 1, 1, 1).getValue();

		if (
			Browser.msgBox(
				`Mark ${attendancetype} on ${first_name}'s place? \n Order ${order_id}`,
				Browser.Buttons.OK_CANCEL,
			) === "ok"
		) {
			const cc_attendance_setter = Session.getActiveUser().getEmail();

			const data = {
				meta_data: [
					{
						key: metakey,
						value: metavalue,
					},
					{
						key: "cc_attendance_set_by",
						value: cc_attendance_setter,
					},
				],
				status: orderstatus,
			};

			console.log(orderstatus);

			const encodedAuthInformation = Utilities.base64Encode(
				`${apiusername}:${apipassword}`,
			);
			const headers = { Authorization: `Basic ${encodedAuthInformation}` };
			const options = {
				method: "post",
				contentType: "application/json",
				headers: headers,
				payload: JSON.stringify(data),
			};
			const url = `https://www.${apidomain}/wp-json/wc/v3/orders/${order_id}`;

			const response = UrlFetchApp.fetch(url, options);
			console.log(response);

			// Update the status in the sheet
			updateOrderStatus(order_id, attendanceshow);
		}
	} catch (error) {
		showError(error.message);
	}
}
