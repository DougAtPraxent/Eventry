// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let logHours = document.getElementById('logHours');
let fromDateElement = document.getElementById('fromDate');
let toDateElement = document.getElementById('toDate');

$(function() {
  let fromDate = getCurrentDate();
  let toDate = getCurrentDate();
  fromDateElement.value = fromDate;
  toDateElement.value = toDate;
});

logHours.onclick = function(element) {
  getCurrentHours(fromDateElement.value, toDateElement.value);
};

function getCurrentDate() {
  var fullDate = new Date();
  var twoDigitMonth = fullDate.getMonth()+1+"";if(twoDigitMonth.length==1)  twoDigitMonth="0" +twoDigitMonth;
  var twoDigitDate = fullDate.getDate()+"";if(twoDigitDate.length==1) twoDigitDate="0" +twoDigitDate;
  var currentDate = fullDate.getFullYear() + "-" +  twoDigitMonth + "-" +  twoDigitDate;

  return currentDate;
}
function getCurrentHours(fromDate, toDate, isProd = false) {
  var additionalParameters = '&from=' + fromDate + '&to=' + toDate;

  var prodUserId = '2814';
  var prodEndpoint = '/api/v1/users/' + prodUserId + '/time_entries';
  var prodAuthToken = 'bk93NGlXOVVIbWZoaDFYdHJKTE01VTVTcGVGNWlxRmRsUC8wcXpKNlBXcUd3OFh3b3BveWJqRlJyZzVOClhzRWE4Vm8xYTBSTkxjVHlQS1lEbXpCaFp4eUFMOGkvZHQ2ekFHcGRNUFBkRVZla2xOK1plemVjc04ySApFMVYzaXkzbgo=';
  var prodUrl = 'https://api.10000ft.com' + prodEndpoint + '?auth=' + prodAuthToken + additionalParameters;

  var stagingUserId = '2814';
  var stagingEndpoint = '/api/v1/users/' + stagingUserId + '/time_entries';
  var stagingAuthToken = 'WEwrN0Z6ZHJuMTNYU2lBMnF5ajJ4aW1icTd6OS9aM2RQNGMvWDVrRU5pSVprTHNlYVZyVHRQT1NUb1M0CkVWYk9ocFIxQmg4UGRxWVNVZTFZbm0raUl5ekNnSlZ3eStlNEVtb09OSlNOQi9zdXNHMUxxK1FBYXVCdgpnZXJIZ0tTSAo=';
  var stagingUrl = 'https://vnext-api.10000ft.com' + stagingEndpoint + '?auth=' + stagingAuthToken + additionalParameters;

  var url = (isProd) ? prodUrl : stagingUrl;

  $.ajax({
    url: url,
    type : "GET",
    headers: { "Content-Type": "application/json" },
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log(error);
    }
  });
}
