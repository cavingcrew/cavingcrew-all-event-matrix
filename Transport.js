function readTransport(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Transport");
 
  var results = stmt.executeQuery('select `first_name` "First Name", `nickname` "Facebook Name", `transport-need-lift` "Needs Lift", `transport-will-you-give-lift` "Offering Lift", `transport-leaving-location` "Leaving From", `transport-depature-time` "Departure Time", pd.order_id "Order ID" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `transport-need-lift` ASC');

  appendToSheet(sheet, results);
  
  setColoursFormat(sheet, "Needs Lift", "Yes", colors.lightRed);
  setColoursFormat(sheet, "Offering Lift", "Yes", colors.lightGreen);
  setTextFormat(sheet, "Needs Lift", "No", colors.grey);
  setTextFormat(sheet, "Offering Lift", "No", colors.grey);

  results.close();
}
