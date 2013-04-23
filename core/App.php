<?php
class SupershopApp
{
	public function __construct()
	{
		
	}
}


class AppException extends Exception
{	
	public function getJsonObject()
	{
		header("HTTP/1.1 400 Bad Request");
		$data = array(
			"error"=>array(
				"message"=>"(#".$this->code.") ".$this->message,
				"type"=>get_class($this),
				"code"=>$this->code
			)
		);
		return json_encode($data);
	}
}
?>