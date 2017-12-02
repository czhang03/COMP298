async function get_login_info () {
  // try to get the login info
  const info = await tryGetUserInfo()

  if (info.success === true){
    $("#user-info").css("display", "block")
    $("#login-div").css("display", "none")
    // set the login avatar and login
    $("#login-avatar").attr("src", info.avatar)
    $("#login-name").text(info.name)
  }
  else {
    // set the login page url, if the user is not properly login
    $('#login-link').attr('href', encodeURI(`./login.html?from=${window.location.href}`))
    $("#user-info").css("display", "none")
    $("#login-div").css("display", "auto")
  }
}

$(() => {
  get_login_info();
})
