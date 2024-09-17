function readBuddy(stmt) {
  let cell = setupCell("Dashboard", "B49");
  let sheet = setupSheet("Buddy");
 
  // Log the value of cell for debugging
  console.log("Product ID from cell B49:", cell);

  // Check if cell is empty or not a number
  if (!cell || isNaN(cell)) {
    throw new Error("Invalid product ID in cell B49. Please make sure it contains a valid number.");
  }

  var query = 'SELECT DISTINCT `first_name` "First Name", `nickname` "Facebook Name", `admin-first-timer-question` "First Timer", `_order_count` "Order Count", pd.order_id "Order ID" FROM jtl_member_db db LEFT JOIN jtl_order_product_customer_lookup pd ON pd.user_id = db.id WHERE product_id=' + cell + ' AND status="wc-processing" ORDER BY `_order_count` ASC';

  // Log the full query for debugging
  console.log("Executing query:", query);

  try {
    var results = stmt.executeQuery(query);
    appendToSheet(sheet, results);
    setColoursFormat(sheet, "First Timer", "Yes", colors.lightRed);
    results.close();
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}
