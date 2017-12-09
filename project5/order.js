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
    $('#cart-badge').html(`<span class="new badge amber darken-3" id="cart-badge" data-badge-caption="">${totalNumItem}</span>`)
  else
    $('#cart-badge').html()
}

function toastWhenAdd(id) {
  Materialize.toast(`added one ${PizzaData[id].name} to cart`, 4000)
}

$(() => {
  setExistingUser()

  updateTotalNumItem()

  $('.order-button').click((event) => {
    const id = Number($(event.currentTarget).data('id'))
    addOrderInCookie(id)
    updateTotalNumItem()
    toastWhenAdd(id)
  })
})
