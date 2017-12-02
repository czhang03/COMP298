<?php

include "token_handler.php";

// check if the token is valid
precede_if_token_valid();

$username = get_user_name_from_cookie_token();

// null check the user name
if (is_null($username)) {
    echo json_encode([
        "success" => false,
        "error" => "Username not found",
    ]);
}
else {
    $image_data_path = "../database/" . $username . ".json";
    $login_data_path = "../database/login.json";

    $image_data = json_decode(file_get_contents($image_data_path), true);

    $user_data = json_decode(file_get_contents($login_data_path), true);

    echo json_encode([
        "success" => true,
        "imageList" => $image_data
    ]);
}
