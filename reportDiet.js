function readDiet(stmt, cell) {
	makeReport(stmt, {
		sheetName: "Diet",
		query: `
      SELECT DISTINCT
        \`first_name\` AS "First Name",
        \`nickname\` AS "Facebook Name",
        \`admin-dietary-requirements\` AS "Dietary Requirements",
        \`admin-diet-allergies-health-extra-info\` AS "Diet and Health Details",
        pd.order_id AS "Order ID"
      FROM jtl_member_db db
      LEFT JOIN jtl_order_product_customer_lookup pd ON pd.user_id = db.id
      WHERE product_id=${cell} AND pd.status="wc-processing"
      ORDER BY \`admin-dietary-requirements\` ASC
    `,
		formatting: [
			{
				type: "color",
				column: "Dietary Requirements",
				search: "Vegan",
				color: colors.lightGreen,
			},
			{
				type: "color",
				column: "Dietary Requirements",
				search: "Vegetarian",
				color: colors.lightGreen,
			},
			{
				type: "text",
				column: "Diet and Health Details",
				search: "No",
				color: colors.grey,
			},
		],
	});
}
