# Caving Crew Management System

This project is a Google Apps Script-based management system for the Caving Crew. It provides various functionalities to manage events, participants, and generate reports.

## Project Structure

The project consists of several JavaScript files, each responsible for different aspects of the system:

- `Admin.js`: Handles administrative data retrieval and display.
- `Buddy.js`: Manages buddy system information.
- `CommonFunctions.js`: Contains shared utility functions and configurations.
- `Diet.js`: Handles dietary information for participants.
- `Event List.js`: Manages the list of events.
- `Everyone Functions.js`: Contains functions that apply to all participants.
- `Gear.js`: Manages gear-related information.
- `MarkAttendance.js`: Handles attendance marking functionality.
- `Menu.js`: Creates the custom menu in the Google Sheets UI.
- `pokeToWordPress.js`: Manages communication with WordPress.
- `Transport.js`: Handles transportation-related information.
- `Volunteering.js`: Manages volunteering-related data.
- `Weekends.js`: Contains functions for weekend events.

## Key Functionalities

### Event Listing
The `eventListing()` function in `Event List.js` retrieves a list of all 'Pending' trips from the Caving Crew website server and populates it into the Event Listing spreadsheet. It includes columns for Trip Name, ID, and Date.

### Mark Attendance
The `MarkAttendance.js` file contains functions to mark different attendance statuses:
- `markAttended()`: Marks a participant as attended.
- `markCancelled()`: Marks a participant as cancelled.
- `markNoShow()`: Marks a participant as a no-show.
- `markDuplicate()`: Marks a participant's entry as a duplicate.
- `markLateBail()`: Marks a participant as a late bail.

These functions update both the Google Sheet and the WordPress database via API calls.

### Reports
Various reports are generated using SQL queries to retrieve specific information:

1. Admin Report (`Admin.js`):
   - Columns: First Name, Last Name, Facebook Name, Phone Number, Participation Statements, Car Registration, Emergency Contact Details, Order ID

2. Buddy Report (`Buddy.js`):
   - Columns: First Name, Facebook Name, First Timer status, Order Count, Order ID

3. Diet Report (`Diet.js`):
   - Columns: First Name, Facebook Name, Dietary Requirements, Diet and Health Details, Order ID

4. Gear Report (`Gear.js`):
   - Columns: First Name, Facebook Name, various skill levels and preferences, kit information

5. Transport Report (`Transport.js`):
   - Columns: First Name, Facebook Name, Lift Needs/Offers, Departure Location and Time, Order ID

6. Volunteering Report (`Volunteering.js`):
   - Columns: First Name, Facebook Name, Selected Roles, various volunteering positions, experience metrics

### Common Functions
The `CommonFunctions.js` file contains shared utility functions, database connection details, and color definitions used throughout the project. It includes functions for setting up sheets, formatting cells, and handling conditional formatting.

## Deployment and Usage

This project uses `clasp` (Command Line Apps Script Projects) for deployment and management. The `package.json` file includes several scripts for common operations:

- `npm run push`: Deploys the local files to Google Apps Script. This is how you update the live script.
- `npm run pull`: Fetches the latest version from Google Apps Script to your local environment.
- `npm run watch`: Watches for local changes and automatically pushes them to Google Apps Script.
- `npm run version`: Creates a new version of the Google Apps Script project.
- `npm run logs`: Shows the most recent logs from the Google Apps Script project.

To use these commands, make sure you have Node.js and npm installed, then run `npm install` in the project directory to install the necessary dependencies.

## WordPress Integration

The system integrates with WordPress using the WooCommerce REST API. The `pokeToWordPress.js` file contains functions to communicate with the WordPress site, updating order statuses and user metadata. This integration allows for seamless data flow between the Google Sheet interface and the WordPress-based website.

## Custom Menu

The `Menu.js` file creates a custom menu in the Google Sheets UI, providing easy access to various functions like marking attendance and refreshing data. This enhances the user experience by making key functions readily available within the spreadsheet interface.

## Contribution and Maintenance

When contributing to or maintaining this project, please ensure to update the relevant JavaScript files and test thoroughly before deploying. The `clasp` commands make it easy to manage versions and deployments, but care should be taken to avoid disrupting the live system.

## Credential Management

The `CredentialStoreManager.js` file is responsible for securely managing and refreshing credentials used throughout the application. Here's a detailed explanation of its functionality:

### refreshCredentials()

This function fetches credentials from a specific Google Sheets document and stores them in the script's properties. Here's how it works:

1. It opens a specific Google Sheet (ID: '1MVTO45ZusIw2BRgtRh4BffPRbbuIZHViZKPZE3OntEc') and accesses the 'Credentials' sheet.
2. It reads all the data from this sheet, expecting two columns: 'label' and 'value'.
3. For each row in the sheet, it stores the 'value' in the script's properties, using 'cred_[label]' as the key.

This approach allows for centralized credential management, making it easy to update credentials without changing the code.

### createNightlyTrigger()

This function sets up an automatic nightly refresh of the credentials:

1. It first removes any existing triggers for the `refreshCredentials` function.
2. It then creates a new trigger that runs `refreshCredentials` every day at 1:00 AM.

This ensures that the credentials are always up-to-date, even if they're changed in the source spreadsheet.

### setupCredentialRefresh()

This function is meant to be run once to initialize the credential management system:

1. It calls `refreshCredentials()` to immediately fetch and store the credentials.
2. It then calls `createNightlyTrigger()` to set up the automatic nightly refresh.

To use this system, a developer would run `setupCredentialRefresh()` once, and then the credentials will be automatically managed from that point forward.

## Event Space Management

The `eventSpaceManager.js` file handles the opening and closing of event spaces (i.e., available slots for an event). It's designed to work with both simple and variable products in WooCommerce. Here's a breakdown of its main functions:

### openEventSpaces()

This is the main function for opening event spaces:

1. It fetches the product ID from a specific cell in the 'Dashboard' sheet.
2. It then retrieves the product details from WooCommerce.
3. Depending on whether the product is simple or variable, it calls either `openSimpleProductSpaces()` or `openVariableProductSpaces()`.

### openVariableProductSpaces(product)

This function handles opening spaces for variable products (e.g., events with different ticket types):

1. It fetches all variations of the product from WooCommerce.
2. It creates an HTML form with input fields for each variation, allowing the user to set the number of spaces for each.
3. When the form is submitted, it calls `updateProductVariations()` to update the stock quantity for each variation in WooCommerce.

### openSimpleProductSpaces(product)

This function handles opening spaces for simple products:

1. It prompts the user to enter the number of spaces to open.
2. If a valid number is entered, it calls `updateProductStock()` to update the stock quantity in WooCommerce.

### closeSignup()

This function closes the signup for an event:

1. It fetches the product ID from the 'Dashboard' sheet.
2. Depending on whether the product is simple or variable, it calls either `closeSimpleProductSpaces()` or `closeVariableProductSpaces()`.
3. Both of these functions set the stock quantity to 0 for all variations or for the simple product.

### updateProductVariations(productId, updatedVariations) and updateProductStock(productId, newStock)

These functions make API calls to WooCommerce to update the stock quantities for variable and simple products respectively.

To use this system, a user would typically:

1. Select the event in the 'Dashboard' sheet.
2. Use the custom menu to run either 'Open Signup' (which calls `openEventSpaces()`) or 'Close Signup' (which calls `closeSignup()`).

This system provides a user-friendly interface for managing event capacities directly from Google Sheets, with the changes being reflected immediately in the WooCommerce store.
