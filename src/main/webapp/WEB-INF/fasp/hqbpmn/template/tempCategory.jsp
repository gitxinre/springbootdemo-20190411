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
    <link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css">
	<link href="${myBasePath}hqbpmn/style/css/layout.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<title>新版流程类型</title>
<script type="text/javascript">
    var basePath = "${myBasePath}";
    var tokenID="${param.tokenid}";
    $(function(){
	    $("#treeGridTable").treegrid({
	     	      url :basePath+'bpmnAction/tempCategory/findTempCategoryTreeGrid.do?tokenid=${param.tokenid}',
	     	rownumbers: true,
	 		idField   : 'id',
	 		treeField : 'text',
	 		 columns  :[[    
	 		           {field:'text',title:'名称',width:532},    
	 		          /*  {field:'pid',title:'上级名称',width:240,align:'center'},   */  
	 		           {field:'description',title:'描述',width:532},
	 		           {field:'id',title:'操作',width:300,formatter:function(value,rowData,rowIndex){
	 		        	  	var a;
							if(rowData.pid == "bpmn"){
	 		        			a="<a href='#'>新建</a>&nbsp&nbsp<a href='#'>修改</a>&nbsp&nbsp<a href='#'>删除</a>";
	 		        	   	}else{
	 		        		   	if(rowData.leafNode){
									a="<a href='#'>修改</a>&nbsp&nbsp<a href='#'>删除</a>&nbsp&nbsp<a href='#' onclick=\"openTemDefine('"+rowData.id+"')\">查看流程定义</a>";
	 		        		   	}else{
	 		        		   		a="<a href='#'>新建</a>&nbsp&nbsp<a href='#'>修改</a>&nbsp&nbsp<a href='#'>删除</a>";
	 		        		   	}
	 		        	   	}
	 		        	   	return a; 
	 		           }}
	 		           
	 		       ]],
	 		onloadsucess:function(){
	 			 $("#treeGridTable").css("height",$("body").width()); 
	 		}
	     });
	     $("#treeGridTable").css("height",$("body").width()); 
		//监听窗口大小变化
		window.onresize = function(){
			setTimeout(domresize,200);
		};
		//改变表格宽高
		function domresize(){
			$('#treeGridTable').datagrid('resize',{  
				width:$("body").width()
			});
		}
    });
    function openTemDefine(category){
    	var src=basePath+"hqbpmn/template/tempDefine.jsp?bpmnType="+category;
    	if(tokenID){
    		window.open(src+"&tokenid="+tokenID, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
    	}else{
    		window.open(src, "_blank", "width="+(window.screen.availWidth)+",height="+(window.screen.availHeight)+ ",top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes");
    	}
    	
    }
</script>
</head>
<body>
		<div class="boxSection noborder boxGui">
			<div class="boxTit">
				<div class="boxTitIcon i_11"></div>
				<div class="boxTitdes" id="boxTableName">流程分类</div>
				<span class="wordDes"></span>
			</div>
		</div>
	<table id="treeGridTable" style=""></table>
</body>
</html>