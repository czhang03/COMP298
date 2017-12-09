function getEmptyOrderHTML () {
  return `<img  src="img/csSlide.png">`
}

function getSingleOrderHTML (orderObj) {
  return `
<div class="order-div">
    <img src="${orderObj.pizzaData.image}" alt="${orderObj.pizzaData.name}" class="order-image">
    <div class="order-name">${orderObj.pizzaData.name}</div>
    <form class="order-action">
      <label for="order-number-${orderObj.pizzaData.id}">Order Number</label>
      <input type="number" id="order-number-${orderObj.pizzaData.id}" class="order-count-number" data-id="${orderObj.pizzaData.id}" value="${orderObj.orderCount}">
      <input type="button" class="waves-effect waves-light btn order-delete-button" data-id="${orderObj.pizzaData.id}" value="Delete">
     </form>
</div>
  `
}

function getOrderListHTML () {
  const orderList = getOrderObjectLists()
  if (orderList.length === 0)
    return getEmptyOrderHTML()
  else
    return orderList.map(getSingleOrderHTML)
}

/**
 * update the subsection of delivery time
 */
function updateSubTime () {
  if ($('#time-later').prop('checked')) {
    $('.sub-time').hide()
    $('#sub-time-later').show()
  }
  else if ($('#time-now').prop('checked')) {
    $('.sub-time').hide()
    $('#sub-time-now').show()
  }
}

function updateOrderListHtml() {
  // load all the orders
  $('#order-list').html(getOrderListHTML())

  // ============ register event for html ==================

  // the toast duration after user apply an order action
  // in ms
  const orderActionToastDuration = 800

  // when order update order count
  $(".order-action .order-count-number").change((event) => {
    const pizzaId = Number($(event.currentTarget).data("id"))
    const orderCount = Number($(event.currentTarget).val())
    setOrderCountInCookie(pizzaId, orderCount)
    Materialize.toast("your order has been updated", orderActionToastDuration)
  })

  // when order removed
  $(".order-action .order-delete-button").click((event) => {
    const pizzaId = Number($(event.currentTarget).data("id"))
    removeIdInCookie(pizzaId)
    updateOrderListHtml()
    Materialize.toast("your order has been removed", orderActionToastDuration)
  })
}


$(() => {

  // ===================== info section =====================
  // update the sub-time element
  updateSubTime()
  $('.delivery-time-radio').change(updateSubTime)

  // init date time picker
  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
  })
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  })

  // ================== order section ===================
  // load the order list
  updateOrderListHtml()

  // ================= place order section ================
  $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
    }
  );

  $("#place-order-button").click(() => {
    $("#address-modal").modal("open")
  })
})
