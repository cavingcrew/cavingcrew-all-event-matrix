/**
 * Reads list of all 'Pending' trips from caving crew website server and populates it into Event Listing spreadsheet for later use
 * 
 * Note: Due to SQL schema, this won't show events with no signups as jtl_order_product_customer_lookup doesn't contain them]
 * 
 * TODO:
 *      Purge events listing so that only events which are actually Pending are Pending
 *          (Can this be automated on WP side for future?)
 *      Add common date field to all WP events
 *          (Overnight trips already have date field but not day trips. Using two different date fields is unnecessary complexity, just create one universal one)
 *      Ammend SQL query to read the date field, and use it to order the results rather than ID
 *    
 */

function readEventListing(stmt) {
  makeReport(stmt, {
    sheetName: "Event Listing",
    query: `
      SELECT distinct 
        SUBSTRING_INDEX(\`order_item_name\`, ' - ', 1) AS "Trip Name", 
        \`product_id\` AS "ID", 
        \`cc_start_date\` AS "Date" 
      FROM jtl_order_product_customer_lookup 
      WHERE cc_attendance="pending" 
        AND product_id <> "1272" 
        AND product_id <> "548" 
        AND (STR_TO_DATE(cc_start_date, '%Y%m%d') BETWEEN '2024-01-01' AND '2024-12-31' 
          OR STR_TO_DATE(cc_start_date, '%Y-%m-%d %H:%i:%s') BETWEEN '2024-01-01' AND '2024-12-31') 
      GROUP BY product_id 
      ORDER BY 
        CASE 
          WHEN cc_start_date LIKE '%-%' THEN STR_TO_DATE(cc_start_date, '%Y-%m-%d %H:%i:%s') 
          ELSE STR_TO_DATE(cc_start_date, '%Y%m%d') 
        END ASC
    `,
    formatting: []
  });
}
