responseObj = {
  success: true,
  username: "Joe",
  imageList: [
    {
      src: "test",
      yearTaken: 2016,
      country: "United State",
      state: "MA",
      location: "common park",
      description: "good day!"
    }
  ]
}

async function login () {
  // get the login information
  const username = $('#username').val()
  const password = $('#password').val()

  // check for basic errors
  if (username === '') {
    $('#login-error').html('username cannot be empty')
    return
  }
  else if (password === '') {
    $('#login-error').html('password cannot be empty')
    return
  }

  // get the response
  const response = await $.ajax(`login.php?username=${username}&password=${password}`)

  // display the response
  handleLoginResponse(JSON.parse(response))
}

function handleLoginResponse (responseObj) {

  if (responseObj.success === false)
    $('#login-error').val('wrong username or password')

  else if (responseObj.success === true){
    // plug the information into the page
    displayImage(responseObj.imageList)
    $("#login-name").html(responseObj.username)

    // switch to the fotofun page
    $("#login-page").css({"display": "none"})
    $("#fotofan-page").css({"display": "block"})
    $("#search-field").attr({"disabled": false})
    $("#upload-button").attr({"disabled": false})
  }

  else {
    $("#login-error").val("server send a invalid response, Please contact support")
  }
}

function displayImage (imageList) {

  // initialize color box
  $('#photos').find('.photo').colorbox({rel: 'photo', transition: 'elastic', height: '75%'})
}

$(() => {

  // register event for the login button
  $("#login-button").click(login)
})
