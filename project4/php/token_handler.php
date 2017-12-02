<?php
// common functions that are used in multiple file

const hash_algorithm = "sha256";  // the algorithm used for hashing
const token_key = "token";  // the key of the token in session

// get the secrete key on this server
function get_secrete_key()
{
    $secure_key_path = sys_get_temp_dir() . "/key.secret";
    if (file_exists($secure_key_path)) {
        return file_get_contents($secure_key_path);
    } else {
        $secure_key = bin2hex(random_bytes(16));
        file_put_contents($secure_key_path, $secure_key);
        return $secure_key;
    }
}

function _generate_token($current_time, $username)
{
    // generate the secure session token
    return json_encode([
        "time" => $current_time,
        "username" => $username,
        "hash" => hash(hash_algorithm, $current_time . $username . get_secrete_key())
    ]);
}

function set_new_secure_token($username)
{
    $current_time = time();
    $_SESSION[token_key] = _generate_token($current_time, $username);
}

function destroy_token()
{
    // destroy the old session
    session_destroy();

    // start the new session
    session_start();
}

// the time when token is outdated
const token_valid_period_in_hour = 1;

// helper function for validate token, to return true if token is not outdated
function _token_not_outdated($time_created)
{
    // calculate whether this session is outdated
    $current_time = time();
    $time_passed_in_hour = abs($current_time - $time_created) / 360; // convert seconds to hours
    return $time_passed_in_hour > token_valid_period_in_hour;
}

// helper function for validate token, validate the hash is correct
function _token_hash_correct($time_created, $username, $hash)
{
    // validate the hash is correct
    $expected_hash = hash(hash_algorithm, $time_created . $username . get_secrete_key());
    return strcmp($hash, $expected_hash) === 1;
}

// validate the session token
// session token is a json string of the form:
// {
//    "time": timeCreated,
//    "username": username,
//    "hash": sha256(timeCreated + username + secrete_key)
// }
function _validate_token($token_str)
{
    $token_obj = json_decode($token_str, true);

    // unpack
    $time_created = $token_obj["time"];
    $username = $token_obj["username"];
    $hash = $token_obj["hash"];

    return _token_not_outdated($time_created) && _token_hash_correct($time_created, $username, $hash);
}

// decode the user name from token
// return can be null
function _get_user_name_from_token($token_str)
{
    $token_obj = json_decode($token_str, true);

    // unpack
    return $token_obj["username"];
}


// validate the token from session super global
function _validate_token_from_session()
{
    // if token do not exists
    if (!isset($_SESSION[token_key]))
        return false;

    // validate the token
    return _validate_token($_SESSION[token_key]);
}

// decode the username from session token
// return can be null
function get_user_name_from_session_token()
{
    // if token do not exists
    if (!isset($_SESSION[token_key]))
        return null;

    // validate the token
    return _get_user_name_from_token($_SESSION[token_key]);
}


// validate the token
// if validated, then update the token and return true.
// if not validated, then clear the token and return false.
function _validate_and_update_token()
{

    // if token is not valid
    if (!_validate_token_from_session()) {
        destroy_token();
        return false;
    } // if the token is valid
    else {
        $username = get_user_name_from_session_token();
        set_new_secure_token($username);
        return true;
    }
}

// this function validate the token
// if the token is not valid, then send the the authentication failure
// else precede with the program
function precede_if_token_valid()
{
    if (!_validate_and_update_token()) {
        echo json_encode([
            "success" => true,
            "error" => "authentication failure",
        ]);
        exit(0);
    }
}
