function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Mark an Attendance')
      .addItem('Mark Cancelled', 'markCancelled')
      .addItem('Mark Late Bail', 'markLateBail')
      .addItem('Mark No Show', 'markNoShow')
      .addSeparator()
      .addItem('Mark Duplicate', 'markDuplicate')
      .addSeparator()
      .addItem('Mark Attended', 'markAttended')
      .addSeparator()
     .addItem('Mark ALL Attended', 'markAttendedAndCloseEvent')
     // .addItem('NOT WORKING - Did not Register but showed', 'markNoRegisterShow')

      .addToUi();
/*
   // create menu for dispatch  functions
  ui.createMenu('Assign a Role')
      .addSeparator()
      .addItem('Lift Sharing Coordinator', 'assignLiftSharingCoordinator')
      .addItem('Climbing & Activities Coordinator', 'assignActivitesCoordinator')
            .addSeparator()
      .addItem('Gear and Kit Coordinator', 'assignKitCoordinator')
      .addItem('Buddy Coordinator', 'assignBuddyCoordinator')
      .addSeparator()
      .addItem('Trip Reporter', 'assignTripReporter')
      .addSeparator()
      .addItem('Evening Meal Chef', 'assignEveningMealChef')
      .addItem('Lunch and Breakfast Chef', 'assignLunchAndBreakfastChef')
      .addSeparator()
      .addItem('Trip Director', 'assignTripDirector')
      .addItem('Assistant Trip Director', 'assignAssistantTripDirector')
            .addSeparator()
      .addItem('Breakfast Marshal', 'assignBreakfastMarshal')
      .addItem('Lunch Marshal', 'assignLunchMarshal')
      .addItem('Evening Meal Washing Up Marshal', 'assignEveningMealWashingUpMarshal')
                  .addSeparator()
                  .addItem('Head Chef', 'assignHeadChef')
            .addItem('Covid Marshal', 'assignCovidMarshal')


      .addSeparator()

//      .addSeparator()
//      .addItem('SundayPromo1', 'assignSundayPromo1')
//      .addItem('SundayPromo2', 'assignSundayPromo2')
//      .addItem('SundayPromo2', 'assignSundayPromo2')
      .addSeparator()


      .addItem('Unassign Role', 'markVolunteerClear')

      .addToUi();   
      */
  ui.createMenu('Refresh Matrix')
      .addItem('Refresh All', 'readData')
      .addSeparator()
      .addItem('Refresh Output', 'runOutputTab')
      .addItem('Refresh Volunteering', 'volunteerData')
      .addSeparator()
      .addItem('Refresh Roles', 'runRolesTab')
      .addItem('Refresh Volunteering-old', 'runVolunteeringTab')
           .addSeparator()
      .addItem('Refresh Event Listings Dashboard', 'eventListing')
      .addItem('Refresh Badges', 'badgesData')


      .addToUi();   
/*
        ui.createMenu('Badges')
      .addItem('Mark Given Badge', 'markGivenBadge')
      


      .addToUi();  

        ui.createMenu('Give Volunteer Competencies')
      .addItem('Lift Sharing Coordinator - SignOff', 'giveLiftCoordinator')
      .addItem('Activities Coordinator - SignOff', 'competency_activities_coordinator')
      .addSeparator()
      .addItem('Trip Director - Eager To Learn', 'giveTripDirectorToLearn')
      .addItem('Trip Director - In Training', 'giveTripDirectorTraining')
      .addItem('Trip Director - SignOff', 'giveTripDirector')
            .addSeparator()
      .addItem('Evening Meal Chef - Eager To Learn', 'giveEveningMealChefToLearn')
      .addItem('Evening Meal Chef - In Training', 'giveEveningMealChefTraining')
      .addItem('Evening Meal Chef - SignOff', 'giveEveningMealChef')
                  .addSeparator()
      .addItem('Breakfast & Lunch Chef - Eager To Learn', 'giveBreakfastLunchChefToLearn')
      .addItem('Breakfast & Lunch Chef - In Training', 'giveBreakfastLunchChefTraining')
      .addItem('Breakfast & Lunch Chef - SignOff', 'giveBreakfastLunchChef')


      .addToUi();  

*/
}
