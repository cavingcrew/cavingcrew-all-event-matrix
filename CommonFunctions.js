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
