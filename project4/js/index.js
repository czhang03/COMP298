async function get_login_info () {
  // try to get the login info
  const info = await tryGetUserInfo()

  if (info.success === true){
    // display the user info
    $("#user-info").css("display", "flex")
    $("#login-div").css("display", "none")

    // set the login avatar and login
    // register the log out button
    $("#logout").click(logout)
    $("#login-avatar").attr("src", info.avatar)
    $("#login-name").text(info.name)
  }
  else {
    // set the login page url, if the user is not properly login
    $('#login-link').attr('href', `./login.html?from=${encodeURIComponent(window.location.href)}`)

    // hide the user info
    $("#user-info").css("display", "none")
    $("#login-div").css("display", "flex")
  }
}

$(() => {
  get_login_info();
})
