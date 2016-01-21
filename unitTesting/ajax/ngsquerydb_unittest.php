<?php
//	Include files needed to test ngsimport
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$_SESSION['uid'] = '1';
$_SESSION['user'] = 'kucukura';
chdir('public/ajax/');

class ngsquerydb_unittest extends PHPUnit_Framework_TestCase
{
	public function testGetRunSamples(){
		ob_start();
		$_GET['p'] = 'getRunSamples';
		$_GET['gids'] = '1';
		$_GET['runID'] = '1';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->sample_id,'1');
		ob_end_clean();
	}
	
	public function testGrabReload(){
		ob_start();
		$_GET['p'] = 'grabReload';
		$_GET['groupID'] = '1';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->outdir,'/export/barcodetest');
		ob_end_clean();
	}
	
	public function testGetReportNames(){
		ob_start();
		$_GET['p'] = 'getReportNames';
		$_GET['runid'] = '1';
		$_GET['samp'] = '1,2,3';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->outdir,'/export/barcodetest');
		ob_end_clean();
	}
	
	public function testLanesToSamples(){
		ob_start();
		$_GET['p'] = 'lanesToSamples';
		$_GET['lane'] = '1';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testGetAllSampleIds(){
		ob_start();
		$_GET['p'] = 'getAllSampleIds';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testGetAllLaneIds(){
		ob_start();
		$_GET['p'] = 'getAllLaneIds';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testGetAllExperimentIds(){
		ob_start();
		$_GET['p'] = 'getAllExperimentIds';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testGetLaneIdFromSample(){
		ob_start();
		$_GET['p'] = 'getLaneIdFromSample';
		$_GET['sample'] = '1';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
	
	public function testGetExperimentIdFromSample(){
		ob_start();
		$_GET['p'] = 'getExperimentIdFromSample';
		include("ngsquerydb.php");
		$this->assertEquals(json_decode($data)[0]->id,'1');
		ob_end_clean();
	}
}

?>