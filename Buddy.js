function readBuddy(stmt) {
  makeReport(stmt, {
    sheetName: "Buddy",
    query: `
      SELECT DISTINCT
        \`first_name\` AS "First Name",
        \`nickname\` AS "Facebook Name",
        \`admin-first-timer-question\` AS "First Timer",
        \`_order_count\` AS "Order Count",
        pd.order_id AS "Order ID"
      FROM jtl_member_db db
      LEFT JOIN jtl_order_product_customer_lookup pd ON pd.user_id = db.id
      WHERE product_id=${cell} AND status="wc-processing"
      ORDER BY \`_order_count\` ASC
    `,
    formatting: [
      { type: 'color', column: "First Timer", search: "Yes", color: colors.lightRed }
    ]
  });
}
