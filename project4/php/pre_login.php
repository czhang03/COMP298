<?php
/*
This file handles the pre-login process:
- check whether the username exist
- display the avatar of that username
- display the welcome message for that username
*/

include "user_info_handler.php";

$username = $_GET["username"];

echo json_encode(get_user_info_from_username($username));
