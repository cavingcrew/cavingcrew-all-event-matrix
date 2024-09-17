var server = '18.171.8.199';
var port = 3306;
var dbName = 'jtl_cavingcrew_com';
var username = 'gsheets';
var password = 'athohKeecieD8xees';
var url = 'jdbc:mysql://'+server+':'+port+'/'+dbName;
var cc_location = "placeholder"
var apidomain="cavingcrew.com"
var apiusername="ck_91675da0323ed5e5f5704a79a59288950db68efc"
var apipassword="cs_7be15b56e20ef6006720147f4ce44ff472039328"

function readData() {
 var conn = Jdbc.getConnection(url, username, password);
 var stmt = conn.createStatement();


 //Diet
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Dashboard');
 var cell = sheet.getRange('B49').getValues();
 
 var results = stmt.executeQuery('select distinct `first_name` as "First Name",`nickname` as "Facebook Name", `admin-dietary-requirements` as "Dietary Requirements", `admin-diet-allergies-health-extra-info` "Diet and health details", cc_attendance,status,order_id,user_id   from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND pd.status="wc-processing" order by `admin-dietary-requirements` ASC');
  //console.log(results);
 var metaData=results.getMetaData();
  var numCols = metaData.getColumnCount();
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Diet');
 sheet.clearContents();
 var arr=[];
  for (var col = 0; col < numCols; col++) {
   arr.push(metaData.getColumnName(col + 1));
 }
  sheet.appendRow(arr);
 while (results.next()) {
 arr=[];
 for (var col = 0; col < numCols; col++) {
   arr.push(results.getString(col + 1));
 }
 sheet.appendRow(arr);
 }


sheet.autoResizeColumns(1, numCols+1);

 //Gear
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Dashboard');
 var cell = sheet.getRange('B49').getValues();
 
 var results = stmt.executeQuery('select distinct `first_name`,`nickname` "Facebook Name", `skills-horizontal` "Skills Horizontal",`skills-leading-horizontal` "Skills Horizontal Leading", `caving-horizontal-happy-to-second-or-lead` "Lead or second in horizontal environments", `skills-srt` "Skills SRT", `skills-leading-srt` "Skills SRT Leading",`caving-srt-happy-to-second-or-lead` "Lead in vertical environmnts", `gear-bringing-evening-or-day-trip` "kit bringing", `gear-rope-length` "Rope Length", `skills-leading-coaching` "Coaching Skills", `caving-srt-or-horizontal-preference` "Horizontal or Vertical Preference", `gear-walking-equipment-weekend` "Gear for Walking"  from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + '  AND status="wc-processing" order by `first_name` ASC');
  //console.log(results);
 var metaData=results.getMetaData();
  var numCols = metaData.getColumnCount();
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Gear');
 sheet.clearContents();
 var arr=[];
  for (var col = 0; col < numCols; col++) {
   arr.push(metaData.getColumnName(col + 1));
 }
  sheet.appendRow(arr);
 while (results.next()) {
 arr=[];
 for (var col = 0; col < numCols; col++) {
   arr.push(results.getString(col + 1));
 }
 sheet.appendRow(arr);
 }

sheet.autoResizeColumns(1, numCols+1);

 //Climbing
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Dashboard');
 var cell = sheet.getRange('B49').getValues();
 
 var results = stmt.executeQuery('select distinct `first_name`,`last_name`,`nickname` "Facebook Name", `admin-phone-number` "Phone Number", `admin-participation-statement-one`, `admin-participation-statement-two`, `admin-car-registration` "Car Registration",`admin-emergency-contact-name` "Emergency Contact Name",`admin-emergency-contact-phone` "Emergency Contact Name"   from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `first_name` ASC');
  //console.log(results);
 var metaData=results.getMetaData();
  var numCols = metaData.getColumnCount();
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Admin');
 sheet.clearContents();
 var arr=[];
  for (var col = 0; col < numCols; col++) {
   arr.push(metaData.getColumnName(col + 1));
 }
  sheet.appendRow(arr);
 while (results.next()) {
 arr=[];
 for (var col = 0; col < numCols; col++) {
   arr.push(results.getString(col + 1));
 }
 sheet.appendRow(arr);
 }

sheet.autoResizeColumns(1, numCols+1);

 //Transport
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Dashboard');
 var cell = sheet.getRange('B49').getValues();
 
 var results = stmt.executeQuery('select `first_name`,`nickname` fbname, `transport-need-lift`, `transport-will-you-give-lift`, `transport-leaving-location`, `transport-depature-time` from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `transport-need-lift` ASC');
  //console.log(results);
 var metaData=results.getMetaData();
  var numCols = metaData.getColumnCount();
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Transport');
 sheet.clearContents();
 var arr=[];
  for (var col = 0; col < numCols; col++) {
   arr.push(metaData.getColumnName(col + 1));
 }
  sheet.appendRow(arr);
 while (results.next()) {
 arr=[];
 for (var col = 0; col < numCols; col++) {
   arr.push(results.getString(col + 1));
 }
 sheet.appendRow(arr);
 }

sheet.autoResizeColumns(1, numCols+1);

 //Buddy
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Dashboard');
 var cell = sheet.getRange('B49').getValues();
 
 var results = stmt.executeQuery('select distinct `first_name`,`nickname` fbname, `admin-first-timer-question`, `_order_count`  from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `_order_count` ASC');
  //console.log(results);
 var metaData=results.getMetaData();
  var numCols = metaData.getColumnCount();
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Buddy');
 sheet.clearContents();
 var arr=[];
  for (var col = 0; col < numCols; col++) {
   arr.push(metaData.getColumnName(col + 1));
 }
  sheet.appendRow(arr);
 while (results.next()) {
 arr=[];
 for (var col = 0; col < numCols; col++) {
   arr.push(results.getString(col + 1));
 }
 sheet.appendRow(arr);
 }

eventListing();

results.close();
stmt.close();
sheet.autoResizeColumns(1, numCols+1);

} 


//ScriptApp.newTrigger('readData')
//.timeBased()
//.everyMinutes(30)
//.create();
