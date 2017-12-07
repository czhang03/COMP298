function greeting () {
  if (checkAndSetExistingUser())
    Materialize.toast("Welcome back, old chump", 4000, "toast-center")
  else
    Materialize.toast("Greetings, stranger, welcome to the palace", 4000, "toast-center")
}

$(() => {
  $('.slider').slider({interval: 10000})

  greeting()
})
