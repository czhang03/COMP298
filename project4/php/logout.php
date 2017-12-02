<?php
include "token_handler.php";

destroy_token();

echo json_encode(["success" => true]);
