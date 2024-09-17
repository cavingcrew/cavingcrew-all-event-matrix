function readAdmin(stmt) {
  makeReport(stmt, {
    sheetName: "Admin",
    query: 'select distinct `first_name` "First Name", `last_name` "Last Name", `nickname` "Facebook Name", `admin-phone-number` "Phone Number", `admin-participation-statement-one` "Participation Statement 1", `admin-participation-statement-two` "Participation Statement 2", `admin-car-registration` "Car Registration", `admin-emergency-contact-name` "Emergency Contact Name", `admin-emergency-contact-phone` "Emergency Contact Phone", pd.order_id "Order ID" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=${cell} AND status="wc-processing" order by `first_name` ASC',
    formatting: [
      { type: 'wrap', column: "Participation Statement 1" },
      { type: 'wrap', column: "Participation Statement 2" }
    ]
  });
}
