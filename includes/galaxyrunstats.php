                <!-- Content Header (Page header) -->
                <section class="content-header">
                    <h1>
                        Galaxy Run Details
                        <small>Plot Samples</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="index.php"><i class="fa fa-dashboard"></i> Home</a></li>
                        <li><a href="index.php"></a>Usage Reports</li>
                        <li class="active">Galaxy Runs</li>
                    </ol>
                </section>

                <!-- Main content -->
                <section class="content">

                    <div class="row">
                        <div class="col-md-6">
                            <!-- BAR CHART -->
                            <div class="box box-success">
                                <div class="box-header">
                                    <h3 class="box-title">Daily Galaxy Usage</h3>
                                </div>
                                <div class="box-body chart-responsive">
                                    <div class="chart" id="daily-bar-chart" style="height: 300px;"></div>
                                </div><!-- /.box-body -->
                            </div><!-- /.box -->
                             <?php echo $ui->getBoxTable("User", "Galaxy", "<th>Name</th><th>Lab</th><th>Count</th>"); ?>
                             <?php echo $ui->getBoxTable("Tool", "Galaxy", "<th>Tool Name</th><th>Count</th>"); ?>
                        </div><!-- /.col (LEFT) -->
                        <div class="col-md-6">
                            <!-- BAR CHART -->
                            <div class="box box-success">
                                <div class="box-header">
                                    <h3 class="box-title">Top 20 Galaxy Users</h3>
                                    <!-- tools box -->
                                    <div class="pull-right box-tools">
                                        <button class="btn btn-primary btn-sm daterange pull-right" data-toggle="tooltip" title="Date range"><i class="fa fa-calendar"></i></button>
                                    </div><!-- /. tools -->
                                </div>
                                <div class="box-body chart-responsive">
                                    <div class="chart" id="top-users-bar-chart" style="height: 300px;"></div>
                                </div><!-- /.box-body -->
                            </div><!-- /.box -->
                            <?php echo $ui->getBoxTable("Lab", "Galaxy", "<th>Lab</th><th>Count</th>"); ?>

                        </div><!-- /.col (RIGHT) -->
                    </div><!-- /.row -->

                </section><!-- /.content -->
