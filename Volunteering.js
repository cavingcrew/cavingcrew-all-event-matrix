function readVolunteering(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Volunteering");
 
  var results = stmt.executeQuery('SELECT `first_name` AS "First Name", `nickname` AS "Facebook Name", pd.cc_volunteer AS "Selected Roles", ' +
    'volunteer_caving_preevent_facebook_promo AS "FB promo", volunteer_caving_event_reporter AS "Reporter", ' +
    'volunteer_caving_head_chef AS "Head Chef", volunteer_caving_evening_meal_chef AS "EM Chef", ' +
    'volunteer_caving_breakfast_lunch_chef AS "B&L Chef", volunteer_caving_packed_lunch_marshal AS "Lunch Marshal", ' +
    'volunteer_caving_breakfast_marshal AS "Breakfast Marshal", volunteer_caving_lift_sharing_coordinator AS "Lift Coordinator", ' +
    'volunteer_caving_activities_coordinator AS "Activities Coordinator", volunteer_caving_kit_coordinator AS "Kit Coordinator", ' +
    'volunteer_caving_newbie_buddy_maker AS "Newbie Buddy", volunteer_caving_covid_marshal AS "Covid Marshal", ' +
    'volunteer_caving_evening_meal_washing_up_marshal AS "EM Wash Up", volunteer_caving_breakfast_washing_up_marshal AS "B&L Wash Up", ' +
    'volunteer_caving_event_assistant AS "Event Assistant", volunteer_caving_event_director AS "Trip Director", ' +
    'scores_volunteer_score_cached AS "Receptiveness", `admin-first-timer-question` AS "First time with Crew?", ' +
    '`admin-first-timer-caving` AS "First caving trip?", `stats_volunteer_for_denominator_cached` AS "Attended events", ' +
    '`stats_attendance_caving_attended_cached` AS "Attended caving trips", `admin-caving-requests-notes` AS "Requests and notes", ' +
    'pd.order_id AS "Order ID", pd.user_id AS "User ID" ' +
    'FROM jtl_member_db db ' +
    'JOIN jtl_order_product_customer_lookup pd ON pd.user_id = db.id ' +
    'WHERE product_id=' + cell + ' AND status IN ("wc-processing", "wc-onhold", "wc-on-hold") ' +
    'ORDER BY FIELD(pd.cc_volunteer, "none", "trip_director", "buddy_coordinator", "kit_coordinator", ' +
    '"transport_coordinator", "lunch_breakfast_chef", "evening_meal_chef", "breakfast_marshal", ' +
    '"lunch_marshal", "caving_coordinator", "evening_meal_washingup_marshal", "postpromo1") ASC, ' +
    '`admin-first-timer-caving` DESC, CAST(stats_attendance_caving_attended_cached AS UNSIGNED INTEGER) ASC');

  appendToSheet(sheet, results);

  setNumberFormat(sheet, "Attended events", "0");
  setColoursFormatLessThanOrEqualTo(sheet, "Attended events", "10", "#ff75d8");
  setColoursFormatLessThanOrEqualTo(sheet, "Attended events", "20", "#ffd898");
  setColoursFormatLessThanOrEqualTo(sheet, "Attended events", "30", "#fad02c");
  setColoursFormat(sheet, "Selected Roles", "none", "#DAF7A6");
  setColoursFormat(sheet, "Selected Roles", "Selected", "#FFFFFF");
  setColoursFormat(sheet, "Selected Roles", "", "#e0ffff");
  setTextFormat(sheet, "FB promo", "No", "#a9a9a9");
  setTextFormat(sheet, "Reporter", "No", "#a9a9a9");
  setTextFormat(sheet, "Head Chef", "No", "#a9a9a9");
  setTextFormat(sheet, "EM Chef", "No", "#a9a9a9");
  setTextFormat(sheet, "B&L Chef", "No", "#a9a9a9");
  setTextFormat(sheet, "Lunch Marshal", "No", "#a9a9a9");
  setTextFormat(sheet, "Breakfast Marshal", "No", "#a9a9a9");
  setTextFormat(sheet, "Lift Coordinator", "No", "#a9a9a9");
  setTextFormat(sheet, "Activities Coordinator", "No", "#a9a9a9");
  setTextFormat(sheet, "Kit Coordinator", "No", "#a9a9a9");
  setTextFormat(sheet, "Newbie Buddy", "No", "#a9a9a9");
  setTextFormat(sheet, "Covid Marshal", "No", "#a9a9a9");
  setTextFormat(sheet, "EM Wash Up", "No", "#a9a9a9");
  setTextFormat(sheet, "B&L Wash Up", "No", "#a9a9a9");
  setTextFormat(sheet, "Event Assistant", "No", "#a9a9a9");
  setTextFormat(sheet, "Trip Director", "No", "#a9a9a9");
  setColoursFormat(sheet, "First time with Crew?", "Yes", "#ffd898");
  setColoursFormat(sheet, "First caving trip?", "Yes", "#ffd898");

  sheet.setColumnWidth(25, 300);
  sheet.setColumnWidth(1, 150);
  setWrapped(sheet, "Requests and notes");

  results.close();
}

