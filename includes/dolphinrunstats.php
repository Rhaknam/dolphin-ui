                <!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Dolphin Run Details
                        <small>Plot Samples</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="index.php"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="index.php"></a>Usage Reports</li>
                        <li class="active">Dolphin Runs</li>
                    </ol>
                </section>

                <!-- Main content -->
                <section class="content">

                    <div class="row">
                        <div class="col-md-6">
                            <!-- BAR CHART -->
                            <div class="box box-success">
                                <div class="box-header">
                                    <h3 class="box-title">Daily Dolphin Usage</h3>
                                </div>
                                <div class="box-body chart-responsive">
                                    <div class="chart" id="daily-bar-chart" style="height: 300px;"></div>
                                </div><!-- /.box-body -->
                            </div><!-- /.box -->
                            <?php echo $ui->getBoxTable("User", "Dolphin", "<th>Name</th><th>Lab</th><th>Count</th>"); ?>
                            <?php echo $ui->getBoxTable("Tool", "Dolphin", "<th>Tool Name</th><th>Count</th>"); ?>
                        </div><!-- /.col (LEFT) -->
                        <div class="col-md-6">
                            <!-- BAR CHART -->
                            <div class="box box-success">
                                <div class="box-header">
                                    <h3 class="box-title">Top 20 Dolphin Users</h3>
                                    <!-- tools box -->
                                    <div class="pull-right box-tools">
                                        <button class="btn btn-primary btn-sm daterange pull-right" data-toggle="tooltip" title="Date range"><i class="fa fa-calendar"></i></button>
                                    </div><!-- /. tools -->
                                </div>
                                <div class="box-body chart-responsive">
                                    <div class="chart" id="top-users-bar-chart" style="height: 300px;"></div>
                                </div><!-- /.box-body -->
                            </div><!-- /.box -->
                            <?php echo $ui->getBoxTable("Lab", "Dolphin", "<th>Lab</th><th>Count</th>"); ?>
                            <?php echo $ui->getBoxTable("Job", "Dolphin", "<th>Service Name</th><th>The # of Submitted Jobs</th>"); ?>
                        </div><!-- /.col (RIGHT) -->
                    </div><!-- /.row -->

                </section><!-- /.content -->
