<html>

<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <meta http-equiv="X-UA-Compatible" content="chrome=1,IE=edge">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="cache-control" content="max-age=7200" />
    <link rel="stylesheet" href="css/melonImageCrop.css">
    <link rel="stylesheet" href="//at.alicdn.com/t/font_h1twyhokswjhsemi.css">
</head>

<body>


    <?php 
        
        $json_string = file_get_contents('data.json');   
        $data = json_decode($json_string, true);  
        foreach($data as $key=>$value){
    ?>
    <img src='<?php echo $value; ?>' alt='' />
    <?php 
        }
    ?>
</body>

</html>
