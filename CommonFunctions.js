const scriptProperties = PropertiesService.getScriptProperties();

const server = scriptProperties.getProperty("cred_server");
const port = Number.parseInt(scriptProperties.getProperty("cred_port"), 10);
const dbName = scriptProperties.getProperty("cred_dbName");
const username = scriptProperties.getProperty("cred_username");
const password = scriptProperties.getProperty("cred_password");
const url = `jdbc:mysql://${server}:${port}/${dbName}`;
const cc_location = scriptProperties.getProperty("cred_cc_location");
const apidomain = scriptProperties.getProperty("cred_apidomain");
const apiusername = scriptProperties.getProperty("cred_apiusername");
const apipassword = scriptProperties.getProperty("cred_apipassword");

const colors = {
	lightRed: "#ffe6e6",
	lightGreen: "#e6ffe6",
	lightYellow: "#ffd898",
	lightBlue: "#e0ffff",
	grey: "#a9a9a9",
	pink: "#ff75d8",
	yellow: "#fad02c",
	white: "#FFFFFF",
};

function setupSheet(name) {
	const spreadsheet = SpreadsheetApp.getActive();
	const sheet = spreadsheet.getSheetByName(name);
	sheet.clearContents();
	sheet.clearFormats();
	return sheet;
}

function setupCell(name, range) {
	const spreadsheet = SpreadsheetApp.getActive();
	const sheet = spreadsheet.getSheetByName(name);
	let cellValue = sheet.getRange(range).getValue();

	if (Number.isNaN(cellValue) || cellValue === "") {
		// Rerun eventListing
		eventListing();

		// Try again
		cellValue = sheet.getRange(range).getValue();

		if (Number.isNaN(cellValue) || cellValue === "") {
			throw new Error("Invalid event selected - please try again");
		}
	}

	return cellValue;
}

function appendToSheet(sheet, results) {
	const metaData = results.getMetaData();
	const numCols = metaData.getColumnCount();
	const rows = [];

	// First row with column labels
	const colLabels = [];
	for (let col = 0; col < numCols; col++) {
		colLabels.push(metaData.getColumnLabel(col + 1));
	}
	rows.push(colLabels);

	// Remaining rows with results
	while (results.next()) {
		const row = [];
		for (let col = 0; col < numCols; col++) {
			row.push(results.getString(col + 1));
		}
		rows.push(row);
	}

	sheet.getRange(1, 1, rows.length, numCols).setValues(rows);

	// Set the font size of the rows with column labels to 14
	sheet.getRange(1, 1, 1, numCols).setFontSize(14);
	sheet.autoResizeColumns(1, numCols);
}

function getColumnRange(sheet, columnHeader) {
	const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
	const columnIndex = headers.indexOf(columnHeader) + 1;
	if (columnIndex === 0) {
		throw new Error(`Column '${columnHeader}' not found in the sheet.`);
	}
	const lastRow = sheet.getLastRow();
	if (lastRow <= 1) {
		// If there's only a header row or the sheet is empty, return null
		return null;
	}
	return sheet.getRange(2, columnIndex, lastRow - 1, 1);
}

function setColoursFormat(sheet, columnHeader, search, colour) {
	try {
		const range = getColumnRange(sheet, columnHeader);
		if (range === null) {
			// If there's no data, just return without setting any formatting
			return;
		}
		const rule = SpreadsheetApp.newConditionalFormatRule()
			.whenTextContains(search)
			.setBackground(colour)
			.setRanges([range])
			.build();
		const rules = sheet.getConditionalFormatRules();
		rules.push(rule);
		sheet.setConditionalFormatRules(rules);
	} catch (error) {
		console.log(
			`Error setting colour format for column '${columnHeader}': ${error.message}`,
		);
	}
}

function setTextFormat(sheet, columnHeader, search, colour) {
	const range = getColumnRange(sheet, columnHeader);
	const rule = SpreadsheetApp.newConditionalFormatRule()
		.whenTextContains(search)
		.setFontColor(colour)
		.setRanges([range])
		.build();
	const rules = sheet.getConditionalFormatRules();
	rules.push(rule);
	sheet.setConditionalFormatRules(rules);
}

function setWrapped(sheet, columnHeader) {
	const range = getColumnRange(sheet, columnHeader);
	range.setWrap(true);
	sheet.setColumnWidth(range.getColumn(), 300); // Set column width to 300 pixels
}

function setColoursFormatLessThanOrEqualTo(
	sheet,
	columnHeader,
	search,
	colour,
) {
	const numberSearch = Number(search);
	const range = getColumnRange(sheet, columnHeader);
	const rule = SpreadsheetApp.newConditionalFormatRule()
		.whenNumberLessThanOrEqualTo(numberSearch)
		.setBackground(colour)
		.setRanges([range])
		.build();
	const rules = sheet.getConditionalFormatRules();
	rules.push(rule);
	sheet.setConditionalFormatRules(rules);
}

function setNumberFormat(sheet, columnHeader, format) {
	const range = getColumnRange(sheet, columnHeader);
	range.setNumberFormat(format);
}

function makeReport(stmt, reportConfig) {
	try {
		const cell = setupCell("Dashboard", "B49");
		const sheet = setupSheet(reportConfig.sheetName);

		const results = stmt.executeQuery(
			reportConfig.query.replace(/\${cell}/g, cell),
		);

		appendToSheet(sheet, results);

		if (reportConfig.formatting && sheet.getLastRow() > 1) {
			applyFormatting(sheet, reportConfig);
		}

		results.close();
	} catch (error) {
		console.log(
			`Error in makeReport for ${reportConfig.sheetName}: ${error.message}`,
		);
	}
}

function applyFormatting(sheet, reportConfig) {
	for (const format of reportConfig.formatting) {
		try {
			switch (format.type) {
				case "color":
					setColoursFormat(sheet, format.column, format.search, format.color);
					break;
				case "text":
					setTextFormat(sheet, format.column, format.search, format.color);
					break;
				case "wrap":
					setWrapped(sheet, format.column);
					break;
				case "numberFormat":
					setNumberFormat(sheet, format.column, format.format);
					break;
				case "colorLessThanOrEqual":
					setColoursFormatLessThanOrEqualTo(
						sheet,
						format.column,
						format.value,
						format.color,
					);
					break;
				case "columnWidth":
					setColumnWidth(sheet, format.column, format.width);
					break;
				case "dataValidation":
					setDataValidation(sheet, format.column, format.rule);
					break;
			}
		} catch (formatError) {
			console.log(
				`Error applying format in ${reportConfig.sheetName}: ${formatError.message}`,
			);
		}
	}
}

function setColumnWidth(sheet, columnHeader, width) {
	const range = getColumnRange(sheet, columnHeader);
	sheet.setColumnWidth(range.getColumn(), width);
}

function setDataValidation(sheet, columnHeader, rule) {
	const range = getColumnRange(sheet, columnHeader);
	const validation = SpreadsheetApp.newDataValidation()
		[rule.type](rule.condition)
		.setAllowInvalid(false)
		.setHelpText(rule.message)
		.build();
	range.setDataValidation(validation);
}

function getOrderIdFromActiveCell() {
	const sheet = SpreadsheetApp.getActiveSheet();
	const activeCell = sheet.getActiveCell();
	const activeRow = activeCell.getRow();
	const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
	const orderIdColumnIndex = headers.indexOf("Order ID") + 1;

	if (orderIdColumnIndex === 0) {
		throw new Error("Column 'Order ID' not found in the current sheet.");
	}

	if (activeRow === 1) {
		throw new Error("Please select a cell in a data row, not the header row.");
	}

	const orderId = sheet.getRange(activeRow, orderIdColumnIndex).getValue();

	if (!orderId || Number.isNaN(orderId)) {
		throw new Error(
			"Invalid Order ID. Please make sure you've selected a valid order.",
		);
	}

	return orderId;
}

function updateOrderStatus(orderId, newStatus) {
	const sheet = SpreadsheetApp.getActiveSheet();
	const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
	const statusColumnIndex = headers.indexOf("Status") + 1;

	if (statusColumnIndex === 0) {
		sheet.getRange(1, sheet.getLastColumn() + 1).setValue("Status");
		sheet
			.getRange(sheet.getActiveCell().getRow(), sheet.getLastColumn())
			.setValue(newStatus);
	} else {
		sheet
			.getRange(sheet.getActiveCell().getRow(), statusColumnIndex)
			.setValue(newStatus);
	}
}

function showError(message) {
	Browser.msgBox("Error", message, Browser.Buttons.OK);
}

function formatSocialMediaFooter(startTime, eventType) {
  const date = new Date(startTime);

  if (eventType === "OVERNIGHT") {
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 2);
    return (
      `${date.getDate()}${getOrdinal(date.getDate())} ${date.toLocaleString("default", { month: "long" })} ` +
      `- ${endDate.getDate()}${getOrdinal(endDate.getDate())} ${endDate.toLocaleString("default", { month: "long" })}`
    );
  }

  if (["TRAINING", "HORIZONTAL_TRAINING", "BASIC_SRT"].includes(eventType)) {
    const time = date
      .toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
      })
      .replace(/:/g, ".");
    return `${time} • ${date.toLocaleString("default", {
      weekday: "long",
    })} ${date.getDate()}${getOrdinal(date.getDate())} ${date.toLocaleString(
      "default",
      { month: "long" }
    )}`;
  }

  return `${date.getDate()}${getOrdinal(date.getDate())} ${date.toLocaleString("default", { month: "long" })}`;
}

function getOrdinal(n) {
	return (
		[undefined, "st", "nd", "rd"][(((n / 10) % 10) ^ 1 && n % 10) || 10] || "th"
	);
}
