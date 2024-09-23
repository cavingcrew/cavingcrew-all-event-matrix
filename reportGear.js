function readGear(stmt, cell) {
  makeReport(stmt, {
    sheetName: "Gear",
    query: `
      SELECT DISTINCT
        \`first_name\` AS "First Name",
        \`nickname\` AS "Facebook Name",
        \`skills-horizontal\` AS "Horizontal Skills",
        \`skills-leading-horizontal\` AS "Horizontal Leading Skills",
        \`caving-horizontal-happy-to-second-or-lead\` AS "Lead/Second in Horizontal",
        \`skills-srt\` AS "SRT Skills",
        \`skills-leading-srt\` AS "SRT Leading Skills",
        \`caving-srt-happy-to-second-or-lead\` AS "Lead in Vertical",
        \`gear-bringing-evening-or-day-trip\` AS "Kit Bringing",
        \`gear-rope-length\` AS "Rope Length",
        \`skills-leading-coaching\` AS "Coaching Skills",
        \`caving-srt-or-horizontal-preference\` AS "Horizontal/Vertical Preference",
        \`gear-walking-equipment-weekend\` AS "Walking Gear",
        pd.order_id AS "Order ID"
      FROM jtl_member_db db
      LEFT JOIN jtl_order_product_customer_lookup pd ON pd.user_id = db.id
      WHERE product_id=${cell} AND status="wc-processing"
      ORDER BY \`first_name\` ASC
    `,
    formatting: [
      { type: 'color', column: "Horizontal Skills", search: "Yes", color: colors.lightGreen },
      { type: 'color', column: "Horizontal Leading Skills", search: "Yes", color: colors.lightGreen },
      { type: 'color', column: "Lead/Second in Horizontal", search: "Yes", color: colors.lightGreen },
      { type: 'color', column: "SRT Skills", search: "Yes", color: colors.lightGreen },
      { type: 'text', column: "Lead in Vertical", search: "No", color: colors.grey },
      { type: 'text', column: "Kit Bringing", search: "No", color: colors.grey },
      { type: 'text', column: "Rope Length", search: "No", color: colors.grey },
      { type: 'text', column: "Coaching Skills", search: "No", color: colors.grey },
      { type: 'text', column: "Horizontal/Vertical Preference", search: "No", color: colors.grey },
      { type: 'text', column: "Walking Gear", search: "No", color: colors.grey },
      { type: 'color', column: "SRT Skills", search: "No-SRT", color: colors.lightRed },
      { type: 'color', column: "SRT Skills", search: "Pre-SRT Basic", color: colors.lightYellow },
      { type: 'color', column: "SRT Skills", search: "Pre-SRT Intermediate", color: colors.yellow },
      { type: 'color', column: "SRT Skills", search: "SRT Intermediate", color: colors.lightGreen },
      { type: 'color', column: "Kit Bringing", search: "Nothing", color: colors.lightRed },
      { type: 'text', column: "Kit Bringing", search: "Nothing - I'm totally new to this", color: colors.lightRed }
    ]
  });
}
