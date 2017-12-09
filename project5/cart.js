function getEmptyOrderHTML () {
  return `<img  src="img/empty-cart.gif" alt="no pizzas ordered" id="no-pizza-image">`
}

function getSingleOrderHTML (orderObj) {
  return `
<div class="order-div row">
    <img src="${orderObj.pizzaData.image}" alt="${orderObj.pizzaData.name}" class="col xl3 l3 m4 s12 order-image">
    <div class="order-name col xl6 l6 m8 s12">${orderObj.pizzaData.name}</div>
    <form class="order-action col xl3 l3 m12 s12">
      <label for="order-number-${orderObj.pizzaData.id}">Order Number</label>
      <input type="number" id="order-number-${orderObj.pizzaData.id}" class="order-count-number" data-id="${orderObj.pizzaData.id}" value="${orderObj.orderCount}">
      <input type="button" class="waves-effect waves-light btn order-delete-button amber darken-2" data-id="${orderObj.pizzaData.id}" value="Delete">
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

function updateOrderListHtml () {
  // load all the orders
  $('#order-list').html(getOrderListHTML())

  // ============ register event for html ==================

  // the toast duration after user apply an order action
  // in ms
  const orderActionToastDuration = 800

  // when order update order count
  $('.order-action .order-count-number').change((event) => {
    const pizzaId = Number($(event.currentTarget).data('id'))
    const orderCount = Number($(event.currentTarget).val())
    setOrderCountInCookie(pizzaId, orderCount)
    updatePaymentHTML()
    Materialize.toast('your order has been updated', orderActionToastDuration)
  })

  // when order removed
  $('.order-action .order-delete-button').click((event) => {
    const pizzaId = Number($(event.currentTarget).data('id'))
    removeIdInCookie(pizzaId)
    updateOrderListHtml()
    updatePaymentHTML()
    Materialize.toast('your order has been removed', orderActionToastDuration)
  })
}

function _getPaymentSubTotal () {
  const orderObjList = getOrderObjectLists()

  if (orderObjList.length === 0)
    return 0
  else
    return orderObjList
      .map((pizzaType) => pizzaType.pizzaData.price * pizzaType.orderCount)
      .reduce((x, y) => x + y)
}

function updatePaymentHTML () {
  const taxRate = 0.07
  const paymentSubTotal = _getPaymentSubTotal()
  const tax = paymentSubTotal * taxRate
  const totalPayment = tax + paymentSubTotal
  $('#payment-subtotal-value').text(`$ ${paymentSubTotal.toFixed(2)}`)
  $('#payment-tax-value').text(`$ ${tax.toFixed(2)}`)
  $('#payment-total-value').text(`$ ${totalPayment.toFixed(2)}`)

}

function updateAddressModal () {
  const addressObj = getAddressFromCookies()
  if (addressObj === null) {
    $('#address-modal-header').text('Input Your Address')
  }
  else {
    $('#address-modal-header').text('Confirm Your Address')
    $('#full-name').val(addressObj.fullName)
    $('#street-address').val(addressObj.streetAddress)
    $('#city').val(addressObj.streetAddress)
    $('#state').val(addressObj.state)
    $('#zip-code').val(addressObj.zipCode)
    $('#phone').val(addressObj.phone)
  }
}

function saveAddress () {
  setAddressInCookies({
    fullName: $('#full-name').val(),
    streetAddress: $('#street-address').val(),
    city: $('#city').val(),
    state: $('#state').val(),
    zipCode: $('#zip-code').val(),
    phone: $('#phone').val()
  })
}

$(() => {
  // set the user as existing user
  setExistingUser()

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

  // set the payment html
  updatePaymentHTML()

  // ================== order section ===================
  // load the order list
  updateOrderListHtml()

  // ================= place order section ================
  // load the content of address modal from cookie
  updateAddressModal()

  // init the modal
  $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
    }
  )
  // open the modal
  $('#place-order-button').click(() => {
    $('#address-modal').modal('open')
    updateAddressModal()
  })

  // when an order is placed
  $('#address-okay-button').click(() => {
    Materialize.toast('Your order have been placed. ' +
      'We will deliver it when we want to, because we are just that chill.', 4000)
    saveAddress()
  })
})
