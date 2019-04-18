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
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/template/uploadJS/jquery.form.js"></script>
<script type="text/javascript">
	var basePath='${myBasePath}';
	var splitFlag = "H___Q";
	function confirmSubmit(){
		
		var busSysSelectValue=$("#busSysSelect").combobox("getValue");
		var busSysSelectText=$("#busSysSelect").combobox("getText");
		if(busSysSelectValue.length<1){
			alert("请选择一个业务系统！");
			document.getElementById("busSysSelect").focus();
		}else{
			var strs= new Array(); 
			var src = "";
			strs=busSysSelectValue.split(splitFlag); 
			//alert(strs[3]);把一级目录换成strs[3]即可
			if(strs[0]=="fasp"){
				src=basePath+"hqbpmn/template/workflowMenu.jsp?tokenid=${param.tokenid}&busSysSign="+busSysSelectText;
			}else{
				src="http://"+strs[1]+":"+strs[2]+"/"+strs[0]+"/"+strs[3]+"/hqbpmn/template/workflowMenu.jsp?tokenid=${param.tokenid}&busSysSign="+busSysSelectText;
			}
			if(strs[0]!="fasp" && strs[3]==""){
				alert("请配置该业务系统的一级目录！");
			}else{
				window.location.href=src;
			}
		}
	};
	
	function cancelOperation() {
		$("#busSysSelect").combobox("clear");
	}
	
	function custom_close(){
		if (confirm("您确定要关闭本页吗？")){
			/* window.opener=null;
			window.open('','_self'); */
			window.close();
		}
	};
	
	$(function(){
		$.ajax({
			url : basePath + "bpmnAction/tempCategory/findBusSysTree.do?tokenid=${param.tokenid}",
			type : "post",
			dataType : "json",
			async : false,
			success : function(pr) { 
				if(pr.success){
					var result = pr.result;
					if(result.length > 0){
						var busSysSelectOptionDomObj = [];
						$.each(result,function(i,n){
							busSysSelectOptionDomObj.push(
									{
										"text" : n.sysId+"_"+n.sysName,
										"value" : n.sysId+splitFlag+n.sysIp+splitFlag+n.sysPort+splitFlag+n.sysRootPath
									}
							);
						});
						$("#busSysSelect").combobox("clear");
						$("#busSysSelect").combobox("loadData", busSysSelectOptionDomObj);
					};
					return true;
				}else{
					alert("获取业务系统信息失败！");
					return false;
				};
			}
		});
	});
</script>

<title>流程配置</title>
</head>
<body>
	<div id="busSys" style="margin-top:10%;">
		<div  align="center" >
			<label for="bpmnType">请选择业务系统 : </label>
			<select id="busSysSelect" class="easyui-combobox" style="width:280px;" name="busSysSelect"></select><font class="high" style="color: red" size="2">&nbsp;*</font>
		</div>
		<div align="center">
			<span class="bpmnDesignerbtnIn" style="margin-top:20px;" onclick="confirmSubmit()">确定</span> 
			<span class="bpmnDesignerbtnIn" style="margin-top:20px;" onclick="cancelOperation()">取消</span> 
		</div>
	</div>
	
</body>
</html>