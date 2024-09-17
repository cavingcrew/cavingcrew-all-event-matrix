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

function setupSheet(name) {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName(name);
  sheet.clearContents();
  sheet.clearFormats();
  return sheet;
}

function setupCell(name, range) {
  var spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getSheetByName(name);
  return sheet.getRange(range).getValues();
}

function appendToSheet(sheet, results) {
  let metaData = results.getMetaData();
  let numCols = metaData.getColumnCount();
  const rows = [];

  // First row with column labels
  const colLabels = [];
  for (let col = 0; col < numCols; col++) {
    colLabels.push(metaData.getColumnLabel(col + 1));
  }
  rows.push(colLabels);

  // Remaining rows with results
  while (results.next()) {
    const row = [];
    for (let col = 0; col < numCols; col++) {
      row.push(results.getString(col + 1));
    }
    rows.push(row);
  }

  sheet.getRange(1, 1, rows.length, numCols).setValues(rows);

  // Set the font size of the rows with column labels to 14
  sheet.getRange(1, 1, 1, numCols).setFontSize(14);
  sheet.autoResizeColumns(1, numCols);
}

function setColoursFormat(sheet, cellrange, search, colour) { 
  let range = sheet.getRange(cellrange);
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains(search)
    .setBackground(colour)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function setTextFormat(sheet, cellrange, search, colour) { 
  let range = sheet.getRange(cellrange);
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains(search)
    .setFontColor(colour)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function setWrapped(sheet, cellrange) { 
  var cellrange = sheet.getRange(cellrange);
  cellrange.setWrap(true);
}

function setColoursFormatLessThanOrEqualTo(sheet, cellrange, search, colour) { 
  search = Number(search);
  let range = sheet.getRange(cellrange);
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(search)
    .setBackground(colour)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function setNumberFormat(sheet, cellrange, format) { 
  let range = sheet.getRange(cellrange);
  range.setNumberFormat(format);
}

function getIP() {
  var url = "http://api.ipify.org";
  var json = UrlFetchApp.fetch(url);
  Logger.log(json);
}

function getOrderIdFromActiveCell() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const activeCell = sheet.getActiveCell();
  const activeRow = activeCell.getRow();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const orderIdColumnIndex = headers.indexOf("Order ID") + 1;

  if (orderIdColumnIndex === 0) {
    throw new Error("Column 'Order ID' not found in the current sheet.");
  }

  if (activeRow === 1) {
    throw new Error("Please select a cell in a data row, not the header row.");
  }

  const orderId = sheet.getRange(activeRow, orderIdColumnIndex).getValue();

  if (!orderId || isNaN(orderId)) {
    throw new Error("Invalid Order ID. Please make sure you've selected a valid order.");
  }

  return orderId;
}

function updateOrderStatus(orderId, newStatus) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const orderIdColumnIndex = headers.indexOf("Order ID") + 1;
  const statusColumnIndex = headers.indexOf("Status") + 1;

  if (statusColumnIndex === 0) {
    sheet.getRange(1, sheet.getLastColumn() + 1).setValue("Status");
    sheet.getRange(sheet.getActiveCell().getRow(), sheet.getLastColumn()).setValue(newStatus);
  } else {
    sheet.getRange(sheet.getActiveCell().getRow(), statusColumnIndex).setValue(newStatus);
  }
}

function showError(message) {
  Browser.msgBox("Error", message, Browser.Buttons.OK);
}
