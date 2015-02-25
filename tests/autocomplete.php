<?php
$types = array('list', 'image', 'category', 'tree', 'custom');

$type = 'list';

if(isset($_GET['type']) && !empty($_GET['type']) && in_array($_GET['type'], $types)){
	$type = $_GET['type'];
}

$langs = array('ActionScript', 'AppleScript', 'Asp', 'Basic', 'C', 'C++', 'Clojure', 'Cobol', 'ColdFusion', 'Erlang', 'Fortran', 'Groovy', 'Haskell', 'Java', 'JavaScript', 'List', 'Perl', 'PHP', 'Ruby', 'Python', 'Scala', 'Scheme');

$autocomplete = array();

foreach($langs as $key => $value){
	$id = $key + 1;

	if($id < 10){
		$id = '0' . $id;
	}

	$autocomplete[] = array(
		'category' => substr($value, 0, 1),
		'image' => 'placeholder/profile-' . $id . '.jpg',
		'name' => $value,
        'value' => $value,
		'title' => 'Developer',
		'id' => $id);
}

$items['itemList'] = array();

foreach($autocomplete as $item) {
	if(stripos($item['name'], $_GET['term']) !== false){
		switch ($type){
			default:
			case 'list':
				$items['itemList'][] = array('name' => $item['name'], 'id' => $item['id']);
				break;
			case 'image':
				$items['itemList'][] = array('value' => $item['value'], 'image' => $item['image'], 'name' => $item['name'], 'id' => $item['id']);
				break;
			case 'category':
				$items['itemList'][] = array('value' => $item['value'], 'category' => $item['category'], 'name' => $item['name'],
                                             'id' => $item['id'], 'visiblename' => $item['category'] . ', ' . $item['name']);
				break;
			case 'tree':
				$items['itemList'][] = array('value' => $item['value'], 'category' => $item['category'], 'image' => $item['image'], 'name' => $item['name'], 'id' => $item['id']);
				break;
		}
	}
}

sleep(2);

header('Content-Type: application/json');

echo json_encode($items);