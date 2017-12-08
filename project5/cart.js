function getEmptyOrderHTML() {
  return `<img  src="img/csSlide.png">`
}

function getSingleOrderHTML(orderObj) {
  return `
<div class="order-div">
    <img src="${orderObj.pizzaData.image}" alt="${orderObj.pizzaData.name}" class="order-image">
    <div class="order-name">${orderObj.pizzaData.name}</div>
    <form><input type="number" class="order-count-number" value="${orderObj.orderCount}"></form>
    <button class="order-delete-button">Delete</button>
</div>
  `
}

function getOrderListHTML() {
  const orderList = getOrderObjectLists()
  if (orderList.length === 0)
    return getEmptyOrderHTML()
  else
    return orderList.map(getSingleOrderHTML)
}


/**
 * update the subsection of delivery time
 */
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

  // update the sub-time element
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

  // load all the orders
  $("#order-list").html(getOrderListHTML())
})
