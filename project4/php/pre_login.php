<?php
/*
This file handles the pre-login process:
- check whether the username exist
- display the avatar of that username
- display the welcome message for that username
*/

include "get_user_info.php";

const login_data_file_path = "../database/login.json";

if (file_exists(login_data_file_path)) {
    $username = $_GET["username"];

    echo json_encode(get_user_info_from_username($username));
}
else {
    echo json_encode([
        "success" => false,
        "error" => "cannot find data file on server o((⊙﹏⊙))o"
    ]);
}
