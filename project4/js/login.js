/**
 * handles the login to get the token
 * token will be automatically set in the session
 */
function getAuthenticateToken() {
  const loginError = $("#login-error")

  // get the login information
  const username = $('#username').val()
  const password = $('#password').val()

  // check for basic errors
  // if there is anything wrong, just terminate
  if (username === '') {
    loginError.text('username cannot be empty')
    return
  }
  else if (password === '') {
    loginError.text('password cannot be empty')
    return
  }

  // get the response
  $.ajax(`php/login.php?username=${username}&password=${password}`)
    // handles the error from server
    // because if success the server will just set the session
    .done((response) => {
      const responseObj = JSON.parse(response)
      if (! responseObj.success)
        $("#login-error").text(responseObj.error)
    })
    // handle error during ajax requests
    .fail(() => loginError.text("error encountered will login in"))

}

/**
 * use ajax to get the log in html
 *
 * @param afterAuthenticate: the callback to execute after authentication
 */
function getLoginHtml ({afterAuthenticate}) {

  const loginSelector = $("#login-page")
  $.ajax("login.html")
    .done((responce) => {

      // get the login html
      loginSelector.html(responce)

      // when the user finish input the username
      // validate the username
      $("#username").focusout(() => preLogin())

      // register the event of the login button
      // get the authentication token, and then execute the login click callback
      $("#login-button").click(() => {
        getAuthenticateToken()
        afterAuthenticate()
      })
    })
    .fail((responce) => loginSelector.html("<p class='error'>Cannot Load Login page. Please Refresh</p>"))
}

/**
 * pre login process
 * - validate the username
 * - change the avatar
 * - display the welcome message
 */
function preLogin() {
  const username = $("#username").val()

  $.ajax(`php/preLogin.php?username=${username}`)
    .done((response) => handlePareLoginResponse(JSON.parse(response)))
}

/**
 * handles the pre login response
 * - validate the username
 * - change the avatar
 * - display the welcome message
 *
 * @param responseObj {object}: the ajax response
 */
function handlePareLoginResponse (responseObj){
  if (responseObj.success === true) {
    const data = responseObj.data;
    const avatarSrc = data.avatar;
    const name = data.name;
    $("#welcome-user").html(`Hi, ${name}`)
    $("#login-avatar").attr("src", avatarSrc)
  }
  else {
    $("#login-error").html(responseObj.error)
    $("#login-avatar").attr("src", "fotofan.png")
  }
}
