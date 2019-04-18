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
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/bpmn-common.js"></script>
<title>委托维护</title>
<script type="text/javascript">
	var basePath = "${myBasePath}";
	var tokenID = "${param.tokenid}";
	$(function() {
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
		    url:basePath+"bpmnAction/bpmnDelegate/selectAllBpmnDelegate.do?tokenid=${param.tokenid}",
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
			method: 'post',
		    columns:[[
		        //{field:'c_k',checkbox:true,width:100},
		        //{field:'id',title:'编码',width:100},
		       	{field:'userName',title:'委托人姓名',width:50,align:'center'},
		        /* {field:'bpmnType',title:'待办流程类型',width:70,align:'center'}, */
		        {field:'bpmnTypeName',title:'流程类型',width:150,align:'center',
		       		formatter: function(value,row,index){
		        		var firstString=value.substring(0,45);
		        		var arr=[];
		        		arr=firstString.split(",");
		        		var showValue = value.length>45?(arr[0]+"..."):value;
						return "<span title='"+value+"'>"+ showValue+"</span>";
				 }},
		        {field:'toUserName',title:'受托人姓名',width:150,align:'center',
					 formatter: function(value,row,index){
			        		var firstString=value.substring(0,45);
			        		var arr=[];
			        		arr=firstString.split(",");
			        		var showValue = value.length>45?(arr[0]+"..."):value;
							return "<span title='"+value+"'>"+ showValue+"</span>";
					 }},
		        {field:'startTime',title:'开始时间',width:50,align:'center'},  
		        {field:'endTime',title:'结束时间',width:50,align:'center'},
		        {field:'stateStr',title:'状态',width:20,align:'center',
			           formatter:function(value,rowData,rowIndex){
			        	    if(rowData.state=="1"){
			        	    	return '启用';
			        	    }else{
			        	    	return '停用';
			        	    }
			           }
			        }
		    ]]
		});
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
			$("#delegateId").val(id);
			$.ajax({
				url : basePath + "bpmnAction/bpmnDelegate/selectBpmnDelegateById.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {
					id : id
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					var mydata = pr.result;
					$('#startTime').datebox('setValue', mydata.startTime);
					$('#endTime').datebox('setValue', mydata.endTime);
					$('#state').val(mydata.state);
					$('#bpmnCategory').combotree({url: basePath+'bpmnAction/tempCategory/findTempCategoryTree.do?tokenid=${param.tokenid}',cascadeCheck:false,onLoadSuccess:function(){
						 var arrCategory = mydata.bpmnType.split(",");
					     var categoryValueArr = new Array();
					     for (var i = 0; i < arrCategory.length; i++) {
					    	 categoryValueArr.push(arrCategory[i]);
					     }
						$('#bpmnCategory').combotree('setValues',categoryValueArr);
					}});
					$('#delegateUser').combotree({url: basePath+'bpmnAction/templateDef/findBpmnUserTree.do?tokenid=${param.tokenid}',cascadeCheck:false,onLoadSuccess:function(){
						$('#delegateUser').combotree('setValue',mydata.userId);
					}});
					
					 var arr = mydata.toUserId.split(",");
				     var valueArr = new Array();
				     for (var i = 0; i < arr.length; i++) {
				       valueArr.push(arr[i]);
				     }
					$('#delegateToUser').combotree({url: basePath+'bpmnAction/templateDef/findBpmnUserTree.do?tokenid=${param.tokenid}',cascadeCheck:false,onLoadSuccess:function(){
						$('#delegateToUser').combotree('setValues',valueArr);
					}});
					$("#formDialog").dialog("open");
				}
			});
		}else{
			$("#dialogCodexx").attr("title", "添加委托");
			$('#bpmnCategory').combotree({url: basePath+'bpmnAction/tempCategory/findTempCategoryTree.do?tokenid=${param.tokenid}',cascadeCheck:false,onLoadSuccess:function(){
	        }});
			/* $('#delegateUser').combotree({url: basePath+'hqbpmn/templateDef/findBpmnUserTree.do?tokenid=${param.tokenid}',cascadeCheck:false,onLoadSuccess:function(){
	        }});
			$('#delegateToUser').combotree({url: basePath+'hqbpmn/templateDef/findBpmnUserTree.do?tokenid=${param.tokenid}',cascadeCheck:false,onLoadSuccess:function(){
				$("#formDialog").dialog("open");
			}}); */
	        $("#formDialog").dialog("open");
	    	$.ajax({
				url : basePath + "bpmnAction/templateDef/findBpmnUserTree.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {},
				dataType : "json",
				async : true,
				success : function(data, textStatus) {
					if(textStatus == "success"){
				    	 $('#delegateToUser').combotree(
				    			{
				    				data : data,
				    				valueField:'id',
				    				textField:'text'
				    				}); 
				    	 $('#delegateUser').combotree(
				    			{
				    				data : data,
				    				valueField:'id',
				    				textField:'text'
				    				});  
					}
				}
			});
		}
	}
	function saveForm() {
		//var _reTimeReg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
		var startTime = $('#startTime').datebox('getValue');
		if(startTime==""){
			alert("请输入开始时间！");
			return false;
		}
		/**
		if(!_reTimeReg.test($.trim($("#startTime").val()))){
			alert("开始时间格式应为yyyy-MM-dd HH:mm:ss");
			$("#startTime").focus();
			return false;
		}
		if(!_reTimeReg.test($.trim($("#endTime").val()))){
			alert("结束时间格式应为yyyy-MM-dd HH:mm:ss");
			$("#endTime").focus();
			return false;
		}
		**/
		var endTime = $('#endTime').datebox('getValue');
		if(endTime==""){
			alert("请输入结束时间！");
			return false;
		}
		var bpmnCategoryObj = $("#bpmnCategory").combotree("getValues");
		if(bpmnCategoryObj==null){
			alert("请输入工作流类型！");
			return false;
		}
		var delegateUserNode = $('#delegateUser').combotree('tree').tree('getSelected');
		if(delegateUserNode==null){
			alert("请输入委托人员！");
			return false;
		}
		var delegateToUserObj = $("#delegateToUser").combotree("getValues");
		if(delegateToUserObj==null){
			alert("请输入受托人员！");
			return false;
		}
		var data = {  
				userId : delegateUserNode.id,
				bpmnType : bpmnCategoryObj.join(","),
				toUserId : delegateToUserObj.join(","),
				startTime : startTime,
				endTime : endTime,
				state : $("#operateType").val(),
				id:$("#delegateId").val()
			};
		//序列化Data
		var jsondata = JSON.stringify(data);
		var jsondataTemp = JSON.parse(jsondata);
		if(typeof (jsondataTemp)=="string"){
			jsondata = jsondataTemp;
		}
		var jsonDataStr = jsondata;
		$.ajax({
			url : basePath + "bpmnAction/bpmnDelegate/saveOrUpdateDelegate.do?tokenid=${param.tokenid}",
			type : "POST",
			data :{jsonDataStr:jsonDataStr},
			dataType : "json",
			async : false,
			success : function(pr, textStatus) {
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
			alert("请选择一条数据进行操作！");
			return false;
		}
		if(confirm("您确认要这样操作？")){
			var row = $('#dataGridDiv').datagrid('getSelected');
			var id = row.id;
			$.ajax({
				url : basePath + "bpmnAction/bpmnDelegate/deleteBpmnDelegateById.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {
					id : id
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					$('#dataGridDiv').datagrid('reload');
				}
			});
		}
	}
	function modifyVersionState(versionState) {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		//将数组转换为字符串
		if(selectRow.length!=1){
			alert("请选择一条数据进行操作！");
			return false;
		}
		if(confirm("您确认要这样操作？")){
			var row = $('#dataGridDiv').datagrid('getSelected');
			var id = row.id;
			$.ajax({
				url:basePath+"bpmnAction/bpmnDelegate/modifyVersionStateById.do?tokenid=${param.tokenid}",    
				type:"POST",
				data:"id=" + id + "&versionState=" + versionState,  
				dataType:"json",
				async:false,
				success:function(pr, textStatus){
		        	 alert(pr.message);
		        	 $('#dataGridDiv').datagrid('reload');
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
				<span id="btn_task_edit" class="i_1"
			    onclick="javascript:modifyVersionState(1)">启用</span> <span class="i_32"
				id="btn_task_del" onclick="javascript:modifyVersionState(0)">停用</span>
			<div class="clear"></div>
		</div>
		<div class="boxSection noborder boxGui">
			<div class="boxTit">
				<div class="boxTitIcon i_11"></div>
				<div class="boxTitdes" id="boxTableName">委托规则列表</div>
				<span class="wordDes"></span>
			</div>
		</div>
		<div id="dataGridDiv"></div>
		</div>
	<div id="formDialog" title="代码流程类型" class="easyui-window" title="回复"
		style="width: 560px; height: 420px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false">
		<div class="tableData_3 noborder bgGray bgGray ptb10">
		<form id="dataForm" name="dataForm">
			<input type="hidden" id="delegateId">
			<input type="hidden" id="operateType">
			<input type="hidden" id="state">
			<table width="100%">
				<tr>
				<td width="28%" align = "right">开始时间</td>
				<td><input id="startTime" name="startTime" class="easyui-datebox" style="width:280px;"><font class="high" style="color: red" size="2" >&nbsp;*</font></td>
				</tr>
				<tr>
				<td align = "right">结束时间</td>
				<td><input id="endTime" name="endTime" class="easyui-datebox" style="width:280px;"><font class="high" style="color: red" size="2" >&nbsp;*</font></td>
				</tr>
				<td align = "right">流程类型</td>
				<td><input id="bpmnCategory" style="width:280px;" multiple><font class="high" style="color: red" size="2" >&nbsp;*&nbsp;&nbsp;</font></td>
				</tr>
				<td align = "right">委托人员</td>
				<td><input id="delegateUser" style="width:280px;"><font class="high" style="color: red" size="2" >&nbsp;* &nbsp;&nbsp;</font></td>
				</tr>
				<td align = "right">受托人员</td>
				<td><input id="delegateToUser" style="width:280px;" multiple><font class="high" style="color: red" size="2" >&nbsp;*&nbsp;&nbsp;</font></td>
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
