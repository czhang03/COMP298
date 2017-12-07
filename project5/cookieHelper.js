// ========================= side-effect free order data computation =======================
/**
 * Helper function to get the order count with default 0
 * @param {Map.<number, number>} orderData - the order data to get the order count from
 * @param {number} id - get the order count of this id
 * @return {number} - if the id is defined in order data, return the order count, else fall back to 0
 * @private
 */
function _getOrderCountWithDefault (orderData, id) {
  const orderCount = orderData.get(id)

  if (orderCount === undefined)
    return 0
  else
    return orderCount
}

/**
 * set a the order count for a particular id
 * @param {Map.<number, number>} orderData - the original order data before update
 * @param {number} id - the id of the pizza to update
 * @param {number} orderCount - update the old order count of the id to this number
 * @returns {Map.<number, number>} the updated order data
 */
function _setOrderCount (orderData, id, orderCount) {
  // deep copy the old data to avoid side effect
  const tempData = new Map(orderData)

  // set the data
  return tempData.set(id, orderCount)
}

/**
 * add an order to the specified id, return the new order data
 * @param {Map.<number, number>} orderData - a map maps id to order count
 * @param {number} id - the id of the pizza that is ordered
 * @return {Map.<number, number>} the updated order data
 */
function _addOrder (orderData, id) {
  // get the count
  const oldOrderCount = _getOrderCountWithDefault(orderData, id)

  // deep copy the old order data to avoid side effect
  const tempOrderData = new Map(orderData)

  // add the count
  return tempOrderData.set(id, oldOrderCount + 1)
}

/**
 * remove all the order for give id
 * @param {Map.<number, number>} orderData - the old order data
 * @param {number} id - remove the older count for this order
 * @return {Map.<number, number>} the new order data with id removed
 */
function _removeId (orderData, id) {

  // deep copy the old order data to avoid side effect
  const tempOrderData = new Map(orderData)

  // add the count
  tempOrderData.delete(id)

  return tempOrderData
}

/**
 * clear the order data by removing all the id that maps to 0
 * @param {Map.<number, number>} orderData: the old order data to send in
 * @return {Map.<number, number>} the cleared order data with all the 0 removed
 */
function _clearOrderData (orderData) {
  // convert order data to array for filtering
  const orderDataArray = Array.from(orderData)

  // clean the order data array, by filter out all the order with count 0
  const clearedOrderDataArray = orderDataArray.filter(([id, orderCount]) => orderCount !== 0)

  return new Map(clearedOrderDataArray)
}

function _getSubTotal(orderData) {
  return Array.from(orderData)
    .map(([pizzaID, orderCount]) => PizzaData[pizzaID].price * orderCount)
    .reduce((x, y) => x + y)
}

/**
 *
 * @param orderData
 * @return {Array}
 * @private
 */
function _getObjList(orderData) {
  return Array.from(orderData)
    .map( ([pizzaID, orderCount]) => ({pizzaData: PizzaData[pizzaID], orderCount: orderCount}) )
}
// ================== global in dealing with cookies ====================
const expireDate = 7 // all of the cookie data will expire after 7 days
const cookieKey = 'pisa!' // the key to all the json cookie data

/**
 * This function resets the cookie expire date to `expireDate` days after current time.
 */
function _resetCookieExpire () {
  const result = Cookies.get(cookieKey)

  if (result === undefined)
    // update the expire date
    Cookies.set(cookieKey, {}, {expires: expireDate})
  else
    Cookies.set(cookieKey, result, {expires: expireDate})
}

/**
 * The function get the an json object from the cookie
 * @return {object}: return the cookie object
 * @private
 */
function _getJSONDataFromCookie () {
  // get the cookie data
  const cookieObj = Cookies.get(cookieKey)

  if (cookieObj === undefined)
    return {}  // return an empty object
  else {
    // update the expiration date
    _resetCookieExpire()
    return JSON.parse(cookieObj)
  }
}

/**
 * update the key value inside the cookie object
 * @param {string} key: the key to update (say "order", "existingUser" or "address")
 * @param {object} value: any object that you want to assign to the key (have to be json stringifiable)
 */
function _setValueInCookieObj (key, value) {
  // get the cookie object
  const cookieObj = _getJSONDataFromCookie()

  // update the key value
  cookieObj[key] = value
  // save the object to cookie
  Cookies.set(cookieKey, cookieObj)

  // update the expiration date
  _resetCookieExpire()
}

// ================== dealing with cookies in order data ================
const _orderDataKey = 'orderData'

/**
 * get the order data from cookie
 * @return {Map.<int, int>} the order data where id maps to order count
 * @private
 */
function _getOrderDataFromCookie () {
  // the data array that send back
  const cookieData = _getJSONDataFromCookie()

  // get the order data
  const orderDataArray = cookieData[_orderDataKey]

  // return the map
  if (orderDataArray === undefined)
    return new Map()
  else
    return new Map(orderDataArray)
}

/**
 * clear and save the order data into cookies, expire the cookie in 7 days
 * @param {Map.<int, int>} orderData - the order data to save
 * @private
 */
function _setOrderDataToCookie (orderData) {
  // clear the order data
  const clearedOrderData = _clearOrderData(orderData)

  // convert to json stringifiable data
  const orderDataArray = Array.from(clearedOrderData)

  // save to cookie
  _setValueInCookieObj(_orderDataKey, orderDataArray)
}

/**
 * add a order for the given id in cookies
 * @param {int} id - the given id
 */
function addOrderInCookie (id) {
  const orderData = _getOrderDataFromCookie()
  _setOrderDataToCookie(_addOrder(orderData, id))
}

/**
 * set the order count for a given id
 * @param {number} id - the id to set the order count
 * @param {number} orderCount - the order count to set to
 */
function setOrderInCookie (id, orderCount) {
  const orderData = _getOrderDataFromCookie()
  _setOrderDataToCookie(_setOrderCount(orderData, id, orderCount))
}

/**
 * remove one id in the order data
 * @param {number} id - the given id
 */
function removeIdInCookie (id) {
  const orderData = _getOrderDataFromCookie()
  _setOrderDataToCookie(_removeId(orderData, id))
}

function getSubTotalFromCookie () {
  const orderData = _getJSONDataFromCookie()
  return _getSubTotal(orderData)
}

function getOrderObjectLists () {
  const orderData = _getJSONDataFromCookie()
  return _getObjList(orderData)
}

// ================= dealing with existing user =====================
const existingUserKey = 'existingUser'

function _checkExistingUser () {
  const cookieObj = _getJSONDataFromCookie()

  return !!cookieObj[existingUserKey]
}

function _setExistingUser () {
  _setValueInCookieObj(existingUserKey, true)
}

function checkAndSetExistingUser () {
  if (_checkExistingUser())
    return true
  else {
    _setExistingUser()
    return false
  }
}

// ===================== dealing with address =======================
const addressKey = 'address'

function setAddress ({fullName, streetAddress, city, state, zipCode, phone}) {
  _setValueInCookieObj(
    addressKey,
    {fullName: fullName, streetAddress: streetAddress, city: city, state: state, zipCode: zipCode, phone: phone}
  )
}

function getAddress() {
  const cookieObj = _getJSONDataFromCookie()
  if (cookieObj[addressKey] === undefined)
    return null
  else
    return cookieObj[addressKey]
}


