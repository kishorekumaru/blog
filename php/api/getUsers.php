<?Php


if(function_exists($_GET['method'])){
	$_GET['method']();
}

function getAllUsers(){
	include_once('../core/class.managedatabase.php');
	$init = new managedatabase;
	$table_name ='users';
	$data = $init->getData($table_name);
	$data = json_encode($data);
	echo $_GET['jsoncallback'] . $data ;
}


function deleteUsers(){
	$param =json_decode(file_get_contents('php://input'));	
	include_once('../core/class.managedatabase.php');
	$init = new managedatabase;
	$table_name ='users';
	$data = $init->deleteData($table_name, $param->id);
	echo $_GET['jsoncallback'] . $data ;
}

function editUsers(){
	$param =json_decode(file_get_contents('php://input'));	
	include_once('../core/class.managedatabase.php');
	$init = new managedatabase;
	$table_name ='users';
	$data = $init->editData($table_name,$param, $param->id);
	echo $_GET['jsoncallback'] . $data ;
}


function InsertValues(){
	
	$param =json_decode(file_get_contents('php://input'));
	
	foreach($param as $key=>$value){
		$field_names[]= $key;
		$field_value[] = "'" . $value . "'";
	}
	include_once('../core/class.managedatabase.php');
	$init = new managedatabase;
	$table_name ='users';
	
	$field_names = implode(",",$field_names); 
	$field_value = implode(",",$field_value); 


	$insert = $init->insertData($table_name, $field_names, $field_value);
	
	if($insert == 1){
		$result = "1";
	}else{
		$result = "0";
	}
	
	echo $_GET['jsoncallback'] .  $result ;
}

?>