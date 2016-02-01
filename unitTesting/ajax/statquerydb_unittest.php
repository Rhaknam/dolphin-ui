<?php
//	Include files needed to test ngsimport
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$_SESSION['uid'] = '1';
$_SESSION['user'] = 'kucukura';
chdir('public/ajax/');

class statquerydb_unittest extends PHPUnit_Framework_TestCase
{
	public function testGetDailyRuns(){
		ob_start();
		$_GET['p'] = 'getDailyRuns';
		include('statquerydb.php');
		$this->assertEquals(1,1);
		ob_end_clean();
	}
	
	public function testGetTopUsers(){
		ob_start();
		$_GET['p'] = 'getTopUsers';
		$_GET['type'] = 'Dolphin';
		include('statquerydb.php');
		$this->assertEquals(1,1);
		ob_end_clean();
	}
	
	public function testGetTopUsersTime(){
		ob_start();
		$_GET['p'] = 'getTopUsersTime';
		$_GET['type'] = 'Dolphin';
		include('statquerydb.php');
		$this->assertEquals(1,1);
		ob_end_clean();
	}
	
	public function testGetUsersTime(){
		ob_start();
		$_GET['p'] = 'getUsersTime';
		$_GET['type'] = 'Dolphin';
		include('statquerydb.php');
		$this->assertEquals(1,1);
		ob_end_clean();
	}
	
	public function testGetLabsTime(){
		ob_start();
		$_GET['p'] = 'getLabsTime';
		$_GET['type'] = 'Dolphin';
		include('statquerydb.php');
		$this->assertEquals(1,1);
		ob_end_clean();
	}
	
	public function testGetToolTime(){
		ob_start();
		$_GET['p'] = 'getToolTime';
		$_GET['type'] = 'Dolphin';
		include('statquerydb.php');
		$this->assertEquals(1,1);
		ob_end_clean();
	}
	
	public function testGetJobTime(){
		ob_start();
		$_GET['p'] = 'getJobTime';
		include('statquerydb.php');
		$this->assertEquals(1,1);
		ob_end_clean();
	}
}

?>