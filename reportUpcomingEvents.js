function readUpcomingEvents(stmt, cell) {
	makeReport(stmt, {
		sheetName: "Upcoming Events",
		query: `
      SELECT 
        e.product_id AS "ID",
        e.product_name AS "Event Name",
        COALESCE(e.event_start_date_time, e.event_start_date) AS "Start Date",
        e.total_sales AS "Total Bookings",
        COUNT(o.order_id) AS "Pending Attendees",
        e.stock_status AS "Stock Status",
        e.primary_category AS "Category"
      FROM jtl_vw_events_db e
      LEFT JOIN jtl_order_product_customer_lookup o 
        ON e.product_id = o.product_id 
        AND o.status = 'wc-processing'
        AND o.cc_attendance = 'pending'
      WHERE e.stock_status != 'private'
        AND (COALESCE(e.event_start_date_time, e.event_start_date) >= CURDATE() - INTERVAL 7 DAY
            OR COUNT(o.order_id) > 0)
      GROUP BY e.product_id
      ORDER BY COALESCE(e.event_start_date_time, e.event_start_date) DESC
    `,
		formatting: [
			{ type: "wrap", column: "Event Name" },
			{ type: "columnWidth", column: "Event Name", width: 300 },
			{ type: "columnWidth", column: "Start Date", width: 150 },
			{ type: "color", column: "Stock Status", search: "private", color: colors.grey }
		],
	});
}
