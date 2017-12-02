<?php
include "token_handler.php";

// this function try to get user info from user name
// it will return an array that contains the user info.
function get_user_info_from_username($username) {
    $json_str = file_get_contents(login_data_file_path);
    $json_array = json_decode($json_str, true);

    if (array_key_exists($username, $json_array)){
        return [
            "success" => true,
            "name" => $json_array[$username]["name"],
            "avatar" => $json_array[$username]["avatar"]
        ];
    }
    else
        return [
            "success" => false,
            "error" => "username not found"
        ];
}


// this file tries to get the user info form token
$username = get_user_name_from_cookie_token();

if (is_null($username))
    echo json_encode([
        "success" => false,
        "error" => "authentication failure"
    ]);
else
    echo json_encode(get_user_info_from_username($username));
