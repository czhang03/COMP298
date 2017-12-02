<?php

include "token_handler.php";

const login_data_file_path = "../database/login.json";

// this function try to get user info from user name
// it will return an array that contains the user info.
function get_user_info_from_username($username)
{
    $json_str = file_get_contents(login_data_file_path);
    $json_array = json_decode($json_str, true);

    if (array_key_exists($username, $json_array)) {
        return [
            "success" => true,
            "name" => $json_array[$username]["name"],
            "avatar" => $json_array[$username]["avatar"],
            "passwordSha256" => $json_array[$username]["passwordSha256"]
        ];
    } else
        return [
            "success" => false,
            "error" => "username not found"
        ];
}


