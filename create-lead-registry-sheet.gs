/**
 * Run this script directly in Google Apps Script (script.google.com)
 * OR paste it in the Google Sheets script editor (Extensions → Apps Script)
 * 
 * It creates the worksheet "سجل العملاء المحتملين" with CRM headers
 * then formats the header row as bold.
 */
function createLeadRegistrySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'سجل العملاء المحتملين';
  
  // Check if sheet already exists
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    Logger.log('Created new sheet: ' + sheetName);
  } else {
    Logger.log('Sheet already exists: ' + sheetName);
  }
  
  // Set header row
  const headers = [
    'event_name',
    'lead_id', 
    'email',
    'source',
    'created_at',
    'funnel_stage',
    'lead_score'
  ];
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Bold + background color for headers
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a1a2e');
  headerRange.setFontColor('#ffffff');
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  Logger.log('Done. Headers set: ' + headers.join(', '));
  return 'SUCCESS: Sheet "' + sheetName + '" ready with ' + headers.length + ' columns';
}
