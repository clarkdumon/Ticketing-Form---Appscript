const DRIVEID = "#### " //Google Drive ID
const SHEETID = "####" //Google Sheet ID
const SHEETNAME = "TicketManagement"

function doGet(e) {
  return HtmlService.createTemplateFromFile("index").evaluate();
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getUserName() {
  const user = Session.getActiveUser().getEmail()
  let finaluser = user.substring(0, user.search(/@/))


  return finaluser
}

function getformData(formdata) {
  console.log(formdata)
}




function uploadFile(formVar) {
  const driveFolder = DriveApp.getFolderById(DRIVEID);
  const fileUpload = Utilities.newBlob(Utilities.base64Decode(formVar.data), formVar.mimeType, formVar.fileName);
  const fileInDrive = driveFolder.createFile(fileUpload);

  formVar['AttachmentID'] = fileInDrive.getUrl()
  delete formVar.data, delete formVar.mimeType, delete formVar.fileName;


  addToSheets(formVar)

}

function addToSheets(formVar) {
  const Lock = LockService.getScriptLock()

  Lock.tryLock(5000)
  if (Lock.hasLock()) {
      const sheet = SpreadsheetApp.openById(SHEETID).getSheetByName(SHEETNAME)
      formVar['Timestamp'] = new Date()
      formVar['Requestor'] = Session.getActiveUser().getEmail()
      formVar['TicketID'] = createServiceID()
      formVar['Status'] = 'Open'
      console.log(formVar)
      sheet.appendRow([formVar.AttachmentID, formVar.Timestamp, formVar.Requestor, formVar.TicketID, formVar.subject, formVar.description, formVar.Status])
    Lock.releaseLock()
  }
}

function createServiceID() {
  const serviceID = Date.now().toString()
  return serviceID.slice(0, 6) + "-" + serviceID.substring(6)

}