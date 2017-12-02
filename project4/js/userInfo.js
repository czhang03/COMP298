async function tryGetUserInfo () {
  const jsonStr = await $.ajax('./php/get_user_info.php')
  return JSON.parse(jsonStr)
}
