/**
 * Event type definitions with associated WordPress template IDs and UI text
 */
const EVENT_TEMPLATES = {
	OVERNIGHT: {
		id: 11583,
		label: "Overnight Trip",
		nameInstructions: "What's the name of this weekend trip?",
		namePlaceholder: "e.g. 'October Peak District Caving Weekend'",
		dateQuestion: "When does the trip start?",
	},
	HORIZONTAL_TRAINING: {
		id: 12759,
		label: "Horizontal Training Event",
		nameInstructions: "What's the name of this horizontal training?",
		namePlaceholder: "e.g. 'Horizontal Caving Techniques Workshop'",
		dateQuestion: "When does the training start?",
	},
	BASIC_SRT: {
		id: 12758,
		label: "Basic SRT Training Event",
		nameInstructions: "What's the name of this SRT training?",
		namePlaceholder: "e.g. 'Basic Single Rope Technique Session'",
		dateQuestion: "When does the training start?",
	},
	KNOWN_LOCATION: {
		id: 11595,
		label: "Known Location Tuesday/Saturday Trip",
		nameInstructions: "What's the name of this trip?",
		namePlaceholder: "e.g. 'Box Mine Tuesday Evening Trip'",
		dateQuestion: "When is this trip?",
	},
	MYSTERY: {
		id: 11576,
		label: "Tuesday Evening Mystery Trip",
		nameInstructions: "What's the name of this mystery trip?",
		namePlaceholder: "e.g. 'Mystery Tuesday Evening Trip'",
		dateQuestion: "When is this trip?",
	},
	GIGGLE: {
		id: 11579,
		label: "Bagshawe Beginner GiggleTrip",
		nameInstructions: "What's the name of this GiggleTrip?",
		namePlaceholder: "e.g. 'Bagshawe Beginners GiggleTrip'",
		dateQuestion: "When is this trip?",
	},
};

/**
 * Shows the modal dialog for creating a new event
 */
function getClientScript(templates) {
	return `
    // CLIENT-SIDE DATE FORMATTING UTILITIES
    function getOrdinal(n) {
      return ([,"st","nd","rd"][(n/10%10^1&&n%10)]||"th");
    }

    function formatDate(date, formatStr) {
      return formatStr.replace(/([a-z]+)/gi, (match) => {
        switch(match.toLowerCase()) {
          case 'd': return date.getDate().toString().padStart(2, '0');
          case 'j': return date.getDate();
          case 's': return getOrdinal(date.getDate());
          case 'f': return date.toLocaleString('en-US', {month:'long'});
          case 'm': return (date.getMonth()+1).toString().padStart(2, '0');
          case 'y': return date.getFullYear().toString().slice(-2);
          case 'Y': return date.getFullYear();
          case 'h': return date.getHours().toString().padStart(2, '0');
          case 'i': return date.getMinutes().toString().padStart(2, '0');
          case 'l': return date.toLocaleString('en-US', {weekday:'long'});
          default: return match;
        }
      });
    }

    const templates = ${JSON.stringify(templates)};
    
    document.querySelectorAll('input[name="eventType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const template = templates[e.target.value];
        document.getElementById('eventDetails').style.display = 'block';
        document.getElementById('nameLabel').textContent = template.nameInstructions;
        document.getElementById('eventName').placeholder = template.namePlaceholder;
        document.getElementById('dateLabel').textContent = template.dateQuestion;
      });
    });

    function setLoading(isLoading) {
      const submitBtn = document.getElementById('submitButton');
      const spinner = document.getElementById('spinner');
      const buttonText = document.getElementById('buttonText');
      
      submitBtn.disabled = isLoading;
      spinner.style.display = isLoading ? 'inline-block' : 'none';
      buttonText.textContent = isLoading ? 'Creating Event...' : 'Create Event and Continue Editing';
    }

    function showError(message) {
      const errorDiv = document.getElementById('errorMessage');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      setLoading(false);
    }

    document.getElementById('eventForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear any previous errors
      document.getElementById('errorMessage').style.display = 'none';
      
      // Set loading state
      setLoading(true);

      const selectedType = document.querySelector('input[name="eventType"]:checked').value;
      const eventName = document.getElementById('eventName').value;
      const eventDate = document.getElementById('eventDate').value;

      // Generate social media link IMMEDIATELY from form data
      const baseUrl = "https://socialmedia-image-creator.pages.dev/";
      const date = new Date(eventDate);
      
      // Client-side version of formatSocialMediaFooter
      const formatFooter = (date, eventType) => {
        if (eventType === "OVERNIGHT") {
          const endDate = new Date(date);
          endDate.setDate(date.getDate() + 2);
          return \`\${formatDate(date, 'jS F Y')} - \${formatDate(endDate, 'jS F Y')}\`;
        }
        
        if (["TRAINING","HORIZONTAL_TRAINING","BASIC_SRT"].includes(eventType)) {
          return \`\${formatDate(date, 'H:i')} : \${formatDate(date, 'l jS F Y')}\`;
        }
        
        return formatDate(date, 'jS F Y');
      };

      const socialParams = new URLSearchParams({
        Headline: "The Caving Crew",
        SubHeadline: eventName,
        Footer: formatFooter(date, selectedType),
        HeadlinePosition: "157",
        SubHeadlinePosition: "314", 
        FooterPosition: "533.8",
        BackgroundImage: "/images/photos/IMG_4470.jpg"
      });

      // OPEN SOCIAL TAB IMMEDIATELY
      const socialWindow = window.open(baseUrl + "?" + socialParams.toString(), '_blank');     
      
      // Then process the event creation
      google.script.run
        .withSuccessHandler((result) => {
          if (result?.success) {
            // Only open WordPress editor if successful
            window.open(
              'https://www.cavingcrew.com/wp-admin/post.php?post=' + result.id + '&action=edit',
              '_blank'
            );
          } else {
            socialWindow?.close(); // Close empty social tab if creation failed
            showError(result?.error || 'Failed to create event');
          }
        })
        .withFailureHandler((error) => {
          socialWindow?.close(); // Close empty social tab on error
          showError(error.message || 'An unexpected error occurred');
        })
        .createNewEvent(selectedType, eventName, eventDate);
    });
  `;
}

function getEventDialogHtml() {
	const styles = `
    body {
      font-family: 'Arial', sans-serif;
      padding: 20px;
    }
    .radio-group {
      margin: 10px 0;
      padding-left: 0;
    }
    .radio-group input[type="radio"] {
      margin-right: 8px;
    }
    input[type="text"],
    input[type="datetime-local"] {
      width: 100%;
    }
    #errorMessage {
      display: none;
      color: #dc3545;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #dc3545;
      border-radius: 4px;
      background-color: #f8d7da;
    }
    .spinner-border {
      display: none;
      width: 1rem;
      height: 1rem;
      margin-right: 8px;
    }
  `;

	const radioButtons = Object.entries(EVENT_TEMPLATES)
		.map(
			([key, template]) => `
      <div class="radio-group form-check">
        <input type="radio" name="eventType" value="${key}" id="${key}" class="form-check-input">
        <label for="${key}" class="form-check-label">${template.label}</label>
      </div>
    `,
		)
		.join("");

	return `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>${styles}</style>
    <form id="eventForm" class="container-fluid">
        <div id="errorMessage"></div>
        <div class="mb-4">
            <h3>Select Event Type</h3>
            ${radioButtons}
        </div>
        <div id="eventDetails" style="display: none;">
            <div class="mb-3">
                <label id="nameLabel" class="form-label"></label>
                <input type="text" id="eventName" class="form-control" required>
            </div>
            <div class="mb-3">
                <label id="dateLabel" class="form-label"></label>
                <input type="datetime-local" id="eventDate" class="form-control" required>
            </div>
            <button type="submit" id="submitButton" class="btn btn-primary w-100">
                <span id="spinner" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span id="buttonText">Create Event and Continue Editing</span>
            </button>
        </div>
    </form>
    <script>${getClientScript(EVENT_TEMPLATES)}</script>
  `;
}

function showNewEventDialog() {
	const html = HtmlService.createHtmlOutput(getEventDialogHtml())
		.setWidth(450)
		.setHeight(600)
		.setTitle("Create New Event");

	SpreadsheetApp.getUi().showModalDialog(html, "Create New Event");
}

/**
 * Creates a new event based on the selected template and user input
 *
 * @param {string} eventType - Key of the event template to use
 * @param {string} eventName - Name for the new event
 * @param {string} eventDate - Date string from datetime-local input
 * @returns {Object} - Object containing success status, new post ID if successful, or error message if failed
 */
function createNewEvent(eventType, eventName, eventDate) {
	let response = null; // Define response outside try block

	try {
		const consumerKey = apiusername; // From CommonFunctions.js
		const consumerSecret = apipassword; // From CommonFunctions.js

		if (!consumerKey || !consumerSecret) {
			throw new Error("API credentials not loaded - run refreshCredentials()");
		}

		const encodedAuth = Utilities.base64Encode(
			`${consumerKey}:${consumerSecret}`,
		);
		const apiUrl = `https://www.${apidomain}/wp-json/wc-hybrid-headless/v1/products/create-event`;

		// Debug 3: Verify date formatting
		const formattedDate = Utilities.formatDate(
			new Date(eventDate),
			SpreadsheetApp.getActive().getSpreadsheetTimeZone(),
			"yyyy-MM-dd HH:mm:ss",
		);
		console.log("[DEBUG] Date conversion:", {
			input: eventDate,
			output: formattedDate,
		});

		const payload = {
			event_type: eventType.toLowerCase(),
			event_start_date_time: formattedDate,
			event_name: eventName,
		};

		// Debug 4: Log full request details
		console.log("[DEBUG] API Request:", {
			url: apiUrl,
			method: "POST",
			headers: {
				Authorization: "Basic [REDACTED]",
				"Content-Type": "application/json",
			},
			payload: payload,
		});

		const options = {
			method: "post",
			contentType: "application/json",
			headers: {
				Authorization: `Basic ${encodedAuth}`,
			},
			payload: JSON.stringify(payload),
			muteHttpExceptions: true,
		};

		response = UrlFetchApp.fetch(apiUrl, options);
		const responseBody = response.getContentText();
		const responseCode = response.getResponseCode();

		console.log("[DEBUG] API Response:", {
			code: responseCode,
			body: responseBody,
		});

		const responseData = JSON.parse(responseBody);

		if (responseCode >= 400) {
			throw new Error(
				responseData.message || `API returned ${responseCode} status`,
			);
		}

		// Handle calendar event creation
		try {
			const calendarEventId = createCalendarEventForProduct(
				eventName,
				new Date(eventDate).toISOString(),
				eventType,
				responseData.product_id,
			);
		} catch (calendarError) {
			console.warn("Calendar event creation failed:", calendarError);
		}

		return {
			success: true,
			id: responseData.product_id,
			socialLink: responseData.social_media_link || "",
		};
	} catch (error) {
		console.error("[ERROR DETAILS]", {
			message: error.message,
			stack: error.stack,
			responseCode: response?.getResponseCode(),
			responseBody: response?.getContentText(),
			credentials: {
				consumerKey: apiusername ? "*** EXISTS ***" : "MISSING",
				consumerSecret: apipassword ? "*** EXISTS ***" : "MISSING",
				domain: apidomain || "MISSING",
			},
		});

		return {
			success: false,
			error: "Event creation failed. Details:",
			debugInfo: {
				error: error.message,
				step: "API Request",
				credentialsLoaded: !!apiusername && !!apipassword,
				apiDomain: apidomain,
				responseStatus: response?.getResponseCode() || "No response",
				responseBody: response?.getContentText() || "N/A",
			},
		};
	}
}

function getOrdinal(n) {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return s[(v - 20) % 10] || s[v] || s[0];
}

function testCreateNewEvent() {
	const testData = {
		eventType: "giggletrip",
		eventName: "Test GiggleTrip",
		eventDate: "2024-12-01T19:00",
	};

	console.log("Starting API test with data:", testData);

	try {
		const result = createNewEvent(
			testData.eventType,
			testData.eventName,
			testData.eventDate,
		);

		console.log("API Response:", result);
		return result;
	} catch (error) {
		console.error("Error in createNewEvent:", error);
		throw error;
	}
}
