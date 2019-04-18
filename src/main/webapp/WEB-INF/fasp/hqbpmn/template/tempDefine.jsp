<%@page contentType="text/html;charset=UTF-8"%>
<%
	String realFirstPath = request.getServletPath().substring(1,request.getServletPath().length());
	realFirstPath=realFirstPath.substring(0, realFirstPath.indexOf("/"));
	request.setAttribute("myBasePath", request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ request.getContextPath() + "/"+realFirstPath+"/");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" type="text/css"
	href="${myBasePath}hqbpmn/jslib/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css">
<link href="${myBasePath}hqbpmn/style/css/base.css" rel="stylesheet"
	type="text/css" />
<link href="${myBasePath}hqbpmn/style/css/layout.css" rel="stylesheet"
	type="text/css" />
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/template/uploadJS/jquery.form.js"></script>
<title>流程模板管理</title>
<script type="text/javascript">
	var basePath = "${myBasePath}";
	var tokenID = "${param.tokenid}";
    var tempCategory = '<%=request.getParameter("bpmnType")%>'; 
	$(function(){
		$("#dataGridDiv").datagrid({
			loadFilter : function pagerFilter(data){
				if(data.result!=undefined){
					data = data.result;
				}
				if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
					data = {
						total: data.length,
						rows: data
					}
				}
				var dg = $(this);
				var opts = dg.datagrid('options');
				var pager = dg.datagrid('getPager');
				pager.pagination({
					onSelectPage:function(pageNum, pageSize){
						opts.pageNumber = pageNum;
						opts.pageSize = pageSize;
						pager.pagination('refresh',{
							pageNumber:pageNum,
							pageSize:pageSize
						});
						dg.datagrid('loadData',data);
					}
				});
				if (!data.originalRows){
					data.originalRows = (data.rows);
				}
				var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
				var end = start + parseInt(opts.pageSize);
				data.rows = (data.originalRows.slice(start, end));
				return data;
			}
		}).datagrid({
		    url:basePath+"bpmnAction/templateDef/findTemplateDefByCategory.do?tokenid=${param.tokenid}",
		    idField:'id',    
		    singleSelect:true,
		    fitColumns : true,
			rownumbers: true,
			animate: false,
			collapsible: false,
			pagination:true,
			showRefresh:false,
			striped:true,
			pageSize: 20,//每页显示的记录条数，默认为15
			pageList: [20,40,60],//可以设置每页记录条数的列表 
		    pagePosition:'bottom',
			method: 'post',
		    columns:[[
		        //{field:'c_k',checkbox:true,width:100},
		        {field:'name',title:'名称',width:100},
		       	{field:'category',title:'分类',width:70,align:'center'},
		        {field:'version',title:'版本',width:70,align:'center'},
		        {field:'createTimeStr',title:'创建时间',width:100,align:'center'},
		        {field:'modifyTimeStr',title:'修改时间',width:70,align:'center'},
		        {field:'deployStateStr',title:'部署状态',width:70,align:'center'},
		        {field:'versionStateStr',title:'版本状态',width:70,align:'center'}
		    ]]
		});
		$('#dataGridDiv').datagrid('load',{category : tempCategory});
	});
	//监听窗口大小变化
	window.onresize = function(){
		setTimeout(domresize,200);
	};
	//改变表格宽高
	function domresize(){
		$('#dataGridDiv').datagrid('resize',{  
			width:($("body").width()-240)*0.98
		});
	}
	function addTempDef() {
		 // 增加的时候要把分类也传进去
		 var category =tempCategory; 
		 $.ajax({
				url : basePath+"bpmnAction/tempCategory/selectTempCategoryByCategoryGetCategory.do?tokenid=${param.tokenid}",
				type : "POST",
				data : "category=" + tempCategory,
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					var pdKey = pr.result.pdKey;
					var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?pdKey="+pdKey+"&category="+category;
					if(tokenID){
						window.open(src+"&tokenid="+tokenID, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes"); 
					 }else{
						 window.open(src, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes"); 
					 }
				}
			});
		 $('#dataGridDiv').datagrid('load',{category : tempCategory});
	}

	function editTempDef() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		//将数组转换为字符串
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
		var id = rowData.id;
	    var deployStateStr= rowData.deployStateStr;
	    var deployState;
	    if(deployStateStr=="已部署"){
	    	deployState="0";
	    }else{
	    	deployState="1";
	    }
	    var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?id="+id+"&deployState="+deployState;
	    if(tokenID){
			 window.open(src+"&tokenid="+tokenID, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
		 }else{
		     window.open(src, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
		 }
	    $('#dataGridDiv').datagrid('load',{category : tempCategory});
	}
	function tempDefDelete() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		if (confirm('确认删除选中流程模板吗？删除流程模板同时会级联删除流程实例。')) {	
			var rowData = $('#dataGridDiv').datagrid('getSelected');
			var id = rowData.id;
		   	$.ajax({
				url:basePath+"bpmnAction/templateDef/deleteTemplateDefById.do?tokenid=${param.tokenid}",    
				type:"POST",
				data:"&id=" + id,  
				dataType:"json",
				success:function(pr, textStatus){
					 if(pr.success){
						alert(pr.message);
						zTreeOnClick();
					 }else{
						 alert(pr.message);
					 }
					
				}
			});
		}
		$('#dataGridDiv').datagrid('load',{category : tempCategory});
	}
	// 点击"部署"按钮时候调用的事件 
	function modifyDeployState(deploystate) {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
		var id = rowData.id;
    	$.ajax({
    		url:basePath+"bpmnAction/templateDef/deployBpmnTempDefById.do?tokenid=${param.tokenid}",    
    		type:"POST",
    		data:"id=" + id ,  
    		dataType:"json",
    		async:false,
    		success:function(pr, textStatus){
    			alert(pr.message);
    		}
    	});
    	$('#dataGridDiv').datagrid('load',{category : tempCategory});
	}
	// 点击"停用"，"启用"，"禁用"按钮时候调用的事件 
	function modifyVersionState(versionState) {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
		var id = rowData.id;
	    if(id!= undefined){
	    	$.ajax({
	    		url:basePath+"bpmnAction/templateDef/modifyVersionStateById.do?tokenid=${param.tokenid}",    
	    		type:"POST",
	    		data:"id=" + id + "&versionState=" + versionState,  
	    		dataType:"json",
	    		async:false,
	    		success:function(pr, textStatus){
	            	 alert(pr.message);
	    		}
	    	});
	    }
	    $('#dataGridDiv').datagrid('load',{category : tempCategory});
	}
	function importTempDef() {
		$('#categoryTreeImp').combotree({url: basePath+'bpmnAction/tempCategory/findTempCategoryTree.do?tokenid=${param.tokenid}',required: true,cascadeCheck:false,onLoadSuccess:function(){
		},onSelect:function(recode){
			$("#categoryImp").attr("value",recode.text);
			$("#realValueImp").attr("value",recode.id);
			$("#pdKeyImp").attr("value",recode.attributes.pdkey);
		}});
		$("#importWin").dialog("open");
		$('#dataGridDiv').datagrid('load',{category : tempCategory});
	}
	function exportTempDef() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
		var id = rowData.id;
		location.href = basePath+"bpmnAction/templateDef/exportTemplateDefById.do?tokenid=${param.tokenid}&id="+id;
	}
	function showProcInst() {
		var category = tempCategory;
		var src=basePath+"hqbpmn/processinstance/processManageList.jsp?category="+category;
		if(tokenID){
			window.open(src+"&tokenid="+tokenID, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
		}
		window.open(src, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
	}
	function submitForm() {
		if ($.trim($("#contentXML").val()) == '') {
			alert('文件不能为空');
			return;
		}
		if ($.trim($("#categoryImp").val()) == '') {
			alert("请选择一个模板类型");
			return;
		}
		var v = $.trim($("#realValueImp").val());
		var pdKey = $.trim($("#pdKeyImp").val())+"";
		$('#form1').ajaxSubmit({
			type : 'POST',
			dataType : 'json',
			data : { 
				categoryValue : v,
				pdKey : pdKey
			},
			url : basePath+"bpmnAction/templateDef/importTemplate.do?tokenid=${param.tokenid}",
			success: function (responseText, statusText, xhr, $form)
	        {
	        	alert(responseText.message);
				// 导入成功，关闭弹出框
				if (responseText.success) {
					$("#realValueImp").attr("value","");
					$("#pdKeyImp").attr("value","");
					$("#categoryImp").attr("value","");
					$("#importWin").dialog("close");
				}
	        },
		});
		return true;
	}
	function refreshDatagrid(){
		$('#dataGridDiv').datagrid('load',{category : tempCategory});
	}
</script>
</head>
<body class="easyui-layout">
	<div data-options="region:'center'" >
		<div style="margin: 6px;">
		<div class="boxOperList" style="height: 36px; margin-bottom: 16px;">
			<span id="btn_task_add" class="i_21"
				onclick="javascript:addTempDef()">新建</span> <span id="btn_task_edit"
				class="i_24" onclick="javascript:editTempDef()">修改</span> <span
				id="btn_task_del" class="i_22"  onclick="javascript:tempDefDelete()">删除</span>
				<span id="btn_task_add1" class="i_31"
				onclick="javascript:modifyDeployState(0)">部署</span> <span id="btn_task_edit" class="i_1"
			    onclick="javascript:modifyVersionState(1)">启用</span> <span class="i_32"
				id="btn_task_del" onclick="javascript:modifyVersionState(0)">停用</span>
			<span id="btn_task_add2" class="i_33"
				onclick="javascript:modifyVersionState(2)">禁用</span> <span class="i_35" id="btn_task_edit"
			    onclick="javascript:importTempDef()">导入</span> <span class="i_34" id="btn_task_edit"
			    onclick="javascript:exportTempDef()">导出</span><span class="i_29" id="btn_task_inst"
			    onclick="javascript:showProcInst()">流程监控</span>
			<div class="clear"></div>
		</div>
		<div class="box_rightTopTool">
				<div class="boxToolIn">
				 <form id="queryform" class="query"  method="post" >
					<div class="infoIn">
						<span class="name">名称：</span>
						<div class="textIn2"><input class="easyui-textbox" type="text" name="task_code"></div>
						<span class="name">部署状态：</span>
						<div class="textIn2"><select id="deployState" style="width:150px">
		              <option value=""></option>
		              <option value="1">已部署</option>
		              <option value="0">未部署</option>
		          </select></div>
		          <span class="name">版本状态：</span>
						<div class="textIn2"><select id="versionState" style="width:150px">
		              <option value=""></option>
		              <option value="0">停用</option>
		              <option value="1">启用</option>
		              <option value="2">禁用</option>
		          </select></div>
						<span><a href="javascript:void(0);" class="easyui-linkbutton" iconCls="icon-search" onclick="queryTask()">查询</a></span>
						<div class="clear"></div>
					</div>
					</form>
				</div>
			</div>
		<div class="boxSection noborder boxGui">
			<div class="boxTit">
				<div class="boxTitIcon i_11"></div>
				<div class="boxTitdes" id="boxTableName">流程模版定义</div>
				<span class="wordDes"></span>
			</div>
		</div>
		<div id="dataGridDiv"></div>
		</div>
	</div>

	<div id="importWin" title="模板导入" class="easyui-window"
		style="width: 620px; height: 350px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false">
		<div class="tableData_3 noborder bgGray bgGray ptb10" style="margin-top:30px;">
		<form name="form1" id="form1" action="" method="post" enctype="multipart/form-data">
		    <input id="realValueImp" name="realValueImp"  type="hidden" >
		    <input id="pdKeyImp" name="pdKeyImp"  type="hidden" >
		    <input id="categoryImp" name="categoryImp"  type="hidden" >
		    <table width="100%">
		    <tr>
					<td class="alignR nameIn">类型:</td>
					<td class="alignL">
						<select id="categoryTreeImp" class="easyui-combobox" style="width:280px;" name="categoryTreeImp"></select><font
						class="high" style="color: red" size="2">&nbsp;*</font>
					</td>
				</tr>
			    <tr>
			    <td class="alignR nameIn">模板:</td>
					<td class="alignL"><input type='file' id='contentXML' name='contentXML' style="width:280px;"><font
						class="high" style="color: red" size="2">&nbsp;*</font></td>
				</tr>
			</table>
			<div class="alFbtnBox alignC" style="margin-top:20px;">
				<span class="btn" onclick="submitForm()">确定</span> 
				<span class="btn" onclick="javascript:$('#importWin').dialog('close')">关闭</span>
			</div>
		</form>
		</div>
	</div>
</body>
</html>
