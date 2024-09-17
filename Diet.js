function readDiet(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Diet");

  var results = stmt.executeQuery('select distinct `first_name` as "First Name", `nickname` as "Facebook Name", `admin-dietary-requirements` as "Dietary Requirements", `admin-diet-allergies-health-extra-info` "Diet and Health Details", pd.order_id as "Order ID" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND pd.status="wc-processing" order by `admin-dietary-requirements` ASC');

  appendToSheet(sheet, results);

  setColoursFormat(sheet, "Dietary Requirements", "Vegan", colors.lightGreen);
  setColoursFormat(sheet, "Dietary Requirements", "Vegetarian", colors.lightGreen);
  setTextFormat(sheet, "Diet and Health Details", "No", colors.grey);

  results.close();
}
