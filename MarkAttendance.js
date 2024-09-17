

function markAttended(){

var attendancetype = "Attended"
var attendanceshow = "Attended"
var metakey = "cc_attendance"
var orderstatus= "completed"
var metavalue = "attended"

markAttendance(attendancetype, attendanceshow, orderstatus, metakey, metavalue)
}

function markCancelled(){

var attendancetype = "Cancel"
var attendanceshow = "Cancelled"
var metakey = "cc_attendance"
var orderstatus= "completed"
var metavalue = "cancelled"

markAttendance(attendancetype, attendanceshow, orderstatus, metakey, metavalue)
}

function markNoShow(){

var attendancetype = "NoShow"
var attendanceshow = "NoShow"
var orderstatus= "completed"
var metakey = "cc_attendance"
var metavalue = "noshow"

markAttendance(attendancetype, attendanceshow, orderstatus, metakey, metavalue)
}

function markDuplicate(){
var attendancetype = "Duplicate"
var attendanceshow = "Duplicated"
var orderstatus= "completed"
var metakey = "cc_attendance"
var metavalue = "duplicate"

markAttendance(attendancetype, attendanceshow, orderstatus, metakey, metavalue)
}

function markLateBail(){
var attendancetype = "Late Bail"
var attendanceshow = "Late Bail"
var orderstatus= "completed"
var metakey = "cc_attendance"
var metavalue = "latebail"

markAttendance(attendancetype, attendanceshow, orderstatus, metakey, metavalue)
}

function markNoRegisterShow(){
var attendancetype = "No Register Show"
var attendanceshow = "No Register Show"
var orderstatus= "completed"
var metakey = "cc_attendance"
var metavalue = "noregistershow"

markAttendance(attendancetype, attendanceshow, orderstatus, metakey, metavalue)
}

function markAttendance(attendancetype, attendanceshow, orderstatus, metakey, metavalue) {
  try {
    const order_id = getOrderIdFromActiveCell();
    const sheet = SpreadsheetApp.getActiveSheet();
    const activeRow = sheet.getActiveCell().getRow();
    const first_name = sheet.getRange(activeRow, 1, 1, 1).getValue();

    if (Browser.msgBox("Mark " + attendancetype + " on " + first_name + "'s place? \n Order " + order_id, Browser.Buttons.OK_CANCEL) == "ok") {
      const cc_attendance_setter = Session.getActiveUser().getEmail();

      const data = {
        "meta_data": [
          {
            "key": metakey,
            "value": metavalue
          },
          {
            "key": "cc_attendance_set_by",
            "value": cc_attendance_setter
          }
        ],
        "status": orderstatus
      };

      console.log(orderstatus);

      const encodedAuthInformation = Utilities.base64Encode(apiusername + ":" + apipassword);
      const headers = { "Authorization": "Basic " + encodedAuthInformation };
      const options = {
        'method': 'post',
        'contentType': 'application/json',
        'headers': headers,
        'payload': JSON.stringify(data)
      };
      const url = "https://www." + apidomain + "/wp-json/wc/v3/orders/" + order_id;

      const response = UrlFetchApp.fetch(url, options);
      console.log(response);

      // Update the status in the sheet
      updateOrderStatus(order_id, attendanceshow);
    }
  } catch (error) {
    showError(error.message);
  }
}



