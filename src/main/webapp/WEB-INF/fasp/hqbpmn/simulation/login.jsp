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
<base href="${myBasePath}">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js"></script>
<script type="text/javascript">
	var basePath='${myBasePath}';
	var login=function(){
		var bpmnTypeDom=document.getElementById("bpmnType");
		var ticketIdDom=document.getElementById("ticketId");
		var userNameDom=document.getElementById("userName");
		if(bpmnTypeDom.value.length<1){
			alert("请输入流程类型");
			document.getElementById("bpmnType").focus();
		}else if(ticketIdDom.value.length<1){
			alert("请输入工单号");
			document.getElementById("ticketId").focus();
		}else if(userNameDom.value.length<1){
			alert("请输入用户名");
			document.getElementById("userName").focus();
		}else{
			var src="${myBasePath}hqbpmn/simulation/simulationInfor.jsp?userName="+userNameDom.value+"&ticketId="+ticketIdDom.value+"&bpmnType="+bpmnTypeDom.value;
			if("undefined"!=typeof(tokenID)){
				src+="&tokenid"+tokenID;
			}
			window.location.href=src;
		}
	};
	$(function(){
		$("#bpmnType")[0].focus();
		$("#userName").bind("keyup",function(event){
			if(event.keyCode==13){  
                login();
        	}  
		});
	});
</script>

<title>登录</title>
</head>
<body>
	<div>
		<label for="bpmnType">流程类型：</label>
		<input id="bpmnType"></input>
	</div>
	<div>
		<label for="ticketId">工单号：</label>
		<input id="ticketId"></input>
	</div>
	<div>
		<label for="userName">用户名：</label>
		<input id="userName"></input>
	</div>
	<button onclick="login();">登录</button>
</body>
</html>