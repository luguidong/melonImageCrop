<?php 
    
    if(isset($_POST['imgBolb'])){
        $data = array(
            "imgBolb"=>$_POST['imgBolb']
        );
        $json_string = json_encode($data); 
        $info = 0;
        if(file_put_contents('data.json', $json_string)){
            $info = 1;
        }
        echo $info;
    }
?>

