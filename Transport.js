function readTransport(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Transport");
 
  var results = stmt.executeQuery('select `first_name` "First Name", `nickname` "Facebook Name", `transport-need-lift` "Needs Lift", `transport-will-you-give-lift` "Offering Lift", `transport-leaving-location` "Leaving From", `transport-depature-time` "Departure Time" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `transport-need-lift` ASC');

  appendToSheet(sheet, results);
  
  setColoursFormat(sheet, "C2:C", "Yes", "#ffe6e6");
  setColoursFormat(sheet, "D2:D", "Yes", "#e6ffe6");

  results.close();
}
