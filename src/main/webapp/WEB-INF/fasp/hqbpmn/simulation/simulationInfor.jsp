<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%
String realFirstPath = request.getServletPath().substring(1,request.getServletPath().length());
realFirstPath=realFirstPath.substring(0, realFirstPath.indexOf("/"));
request.setAttribute("myBasePath", request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"+realFirstPath+"/");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>流程仿真</title>
<!-- <link href="${myBasePath}hqbpmn/jslib/jqueryUILayout/css/jquery-ui-1.9.2.custom.min.css" rel="stylesheet" type="text/css" media="screen"/> -->
<link href="${myBasePath}hqbpmn/jslib/zTree/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" media="screen"/>

<link href="${myBasePath}hqbpmn/simulation/simulationInfor.css" rel="stylesheet" type="text/css" media="screen"/>
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/default/easyui.css" />
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css" />
<link href="${myBasePath}hqbpmn/style/css/base.css" rel="stylesheet" type="text/css" />
<link href="${myBasePath}hqbpmn/style/css/layout.css" rel="stylesheet" type="text/css" />
<link href="${myBasePath}hqbpmn/template/css/defination.css" rel="stylesheet" type="text/css" media="screen"/>
<script src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js" type="text/javascript"></script>
<!-- <script src="${myBasePath}hqbpmn/jslib/jqueryUILayout/jquery-ui-1.9.2.custom.min.js" type="text/javascript"></script> -->
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.core-3.5.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.excheck-3.5.js" type="text/javascript" ></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.exedit-3.5.js" type="text/javascript"></script>



<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script>

<script src="${myBasePath}hqbpmn/simulation/simulationInfor.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/simulation/lookUp.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/common/uiUtil.js" type="text/javascript"></script>

<script type="text/javascript">
	var basePath="${myBasePath}";
	var bpmnType='<%=request.getParameter("bpmnType")%>';
	var ticketId='<%=request.getParameter("ticketId")%>';
	var userName='<%=request.getParameter("userName")%>';
</script>
</head>
<body>
     <input type="hidden" id="simTaskId"/>
     <input type="hidden" id="simTaskKey"/>
	<div id="processBtns" class="panel">
		<div class="buttonPanel"><label>启动按钮:</label><span id="startBtn"></span></div>
		<div class="buttonPanel"><label>连接线按钮:</label><span id="sequenceBtn"></span></div>
		<div class="buttonPanel"><label>业务定制按钮:</label><span id="businessCustomBtn"></span></div>
		<div class="buttonPanel"><label>扩展按钮:</label><span id="extendBpmnBtn"></span></div>
	</div>
	<div id="bpmnInfo" class="panel">
		<div id="bpmnType"><label>流程类型:</label></div>
		<div id="ticketId"><label>工单号:</label></div>
		<div id="userName"><label>用户名:</label></div>
		<div><label>流程状态:</label><span id="status"></span></div>
	</div>
	<div id="variable" class="panel">
	</div>
	<div id="privilege" class="panel">
	</div>
	<div id="extend" class="panel">
		<span id="showLog" class="metroBtn">查看日志</span>
	</div>
	<div id="dialogDiv">
	</div>
</body>
</html>