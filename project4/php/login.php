<?php

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

// helper function to write content to file path
function write_to_file($content, $file_path) {
    $Handle = fopen($file_path, 'w');
    fwrite($Handle, $content);
}

// get the secrete key on this server
function get_secrete_key() {
    $secure_key_path = sys_get_temp_dir() . "/key.secret";
    if (file_exists($secure_key_path)) {
        return file_get_contents($secure_key_path);
    }
    else {
        $secure_key = bin2hex(random_bytes(16));
        write_to_file($secure_key, $secure_key_path);
        return $secure_key;
    }
}

// authenticate the user
if (array_key_exists($username, $login_database)) {

    // login successful
    if (strcmp($login_database[$username]["passwordSha256"], $password_hash) == 0) {

        // generate the secure session token
        $currentTime = time();
        $secure_token = json_encode([
            "time" => $currentTime,
            "username" => $username,
            "Hash" => hash("sha256", $currentTime . $username . get_secrete_key())
        ]);

        // put the secure token in session
        $_SESSION["token"] = $secure_token;

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
