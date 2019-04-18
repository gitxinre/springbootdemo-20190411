<%@page contentType="text/html;charset=UTF-8"%>
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
<title>工作流模板定义</title>
<style>
  /**是否显示连线**/
  .hq_flow_line_text{display:none;}
  .bpmn_candidateStartUsers{display:none;}
  .general_candidateUsers{display:none;}
  .extendConfig_candidateUser{display:none;}
  .bpmn_candidateStartGroups{display:none;}
  .general_candidateGroups{display:black;}
  .extendConfig_candidateGroup{display:none;}
  /*是否显示会签节点处理组*/
  .extendConfig_collectionGroup{display:black;}
   /*线上处理人/组是否显示 */
  .extendConfig_candidateUserAndGroup{display:black;}
  /**是否显示处理人**/
  #hqbpmn_tabs_candidater{display:black;}
  /**是否显示提交人**/
  #hqbpmn_tabs_submitter{display:none;}
  /**是否显示发起人**/
  #hqbpmn_tabs_starter{display:none;}
</style>
<!--[if lt IE 9]>
<?import namespace="v" implementation="#default#VML" ?>
<![endif]-->
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css">
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/demo.css">
<link href="${myBasePath}hqbpmn/style/css/base.css" rel="stylesheet" type="text/css" />
<link href="${myBasePath}hqbpmn/style/css/layout.css" rel="stylesheet" type="text/css" />
<link href="${myBasePath}hqbpmn/template/css/defination.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${myBasePath}hqbpmn/template/diagram/gooflow/css/GooFlow.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${myBasePath}hqbpmn/template/diagram/gooflow/css/default.css" rel="stylesheet" type="text/css" media="screen"/>
<link href="${myBasePath}hqbpmn/jslib/zTree/zTreeStyle/zTreeStyle.css" rel="stylesheet" type="text/css" media="screen"/>

<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/public.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/flow_core.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/gooflow/js/json2.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.core-3.5.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.excheck-3.5.js" type="text/javascript" ></script>
<script src="${myBasePath}hqbpmn/jslib/zTree/jquery.ztree.exedit-3.5.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/defination.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/field_dict.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/definationProperty.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/common/uiUtil.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/lookup/lookUp.js" type="text/javascript"></script>
<script src="${myBasePath}hqbpmn/template/diagram/variableZtree.js" type="text/javascript"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/template/uploadJS/jquery.form.js"></script>

<script type="text/javascript">
	var basePath="${myBasePath}";
	var tokenID = "${param.tokenid}";
    var id='<%=request.getParameter("id")%>';
    var type='<%=request.getParameter("type")%>';
    var category = '<%=request.getParameter("category")%>';
    var pdKey = '<%=request.getParameter("pdKey")%>';
    var deployState = '<%=request.getParameter("deployState")%>';
    var province = '<%=request.getParameter("province")%>';
</script>
</head>
<body>
	<!--定义工具条
	<div id="toolbar" style="display:no"></div>-->
	<div class="boxSection boxGui" id="boxS">
		<div class="boxTit">
			<div class="boxTitIcon icon_1"></div>
			<div class="boxTitdes">
				流程设计器
			</div>
			<div class="rBtn">
				<% if("0".equals(request.getParameter("deployState"))){ %>
					<a class="easyui-linkbutton" data-options="plain:true" onclick="doSaveAs()">另存</a>	
					<a class="easyui-linkbutton" data-options="plain:true" onclick="doRedistribute()">重新部署</a>
				<%}else{ %>
					<a class="easyui-linkbutton" data-options="plain:true" onclick="doSave()">保存</a>
				<%} %>
				<a class="easyui-linkbutton" data-options="plain:true" onclick="copyProperty()">格式刷</a>
				<a class="easyui-linkbutton" data-options="plain:true" onclick="openChangeCanvasSize()">调整画布</a>
				<a class="easyui-menubutton" data-options="menu:'#mm2'">更多</a>
				<a class="easyui-linkbutton" data-options="plain:true" onclick="flowPro()">流程属性</a>
				<a class="easyui-linkbutton" data-options="plain:true" onclick="openAttention()">注意</a>
				
			</div>
			<div id="mm2" style="width:100px;display:none;">
				<div onclick="showMoveBpmn()">流程整体迁移</div>
				<div onclick="openImportTemplate()">导入模板</div>
				 <!--<div onclick="exportBpmnXml()">导出标准XML</div>
				<div onclick="processPic()">导出图片</div> -->
			</div>
		</div>
	</div>
	<!-- slider显示区域 -->
	<table id="moveBpmn" width="100%" style="display:none;margin-bottom:10px;">
		<tr>
			<td width = "10%" align="right">左</td>
			<td width = "25%" align="center">
				<div id="slider-range-min-leftAndRight" style="width:200px; margin:3px;"></div>
			</td>
			<td width = "10%" align="left">右</td>
			<td width = "10%" align="right">上</td>
			<td width = "25%" align="center">
				<div id="slider-range-min-upAndDown" style="width:200px; margin:3px;"></div>
			</td>
			<td width = "10%" align="left">下</td>
			<td width = "10%" align="right" style="padding:0px 50px 5px 0px;"><span class="bpmnDesignerbtnIn" onclick="showMoveBpmn()">关闭</span></td>
		</tr>
	</table>
	<div id="myflow">
		<div id="divTool" class="toolbox" style="float:left;width:100%;margin-top:-10px;">
			<div class="boxHeader">
				<div class="nav">
					<ul class="navIn" style="float:left;width:100%">
						<li><div id='btnSelect'  type='cursor'  class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_2.png" />选中</div></li>
						<li><div id='btnSequenceFlow' type='SequenceFlow' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_3.png" />连接线</div></li>
						<li><div id='btnStartEvent'        type='StartEvent'        class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_4.png" />开始</div></li>
						<li><div id='btnEndEvent'          type='EndEvent'          class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_5.png" />结束</div></li>
						<li><div id='btnUserTask'  type='UserTask'		class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_6.png" />节点</div></li>
						<li><div id='btnCountersign' type='Countersign' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_8.png">会签节点</div></li>
						<li><div id='btnExclusiveGateway'  type='ExclusiveGateway' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_9.png">条件</div></li>
						<li><div id='parallelgateway'  type='Parallelgateway' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_10.png">并行</div></li>
						<li><div id='btnInclusiveGateway' type='InclusiveGateway' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_inclusivegateway.png">兼容</div></li>
						<li><div id='btnSubprocess'  type='Subprocess' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_11.png">子流程</div></li>
						<%-- <li><div id='btnCallActivity' type='CallActivity' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/icon_12.png">引用流程</div></li> --%>
					</ul>
				</div>
			</div>
		</div>
		<!--工具箱面板-->    
		<!-- <div id="divTool" class="toolbox" style="float:left;width:90px;height:320px;">
			<h3>工具</h3>
			<div style="padding:5px;">
				<div id='btnSelect'  type='cursor'  class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/arrow.gif">选中</div>
			    <div id='btnSequenceFlow' type='SequenceFlow' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/ereference.gif">连接线</div>
			    <div id='btnStartEvent'        type='StartEvent'        class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/type.startevent.none.png">开始</div>
				<div id='btnEndEvent'          type='EndEvent'          class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/type.endevent.none.png">结束</div>
				<div id='btnUserTask'  type='UserTask'		class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/type.user.png">节点</div>
				<div id='btnCountersign' type='Countersign' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/countersign.png">会签节点</div>
				<div id='btnExclusiveGateway'  type='ExclusiveGateway' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/type.gateway.exclusive.png">条件</div>
				<div id='parallelgateway'  type='Parallelgateway' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/type.gateway.parallel.png">并行</div>
				<div id='btnSubprocess'  type='Subprocess' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/type.user.png">子流程</div>
				<div id='btnCallActivity' type='CallActivity' class="flatbtn"><img src="${myBasePath}hqbpmn/template/diagram/gooflow/img/marquee.gif">引用流程</div>
			</div>
		</div> -->
	    <!--定义画图区-->
		<div id='GooFlow_work' class='GooFlow_work' style="margin:0;">
		    <div id='GooFlow_work_inner' class='GooFlow_work_inner'></div>
		</div>
		<!--开始定义属性面板-->
		<div id="divProperty" class="property" style="position:fixed!important;border:0px solid #ccc;padding:0;margin-top:-10px;width:280px">
	    </div>
	</div>
	<!-- 调整工作区画布大小弹出层 -->
	<div id="changeCanvasSize" title="工作区画布调整" class="gzl003" style="display:none;">
		<center>
		    <table border="0" cellpadding="10" cellspacing="0">
			    <tr>
					<td >宽度:&nbsp;&nbsp;</td>
					<td >
						<input type='text' id='canvasWidth' name='canvasWidth'></input>
					</td>	
				</tr>
			    <tr>
				    <td >高度:&nbsp;&nbsp;</td>
					<td >
						<input type='text' id='canvasHeight' name='canvasHeight'></input>
					</td>
				</tr>
				<tr>
					<td align="center" colspan="2">
						<input id="validateWidthAndHeight" type="button" value="确定" style="vertical-align:middle; text-align:center" class="gzl004"/>
					    <input id="closeChangeCanvas" type="button" style="vertical-align:middle; text-align:center" value="取消" class="gzl004"/>
					</td>
		        </tr>
			</table>
		</center>
	</div>
	<form id="exportBpmnXml" method="post">
		<input id="contentBytesXml" name="contentBytes" type="hidden"/>
	</form>
	<!-- 流程上传弹出层 -->
	<div id="importTemplate" title="模板导入" class="gzl003" style="display:none;">
		<form name="form1" id="form1" action="" method="post" enctype="multipart/form-data">
		   <center>
		    <table border="0" cellpadding="10" cellspacing="0">
		    <input id="realValueImp" name="realValueImp"  type="hidden" value="${param.category}">
		    <tr style="height:40px;">
					<td >类型:</td>
					<td align="center">
					<input type="radio" name="importType" value="0"/>&nbsp;华青流程 &nbsp;&nbsp;<input type="radio" name="importType" value="1"/>&nbsp;标准xml
					</td>
				</tr>
			    <tr style="height:40px;">
			    <td >模板:</td>
					<td colspan="2"><input type='file' id='contentXML' name='contentXML'></td>
					<!-- <td colspan="2"><input type='file' id='contentXML' name='contentXML' class="input"></td> -->
				</tr>
				<tr style="height:40px;">
					<td align="center" colspan="3">
					    <input id="submitImportForm" name="submitImp" type="button" value="确定" style="vertical-align:middle; text-align:center" class="gzl004" />
					    <input id="closeImp" type="button" style="vertical-align:middle; text-align:center" value="取消" class="gzl004"/>
					</td>
		        </tr>
			</table>
			</center>
		</form>
	</div>
	<!-- 注意事项弹出层 -->
	<div id="attentionLayer" title="注意事项" class="gzl003" style="display:none;">
		   <center>
		     <div>
					<ul>
						<li><span style="float:left;text-align:left;">1、子流程的第一个任务节点不能设置退回，最后一个任务节点不能设置撤销</span></li>
						<li><span style="float:left;text-align:left;">2、当节点的出线有多条时，请一定要设置每条连线的条件，如果没有条件，请设置连线的默认条件，否则节点按照条件都符合并发执行。</span></li>
						<li><span style="float:left;text-align:left;">3、当子流程节点的下一个节点是普通任务节点的时候，该普通任务节点不能设置退回</span></li>
						<li><span style="float:left;text-align:left;">4、<font color="#86B22D">■</font>撤销；<font color="#2DB291">■</font>退回；<font color="##2D9CB2">■</font>撤销和退回;<font color="#ffc90e">■</font>有金黄色边框表示该节点是自由节点。</span></li>
						<!-- <li><span style="float:left;text-align:left;">4、<font color="#86B22D">■</font>撤销；<font color="#2DB291">■</font>退回；<font color="##2D9CB2">■</font>撤销和退回</span></li> -->
					</ul>
			 </div>
			</center>
	</div>
</body>
</html>
