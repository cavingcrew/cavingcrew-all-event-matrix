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
