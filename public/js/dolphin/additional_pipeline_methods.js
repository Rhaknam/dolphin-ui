var pipelineDict = ['RNASeqRSEM', 'Tophat', 'ChipSeq/ATACSeq', 'DESeq', 'BisulphiteMapping', 'DiffMeth', 'HaplotypeCaller'];
var pipelineNum = 0;

function additionalPipes(){
	//ADDITIONAL PIPE DROPDOWN OPTIONS
	TYPE_OPTIONS =  [
					'id',
					'class',
					'onchange',
					'OPTION_DIS_SEL',
					'OPTION',		//RNASeqRSEM
					'OPTION',		//Tophat
					'OPTION',		//ChipSeq/ATACSeq
					'OPTION',		//DESeq
					'OPTION',		//BisulphiteMapping
					'OPTION',		//DiffMeth
					'OPTION',		//HaplotypeCaller
					]
	VALUE_OPTIONS = [
					'select_'+pipelineNum,
					'form-control',
					'pipelineSelect('+pipelineNum+')',
					'--- Select a Pipeline ---',
					pipelineDict[0],		//RNASeqRSEM
					pipelineDict[1],		//Tophat
					pipelineDict[2],		//ChipSeq/ATACSeq
					pipelineDict[3],		//DESeq
					pipelineDict[4],		//BisulphiteMapping
					pipelineDict[5],		//DiffMeth
					pipelineDict[6],		//HaplotypeCaller
					]
	//find parent div
	var master = document.getElementById('masterPipeline');
	//create children divs/elements
	var outerDiv = createElement('div', ['id', 'class', 'style'], ['BOXAREA_'+pipelineNum, 'callout callout-info margin', 'display:""']);
	var innerDiv = document.createElement( 'div' );
	//attach children to parent
	innerDiv.appendChild( createElement('select',
					TYPE_OPTIONS,
					VALUE_OPTIONS));
	innerDiv.appendChild( createElement('div', ['id'], ['select_child_'+pipelineNum]));
	outerDiv.appendChild( innerDiv );
	outerDiv.appendChild( createElement('input', ['id', 'type', 'class', 'style', 'value', 'onclick'],
					['removePipe_'+pipelineNum, 'button', 'btn btn-primary', 'display:""', 'Remove Pipeline',
					'removePipes('+pipelineNum+')']));
	//attach to master
	master.appendChild( outerDiv );
	pipelineNum = pipelineNum + 1;
}

function pipelineSelect(num){
	//Initialize variables
	var chip_table
	//Grab some useful variables
	var pipeType = document.getElementById('select_'+num).value;
	console.log(pipeType);
	var divAdj = createElement('div', ['id', 'class', 'style'], ['select_child_'+num, 'input-group margin col-md-11', 'float:left']);
	console.log(currentPipelineVal);
	//Check for only one RSEM/DESeq dependencies
	if (pipelineSelectCheck(num, pipeType)){
		document.getElementById('select_'+num).value = currentPipelineVal[currentPipelineID.indexOf(num)];
	}else{
		console.log(pipeType)
		//pipelineDict: global variable containing selections
		if (pipeType == pipelineDict[0]) {
			//RNASeq RSEM
			divAdj = formRSEM(divAdj, num)
		}else if (pipeType == pipelineDict[1]) {
			//Tophat Pipeline
			divAdj = formTophat(divAdj, num)
		}else if (pipeType == pipelineDict[2] || pipeType == 'ChipSeq') {
			//ChipSeq Pipeline
			divAdj, chip_table = formChip(divAdj, num)
		}else if (pipeType == pipelineDict[3]) {
			//DESEQ
			divAdj = formDESeq(divAdj, num)
		}else if (pipeType == pipelineDict[4]) {
			//BisulphiteMapping
			divAdj = formBisulphiteMapping(divAdj, num)
		}else if (pipeType == pipelineDict[5]) {
			//DiffMeth
			divAdj = formDiffMeth(divAdj, num)
		}else if (pipeType == pipelineDict[6]) {
			//HaplotypeCaller
			divAdj = formHaplotypeCaller(divAdj, num)
		}
		//replace div
		$('#select_child_'+num).replaceWith(divAdj);
		if (pipeType == pipelineDict[3]) {
			for (var x = 0; x < deseqList.length; x++) {
				var opt = createElement('option', ['id', 'value'], [deseqList[x], deseqList[x]]);
				opt.innerHTML = deseqList[x];
				document.getElementById('select_5_'+num).appendChild(opt);
			}
		}
		//MULTI-SELECT
		if (document.getElementById('multi_select_1_'+num) != null) {
			var sample_names = getSampleNames(selected_samples.toString());
			console.log(sample_names);
			for(var x = 0; x < sample_names.length; x++){
					document.getElementById('multi_select_1_'+num).appendChild(createElement('option', ['id', 'value'], [num+'_1_'+sample_names[x], sample_names[x]]));
					document.getElementById(num+'_1_'+sample_names[x]).innerHTML = sample_names[x]
					document.getElementById('multi_select_2_'+num).appendChild(createElement('option', ['id', 'value'], [num+'_2_'+sample_names[x], sample_names[x]]));
					document.getElementById(num+'_2_'+sample_names[x]).innerHTML = sample_names[x]
			}
		}
		if (chip_table != undefined) {
			var chip_data_table = $('#json_chiptable').dataTable();
			document.getElementById('json_chiptable').style.width = "";
			populateChipSelection();
		}
		//adjust global pipeline counter
		if (currentPipelineID.indexOf(num) == -1) {
			currentPipelineID.push(num);
			currentPipelineVal.push(pipeType);
		}
		else if (currentPipelineID.indexOf(num) != -1 && currentPipelineVal.indexOf(currentPipelineID.indexOf(num)) != pipeType)
		{
			currentPipelineVal[currentPipelineID.indexOf(num)] = pipeType;
		}
	}
}

function IGVTDFSelection(id){
	var value = document.getElementById(id).value;
	var id_num = id.split("_")[2];
	console.log(id_num);
	if (value == 'yes') {
		document.getElementById('label_1_'+id_num).setAttribute("style", "display:show");
		document.getElementById('textarea_2_'+id_num).setAttribute("style", "display:show");
	}else{
		document.getElementById('label_1_'+id_num).setAttribute("style", "display:none");
		document.getElementById('textarea_2_'+id_num).setAttribute("style", "display:none");
		document.getElementById('textarea_2_'+id_num).value = 0;
	}
}

function bigwigSelection(id){
	var value = document.getElementById(id).value;
	var id_num = id.split("_")[2];
	console.log(id_num);
	var label1 = document.getElementById('label_5_'+id_num)
	var textarea1 = document.getElementById('checkbox_6_'+id_num)
	if (value == 'yes') {
		label1.setAttribute("style", "display:show");
		textarea1.setAttribute("style", "display:show");
	}else{
		label1.setAttribute("style", "display:none");
		textarea1.setAttribute("style", "display:none");
		textarea1.value = 0;
	}
}

function deeptoolsSelect(id){
	$('#errorModal').modal({
		show: true
	});
	document.getElementById('errorLabel').innerHTML ='You must first add a MCall before adding MethylKit';
	document.getElementById('errorAreas').innerHTML = '';
	var check = document.getElementById(id);
	check.checked = !check.checked;
	/**
	var checked = document.getElementById(id).checked;
	var id_num = id.split("_")[2];
	console.log(id_num);
	var label1 = document.getElementById('label_6_'+id_num)
	var select1 = document.getElementById('select_3_'+id_num)
	var label2 = document.getElementById('label_7_'+id_num)
	var select2 = document.getElementById('select_4_'+id_num)
	if (checked) {
		label1.setAttribute("style", "display:show");
		select1.setAttribute("style", "display:show");
		if (select1.value == 'reference-point') {
			label2.setAttribute("style", "display:show");
			select2.setAttribute("style", "display:show");
		}
	}else{
		label1.setAttribute("style", "display:none");
		select1.setAttribute("style", "display:none");
		label2.setAttribute("style", "display:none");
		select2.setAttribute("style", "display:none");
	}
	*/
}

function referenceSelect(id){
	/**
	var value = document.getElementById(id).value;
	var id_num = id.split("_")[2];
	console.log(id_num);
	var label1 = document.getElementById('label_7_'+id_num)
	var textarea1 = document.getElementById('select_4_'+id_num)
	if (value == 'reference-point') {
		label1.setAttribute("style", "display:show");
		textarea1.setAttribute("style", "display:show");
	}else{
		label1.setAttribute("style", "display:none");
		textarea1.setAttribute("style", "display:none");
		textarea1.value = 0;
	}
	*/
}

function formRSEM(divAdj, num){
	divAdj.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title', 'RSEM parameters:']));
	var testText = createElement('textarea', ['id', 'class'], ['textarea_'+num,'form-control'])
	testText.value = '--bowtie-e 70 --bowtie-chunkmbs 100';
	divAdj.appendChild( testText );
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['margin', 'Mark Duplicates:']),
			createElement('input', ['id', 'type', 'class', 'onclick'], ['checkbox_1_'+num, 'checkbox', 'margin'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title margin', 'RNA-Seq QC:']),
			   createElement('input', ['id', 'type', 'class'], ['checkbox_2_'+num, 'checkbox', 'margin'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title margin', 'No Genome BAM:']),
			   createElement('input', ['id', 'type', 'class'], ['checkbox_3_'+num, 'checkbox', 'margin'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'IGV/TDF Conversion:']),
			   createElement('select', ['id','class','onChange','OPTION', 'OPTION'], ['select_1_'+num, 'form-control', 'IGVTDFSelection(this.id)','no', 'yes'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'BigWig Conversion:']),
			   createElement('select', ['id', 'class', 'onChange', 'OPTION', 'OPTION'], ['select_2_'+num, 'form-control', 'bigwigSelection(this.id)', 'no', 'yes'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_1_'+num, 'box-title', 'display:none', 'extFactor']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_2_'+num, 'form-control', 'text', 'display:none', '0'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_5_'+num, 'box-title margin', 'Create Deeptools plots:', 'display:none']),
			   createElement('input', ['id', 'type', 'class', 'style', 'onClick'], ['checkbox_6_'+num, 'checkbox', 'margin', 'display:none', 'deeptoolsSelect(this.id)'])] ]);
	divAdj = mergeTidy(divAdj, 7,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_6_'+num, 'box-title', 'display:none', 'Plot Type:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'onChange'], ['select_3_'+num, 'form-control', 'display:none', 'scale-regions', 'reference-point', 'referenceSelect(this.id)'])],
			[createElement('label', ['id', 'class','style', 'TEXTNODE'], ['label_7_'+num, 'box-title', 'display:none', 'Reference Point:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'OPTION'], ['select_4_'+num, 'form-control', 'display:none', 'TSS', 'TES', 'center'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title margin', 'Custom Options']),
			createElement('input', ['id', 'type', 'class', 'onClick'], ['checkbox_5_'+num, 'checkbox', 'margin', 'tophatCustomOptions('+num+')'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_3_'+num, 'box-title', 'display:none', 'Custom Genome File Path and Index']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_3_'+num, 'form-control', 'text', 'display:none', 'None'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_4_'+num, 'box-title', 'display:none', 'Custom Genome Annotation File (Full Path)']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_4_'+num, 'form-control', 'text', 'display:none', 'None'])] ]);
	return divAdj;
}

function reloadRSEM(splt1, i){
	additionalPipes();
	document.getElementById('select_'+i).value = pipelineDict[0];
	pipelineSelect(i);
	document.getElementById('textarea_'+i).value = splt1[i].Params;
	document.getElementById('select_1_'+i).value = splt1[i].IGVTDF;
	document.getElementById('select_2_'+i).value = splt1[i].BAM2BW;
	if (splt1[i].IGVTDF == 'yes') {
		IGVTDFSelection('select_1_'+i);
		document.getElementById('textarea_2_'+i).value = splt1[i].ExtFactor;
	}
	if (splt1[i].BAM2BW == 'yes') {
		bigwigSelection('select_2_'+i)
		if (splt1[i].Deeptools == 'yes') {
			document.getElementById('checkbox_6_'+i).checked = true;
			deeptoolsSelect('checkbox_6_'+i)
			if (splt1[i].PlotType == 'reference-point') {
				document.getElementById('select_3_'+i).value = splt1[i].PlotType
				referenceSelect('select_3_'+i)
				document.getElementById('select_4_'+i).value = splt1[i].ReferencePoint
			}
		}
	}
	if (splt1[i].MarkDuplicates == 'yes' || splt1[i].MarkDuplicates == '1') {
		document.getElementById('checkbox_1_'+i).checked = true;
	}
	if (splt1[i].RSeQC == 'yes' || splt1[i].RSeQC == '1') {
		document.getElementById('checkbox_2_'+i).checked = true;
	}
	if (splt1[i].NoGenomeBAM == 'yes' || splt1[i].NoGenomeBAM == '1') {
		document.getElementById('checkbox_3_'+i).checked = true;
	}
	if (splt1[i].CustomGenomeIndex != 'None' || splt1[i].CustomGenomeAnnotation != 'None') {
		tophatCustomOptions(i);
		document.getElementById('checkbox_5_'+i).checked = true;
		document.getElementById('textarea_3_'+i).value = splt1[i].CustomGenomeIndex;
		document.getElementById('textarea_4_'+i).value = splt1[i].CustomGenomeAnnotation;
	}
}

function formTophat(divAdj, num){
	divAdj.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title', 'Tophat parameters:']));
	divAdj.appendChild( createElement('textarea', ['id', 'class'], ['textarea_'+num, 'form-control']));
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['margin', 'Mark Duplicates']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_4_'+num, 'checkbox', 'margin'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title margin', 'RNA-Seq QC:']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_1_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['margin', 'Collect RNA Metrics']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_2_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['margin', 'Collect Multiple Picard Metrics']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_3_'+num, 'checkbox', 'margin'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'IGV/TDF Conversion:']),
			   createElement('select', ['id','class','onChange','OPTION', 'OPTION'], ['select_1_'+num, 'form-control', 'IGVTDFSelection(this.id)','no', 'yes'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'BigWig Conversion:']),
			   createElement('select', ['id', 'class', 'onChange', 'OPTION', 'OPTION'], ['select_2_'+num, 'form-control', 'bigwigSelection(this.id)', 'no', 'yes'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_1_'+num, 'box-title', 'display:none', 'extFactor']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_2_'+num, 'form-control', 'text', 'display:none', '0'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_5_'+num, 'box-title margin', 'Create Deeptools plots:', 'display:none']),
			   createElement('input', ['id', 'type', 'class', 'style', 'onClick'], ['checkbox_6_'+num, 'checkbox', 'margin', 'display:none', 'deeptoolsSelect(this.id)'])] ]);
	divAdj = mergeTidy(divAdj, 7,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_6_'+num, 'box-title', 'display:none', 'Plot Type:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'onChange'], ['select_3_'+num, 'form-control', 'display:none', 'scale-regions', 'reference-point', 'referenceSelect(this.id)'])],
			[createElement('label', ['id', 'class','style', 'TEXTNODE'], ['label_7_'+num, 'box-title', 'display:none', 'Reference Point:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'OPTION'], ['select_4_'+num, 'form-control', 'display:none', 'TSS', 'TES', 'center'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title margin', 'Custom Options']),
			createElement('input', ['id', 'type', 'class', 'onClick'], ['checkbox_5_'+num, 'checkbox', 'margin', 'tophatCustomOptions('+num+')'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_3_'+num, 'box-title', 'display:none', 'Custom Genome File Path and Index']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_3_'+num, 'form-control', 'text', 'display:none', 'None'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_4_'+num, 'box-title', 'display:none', 'Custom Genome Annotation File (Full Path)']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_4_'+num, 'form-control', 'text', 'display:none', 'None'])] ]);
	return divAdj;
}

function reloadTophat(splt1, i){
	additionalPipes();
	document.getElementById('select_'+i).value = pipelineDict[1];
	pipelineSelect(i);
	document.getElementById('textarea_'+i).value = splt1[i].Params;
	document.getElementById('select_1_'+i).value = splt1[i].IGVTDF;
	document.getElementById('select_2_'+i).value = splt1[i].BAM2BW;
	if (splt1[i].IGVTDF == 'yes') {
		IGVTDFSelection('select_1_'+i);
		document.getElementById('textarea_2_'+i).value = splt1[i].ExtFactor;
	}
	if (splt1[i].BAM2BW == 'yes') {
		bigwigSelection('select_2_'+i)
		if (splt1[i].Deeptools == 'yes') {
			document.getElementById('checkbox_6_'+i).checked = true;
			deeptoolsSelect('checkbox_6_'+i)
			if (splt1[i].PlotType == 'reference-point') {
				document.getElementById('select_3_'+i).value = splt1[i].PlotType
				referenceSelect('select_3_'+i)
				document.getElementById('select_4_'+i).value = splt1[i].ReferencePoint
			}
		}
	}
	if (splt1[i].RSeQC == 'yes' || splt1[i].RSeQC == '1') {
		document.getElementById('checkbox_1_'+i).checked = true;
	}
	if (splt1[i].CollectRnaSeqMetrics == 'yes' || splt1[i].CollectRnaSeqMetrics == '1') {
		document.getElementById('checkbox_2_'+i).checked = true;
	}
	if (splt1[i].CollectMultipleMetrics == 'yes' || splt1[i].CollectMultipleMetrics == '1') {
		document.getElementById('checkbox_3_'+i).checked = true;
	}
	if (splt1[i].MarkDuplicates == 'yes' || splt1[i].MarkDuplicates == '1') {
		document.getElementById('checkbox_4_'+i).checked = true;
	}
	if (splt1[i].CustomGenomeIndex != 'None' || splt1[i].CustomGenomeAnnotation != 'None') {
		tophatCustomOptions(i);
		document.getElementById('checkbox_5_'+i).checked = true;
		document.getElementById('textarea_3_'+i).value = splt1[i].CustomGenomeIndex;
		document.getElementById('textarea_4_'+i).value = splt1[i].CustomGenomeAnnotation;
	}
}

function tophatCustomOptions(num){
	if (document.getElementById('label_3_'+num).style.display == 'none') {
		document.getElementById('label_3_'+num).style.display = 'block';
		document.getElementById('textarea_3_'+num).style.display = 'block';
		document.getElementById('label_4_'+num).style.display = 'block';
		document.getElementById('textarea_4_'+num).style.display = 'block';
	}else{
		document.getElementById('label_3_'+num).style.display = 'none';
		document.getElementById('textarea_3_'+num).style.display = 'none';
		document.getElementById('textarea_3_'+num).value = 'None';
		document.getElementById('label_4_'+num).style.display = 'none';
		document.getElementById('textarea_4_'+num).style.display = 'none';
		document.getElementById('textarea_4_'+num).value = 'None';
	}
}

function formChip(divAdj, num){
	divAdj = mergeTidy(divAdj, 12,
			[[createLabeledDiv(12, 'CHIP&nbsp;&nbsp;', '&nbsp;&nbsp;ATAC',
				createElement('input', ['id', 'name', 'type', 'value', 'onclick', 'checked'], [num+'_CHIP', num, 'radio', 'CHIP', 'chipTypeSelection(this)']),
				createElement('input', ['id', 'name', 'type', 'value', 'onclick'], [num+'_ATAC', num, 'radio', 'ATAC', 'chipTypeSelection(this)']))
			]])
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_4_'+num, '', 'ATAC Options:', 'display:none'])],
			[createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_3_'+num, 'margin', 'Adjust cut-site centered reads', 'display:none']),
			createElement('input', ['id', 'type', 'class', 'style'], ['checkbox_3_'+num, 'checkbox', 'margin', 'display:none'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Input Definitions:'])],
			[createElement('div', ['id', 'class'], ['div_chip_'+num, ''])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Samples:']),
			createElement('select',['id', 'class', 'type', 'multiple', 'size'],['multi_chip_1', 'form-control', 'select-multiple', 'multiple', '4'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Inputs:']),
			createElement('select',['id', 'class', 'type', 'multiple', 'size', 'onchange'],['multi_chip_2', 'form-control', 'select-multiple', 'multiple', '4', ''])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('button', ['id', 'value', 'type', 'class', 'onclick'], ['div_add', 'Add Input', 'button', 'btn btn-primary pull-left margin', 'addChipSeqInput('+num+')']),
			createElement('button', ['id', 'value', 'type', 'class', 'onclick'], ['div_add', 'Add All', 'button', 'btn btn-primary pull-left margin', 'smartAdd()']),
			createElement('button', ['id', 'value', 'type', 'class', 'onclick'], ['div_rmv', 'Reset', 'button', 'btn btn-danger pull-right margin', 'resetChip()'])] ]);
	//	Table
	var chip_table = createElement('table', ['id', 'class'], ['json_chiptable', 'table table-hover table-striped table-condensed table-scrollable'])
		chip_table.innerHTML = "<thead><tr><th>Name</th><th>Sample</th><th>Inputs</th><th>Remove</th></tr></thead><tbody></tbody>";
	divAdj.appendChild(chip_table);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class', 'TEXTNODE'], ['label_2_'+num, 'box-title', 'MACS parameters:']),
			   createElement('textarea', ['id', 'class'], ['textarea_1_'+num, 'form-control'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Multimapper:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_1_'+num, 'form-control', 'text', '1'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Tag size(bp) for MACS:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_2_'+num, 'form-control', 'text', '75'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Band width(bp) for MACS:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['select_1_'+num, 'form-control', 'text', '230'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Effective genome size(bp):']),
			createElement('input', ['id', 'class', 'type', 'value'], ['select_2_'+num, 'form-control', 'text', '2700000000'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['margin', 'Mark Duplicates:']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_2_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['margin', 'Collect Multiple Picard Metrics:']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_1_'+num, 'checkbox', 'margin'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'IGV/TDF Conversion:']),
			   createElement('select', ['id','class','onChange','OPTION', 'OPTION'], ['select_5_'+num, 'form-control', 'IGVTDFSelection(this.id)','no', 'yes'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'BigWig Conversion:']),
			   createElement('select', ['id', 'class', 'onChange', 'OPTION', 'OPTION'], ['select_6_'+num, 'form-control', 'bigwigSelection(this.id)', 'no', 'yes'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_1_'+num, 'box-title', 'display:none', 'extFactor']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_2_'+num, 'form-control', 'text', 'display:none', '0'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_5_'+num, 'box-title margin', 'Create Deeptools plots:', 'display:none']),
			   createElement('input', ['id', 'type', 'class', 'style', 'onClick'], ['checkbox_6_'+num, 'checkbox', 'margin', 'display:none', 'deeptoolsSelect(this.id)'])] ]);
	divAdj = mergeTidy(divAdj, 7,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_6_'+num, 'box-title', 'display:none', 'Plot Type:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'onChange'], ['select_3_'+num, 'form-control', 'display:none', 'scale-regions', 'reference-point', 'referenceSelect(this.id)'])],
			[createElement('label', ['id', 'class','style', 'TEXTNODE'], ['label_7_'+num, 'box-title', 'display:none', 'Reference Point:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'OPTION'], ['select_4_'+num, 'form-control', 'display:none', 'TSS', 'TES', 'center'])] ]);
	return divAdj, chip_table
}

function reloadChip(splt1, i){
	additionalPipes();
	document.getElementById('select_'+i).value = pipelineDict[2];
	pipelineSelect(i);
	//Chip Input Table
	var check = document.getElementById(i.toString() + "_" + splt1[i].MacsType);
	var icheck = $("#" + i.toString() + "_" + splt1[i].MacsType)
	icheck.iCheck('check');
	chipTypeSelection(check)
	if (splt1[i].CutAdjust == 'yes') {
		document.getElementById('checkbox_3_'+i).checked = true;
	}
	var chip = splt1[i].ChipInput
	var remove_button = createElement('button', ['class', 'type', 'onclick'],['btn btn-xs btn-danger text-center pull-right', 'button', 'removeChip(this)']);
	var icon = createElement('i', ['class'],['fa fa-times']);
	remove_button.appendChild(icon);
	for(var z = 0; z < chip.length; z++){
		var chiptable = $('#json_chiptable').dataTable();
		chiptable.fnAddData([
			'<input id="'+chip[z].name+'" class="form-control" type="text" value="'+chip[z].name+'" onChange="updateChipName(this)">',
			chip[z].samples.replace(/,/g, ", "),
			chip[z].input.replace(/,/g, ", "),
			remove_button.outerHTML
		]);
		for(var k = 0; k < chip[z].samples.split(",").length; k++){
			document.getElementById('0_1_'+ chip[z].samples.split(",")[k]).remove();
		}
	}
	document.getElementById('textarea_1_'+i).value = splt1[i].Params.replace("__cr____cn__", "\n");
	document.getElementById('text_1_'+i).value = splt1[i].MultiMapper;
	document.getElementById('text_2_'+i).value = splt1[i].TagSize;
	document.getElementById('select_1_'+i).value = splt1[i].BandWith;
	document.getElementById('select_2_'+i).value = splt1[i].EffectiveGenome;
	document.getElementById('select_5_'+i).value = splt1[i].IGVTDF;
	document.getElementById('select_6_'+i).value = splt1[i].BAM2BW;
	if (splt1[i].IGVTDF == 'yes') {
		IGVTDFSelection('select_5_'+i);
		document.getElementById('textarea_2_'+i).value = splt1[i].ExtFactor;
	}
	if (splt1[i].BAM2BW == 'yes') {
		bigwigSelection('select_2_'+i)
		if (splt1[i].Deeptools == 'yes') {
			document.getElementById('checkbox_6_'+i).checked = true;
			deeptoolsSelect('checkbox_6_'+i)
			if (splt1[i].PlotType == 'reference-point') {
				document.getElementById('select_3_'+i).value = splt1[i].PlotType
				referenceSelect('select_3_'+i)
				document.getElementById('select_4_'+i).value = splt1[i].ReferencePoint
			}
		}
	}
	if (splt1[i].CollectMultipleMetrics == 'yes' || splt1[i].CollectMultipleMetrics == '1') {
		document.getElementById('checkbox_1_'+i).checked = true;
	}
	if (splt1[i].MarkDuplicates == 'yes' || splt1[i].MarkDuplicates == '1') {
		document.getElementById('checkbox_2_'+i).checked = true;
	}
}

function populateChipSelection() {
	var names = document.getElementById('multi_chip_1');
	names.innerHTML = "";
	var input = document.getElementById('multi_chip_2');
	input.innerHTML = "";
	var sample_names = getTrueSampleNames(selected_samples.toString());
	
	//CHIP MULTI_SELECT
	if (document.getElementById('multi_chip_1') != null) {
		var adj_sample_names = sample_names;
		for(var x = 0; x < currentChipInputID.length; x++){
			if (currentChipInputVal[currentChipInputID.indexOf(currentChipInputID[x])] != undefined) {
				var adj_sample_names = adj_sample_names.filter( function (sample) { return currentChipInputVal[currentChipInputID.indexOf(currentChipInputID[x])].indexOf( sample ) < 0; } );
			}
		}
		
		for(var x = 0; x < sample_names.length; x++){
			if (adj_sample_names.indexOf(sample_names[x]) > -1) {
				document.getElementById('multi_chip_1').appendChild(createElement('option', ['id', 'value'], [currentChipCount+'_1_'+sample_names[x], sample_names[x]]));
				document.getElementById(currentChipCount+'_1_'+sample_names[x]).innerHTML = sample_names[x]
			}else{
				document.getElementById('multi_chip_1').appendChild(createElement('option', ['id', 'value', 'style', 'disabled'], [currentChipCount+'_1_'+sample_names[x], sample_names[x], 'opacity: 0.4', 'true']));
				document.getElementById(currentChipCount+'_1_'+sample_names[x]).innerHTML = sample_names[x]
			}
			document.getElementById('multi_chip_2').appendChild(createElement('option', ['id', 'value'], [currentChipCount+'_2_'+sample_names[x], sample_names[x]]));
			document.getElementById(currentChipCount+'_2_'+sample_names[x]).innerHTML = sample_names[x]
		}
	}
}

function addChipSeqInput(id){
	var name = document.getElementById('multi_chip_1').selectedOptions;
	var name_first = name[0].value;
	var name_string = "";
	for(var x = 0; x < name.length; x++){
		name_string += name[x].value;
		if (x + 1 != name.length) {
			name_string += ", ";
		}
		name[x].remove();
		x--;
	}
	
	var input = document.getElementById('multi_chip_2').selectedOptions;
	var input_string = '';
	for(var x = 0; x < input.length; x++){
		input_string += input[x].value;
		if (x + 1 != input.length) {
			input_string += ", ";
		}
	}
	var chip_table = $('#json_chiptable').dataTable();
	var remove_button = createElement('button', ['class', 'type', 'onclick'],['btn btn-xs btn-danger text-center pull-right', 'button', 'removeChip(this)']);
	var icon = createElement('i', ['class'],['fa fa-times']);
	remove_button.appendChild(icon);
	
	chip_table.fnAddData([
		'<input id="'+ name_first+'" class="form-control" type="text" value="'+name_first+'" onChange="updateChipName(this)">',
		name_string,
		input_string,
		remove_button.outerHTML
	]);
}

function updateChipName(input){
	input.id = input.value;
}

function removeChip(button){
	var names = document.getElementById('multi_chip_1')
	var barcode_bool = false;
	var chip_table = $('#json_chiptable').dataTable();
	var row = $(button).closest('tr');
	var names_used = row.children()[1].innerHTML.split(', ');
	for(var x = 0; x < names_used.length; x++){
		names.innerHTML += '<option value="'+names_used[x]+'">'+names_used[x]+'</option>'
	}
	chip_table.fnDeleteRow(row);
	chip_table.fnDraw();
}

function resetChip() {
	var chip_table = $('#json_chiptable').dataTable();
	chip_table.fnClearTable();
	populateChipSelection();
}

function chipTypeSelection(checkbox){

	var label2 = document.getElementById('label_4_'+checkbox.name)
	var label1 = document.getElementById('label_3_'+checkbox.name)
	var check1 = document.getElementById('checkbox_3_'+checkbox.name)
	
	if (checkbox.id == checkbox.name + "_ATAC" ) {
		label2.style = 'display:show'
		label1.style = 'display:show'
		check1.style = 'display:show'
	}else{
		label2.style = 'display:none'
		label1.style = 'display:none'
		check1.style = 'display:none'
	}
}

function formDESeq(divAdj, num){
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Name:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_1_'+num, 'form-control', 'text', ''])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Condition 1']),
			createElement('select',['id', 'class', 'type', 'multiple', 'size', 'onchange'],['multi_select_1_'+num, 'form-control', 'select-multiple', 'multiple', '8', 'deselectCondition(1, '+num+')'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Condition 2']),
			createElement('select',['id', 'class', 'type', 'multiple', 'size', 'onchange'],['multi_select_2_'+num, 'form-control', 'select-multiple', 'multiple', '8', 'deselectCondition(2, '+num+')'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Fit Type:']),
			createElement('select', ['id', 'class', 'OPTION', 'OPTION', 'OPTION'], ['select_3_'+num, 'form-control', 'parametric', 'local', 'mean'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Heatmap:']),
			createElement('select', ['id', 'class', 'OPTION', 'OPTION'], ['select_4_'+num, 'form-control', 'Yes', 'No'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'pAdj cutoff']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_2_'+num, 'form-control', 'text', '0.01'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Fold Change cutoff']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_3_'+num, 'form-control', 'text', '2'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Select Sequence']),
			createElement('select', ['id', 'class'], ['select_5_'+num, 'form-control'])] ]);
	return divAdj
}

function reloadDESeq(splt1, i){
	additionalPipes();
	console.log(i)
	document.getElementById('select_'+i).value = pipelineDict[3];
	pipelineSelect(i);
	//handle for multiple selections
	document.getElementById('text_1_'+i).value = splt1[i].Name;
	var select_values = [];
	var select_locations = [];
	if (splt1[i].Columns != undefined) {
		select_values = splt1[i].Columns.split(",");
		select_locations = splt1[i].Conditions.split(",");
	}
	var select1_values = [];
	var select2_values = [];
	for(var f = 0; f < select_locations.length; f++){
		if (select_locations[f] == 'Cond1') {
			select1_values.push(select_values[f]);
		}else{
			select2_values.push(select_values[f]);
		}
	}
	var select1 = document.getElementById('multi_select_1_'+i);
	var select2 = document.getElementById('multi_select_2_'+i);
	for(var h = 0; h < select1.options.length; h++){
		if (select1_values.indexOf(select1.options[h].value) != -1) {
			select1.options[h].selected = true;
			select2.options[h].disabled = true;
			select2.options[h].setAttribute("style", "opacity: 0.4");
		}
	}
	for(var h = 0; h < select1.options.length; h++){
		if (select2_values.indexOf(select2.options[h].value) != -1) {
			select2.options[h].selected = true;
			select1.options[h].disabled = true;
			select1.options[h].setAttribute("style", "opacity: 0.4")
		}
	}
	document.getElementById('select_3_'+i).value = splt1[i].FitType;
	document.getElementById('select_4_'+i).value = splt1[i].HeatMap;
	document.getElementById('text_2_'+i).value = splt1[i].padj;
	document.getElementById('text_3_'+i).value = splt1[i].foldChange;
	document.getElementById('select_5_'+i).value = splt1[i].DataType;
}

function formBisulphiteMapping(divAdj, num){
	//MMap
	var labelDiv = createElement('div', ['class'], ['col-md-12 text-center']);
	labelDiv.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title margin', 'Run BSMap:']));
	labelDiv.appendChild( createElement('input', ['id', 'type', 'class', 'checked', 'disabled'], ['checkbox_1_'+num, 'checkbox', 'margin']));
	divAdj.appendChild(labelDiv);
	var innerDiv = createTidyDiv(12);
	divAdj = mergeTidy(divAdj, 12,
			[[createLabeledDiv(12, 'RRBS&nbsp;&nbsp;', '&nbsp;&nbsp;WGBS',
				createElement('input', ['id', 'name', 'type', 'value', 'onClick', 'checked'], [num+'_RRBS', num, 'radio', 'RRBS', 'bisulphiteSelect(this.id, '+num+')']),
				createElement('input', ['id', 'name', 'type', 'value', 'onClick',], [num+'_WGBS', num, 'radio', 'WGBS', 'bisulphiteSelect(this.id, '+num+')']))
			],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Digestion Site:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_1_'+num, 'form-control', 'text', 'C-CGG'])]
			]);
	labelDiv = createElement('div', ['class'], ['col-md-12']);
	labelDiv.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title', 'Additional BSMap Parameters:']));
	labelDiv.appendChild( createElement('textarea', ['id', 'class'], ['textarea_1_'+num, 'form-control']));
	divAdj.appendChild(labelDiv);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['margin', 'Mark Duplicates:']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_3_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['margin', 'Collect Multiple Picard Metrics:']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_2_'+num, 'checkbox', 'margin'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'IGV/TDF Conversion:']),
			   createElement('select', ['id','class','onChange','OPTION', 'OPTION'], ['select_1_'+num, 'form-control', 'IGVTDFSelection(this.id)','no', 'yes'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'BigWig Conversion:']),
			   createElement('select', ['id', 'class', 'onChange', 'OPTION', 'OPTION'], ['select_2_'+num, 'form-control', 'bigwigSelection(this.id)', 'no', 'yes'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_1_'+num, 'box-title', 'display:none', 'extFactor']),
			   createElement('input', ['id', 'class', 'type', 'style', 'value'], ['textarea_2_'+num, 'form-control', 'text', 'display:none', '0'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_5_'+num, 'box-title margin', 'Create Deeptools plots:', 'display:none']),
			   createElement('input', ['id', 'type', 'class', 'style', 'onClick'], ['checkbox_6_'+num, 'checkbox', 'margin', 'display:none', 'deeptoolsSelect(this.id)'])] ]);
	divAdj = mergeTidy(divAdj, 7,
			[ [createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_6_'+num, 'box-title', 'display:none', 'Plot Type:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'onChange'], ['select_3_'+num, 'form-control', 'display:none', 'scale-regions', 'reference-point', 'referenceSelect(this.id)'])],
			[createElement('label', ['id', 'class','style', 'TEXTNODE'], ['label_7_'+num, 'box-title', 'display:none', 'Reference Point:']),
			   createElement('select', ['id', 'class', 'style', 'OPTION', 'OPTION', 'OPTION'], ['select_4_'+num, 'form-control', 'display:none', 'TSS', 'TES', 'center'])] ]);
	//MCALL
	labelDiv = createElement('div', ['class'], ['col-md-12 text-center']);
	labelDiv.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title margin', 'Run MCall:']));
	labelDiv.appendChild( createElement('input', ['id', 'type', 'class', 'onClick'], ['checkbox_4_'+num, 'checkbox', 'margin', 'MCallSelection("'+num+'")']));
	divAdj.appendChild(labelDiv);
	labelDiv2 = createElement('div', ['class'], ['col-md-12']);
	labelDiv2.appendChild( createElement('label', ['id', 'class', 'style', 'TEXTNODE'], ['label_4_'+num, 'box-title', 'display:none', 'Additional MCall Parameters:']));
	labelDiv2.appendChild( createElement('textarea', ['id', 'class', 'style'], ['textarea_3_'+num, 'form-control', 'display:none']));
	divAdj.appendChild(labelDiv2);
	//RUN METHYLKIT
	labelDiv = createElement('div', ['class'], ['col-md-12 text-center']);
	labelDiv.appendChild( createElement('label', ['class','TEXTNODE'], ['box-title margin', 'Run MethylKit:']));
	labelDiv.appendChild( createElement('input', ['id', 'type', 'class', 'onClick'], ['checkbox_5_'+num, 'checkbox', 'margin', 'MethylKitSelection("'+num+'")']));
	divAdj.appendChild(labelDiv);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_2_'+num, 'box-title', 'Tile Size:', 'display:none']),
			createElement('input', ['id', 'class', 'type', 'value', 'style'], ['text_2_'+num, 'form-control', 'text', '300', 'display:none'])],
			[createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_3_'+num, 'box-title', 'Step Size:', 'display:none']),
			createElement('input', ['id', 'class', 'type', 'value', 'style'], ['text_3_'+num, 'form-control', 'text', '300', 'display:none'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_8_'+num, 'box-title', 'Min Coverage:', 'display:none']),
			createElement('input', ['id', 'class', 'type', 'value', 'style'], ['text_4_'+num, 'form-control', 'text', '5', 'display:none'])],
			[createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_9_'+num, 'box-title', 'Top N Regions:', 'display:none']),
			createElement('input', ['id', 'class', 'type', 'value', 'style'], ['text_5_'+num, 'form-control', 'text', '2000', 'display:none'])] ]);
	labelDiv = createElement('div', ['class'], ['col-md-12 text-center']);
	labelDiv.appendChild( createElement('label', ['id', 'class','TEXTNODE', 'style'], ['label_10_'+num,'box-title margin', 'Strand Specific Information:', 'display:none']));
	labelDiv.appendChild( createElement('input', ['id', 'type', 'class', 'style'], ['checkbox_7_'+num, 'checkbox', 'margin', 'display:none']));
	divAdj.appendChild(labelDiv);
	return divAdj
}

function reloadBisulphiteMapping(splt1, i){
	//MMap
	additionalPipes();
	document.getElementById('select_'+i).value = pipelineDict[4];
	pipelineSelect(i);
	document.getElementById('text_1_'+i).value = splt1[i].Digestion;
	$("#" + i.toString() + "_" + splt1[i].BisulphiteType).iCheck('check');
	if (splt1[i].BisulphiteType == 'WGBS') {
		document.getElementById('text_1_'+i).disabled = true;
	}
	document.getElementById('textarea_1_'+i).value = splt1[i].BSMapParams;
	document.getElementById('select_1_'+i).value = splt1[i].IGVTDF;
	document.getElementById('select_2_'+i).value = splt1[i].BAM2BW;
	if (splt1[i].IGVTDF == 'yes') {
		IGVTDFSelection('select_1_'+i);
		document.getElementById('textarea_2_'+i).value = splt1[i].ExtFactor;
	}
	if (splt1[i].BAM2BW == 'yes') {
		bigwigSelection('select_2_'+i)
		if (splt1[i].Deeptools == 'yes') {
			document.getElementById('checkbox_6_'+i).checked = true;
			deeptoolsSelect('checkbox_6_'+i)
			if (splt1[i].PlotType == 'reference-point') {
				document.getElementById('select_3_'+i).value = splt1[i].PlotType
				referenceSelect('select_3_'+i)
				document.getElementById('select_4_'+i).value = splt1[i].ReferencePoint
			}
		}
	}
	if (splt1[i].CollectMultipleMetrics == 'yes' || splt1[i].CollectMultipleMetrics == '1') {
		document.getElementById('checkbox_2_'+i).checked = true;
	}
	if (splt1[i].MarkDuplicates == 'yes' || splt1[i].MarkDuplicates == '1') {
		document.getElementById('checkbox_3_'+i).checked = true;
	}
	
	//MCall
	//handle for multiple selections
	if (splt1[i].MCallStep == 'yes' || splt1[i].MCallStep == '1') {
		document.getElementById('checkbox_4_'+i).checked = true;
	}
	MCallSelection(i);
	document.getElementById('textarea_3_'+i).value = splt1[i].MCallParams;
	
	//MethylKit
	if (splt1[i].MethylKit == 'yes' || splt1[i].MethylKit == '1') {
		document.getElementById('checkbox_5_'+i).checked = true;
	}
	MethylKitSelection(i);
	document.getElementById('text_2_'+i).value = splt1[i].TileSize;
	document.getElementById('text_3_'+i).value = splt1[i].StepSize;
	document.getElementById('text_4_'+i).value = splt1[i].MinCoverage;
	document.getElementById('text_5_'+i).value = splt1[i].TopN;
	if (splt1[i].StrandSpecific == 'yes' || splt1[i].StrandSpecific == '1') {
		document.getElementById('checkbox_7_'+i).checked = true;
	}
}

function MCallSelection(id){
	var check = document.getElementById('checkbox_4_'+id).checked;
	if (check) {
		document.getElementById('label_4_'+id).setAttribute("style", "display:show");
		document.getElementById('textarea_3_'+id).setAttribute("style", "display:show");
	}else{
		document.getElementById('label_4_'+id).setAttribute("style", "display:none");
		document.getElementById('textarea_3_'+id).setAttribute("style", "display:none");
		document.getElementById('checkbox_5_'+id).checked = false;
	}
}

function MethylKitSelection(id){
	var MCall_check = document.getElementById('checkbox_4_'+id).checked;
	if (MCall_check) {
		var check = document.getElementById('checkbox_5_'+id).checked;
		if (check) {
			document.getElementById('label_2_'+id).setAttribute("style", "display:show");
			document.getElementById('text_2_'+id).setAttribute("style", "display:show");
			document.getElementById('label_3_'+id).setAttribute("style", "display:show");
			document.getElementById('text_3_'+id).setAttribute("style", "display:show");
			document.getElementById('label_8_'+id).setAttribute("style", "display:show");
			document.getElementById('text_4_'+id).setAttribute("style", "display:show");
			document.getElementById('label_9_'+id).setAttribute("style", "display:show");
			document.getElementById('text_5_'+id).setAttribute("style", "display:show");
			document.getElementById('label_10_'+id).setAttribute("style", "display:show");
			document.getElementById('checkbox_6_'+id).setAttribute("style", "display:show");
		}else{
			document.getElementById('label_2_'+id).setAttribute("style", "display:none");
			document.getElementById('text_2_'+id).setAttribute("style", "display:none");
			document.getElementById('label_3_'+id).setAttribute("style", "display:none");
			document.getElementById('text_3_'+id).setAttribute("style", "display:none");
			document.getElementById('label_8_'+id).setAttribute("style", "display:none");
			document.getElementById('text_4_'+id).setAttribute("style", "display:none");
			document.getElementById('label_9_'+id).setAttribute("style", "display:none");
			document.getElementById('text_5_'+id).setAttribute("style", "display:none");
			document.getElementById('label_10_'+id).setAttribute("style", "display:none");
			document.getElementById('checkbox_6_'+id).setAttribute("style", "display:none");
		}
	}else if( document.getElementById('checkbox_5_'+id).checked == true){
		$('#errorModal').modal({
			show: true
		});
		document.getElementById('errorLabel').innerHTML ='You must first add a MCall before adding MethylKit';
		document.getElementById('errorAreas').innerHTML = '';
		document.getElementById('checkbox_5_'+id).checked = false;
	}
}

function bisulphiteSelect(id, num){
	if (id == num+'_RRBS') {
		var dig_site = document.getElementById('text_1_'+num);
		dig_site.disabled = false;
		dig_site.value = 'C-CGG';
	}else{
		var dig_site = document.getElementById('text_1_'+num);
		dig_site.disabled = true;
		dig_site.value = '';
	}
}

function formDiffMeth(divAdj, num){
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Name:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_1_'+num, 'form-control', 'text', ''])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Condition 1']),
			createElement('select',['id', 'class', 'type', 'multiple', 'size', 'onchange'],['multi_select_1_'+num, 'form-control', 'select-multiple', 'multiple', '8', 'deselectCondition(1, '+num+')'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Condition 2']),
			createElement('select',['id', 'class', 'type', 'multiple', 'size', 'onchange'],['multi_select_2_'+num, 'form-control', 'select-multiple', 'multiple', '8', 'deselectCondition(2, '+num+')'])] ]);
	return divAdj
}

function reloadDiffMeth(splt1, i){
	additionalPipes();
	document.getElementById('select_'+i).value = pipelineDict[5];
	pipelineSelect(i);
	document.getElementById('text_1_'+i).value = splt1[i].Name;
	//handle for multiple selections
	var select_values = [];
	var select_locations = [];
	if (splt1[i].Columns != undefined) {
		select_values = splt1[i].Columns.split(",");
		select_locations = splt1[i].Conditions.split(",");
	}
	var select1_values = [];
	var select2_values = [];
	for(var f = 0; f < select_locations.length; f++){
		if (select_locations[f] == 'Cond1') {
			select1_values.push(select_values[f]);
		}else{
			select2_values.push(select_values[f]);
		}
	}
	var select1 = document.getElementById('multi_select_1_'+i);
	for(var h = 0; h < select1.options.length; h++){
		if (select1_values.indexOf(select1.options[h].value) != -1) {
			select1.options[h].selected = true;
		}
	}
	var select2 = document.getElementById('multi_select_2_'+i);
	for(var h = 0; h < select1.options.length; h++){
		if (select2_values.indexOf(select2.options[h].value) != -1) {
			select2.options[h].selected = true;
		}
	}
}

function formHaplotypeCaller(divAdj, num){
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Compare Common SNPs: ']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_1_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Compare Clinical SNPs: ']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_2_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Compare Enhancers: ']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_3_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Compare Promoters: ']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_4_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Compare Motifs: ']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_5_'+num, 'checkbox', 'margin'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Merge Samples: ']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_6_'+num, 'checkbox', 'margin'])]]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Min Calling Threshold Confidence:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_1_'+num, 'form-control', 'text', '30'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Min Emitting Threshold Confidence:']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_2_'+num, 'form-control', 'text', '30'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Min Base Quality Score: ']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_3_'+num, 'form-control', 'text', '10'])],
			[createElement('label', ['class','TEXTNODE'], ['box-title', 'Min Reads Per Alignment Start: ']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_4_'+num, 'form-control', 'text', '10'])] ]);
	divAdj = mergeTidy(divAdj, 6,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Max Reads In Region Per Sample: ']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_5_'+num, 'form-control', 'text', '10000'])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Compare Custom Bed (Full Path):']),
			createElement('input', ['id', 'class', 'type', 'value'], ['text_6_'+num, 'form-control', 'text', ''])] ]);
	divAdj = mergeTidy(divAdj, 12,
			[ [createElement('label', ['class','TEXTNODE'], ['box-title', 'Use Chip Peaks: ']),
			createElement('input', ['id', 'type', 'class'], ['checkbox_7_'+num, 'checkbox', 'margin'])] ]);
	return divAdj
}

function reloadHaplotypeCaller(splt1, i){
	additionalPipes();
	document.getElementById('select_'+i).value = pipelineDict[6];
	pipelineSelect(i);
	document.getElementById('text_1_'+i).value = splt1[i].standard_min_confidence_threshold_for_calling;
	document.getElementById('text_2_'+i).value = splt1[i].standard_min_confidence_threshold_for_emitting;
	document.getElementById('text_3_'+i).value = splt1[i].min_base_quality_score;
	document.getElementById('text_4_'+i).value = splt1[i].minReadsPerAlignmentStart;
	document.getElementById('text_5_'+i).value = splt1[i].maxReadsInRegionPerSample;
	document.getElementById('text_6_'+i).value = splt1[i].custombed;
	if (splt1[i].common == 'yes' || splt1[i].common == '1') {
		document.getElementById('checkbox_1_'+i).checked = true;
	}
	if (splt1[i].clinical == 'yes' || splt1[i].clinical == '1') {
		document.getElementById('checkbox_2_'+i).checked = true;
	}
	if (splt1[i].enhancers == 'yes' || splt1[i].enhancers == '1') {
		document.getElementById('checkbox_3_'+i).checked = true;
	}
	if (splt1[i].promoters == 'yes' || splt1[i].promoters == '1') {
		document.getElementById('checkbox_4_'+i).checked = true;
	}
	if (splt1[i].motifs == 'yes' || splt1[i].motifs == '1') {
		document.getElementById('checkbox_5_'+i).checked = true;
	}
	if (splt1[i].merge == 'yes' || splt1[i].merge == '1') {
		document.getElementById('checkbox_6_'+i).checked = true;
	}
	if (splt1[i].peaks == 'yes' || splt1[i].peaks == '1') {
		document.getElementById('checkbox_7_'+i).checked = true;
	}
}