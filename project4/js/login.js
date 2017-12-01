/**
 * use ajax to get the log in html
 */
function getLoginHtml () {

  const loginSelector = $("#login-page")
  $.ajax("login.html")
    .done((responce) => loginSelector.html(responce))
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
    .done((response) => handlePareLoginResponse(response))
}

/**
 * handles the pre login response
 * - validate the username
 * - change the avatar
 * - display the welcome message
 *
 * @param response {object}: the ajax response
 */
function handlePareLoginResponse (response){
  if (response.success === true) {
    const data = response.data;
    const avatarSrc = data.avatar;
    const name = data.name;
    $("#welcome-user").html(`Hi, ${name}`)
    $("#login-avatar").attr("src", avatarSrc)
  }
  else {
    $("#login-error").html(response.error)
  }
}

$(() => {
  // when the page finish loading get the login html
  getLoginHtml();

  // when the user finish input the username
  // validate the username
  $("#username").focusout(preLogin)
})
