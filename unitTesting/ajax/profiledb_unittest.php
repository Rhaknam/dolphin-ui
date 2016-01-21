<?php
//	Include files needed to test ngsimport
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$_SESSION['uid'] = '1';
$_SESSION['user'] = 'kucukura';
chdir('public/ajax/');

class profiledb_unittest extends PHPUnit_Framework_TestCase
{
	public function testAlterAccessKey(){
		ob_start();
		$_GET['p'] = 'alterAccessKey';
		$_GET['id'] = '1';
		$_GET['a_key'] = 'access_key';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
		ob_end_clean();
	}
	
	public function testAlterSecretKey(){
		ob_start();
		$_GET['p'] = 'alterSecretKey';
		$_GET['id'] = '1';
		$_GET['s_key'] = 'secret_key';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
		ob_end_clean();
	}
	
	public function testUpdateProfile(){
		ob_start();
		$_GET['p'] = 'updateProfile';
		$_GET['img'] = 'test.img';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
		ob_end_clean();
	}
	
	public function testCheckAmazonPermissions(){
		#ob_start();
		$_GET['p'] = 'checkAmazonPermissions';
		$_GET['a_id'] = '1';
		include("profiledb.php");
		var_dump($data);
		$this->assertEquals(json_decode($data)[0]->id,'1');
		#ob_end_clean();
	}
	
	public function testObtainAmazonKeys(){
		#ob_start();
		$_GET['p'] = 'obtainAmazonKeys';
		include("profiledb.php");
		var_dump($data);
		$this->assertEquals(json_decode($data)[0]->id,'1');
		#ob_end_clean();
	}
	
	public function testProfileLoad(){
		ob_start();
		$_GET['p'] = 'profileLoad';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->photo_loc,'test.img');
		ob_end_clean();
	}
	
	public function testObtainGroups(){
		ob_start();
		$_GET['p'] = 'obtainGroups';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testObtainProfileInfo(){
		ob_start();
		$_GET['p'] = 'obtainProfileInfo';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testNewGroupProcess(){
		ob_start();
		$_GET['p'] = 'newGroupProcess';
		$_GET['newGroup'] = 'new_group';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),'Your group has been created');
		ob_end_clean();
	}
	
	public function testJoinGroupList(){
		#ob_start();
		$_GET['p'] = 'joinGroupList';
		$_SESSION['uid'] = '4';
		include("profiledb.php");
		var_dump($data);
		$_SESSION['uid'] = '1';
		$this->assertEquals(json_decode($data)[0]->id,'3');
		#ob_end_clean();
	}
	
	public function testSendJoinGroupRequest(){
		ob_start();
		$_GET['p'] = 'sendJoinGroupRequest';
		$_GET['group_id'] = '2';
		$_SESSION['uid'] = '2';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),0);
		$_SESSION['uid'] = '1';
		ob_end_clean();
	}
	
	public function testViewGroupMembers(){
		ob_start();
		$_GET['p'] = 'viewGroupMembers';
		$_GET['group'] = '1';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
}

?>