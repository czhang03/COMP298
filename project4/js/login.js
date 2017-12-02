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

      // if the server gives an error
      if (responseObj.success === false)
        loginError.text(responseObj.error)

      else if (responseObj.success === true)
        loginError.text("login successful")

      // server send invalid request
      else
        throw "server send invalid respond"
    })

    // handle error during ajax requests
    .fail(() => loginError.text("error encountered will login in"))

}

/**
 * pre login process
 * - validate the username
 * - change the avatar
 * - display the welcome message
 */
function preLogin() {
  const username = $("#username").val()

  $.ajax(`php/pre_login.php?username=${username}`)
    .done((response) => handlePareLoginResponse(JSON.parse(response)))
    .fail(() => $("#login-error").text("login failed, please try again later"))
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
    $("#login-avatar").attr("src", "img_resource/fotofan.png")
  }
}

$(() => {
  $("#username").focusout(preLogin)

  $("#login-button").click(getAuthenticateToken)
})
