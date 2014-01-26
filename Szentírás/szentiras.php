<?php

$url = "http://szentiras.hu/API/?";

$url.=http_build_query($_GET);

echo file_get_contents($url);

?>
