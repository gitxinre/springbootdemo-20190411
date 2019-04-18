window.onerror=function(){return true;};
$().ready(function(){
	/**
	 * 显示Loading图片，等待加载数据
	 */
	var target = $("#preview")[0];
	var sp = new Spinner({            
        lines: 13, 			// 花瓣数目
        length: 15, 		// 花瓣长度
        width: 5, 			// 花瓣宽度
        radius: 30, 		// 花瓣距中心半径
        corners: 1, 		// 花瓣圆滑度 (0-1)
        rotate: 0, 			// 花瓣旋转角度
        direction: 1, 		// 花瓣旋转方向 1: 顺时针, -1: 逆时针
        color: '#646464', 	// 花瓣颜色
        speed: 1,			// 花瓣旋转速度
        trail: 60, 			// 花瓣旋转时的拖影(百分比)
        shadow: false, 		// 花瓣是否显示阴影
        hwaccel: false, 	//spinner 是否启用硬件加速及高速旋转            
        className: 'spinner', // spinner css 样式名称
        zIndex: 2e9 		// spinner的z轴 (默认是2000000000)
    });
	sp.spin(target);
	/**
	 * 后台加载显示流程模板的json格式数据
	 */
	var jsondata=null;
	var ziStartNodeId = "";
	//GooFlow工作区的宽度与高度
	var canvasWidth = null;
	var canvasHeight = null;
	$.ajax({
        url:basePath+"bpmnAction/scanBpmnLog/findTemDefByPdKey.do?tokenid="+tokenID,  
		type:"POST",
		data:{
			"pdKey" : pdKey
		},  
		dataType:"json",
		async:false,
		success:function(pr, textStatus){
			if(pr.success){
				var temdata = pr.result;
				canvasWidth = parseInt(temdata.canvasWidth);
				canvasHeight = parseInt(temdata.canvasHeight);
				jsondata = JSON.parse(temdata.contentBytesStr);
				jsondata.id = temdata.id;
				var ziNodes = jsondata.nodes;
				$.each(ziNodes,function(i,n){
					if(i.indexOf("start") == 0){
						ziStartNodeId = i;
						return true;
					}
				});
			}
		}
	});
	/**
	 * 后台请求流程的历史节点路径信息
	 */
	var _myflowzi;
	var historyPath=null;
	var historyPathCopy = null;
	var sonHistoryPath = [];
	var executionIds = [];
	var subprocessNodes = [];
	var execIdTemp = "";
	var procInstId = "";
	$.ajax({
        url:basePath+"bpmnAction/scanBpmnLog/findAllNodesHitoryPath.do?tokenid="+tokenID,    
		type:"POST",
		data:"ticketId=" + ticketId +"&bpmnType=" +bpmnType,  
		dataType:"json",
		async:false,
		success:function(pr, textStatus){
			if(pr.success){
				historyPath = pr.result;
				historyPathCopy = pr.result;
				var maxSubStartTime = "";
				$.each(historyPath,function(i,n){
					if(procInstId == ""){
						procInstId = n.procInstId;
					}
					if(n.taskKey.indexOf("startevent") == 0 && n.taskKey.indexOf("startevent_userTask") != 0){
						executionIds.push(n.executionId);
					}else if(n.taskKey.indexOf("subprocess") == 0){
						executionIds.push(n.executionId);
						subprocessNodes.push(n);
						var startTime=new Date(n.startTime.replace(/-/g,"/"));
						if(maxSubStartTime==""){
							maxSubStartTime = startTime;
						}else if(maxSubStartTime-startTime<0&&n.executionId == executionId){
							maxSubStartTime = startTime;
						}
					}
					if(n.executionId == executionId){
						sonHistoryPath.push(n);
					}
				});
				if(sonHistoryPath.length == 1){
					$.each(historyPath,function(i,n){
						$.each(executionIds,function(j,k){
							if(n.executionId == k||new Date(n.startTime.replace(/-/g,"/"))-maxSubStartTime<0){
								delete historyPathCopy[i];
							}
						});
					});
					//解决子流程节点配置并行不等待时，循环会签时，子流程日志中节点的历史记录显示异常的问题start
					var executionIdsSub = null;
					var oneExecutionId = null;
					$.ajax({
				        url:basePath+"bpmnAction/scanBpmnLog/selectSubExecutionIdsByParentExecutionId.do?tokenid="+tokenID,    
						type:"POST",
						data:"executionIdParent=" + sonHistoryPath[0].executionId,  
						dataType:"json",
						async:false,
						success:function(pr, textStatus){
							if(pr.success){
								var executionIdArry = new Array();
								executionIdsSub = pr.result;
								for(var i = 0; i < executionIdsSub.length; i++){
									for(var j = 0; j < executionIds.length; j++){
										if(executionIdsSub[i] == executionIds[j]){
											executionIdArry.push(executionIdsSub[i]);
										}
									}
								}
								//executionIdsS和executionIdArry取差集，则就是act_hi_actinst表中act_id_是子流程节点，executionId是所有子流程实例的executionId的父的父的executionId
								 for(var i=0; i < executionIdsSub.length; i++){   
								        var flag = true;   
								        for(var j=0; j < executionIdArry.length; j++){   
								            if(executionIdsSub[i] == executionIdArry[j])   
								              flag = false;   
								        }   
								        if(flag)   
								        	oneExecutionId = executionIdsSub[i];
								    }   
							}
						}
					});
					//解决子流程节点配置并行不等待时，循环会签时，子流程日志中节点的历史记录显示异常的问题start
					if(historyPathCopy.length > 0){
						$.each(historyPathCopy,function(i,n){
							if(!(n == undefined)){
								//解决子流程节点配置并行不等待时，循环会签时，子流程日志中节点的历史记录显示异常的问题start
								//找到子流程节点的子执行实例id，然后剩下不包括在executionIds中的那个executionId，然后判断该executionId和n.executionId是否相等，相等就存进sonHIstoryPath中去
								if(null != executionIdsSub && n.executionId == oneExecutionId){
									sonHistoryPath.push(n);
								}
								//解决子流程节点配置并行不等待时，循环会签时，子流程日志中节点的历史记录显示异常的问题end
								if(execIdTemp == ""){
									if(n.executionId > executionId){
										execIdTemp = n.executionId;
									}
								}else{
									if(n.executionId < execIdTemp && n.executionId > executionId){
										execIdTemp = n.executionId;
									}
								}
							}
						});
					}
				}else{
					execIdTemp = sonHistoryPath[0].executionId;
				}
				$.ajax({
					url:basePath+"bpmnAction/scanBpmnLog/queryIsFireSubprocess.do?tokenid="+tokenID,    
					data:{
						"varName" : "fireSubprocessExecId_" + execIdTemp,
						"procInstId" : procInstId
					},  
					type:"POST",
					dataType:"json",
					async:false,
					success:function(pr, textStatus){
						if(pr.success){
							if(subprocessNodes.length > 0 ){
								$.each(subprocessNodes,function(i,n){
									sonHistoryPath.push(n);
								});
							}
						}
					}
				});
				sonHistoryPath.unshift({
					taskKey : ziStartNodeId+"_"+nodeId,
					startTime : subStartTime
				});
				/**
				 * 创建GooFlow对象
				 */
				_myflowzi=$.createGooFlow($("#myflowzi"),{
					haveTool:true,
					haveToolbar:true,
					haveGroup:true,
					useOperStack:true
				});	
				/**
				 * 加载数据成功，隐藏Loading图片显示流程日志信息
				 */
				sp.spin();
				/**
				 * 初始化工作区画布大小
				 */
				$("#GooFlow_work_inner").css({"width":canvasWidth+"px","height":canvasHeight+"px"});
				/**
				 * 加载流程模板信息
				 */
				_myflowzi.loadData(jsondata);
//				var size = Object.keys(_myflowzi.$nodeData).length;
//				var lineSize = Object.keys(_myflowzi.$lineData).length;
				var size = JSONLength(_myflowzi.$nodeData);
				var lineSize = JSONLength(_myflowzi.$lineData);
				var count = 1;
				var lineCount = 1;
				$.each(_myflowzi.$nodeData,function(i,n){
					if(count<=size){
						_myflowzi.transNewId(i,i+"_"+nodeId,"node");
						count++;
					}else{
						return true;
					}
				});
				$.each(_myflowzi.$lineData,function(i,n){
					if(lineCount<=lineSize){
						_myflowzi.transNewId(i,i+"_"+nodeId,"line");
						lineCount++;
					}else{
						return true;
					}
				});
				
				/**
				 * 不同颜色显示流程日志
				 * 		当前节点：绿色
				 * 		历史节点与线：红色
				 */
				$.each( sonHistoryPath, function(i, n){
//					if(i==sonHistoryPath.length-1){
//						_myflowzi.markItem(n.taskKey,'currentNode',true);
//					}else{
//						_myflowzi.markItem(n.taskKey,'historyNode',true);
//					}
					if(n.taskKey.indexOf("usertask") == 0 && n.endTime == ""){
						_myflowzi.markItem(n.taskKey,'currentNode',true);
					}else{
						_myflowzi.markItem(n.taskKey,'historyNode',true);
					}
					_myflowzi.markItem(n.sequenceKey,'line',true);
				});
				var maxLeftOfNode = 0;
				var maxTopOfNode = 0;
				var iframeWidth = $(document).width();
				var iframeHeight = $(document).height();
				$.each(jsondata.nodes,function(i,n){
					maxLeftOfNode = maxLeftOfNode>n.left?maxLeftOfNode:n.left;
					maxTopOfNode = maxTopOfNode>n.top?maxTopOfNode:n.top;
				});
				maxLeftOfNode = maxLeftOfNode +660;
				maxTopOfNode = maxTopOfNode + 260;
				$("#myflowzi").css({"background":"white","border":"#ADD2ED 0px solid","width":"100%","height":iframeHeight});
				$("#GooFlow_work").css({"border":"#F3F3F3 0px solid","overflow":"auto","background":"white","width":"100%","height":iframeHeight});
				$("#GooFlow_work_inner").css({"position":"relative","overflow":"hidden"});
				if(maxLeftOfNode > iframeWidth && maxTopOfNode > iframeHeight){
					$("#GooFlow_work_inner").css({"width":maxLeftOfNode+"px","height":maxTopOfNode+"px"});
				}else if(maxLeftOfNode > iframeWidth && maxTopOfNode < iframeHeight){
					$("#GooFlow_work_inner").css({"width":maxLeftOfNode+"px","height":iframeHeight-17+"px"});
				}else if(maxLeftOfNode < iframeWidth && maxTopOfNode > iframeHeight){
					$("#GooFlow_work_inner").css({"width":iframeWidth-17+"px","height":maxTopOfNode+"px"});//
				}else if(maxLeftOfNode < iframeWidth && maxTopOfNode < iframeHeight){
					$("#GooFlow_work_inner").css({"width":iframeWidth-17+"px","height":iframeHeight-17+"px"});
				}
				if(isShowBackgroundGrid == "0"){
					$("#GooFlow_work_inner").css({"background-image":"none"});
				}
			}
		}
	});
	
	/**
	 * 注册选中事件：选中某个单元时，显示该单元在工作流中的处理信息。
	 */
	_myflowzi.onItemFocus=function(id,type){
		if(isShowNodeMessage == "1"){
			_myflowzi.$editable=false;
			$("#divProperty").empty();
			var dataObject;
			if(type == 'node'){
				$("#divProperty").css({"left":_myflowzi.$nodeData[id].left+"px","top":_myflowzi.$nodeData[id].top+45+"px","z-index":"11"});
				dataObject = $("<table>",{
					id:"list",
				}).appendTo($("#divProperty"));
			}else{
				return false;
			}
			var theData=[];
			var maxStartTime="";
			$.each( sonHistoryPath, function(i, n){
				if(id==n.taskKey){
					if(id.indexOf("sub") != 0){
						theData.push({assginee:n.assigneeName,startTime:n.startTime,endTime:n.endTime,comment:n.comment});
					}
					if(i>0 && i<historyPath.length&&id.indexOf("sub") == 0&&n.taskKey.indexOf("exclusivegateway")<0&&n.taskKey.indexOf("endevent")!=0){
						var startTime=new Date(n.startTime.replace(/-/g,"/"));
						if(maxStartTime==""){
							maxStartTime = startTime;
						}else if(maxStartTime-startTime<0){
							maxStartTime = startTime;
						}
					}
				}
			});
			var divContainer=$("<div>",{
				id    :"iframeId",
				height :"462px",
				scrolling:"no"
			});
			var count=1;
			$.each( sonHistoryPath, function(i, n){
				if(id==n.taskKey){
					if(i==0){
						loadStartDataGrid(dataObject,theData);
					}else if(i>0 && i<sonHistoryPath.length){
						if(n.taskKey.indexOf("exclusivegateway")<0)
						{
							if(n.taskKey.indexOf("endevent") == 0){
								loadEndDataGrid(dataObject,theData);
							}else{
								if(id.indexOf("sub") != 0){
									loadHistoryDataGrid(dataObject,theData);
								}else if(new Date(n.startTime.replace(/-/g,"/"))-maxStartTime==0){
									////////////////////////////////////////////
									var pdKey = "";
									var nodes = _myflowzi.exportData().nodes;
									var subStartTime = n.startTime;
									$.each(nodes,function(h,k){
										if(id.indexOf(h) == 0){
											pdKey = k.general.calledElement;
											return true;
										}
									});
									if(pdKey == ""){
										loadHistoryDataGrid(dataObject,theData);
									}else{
										 var ziDialogDom = $("#ziDialog");
										ziDialogDom.dialog({
											height : 500,
											width : 900,
											modal : true,
											resizable : false,
											autoOpen : false,
											show : {
												effect : "blind",
												duration : 100
											},
											title : "子流程日志图",
											hide : {
												effect : "blind",
												duration : 100
											},
											onClose : function() {
												ziDialogDom.empty(); //清空内容
											},
										});
										ziDialogDom.dialog("open");
										var src=basePath+"hqbpmn/bpmnlog/subScanBpmnLog.jsp?ticketId="+
										ticketId+"&bpmnType="+bpmnType+"&executionId="+n.executionId+"&pdKey="+pdKey+"&nodeId="+id+"&subStartTime="+subStartTime+
										"&isShowNodeMessage="+isShowNodeMessage+"&isShowBackgroundGrid="+isShowBackgroundGrid+"";
										if(tokenID){
											src=basePath+"hqbpmn/bpmnlog/subScanBpmnLog.jsp?ticketId="+
											ticketId+"&bpmnType="+bpmnType+"&executionId="+n.executionId+"&pdKey="+pdKey+"&nodeId="+id+"&subStartTime="+subStartTime+
											"&isShowNodeMessage="+isShowNodeMessage+"&isShowBackgroundGrid="+isShowBackgroundGrid+"tokenid="+tokenID+"";
										}
										if(!$("#iframeId").length>0){
											divContainer.appendTo(ziDialogDom);
										}
										var tab=$("<div>",{
											id       :i,
											scrolling:"no"
										}).css("height","432px");
										$("<iframe>",{
											src:src,
										    width:"100%",
										    height:"100%",
											frameborder:"0",
											scrolling:"no"
										}).appendTo(tab);
										$('#iframeId').tabs({    
										    border:false,
										    onSelect:function() {
										    	var cur_tab = $('#iframeId').tabs('getSelected');
								                var tbIframe = cur_tab.find(" iframe:first-child");
								                tbIframe.attr("src",tbIframe.attr("src"));  
										    }
										}); 
										// add a new tab panel    
										$('#iframeId').tabs('add',{    
										    title:'子流程'+count,    
										    content:tab
										});  
										count++;
										var divs=ziDialogDom.children();
										if($(divs[0]).attr("class")=="panel"){
											$(divs[0]).remove();
										}
										if(ziDialogDom.css("overflow")=="hidden"){
											ziDialogDom.css("overflow","");
										}
									}
									////////////////////////////////////////////
								}
							}
						}
					}
				}
				
			});
			/**
			 * 遍历各个标题，然后去掉列的排序
			 */ 
			var th = $("#gview_list").children("div").eq(1).find("th");
			$.each(th, function(index, data) {
				$(data).children("div").removeClass("ui-jqgrid-sortable");
				$(data).children("div").children("span").remove(); 
			});
			return true;
		}
	};
	_myflowzi.moveNode={};
	_myflowzi.$ghost={};
	_myflowzi.$textArea={};
	_myflowzi.$editable=false;
	/**
	 * 注册工作空间单击事件
	 */
	$(_myflowzi.$workArea).on("click",function(){
		$("#divProperty").empty();
	});
	
});
/**
 * 历史节点与当前节点信息的表格样式
 */
function loadHistoryJqGrid(dataObject,theData){
	dataObject.jqGrid({
	    data: theData,
	    datatype: "local",
	    colNames: ['处理人','开始时间', '结束时间', '意见'],
		colModel: [
		    {name:'assginee',index:'assginee'},
			{name:'startTime',index:'startTime'},
			{name:'endTime',index:'endTime'},
			{name:'comment',index:'comment'}
		],
		height: 'auto',
		width: 'auto',
		autowidth: true,
		hidegrid: false,
		gridview: true,             
        rownumbers: true,
        sortname: 'startTime',
        sortorder: 'desc'
	}).closest(".ui-jqgrid-bdiv").css({'overflow-x':'hidden'});
}
function loadHistoryDataGrid(dataObject,theData){
	$("#divProperty").css("width","645px");
	dataObject.datagrid({
		data        :theData,
		datatype    : "local",
		singleSelect: true,
		rownumbers  : true,
		sortName    :'startTime',
		sortOrder   :'desc',
		columns:[[
			        {field:'assginee',title:'处理人',width:150,align:'center',
			        	formatter: function(value,row,index){
			        		var showValue = value.length>10?value.substring(0,16)+"..":value;
							return "<span title='"+value+"'>"+ showValue+"</span>";
					 }},
			        {field:'startTime',title:'开始时间',width:150,align:'center'},
			        {field:'endTime',title:'结束时间',width:150,align:'center'},
			        {field:'comment',title:'意见',width:150,align:'center'}
			    ]]
	});
}
/**
 * 开始节点信息的表格样式
 */
function loadStartJqGrid(dataObject,theData){
	dataObject.jqGrid({
	    data: theData,
	    datatype: "local",
	    colNames: ['启动时间'],
		colModel: [
			{name:'startTime',index:'startTime'}
		],
		height: 'auto',
		width: 'auto',
		hidegrid: false,
		gridview: true            
	}).closest(".ui-jqgrid-bdiv").css({'overflow-x':'hidden'});
}
function loadStartDataGrid(dataObject,theData){
	$("#divProperty").css("width","165px");
	dataObject.datagrid({
	    data: theData,
	    datatype: "local",
		columns:[[
			        {field:'startTime',title:'开始时间',width:150,align:'center'}
			    ]]
	});
}
/**
 * 结束节点信息的表格样式
 */
function loadEndJqGrid(dataObject,theData){
	dataObject.jqGrid({
	    data: theData,
	    datatype: "local",
	    colNames: ['完成时间'],
		colModel: [
			{name:'endTime',index:'endTime'}
		],
		height: 'auto',
		width: 'auto',
		hidegrid: false,
		gridview: true            
	}).closest(".ui-jqgrid-bdiv").css({'overflow-x':'hidden'});
}
function loadEndDataGrid(dataObject,theData){
	$("#divProperty").css("width","185px");
	dataObject.datagrid({
	    data: theData,
	    datatype: "local",
	    columns:[[
			        {field:'endTime',title:'结束时间',width:150,align:'center'}
			    ]]
	});
}
function JSONLength(obj) {
	var size = 0, key = null;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}



