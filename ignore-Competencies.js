function giveTripDirector(){
var meta_key = "competency_overnight_trip_director"
var meta_value = "Signed Off"
giveCompetency(meta_key, meta_value)
}

function giveTripDirectorTraining(){
var meta_key = "competency_overnight_trip_director"
var meta_value = "In Training"
giveCompetency(meta_key, meta_value)
}

function giveTripDirectorToLearn(){
var meta_key = "competency_overnight_trip_director"
var meta_value = "Keen to Learn"
giveCompetency(meta_key, meta_value)
}

function giveEveningMealChef(){
var meta_key = "competency_evening_meal_chef"
var meta_value = "Signed Off"
giveCompetency(meta_key, meta_value)
}

function giveEveningMealChefTraining(){
var meta_key = "competency_evening_meal_chef"
var meta_value = "In Training"
giveCompetency(meta_key, meta_value)
}

function giveEveningMealChefToLearn(){
var meta_key = "competency_evening_meal_chef"
var meta_value = "Keen to Learn"
giveCompetency(meta_key, meta_value)
}

function giveBreakfastLunchChef(){
var meta_key = "competency_breakfast_lunch_chef"
var meta_value = "Signed Off"
giveCompetency(meta_key, meta_value)
}

function giveBreakfastLunchChefTraining(){
var meta_key = "competency_breakfast_lunch_chef"
var meta_value = "In Training"
giveCompetency(meta_key, meta_value)
}

function giveBreakfastLunchChefToLearn(){
var meta_key = "competency_breakfast_lunch_chef"
var meta_value = "Keen to Learn"
giveCompetency(meta_key, meta_value)
}

function giveLiftCoordinator(){
var meta_key = "competency_lift_coordinator"
var meta_value = "Signed Off"
giveCompetency(meta_key, meta_value)
}

function giveActivitiesCoord(){
var meta_key = "competency_activities_coordinator"
var meta_value = "Signed Off"
giveCompetency(meta_key, meta_value)
}


function giveCompetency(meta_key,meta_value){
 var spreadsheet = SpreadsheetApp.getActive();
 var sheet = spreadsheet.getSheetByName('Volunteering');
  var active_range = sheet.getActiveRange();
  var currentRow = active_range.getRowIndex();
  //var currentRow = "18";
  console.log(currentRow);
//var meta_key = "competency_indoor_trip_director"
//var meta_value = "Signed Off"

  if(currentRow <=2){Browser.msgBox('Select an actual signup', Browser.Buttons.OK); return;}
    if(currentRow >=100){Browser.msgBox('Select an actual signup', Browser.Buttons.OK); return;}


  var user_id = sheet.getRange(currentRow, 19,1,1).getValue();  /// get submission ID 1 BV ( was 67)
  var first_name = sheet.getRange(currentRow, 1,1,1).getValue();  /// get submission ID 1 BV ( was 67)

  //console.log(user_id);
  
if(user_id === "" || user_id ===  "user_id"){Browser.msgBox('No User ID Found', Browser.Buttons.OK); return;} 




 if (Browser.msgBox("Given a competency to " +first_name + "? \n User " + user_id, Browser.Buttons.OK_CANCEL) == "ok") { 



let cc_attendance_setter =  Session.getActiveUser().getEmail();

//let metakey = "milestones_3_badge"
//let metavalue = "given"
let datetime = Date.now(); 
//Logger.log(datetime);

let meta_key_given_at = meta_key + "_marked_given_at"
let meta_key_given_by = meta_key + "_marked_given_by"


var data = {"meta_data": [
    {"key": meta_key,
    "value": meta_value}, 
    {"key": meta_key_given_at,
    "value": datetime}, 
    {"key": meta_key_given_by,
    "value": cc_attendance_setter }
  ], 
};

let returndata =  pokeToWooUserMeta(data, user_id); //returns JSON object
returndata = returndata.getContentText();
returndata= JSON.parse(returndata)


//Logger.log("type " + typeof(returndata)); // type object
//Logger.log(returndata.data); // Logging output too large. Truncating output. {"id":52,"date_created":"2021-08-27T23:24:39","date_created_gmt":"2021-08-27T22:24:39","date_modified":"2022-11-23T11:51:41", etc etc etc
//Logger.log(returndata[0]); //null
//Logger.log("type " + typeof(returndata.id)); //type undefined
//Logger.log(returndata.data.id); //null


let search = returndata.meta_data.find(({key}) => key == meta_key)?.value;

//Logger.log(search); 
 
if (search === meta_value){
  sheet.getRange(currentRow, 2,1,1).setValue("Given");   // paste the blank variables into the cells to delete contents
 sheet.getRange(currentRow, 15,1,1).setValue(meta_key);
 sheet.getRange(currentRow, 16,1,1).setValue(meta_value);   // paste the blank variables into the cells to delete contents

return meta_value  
}
else {
    Logger.log("ERROR" + search);

  return "ERROR" + search
}
return "ERROR"
}

//Logger.log(returnvalue.meta_data);
//Logger.log(" type " + typeof(returnvalue.meta_data));

//Logger.log(JSON.parse(returnvalue));
//Logger.log(JSON.stringify(returnvalue.meta_data));





//return returndata;
}
