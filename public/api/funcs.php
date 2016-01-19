<?php
require_once("../../config/config.php");

class funcs
{
    public $dbhost = "";
    public $db = "";
    public $dbuser = "";
    public $dbpass = "";
    public $tool_path = "";
    public $remotehost = "";
    public $jobstatus = "";
    public $config = "";
    public $python = "";
    public $schedular = "";
    public $checkjob_cmd = "";
    public $job_num = "";
    public $username = "";
    function readINI()
    {
            $this->dbhost     = DB_HOST;
            $this->db         = DB_NAME;
            $this->dbpass     = DB_PASSWORD;
            $this->dbuser     = DB_USER;
            $this->tool_path  = DOLPHIN_TOOLS_SRC_PATH;
            $this->remotehost = REMOTE_HOST;
            $this->jobstatus  = JOB_STATUS;
            $this->config     = CONFIG;
            $this->python     = PYTHON;
            $this->schedular  = SCHEDULAR;
            $this->setCMDs();
    }
    function getINI()
    {
        $this->readINI();
        return $this;
    }
    function setCMDs()
    { 
        if($this->schedular == "LSF")
        {
            $this->checkjob_cmd = $this->getSSH() . " \"" . $this->jobstatus . " $this->job_num\"|grep " . $this->job_num . "|awk '{printf (\"%s\t%s\",\$3,\$1)}'";
        }
        else if($this->schedular == "SGE")
        {
            #Put SGE commands here
        }
        else
        {
            $this->checkjob_cmd = "ps -ef|grep \"[[:space:]]" . $this->job_num . "[[:space:]]\"|awk '{printf(\"%s\t%s\",\$8,\$2)}'";
            #$this->checkjob_cmd = "ps -ef|grep \"[[:space:]]" . $this->job_num . "[[:space:]]\"";
        }
    }
    function getCMDs($com)
    {
        
        if($this->schedular == "LSF" || $this->schedular == "SGE")
        {
            $com=str_replace("\"", "\\\"", $com);
            $com=$this->getSSH() . " \"" . $com . "\"";
        } 
        return $com;
    }

    function checkFile($params)
    {
         $this->username=$params['username'];
         $this->readINI();         
         $com = "ls ".$params['file'];
         $retval = $this->syscall($this->getCMDs($com));
         
         if (preg_match('/No such file or directory/', $retval)) {
              return "{\"ERROR\": \"No such file or directory: ".$params['file']."\"}";
         }
         if (preg_match('/Permission denied/', $retval)) {
              return "{\"ERROR\": \"Permission denied: ".$params['file']."\"}";
         }
         return "{\"Result\":\"Ok\"}";
    }
    function checkPermissions($params)
    {
         $this->username=$params['username'];
         $this->readINI();
         if ($params['outdir']!="")
         {
           $com = "mkdir -p ".$params['outdir'].";cd ".$params['outdir'].";touch permstest.txt;rm permstest.txt";
         }
         else
         {
           $com = "ls";
         }
         $retval = $this->syscall($this->getCMDs($com));
         if (preg_match('/Permission denied/', $retval)) {
              return "{\"ERROR\": \"Permission denied: ".$params['outdir']."\"}";
         }
         return "{\"Result\":\"Ok\"}";
    }
     
    function getKey()
    {
        $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $wkey       = "";
        $ret        = "";
        for ($i = 0; $i < 30; $i++) {
            $wkey .= $characters[rand(0, strlen($characters))];
        }
        # If this random key exist it randomize another key
        if ($this->getWorkflowId($wkey))
            $ret = $this->getKey();
        else
            $ret = $wkey;
        return $ret;
    }
    function runSQL($sql)
    {
        sleep(1);
        $this->readINI();
        $link = new mysqli($this->dbhost, $this->dbuser, $this->dbpass, $this->db);
        // check connection
        if (mysqli_connect_errno()) {
            exit('Connect failed: ' . mysqli_connect_error());
        }
        $i = 0;
        while ($i < 3) {
            $result = $link->query($sql);
            
            if ($result) {
                $link->close();
                return $result;
            }
            sleep(5 * ($i + 1));
            $i++;
        }
        $link->close();
        return $sql;
    }
    function queryAVal($sql)
    {
        $res = $this->runSQL($sql);
        
        $num_rows = $res->num_rows;
        
        if (is_object($res) && $num_rows > 0) {
            $row = $res->fetch_array();
            return $row[0];
        }
        return "0";
    }
    
    function queryTable($sql)
    {
        $data = array();
        if ($res = $this->runSQL($sql)) {
            while (($row = $res->fetch_assoc())) {
                $data[] = $row;
            }
            $res->close();
        }
        return $data;
    }
    
    function syscall($command)
    {
        $result = "";
        if ($proc = popen("($command)2>&1", "r")) {
            while (!feof($proc))
                $result .= fgets($proc, 1000);
            pclose($proc);
            return $result;
        } else {
            return "ERROR 104: Cannot run $command!";
        }
        
    }
    function sysback($command)
    {
        Proc_Close (Proc_Open ("($command)2>&1 &", Array (), $foo));
    }
    function getSSH()
    {
       sleep(1);
       return "ssh -o ConnectTimeout=30  ". $this->username. "@" . $this->remotehost . " ";
    }

    function checkJobInCluster($wkey, $job_num, $username)
    {
        $this->job_num = $job_num; 
        $this->username = $username;
        $this->readINI();
        $retval = $this->syscall($this->checkjob_cmd);

        if ($retval == "") {
            $ret = $this->checkJobInDB($wkey, $job_num, $username);
            if ($ret == 0) {
                $retval = "EXIT";
            } else {
                $retval = "DONE";
            }
        }
        return $retval;
    }
    function checkStartTime($wkey, $job_num,$username)
    {
        $sql = "update jobs set start_time=now() where wkey='$wkey' and job_num='$job_num'  and start_time=0 and username='$username'";
        $this->runSQL($sql);
    }
    function checkJobInDB($wkey, $job_num, $username)
    {
        #sleep(5);
        $sql      = "select * from jobs j where wkey='$wkey' and job_num='$job_num' and result=3 and username='$username'";
        $res      = $this->runSQL($sql);
        $num_rows = $res->num_rows;
        #Check if there are jobs which are failed or running
        if ($num_rows > 0) {
            return "Job Finsihed Sucessfully!!!";
        }
        return 0;
    }
    function rerunJob($servicename, $jobname, $jobnum, $wkey)
    {
       $sql="select max(wkey) wkey from jobs where jobname='$jobname' and wkey like '$wkey-%'";
       $wkey_trial=$this->queryAVal($sql);
       $trial=1;
       if (strlen($wkey_trial) > 10)
       {
         $tarr=explode('-', $wkey_trial, 2);
         $trial=$tarr[1]+1;
       }
       if ($trial<4)
       {
         $sql="update jobs set wkey='$wkey-$trial', jobstatus=0 where job_num='$jobnum' and jobname='$jobname' and wkey='$wkey'";
         $this->runSQL($sql);
         if ($servicename!=$jobname)
         {
           $sql="update jobs set wkey='$wkey-$trial', jobstatus=0 where jobname='$servicename' and wkey='$wkey'";
           $this->runSQL($sql);
         }
         return 1;
       }
       return 0;
    }
    
    function checkStatus($params)
    {
        $servicename = $params['servicename'];
        $wkey        = $params['wkey'];
        $sql      = "select j.service_id from jobs j, services s where s.service_id=j.service_id and s.servicename='$servicename' and j.wkey='$wkey'";
        #return $sql;
        $service_id   = $this->queryAVal($sql);
        #sleep(1); 
        if ($service_id > 0) {
            $sql        = "select DISTINCT j.job_num job_num, j.jobname jobname, j.result jresult, s.username username from jobs j, services s where s.service_id=j.service_id and s.servicename='$servicename' and wkey='$wkey' and result<3";
            $res      = $this->runSQL($sql);
            $num_rows = $res->num_rows;
            
            #Check if there are jobs which are failed or running
            if (is_object($res) && $num_rows > 0) {
                while ($row = $res->fetch_assoc()) {
                    # If job is running, it turns 1 otherwise 0 and it needs to be restarted
                    # If it doesn't turn Error and if job is working it turns wkey to che
                    $retval = $this->checkJobInCluster($wkey, $row['job_num'], $row['username']);
                    if ($retval != "")
                    {
                        $this->checkStartTime($wkey, $row['job_num'], $row['username']);
                    }
                    if (preg_match('/^EXIT/', $retval)) {
                      if (!$sqlstr=$this->rerunJob( $servicename, $row['jobname'], $row['job_num'], $wkey ) )
                      {
                        $sql    = "SELECT j.jobname, jo.jobout FROM jobs j, jobsout jo where j.wkey=jo.wkey and j.job_num=jo.jobnum and j.job_num=" . $row['job_num'] . " and jo.wkey='$wkey'";
                        $resout = $this->runSQL($sql);
                        $rowout = $resout->fetch_assoc();
                        require_once('class.html2text.inc');
                        
                        $h2t =& new html2text($rowout['jobout']);
                        $jobout = $h2t->get_text();
                        return 'ERROR:' . $retval . "\n" . $rowout['jobname'] . " Failed\nCheck LSF output\n" . $jobout;
                      }
                    }
                    if (preg_match('/DONE/', $retval)) {
                        $jn     = rtrim(substr($retval, 5));
                        $sql    = "select * from jobs where result=3 and job_num='" . $jn . "' and wkey='$wkey'";
                        $result = $this->runSQL($sql);
                        if (is_object($result)) {
                            $sql    = "UPDATE jobs set result='3', end_time=now() where job_num='" . $jn . "' and wkey='$wkey'";
                            $result = $this->runSQL($sql);
                        } else {
                            $sql = "insert into jobs(`username`, `wkey`, `jobname`, `service_id`, `result`, `submit_time`, `start_time`,`end_time`,`job_num`) values ('" . $row['username'] . "', '$wkey', '$servicename', '$service_id', '3', now(), now(), now(),  '$jn' )";
                            
                            $result = $this->runSQL($sql);
                        }
                    }
                }
            } else {
                    return "Service ended successfully ($servicename)!!!";
            }
            return "RUNNING(1):[retval=$retval]:SERVICENAME:$servicename";
        }
        return 'START';
    }
    
    function getServiceOrder($workflow_id, $service_id, $wkey)
    {
        $sql    = "select service_order from workflow_services where workflow_id=$workflow_id and service_id=$service_id";
        $result = $this->runSQL($sql);
        if (is_object($result) && $row = $result->fetch_row())
            return -1;
        
        $sql    = "select max(service_order) from workflow_services w, workflow_run wr where wr.workflow_id=$workflow_id and wr.workflow_id=w.workflow_id and wr.wkey='$wkey'";
        $result = $this->runSQL($sql);
        if (is_object($result) && $row = $result->fetch_row()) {
            $id = $row[0] + 1;
        } else {
            $id = 1;
        }
        
        return ($id);
    }
    
    function getWorkflowId($wkey)
    {
        $sql    = "select workflow_id from workflow_run where wkey='$wkey'";
        $result = $this->runSQL($sql);
        if (is_object($result) && $row = $result->fetch_row()) {
            $id = $row[0];
        } else {
            return 0;
        }
        return $id;
    }
    
    function getId($name, $username, $val, $wkey, $defaultparam)
    {
        $sql    = "select " . $name . "_id from " . $name . "s where `" . $name . "name`='$val' and username='$username'";
        $result = $this->runSQL($sql);
        if (is_object($result) && $row = $result->fetch_row()) {
            $id = $row[0];
            if ($name == "workflow") {
                $sql = "update " . $name . "_id from " . $name . "s where `" . $name . "name`='$val' and username='$username'";
            }
        } else {
            #If workflow and service doesn't exist. This registers those workflows automatically. 
            
            $sql    = "insert into " . $name . "s(`" . $name . "name`, `description`, `username`, `defaultparam`) values('" . $val . "', 'Service description', '$username', '$defaultparam')";
            $result = $this->runSQL($sql);
            $id     = $this->getId($name, $username, $val, $key, $defaultparam);
        }
        
        if ($name == "service") {
            $workflow_id   = $this->getWorkflowId($wkey);
            $service_order = $this->getServiceOrder($workflow_id, $id, $wkey);
            if ($service_order > 0 && $workflow_id > 0) {
                $sql    = "insert into workflow_services(`workflow_id`, `service_id`, `service_order`) values($workflow_id,$id, $service_order)";
                $result = $this->runSQL($sql);
            }
        }
        return $id;
    }
    
    function getWorkflowInformation($wkey)
    {
        $sql    = "select wr.username, wr.inputparam, wr.outdir, w.defaultparam from workflow_run wr, workflows w  where w.workflow_id=wr.workflow_id and wr.wkey='$wkey'";
        $result = $this->runSQL($sql);
        if (is_object($result) && $row = $result->fetch_row()) {
            return $row;
        }
        return "ERROR 001: in getWorkflowInformation:$sql";
    }
    function updateInputParam($wkey, $username, $inputparam)
    {
        $sql = "select inputparam from workflow_run where wkey='$wkey' and username='$username'";
        
        $result = $this->runSQL($sql);
        if (is_object($result) && $row = $result->fetch_row()) {
            
            if ($inputparam != $row[0]) {
                
                $sql    = "update workflow_run set inputparam='" . $inputparam . "' where wkey='$wkey' and username='$username'";
                $result = $this->runSQL($sql);
            }
            return $inputparam;
        }
        return "ERROR 002: in getWorkflowInput $sql";
    }
    
    function updateDefaultParam($workflowname, $username, $defaultparam)
    {
        
        $sql    = "update workflows set defaultparam='" . $defaultparam . "' where username='$username' and workflowname='$workflowname'";
        $result = $this->runSQL($sql);
        
    }
    
    function getCommand($servicename, $username, $inputcommand, $defaultparam)
    {
        $sql = "select command, defaultparam from services where servicename='$servicename' and username='$username'";
        
        $result = $this->runSQL($sql);
        if (is_object($result) && $row = $result->fetch_row()) {
            if ($inputcommand != $row[0] || $defaultparam != $row[1]) {
                $sql    = "update services set command='" . $inputcommand . "', defaultparam='" . $defaultparam . "' where servicename='$servicename' and username='$username'";
                $result = $this->runSQL($sql);
            }
            return $inputcommand;
        }
        return "ERROR 003: in getServiceCommand";
    }
    
    function startWorkflow( $params )
    {
        $inputparam=$params['inputparam'];
        $defaultparam=$params['defaultparam'];
        $workflowname=$params['workflow'];
        $username=$params['username'];
        $status =$params['status'];
        $outdir = $params['outdir'];
        $services= $params['services'];

        $status = "exist";
        $wkey=$params['wkey'];
        if($wkey=='' || $wkey=='start')
        {
            $wkey = $this->getKey();
            $status = "new";
        }

        if ($status == "new") {
            $workflow_id = $this->getId("workflow", $username, $workflowname, $wkey, $defaultparam);
            // sql query for INSERT INTO workflowrun
            $sql = "INSERT INTO `workflow_run` ( `workflow_id`, `username`, `wkey`, `inputparam`, `outdir`, `result`, `start_time`, `services`) VALUES ('$workflow_id', '$username', '$wkey', '$inputparam', '$outdir', '0', now(), $services)";
            if ($workflowname != "")
            {
              $this->updateDefaultParam($workflowname, $username, $defaultparam);
            }
            if ($result = $this->runSQL($sql)) {
                $ret = $result;
            }
        } else {
            $inputparam = $this->updateInputParam($wkey, $username, $inputparam);
            $ret =  $inputparam;
            $sql="delete from jobs where wkey like '$wkey-%'";
            $this->runSQL($sql);
        }
        if(preg_match('/^ERROR/', $ret))
        {
           return $ret;
        }
        return $wkey;
    }
    
    function startService($params)
    {
     $this->readINI();
     $servicename  = $params['servicename'];
     $wkey         = $params['wkey'];
     $inputcommand = $params['command'];

     $result_stat = $this->checkStatus($params);
     if ( preg_match('/START/', $result_stat)) # Job hasn't started yet 
     {
        #The service will start. Get general workflow information to start the service
        $wf = $this->getWorkflowInformation($wkey);
        if (is_array($wf)) {
            $username     = $wf[0];
            $inputparam   = $wf[1];
            $outdir       = $wf[2];
            $defaultparam = $wf[3];
            $this->username = $username;
            #Get service ID and check if that service started before or not.
            $service_id = $this->getId("service", $username, $servicename, $wkey, $defaultparam);
            $sql = "SELECT service_id FROM service_run where wkey='$wkey' and service_id='$service_id';";
            $s_id = $this->queryAVal($sql);
            #If service hasn't started before, add the service info to service_run table.
           
             if ($s_id==0) {
                // sql query for INSERT INTO service_run
                $sql = "INSERT INTO `service_run` (`service_id`, `wkey`, `input`,`result`, `start_time`) VALUES ('$service_id', '$wkey', '', '0', now())";
                $this->runSQL($sql); 
             }
             $command = $this->getCommand($servicename, $username, $inputcommand, $defaultparam);
             $ipf = "";
             if ($inputparam != "" && $inputparam != "None") 
                 $ipf = "-i \"$inputparam\"";
             $dpf = "";
             if ($defaultparam != "" && $defaultparam != "None")
                 $dpf = "-p $defaultparam";
                    
             $edir = $this->tool_path;
             $com = $this->python . " " . $edir . "/runService.py -f ".$this->config." -d " . $this->dbhost . " $ipf $dpf -o $outdir -u $username -k $wkey -c \"$command\" -n $servicename -s $servicename";
             $retval = $this->sysback($this->getCMDs($com));
                  
             if (preg_match('/Error/', $retval)) {
                 return "ERROR: $retval";
             }
             return "RUNNING(2):$inputcommand";
        } else {
             return $wf;
        }
      }
      return $result_stat;
    }
    
    function checkLastServiceJobs($wkey)
    {
        $sql    = "SELECT username, job_num from jobs where service_id=(SELECT service_id FROM service_run where wkey='$wkey' order by service_run_id desc limit 1)  and wkey='$wkey';";
        $result = $this->runSQL($sql);
        #Get how many jobs hasn't finished
        $ret    = 1;
        return $ret;
        if (is_object($result)) {
            while ($row = $result->fetch_row()) {
                $username = $row[0];
                $jobnum   = $row[1];
                $retval   = $this->checkJobInCluster($wkey, $jobnum, $username);
                if (preg_match('/^EXIT/', $retval)) {
                    $ret = 0;
                }
            }
        }
        return $ret;
    }
    function endWorkflow($params)
    {
        $wkey=$params['wkey'];
        $sql    = "update workflow_run set result='1', end_time=now() where wkey='$wkey'";
        $result = $this->runSQL($sql);
        $sql    = "update ngs_runparams set run_status='1' where wkey='$wkey'";
        $result = $this->runSQL($sql);
        #return $sql;
        return "Success!!!";
        $sql1    = "SELECT sum(w.result) from (SELECT result from workflow_services ws left join service_run s on ws.service_id=s.service_id where ws.workflow_id=(SELECT workflow_id FROM workflow_run wr where wkey='$wkey') and wkey='$wkey') w";
        $result1 = $this->runSQL($sql1);
        #Get how many service successfuly finished
        if (is_object($result1) && $row1 = $result1->fetch_row()) {
            #Get how many services exist in the workflow
            $sql2    = "SELECT count(*) from workflow_services ws where workflow_id=(SELECT workflow_id FROM workflow_run wr where wkey='$wkey')";
            $result2 = $this->runSQL($sql2);
            if (is_object($result2) && $row2 = $result2->fetch_row()) {
                
                if ($row1[0] >= $row2[0]) {
                    $sql    = "update workflow_run set result='1', end_time=now() where wkey='$wkey'";
                    $result = $this->runSQL($sql);
                    #return $sql;
                    return "Success!!!";
                } else {
                    # if non of the last service jobs are running in the cluster.
                    # exit and give an error
                    if (!$this->checkLastServiceJobs($wkey)) {
                        return "ERROR: Workflow couldn't sucessfully completed. Please check the results!!!\n";
                    }
                }
            }
            
        }
        #return "$sql1 :::: $sql2";
        return "WRUNNING";
        
    }
    #Insert a job to the database
    function insertJob($params)
    {
        $username=$params['username']; 
        $wkey=$params['wkey'];
        $com=$params['com'];
        $jobname=$params['jobname'];
        $servicename=$params['servicename']; 
        $jobnum=$params['jobnum'];
        $result=$params['result'];
 
        $workflow_id = $this->getWorkflowId($wkey);
        $service_id  = $this->getId("service", $username, $servicename, $wkey, "");
        
        $sql = "insert into jobs(`username`, `wkey`, `run_script`, `jobname`, `workflow_id`, `service_id`, `result`, `submit_time`, `job_num`) values ('$username','$wkey','$com','$jobname','$workflow_id','$service_id', '$result', now(), '$jobnum')";
        
        $res = $this->runSQL($sql);
        
        return $res;
    }
    
    #Update a job to the database
    function updateJob($params)
    {
        $username=$params['username']; 
        $wkey=$params['wkey'];
        $jobname=$params['jobname'];
        $servicename=$params['servicename']; 
        $field=$params['field']; 
        $jobnum=$params['jobnum'];
        $result=$params['result'];
        if ($result == 0) {
            $sql = "UPDATE ngs_runparams set run_status=3 where wkey='$wkey'";
            $this->runSQL($sql);
        }
        $workflow_id = $this->getWorkflowId($wkey);
        $service_id  = $this->getId("service", $username, $servicename, $wkey, "");
        
        $sql = "update jobs set `$field`=now(), `result`='$result' where `wkey`='$wkey' and `job_num`='$jobnum'";
        
        $res = $this->runSQL($sql);
        return $res . ":" . $sql;
    }
    
    #Check if all jobs are finished or not for a service
    function checkAllJobsFinished($params)
    {
        $username=$params['username']; 
        $wkey=$params['wkey'];
        $servicename=$params['servicename']; 
    
        $workflow_id = $this->getWorkflowId($wkey);
        $service_id  = $this->getId("service", $username, $servicename, $wkey, "");
        $select      = "select count(job_id) c from jobs ";
        $where1      = " where `username`= '$username' and `wkey`='$wkey' and `workflow_id`='$workflow_id' and `service_id`='$service_id' and `jobstatus`=1";
        $where2      = " and `result`=3";
        $sql         = "select s1.c, s2.c from ( $select  $where1) s1,  ($select  $where1 $where2) s2";
        $result      = $this->runSQL($sql);
        #Get how many service successfuly finished
        if (is_object($result) && $row = $result->fetch_row()) {
            $s1 = $row[0];
            $s2 = $row[1];
            
            if ($s1 == $s2) {
                $res = $this->updateService($wkey, $service_id, 1);
            } else {
                $res = "Should be still running 1 [$s1:$s2]\n[$sql]";
            }
        } else {
            $res = "Should be still running 2 \n [$sql]";
        }
        return $res;
    }
    function updateService($wkey, $service_id, $result)
    {
        $sql = "update service_run set `end_time`=now(), `result`='$result' where `wkey`='$wkey' and `service_id`='$service_id'";
        $res = $this->runSQL($sql);
        
        return $res;
    }
    #Insert a job output to the database
    function insertJobOut($params)
    {
        $username=$params['username']; 
        $wkey=$params['wkey'];
        $jobnum=$params['jobnum']; 
        $jobout=$params['jobout']; 
        
        $sql = "insert into jobsout(`username`, `wkey`, `jobnum`, `jobout`) values ('$username','$wkey','$jobnum','$jobout')";
        $res = $this->runSQL($sql);
        
        return $res;
    }
    
    #Insert a job output to the database
    function insertJobStats($params)
    {
        $username=$params['username']; 
        $wkey=$params['wkey'];
        $jobnum=$params['jobnum']; 
        $stats=$params['stats']; 
        $stats = json_decode($stats, true);
        
        $sql = "select id from jobstats where wkey='$wkey' and jobnum='$jobnum' and username='$username'";
        $res = $this->queryAVal($sql);
        if ($res > 0) {
            $sql = "update jobstats set `cputime`=" . $stats['CPU time'] . ", `maxmemory`=" . $stats['Max Memory'] . ",
                 `averagememory`=" . $stats['Average Memory'] . ",`totalrequested`=" . $stats['Total Requested Memory'] . ", `deltamemory`=" . $stats['Delta Memory'] . ",
                 `maxprocess`=" . $stats['Max Processes'] . ", `maxthreads`=" . $stats['Max Threads'] . ", `date_created` = now()
                 where wkey='$wkey' and jobnum='$jobnum' and username='$username'";
        } else {
            $sql = "insert into jobstats(`username`, `wkey`, `jobnum`, `cputime`, `maxmemory`, `averagememory`,`totalrequested`, `deltamemory`, `maxprocess`, `maxthreads`, `date_created`)
                         values ('$username','$wkey','$jobnum', " . $stats['CPU time'] . ", " . $stats['Max Memory'] . ", " . $stats['Average Memory'] . "," . $stats['Total Requested Memory'] . ", " . $stats['Delta Memory'] . ", " . $stats['Max Processes'] . ", " . $stats['Max Threads'] . ", now() )";
        }
        $res = $this->runSQL($sql);
        
        return $res;
    }
    #get job numbers
    function getJobNums($params)
    {
        $wkey=$params['wkey'];
        $sql = "select job_num from jobs where wkey='$wkey'";
        return $this->queryTable($sql);
    }

    /** updates run params table sets the status to 2   
     *
     * @return string Response
     */
     function updateRunParams($params)
     {
         $wkey        = $params['wkey'];
         $runparamsid = $params['runparamsid'];
         $res=0;
         if ($runparamsid>0)
         {
           $sql = "UPDATE ngs_runparams set run_status=2, wkey='$wkey' where id=$runparamsid";
           $res = $this->runSQL($sql);
         }

         return $res;
     }

    /** inserts report table to db                   
     *
     * @return string Response
     */
     function insertReportTable($params)
     {
         $wkey=$params['wkey'];
         $version= $params['version']; 
         $type=$params['type'];
         $file=$params['file'];

         $sql = "select id from report_list where wkey='$wkey' and file='$file'";
         $res = $this->queryAVal($sql);
         if ($res == 0) {
            $sql = "INSERT INTO report_list(wkey, version, type, file) VALUES ('$wkey', '$version', '$type', '$file')";
            $res = $this->runSQL($sql);
         } else {
            $res=1;
         }
         return $res;
     }
     
     function checkJob($params)
     {
          $jobname=$params['jobname'];
          $wkey=$params['wkey']; 
         
          $res="DONE"; 
          $sql = "select job_num from jobs where wkey='$wkey' and jobname='$jobname'";
          $jobnum = $this->queryAVal($sql);
          if ($jobnum == 0) # This job is most likely running. Just check if it is real running or not.
          {
             $res="START";
          }

          $res = '{"Result":"'.$res.'"}'; 
          return $res;
     
     }

      /** getJob Parameters for a submission
      *
      * @return string Response
      */

      function getJobParams($params)
      { 
          $servicename=$params['servicename'];
          $name=$params['name'];
          $wkey=$params['wkey']; 
          $libname=preg_replace("/".$servicename."/", "", $name);
          $predvals = $this->getPredVals($libname, $servicename);
             
          #$res = '{"'.$servicename.'":"'.$libname.':'.$wkey.'"}'; 
          $res = '{"'.$predvals.'"}'; 
          return $res;
      }
      private function getPredVals($libname, $servicename) 
      {
         
          $predvals = $servicename.'":"'.$libname; 
          $totalreads=0;
          if ($servicename == "stepCheck")
          {
	     $sql="SELECT DISTINCT total_reads FROM ngs_temp_sample_files where file_name like '%$libname%';";
             $totalreads = $this->queryAVal($sql);
             if ($totalreads==0)
             {
	       $sql="SELECT DISTINCT total_reads FROM ngs_temp_lane_files where file_name like '%$libname%';";
               $totalreads = $this->queryAVal($sql);
             }
          }
          else
          {
             $sql="SELECT DISTINCT total_reads FROM ngs_fastq_files nff, ngs_samples ns where ns.id=nff.sample_id and ns.samplename='$libname';";
             $totalreads = $this->queryAVal($sql);
          }
          $sql="SELECT field2, floor(a + abs(x)*$totalreads) val  from predjob p where p.set='$servicename'";
          $res=$this->queryTable($sql); 
          if (isset($res) && isset($res[0]) && isset($res[1]))
          {
            return join($res[0], "\":\"")."\", \"".join($res[1], "\":\"");
          }
          return "cputime\":\"240\",\"maxmemory\":\"4096";
      }

}
?>