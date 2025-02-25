function readUpcomingEvents(stmt, cell) {
	makeReport(stmt, {
		sheetName: "Upcoming Events",
		query: `
      SELECT 
        e.product_name AS "Event Name",
        COALESCE(e.event_start_date_time, e.event_start_date) AS "Start Date",
        COALESCE(pending_counts.pending_attendees, 0) AS "Signups",
        e.event_trip_leader AS "Trip Leader",
        e.open_spaces AS "Open Spaces",
        CASE 
          WHEN e.event_non_members_welcome = 'no' THEN 'Yes'
          ELSE 'No' 
        END AS "Membership Required",
        CASE
          WHEN e.event_must_caved_with_us_before = 'yes' THEN 'Yes'
          ELSE 'No'
        END AS "Must Have Caved Before",
        CASE
          WHEN COALESCE(e.event_skills_required, e.what_is_the_minimum_skill_required_for_this_trip) NOT IN ('None specified', 'Open to All Abilities')
            THEN COALESCE(e.event_skills_required, e.what_is_the_minimum_skill_required_for_this_trip)
          WHEN COALESCE(e.event_prior_experience, 'None specified') != 'None specified'
            THEN e.event_prior_experience
          ELSE 'Open to All Abilities'
        END AS "Experience Requirements",
        e.event_gear_required AS "Minimum Gear",
        CASE 
          WHEN e.event_for_u18s = 'no' THEN 'No'
          ELSE 'Yes'
        END AS "Under 18s Trip",
        e.primary_category AS "Category",
        e.post_status AS "Status",
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
        AND e.post_status = 'publish'
        AND (
          COALESCE(e.event_start_date_time, e.event_start_date) >= CURDATE()
          OR pending_counts.pending_attendees > 0
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
				type: "columnWidth",
				column: "Trip Leader",
				width: 120,
			},
			{
				type: "color",
				column: "Trip Leader",
				color: colors.lightBlue,
				when: (cell) => cell?.getValue()?.trim() !== "",
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
			// Membership Required
			{
				type: "color",
				column: "Membership Required",
				search: "Yes",
				color: colors.lightRed,
			},
			{
				type: "color",
				column: "Membership Required",
				search: "No",
				color: colors.lightGreen,
			},
			// Must Have Caved Before
			{
				type: "color",
				column: "Must Have Caved Before",
				search: "Yes",
				color: colors.lightRed,
			},
			{
				type: "color",
				column: "Must Have Caved Before",
				search: "No",
				color: colors.lightGreen,
			},
			// Experience Requirements
			{
				type: "columnWidth",
				column: "Experience Requirements",
				width: 30,
			},
			{
				type: "color",
				column: "Experience Requirements",
				search: "caved_before",
				color: colors.orange,
			},
			{
				type: "color",
				column: "Experience Requirements",
				search: "Open to All Abilities",
				color: colors.lightGreen,
			},
			{
				type: "wrap",
				column: "Experience Requirements",
			},
			// Minimum Gear
			{
				type: "columnWidth",
				column: "Minimum Gear",
				width: 30,
			},
			{
				type: "color",
				column: "Minimum Gear",
				search: "None",
				color: colors.lightGrey,
			},
			{
				type: "wrap",
				column: "Minimum Gear",
			},
			// Under 18s Trip
			{
				type: "color",
				column: "Under 18s Trip",
				search: "Yes",
				color: colors.lightGreen,
			},
			{
				type: "color",
				column: "Under 18s Trip",
				search: "No",
				color: colors.lightRed,
			},
			// Category
			{
				type: "color",
				column: "Category",
				search: "Overnight Trips",
				color: colors.lightBlue,
			},
			{
				type: "color",
				column: "Category",
				search: "Evening and Day",
				color: colors.lightPurple,
			},
			{
				type: "color",
				column: "Category",
				search: "Extra-Welcoming",
				color: colors.pink,
			},
			// Status
			{
				type: "columnWidth",
				column: "Status",
				width: 100,
			},
			{
				type: "color",
				column: "Status",
				search: "publish",
				color: colors.lightGreen,
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
