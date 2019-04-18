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
<title>自定义按钮维护</title>
<script type="text/javascript">
	var basePath = "${myBasePath}";
	var tokenID = "${param.tokenid}";
	var deptId="${HqoaConstants.APP_USERINFO_BEAN}";
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
		    url:basePath+"bpmnAction/templateCustomButton/findTempCustomButton.do?tokenid=${param.tokenid}",
		    idField:'id',    
		    singleSelect:true,
		    fitColumns : true,
			rownumbers: true,
			animate: false,
			collapsible: false,
			pagination:true,
			showRefresh:false,
			pageSize: 20,//每页显示的记录条数，默认为15
			pageList: [20,40,60],//可以设置每页记录条数的列表 
		    pagePosition:'bottom',
		    fit:true,
		    striped:true,
			method: 'post',
			queryParams: {
				deptId:deptId
			},
		    columns:[[
		        //{field:'c_k',checkbox:true,width:100},
		        {field:'id',title:'编码',width:100},
		       	{field:'buttonName',title:'按钮名称',width:70,align:'center'},
		        {field:'buttonKey',title:'按钮键',width:70,align:'center'},
		        {field:'buttonType',title:'按钮类型',width:100,align:'center'},
		        {field:'buttonOrder',title:'排序号',width:70,align:'center'},  
		        {field:'jsFunction',title:'js函数',width:70,align:'center'}
		    ]]
		});
	});
	//监听窗口大小变化
	 $(window).resize(function(){  
        setTimeout(domresize,200);
         });
	//改变表格宽高
	function domresize(){
		$('#dataGridDiv').datagrid('resize',{  
			//width:($("body").width()-240)*0.98
		});
		var h=document.documentElement.clientHeight;
		var dh=h-220;
		document.getElementById('dataGridDiv').style.height=dh+'px';
	}
	function openFormWin(hasUpdate){
		$('#dataForm').form('clear');
		$("#buttonType").val(0);
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
				url : basePath+ "bpmnAction/templateCustomButton/selectTempCustomButtonById.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {
					id : id
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					if (pr.success) {
						$("#id").attr("value", id);
						$("#buttonName").attr("value", pr.result.buttonName);
						$("#buttonKey").attr("value", pr.result.buttonKey);
						$("#buttonType").attr("value", pr.result.buttonType);
						$("#buttonOrder").attr("value", pr.result.buttonOrder);
						$("#jsFunction").attr("value", pr.result.jsFunction);
					}
				}
			});
		}
		$("#formDialog").dialog("open");
	}
	function saveForm() {
		if($.trim($("#buttonName").val())==""){
			alert("请输入按钮名称！");
			$("#buttonName").focus();
			return false;
		}
		if($.trim($("#buttonKey").val())==""){
			alert("请输入按钮键！");
			$("#buttonKey").focus();
			return false;
		}
		var url = basePath+"bpmnAction/templateCustomButton/updateTempCustomButtonById.do?tokenid=${param.tokenid}";
		if($("#id").val()==""){//新增
			url = basePath+"bpmnAction/templateCustomButton/addBpmnTempCustomButton.do?tokenid=${param.tokenid}";
		}
		$.ajax({
			url : url,
			type : "POST",
			data : {
				id : $("#id").attr("value"),
				buttonName : $("#buttonName").attr("value"),
				buttonKey : $("#buttonKey").attr("value"),
				buttonType : $("#buttonType").attr("value"),
				buttonOrder : $("#buttonOrder").attr("value"),
				jsFunction: $("#jsFunction").attr("value"),
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
			var buttonKey=row.buttonKey;
		    var deptId=row.deptId;
			$.ajax({
				url : basePath
						+ "bpmnAction/templateCustomButton/deleteTempCustomButtonById.do?tokenid=${param.tokenid}",
				type : "POST",
				data :{
					id : id,
					buttonKey:buttonKey,
					deptId:deptId
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
<body>
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
				<div class="boxTitdes" id="boxTableName">自定义按钮维护</div>
				<span class="wordDes"></span>
			</div>
		</div>
		<div id="dataGridDiv"></div>
		</div>
	<div id="formDialog" title="代码流程类型" class="easyui-window" title="回复"
		style="width: 520px; height: 360px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false">
		<div class="tableData_3 noborder bgGray bgGray ptb10">
		<form id="dataForm" name="dataForm">
			<table border="0" cellpadding="10" cellspacing="0">
				<!-- 代码表id -->
				<input id="id" type="hidden">
				<!-- 提交标记 -->
				<input id="flag" type="hidden">
				<tr>
					<td class="alignR nameIn">按钮名称：</td>
					<td class="alignL"><input type="text" id="buttonName" maxlength="32" style="width:220px;" /><font
						class="high" style="color: red" size="2">&nbsp;*</font></td>
				</tr>
				<tr>
					<td class="alignR nameIn">按钮键：</td>
					<td class="alignL"><input type="text" id="buttonKey" maxlength="32" style="width:220px;" /><font
						class="high" style="color: red" size="2">&nbsp;*</font><font
						class="high" style="color: red" > 防止乱码，请用英文</font></td>
				</tr>
				<tr>
					<td class="alignR nameIn">按钮类型：</td>
					<td class="alignL"><select id="buttonType"   style="width:220px;">
						<option value='1' selected="selected">业务按钮</option>
						<option value='2'>批处理按钮</option>
						<option value='3'>自定义流转线属性</option>
						<option value='4'>业务条件</option>
					</select></td>
				</tr>
				<tr>
					<td class="alignR nameIn">排序号：</td>
					<td class="alignL"><input type="text" id="buttonOrder" maxlength="10"  style="width:220px;"></td>
				</tr>
				<tr>
					<td class="alignR nameIn">函数：</td>
					<td class="alignL"><input type="text" id="jsFunction" style="width:220px;"></td>
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
