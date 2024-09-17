function readGear(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Gear");
 
  var results = stmt.executeQuery('select distinct `first_name`,`nickname` "Facebook Name", `skills-horizontal` "Skills Horizontal",`skills-leading-horizontal` "Skills Horizontal Leading", `caving-horizontal-happy-to-second-or-lead` "Lead or second in horizontal environments", `skills-srt` "Skills SRT", `skills-leading-srt` "Skills SRT Leading",`caving-srt-happy-to-second-or-lead` "Lead in vertical environmnts", `gear-bringing-evening-or-day-trip` "kit bringing", `gear-rope-length` "Rope Length", `skills-leading-coaching` "Coaching Skills", `caving-srt-or-horizontal-preference` "Horizontal or Vertical Preference", `gear-walking-equipment-weekend` "Gear for Walking" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `first_name` ASC');

  appendToSheet(sheet, results);
  
  setColoursFormat(sheet, "C2:F", "Yes", "#e6ffe6");
  setTextFormat(sheet, "G2:M", "No", "#a9a9a9");

  results.close();
}
