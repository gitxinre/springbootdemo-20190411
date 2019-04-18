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
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
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
	var year = '<%=request.getParameter("year")%>';	
	var province = '<%=request.getParameter("province")%>'=="null"?'':'<%=request.getParameter("province")%>';	
	$(function(){
		//var h=document.body.offsetHeight;
		var h=document.documentElement.clientHeight;
		var dh=h-200;
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
		    fit:true,
			method: 'post',
		    columns:[[
		        //{field:'c_k',checkbox:true,width:100,height:'100%'},
		        {field:'name',title:'名称',width:100},
		       	{field:'category',title:'分类',width:70,align:'center'},
		        {field:'version',title:'版本',width:70,align:'center'},
		        {field:'createTimeStr',title:'创建时间',width:100,align:'center'},
		        {field:'modifyTimeStr',title:'修改时间',width:70,align:'center'},
		        {field:'deployStateStr',title:'部署状态',width:70,align:'center'},
		        {field:'versionStateStr',title:'版本状态',width:70,align:'center'}
		    ]]
		});
		loadCategoryTree();
		$('#categoryTree').tree({
			 onClick: function(node){
				$('#dataGridDiv').datagrid('clearSelections');
				$('#dataGridDiv').datagrid('load',{category : node.id});
			} 
		});
	});
	//监听窗口大小变化
	 $(window).resize(function(){  
        setTimeout(domresize,200);
         });
	/* window.onresize = function(){
		setTimeout(domresize,200);
	}; */
	//改变表格宽度
	function domresize(){
		$('#dataGridDiv').datagrid('resize',{  
			width:($("body").width()-240)*0.98
		});
		var h=document.documentElement.clientHeight;
		var dh=h-200;
		document.getElementById('dataGridDiv').style.height=dh+'px';
	}
	function loadCategoryTree() {
		$('#categoryTree').tree({url: basePath+'bpmnAction/tempCategory/findTempCategoryTree.do?tokenid=${param.tokenid}&deptId=${HqoaConstants.APP_USERINFO_BEAN}&province='+province+'&year=<%=request.getParameter("year")%>',required: true,cascadeCheck:false,onLoadSuccess: function(){
			
			var node = $('#categoryTree').tree('find',$.trim($("#myname").val()));
			if(node){
		            //打开当前添加的节点到根节点之间的所有节点
                    $('#categoryTree').tree('expandTo',node.target);
				    $('#categoryTree').tree('select', node.target);
		            zTreeOnClick();
			}
		}
});
		
        
	}
	function zTreeOnClick() {
		var treeNode = $('#categoryTree').tree('getSelected');
		$('#dataGridDiv').datagrid('clearSelections');
		$('#dataGridDiv').datagrid('load',{category : treeNode.id});
	}
	function openFormWin(hasUpdate) {
	    var treeNode = $('#categoryTree').tree('getSelected');
	    if (treeNode==null){
	    	alert('请选择节点');
			return;
	    }
		var pTreeNode = treeNode;
		if(hasUpdate==1){
			pTreeNode = $('#categoryTree').tree('getParent',treeNode.target);
		}
		
		$('#dataForm').form('clear');
		$("#provinceId").val(province);
		$("#category").removeAttr("readonly");
		$('#categoryMenuContent').combotree({url: basePath+'bpmnAction/tempCategory/findTempCategoryTree.do?tokenid=${param.tokenid}',required: true,cascadeCheck:false,onLoadSuccess:function(){
			$('#categoryMenuContent').combobox('setValue',pTreeNode.id);
			$('#categoryMenuContent').combobox('setText',pTreeNode.text);
        }});
		if(hasUpdate==1){
			$.ajax({
				url : basePath+"bpmnAction/tempCategory/selectTempCategoryByCategoryGetCategory.do?tokenid=${param.tokenid}",
				type : "POST",
				data : "category=" + treeNode.id,
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					$("#myname").attr("value", pr.result.name);
					$("#category").attr("value", pr.result.category);
					$("#description").attr("value", pr.result.description);
					$("#id").attr("value", pr.result.id);
					$("#category").attr("readonly","true");
					$("#orderId").attr("value", pr.result.orderId);
					$("#provinceId").attr("value", pr.result.province);
					if(pr.result.pdKey != null){
						$("#pdKey").attr("value", pr.result.pdKey);
					}
				}
			});
		}
		$("#formDialog").dialog("open");
		
	}
	function saveForm() {
		if ($.trim($("#myname").val()) == '') {
			$("#myname").focus();
			alert('名称不能为空');
			return;
		}
		if ($.trim($("#category").val()) == '') {
			$("#category").focus();
			alert('类型不能为空');
			return;
		}else{
			   var reg = new RegExp("^[0-9]*$");  
			   if(reg.test($.trim($("#category").val()))){
				   $("#category").focus();
			        alert("类型不能为数字!");  
			        return;
			    } 
		}
		if ($.trim($("#pdKey").val()) == '') {
			$("#pdKey").focus();
			alert('路程ID不能为空');
			return;
		}
		if (!isNaN($.trim($("#orderId").val()))) {
		} else {
			alert("排序号请输入正确的数字！");
			$("#orderId").focus();
			return;
		}
		var treeNode = $('#categoryTree').tree('getSelected');
		var taskRangeObj = $("#categoryMenuContent").combotree("getValues");
		if($("#id").val()==""){//新增
			$.ajax({
				url : basePath +"bpmnAction/tempCategory/addTempCategory.do?tokenid=${param.tokenid}",
				type : "POST",
				data : "name=" + $.trim($("#myname").val()) + "&category="
						+ $.trim($("#category").val()) + "&parentId="
						+ taskRangeObj + "&description="
						+ $.trim($("#description").val()) 
						+ "&pdKey="+ $.trim($("#pdKey").val()) 
						+ "&province="+$.trim($("#provinceId").val()) 
						+"&orderId="+ $.trim($("#orderId").val())+"&deptId=${HqoaConstants.APP_USERINFO_BEAN}",
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					alert(pr.message);
					// 添加成功，关闭弹出框，刷新树
					if (pr.success) {
						$("#formDialog").dialog("close");
						loadCategoryTree();
					}
				}
			});
		}else{
			$.ajax({
				url : basePath +"bpmnAction/tempCategory/modifyTempCategory.do?tokenid=${param.tokenid}",
				type : "POST",
				data : "id=" + $("#id").val() + "&pcategory="
						+ taskRangeObj + "&category="
						+ $("#category").val() + "&name=" + $("#myname").val()
						+ "&description=" + $("#description").val()
						+ "&pdKey=" + $("#pdKey").val()
						+ "&oldCategory=" + treeNode.id
						+ "&province="+$.trim($("#provinceId").val()) 
						+ "&orderId=" + $.trim($("#orderId").val()),
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					alert(pr.message);
					// 修改成功就关闭 框，并且刷新树
					if (pr.success) {
						$("#formDialog").dialog("close");
						loadCategoryTree();
					}
				}
			});
		}
	}
	function zTreeDelete() {
		var treeNode = $('#categoryTree').tree('getSelected');
		// 是文件夹就不能删除，有子类文件也不能删除
		 //if (nodes.length < 1) {
		if (treeNode==null){
			alert('请选择节点');
			return;
		} 
		/* if ($('#categoryTree').tree('getParent',treeNode.target)) {
			alert('父类不能删除！');
			return;
		}  */
		//判断是否为叶子节点
		if($('#categoryTree').tree('isLeaf',treeNode.target)){
			//是叶子节点则可以删除
			if (confirm("确认删除" + treeNode.text + "吗?")) {
				$.ajax({
					url : basePath+"bpmnAction/templateDef/deleteCategoryValidateByCategory.do?tokenid=${param.tokenid}",
					type : "POST",
					data : "category=" + treeNode.id,
					dataType : "json",
					async : false,
					success : function(pr, textStatus) {
						alert(pr.message);
						if (pr.success) {
							//删除指定节点
							//zTree.removeNode(treeNode);
							$('#categoryTree').tree('getSelected',treeNode.target);
							//刷新树
							loadCategoryTree();
						}
					}
				});
			}
		}
		else{
			alert('父类不能删除！');
			return;
		}
	}
	function addTempDef() {
		   
		 // 增加的时候要把分类也传进去
		var treeNode = $('#categoryTree').tree('getSelected');
	    if (treeNode==null){
	    	alert('增加模版定义的时候必须选择一个分类！');
			return;
	    }
	    var parentNode = $('#categoryTree').tree('getParent',treeNode.target);
		if(parentNode==null){
			 alert("分类不能为父节点！");
			 return;
		}
		 var category = treeNode.id;
		 $.ajax({
				url : basePath+"bpmnAction/tempCategory/selectTempCategoryByCategoryGetCategory.do?tokenid=${param.tokenid}",
				type : "POST",
				data : "category=" + treeNode.id,
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					var pdKey = pr.result.pdKey;
					var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?pdKey="+pdKey+"&category="+category+"&province="+province;
					if(tokenID){
						window.open(src+"&tokenid="+tokenID, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes"); 
					 }else{
						 window.open(src, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes"); 
					 }
				}
			});
	}

	function editTempDef() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		var treeNode = $('#categoryTree').tree('getSelected');
		//将数组转换为字符串
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
		var id = rowData.id;
		var category = treeNode.id;
	    var deployStateStr= rowData.deployStateStr;
	    var deployState;
	    if(deployStateStr=="已部署"){
	    	deployState="0";
	    }else{
	    	deployState="1";
	    }
	    var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?id="+id+"&deployState="+deployState+"&category="+category+"&province="+province;
	    if(tokenID){
			 window.open(src+"&tokenid="+tokenID, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
		 }else{
		     window.open(src, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
		 }
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
    	zTreeOnClick();
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
	    	zTreeOnClick();
	    }
	}
	function importTempDef() {
		$('#categoryTreeImp').combotree({url: basePath+'bpmnAction/tempCategory/findTempCategoryTree.do?tokenid=${param.tokenid}&province=<%=request.getParameter("province")%>&year=<%=request.getParameter("year")%>',required: true,cascadeCheck:false,onLoadSuccess:function(){
		},onSelect:function(recode){
			$("#categoryImp").attr("value",recode.text);
			$("#realValueImp").attr("value",recode.id);
			$("#pdKeyImp").attr("value",recode.attributes.pdkey);
		}});
		$("#importWin").dialog("open");
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
		var treeNode = $('#categoryTree').tree('getSelected');
		var category = treeNode.id;
		var src=basePath+"hqbpmn/processinstance/processManageList.jsp?category="+category;
		if(tokenID){
			window.open(src+"&tokenid="+tokenID, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
		}else{
			window.open(src, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
		}
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
			/* data : { 
				categoryValue : v,
				pdKey : pdKey
			}, */
			//multipart form-data类型的时候 request.getParameter取不到数据
			url : basePath+"bpmnAction/templateDef/importTemplate.do?tokenid=${param.tokenid}&categoryValue="+v+"&pdKey="+pdKey,
			success: function (responseText, statusText, xhr, $form)
	        {
	        	alert(responseText.message);
				// 导入成功，关闭弹出框
				if (responseText.success) {
					$("#realValueImp").attr("value","");
					$("#pdKeyImp").attr("value","");
					$("#categoryImp").attr("value","");
					$("#importWin").dialog("close");
					zTreeOnClick();
				}
	        }
		});
		return true;
	}
</script>
</head>
<body class="easyui-layout">
	<div data-options="region:'west',split:true"
		style="width: 250px; padding: 10px;">
		<div class="boxOperListSmall" style="height: 36px; margin-bottom: 16px;">
			<span id="btn_task_add" class="i_21"
				onclick="javascript:openFormWin(0)">新建</span> <span id="btn_task_edit"
			    onclick="javascript:openFormWin(1)">修改</span> <span
				id="btn_task_del" onclick="javascript:zTreeDelete()">删除</span>
			<div class="clear"></div>
		</div>
		<div class="zTreeDemoBackground left">
			<!--  <ul id="tree" class="ztree"></ul>-->
			<ul id="categoryTree"></ul>  
		</div>
	</div>
	<div data-options="region:'center'">
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
	<!-- 	<div class="box_rightTopTool">
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
			</div> -->
		<div class="boxSection noborder boxGui" style="height: 36px;">
			<div class="boxTit">
				<div class="boxTitIcon i_11" style="height: 36px;"></div>
				<div class="boxTitdes" id="boxTableName">流程模版定义</div>
				<span class="wordDes"></span>
			</div>
		</div>
		<div id="dataGridDiv"></div>
		</div>
	</div>
	<div id="formDialog" title="流程类型" class="easyui-window" title="回复"
		style="width: 620px; height: 450px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false">
		<div class="tableData_3 noborder bgGray bgGray ptb10">
		<form id="dataForm">
		    <!-- 类型表id -->
		    <input id="id"  type="hidden" >
		    <!-- 提交标记 -->
		    <input id="flag"  type="hidden" >
			<table width="100%">
			<tr>
			    <td width="20%" align = "right">名称:</td>
				<td><input id='myname' name='myname' value=''  style="width:280px;"/><font class="high" style="color: red" size="2" >&nbsp;*</font></td>
			</tr>
		    <tr>
				<td align="right">上级名称:</td>
				<td><select id="categoryMenuContent" class="easyui-combobox" style="width:280px;" name="categoryMenuContent"></select><font class="high" style="color: red" size="2">&nbsp;*</font></td>
		    </tr>
		    <tr>
		    <td align = "right">类型:</td>
				<td><input type='text' id='category' name='category' style="width:280px;"><font class="high" style="color: red" size="2">&nbsp;*</font><font class="high" style="color: red">&nbsp;&nbsp;防止乱码，请用英文</font></td>
		    </tr>
		    <td align = "right">流程ID:</td>
				<td><input type='text' id='pdKey' name='pdKey' style="width:280px;"><font class="high" style="color: red" size="2">&nbsp;*</font><font class="high" style="color: red">&nbsp;&nbsp;请以英文字母开头</font></td>
		    </tr>
		    <td align = "right">区划:</td>
				<td><input type='text' id='provinceId' name='province' style="width:280px;"></td>
		    </tr>
		    <tr>
		    <td align = "right">描述:</td>
				<td><textarea id='description' name='description' style="width:280px;height:80px;"></textarea></td>
			</tr>
			<tr>
		    <td align = "right">排序号:</td>
				<td><input type='text' id='orderId' name='orderId' style="width:280px;"></td>
		    </tr>
		</table>
		</form>
			<div class="alFbtnBox alignC" style="margin-top:20px;">
				<span class="btn" onclick="saveForm()">确定</span> 
				<span class="btn" onclick="javascript:$('#formDialog').dialog('close')">关闭</span>
			</div>
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
				<tr style="display:none">
					<td class="alignR nameIn">部门ID：</td>
					<td class="alignL"><input type="hidden" id="deptId" style="width:220px;"></td>
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
