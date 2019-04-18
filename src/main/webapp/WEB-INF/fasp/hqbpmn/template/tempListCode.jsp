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
<title>代码表维护</title>
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
					name : "name",
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
	$(function() {
	
		//var h=document.body.offsetHeight;
		var h=document.documentElement.clientHeight;
		var dh=h-220;
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
		    url:basePath+"bpmnAction/templateCode/selectCodeByTempType.do?tokenid=${param.tokenid}",
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
		    fit:true,
			method: 'post',
		    columns:[[
		        //{field:'c_k',checkbox:true,width:100},
		        {field:'id',title:'编码',width:100},
		    	{field:'codeName',title:'代码值',width:70,align:'center'},
		        {field:'codeKey',title:'代码键',width:70,align:'center'},
		        {field:'superId',title:'上级编码',width:100,align:'center'},
		        {field:'codeType',title:'代码类型',width:70,align:'center'},  
		        {field:'orderId',title:'排序号',width:70,align:'center'}
		    ]]
		});
		$.ajax({
			url : basePath + "bpmnAction/templateCode/findTempCode.do?tokenid=${param.tokenid}&deptId=${HqoaConstants.APP_USERINFO_BEAN}",
			type : "POST",
			data : "",
			dataType : "json",
			async : false,
			success : function(pr) {
				$.fn.zTree.init($("#tree"), setting, pr.result);
			}
		});
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
		var h=document.documentElement.clientHeight;
		var dh=h-250;
		document.getElementById('dataGridDiv').style.height=dh+'px';
		
	}
	function zTreeOnClick(event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("tree");
		nodes = zTree.getSelectedNodes();
		var treeNode = nodes[0];
		$('#dataGridDiv').datagrid('clearSelections');
		$('#dataGridDiv').datagrid('load',{type : treeNode.codeType});
	}
	function openFormWin(hasUpdate){
		$('#dataForm').form('clear');
		$("#Codeflag").attr("value", "addBpmnCode");
		// 增加的时候要把分类也传进去
		var zTree = $.fn.zTree.getZTreeObj("tree");
		var nodes = zTree.getSelectedNodes();
		if (nodes == "") {
			alert("请选择代码类型！");
			return;
		}
		var treeNode = nodes[0];
		$("#codeTypeCode").attr("value", treeNode.name);
		$("#codeTypeCode").attr("realValue", treeNode.codeType);
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
				url : basePath+ "bpmnAction/templateCode/selectCodeById.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {
					id : id
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					if (pr.success) {
						$("#Codeid").attr("value", id);
						$("#codeKey").attr("value", pr.result.codeKey);
						$("#codeName").attr("value", pr.result.codeName);
						$("#codeTypeCode").attr("value", treeNode.name);
						$("#superId").attr("value", pr.result.superId);
						$("#codeTypeCode").attr("realValue", treeNode.codeType);
						$("#CoderderId").attr("value", pr.result.orderId);
						$("#depId").attr("value", pr.result.deptId);
					}
				}
			});
		}
		$("#formDialog").dialog("open");
	}
	function saveForm() {
		if ($.trim($("#codeKey").attr("value")) == '') {
			alert('代码键不能为空');
			$("#codeKey").focus();
			return;
		}
		if ($.trim($("#codeName").attr("value")) == '') {
			alert('代码值不能为空');
			$("#codeName").focus();
			return;
		}
		if ($.trim($("#codeTypeCode").attr("value")) == '') {
			alert('代码类型不能为空');
			$("#codeTypeCode").focus();
			return;
		}
		if (!isNaN($.trim($("#CoderderId").val()))) {
		} else {
			alert("排序号请输入正确的数字！");
			$("#CoderderId").focus();
			return;
		}
		var superId = $("#superId").attr("value");
		var url = basePath+"bpmnAction/templateCode/updateCodeById.do?tokenid=${param.tokenid}";
		if($("#Codeid").val()==""){//新增
			url = basePath+"bpmnAction/templateCode/addBpmnCode.do?tokenid=${param.tokenid}";
			superId = "#";
		}
		$.ajax({
			url : url,
			type : "POST",
			data : {
				id : $("#Codeid").attr("value"),
				codeKey : $("#codeKey").attr("value"),
				codeName : $("#codeName").attr("value"),
				codeType : $("#codeTypeCode").attr("realValue"),
				superId : superId,
				orderId : $("#CoderderId").attr("value"),
				deptId : "${HqoaConstants.APP_USERINFO_BEAN}"
			},
			dataType : "json",
			async : false,
			success : function(pr, textStatus) {
				alert(pr.message);
				if (pr.success) {
					$("#formDialog").dialog("close");
					$('#dataGridDiv').datagrid('reload');
				}
			}
		});
	}
	function deleteRow() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		//将数组转换为字符串
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		if(confirm("您确认要这样操作？")){
			var row = $('#dataGridDiv').datagrid('getSelected');
			var id = row.id;
			$.ajax({
				url : basePath
						+ "bpmnAction/templateCode/deleteCodeById.do?tokenid=${param.tokenid}",
				type : "POST",
				data :{
					id : id
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					alert(pr.message);
					if (pr.success) {
						$('#dataGridDiv').datagrid('reload');
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
		<div class="boxSection noborder boxGui">
			<div class="boxTit">
				<div class="boxTitIcon i_11"></div>
				<div class="boxTitdes" id="boxTableName">代码值列表</div>
				<span class="wordDes"></span>
			</div>
		</div>
		<div id="dataGridDiv"></div>
		</div>
	</div>
	<div id="formDialog" title="代码流程类型" class="easyui-window" title="回复"
		style="width: 520px; height: 360px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false">
		<div class="tableData_3 noborder bgGray bgGray ptb10">
		<form id="dataForm">
			<table border="0" cellpadding="10" cellspacing="0" class="itTable" >
				<!-- 代码表id -->
				<input id="Codeid" type="hidden">
				<!-- 提交标记 -->
				<input id="Codeflag" type="hidden">
				<!-- 父类id -->
				<input id="superId" type="hidden">
				<tr>
					<td class="alignR nameIn">代码值:</td>
					<td class="alignL"><input type="text" id="codeName" /><font
						class="high" style="color: red" size="2">&nbsp;*</font></td>
				</tr>
				<tr>
					<td class="alignR nameIn">代码键:</td>
					<td class="alignL"><input type="text" id="codeKey" /><font
						class="high" style="color: red" size="2">&nbsp;*</font><font
						class="high" style="color: red" > 说明：为了防止乱码，请输入英文字符</font></td>
				</tr>
				<tr>
					<td class="alignR nameIn">代码类型:</td>
					<td class="alignL"><input type="text" id="codeTypeCode"
						readonly="readonly"></td>
				</tr>
				<tr>
					<td class="alignR nameIn">排序号：</td>
					<td class="alignL"><input type="text" id="CoderderId"
						maxlength="10"></td>
				</tr>
				<tr style="display:none">
					<td class="alignR nameIn">部门ID：</td>
					<td class="alignL"><input type="hidden" id="deptId" style="width:220px;"></td>
				</tr>
			</table>
		</form>
			<div class="alFbtnBox alignC" style="margin-top:20px;">
				<span class="btn" onclick="saveForm()">确定</span> 
				<span class="btn" onclick="javascript:$('#formDialog').dialog('close')">关闭</span>
			</div>
		</div>
	</div>
</body>
</html>
