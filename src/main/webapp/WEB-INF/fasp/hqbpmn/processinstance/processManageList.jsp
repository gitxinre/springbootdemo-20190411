<%@page contentType="text/html;charset=UTF-8"%>
<%
String realFirstPath = request.getServletPath().substring(1,request.getServletPath().length());
realFirstPath=realFirstPath.substring(0, realFirstPath.indexOf("/"));
	request.setAttribute("myBasePath", request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ request.getContextPath() + "/" + realFirstPath + "/");
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
<script type="text/javascript" src="${myBasePath}hqbpmn/common/uiUtil.js"></script>
<title>流程监控</title>
<script type="text/javascript">
	var basePath = "${myBasePath}";
	var tokenID = "${param.tokenid}";
	var setting = {
			data: {
			    keep : {
					leaf : false,
					parent : false
			    },
			    key : {
					checked : "checked",
					children : "children",
					name : "name",
					title : "",
					//url : basePath+"bpmnAction/tempCategory/findTempCategory.do?tokenid=${param.tokenid}"
			    },
			    
				simpleData: {
					enable: true,
					idKey : "category",
					pIdKey : "pId",
					rootPId : null
				}
			},
			callback: {
				onClick: zTreeOnClick
			}
    };
	$(function(){
		$("#dataGridDiv").datagrid({
			loadFilter : function pagerFilter(data){
				if(data.success || data.total > 0){
					if(data.result!=undefined){
						data = data.result;
					}
					if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
						data = {
							total: data.length,
							rows: data
						};
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
				}else{
					/* alert("无对应的实例信息，请重新操作！");  */
					data.total=null;
					data.rows=0;
					return data;
				}
			}
		}).datagrid({
		    url:basePath+"bpmnAction/procInst/queryProcInstAllInfoByCondition.do?tokenid=${param.tokenid}",
		    //url:basePath+"hqbpmn/procInst/queryProcInstInfoByQueryCondition.do?tokenid=${param.tokenid}", 
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
		        {field:'piTitle',title:'流程标题',width:100,align:'center'},
		       	{field:'ticketId',title:'流程图',width:35,align:'center',
		        	formatter:function(value,rowData,rowIndex){
		        		return "<a href='javascript:void(0)' onclick=\"viewBpmnLog('"+rowData.ticketId+"','"+rowData.pdType+"')\"><img src='${myBasePath}hqbpmn/style/images/search.png'/></a>"
		           	}
		        },
		        {field:'pdName',title:'流程名称',width:70,align:'center'},
		        {field:'pdType',title:'流程类型',width:70,align:'center'},
		        {field:'piStartTimeStr',title:'发起时间',width:90,align:'center'},
		        {field:'piEndTimeStr',title:'完成时间',width:90,align:'center'},
		        {field:'workTime',title:'工作耗时',width:50,align:'center',
		        	formatter:function(WORKTIME){
		        		var workTimeValue = "";
		        		if(WORKTIME == 0){
		        		}else if (WORKTIME < 1000 && WORKTIME >0){
		        			workTimeValue = "<span>"+changeTwoDecimal_f(WORKTIME)+"毫秒</span>";
		        		}else if (WORKTIME < 60000 && WORKTIME >= 1000){
		        			workTimeValue = "<span>"+changeTwoDecimal_f(WORKTIME/1000)+"秒</span>";
		        		}else if (WORKTIME < 3600000 && WORKTIME >= 60000){
		        			workTimeValue = "<span>"+changeTwoDecimal_f(WORKTIME/60000)+"分钟</span>";
		        		}else if (WORKTIME < 86400000 && WORKTIME >= 3600000){
		        			workTimeValue = "<span>"+changeTwoDecimal_f(WORKTIME/3600000)+"小时</span>";
		        		}else{
		        			workTimeValue = "<span>"+changeTwoDecimal_f(WORKTIME/86400000)+"天</span>";
		        		};
		        		return workTimeValue;
                    }
		       	},
		        {field:'startUserName',title:'发起人',width:60,align:'center'},
		        {field:'taskNames',title:'当前任务',width:100,align:'center'},
		        {field:'candidateUserNames',title:'当前处理人',width:100,align:'center'},
		        {field:'processState',title:'流程状态',width:50,align:'center',
		        	formatter:function(PROCESSSTATE){
		        		switch(PROCESSSTATE){
	                    	case 0:return "<span style='color:red;'>已完成</span>";
	                    	case 1:return "<span style='color:green;'>运行中</span>";
	                    	case 2:return "<span style='color:blue;'>挂起</span>";
                    	}
	             	}
		        }
		    ]]
		});
		loadCategoryTree();
		$("input:radio[name='piState']").change(function (){
			var zTree = $.fn.zTree.getZTreeObj("tree");
			nodes = zTree.getSelectedNodes();
			var treeNode = nodes[0];
	    	var piState = $("input[name='piState']:checked").val();
	    	$("#dataGridDiv").datagrid("load",{pdCategory : treeNode.category,piState:piState});
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
	function changeTwoDecimal_f(x) {
	    var f_x = parseFloat(x);
	    if (isNaN(f_x)) {
	        alert('function:changeTwoDecimal->parameter error');
	        return false;
	    }
	    var f_x = Math.round(x * 100) / 100;
	    var s_x = f_x.toString();
	    var pos_decimal = s_x.indexOf('.');
	    if (pos_decimal < 0) {
	        pos_decimal = s_x.length;
	        s_x += '.';
	    }
	    while (s_x.length <= pos_decimal + 2) {
	        s_x += '0';
	    }
	    return s_x;
	}
	function viewBpmnLog(ticketId,bpmnType){
		var src=basePath+"hqbpmn/bpmnlog/scanBpmnLog.jsp?ticketId="+
		ticketId+"&bpmnType="+bpmnType+"&isShowNodeMessage=1&isShowBackgroundGrid=1";
		if(tokenID){
			src+="&tokenid="+tokenID;
		}
		window.open(src, 'newwindow');
	}
	function loadCategoryTree() {
		$.ajax({  
	        url:basePath+"bpmnAction/tempCategory/findTempCategory.do?tokenid=${param.tokenid}",    
	        type:"post",  
	        dataType:"json", 
	        async:false,
	        success:function(data) {  
	            var zNodes = data.result; 
	            $.fn.zTree.init($("#tree"), setting, zNodes);
	            zTreeOnInit();
	        }   
	    });
	}
	function zTreeOnInit() {
		var zTree = $.fn.zTree.getZTreeObj("tree");
		zTree.selectNode(zTree.getNodeByParam("category","${param.category}", null)); 
		$('#dataGridDiv').datagrid('clearSelections');
		zTreeOnClick();
	}
	function zTreeOnClick(event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("tree");
		nodes = zTree.getSelectedNodes();
		var treeNode = nodes[0];
		$('#dataGridDiv').datagrid('clearSelections');
		if(treeNode!=undefined){
			$('#dataGridDiv').datagrid('load',{pdCategory : treeNode.category});
		}else{
			return;
		}
	}
	function deleteRow(handleType) {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行操作！");
			return false;
		}
		var row = $('#dataGridDiv').datagrid('getSelected');
		var piId = row.piId;
		var warningSign = "";
		if(handleType == 1){
			warningSign = "删除";
		}else if(handleType == 2){
			warningSign = "结束";
		}
		if(confirm('确认执行"'+warningSign+'"操作吗？')){
			$.ajax({
				url : basePath +"bpmnAction/procInst/deleteProcInstAllInfoByPiId.do?tokenid=${param.tokenid}",
				type : "POST",
				data : {
					"piId" : piId,
					"handleType" : handleType
				},
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					alert(warningSign+" : "+pr.message);
					$('#dataGridDiv').datagrid('reload');
				}
			});
		}
	}
	function queryProcInstByCondition(){
		var processState = $("#processState").combobox('getValue').replace(/(^\s*)|(\s*$)/g, "");
		var processTitle = $("#processTitle").val().replace(/(^\s*)|(\s*$)/g, "");
		var processPdName = $("#processPdName").val().replace(/(^\s*)|(\s*$)/g, "");
		var processStartUser = $("#processStartUser").val().replace(/(^\s*)|(\s*$)/g, "");
		var currentTaskUser = $("#currentTaskUser").val().replace(/(^\s*)|(\s*$)/g, "");
		$('#dataGridDiv').datagrid('clearSelections');
		$('#dataGridDiv').datagrid('load',{
			processState : processState,
			processTitle : processTitle,
			processPdName : processPdName,
			processStartUser : processStartUser,
			currentTaskUser : currentTaskUser,
			pdCategory : "hq_bpmn"
		});
	}
	function skipToDestinationNode() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行操作！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
	    if(rowData.processState != 1){
	    	alert("请选择一条运行时实例！");
	    	return false;
	    }
	    var ticketId = rowData.ticketId;
	    var piId = rowData.piId;
	    var taskIds = rowData.taskIds;
	    var taskIdArr = taskIds.split(",");
	    var taskNames = rowData.taskNames;
	    var taskNameArr = taskNames.split(",");
	    var pdCategory = rowData.pdType;
		var targetDivDomObj = $("#freeTranform");
		var currentTaskOptionDomObj = [];
		var destinationNodeOptionDomObj = [];
		var hiCandidateUserOptionDomObj = null;
		for(var i=0; i<taskNameArr.length; i++){
			currentTaskOptionDomObj.push({"text":taskNameArr[i],"value":taskIdArr[i]});
		}
		$.ajax({
			url : basePath + "bpmnAction/procInst/queryAllNodeInfo.do?tokenid=${param.tokenid}",
			data:"bpmnType=" + pdCategory,
			type : "post",
			dataType : "json",
			async : false,
			success : function(pr) { 
				if(pr.success){
					var result = pr.result;
					result.shift( );
					if(result.length > 0){
						$.each(result,function(i,n){
							destinationNodeOptionDomObj.push({"text":n.name,"value":n.key});
						});
					};
				};
			}
		});
		$("input[name='userType']").on("click", function(event){
			var radios = $("input[name='userType']");
			$.each(radios,function(i,n){
				if(n.checked == true){
					if(n.value == "all"){
						$("#candidateUserDiv").show();
						$("#candidateUserLableDiv").show();
						$("#hiCandidateUserDiv").hide();
						$("#hiCandidateUserLableDiv").hide();
						$("#candidateUser").combotree({url: basePath+"bpmnAction/templateDef/findBpmnUserTree.do?tokenid=${param.tokenid}",cascadeCheck:false});
						return true;
					}else if(n.value == "hi"){
						var destinationKey = $("#destinationNode").combobox("getValue");
						if(destinationKey == undefined || destinationKey == null || destinationKey == ""){
							alert("请选择目标节点！");
							n.checked=false;
							$("#candidateUserDiv").hide();
							$("#candidateUserLableDiv").hide();
							$("#hiCandidateUserDiv").hide();
							$("#hiCandidateUserLableDiv").hide();
							return false;
						}
						$.ajax({
							url : basePath + "bpmnAction/procInst/queryHiTaskAssigneeInfoByPiIdAndTaskKey.do?tokenid=${param.tokenid}",
							data : {
								"piId" : piId,
								"destinationKey" : destinationKey,
							},
							type : "post",
							dataType : "json",
							async : false,
							success : function(pr) { 
								if(pr.success){
									$("#candidateUserDiv").hide();
									$("#candidateUserLableDiv").hide();
									$("#hiCandidateUserDiv").show();
									$("#hiCandidateUserLableDiv").show();
									var result = pr.result;
									if(result.length > 0){
										hiCandidateUserOptionDomObj = [];
										$.each(result,function(i,n){
											hiCandidateUserOptionDomObj.push({"text":n.name,"value":n.id});
										})
										$("#hiCandidateUser").combobox("clear");
										$("#hiCandidateUser").combobox("loadData", hiCandidateUserOptionDomObj);
									};
									return true;
								}else{
									alert("该节点没有历史处理人！");
									n.checked=false;
									$("#candidateUserDiv").hide();
									$("#candidateUserLableDiv").hide();
									$("#hiCandidateUserDiv").hide();
									$("#hiCandidateUserLableDiv").hide();
									return false;
								};
							}
						});
					};
				};
			});
		});
		$("#currentTask").combobox("clear");
		$("#currentTask").combobox("loadData", currentTaskOptionDomObj);
		$("#destinationNode").combobox("clear");
		$("#destinationNode").combobox("loadData", destinationNodeOptionDomObj);
		$.each($("input[name='userType']"),function(i,n){
				if(n.checked == true){
					$("#candidateUserDiv").hide();
					$("#candidateUserLableDiv").hide();
					$("#hiCandidateUserDiv").hide();
					$("#hiCandidateUserLableDiv").hide();
					n.checked = false;
				}
		});
		targetDivDomObj.dialog("open");
		$("#freeTranformBtnConfirm").on("click", function(event){
			var destinationUserIds = "";
			var nodes = [];
			var isCheckUserType = false;
			var taskId = $("#currentTask").combobox("getValue");
			if(taskId==""){
				alert("请输入当前任务！");
				return false;
			}
			var destinationKey = $("#destinationNode").combobox("getValue");
			if(destinationKey==""){
				alert("请输入目标节点！");
				return false;
			}
			$.each($("input[name='userType']"),function(i,n){
				if(n.checked == true){
					if(n.value == "all"){
						nodes = $('#candidateUser').combotree("getValues");
					}else if(n.value == "hi"){
						nodes = $('#hiCandidateUser').combotree("getValues");
					}
					isCheckUserType = true;
				}
			});
			if(!isCheckUserType){
				alert("请选择处理人范围！");
				return false;
			}
			if(nodes.length > 0){
				for(var i=0; i<nodes.length; i++){
					if (destinationUserIds.length > 0) {
						destinationUserIds += ",";
					}
					destinationUserIds += nodes[i];
				};
			}else{
				alert("请输入候选处理人员！");
				return false;
			}
			$.ajax({
				url : basePath + "bpmnAction/procInst/skipToDestinationNode.do?tokenid=${param.tokenid}", 
				data : {
					"bpmnType" : pdCategory,
					"ticketId" : ticketId,
					"taskId" : taskId,
					"destinationKey" : destinationKey,
					/* "userId" : "超级管理员", */
					"userId" : "hqWorkFlowAdmin01",
					"destinationUserIds" : destinationUserIds
				},
				type : "post",
				dataType : "json",
				async : false,
				success : function(pr) { 
					if(pr.success){
						alert("流程流转成功！");
						$('#dataGridDiv').datagrid('reload');
					}else{
						alert("流程流转失败！");
					}
					targetDivDomObj.dialog("close");
				}
			});
			
		});
		$("#freeTranformBtnColse").on("click", function(event){
			targetDivDomObj.dialog("close");
		});
	}
	function skipToDestinationNodeByJqueryUI() {
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行操作！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
	    if(rowData.processState != 1){
	    	alert("请选择一条运行时实例！");
	    	return false;
	    }
	    var ticketId = rowData.ticketId;
	    var piId = rowData.piId;
	    var taskIds = rowData.taskIds;
	    var taskIdArr = taskIds.split(",");
	    var taskNames = rowData.taskNames;
	    var taskNameArr = taskNames.split(",");
	    var pdCategory = rowData.pdType;
		var targetDivDomObj = $("#freeTranform");
	    targetDivDomObj.empty();
	    targetDivDomObj.dialog({
	    	title : "自由流转信息",
			height : 450,
			width : 600,
			modal : true,
			resizable : false,
			autoOpen : false,
			show : {
				// 效果 关闭效果
				effect : "blind",
				duration : 100
			},
			hide : {
				effect : "blind",
				// 持续时间
				duration : 100
			},
		});
	    function getSetting() {
			return {
				check : {
					enable : true,
					chkboxType : {
						"Y" : "",
						"N" : ""
					}
				},
				view : {
					dblClickExpand : false
				},
				data : {
					key : {
						children : "children",
						name : "name",
						title : "",
					},
					simpleData : {
						enable : true,
						idKey : "key",
						pIdKey : "",
						rootPId : null
					}
				}
			};
		}
	    function getAllUserSetting() {
			return {
				check : {
					enable : true,
					chkboxType : {
						"Y" : "",
						"N" : ""
					}
				},
				view : {
					dblClickExpand : false
				},
				data : {
					key : {
						children : "children",
						name : "name",
						title : "",
					},
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pId",
						rootPId : null
					}
				}
			};
		}
	    UIUtil.getLabel({
			label : "节点信息",
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"left" : "18px",
			"top":"30px"
		});
		UIUtil.getLabel({
			label : "流转信息",
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"left" : "350px",
			"top":"30px"
		});
		var	canSkipNodeDivDom = UIUtil.getDiv({
			id:"canSkipNodeDivDomId"
		}).css({
			"border" : "2px solid #84C1FF",
			"position" : "absolute",
			"overflow" : "auto",
			"height" : "300px",
			"width" : "230px",
			"top" : "50px",
			"left" : "18px"
		}).appendTo(targetDivDomObj);
		var canSkipNodeTreeUl = UIUtil.getUl({
			id : "canSkipNodeTree",
			className : "ztree"
		}).appendTo(canSkipNodeDivDom);
		var canSkipNodeTreeDom = null;
		$.ajax({
			url : basePath + "bpmnAction/procInst/queryAllNodeInfo.do?tokenid=${param.tokenid}",
			data:"bpmnType=" + pdCategory,
			type : "post",
			dataType : "json",
			async : true,
			success : function(pr) { 
				if(pr.success){
					var result = pr.result;
					result.shift( );
					canSkipNodeTreeDom = $.fn.zTree.init(canSkipNodeTreeUl, getSetting(), result);
				}
			}
		});
		var	candidateUserConfigDivDom = UIUtil.getDiv({
			id:"candidateUserConfigDivDomId"
		}).css({
			"border" : "2px solid #84C1FF",
			"position" : "absolute",
			"overflow" : "auto",
			"height" : "300px",
			"width" : "230px",
			"top" : "50px",
			"left" : "350px"
		}).appendTo(targetDivDomObj);
		UIUtil.getLabel({
			label : "目标节点：",
		}).appendTo(candidateUserConfigDivDom).css({
			"position" : "absolute",
			"left" : "10px",
			"top":"11px"
		});
		UIUtil.getInput({
			readOnly : true,
			value : "",
			id : "targetNodeId"
		}).appendTo(candidateUserConfigDivDom).css({
			"position" : "absolute",
			"top" : "8px",
			"left" : "85px",
			"width" : "120px",
		});
		UIUtil.getRadio({
			name : "candidateUserConfigType",
			value : "hiUser",
		}).appendTo(candidateUserConfigDivDom).css({
			"position" : "absolute",
			"left" : "10px",
			"top":"35px"
		});
		UIUtil.getLabel({
			label : "历史人员",
		}).appendTo(candidateUserConfigDivDom).css({
			"position" : "absolute",
			"left" : "30px",
			"top":"35px"
		});
		UIUtil.getRadio({
			name : "candidateUserConfigType",
			value : "allUser",
//			checked : "checked"
		}).appendTo(candidateUserConfigDivDom).css({
			"position" : "absolute",
			"left" : "105px",
			"top":"35px"
		});
		UIUtil.getLabel({
			label : "所有人员",
		}).appendTo(candidateUserConfigDivDom).css({
			"position" : "absolute",
			"left" : "125px",
			"top":"35px"
		});
		var userTreeDom = null;
		var userTreeUl = UIUtil.getUl({
			id : "userTree",
			className : "ztree"
		}).appendTo(candidateUserConfigDivDom).css({
			"position" : "absolute",
			"top":"50px"
		});
		$("input[name='candidateUserConfigType']").on("click", function(event){
			var radios = $("input[name='candidateUserConfigType']");
			$.each(radios,function(i,n){
				if(n.checked == true){
					if(n.value == "allUser"){
						$.ajax({
							url : basePath + "bpmnAction/templateDef/findBpmnIdUser.do?tokenid=${param.tokenid}",
							type : "post",
							dataType : "json",
							async : true,
							success : function(pr) { 
								if(pr.success){
									$.fn.zTree.destroy("userTree");
									userTreeDom = $.fn.zTree.init(userTreeUl, getAllUserSetting(), pr.result);
								}
							}
						});
					}else if(n.value == "hiUser"){
						
						var destinationKey = $("#targetNodeId").attr("realValue");
						if(destinationKey == undefined || destinationKey == null || destinationKey == ""){
							alert("请选择目标节点！");
							n.checked=false;
							$.fn.zTree.destroy("userTree");
							return false;
						}
						$.ajax({
							url : basePath + "bpmnAction/procInst/queryHiTaskAssigneeInfoByPiIdAndTaskKey.do?tokenid=${param.tokenid}",
							data : {
								"piId" : piId,
								"destinationKey" : destinationKey,
							},
							type : "post",
							dataType : "json",
							async : true,
							success : function(pr) { 
								$.fn.zTree.destroy("userTree");
								if(pr.success){
									userTreeDom = $.fn.zTree.init(userTreeUl, getAllUserSetting(), pr.result);
								}else{
									alert("该节点没有历史处理人！");
									n.checked=false;
								}
							}
						});
					}
				}
			});
		});
		UIUtil.getLabel({
			label : "当前任务",
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"top" : "95px",
			"left" : "273px",
		});
		var selectDomObj = UIUtil.getSelect({
			readOnly : false,
			id : "currentNodeId"
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"top" : "110px",
			"left" : "255px",
			"width" : "88px",
			"text-align" : "center"
		});
		for(var i=0; i<taskNameArr.length; i++){
			selectDomObj.append("<option value='" + taskIdArr[i] + "'>" + taskNameArr[i] + "</option>");
		}
		/* UIUtil.getInput({
			readOnly : true,
			value : taskNames,
			id : "currentNodeId"
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"top" : "110px",
			"left" : "255px",
			"width" : "88px",
			"text-align" : "center"
		}); */
		UIUtil.getButton({
			value : "-->"
		}).css({
			"position" : "absolute",
			"top" : "170px",
			"left" : "285px",
		}).appendTo(targetDivDomObj).on("click", function(event){
			var nodes = canSkipNodeTreeDom.getCheckedNodes(true);
			if(nodes.length == 0){
				alert("至少选择一个所有人用户！");
				return false;
			}else if(nodes.length > 1){
				alert("只能跳转到一个目标节点！");
				return false;
			}
			$("#targetNodeId").attr("value",nodes[0].name);
			$("#targetNodeId").attr("realValue",nodes[0].key);
		});
		UIUtil.getButton({
			value : "确定"
		}).css({
			"position" : "absolute",
			"top" : "380px",
			"left" : "225px"
		}).appendTo(targetDivDomObj).on("click", function(event){
			var destinationUserIds = "";
			var nodes = userTreeDom.getCheckedNodes(true);
			
			if(nodes.length > 0){
				for(var i=0; i<nodes.length; i++){
					if (destinationUserIds.length > 0) {
						destinationUserIds += ",";
					}
					destinationUserIds += nodes[i].id;
				}
			}
			var taskId = $("#currentNodeId").val();
			var destinationKey = $("#targetNodeId").attr("realValue");
			$.ajax({
				url : basePath + "bpmnAction/procInst/skipToDestinationNode.do?tokenid=${param.tokenid}", 
				data : {
					"bpmnType" : pdCategory,
					"ticketId" : ticketId,
					"taskId" : taskId,
					"destinationKey" : destinationKey,
					"userId" : "超级管理员",
					"destinationUserIds" : destinationUserIds
				},
				type : "post",
				dataType : "json",
				async : false,
				success : function(pr) { 
					if(pr.success){
						alert("流程跳转成功！");
					}else{
						alert("流程跳转失败！");
					}
					targetDivDomObj.dialog("close");
				}
			});
			
		});
	    targetDivDomObj.dialog("open");
	    UIUtil.getButton({
			value : "取消"
		}).css({
			"position" : "absolute",
			"top" : "380px",
			"left" : "335px"
		}).appendTo(targetDivDomObj).on("click", function(event){
			targetDivDomObj.dialog("close");
		});
		
	}
	function tranformTask(){
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行操作！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
	    if(rowData.processState != 1){
	    	alert("请选择一条运行时实例！");
	    	return false;
	    }
	    var taskIds = rowData.taskIds;
	    var taskIdArr = taskIds.split(",");
	    var taskNames = rowData.taskNames;
	    var taskNameArr = taskNames.split(",");
	    var targetDivDomObj = $("#popup");
	    targetDivDomObj.empty();
	    targetDivDomObj.dialog({
	    	title : "转办任务信息",
			height : 450,
			width : 600,
			modal : true,
			resizable : false,
			autoOpen : false,
			show : {
				// 效果 关闭效果
				effect : "blind",
				duration : 100
			},
			hide : {
				effect : "blind",
				// 持续时间
				duration : 100
			}
		});
	    function getSetting() {
			return {
				check : {
					enable : true,
					chkboxType : {
						"Y" : "",
						"N" : ""
					}
				},
				view : {
					dblClickExpand : false
				},
				data : {
					key : {
						children : "children",
						name : "name",
						title : "",
					},
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pId",
						rootPId : null
					}
				}
			};
		}
		UIUtil.getLabel({
			label : "所有人员",
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"left" : "18px",
			"top":"30px"
		});
		UIUtil.getLabel({
			label : "当前任务",
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"top" : "30px",
			"left" : "350px",
		});
		var selectDomObj = UIUtil.getSelect({
			readOnly : false,
			id : "currentNodeId"
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"top" : "50px",
			"left" : "350px",
			"width" : "230px",
			"text-align" : "left"
		});
		for(var i=0; i<taskNameArr.length; i++){
			selectDomObj.append("<option value='" + taskIdArr[i] + "'>" + taskNameArr[i] + "</option>");
		}
		selectDomObj.on("change",function(event){
			$.fn.zTree.destroy("candidateUserTree");
			var changeTaskId = $("#currentNodeId").val();
			$.ajax({
				url : basePath + "bpmnAction/procInst/queryCandidateUserByTaskId.do?tokenid=${param.tokenid}", 
				data:{
					taskId : changeTaskId
				},
				type : "post",
				dataType : "json",
				async : false,
				success : function(pr) { 
					candidateUserTreeDom = $.fn.zTree.init(candidateUserTreeUl, getSetting(), pr.result);
					return true;
				}
			});
		});
		UIUtil.getLabel({
			label : "候选人员",
		}).appendTo(targetDivDomObj).css({
			"position" : "absolute",
			"left" : "350px",
			"top":"70px"
		});
		var	userDivDom = UIUtil.getDiv({
			id:"allUserDivDomId"
		}).css({
			"border" : "2px solid #84C1FF",
			"position" : "absolute",
			"overflow" : "auto",
			"height" : "300px",
			"width" : "230px",
			"top" : "50px",
			"left" : "18px"
		}).appendTo(targetDivDomObj);
		//
		UIUtil.getUl({
			id : "allUserTree"
		}).appendTo(userDivDom).tree({
			url: basePath+"bpmnAction/templateDef/findBpmnUserTree.do?tokenid=${param.tokenid}",
			checkbox : true,
			cascadeCheck : true,
			onlyLeafCheck : true
		});  
		//
		/* var userTreeUl = UIUtil.getUl({
			id : "userTree",
			className : "ztree"
		}).appendTo(userDivDom);
		var userTreeDom = null;
		$.ajax({
			url : basePath + "hqbpmn/templateDef/findBpmnIdUser.do?tokenid=${param.tokenid}",
			type : "post",
			dataType : "json",
			async : false,
			success : function(pr) { 
				if(pr.success){
					userTreeDom = $.fn.zTree.init(userTreeUl, getSetting(), pr.result);
				};
			}
		});  */
		//
		var	candidateUserDivDom = UIUtil.getDiv({
			id:"candidateUserDivDomId"
		}).css({
			"border" : "2px solid #84C1FF",
			"position" : "absolute",
			"overflow" : "auto",
			"height" : "260px",
			"width" : "230px",
			"top" : "90px",
			"left" : "350px"
		}).appendTo(targetDivDomObj);
		var candidateUserTreeUl = UIUtil.getUl({
			id : "candidateUserTree",
			className : "ztree"
		}).appendTo(candidateUserDivDom);
		var candidateUserTreeDom = null;
		var currentTaskId = $("#currentNodeId").val();
		$.ajax({
			url : basePath + "bpmnAction/procInst/queryCandidateUserByTaskId.do?tokenid=${param.tokenid}", 
			data:{
				taskId : currentTaskId
			},
			type : "post",
			dataType : "json",
			async : false,
			success : function(pr) { 
				candidateUserTreeDom = $.fn.zTree.init(candidateUserTreeUl, getSetting(), pr.result);
			}
		});
		UIUtil.getButton({
			value : "-->"
		}).css({
			"position" : "absolute",
			"top" : "150px",
			"left" : "285px"
		}).appendTo(targetDivDomObj).on("click", function(event){
			//var nodes = userTreeDom.getCheckedNodes(true);
			var nodes = $('#allUserTree').tree('getChecked');
			if(nodes.length == 0){
				alert("至少选择一个所有人用户！");
				return false;
			}
			for(var i=0, l=nodes.length; i < l; i++){
				candidateUserTreeDom.addNodes(null,{"id" : nodes[i].id, "name" : nodes[i].text});
				nodes[i].checked = false;
			}
			userTreeDom.refresh();
		});
		UIUtil.getButton({
			value : "<--"
		}).css({
			"position" : "absolute",
			"top" : "200px",
			"left" : "285px"
		}).appendTo(targetDivDomObj).on("click", function(event) {
			var nodes = candidateUserTreeDom.getCheckedNodes(true);
			if(nodes.length == 0){
				alert("至少选择一个候选人用户！");
				return false;
			}
			for (var i=0, l=nodes.length; i < l; i++) {
				candidateUserTreeDom.removeNode(nodes[i]);
			}
		});
		/* $("#btnDiv").appendTo(targetDivDomObj); */
		UIUtil.getButton({
			value : "确定"
		}).css({
			"position" : "absolute",
			"top" : "370px",
			"left" : "220px"
		}).appendTo(targetDivDomObj).on("click", function(event){
			var allNodes = candidateUserTreeDom.getNodes();
			var candidateUserIds = [];
			for(var i=0, l=allNodes.length; i < l; i++){
				candidateUserIds.push(allNodes[i].id);
			}
			var candidateUserIdsStr = JSON.stringify(candidateUserIds);
			var candidateUserIdsStrTemp = JSON.parse(candidateUserIdsStr);
			if(typeof (candidateUserIdsStrTemp)=="string"){
				candidateUserIdsStr = candidateUserIdsStrTemp;
			}
			var taskId = $("#currentNodeId").val();
			if(taskId==""){
				alert("请选择当前任务！");
				return false;
			}
			$.ajax({
				url : basePath + "bpmnAction/procInst/updateTaskCandidateUserInfo.do?tokenid=${param.tokenid}", 
				data:{
					"taskId" : taskId,
					"candidateUserIdsStr" : candidateUserIdsStr
				},
				type : "post",
				dataType : "json",
				async : false,
				success : function(pr) { 
					if(pr.success){
						$('#dataGridDiv').datagrid('reload');
						alert("变更候选人信息成功！");
					}else{
						alert("变更候选人信息失败！");
					}
					targetDivDomObj.dialog("close");
				}
			});
		});
		UIUtil.getButton({
			value : "取消"
		}).css({
			"position" : "absolute",
			"top" : "370px",
			"left" : "340px"
		}).appendTo(targetDivDomObj).on("click", function(event){
			targetDivDomObj.dialog("close");
		});
	    targetDivDomObj.dialog("open");
	}

	function suspendProcInst(){
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
	    if(rowData.processState != 1){
	    	alert("请选择一条运行时实例！");
	    	return false;
	    }
	    if(confirm('确认执行"挂起"操作吗？')){
			$.ajax({
				url : basePath + "bpmnAction/procInst/suspendProcInstById.do?tokenid=${param.tokenid}", 
				data : {
					piId : rowData.piId
				},
				type : "post",
				dataType : "json",
				async : false,
				success : function(pr) { 
					if(pr.success){
						$('#dataGridDiv').datagrid('reload');
						alert("流程挂起成功！");
					}else{
						alert("流程挂起失败！");
					}
				}
			});
	    }
	}
	function activateProcInst(){
		var selectRow = $('#dataGridDiv').datagrid('getSelections');
		if(selectRow.length!=1){
			alert("请选择一条数据进行修改！");
			return false;
		}
		var rowData = $('#dataGridDiv').datagrid('getSelected');
	    if(rowData.processState != 2){
	    	alert("请选择一条挂起实例！");
	    	return false;
	    }
	    if(confirm('确认执行"恢复"操作吗？')){
			$.ajax({
				url : basePath + "bpmnAction/procInst/activateProcInstById.do?tokenid=${param.tokenid}", 
				data : {
					piId : rowData.piId
				},
				type : "post",
				dataType : "json",
				async : false,
				success : function(pr) { 
					if(pr.success){
						$('#dataGridDiv').datagrid('reload');
						alert("流程恢复成功！");
					}else{
						alert("流程恢复失败！");
					}
				}
			});
	    }
	}
</script>
</head>
<body class="easyui-layout">
	<div data-options="region:'west',split:true"
		style="width: 250px; padding: 10px;">
		<div class="zTreeDemoBackground left">
			<ul id="tree" class="ztree"></ul>
		</div>
	</div>
	<div data-options="region:'center'" >
		<div style="margin: 6px;">
		<div class="boxOperList" style="height: 36px; margin-bottom: 16px;">
			<!-- <span id="btn_task_add" class="i_24" onclick="javascript:skipToDestinationNode()">催办</span> --> 
			<span id="btn_task_del" class="i_22"  onclick="javascript:deleteRow(1)">删除</span>
			<span id="btn_task_add" class="i_24" onclick="javascript:tranformTask()">转办</span> 
			<span id="btn_task_add" class="i_24" onclick="javascript:skipToDestinationNode()">自由流转</span> 
			<span id="btn_task_add" class="i_24" onclick="javascript:suspendProcInst()">挂起</span> 
			<span id="btn_task_add" class="i_24" onclick="javascript:activateProcInst()">恢复</span> 
			<span id="btn_task_del" class="i_22"  onclick="javascript:deleteRow(2)">结束</span>
			<!-- <span id="btn_task_edit" class="i_21" onclick="javascript:editCurrentTaskCandidate()">当前任务</span> --> 
			<div class="clear"></div>
		</div>
		<div class="box_rightTopTool">
			<div class="boxToolIn">
				<div class="infoIn">
					<div class="textIn2">
						<span class="name">标题</span>
						<input id="processTitle" class="easyui-textbox" type="text" style="width:100px;">
					</div>
					<div class="textIn2">
						<span class="name">名称</span>
						<input id="processPdName" class="easyui-textbox" type="text" style="width:100px;">
					</div>
					<div class="textIn2">
						<span class="name">发起人</span>
						<input id="processStartUser" class="easyui-textbox" type="text" style="width:100px;">
					</div>
					<div class="textIn2">
						<span class="name">当前处理人</span>
						<input id="currentTaskUser" class="easyui-textbox" type="text" style="width:100px;">
					</div>
					<div class="textIn2">
						<span class="name">状态</span>
						<select id="processState" class="easyui-combobox">
						    <option value="all">请选择</option>
						    <option value="ru">运行中</option>
						    <option value="suspend">挂起</option>
						    <option value="hi">已完成</option>
						</select>
					</div>
					<div class="textIn2">
						<a href="javascript:void(0);" class="easyui-linkbutton" iconCls="icon-search" onclick="queryProcInstByCondition()">查询</a>
					</div>
					&nbsp;
				</div>
			</div>
		</div>
		<div class="boxSection noborder boxGui">
			<div class="boxTit">
				<div class="boxTitIcon i_11"></div>
				<div class="boxTitdes" id="boxTableName">流程实例列表</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<!-- <span >实例类型：</span>
				<span ><input type="radio" name="piState" value="all" checked/>&nbsp;全部</span>
				<span ><input type="radio" name="piState" value="ru" />&nbsp;运行中</span>
				<span ><input type="radio" name="piState" value="hi" />&nbsp;已结束</span> -->
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
				<td><input type='text' id='pdKey' name='pdKey' style="width:280px;"><font class="high" style="color: red" size="2">&nbsp;*</font></td>
		    </tr>
		    <tr>
		    <td align = "right">描述:</td>
				<td><textarea id='description' name='description' style="width:280px;height:80px;"></textarea></td>
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
			</table>
			<div class="alFbtnBox alignC" style="margin-top:20px;">
				<span class="btn" onclick="submitForm()">确定</span> 
				<span class="btn" onclick="javascript:$('#importWin').dialog('close')">关闭</span>
			</div>
		</form>
		</div>
	</div>
	<div id="popup" style="margin-top:10px;"></div>
	<div id="freeTranform" title="自由流转信息" class="easyui-window"
		style="width: 560px; height: 420px;margin:0 auto;"
		data-options="iconCls:'icon-save',closed:true,modal:true,maximizable:false,minimizable:false,collapsible:false">
		<div class="tableData_3 noborder bgGray bgGray ptb10">
			<table width="100%">
				<tr>
					<td width="27%" align = "right">当前任务</td>
					<td><select id="currentTask" class="easyui-combobox" style="width:280px;"></select><font class="high" style="color: red" size="2" >&nbsp;*</font></td>
				</tr>
				<tr>
					<td align = "right">目标节点</td>
					<td><select id="destinationNode" class="easyui-combobox" style="width:280px;"></select><font class="high" style="color: red" size="2" >&nbsp;*</font></td>
				</tr>
				<tr>
					<td align = "right">处理人范围</td>
					<td>
						<span ><input type="radio" name="userType" value="all"/>&nbsp;全部</span>
						<span ><input type="radio" name="userType" value="hi" />&nbsp;历史</span>
					</td>
				</tr>
				<tr>
					
					<td align = "right">
						<div id="candidateUserLableDiv" style="display:none">全部人员</div>
						<div id="hiCandidateUserLableDiv" style="display:none">历史人员</div>
					</td>
					<td>
						<div id="candidateUserDiv" style="display:none">
							<input id="candidateUser" style="width:280px;" multiple><font class="high" style="color: red" size="2" >&nbsp;*</font>
						</div>
						<div id="hiCandidateUserDiv" style="display:none">
							<select id="hiCandidateUser" class="easyui-combobox" style="width:280px;" multiple></select><font class="high" style="color: red" size="2" >&nbsp;*</font>
						</div>
					</td>
				</tr>
			</table>
			<div id="freeTranformBtn" class="alFbtnBox alignC" style="margin-bottom:20px;">
				<span id="freeTranformBtnConfirm" class="btn">确定</span> 
				<span id="freeTranformBtnColse" class="btn">关闭</span>
			</div>
		</div>
	</div>
	<div id="btnDiv" class="alFbtnBox alignC" style="margin-bottom:20px;">
		<span id="confirmBtn" class="btn">确定</span> 
		<span id="colseBtn" class="btn">关闭</span>
	</div>
</body>
</html>
