<?php
// common functions that are used in multiple file

const hash_algorithm = "sha256";  // the algorithm used for hashing
const token_key = "token";  // the key of the token in cookie

// get the secrete key on this server
function get_secrete_key()
{
    // I would use the following secure protocol
    // but the stupid server don't let me do it
//    $secure_key_path = "./key.secret";
//    if (file_exists($secure_key_path)) {
//        return file_get_contents($secure_key_path);
//    } else {
//        $secure_key = bin2hex(random_bytes(16));
//        file_put_contents($secure_key_path, $secure_key);
//        return $secure_key;
//    }
    return "stupid-server";
}

function _generate_token($current_time, $username)
{
    // generate the secure cookie token
    return json_encode([
        "time" => $current_time,
        "username" => $username,
        "hash" => hash(hash_algorithm, $current_time . $username . get_secrete_key())
    ]);
}

function set_new_secure_token($username)
{
    $current_time = time();
    setcookie(token_key, _generate_token($current_time, $username));
}

function destroy_token()
{
    $time_in_past = time() - 3600; // just some time in the past
    setcookie(token_key, "", $time_in_past);
}

// the time when token is outdated
const token_valid_period_in_hour = 1;

// helper function for validate token, to return true if token is not outdated
function _token_not_outdated($time_created)
{
    // calculate whether this cookie is outdated
    $current_time = time();
    $time_passed_in_hour = abs($current_time - $time_created) / 360; // convert seconds to hours

    return $time_passed_in_hour < token_valid_period_in_hour;
}

// helper function for validate token, validate the hash is correct
function _token_hash_correct($time_created, $username, $hash)
{
    // validate the hash is correct
    $expected_hash = hash(hash_algorithm, $time_created . $username . get_secrete_key());
    return strcmp($hash, $expected_hash) === 0;
}

// validate the cookie token
// cookie token is a json string of the form:
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


// validate the token from cookie super global
function _validate_token_from_cookie()
{
    // if token do not exists
    if (!isset($_COOKIE[token_key]))
        return false;

    // validate the token
    return _validate_token($_COOKIE[token_key]);
}

// decode the username from cookie token
// return can be null
function get_user_name_from_cookie_token()
{
    // if token do not exists
    if (!isset($_COOKIE[token_key]))
        return null;

    // validate the token
    return _get_user_name_from_token($_COOKIE[token_key]);
}


// validate the token
// if validated, then update the token and return true.
// if not validated, then clear the token and return false.
function _validate_and_update_token()
{

    // if token is not valid
    if (!_validate_token_from_cookie()) {
        // destroy_token();
        return false;
    } // if the token is valid
    else {
        $username = get_user_name_from_cookie_token();
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
            "success" => false,
            "error" => "authentication failure",
        ]);
        exit(0);
    }
}
