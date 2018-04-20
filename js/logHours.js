// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

$(function() {
  // Switch this to true when the app is ready!
  let isReadyForProd = false;

  let defaultHeader = { "Content-Type": "application/json" };
  let $btnLogHours = $('#logHours');
  let $fromDateElement = $('#fromDate');
  let $toDateElement = $('#toDate');
  $fromDateElement.attr('value', getCurrentDate());
  $toDateElement.attr('value', getCurrentDate());
  $btnLogHours.attr('disabled', true);

  let userId = 2814;
  loadProjectAssignments(userId);

  $btnLogHours.onclick = function(element) {
    getCurrentHours(fromDateElement.value, toDateElement.value);
  };

  function getCurrentDate() {
    var fullDate = new Date();
    var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
    var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
    var currentDate = fullDate.getFullYear() + "-" +  twoDigitMonth + "-" +  twoDigitDate;

    return currentDate;
  }

  function loadProjectAssignments(userId) {
    let endpoint = getProjectAssignmentEndpointForUser(userId);
    let apiUrl = getApiUrlForEndpoint(endpoint);

    $.ajax({
      url: apiUrl,
      type : "GET",
      headers: defaultHeader,
      success: function(response) {
        $btnLogHours.text('Log Hours');
        $btnLogHours.attr('disabled', false);
        console.log(response);
        console.log('READY!');
      },
      error: function(error) {
        $btnLogHours.text('Error...');
        console.log(error);
      }
    });
  }

  function updateProjectHoursForDay(userId, project, day) {
    let endpoint = getTimeEntryEndpointForUser(userId);
    let apiUrl = getApiUrlForEndpoint(endpoint);

    data = {
      "user_id": user_id,
      "assignable_id": 1001,
      "date": "2012-01-21",
      "hours": 0.5,
      "task": 'Travel',
      "notes": 'Drive to Seattle, WA to meet with 10Kft'
    }

    $.ajax({
      url: apiUrl,
      type : "POST",
      headers: defaultHeader,
      success: function(response) {
        showConfirmationMessage('Time Updated!');
        console.log(response);
        console.log('READY!');
      },
      error: function(error) {
        showConfirmationMessage('Error!');
        console.log(error);
      }
    });

//     POST /api/v1/users/<user_id>/time_entries

// {
//   "user_id": <user_id>,
//   "assignable_id": 1001,
//   "date": "2012-01-21",
//   "hours": 0.5,
//   "task": 'Travel',
//   "notes": 'Drive to Seattle, WA to meet with 10Kft'
// }
  }

  function getCurrentHours(fromDate, toDate) {
    var additionalParameters = '&from=' + fromDate + '&to=' + toDate;

    var url = (isReadyForProd) ? prodUrl : stagingUrl;

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

  function getTimeEntryEndpointForUser(userId) {
    return '/api/v1/users/' + userId + '/time_entries';
  }

  function getProjectAssignmentEndpointForUser(userId) {
    return '/api/v1/users/' + userId + '/assignments';
  }

  function getApiUrlForEndpoint(endpoint) {
    if (isReadyForProd) {
      var prodAuthToken = 'bk93NGlXOVVIbWZoaDFYdHJKTE01VTVTcGVGNWlxRmRsUC8wcXpKNlBXcUd3OFh3b3BveWJqRlJyZzVOClhzRWE4Vm8xYTBSTkxjVHlQS1lEbXpCaFp4eUFMOGkvZHQ2ekFHcGRNUFBkRVZla2xOK1plemVjc04ySApFMVYzaXkzbgo=';

      return 'https://api.10000ft.com' + endpoint + '?auth=' + prodAuthToken;
    }

    var stagingAuthToken = 'WEwrN0Z6ZHJuMTNYU2lBMnF5ajJ4aW1icTd6OS9aM2RQNGMvWDVrRU5pSVprTHNlYVZyVHRQT1NUb1M0CkVWYk9ocFIxQmg4UGRxWVNVZTFZbm0raUl5ekNnSlZ3eStlNEVtb09OSlNOQi9zdXNHMUxxK1FBYXVCdgpnZXJIZ0tTSAo=';

    return 'https://vnext-api.10000ft.com' + endpoint + '?auth=' + stagingAuthToken;
  }

  function showConfirmationMessage(message) {
    $('#confirmation').text(message);
  }

});
