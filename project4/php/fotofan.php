<?php
echo json_encode([
    "success" => true,
    "username" => "Joe",
    "imageList" => [
        [
            "srcUrl" => "https://pbs.twimg.com/profile_images/469017630796296193/R-bEN4UP.png",
            "yearTaken" => 1960,
            "country" => "China",
            "state" => "",
            "location" => "this \" <>",
            "description" => "this is character test quote and slash: \" ' \ \nthis is on new line"
        ],
        [
            "srcUrl" => "http://blogs.edweek.org/edweek/the_startup_blog/Test%20Sign.jpg",
            "yearTaken" => 2016,
            "country" => "United State",
            "state" => "MA",
            "location" => "common park",
            "description" => "good day!"
        ]
    ]
]);
