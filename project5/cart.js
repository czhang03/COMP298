function updateSubTime() {
  if ($("#time-later").prop("checked")) {
    $(".sub-time").hide()
    $("#sub-time-later").show()
  }
  else if ($("#time-now").prop("checked")) {
    $(".sub-time").hide()
    $("#sub-time-now").show()
  }
}

$(() => {
  updateSubTime()
  $(".delivery-time-radio").change(updateSubTime)

  // init date time picker
  $(".timepicker").pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
  });
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });
})
