// Add calendar integration
const CALENDAR_ID = "19d2hfsmh7q1qancm6graaj6k0@group.calendar.google.com";

/**
 * Event type definitions with associated WordPress template IDs and UI text
 */
const EVENT_TEMPLATES = {
	OVERNIGHT: {
		id: 11583,
		label: "Overnight Trip",
		nameInstructions: "What's the name of this weekend trip?",
		namePlaceholder: "Month Location Caving Weekend",
		dateQuestion: "When does the trip start?",
	},
	TRAINING: {
		id: 123, // Replace with actual template ID
		label: "Training Event",
		nameInstructions: "What's the name of this training event?",
		namePlaceholder: "SRT Training Session",
		dateQuestion: "When is the training session?",
	},
	KNOWN_LOCATION: {
		id: 11595, // Replace with actual template ID
		label: "Known Location Tuesday/Saturday Trip",
		nameInstructions: "What's the name of this trip?",
		namePlaceholder: "Box Mine Tuesday Evening Trip",
		dateQuestion: "When is this trip?",
	},
	MYSTERY: {
		id: 11576, // Replace with actual template ID
		label: "Tuesday Evening Mystery Trip",
		nameInstructions: "What's the name of this mystery trip?",
		namePlaceholder: "Mystery Tuesday Evening Trip",
		dateQuestion: "When is this trip?",
	},
	GIGGLE: {
		id: 11579, // Replace with actual template ID
		label: "Bagshawe Beginner GiggleTrip",
		nameInstructions: "What's the name of this GiggleTrip?",
		namePlaceholder: "Bagshawe Beginners GiggleTrip XX/XX",
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
            // Add social media button
            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '20px';
            buttonContainer.innerHTML = 
              '<a href="' + result.socialLink + '" target="_blank" ' +
              'class="btn btn-success" ' +
              'style="width: 100%; background-color: #4CAF50;">' +
              'Create Social Media Image' +
              '</a>';
            document.querySelector('#eventForm').appendChild(buttonContainer);
            
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
		newProduct.name = eventName;
		newProduct.slug = slugify(eventName);

		// Format date for WordPress and SKU
		const eventDateObj = new Date(eventDate);
		const formattedDate = Utilities.formatDate(
			eventDateObj,
			"GMT",
			"yyyy-MM-dd HH:mm:ss",
		);

		// Create SKU in format YYYY-MM-DD-type
		const skuDate = formatDateISO(eventDateObj);
		newProduct.sku = `${skuDate}-${eventType}`;

		// Update start date in metadata
		newProduct.meta_data = newProduct.meta_data.map((meta) => {
			if (meta.key === "cc_start_date_time") {
				return { ...meta, value: formattedDate };
			}
			return meta;
		});

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
        SubHeadline: eventName.lastIndexOf('/') > -1 
          ? eventName.substring(0, eventName.lastIndexOf('/')).trim()
          : eventName, // Remove date after last slash
        Footer: formatSocialMediaFooter(eventDateObj, eventType),
        HeadlinePosition: 157,
        SubHeadlinePosition: 314,
        FooterPosition: 533.8,
        BackgroundImage: "/images/photos/IMG_4470.jpg"
      };
      
      const socialLink = `${baseUrl}?${Object.entries(params)
        .map(([k,v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&")}`;

      // Store link in meta
      const linkData = {
        meta_data: [{
          key: 'social_media_link',
          value: socialLink
        }]
      };
      pokeToWordPressProducts(linkData, newPostId);

      return { 
        success: true, 
        id: newPostId,
        socialLink: socialLink // Add this to response
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

/**
 * Formats a date in the format "DD/MM/YYYY HH:mm".
 *
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date.
 */
function formatDateWithLowercaseMeridian(date) {
	const formattedHours = date.getHours().toString().padStart(2, "0");
	const formattedMinutes = date.getMinutes().toString().padStart(2, "0");
	return `${Utilities.formatDate(date, "GMT", "dd/MM/yyyy ")}${formattedHours}:${formattedMinutes}`;
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
