<?php
//	Include files needed to test ngsimport
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$_SESSION['uid'] = '1';
$_SESSION['user'] = 'kucukura';
chdir('public/ajax/');

class ngs_tables_unittest extends PHPUnit_Framework_TestCase
{
	public function testGetStatus(){
		ob_start();
		$_GET['p'] = 'getStatus';
		$_GET['q'] = '';
		$_GET['r'] = '';
		$_GET['seg'] = '';
		$_GET['search'] = '';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		$_SESSION['run_type'] = 0;
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testGetSelectedSamples(){
		ob_start();
		$_GET['p'] = 'getSelectedSamples';
		$_GET['q'] = '';
		$_GET['r'] = '';
		$_GET['seg'] = '';
		$_GET['search'] = '1';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testBrowseGetSamples(){
		ob_start();
		$_GET['p'] = 'getSamples';
		$_GET['q'] = 'Organism';
		$_GET['r'] = 'human';
		$_GET['seg'] = 'browse';
		$_GET['search'] = 'organism=human';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'7');
		ob_end_clean();
	}
	
	public function testBrowseGetLanes(){
		ob_start();
		$_GET['p'] = 'getLanes';
		$_GET['q'] = 'Organism';
		$_GET['r'] = 'human';
		$_GET['seg'] = 'browse';
		$_GET['search'] = 'organism=human';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'2');
		ob_end_clean();
	}
	
	public function testBrowseGetExperimentSeries(){
		ob_start();
		$_GET['p'] = 'getExperimentSeries';
		$_GET['q'] = 'Organism';
		$_GET['r'] = 'human';
		$_GET['seg'] = 'browse';
		$_GET['search'] = 'organism=human';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'2');
		ob_end_clean();
	}
	
	public function testDetailsGetSamplesTheValue(){
		ob_start();
		$_GET['p'] = 'getSamples';
		$_GET['q'] = 'samples';
		$_GET['r'] = '1';
		$_GET['seg'] = 'details';
		$_GET['search'] = '1';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testDetailsGetSamplesTheField(){
		ob_start();
		$_GET['p'] = 'getSamples';
		$_GET['q'] = 'samples';
		$_GET['r'] = '';
		$_GET['seg'] = 'details';
		$_GET['search'] = '1';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testDetailsGetLanes(){
		ob_start();
		$_GET['p'] = 'getLanes';
		$_GET['q'] = 'experiment';
		$_GET['r'] = '';
		$_GET['seg'] = 'details';
		$_GET['search'] = '1';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testDetailsGetExperimentSeries(){
		ob_start();
		$_GET['p'] = 'getExperimentSeries';
		$_GET['q'] = 'experiment_series';
		$_GET['r'] = '';
		$_GET['seg'] = 'details';
		$_GET['search'] = '1';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testNoSearchBrowseGetSamples(){
		ob_start();
		$_GET['p'] = 'getSamples';
		$_GET['q'] = 'Organism';
		$_GET['r'] = 'human';
		$_GET['seg'] = 'browse';
		$_GET['search'] = 'organism=human';
		$_GET['uid'] = '1';
		$_GET['gids'] = '1';
		include("ngs_tables.php");
		$this->assertEquals(json_decode($data)[0]->id,'7');
		ob_end_clean();
	}
}

?>