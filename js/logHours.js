// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

$(function() {
  // Switch this to true when the app is ready!
  let isReadyForProd = false;

  // Dummy Data
  let dummyUserId = 2814;
  let dummyProjectId = 14460
  let dummyTimeEntryLength = 0.5;

  let defaultHeader = { "Content-Type": "application/json" };
  let defaultNote = 'Added by Eventry';

  let $btnLogHours = $('#log-hours');
  let $fromDateElement = $('#from-date');
  let $toDateElement = $('#to-date');

  $fromDateElement.attr('value', getCurrentDate());
  $toDateElement.attr('value', getCurrentDate());
  $btnLogHours.attr('disabled', true);

  // TEMP UNUSED. Do not delete yet.
  // let fromDateTime = new Date($fromDateElement.attr('value')).getTime();
  // let toDateTime = new Date($toDateElement.attr('value')).getTime();
  // let sevenDaysAgo = getFormattedDate(new Date(fromDateTime - (24 * 86400 * 1000)));
  // let sevenDaysFromNow = getFormattedDate(new Date(toDateTime + (24 * 86400 * 1000)));
  // console.log(sevenDaysAgo);
  // console.log(sevenDaysFromNow);
  // setDateValidation(sevenDaysAgo, sevenDaysFromNow);

  // TODO get guid from Cookie Yum Nom Yum
  let guidFromCookie = null
  loadUser(guidFromCookie);

  $btnLogHours.click(function() {
    getCurrentHoursForUser(dummyUserId, $fromDateElement.attr('value'), $toDateElement.attr('value'));

    let timeEntryDate = $fromDateElement.attr('value');
    updateProjectHoursForDay(dummyUserId, dummyProjectId, timeEntryDate, dummyTimeEntryLength)
  });

  $fromDateElement.change(function(e) {
    if (!e || !e.currentTarget) return;

    let newDate = e.currentTarget.value;
    $fromDateElement.attr('value', newDate); 
  });

  $toDateElement.change(function(e) {
    if (!e || !e.currentTarget) return;

    let newDate = e.currentTarget.value;
    $toDateElement.attr('value', newDate); 
  });

  function getCurrentDate() {
    var fullDate = new Date();
    var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
    var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
    var currentDate = fullDate.getFullYear() + "-" +  twoDigitMonth + "-" +  twoDigitDate;

    return currentDate;
  }

  function getFormattedDate(date) {
    return date.getMonth() + '/' + date.getDate() + '/' +  date.getFullYear();
  }

  // Set date validation to prevent accidental update of old entries.
  function setDateValidation(fromMin, toMax) {
    $fromDateElement.attr('min', fromMin);
    $toDateElement.attr('max', toMax);
  }

  function loadProjectAssignments(userId) {
    let endpoint = getProjectAssignmentEndpointForUser(userId);
    let apiUrl = getApiUrlForEndpoint(endpoint);

    $.ajax({
      url: apiUrl,
      type : "GET",
      headers: defaultHeader,
      success: function(response) {
        console.log(response);
        console.log('READY!');
      },
      error: function(error) {
        $btnLogHours.text('Error...');
        console.log(error);
      }
    });
  }

  function updateProjectHoursForDay(userId, projectId, date, length = 0.0) {
    let endpoint = getTimeEntryEndpointForUser(userId);
    let apiUrl = getApiUrlForEndpoint(endpoint);
    let additionalParameters = '&user_id=' + userId +
      '&assignable_id=' + projectId +
      '&date=' + date +
      '&hours=' + length +
      '&notes=' + defaultNote;
    let url = apiUrl + additionalParameters

    $.ajax({
      url: url,
      type : "POST",
      headers: defaultHeader,
      success: function(response) {
        showConfirmationMessage('Time Updated!', 'Logged!');
        console.log(response);
      },
      error: function(error) {
        showConfirmationMessage('Error!', 'Loading...');
        console.log(error);
      }
    });
  }

  function getCurrentHoursForUser(userId, fromDate, toDate) {
    let endpoint = getTimeEntryEndpointForUser(userId);
    let apiUrl = getApiUrlForEndpoint(endpoint);
    let additionalParameters = '&from=' + fromDate + '&to=' + toDate;
    let url = apiUrl + additionalParameters;

    $.ajax({
      url: url,
      type : "GET",
      headers: defaultHeader,
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  function loadUser(guid) {
    if (!guid) {
      getUserByGuidSorting(guid);

      return;
    };

    getAllUsersForGuidSort(guid);
  }

  function getAllUsersForGuidSort(guid) {
    let endpoint = getAllUsersEndpoint();
    let apiUrl = getApiUrlForEndpoint(endpoint);

    $.ajax({
      url: apiUrl,
      type : "GET",
      headers: defaultHeader,
      success: function(response) {
        // TODO Replace "response" with User object
        getUserByGuidSorting(guid, response);
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  // TODO get userId
  function getUserByGuidSorting(guid, users = []) {
    // Sort and find userId. Use dummy id if no matches found.

    let userId = false;
    if (!userId) {
      userId = dummyUserId;
      showConfirmationMessage('USER NOT FOUND. DEMO MODE ACTIVATED.', 'Loading...');
    }

    loadProjectAssignments(userId);
  }

  function getTimeEntryEndpointForUser(userId) {
    return '/api/v1/users/' + userId + '/time_entries';
  }

  function getProjectAssignmentEndpointForUser(userId) {
    return '/api/v1/users/' + userId + '/assignments';
  }

  function getAllUsersEndpoint() {
    return '/api/v1/users';
  }

  function getApiUrlForEndpoint(endpoint) {
    if (isReadyForProd) {
      var prodAuthToken = 'bk93NGlXOVVIbWZoaDFYdHJKTE01VTVTcGVGNWlxRmRsUC8wcXpKNlBXcUd3OFh3b3BveWJqRlJyZzVOClhzRWE4Vm8xYTBSTkxjVHlQS1lEbXpCaFp4eUFMOGkvZHQ2ekFHcGRNUFBkRVZla2xOK1plemVjc04ySApFMVYzaXkzbgo=';

      return 'https://api.10000ft.com' + endpoint + '?auth=' + prodAuthToken;
    }

    var stagingAuthToken = 'WEwrN0Z6ZHJuMTNYU2lBMnF5ajJ4aW1icTd6OS9aM2RQNGMvWDVrRU5pSVprTHNlYVZyVHRQT1NUb1M0CkVWYk9ocFIxQmg4UGRxWVNVZTFZbm0raUl5ekNnSlZ3eStlNEVtb09OSlNOQi9zdXNHMUxxK1FBYXVCdgpnZXJIZ0tTSAo=';

    return 'https://vnext-api.10000ft.com' + endpoint + '?auth=' + stagingAuthToken;
  }

  function getApiUrlForEndpointWithoutAuth(endpoint) {
    return 'https://vnext-api.10000ft.com' + endpoint;
  }

  function showConfirmationMessage(message, btnMessage = 'Loading...') {
    let delayLength = 3000;
    let hideLength = 1000;
    let showLength = 250;
    $('#confirmation').text(message).show(showLength).delay(delayLength).hide(hideLength);
    disableForm(delayLength, btnMessage);
  }

  function disableForm(delayLength, btnMessage) {
    $btnLogHours.attr('disabled', true);
    $btnLogHours.text(btnMessage);
    setTimeout(reenableForm, delayLength);
  }

  function reenableForm() {
    $btnLogHours.attr('disabled', false);
    $btnLogHours.text('Log Hours!');
  }

});
