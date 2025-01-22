function readUpcomingEvents(stmt, cell) {
	makeReport(stmt, {
		sheetName: "Upcoming Events",
		query: `
      SELECT 
        e.product_name AS "Event Name",
        COALESCE(e.event_start_date_time, e.event_start_date) AS "Start Date",
        COALESCE(pending_counts.pending_attendees, 0) AS "Signups",
        e.open_spaces AS "Open Spaces",
        e.post_status AS "Status",
        e.primary_category AS "Category",
        e.product_id AS "ID"
      FROM jtl_vw_events_db e
      LEFT JOIN (
        SELECT product_id, COUNT(order_id) AS pending_attendees
        FROM jtl_order_product_customer_lookup
        WHERE status = 'wc-processing'
          AND cc_attendance = 'pending'
        GROUP BY product_id
      ) pending_counts ON e.product_id = pending_counts.product_id
      WHERE e.stock_status != 'private'
        AND COALESCE(e.event_start_date_time, e.event_start_date) IS NOT NULL
        AND LOWER(e.product_name) NOT LIKE '%template%'
        AND e.primary_category != 'Memberships'
        AND (
          COALESCE(e.event_start_date_time, e.event_start_date) >= CURDATE()
          OR pending_counts.pending_attendees > 0
        )
        AND EXISTS (
          SELECT 1 
          FROM jtl_order_product_customer_lookup o 
          WHERE o.product_id = e.product_id 
            AND o.order_created >= CURDATE() - INTERVAL 6 MONTH
        )
      ORDER BY COALESCE(e.event_start_date_time, e.event_start_date) DESC
    `,
		formatting: [
			{ type: "wrap", column: "Event Name" },
			{ type: "columnWidth", column: "Event Name", width: 300 },
			{ type: "columnWidth", column: "Start Date", width: 150 },
			{
				type: "columnWidth",
				column: "Open Spaces",
				width: 120,
			},
			{
				type: "color",
				column: "Open Spaces",
				search: "0",
				color: colors.lightRed,
			},
			{
				type: "color",
				column: "Open Spaces",
				search: "-",
				color: colors.pink,
			},
			{
				type: "color",
				column: "Open Spaces",
				search: "[1-9]",
				color: colors.lightGreen,
			},
			{
				type: "columnWidth",
				column: "Status",
				width: 100,
			},
			{
				type: "color",
				column: "Status",
				search: "private",
				color: colors.grey,
			},
			{
				type: "color",
				column: "Status",
				search: "draft",
				color: colors.yellow,
			},
		],
	});
}
