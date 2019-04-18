<%@ page language="java" contentType="text/html; charset=utf-8"
%>
<%
String realFirstPath = request.getServletPath().substring(1,request.getServletPath().length());
realFirstPath=realFirstPath.substring(0, realFirstPath.indexOf("/"));
request.setAttribute("myBasePath", request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"+realFirstPath+"/");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>流程日志信息</title>
<style>
  /**是否显示连线**/
  .hq_flow_line_text{display:none;}
</style>
<!--[if lt IE 9]>
<?import namespace="v" implementation="#default#VML" ?>
<![endif]-->

<link rel="stylesheet" type="text/css"
	href="${myBasePath}hqbpmn/jslib/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css"
	href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css">
<link href="${requestScope.myBasePath}hqbpmn/template/diagram/gooflow/css/GooFlow.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${requestScope.myBasePath}hqbpmn/template/diagram/gooflow/css/default.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${requestScope.myBasePath}hqbpmn/template/css/defination.css" rel="stylesheet" type="text/css" media="screen"/>
<link rel="stylesheet" type="text/css" media="screen" href="${requestScope.myBasePath}hqbpmn/jslib/zTree/zTreeStyle/zTreeStyle.css" media="screen" />
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/public.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/flow_core.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/json2.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.core-3.5.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.excheck-3.5.js" type="text/javascript" ></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.exedit-3.5.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/bpmnlog/js/modernizr.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/bpmnlog/js/spin.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/bpmnlog/subScanBpmnLog.js" type="text/javascript"></script>
<script type="text/javascript">
	var basePath="${myBasePath}";
    var pdKey = '<%=request.getParameter("pdKey")%>';
    var subStartTime = '<%=request.getParameter("subStartTime")%>';
    var ticketId = '<%=request.getParameter("ticketId")%>';
    var executionId = '<%=request.getParameter("executionId")%>';
    var bpmnType = '<%=request.getParameter("bpmnType")%>';
    var isShowNodeMessage = '<%=request.getParameter("isShowNodeMessage")%>';
    var isShowBackgroundGrid = '<%=request.getParameter("isShowBackgroundGrid")%>';
    var nodeId = '<%=request.getParameter("nodeId")%>';
    var tokenID = "${param.tokenid}";
</script>
</head>
<body>
	<div id = "myflowzi">
		<div id="GooFlow_work" class='GooFlow_work' style="margin:0;">
		    <div id="GooFlow_work_inner" class='GooFlow_work_inner'>
		    	<!--节点属性提示面板-->
			    <div id="divProperty" style="position:absolute;border:#C1DCFC solid 0px;"></div>
		    </div>
		</div>
	</div>
	<!-- Loading图片面板 -->
	<div id="preview"></div>
	<div id = "ziDialog"></div>
</body>
</html>
