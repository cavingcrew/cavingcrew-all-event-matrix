function readDiet(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Diet");
 
  var results = stmt.executeQuery('select distinct `first_name` as "First Name", `nickname` as "Facebook Name", `admin-dietary-requirements` as "Dietary Requirements", `admin-diet-allergies-health-extra-info` "Diet and Health Details", cc_attendance as "Attendance", status as "Status", pd.order_id as "Order ID", user_id as "User ID" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND pd.status="wc-processing" order by `admin-dietary-requirements` ASC');

  appendToSheet(sheet, results);
  
  setColoursFormat(sheet, "C2:C", "Vegan", "#e6ffe6");
  setColoursFormat(sheet, "C2:C", "Vegetarian", "#e6ffe6");
  setTextFormat(sheet, "D2:D", "No", "#a9a9a9");

  results.close();
}
