function readDiet(stmt) {
  makeReport(stmt, {
    sheetName: "Diet",
    query: 'select distinct `first_name` as "First Name", `nickname` as "Facebook Name", `admin-dietary-requirements` as "Dietary Requirements", `admin-diet-allergies-health-extra-info` "Diet and Health Details", pd.order_id as "Order ID" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=${cell} AND pd.status="wc-processing" order by `admin-dietary-requirements` ASC',
    formatting: [
      { type: 'color', column: "Dietary Requirements", search: "Vegan", color: colors.lightGreen },
      { type: 'color', column: "Dietary Requirements", search: "Vegetarian", color: colors.lightGreen },
      { type: 'text', column: "Diet and Health Details", search: "No", color: colors.grey }
    ]
  });
}
