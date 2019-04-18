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
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<link rel="stylesheet" type="text/css"
	href="${myBasePath}hqbpmn/jslib/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css">
<link href="${myBasePath}hqbpmn/style/css/base.css" rel="stylesheet"
	type="text/css" />
<link href="${myBasePath}hqbpmn/style/css/layout.css" rel="stylesheet"
	type="text/css" />
<link rel="stylesheet" type="text/css" media="screen"
	href="${myBasePath}hqbpmn/jslib/zTree/zTreeStyle/zTreeStyle.css" />
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.excheck-3.5.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.exedit-3.5.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/template/lookup/lookUp.js" ></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/common/uiUtil.js"></script>
<title>人员关系维护</title>
<script type="text/javascript">
	var basePath = "${myBasePath}";
	var tokenID = "${param.tokenid}";
	var setting = {
			data : {
				keep : {
					leaf : false,
					parent : false
				},
				key : {
					checked : "checked",
					children : "children",
					name : "codeName",
					type : "type",
					title : "",
					url : "bpmnAction/templateCode/selectCodeByCodeType.do?tokenid=${param.tokenid}"
				},
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId",
					rootPId : null
				}
			},
			async : {
				enable : true
			},
			callback : {
				onClick : zTreeOnClick
			}
		};
	$(function(){
		//var h=document.body.offsetHeight;
		var h=document.documentElement.clientHeight;
		var dh=h-165;
		document.getElementById('dataGridDiv').style.height=dh+'px';
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
		    url:basePath+"bpmnAction/templateCode/selectCodePersonnelAllocationByTypeId_new.do?tokenid=${param.tokenid}",
		    idField:'id',    
		    singleSelect:true,
		    fitColumns : true,
			rownumbers: true,
			animate: false,
			collapsible: false,
			pagination:true,
			showRefresh:false,
			singleSelect:false,
			striped:true,
			pageSize: 20,//每页显示的记录条数，默认为15
			pageList: [20,40,60],//可以设置每页记录条数的列表 
		    pagePosition:'bottom',
		    fit:false,
			method: 'post',
		    columns:[[
		        {field:'c_k',checkbox:true,width:100},
		        //{field:'id',title:'编码',width:100},
		       	//{field:'name',title:'配置名称',width:70,align:'center'},
		        {field:'prevStep',title:'范围',width:70,align:'center'},
		        //{field:'prevStepExpression',title:'范围表达式',width:100,align:'center'},
		        {field:'nextStep',title:'主体',width:70,align:'center'},
		        //{field:'nextStepExpression',title:'主体表达式',width:70,align:'center'}
		        {field:'orderId',title:'排序号',width:70,align:'center'}
		    ]]
		});
		//监听窗口大小变化
	 	$(window).resize(function(){  
        setTimeout(domresize,200);
         });
		//改变表格宽高
		function domresize(){
			$('#dataGridDiv').datagrid('resize',{  
				width:($("body").width()-240)*0.98
			});
		//var h=document.body.offsetHeight;
		var h=document.documentElement.clientHeight;
		var dh=h-165;
		document.getElementById('dataGridDiv').style.height=dh+'px';
		}
		$.ajax({
			url : basePath + "bpmnAction/templateCode/selectCodeByCodeType.do?tokenid=${param.tokenid}",
			type : "POST",
			data : "codeType=personnelAllocation",
			dataType : "json",
			async : false,
			success : function(pr) {
				$.fn.zTree.init($("#tree"), setting, pr.result);
				showFirstNodeDetail();
			}
		});
		$("#prevSelect").on("click", {
			forDom : $("#prevStep"),
			treeDialogDivDom : $("#defPrevAllocation"),
			expDom : $("#prevStepExpression")
		}, FieldLookUp.showPersonnelAllocationLookUp);
		$("#nextSelect").on("click", {
			forDom : $("#nextStep"),
			treeDialogDivDom : $("#defNextAllocation"),
			expDom : $("#nextStepExpression")
		}, FieldLookUp.showPersonnelAllocationLookUp);
	});
	function showFirstNodeDetail(){
		selectNodes();
		var treeObj = $.fn.zTree.getZTreeObj("tree");
		nodes = treeObj.getSelectedNodes();
		if(nodes.length>0){
		var treeNode = nodes[0];
		$('#dataGridDiv').datagrid('clearSelections');
		$('#dataGridDiv').datagrid('load',{typeId : treeNode.codeKey});
		}
	}
	function selectNodes()
	{
	    var treeObj = $.fn.zTree.getZTreeObj("tree");
	    //获取节点
	    var nodes = treeObj.getNodes();
		if (nodes.length>0) 
		{
		   treeObj.selectNode(nodes[0]);
		}
	}
	function zTreeOnClick(event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("tree");
		nodes = zTree.getSelectedNodes();
		var stepName = $(".easyui-textbox").val();
		var treeNode = nodes[0];
		$('#dataGridDiv').datagrid('clearSelections');
		$('#dataGridDiv').datagrid('load',{typeId : treeNode.codeKey,stepName:stepName});
	}
	function openFormWin(hasUpdate) {
		var zTree = $.fn.zTree.getZTreeObj("tree");
		nodes = zTree.getSelectedNodes();
		treeNode = nodes[0];
		if (nodes.length < 1) {
			alert('请选择节点');
			return;
		}
		$('#dataForm').form('clear');
		$("#relationshipType").attr("value", treeNode.codeName);
		$("#relationshipType").attr("realValue", treeNode.codeKey);
		if(hasUpdate==1){
			var selectRow = $('#dataGridDiv').datagrid('getSelections');
			//将数组转换为字符串
			if(selectRow.length!=1){
				alert("请选择一条数据进行修改！");
				return false;
			}
			var row = $('#dataGridDiv').datagrid('getSelected');
			var id = row.id;
			$.ajax({
				url : basePath + "bpmnAction/templateCode/selectCodePersonnelAllocationById.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {
					id : id
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					if (pr.success) {
						$("#Codeid").attr("value", id);
						$("#CoderderId").attr("value", pr.result.orderId);
						//$("#allocationName").attr("value", pr.result.name);
						$("#prevStep").attr("value", pr.result.prevStep);
						$("#prevStepExpression").attr("value", pr.result.prevStepExpression);
						$("#nextStep").attr("value", pr.result.nextStep);
						$("#nextStepExpression").attr("value", pr.result.nextStepExpression);
						$("#dialogCode").dialog("open");
					}else{
						alert(pr.message);
					}
				}
			});
		}
		$("#formDialog").dialog("open");
	}
	function saveForm() {
		if($.trim($("#prevStep").val())==""){
			alert("请配置范围！");
			return false;
		}
		if($.trim($("#nextStep").val())==""){
			alert("请配置主体！");
			return false;
		}
		if (!isNaN($.trim($("#CoderderId").val()))) {
		} else {
			alert("排序号请输入正确的数字！");
			$("#CoderderId").focus();
			return;
		}
		var url = basePath+"bpmnAction/templateCode/updatePersonnelAllocationById.do?tokenid=${param.tokenid}";
		if($("#Codeid").val()==""){//新增
			url = basePath+"bpmnAction/templateCode/addPersonnelAllocation.do?tokenid=${param.tokenid}";
		}
		$.ajax({
			url : url,
			type : "POST",
			data : {
				id : $("#Codeid").attr("value"),
				typeId : $("#relationshipType").attr("realValue"),
				orderId : $("#CoderderId").val(),
				//name : $("#allocationName").attr("value"),
				prevStep : $("#prevStep").attr("value"),
				prevStepExpression : $("#prevStepExpression").attr("value"),
				nextStep : $("#nextStep").attr("value"),
				nextStepExpression : $("#nextStepExpression").attr("value")
			},
			dataType : "json",
			async : false,
			success : function(pr, textStatus) {
				if (pr.success) {
					$("#formDialog").dialog("close");
					zTreeOnClick();
				}
			}
		});
	}
	function deleteRow() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		//将数组转换为字符串
		if(selectRow.length==0){
			alert("请选择数据进行操作！");
			return false;
		}
		if(confirm("确定执行删除操作？")){
			var rows = $('#dataGridDiv').datagrid('getSelections');
			var ids = "";
			$.each(rows,function(i,n){
				if(ids == ""){
					ids = n.id;
				}else{
					ids = ids+","+n.id;
				}
			});
			$.ajax({
				url : basePath + "bpmnAction/templateCode/deletePersonnelAllocationByIds.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {
					"ids" : ids
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					alert(pr.message);
					if (pr.success) {
						zTreeOnClick();
					}
				}
			}); 
		}
	}
</script>
</head>
<body class="easyui-layout">
	<div data-options="region:'west',split:true"
		style="width: 220px; padding: 10px;">
		<div class="zTreeDemoBackground left">
			<ul id="tree" class="ztree"></ul>
		</div>
	</div>
	<div data-options="region:'center'" >
		<div style="margin: 6px;">
		<div class="boxOperList" style="height: 36px; margin-bottom: 16px;">
			<span id="btn_task_add" class="i_21"
				onclick="javascript:openFormWin(0)">新建</span> <span id="btn_task_edit"
				class="i_24" onclick="javascript:openFormWin(1)">修改</span> <span
				id="btn_task_del" class="i_22" onclick="javascript:deleteRow()">删除</span>
			<div class="clear"></div>
		</div>
		</div> 
		
		 	<div class="box_rightTopTool">
				<div class="boxToolIn">
				 <form id="queryform" class="query"  method="post" >
					<div class="infoIn">
						<span class="name">名称：</span>
						<div class="textIn2"><input class="easyui-textbox" type="text" name="task_code"></div>
					
						<span><a href="javascript:void(0);" class="easyui-linkbutton" iconCls="icon-search" onclick="zTreeOnClick()">查询</a></span>
						<div class="clear"></div>
					</div>
					</form>
					</div>
				</div>
			
		
		<div class="boxSection noborder boxGui">
			<div class="boxTit">
				<div class="boxTitIcon i_11"></div>
				<div class="boxTitdes" id="boxTableName">人员配置定义</div>
				<span class="wordDes"></span>
			</div>
		</div>
		<div id="dataGridDiv"></div>
		</div>
	</div>
	<div id="formDialog" title="代码流程类型" class="easyui-window" title="回复"
		style="width: 620px; height: 450px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false">
		<div class="tableData_3 noborder bgGray bgGray ptb10">
		<form id="dataForm">
			<table width="100%">
			<!-- 代码表id -->
			<input id="Codeid" type="hidden">
			<!-- 提交标记 -->
			<input id="Codeflag" type="hidden">
			<!-- 范围表达式 -->
			<input id="prevStepExpression" type="hidden">
			<!-- 主体表达式 -->
			<input id="nextStepExpression" type="hidden">
			<!-- 父类id -->
			<input id="superId"  type="hidden" >
			<tr>
				<td width="20%" align="right">关系:</td>
				<td align="left"><input type="text" id="relationshipType" disabled="disabled" readonly="readonly" style="width:360px;" ></td>
			</tr>
			<!-- <tr>
				<td width="40%" align="right">配置名称:</td>
				<td ><input type="text" id="allocationName" /></td>
			</tr> -->
			<tr>
				<td align="right">范围:</td>
				<td >
					<!-- <input type="text" id="prevStep" disabled="disabled" readonly="readonly"/> -->
					<textarea style="width:360px;height:80px;" id="prevStep" name="My_Story:" disabled="disabled" readonly="readonly"></textarea>
					<font
						class="high" style="color: red" size="2">&nbsp;*&nbsp;&nbsp;</font><label id="prevSelect"  ><u ><a style= "cursor:pointer; ">选择</a></u></label>
				</td>
			</tr>
			<tr>
				<td align="right">主体:</td>
				<td >
					<!-- <input type="text" id="nextStep" disabled="disabled" readonly="readonly"/> -->
					<textarea style="width:360px;height:80px;" id="nextStep" name="My_Story:" disabled="disabled" readonly="readonly"></textarea>
					<font
						class="high" style="color: red" size="2">&nbsp;*&nbsp;&nbsp;</font><label id="nextSelect" ><u><a style= "cursor:pointer; ">选择</a></u></label>
				</td>
			</tr>
			<tr>
					<td width="20%" align="right">排序号：</td>
					<td align="left"><input type="text" id="CoderderId" style="width:360px;"></td>
				</tr>
		</table>
		</form>
			<div class="alFbtnBox alignC" style="margin-top:20px;">
				<span class="btn" onclick="saveForm()">确定</span> 
				<span class="btn" onclick="javascript:$('#formDialog').dialog('close')">关闭</span>
			</div>
		</div>
	</div>
	<div id="defPrevAllocation" title="范围" class="easyui-window" title="回复"
		style="width: 620px; height: 450px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false"></div>
	<div id="defNextAllocation" title="主体" class="easyui-window" title="回复"
		style="width: 620px; height: 450px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false"></div>
</body>
</html>
