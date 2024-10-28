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
		label: "Beginner Giggle Trip Mystery Trip",
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

    document.getElementById('eventForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedType = document.querySelector('input[name="eventType"]:checked').value;
      const eventName = document.getElementById('eventName').value;
      const eventDate = document.getElementById('eventDate').value;

      google.script.run
        .withSuccessHandler((newPostId) => {
          if (newPostId) {
            window.open('https://www.cavingcrew.com/wp-admin/post.php?post=' + newPostId + '&action=edit');
            google.script.host.close();
          }
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
            <button type="submit" class="btn btn-primary w-100">Create Event and Continue Editing</button>
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
 * @returns {number|null} - ID of the newly created post, or null if creation failed
 */
function createNewEvent(eventType, eventName, eventDate) {
	const template = EVENT_TEMPLATES[eventType];
	if (!template) return null;

	// Get the template product
	const templateProduct = getProductById(template.id);
	if (!templateProduct) return null;

	// Create new product from template
	const newProduct = createDuplicateProduct(templateProduct);

	// Update basic product info
	newProduct.name = eventName;
	newProduct.slug = slugify(eventName);

	// Format date for WordPress
	// Using ISO 8601 format: YYYY-MM-DD HH:mm:ss
	const formattedDate = Utilities.formatDate(
		new Date(eventDate),
		"GMT",
		"yyyy-MM-dd HH:mm:ss",
	);

	// Update meta data
	for (const meta of newProduct.meta_data) {
		if (meta.key === "cc_start_date") {
			meta.value = formattedDate;
		}
	}

	// Send to WordPress
	return sendProductToWordPress(newProduct);
}
