<?php
session_start();
ob_start( 'ob_gzhandler' );
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");
header("Content-Encoding: gzip");

require_once "core/App.php";

try
{
	if(!isset($_GET['action'])) throw new AppException("Action is undefined.", 1);
	switch ($_GET['action']) {
		case 'register':
			if(!isset($_POST['access_token'])) throw new AppException("Access token is missing.", 3);

			# code...
			break;
		case 'sendAnswer':
			if(!isset($_POST['detail'])) throw new AppException("Detail is missing.", 4);
			//error_log(print_r($_REQUEST,true));

			/* TODO: Validation 
				We have: 
					- interactions width coordinates and ID, 
					- container size and offsets,
					- timestamps and
					- a generated order. 
			*/

			die(json_encode($_REQUEST));
			break;
		default:
			throw new AppException("Action not found.", 2);
			break;
	}
}
catch(AppException $ex)
{
	die($ex->getJsonObject());
}

?>
