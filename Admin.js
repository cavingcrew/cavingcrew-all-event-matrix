function readAdmin(stmt) {
  makeReport(stmt, {
    sheetName: "Admin",
    query: `
      SELECT DISTINCT
        \`first_name\` AS "First Name",
        \`last_name\` AS "Last Name",
        \`nickname\` AS "Facebook Name",
        \`admin-phone-number\` AS "Phone Number",
        \`admin-participation-statement-one\` AS "Participation Statement 1",
        \`admin-participation-statement-two\` AS "Participation Statement 2",
        \`admin-car-registration\` AS "Car Registration",
        \`admin-emergency-contact-name\` AS "Emergency Contact Name",
        \`admin-emergency-contact-phone\` AS "Emergency Contact Phone",
        pd.order_id AS "Order ID"
      FROM jtl_member_db db
      LEFT JOIN jtl_order_product_customer_lookup pd ON pd.user_id = db.id
      WHERE product_id=${cell} AND status="wc-processing"
      ORDER BY \`first_name\` ASC
    `,
    formatting: [
      { type: 'wrap', column: "Participation Statement 1" },
      { type: 'wrap', column: "Participation Statement 2" }
    ]
  });
}
