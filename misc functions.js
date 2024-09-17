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


