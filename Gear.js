function readGear(stmt) {
  makeReport(stmt, {
    sheetName: "Gear",
    query: 'select distinct `first_name` "First Name", `nickname` "Facebook Name", `skills-horizontal` "Horizontal Skills", `skills-leading-horizontal` "Horizontal Leading Skills", `caving-horizontal-happy-to-second-or-lead` "Lead/Second in Horizontal", `skills-srt` "SRT Skills", `skills-leading-srt` "SRT Leading Skills", `caving-srt-happy-to-second-or-lead` "Lead in Vertical", `gear-bringing-evening-or-day-trip` "Kit Bringing", `gear-rope-length` "Rope Length", `skills-leading-coaching` "Coaching Skills", `caving-srt-or-horizontal-preference` "Horizontal/Vertical Preference", `gear-walking-equipment-weekend` "Walking Gear", pd.order_id "Order ID" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=${cell} AND status="wc-processing" order by `first_name` ASC',
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
