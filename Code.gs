/**
 * Teacher Dashboard — Google Apps Script backend.
 *
 * Deploy this as a Web App (see README.md) bound to a Google Sheet.
 * It handles two actions posted from script.js:
 *   - action "saveData"          -> appends one row per student to the "DailyData" sheet
 *   - action "addCalendarEvent"  -> creates an event on your default Google Calendar
 *
 * CORS note: Apps Script Web Apps cannot answer a CORS "preflight" (OPTIONS)
 * request, so the browser must avoid triggering one. script.js does this by
 * POSTing with Content-Type "text/plain" instead of "application/json" — that
 * keeps it a CORS-"simple" request, and Apps Script's response is then
 * readable by the browser without needing (or supporting) custom CORS headers.
 * Do not change the client to send application/json, and there is no need to
 * add response headers here — neither is necessary with this approach.
 */

var SHEET_NAME = 'DailyData';
var SHEET_HEADERS = ['Name', 'Behavior', 'Marks/Understanding', 'Activity', 'Points', 'Timestamp'];

function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Teacher Dashboard backend is running.' });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'saveData') return jsonResponse(saveData(data));
    if (action === 'addCalendarEvent') return jsonResponse(addCalendarEvent(data));
    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

/** Appends one row per student to the DailyData sheet. */
function saveData(data) {
  var sheet = getOrCreateDataSheet();
  var timestamp = data.timestamp || new Date().toISOString();
  var students = data.students || [];

  students.forEach(function (s) {
    sheet.appendRow([s.name, s.behavior, s.marks, s.activity, s.points, timestamp]);
  });

  return { status: 'success', message: 'Saved ' + students.length + ' student record(s).' };
}

function getOrCreateDataSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(SHEET_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Creates a reminder on the default calendar of the account running this script. */
function addCalendarEvent(data) {
  var title = (data.title || '').trim();
  var dateStr = data.date;
  var timeStr = data.time;

  if (!title || !dateStr) {
    return { status: 'error', message: 'A title and date are required.' };
  }

  var calendar = CalendarApp.getDefaultCalendar();
  var event;

  if (timeStr) {
    var start = new Date(dateStr + 'T' + timeStr + ':00');
    var end = new Date(start.getTime() + 30 * 60 * 1000); // default 30-minute reminder
    event = calendar.createEvent(title, start, end);
  } else {
    var day = new Date(dateStr + 'T00:00:00');
    event = calendar.createAllDayEvent(title, day);
  }

  return { status: 'success', message: 'Event created: ' + title, eventId: event.getId() };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
