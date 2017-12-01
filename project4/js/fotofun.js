function escapeHtml (unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function unescapeHtml (safe) {
  return safe
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, '\'')
}

function nl2br (nlStr) {
  return nlStr.replace(/\n/g, '<br/>')
}

const imageToDescriptionHTML = (image) =>
  `<p>${escapeHtml(nl2br(image.description))}<a href="${image.src}">Open in a New Tab</a></p>
    <p>Taken in: ${escapeHtml(nl2br(image.location))}, ${escapeHtml(nl2br(image.state))} ${escapeHtml(nl2br(image.country))}, ${image.yearTaken}</p>`

function imageToEscapedDescriptionHTML (image) {
  return escapeHtml(imageToDescriptionHTML(image))
}

const imageToColorBoxHTML = (image) =>
  `<a href="${image.srcUrl}" class="photo" data-escaped-description="${imageToEscapedDescriptionHTML(image)}">
      <img src="${image.srcUrl}" alt="${escapeHtml(image.description)}">
    </a>`

const imageToSearchItemHTML = (image) =>
  `<li class="search-item">
    <a href="${image.srcUrl}" class="photo" data-escaped-description="${imageToEscapedDescriptionHTML(image)}">
     <img src="${image.srcUrl}" alt="${escapeHtml(image.description)}">
     <div class="search-text">
      ${nl2br(escapeHtml(image.description))}<br/>${escapeHtml(nl2br(image.location))}, ${escapeHtml(nl2br(image.state))} ${escapeHtml(nl2br(image.country))}, ${image.yearTaken}
     </div>
    </a>
   </li>`

function displayAllImage (imageList) {
  const photoHTML = imageList.map(imageToColorBoxHTML).join('\n')

  const allPhotosView = $('#all-photos')

  // put in the html
  allPhotosView.html(photoHTML)

  // initialize color box
  allPhotosView.find('.photo').colorbox({
    rel: 'photo', transition: 'elastic', height: '75%',
    title: function () {
      return unescapeHtml($(this).data('escaped-description'))
    }
  })
}

function populateSearchView (imageList) {
  // generate the html
  const photoHTML = imageList.map(imageToSearchItemHTML).join('\n')

  const searchPhotosView = $('#search-photos')

  // put in the html
  searchPhotosView.html(photoHTML)

  // initialize searcher
  searchPhotosView.searcher({
    itemSelector: '.search-item',
    textSelector: '.search-text',
    inputSelector: '#search-field',
    toggle: (item, containsText) => {
      // use a typically jQuery effect instead of simply showing/hiding the item element
      if (containsText) {
        $(item).fadeIn()
        $(item).find("a").attr("data-cbox-rel", "active")
      }
      else {
        $(item).fadeOut()
        $(item).find("a").attr("data-cbox-rel", "inactive")
      }
    }
  })

  // initialize marker
  function markText (keyword) {
    searchPhotosView
      .find('.search-text')
      .mark(keyword, {separateWordSearch: false})
  }

  $('#search-field').keyup(() => {
    const keyword = $('#search-field').val()
    searchPhotosView.find('.search-text')
      .unmark({
        done: () => markText(keyword)
      })
  })

  // initialize color box
  searchPhotosView.find('.photo').colorbox({
    transition: 'elastic', height: '75%',
    title: function () {
      return unescapeHtml($(this).data('escaped-description'))
    }
  })

}

function handleLoginResponse (responseObj) {

  if (responseObj.success === false)
    $('#login-error').val('wrong username or password')

  else if (responseObj.success === true) {
    // plug the information into the page
    displayAllImage(responseObj.imageList)
    populateSearchView(responseObj.imageList)
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

function login () {
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
    .done((response) => handleLoginResponse(response))
    .fail(() => loginError.text("error encountered will login in"))

}

function toggleSearch () {
  const keyword = $('#search-field').val()

  if (keyword === '') {
    // display all photos
    $('#search-photos').css({'display': 'none'})
    $('#all-photos').css({'display': 'block'})
  }
  else {
    // enter search mode
    $('#search-photos').css({'display': 'block'})
    $('#all-photos').css({'display': 'none'})
  }
}

$(() => {

  // register event for the login button
  $('#login-button').click(login)

  // toggle the search field
  $('#search-field').keyup(toggleSearch)

})
