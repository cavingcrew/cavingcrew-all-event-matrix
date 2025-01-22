function readUpcomingEvents(stmt, cell) {
	makeReport(stmt, {
		sheetName: "Upcoming Events",
		query: `
      SELECT 
        e.product_id AS "ID",
        e.product_name AS "Event Name",
        COALESCE(e.event_start_date_time, e.event_start_date) AS "Start Date",
        e.total_sales AS "Total Bookings",
        COALESCE(pending_counts.pending_attendees, 0) AS "Pending Attendees",
        e.stock_status AS "Stock Status",
        e.primary_category AS "Category"
      FROM jtl_vw_events_db e
      LEFT JOIN (
        SELECT product_id, COUNT(order_id) AS pending_attendees
        FROM jtl_order_product_customer_lookup
        WHERE status = 'wc-processing'
          AND cc_attendance = 'pending'
        GROUP BY product_id
      ) pending_counts ON e.product_id = pending_counts.product_id
      WHERE e.stock_status != 'private'
        AND (
          COALESCE(e.event_start_date_time, e.event_start_date) >= CURDATE() - INTERVAL 7 DAY
          OR pending_counts.pending_attendees > 0
        )
      ORDER BY COALESCE(e.event_start_date_time, e.event_start_date) DESC
    `,
		formatting: [
			{ type: "wrap", column: "Event Name" },
			{ type: "columnWidth", column: "Event Name", width: 300 },
			{ type: "columnWidth", column: "Start Date", width: 150 },
			{
				type: "color",
				column: "Stock Status",
				search: "private",
				color: colors.grey,
			},
		],
	});
}
