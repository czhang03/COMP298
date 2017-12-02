<?php

$user_id = "Joe";

$image_data_path = "../database/" . $user_id . ".json";

$image_data = json_decode(file_get_contents($image_data_path), true);

echo json_encode([
    "success" => true,
    "username" => "Uncle Joe Mikey",
    "imageList" => $image_data
]);
