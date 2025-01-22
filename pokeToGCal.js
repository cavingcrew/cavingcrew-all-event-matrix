const CALENDAR_ID = "19d2hfsmh7q1qancm6graaj6k0@group.calendar.google.com";

function createCalendarEventForProduct(
	eventName,
	startTime,
	eventType,
	productId,
) {
	try {
		const eventId = createCalendarEvent(eventName, startTime, eventType);

		// Store event ID in product meta
		const data = {
			meta_data: [
				{
					key: "google_cal_event_id",
					value: eventId,
				},
			],
		};
		pokeToWordPressProducts(data, productId);

		return eventId;
	} catch (e) {
		console.error("Failed to create calendar event:", e);
		return null;
	}
}

function deleteCalendarEventForProduct(productId) {
	try {
		const product = getProductById(productId);
		const calEventId = product.meta_data.find(
			(m) => m.key === "google_cal_event_id",
		)?.value;

		if (calEventId) {
			CalendarApp.getCalendarById(CALENDAR_ID)
				.getEventById(calEventId)
				.deleteEvent();

			// Remove meta field
			const data = {
				meta_data: [
					{
						key: "google_cal_event_id",
						value: null, // WordPress will remove the meta key when value is null
					},
				],
			};
			pokeToWordPressProducts(data, productId);
		}
	} catch (e) {
		console.error("Failed to delete calendar event:", e);
	}
}

function createCalendarEvent(eventName, startTime, eventType) {
	const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
	const endTime = calculateEndTime(new Date(startTime), eventType);

	const event = calendar.createEvent(eventName, new Date(startTime), endTime, {
		description: `Automatically created from Caving Crew system\nEvent type: ${eventType}`,
	});

	return event.getId();
}

function calculateEndTime(startTime, eventType) {
	const endTime = new Date(startTime);

	switch (eventType.toUpperCase()) {
		case "OVERNIGHT":
			endTime.setDate(endTime.getDate() + 2);
			break;
		case "TRAINING":
		case "HORIZONTAL_TRAINING":
		case "BASIC_SRT":
			endTime.setHours(endTime.getHours() + 6);
			break;
		case "KNOWN_LOCATION":
		case "MYSTERY":
		case "GIGGLE":
			endTime.setHours(endTime.getHours() + 4);
			break;
		default:
			endTime.setHours(endTime.getHours() + 2);
	}
	return endTime;
}
