<?php

include "user_info_handler.php";

$username = $_GET["username"];
$password = $_GET["password"];
$password_hash = hash("sha256", $password);

$user_data = get_user_info_from_username($username);

// login successful
if (strcmp($user_data["passwordSha256"], $password_hash) == 0) {

    // generate the secure token
    set_new_secure_token($username);

    echo json_encode(["success" => true]);
} // password error
else {
    echo json_encode(["success" => false, "error" => "wrong password"]);
}
