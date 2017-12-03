<?php
include "user_info_handler.php";

// authenticate the user first
precede_if_token_valid();

// this file tries to get the user info form token
$username = get_user_name_from_cookie_token();

if (is_null($username))
    echo json_encode([
        "success" => false,
        "error" => "invalid token"
    ]);
else
    echo json_encode(get_user_info_from_username($username));
