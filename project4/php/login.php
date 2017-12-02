<?php

include "token_handler.php";

// start the session
session_start();

const login_data_file = "../database/login.json";

$username = $_GET["username"];
$password = $_GET["password"];
$password_hash = hash("sha256", $password);

if (file_exists(login_data_file))
    $json_str = file_get_contents(login_data_file);
else {
    echo json_encode([
        "success" => false,
        "error" => "cannot find the database"
    ]);
    exit(1);
}

$login_database = json_decode($json_str, true);

// authenticate the user
if (array_key_exists($username, $login_database)) {

    // login successful
    if (strcmp($login_database[$username]["passwordSha256"], $password_hash) == 0) {

        // generate the secure token
        set_new_secure_token($username);

        echo json_encode(["success" => true]);
    }

    // password error
    else {
        echo json_encode(["success" => false, "error" => "wrong password"]);
    }
}

else {
    echo json_encode(["success" => false, "error" => "username not found"]);
}
