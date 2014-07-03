<?Php

include_once('../core/class.managedatabase.php');

$init = new managedatabase;
$table_name ='users';
$data = $init->getData($table_name, 1);
echo "<pre>";
print_r($data);
?>