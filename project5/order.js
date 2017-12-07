function _getSubTotal () {
  const orderObjList = getOrderObjectLists()

  return orderObjList
    .map((pizzaType) => pizzaType.pizzaData.price * pizzaType.orderCount)
    .reduce((x, y) => x + y)
}

function getTotalNumItem () {
  const orderObjList = getOrderObjectLists()

  if (orderObjList.length === 0)
    return 0
  else
    return orderObjList
      .map((pizzaType) => pizzaType.orderCount)
      .reduce((x, y) => x + y)
}

function updateTotalNumItem () {
  const totalNumItem = getTotalNumItem()
  if (totalNumItem !== 0)
    $('#cart-badge').html(`<span class="new badge red" id="cart-badge" data-badge-caption="">${totalNumItem}</span>`)
  else
    $('#cart-badge').html()
}

$(() => {
  setExistingUser()

  updateTotalNumItem()

  $('.order-button').click((event) => {
    const id = Number($(event.currentTarget).data('id'))
    addOrderInCookie(id)
    updateTotalNumItem()
  })
})
