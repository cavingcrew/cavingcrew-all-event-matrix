function volunteerData() {
   //  getIP();

 var conn = Jdbc.getConnection(url, username, password);
 var stmt = conn.createStatement();

// Volunteering Report
//
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Dashboard');
  var cell = sheet.getRange('B5').getValues();


 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Volunteering');
 sheet.clearContents();
  sheet.clearFormats();
//getIP();



// start of volunteering function
function volunteering(flip, title)
{
sheet.appendRow([title]);
let row = sheet.getLastRow();
//console.log(row);
sheet.getRange(row, 1, 2, 24).setFontWeight("bold");

if (flip==="volunteers") {
 var results = stmt.executeQuery('select `first_name` "First Name",`nickname` "Facebook Name",pd.cc_volunteer "Selected Roles",volunteer_overnight_preevent_facebook_promo "FB promo", volunteer_overnight_event_reporter "Rprtr", volunteer_overnight_head_chef "Head-Chef", volunteer_overnight_evening_meal_chef "EM Chef", volunteer_overnight_breakfast_lunch_chef "B&L Chef", volunteer_overnight_packed_lunch_marshal "Lnch Mrshl", volunteer_overnight_breakfast_marshal "Brk Mrshl",volunteer_overnight_lift_sharing_coordinator "Lift Shre", volunteer_overnight_activities_coordinator "Actvts Cood", volunteer_overnight_kit_coordinator "Kit Cood", volunteer_overnight_newbie_buddy_maker "newbie",volunteer_overnight_covid_marshal "covid mrshl",volunteer_overnight_evening_meal_washing_up_marshal "EM Wash Up",volunteer_overnight_breakfast_washing_up_marshal "B&L Wash Up",volunteer_overnight_event_assistant "Event Assist",volunteer_overnight_event_director "Trip Director",  scores_volunteer_score_cached "Receptiveness",`admin-first-timer-question` "First time with Clan?",`admin-first-timer-overnight` "First overnight trip?", `stats_volunteer_for_denominator_cached`  "attended events",`stats_attendance_overnight_attended_cached`  "attended overnight trips", `admin-weekend-requests-notes` as `Requests and notes`, pd.order_id "Order ID", pd.user_id "User ID" from wp_member_db db JOIN wp_order_product_customer_lookup pd on pd.user_id = db.id join wp_member_db_volunteering vl on pd.user_id = vl.id where product_id=' + cell + '  AND status in ("wc-processing", "wc-onhold", "wc-on-hold") AND (`admin-can-you-help-weekend`<>"" OR pd.cc_volunteer<>"none")  order by FIELD(pd.cc_volunteer,  "none", "tuesdaypromo1","tuesdaypromo2", "wednesdaypromo1","wednesdaypromo2", "check-in", "welcome_liaison", "pairing", "precakeadmin", "postcakeadmin", "rounding_up", "announcements", "trip_director", "postpromo1","postpromo2", "floorwalker") asc,`admin-first-timer-overnight` desc,CAST(stats_attendance_overnight_attended_cached AS UNSIGNED INTEGER) asc')
}
else if (flip==="nonvolunteers"){
 var results = stmt.executeQuery('select `first_name` "First Name",`nickname` "Facebook Name",pd.cc_volunteer "Selected Roles",volunteer_overnight_preevent_facebook_promo "FB promo", volunteer_overnight_event_reporter "Rprtr", volunteer_overnight_head_chef "Head-Chef", volunteer_overnight_evening_meal_chef "EM Chef", volunteer_overnight_breakfast_lunch_chef "B&L Chef", volunteer_overnight_packed_lunch_marshal "Lnch Mrshl", volunteer_overnight_breakfast_marshal "Brk Mrshl",volunteer_overnight_lift_sharing_coordinator "Lift Shre", volunteer_overnight_activities_coordinator "Actvts Cood", volunteer_overnight_kit_coordinator "Kit Cood", volunteer_overnight_newbie_buddy_maker "newbie",volunteer_overnight_covid_marshal "covid mrshl",volunteer_overnight_evening_meal_washing_up_marshal "EM Wash Up",volunteer_overnight_breakfast_washing_up_marshal "B&L Wash Up",volunteer_overnight_event_assistant "Event Assist",volunteer_overnight_event_director "Trip Director",  scores_volunteer_score_cached "Receptiveness",`admin-first-timer-question` "First time with Clan?",`admin-first-timer-overnight` "First overnight trip?", `stats_volunteer_for_denominator_cached`  "attended events",`stats_attendance_overnight_attended_cached`  "attended overnight trips", `admin-weekend-requests-notes` as `Requests and notes`, pd.order_id "Order ID", pd.user_id "User ID" from wp_member_db db JOIN wp_order_product_customer_lookup pd on pd.user_id = db.id join wp_member_db_volunteering vl on pd.user_id = vl.id where product_id=' + cell + '   AND status in ("wc-processing", "wc-onhold", "wc-on-hold")  AND (`admin-can-you-help-weekend`="" AND pd.cc_volunteer="none")   order by `admin-first-timer-overnight` desc,CAST(stats_attendance_overnight_attended_cached AS UNSIGNED INTEGER) asc, pd.cc_volunteer asc, CAST(db.scores_volunteer_score_cached AS UNSIGNED INTEGER) asc, CAST(db.stats_attendance_indoor_wednesday_attended_cached AS UNSIGNED INTEGER) desc ') 
}

  //console.log(results);
 var metaData=results.getMetaData();
  var numCols = metaData.getColumnCount();
 var arr=[];
  for (var col = 0; col < numCols; col++) {
   arr.push(metaData.getColumnLabel(col + 1));
 }
 // https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js 
  sheet.appendRow(arr);
 while (results.next()) {
 arr=[];
 for (var col = 0; col < numCols; col++) {
   arr.push(results.getString(col + 1));
 }
 sheet.appendRow(arr);
 }
sheet.autoResizeColumns(1, numCols+1);




} //end of volunteering

// full options
//help online beforehand,help at sign-in,help around announcements and cake time,do announcements,help online afterwards,be event director for the evening

volunteering("volunteers", "Volunteers");
volunteering("nonvolunteers", "People who haven't volunteered or been assigned");
setNumberFormat(sheet, "t3:t1000", "0");

setColoursFormatLessThanOrEqualTo(sheet, "t3:t1000","10","#ff75d8")
setColoursFormatLessThanOrEqualTo(sheet, "t3:t1000","20","#ffd898")
setColoursFormatLessThanOrEqualTo(sheet, "t3:t1000","30","#fad02c")
setColoursFormat(sheet, "C3:C1000","none","#DAF7A6 ")
setColoursFormat(sheet, "C3:C1000","Selected","#FFFFFF")
setColoursFormat(sheet, "C3:C1000","","#e0ffff")
setTextFormat(sheet,"D2:V1000","No","#a9a9a9")
setColoursFormat(sheet,"U2:V1000","Yes","#ffd898")

sheet.setColumnWidth(25, 300);
sheet.setColumnWidth(1, 150);
setWrapped(sheet,"y2:y1000");

setColoursFormat(sheet, "C3:C1000","none","#DAF7A6 ")

//var range = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
 

//setNumberFormat(sheet, "O3:O1000", "[<=75]'Try_Give_Break';[<=30]'Available';[<=20]'Try_Assign'");

//[<=75]"Available";[Color22][<=30]"Assign If Possible";0;[Magenta]_(@_)


} 

