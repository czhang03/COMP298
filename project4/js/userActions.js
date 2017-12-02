async function tryGetUserInfo () {
  const jsonStr = await $.ajax('./php/get_user_info.php')
  return JSON.parse(jsonStr)
}

/**
 * The function to log out and then redirect to homepage
 * This function is not so good because there is no error handling
 */
function logout () {
  $.ajax('../php/logout.php')
    .done((response) => {
      const responseObj = JSON.parse(response)
      if (responseObj.success)
        window.location.href = './'
    })
}
