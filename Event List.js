function eventListing() {
  /**
   * Reads list of all 'Pending' trips from caving crew website server and populates it into Event Listing spreadsheet for later use
   * 
   * Note: Due to SQL schema, this won't show events with no signups as jtl_order_product_customer_lookup doesn't contain them]
   * 
   * TODO:
   *      Purge events listing so that only events which are actually Pending are Pending
   *          (Can this be automated on WP side for future?)
   *      Add common date field to all WP events
   *          (Overnight trips already have date field but not day trips. Using two different date fields is unnecessary complexity, just create one universal one)
   *      Ammend SQL query to read the date field, and use it to order the results rather than ID
   *    
   */

  //connect to Event Listing sheet, wipe existing content, and set headers.
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('Event Listing');
  // var headerArray = ["Name","ID", "Date (TODO)"]
  // sheet.appendRow(headerArray)

  //connect to database
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  //execute query, transferring results into inputArr and then writing that to the spreadsheet

var results = stmt.executeQuery('SELECT distinct SUBSTRING_INDEX(`order_item_name`, \' - \', 1) "Trip Name", `product_id` "ID", `cc_start_date` "Date" from jtl_order_product_customer_lookup where cc_attendance="pending" AND product_id <> "1272" AND product_id <> "548" AND (STR_TO_DATE(cc_start_date, \'%Y%m%d\') BETWEEN \'2024-01-01\' AND \'2024-12-31\' OR STR_TO_DATE(cc_start_date, \'%Y-%m-%d %H:%i:%s\') BETWEEN \'2024-01-01\' AND \'2024-12-31\') GROUP BY product_id ORDER BY CASE WHEN cc_start_date LIKE \'%-%\' THEN STR_TO_DATE(cc_start_date, \'%Y-%m-%d %H:%i:%s\') ELSE STR_TO_DATE(cc_start_date, \'%Y%m%d\') END asc');
  sheet.clearContents()

  var metaData = results.getMetaData();
  var numCols = metaData.getColumnCount();
  
  //set headers

  var arr=[];

    for (var col = 0; col < numCols; col++) {
      arr.push(metaData.getColumnName(col + 1));
    }

    sheet.appendRow(arr);

  //cycle through the results and put them into the sheet
  while (results.next()) {
    inputArr=[];

    for (var col = 0; col < numCols; col++) {
      inputArr.push(results.getString(col + 1));
    }

    sheet.appendRow(inputArr);
  }
}