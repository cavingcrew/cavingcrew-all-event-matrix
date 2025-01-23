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
	TRAINING: {
		id: 123,
		label: "Generic Training Event",
		nameInstructions: "What's the name of this training event?",
		namePlaceholder: "e.g. 'General Caving Training Session'",
		dateQuestion: "When is the training session?",
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

      google.script.run
        .withSuccessHandler((result) => {
          if (result && result.success) {
            // Open social media creator in new tab
            window.open(result.socialLink, '_blank');
            
            // Keep existing open/edit behavior
            window.open(
              'https://www.cavingcrew.com/wp-admin/post.php?post=' + 
              result.id + 
              '&action=edit'
            );
          } else 
            showError(result.error || 'Failed to create event');
        })
        .withFailureHandler((error) => {
          showError(error.message || 'An unexpected error occurred');
        })
        .createNewEvent(selectedType, eventName, eventDate);
    });
  `;
}

function getEventDialogHtml() {
	const styles = `
    body { font-family: Arial, sans-serif; padding: 20px; }
    .radio-group { 
        margin: 10px 0;
        padding-left: 0;  /* Remove default padding */
    }
    .radio-group input[type="radio"] {
        margin-right: 8px;  /* Space between radio and label */
    }
    input[type="text"], input[type="datetime-local"] { 
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
	try {
		const template = EVENT_TEMPLATES[eventType];
		if (!template) {
			return { success: false, error: "Invalid event type selected" };
		}

		// Get the template product
		const templateProduct = getProductById(template.id);
		if (!templateProduct) {
			return { success: false, error: "Failed to get template product" };
		}

		// Create new product from template
		const newProduct = createDuplicateProduct(templateProduct);
		const shouldAppendDate = eventType !== "OVERNIGHT";
		const formattedDisplayDate = Utilities.formatDate(
			eventDateObj,
			SpreadsheetApp.getActive().getSpreadsheetTimeZone(),
			"dd/MM" // Format as 23/04 instead of 23/04/25
		);

		newProduct.name = shouldAppendDate 
			? `${eventName} ${formattedDisplayDate}`
			: eventName;
		newProduct.slug = slugify(newProduct.name);

		// Format date for WordPress and SKU
		const eventDateObj = new Date(eventDate);
		const formattedDate = Utilities.formatDate(
			eventDateObj,
			SpreadsheetApp.getActive().getSpreadsheetTimeZone(),
			"yyyy-MM-dd HH:mm:ss",
		);

		// Create SKU in format YYYY-MM-DD-type
		const skuDate = formatDateISO(eventDateObj);
		newProduct.sku = `${skuDate}-${eventType}`;

		// Update start date in metadata
		newProduct.meta_data = newProduct.meta_data.map((meta) => {
			if (meta.key === "event_start_date_time") {
				return { ...meta, value: formattedDate };
			}
			return meta;
		});

		// Add new metadata if it doesn't exist
		if (!newProduct.meta_data.some((m) => m.key === "event_start_date_time")) {
			newProduct.meta_data.push({
				key: "event_start_date_time",
				value: formattedDate,
			});
		}

		// Send to WordPress
		const newPostId = sendProductToWordPress(newProduct);

		if (!newPostId) {
			return {
				success: false,
				error: "Failed to create new event in WordPress",
			};
		}

		// Create calendar event AFTER successful WordPress creation
		try {
			const calendarEventId = createCalendarEventForProduct(
				eventName,
				eventDateObj.toISOString(),
				eventType,
				newPostId,
			);

			if (!calendarEventId) {
				console.warn("Calendar event creation failed - proceeding without");
			}
		} catch (calendarError) {
			console.warn("Calendar event creation failed:", calendarError);
		}

		// Create social media link
		const baseUrl = "https://socialmedia-image-creator.pages.dev/";
		const params = {
			Headline: "The Caving Crew",
			SubHeadline: eventName, // Use full event name directly
			Footer: formatSocialMediaFooter(eventDateObj, eventType),
			HeadlinePosition: 157,
			SubHeadlinePosition: 314,
			FooterPosition: 533.8,
			BackgroundImage: "/images/photos/IMG_4470.jpg",
		};

		const socialLink = `${baseUrl}?${Object.entries(params)
			.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
			.join("&")}`;

		// Store link in meta
		const linkData = {
			meta_data: [
				{
					key: "social_media_link",
					value: socialLink,
				},
			],
		};
		pokeToWordPressProducts(linkData, newPostId);

		return {
			success: true,
			id: newPostId,
			socialLink: socialLink, // Add this to response
		};
	} catch (error) {
		console.error("Error creating event:", error);
		return {
			success: false,
			error: error.message || "An unexpected error occurred",
		};
	}
}

/**
 * Formats a date in the ISO 8601 format (YYYY-MM-DD).
 *
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date.
 */
function formatDateISO(date) {
	return date.toISOString().split("T")[0];
}

/**
 * Formats a date in the format "MM/DD/YY".
 *
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date.
 */
function formatDate(date) {
	const day = `0${date.getDate()}`.slice(-2);
	const month = `0${date.getMonth() + 1}`.slice(-2);
	const year = date.getFullYear().toString().slice(-2);
	return `${month}/${day}/${year}`;
}

function getOrdinal(n) {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return s[(v - 20) % 10] || s[v] || s[0];
}

function testCreateNewEvent() {
	// Test data that matches what would come from the form
	const testData = {
		eventType: "OVERNIGHT", // One of the valid EVENT_TEMPLATES keys
		eventName: "Test Weekend Trip",
		eventDate: "2024-11-01T19:00", // Format from datetime-local input
	};

	console.log("Starting test with data:", testData);

	try {
		const result = createNewEvent(
			testData.eventType,
			testData.eventName,
			testData.eventDate,
		);

		console.log("Result:", result);
		return result;
	} catch (error) {
		console.error("Error in createNewEvent:", error);
		console.error("Error stack:", error.stack);
		throw error; // Re-throw to see in Apps Script logs
	}
}
