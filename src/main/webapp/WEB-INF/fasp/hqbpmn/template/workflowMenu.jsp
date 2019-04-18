<%@ page language="java" contentType="text/html; charset=utf-8"
%>
<%
String realFirstPath = request.getServletPath().substring(1,request.getServletPath().length());
realFirstPath=realFirstPath.substring(0, realFirstPath.indexOf("/"));
request.setAttribute("myBasePath", request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"+realFirstPath+"/");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>流程配置</title>
<%-- <script src="${myBasePath}hqbpmn/jslib/jquery-1.7.2.min.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/default/easyui.css" />
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/themes/icon.css" />
<link rel="stylesheet" type="text/css" href="${myBasePath}hqbpmn/jslib/easyui/demo/demo.css" />
<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${myBasePath}hqbpmn/jslib/easyui/locale/easyui-lang-zh_CN.js"></script> --%>
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
var basePath="${myBasePath}";
var tokenID="${param.tokenid}";
var currentSystem = "<%=request.getParameter("busSysSign")%>";
$().ready(function(){
	var url = basePath +"hqbpmn/template/tempList.jsp";
	if(tokenID){
		url = url + "?tokenid=" + tokenID;
	} 
	var content = '<iframe scrolling="auto" frameborder="0"  src="'+url+'" style="width:100%;height:100%;"></iframe>';
	$('#tabDialog').tabs('add', {
		    id : 'processDefine',
			title : '流程定义',
			content : content
			
		});
	
	var url2 = basePath +"hqbpmn/template/tempListCoustomButton.jsp";
	if(tokenID){
		url2 = url2 + "?tokenid=" + tokenID;
	} 
	var content2 = '<iframe id= "frame2" scrolling="auto" frameborder="0"  src="'+url2+'" style="width:100%;height:100%;"></iframe>';
	$('#tabDialog').tabs('add', {
			id : 'businessButton',
			title : '业务按钮',
			content:content2
		});
		
	var url3 = basePath +"hqbpmn/template/personnelAllocationList.jsp";
	if(tokenID){
		url3 = url3 + "?tokenid=" + tokenID;
	} 
	var content3 = '<iframe id= "frame3" scrolling="auto" frameborder="0"  src="'+url3+'" style="width:100%;height:100%;"></iframe>';
	$('#tabDialog').tabs('add', {
			id : 'personalAllocation',
			title : '人员关系配置',
			content:content3
		}); 
	
	var url4 = basePath +"hqbpmn/template/tempListCode.jsp";
	if(tokenID){
		url4 = url4 + "?tokenid=" + tokenID;
	} 
	var content4 = '<iframe id= "frame4" scrolling="auto" frameborder="0"  src="'+url4+'" style="width:100%;height:100%;"></iframe>';
	$('#tabDialog').tabs('add', {
			id : 'codeTable',
			title : '代码表维护',
			content:content4
		}); 
		
	$('#tabDialog').tabs("select", 0); 
	 $('#tabDialog').tabs({
		  onSelect: function(title,index){
			  //选择当前选项卡时并且刷新当前选项卡start
			  var currTab =$('#tabDialog').tabs('getTab', title);  
	          var iframe = $(currTab.panel('options').content);  
	          var src = iframe.attr('src');  
	          var id1 = iframe.attr('id');
	          if (src)  
	               $('#tabDialog').tabs('update', {  
	                   tab : currTab,  
	                   options : {  
	                	   content : '<iframe id= "'+ id1 +'" scrolling="auto" frameborder="0"  src="'+src+'" style="width:100%;height:100%;"></iframe>'
	                   }  
	                });  
	        //选择当前选项卡时并且刷新当前选项卡end
			  if(index == 1){
				  var subDoc = document.getElementById("frame2").contentWindow.document;
				  var tempDialog = subDoc.getElementById("formDialog");
				  var addBtn=subDoc.getElementById("btn_task_add");
				  var editBtn=subDoc.getElementById("btn_task_edit");
				  if (navigator.userAgent.indexOf("MSIE 8.0")>0||navigator.userAgent.indexOf("MSIE 7.0")>0||navigator.userAgent.indexOf("MSIE 6.0")>0){
						//ie浏览器
		                function handler(){
		                        $(tempDialog).parent().css({
									top:'100px',
									left:'450px'
									});
		                        $(tempDialog).parent().next().css({
									top:'100px',
									left:'450px'
									});
		                }
						if(addBtn != null){
							 addBtn.attachEvent('onclick',function(){
			                        handler.call(addBtn,arguments);
			                });
						}
					  
		                function handler(){
	                        $(tempDialog).parent().css({
								top:'100px',
								left:'450px'
								});
	                        $(tempDialog).parent().next().css({
								top:'100px',
								left:'450px'
								});
	                    }
		                if(editBtn != null){
		                	editBtn.attachEvent('onclick',function(){
	                             handler.call(addBtn,arguments);
		                	 });
		                }
		             }
					else{
						//非ie浏览器
						 if(addBtn != null){
					    addBtn.addEventListener("click", function() {
							$(tempDialog).parent().css({
								top:'100px',
								left:'450px'
								});
							$(subDoc.getElementsByClassName("window-shadow")).css({
								top:'100px',
								left:'450px'
								});
					  });
						 }
						 if(editBtn != null){
					  editBtn.addEventListener("click", function() {
							$(tempDialog).parent().css({
								top:'100px',
								left:'450px'
								});
							$(subDoc.getElementsByClassName("window-shadow")).css({
								top:'100px',
								left:'450px'
								});
					  }); 
						 }
					}
			  }else if(index == 2){
				  var subDoc = document.getElementById("frame3").contentWindow.document;
				  var tempDialog = subDoc.getElementById("formDialog");
				  var addBtn=subDoc.getElementById("btn_task_add");
				  var editBtn=subDoc.getElementById("btn_task_edit");
				  if (navigator.userAgent.indexOf("MSIE 8.0")>0||navigator.userAgent.indexOf("MSIE 7.0")>0||navigator.userAgent.indexOf("MSIE 6.0")>0){
					//ie浏览器
					  function handler(){
	                        $(tempDialog).parent().css({
								top:'100px',
								left:'450px'
								});
	                        $(tempDialog).parent().next().css({
								top:'100px',
								left:'450px'
								});
	                  }
					  if(addBtn != null){
	                  addBtn.attachEvent('onclick',function(){
	                        handler.call(addBtn,arguments);
	                  });
					  }
				  
	                  function handler(){
                      $(tempDialog).parent().css({
							top:'100px',
							left:'450px'
							});
                      $(tempDialog).parent().next().css({
							top:'100px',
							left:'450px'
							});
            }
	                  if(editBtn != null){
	                editBtn.attachEvent('onclick',function(){
                    handler.call(addBtn,arguments);
            });
	                  }
				  }else{
					//非ie浏览器
					 if(addBtn != null){
					  addBtn.addEventListener("click", function() {
							$(tempDialog).parent().css({
								top:'100px',
								left:'450px'
								});
							$(subDoc.getElementsByClassName("window-shadow")).css({
								top:'100px',
								left:'450px'
								});
					  });
				  }
					 if(editBtn != null){
					  editBtn.addEventListener("click", function() {
							$(tempDialog).parent().css({
								top:'100px',
								left:'450px'});
							$(subDoc.getElementsByClassName("window-shadow")).css({
								top:'100px',
								left:'450px'
								});
					  });  
				  }
				  }
			  }else if(index == 3){
				  var subDoc = document.getElementById("frame4").contentWindow.document;
				  var tempDialog = subDoc.getElementById("formDialog");
				  var addBtn=subDoc.getElementById("btn_task_add");
				  var editBtn=subDoc.getElementById("btn_task_edit");
				  if (navigator.userAgent.indexOf("MSIE 8.0")>0||navigator.userAgent.indexOf("MSIE 7.0")>0||navigator.userAgent.indexOf("MSIE 6.0")>0){
					//ie浏览器
					  function handler(){
	                        $(tempDialog).parent().css({
								top:'100px',
								left:'450px'
								});
	                        $(tempDialog).parent().next().css({
								top:'100px',
								left:'450px'
								});
	                  }
					  if(addBtn != null){
	                  addBtn.attachEvent('onclick',function(){
	                        handler.call(addBtn,arguments);
	                  });
					  }
				  
	                  function handler(){
                      $(tempDialog).parent().css({
							top:'100px',
							left:'450px'
							});
                      $(tempDialog).parent().next().css({
							top:'100px',
							left:'450px'
							});
            }
	                  if(editBtn != null){
	                editBtn.attachEvent('onclick',function(){
                    handler.call(addBtn,arguments);
            });
	                  }
				  }else{
					//非ie浏览器
					if(addBtn != null){
					  addBtn.addEventListener("click", function() {
							$(tempDialog).parent().css({
								top:'100px',
								left:'450px'
								});
							$(subDoc.getElementsByClassName("window-shadow")).css({
								top:'100px',
								left:'450px'
								});
					  });
					}
					if(editBtn != null){
					  editBtn.addEventListener("click", function() {
							$(tempDialog).parent().css({
								top:'100px',
								left:'450px'});
							$(subDoc.getElementsByClassName("window-shadow")).css({
								top:'100px',
								left:'450px'
								});
					  }); 
					}
				  }
			  }
		  }
		}); 
	 $('#tabDialog').tabs({
			tools : '#tab-tools'
		});
	 var _result=document.getElementById("currentSys");
     var str ="业务系统："+currentSystem;
     _result.innerHTML = str;
});
</script>
</head>
<body>
<div id="tabDialog" class="easyui-tabs" data-options="fit:true" >
</div>
<div id="tab-tools">
	<a id="currentSys" href="#" class="easyui-linkbutton" plain="true" style="text-align:center;padding-top:4px;"></a>
</div>

</body>
</html>