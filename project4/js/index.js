$(() => {
  $("#login").attr(
    "href", encodeURI(`./login.html?from=${window.location.href}`)
  )
})
