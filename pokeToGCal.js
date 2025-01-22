const CALENDAR_ID = '19d2hfsmh7q1qancm6graaj6k0@group.calendar.google.com';

function createCalendarEvent(eventName, startTime, eventType) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  
  // Calculate end time based on event type
  let endTime = new Date(startTime);
  switch(eventType.toUpperCase()) {
    case 'OVERNIGHT':
      endTime.setDate(endTime.getDate() + 2);
      break;
    case 'TRAINING':
      endTime.setHours(endTime.getHours() + 6);
      break;
    case 'KNOWN_LOCATION':
    case 'MYSTERY':
    case 'GIGGLE':
      endTime.setHours(endTime.getHours() + 4);
      break;
    default:
      endTime.setHours(endTime.getHours() + 2);
  }

  const event = calendar.createEvent(eventName, startTime, endTime, {
    description: `Created automatically from Caving Crew management system\nEvent type: ${eventType}`
  });

  return event.getId();
}
