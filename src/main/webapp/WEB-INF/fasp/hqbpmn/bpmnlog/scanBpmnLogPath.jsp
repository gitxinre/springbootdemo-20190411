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

<!-- <link href="${myBasePath}hqbpmn/jslib/jquery-plugin/tbar/css/jquery-wk.toolbar.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${myBasePath}hqbpmn/jslib/jqueryUILayout/css/jquery-ui-1.9.2.custom.min.css" rel="stylesheet" type="text/css" media="screen"/>--> 
<link href="${myBasePath}hqbpmn/template/diagram/gooflow/css/GooFlow.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${myBasePath}hqbpmn/template/diagram/gooflow/css/default.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${myBasePath}hqbpmn/template/css/defination.css" rel="stylesheet" type="text/css" media="screen"/>
<link rel="stylesheet" type="text/css" media="screen" href="${myBasePath}hqbpmn/jslib/zTree/zTreeStyle/zTreeStyle.css" media="screen" />
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/default/easyui.css" />
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css" />
<link href="${myBasePath}hqbpmn/style/css/base.css" rel="stylesheet" type="text/css" />
<link href="${myBasePath}hqbpmn/style/css/layout.css" rel="stylesheet" type="text/css" />
<!--<link rel="stylesheet" type="text/css" media="screen" href="${myBasePath}hqbpmn/jslib/jqgrid/themes/ui.jqgrid.css" /> -->

<script src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js" type="text/javascript"></script>

<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script>
<!--<script src="${myBasePath}hqbpmn/jslib/jquery-plugin/tbar/js/toolbar.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/jqueryUILayout/jquery-ui-1.9.2.custom.min.js" type="text/javascript"></script>-->
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/public.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/flow_core.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/json2.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.core-3.5.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.excheck-3.5.js" type="text/javascript" ></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.exedit-3.5.js" type="text/javascript"></script>
<!-- <script src="${myBasePath}hqbpmn/jslib/jqgrid/i18n/grid.locale-cn.js" type="text/javascript" ></script>
<script src="${myBasePath}hqbpmn/jslib/jqgrid/jquery.jqGrid.min.js" type="text/javascript" ></script> 
 -->
<script src="${myBasePath}hqbpmn/bpmnlog/js/modernizr.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/bpmnlog/js/spin.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/bpmnlog/scanBpmnLogPath.js" type="text/javascript"></script>
<script type="text/javascript">
	var basePath="${myBasePath}";
	
    var ticketId = '<%=request.getParameter("ticketId")%>';
    var bpmnType = '<%=request.getParameter("bpmnType")%>';
    var showLogType = '<%=request.getParameter("showLogType")%>';
    var perLineNodeNumber = '<%=request.getParameter("perLineNodeNumber")%>';
    var initStartNodeLeft = '<%=request.getParameter("initStartNodeLeft")%>';
    var initStartNodeTop = '<%=request.getParameter("initStartNodeTop")%>';
    
    var paintingWidth = '<%=request.getParameter("paintingWidth")%>';
    var paintingHeight = '<%=request.getParameter("paintingHeight")%>';
    var isShowNodeMessage = '<%=request.getParameter("isShowNodeMessage")%>';
    var isShowBackgroundGrid = '<%=request.getParameter("isShowBackgroundGrid")%>';
    var tokenID = "${param.tokenid}";
</script>

</head>
<body>
	<div id="myflow">
		<!--日志图区-->
		<div id="GooFlow_work"  class='GooFlow_work' style="margin:0;">
		    <div id="GooFlow_work_inner" class='GooFlow_work_inner'>
		    	<!--节点属性提示面板-->
			    <div id="divProperty" style="position:absolute;border:#C1DCFC solid 0px;width:600px;">
	    		</div>
		    </div>
		</div>
		<!-- Loading图片面板 -->
		<div id="preview"></div>
	</div>
</body>
</html>
