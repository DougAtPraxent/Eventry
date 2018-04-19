'use strict';

// Google Client ID and API key from the Developer Console
var CLIENT_ID = '984026966977-5bgo5545bhtrktnqlc4f8pg9g21f6m1h.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDo30LSgpGD6aySTVekJawO6hiTpK0RFco';

// Array of API discovery doc URLs for APIs used by this project
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the APIs; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//    authorizeButton.onclick = handleAuthClick;
//    signoutButton.onclick = handleSignoutClick;
});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
if (isSignedIn) {
//    authorizeButton.style.display = 'none';
//    signoutButton.style.display = 'block';
    listCalendarEvents();
} else {
//    authorizeButton.style.display = 'block';
//    signoutButton.style.display = 'none';
}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listMyCalendarEvents(fromDate, toDate) {
gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date("2018-04-19T00:00:00-05:00")).toISOString(),
    'timeMax': (new Date("2018-04-19T23:59:59-05:00")).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
//          'maxResults': 10,
    'orderBy': 'startTime'
}).then(function(response) {
    var events = response.result.items;

    var calendarEvents = {
        mine: []
    };
    
    if (events.length > 0) {
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.start.dateTime) {
            calendarEvents.mine.push({ 
                "summary"   : event.summary,
                "organizer" : event.organizer.email,
                "date"      : new Date(event.start.dateTime).getMonth() + '/' + new Date(event.start.dateTime).getDate() + '/' + new Date(event.start.dateTime).getFullYear(),
                "time"      : new Date(event.start.dateTime).getHours() + ':' + new Date(event.start.dateTime).getMinutes().toString().padEnd(2, '0'),
                "duration"  : (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime())/(1000*60*60)
            });
            }
    }
    }

});
}

///TODO:
/*
<script async defer src="https://apis.google.com/js/api.js"
    onload="this.onload=function(){};handleClientLoad()"
    onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script>
*/