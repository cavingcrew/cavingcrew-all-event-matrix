function readBuddy(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Buddy");
 
  var results = stmt.executeQuery('select distinct `first_name` "First Name", `nickname` "Facebook Name", `admin-first-timer-question` "First Timer", `_order_count` "Order Count", pd.order_id "Order ID" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `_order_count` ASC');

  appendToSheet(sheet, results);
  
  setColoursFormat(sheet, "C2:C", "Yes", "#ffe6e6");

  results.close();
}
