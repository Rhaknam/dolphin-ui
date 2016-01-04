<?php
//	Include files needed to test ngsimport
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$_SESSION['uid'] = 1;
$_SESSION['user'] = 'kucukura';
chdir('public/ajax/');

class profiledb_unittest extends PHPUnit_Framework_TestCase
{
	public function testAlterAccessKey(){
		$_GET['p'] = 'alterAccessKey';
		$_GET['id'] = '1';
		$_GET['a_key'] = 'access_key';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
	}
	
	public function testAlterSecretKey(){
		$_GET['p'] = 'alterSecretKey';
		$_GET['id'] = '1';
		$_GET['s_key'] = 'secret_key';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
	}
	
	public function testUpdateProfile(){
		$_GET['p'] = 'updateProfile';
		$_GET['img'] = 'test.img';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
	}
	
	public function testCheckAmazonPermissions(){
		$_GET['p'] = 'checkAmazonPermissions';
		$_GET['a_id'] = '1';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
	}
	
	public function testObtainAmazonKeys(){
		$_GET['p'] = 'obtainAmazonKeys';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),array());
	}
	
	public function testProfileLoad(){
		$_GET['p'] = 'profileLoad';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->photo_loc,'test.img');
	}
	
	public function testObtainGroups(){
		$_GET['p'] = 'obtainGroups';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
	}
	
	public function testObtainProfileInfo(){
		$_GET['p'] = 'obtainProfileInfo';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
	}
	
	public function testNewGroupProcess(){
		$_GET['p'] = 'newGroupProcess';
		$_GET['newGroup'] = 'new_group';
		include("profiledb.php");
		$this->assertEquals(json_decode($data),'Your group has been created');
	}
	
	public function testJoinGroupList(){
		$_GET['p'] = 'joinGroupList';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->id,'2');
	}
	
	public function testSendJoinGroupRequest(){
		$_GET['p'] = 'sendJoinGroupRequest';
		$_GET['group_id'] = '2';
		$_SESSION['uid'] = 2;
		include("profiledb.php");
		$this->assertEquals(json_decode($data),1);
		$_SESSION['uid'] = 1;
	}
	
	public function testViewGroupMembers(){
		$_GET['p'] = 'viewGroupMembers';
		$_GET['group'] = '1';
		include("profiledb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
	}
}

?>