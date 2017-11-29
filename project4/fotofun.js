responseObj = {
  success: true,
  username: 'Joe',
  imageList: [
    {
      srcUrl: 'loading.gif',
      yearTaken: 2016,
      countryHTML: 'United State',
      stateHTML: 'MA',
      locationHTML: 'common park',
      descriptionHTML: 'good day!'
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

  else if (responseObj.success === true) {
    // plug the information into the page
    displayImage(responseObj.imageList)
    $('#login-name').html(responseObj.username)

    // switch to the fotofun page
    $('#login-page').css({'display': 'none'})
    $('#fotofan-page').css({'display': 'block'})
    $('#search-field').attr({'disabled': false})
    $('#upload-button').attr({'disabled': false})
  }

  else {
    $('#login-error').val('server send a invalid response, Please contact support')
  }
}

const imageToDescriptionHTML = (image) =>
  `<p>${image.descriptionHTML} <a href="${image.srcUrl}">Open in a New Tab</a></p>
    <p>Taken in: ${image.locationHTML}, ${image.stateHTML} ${image.countryHTML}, ${image.yearTaken}</p>`


function imageToEncodedDescriptionHTML (image) {
  return encodeURI(imageToDescriptionHTML(image))
}

const imageToColorBoxHTML = (image) =>
  `<a href="${image.srcUrl}" class="photo" title="${image.descriptionHTML}"
       data-encoded-description="${imageToEncodedDescriptionHTML(image)}">
      <img src="${image.srcUrl}" alt="${image.descriptionHTML}">
    </a>`

function displayImage (imageList) {
  const photoHTML = imageList.map(imageToColorBoxHTML).join('\n')

  const photosView = $('#photos')

  // put in the html
  photosView.html(photoHTML)

  // initialize color box
  photosView.find('.photo').colorbox({
    rel: 'photo', transition: 'elastic', height: '75%',
    title: function () {return decodeURI($(this).data('encoded-description'))}
  })
}

$(() => {

  // register event for the login button
  $('#login-button').click(login)
})
