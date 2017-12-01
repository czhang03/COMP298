<?php
/*
This file handles the pre-login process:
- check whether the username exist
- display the avatar of that username
- display the welcome message for that username
*/

const pre_login_data_file_path = "../database/preLogin.json";

if (file_exists(pre_login_data_file_path)) {
    $json_str = file_get_contents(pre_login_data_file_path);
    $json_array = json_decode($json_str, true);
    $username = $_GET["username"];

    // check if the username is valid
    if (array_key_exists($username, $json_array)){
        echo json_encode([
            "success" => true,
            "data" => $json_array[$username]
        ]);
    }
    else {
        echo json_encode([
            "success" => false,
            "error" => "username not found ╮( ￣ ▽ ￣' )╭ "
        ]);
    }
}
else {
    echo json_encode([
        "success" => false,
        "error" => "cannot find data file on server o((⊙﹏⊙))o"
    ]);
}
