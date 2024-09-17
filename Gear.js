function readGear(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Gear");
 
  var results = stmt.executeQuery('select distinct `first_name` "First Name", `nickname` "Facebook Name", `skills-horizontal` "Horizontal Skills", `skills-leading-horizontal` "Horizontal Leading Skills", `caving-horizontal-happy-to-second-or-lead` "Lead/Second in Horizontal", `skills-srt` "SRT Skills", `skills-leading-srt` "SRT Leading Skills", `caving-srt-happy-to-second-or-lead` "Lead in Vertical", `gear-bringing-evening-or-day-trip` "Kit Bringing", `gear-rope-length` "Rope Length", `skills-leading-coaching` "Coaching Skills", `caving-srt-or-horizontal-preference` "Horizontal/Vertical Preference", `gear-walking-equipment-weekend` "Walking Gear" from jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND status="wc-processing" order by `first_name` ASC');

  appendToSheet(sheet, results);
  
  setColoursFormat(sheet, "C2:F", "Yes", "#e6ffe6");
  setTextFormat(sheet, "G2:M", "No", "#a9a9a9");

  results.close();
}
