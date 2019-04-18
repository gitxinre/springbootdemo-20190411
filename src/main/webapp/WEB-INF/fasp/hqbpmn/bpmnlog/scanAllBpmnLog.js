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
	var jsondata=new Array();
	//GooFlow工作区的宽度与高度
	var canvasWidth = null;
	var canvasHeight = null;
	$.ajax({
        url:basePath+"bpmnAction/scanBpmnLog/findTemDefByBpmnTypesAndTicketIds.do?tokenid="+tokenID,  
		type:"POST",
		data:"ticketId=" + ticketId + "&bpmnType=" +bpmnType,  
		//data:"ticketId=" + ticketId + ",500,600" +"&bpmnType=" +bpmnType + ",exsiclusideGatewayOfComplete,subProcessNodeTest",  
		dataType:"json",
		async:false,
		success:function(pr, textStatus){
			if(pr.success){
				var temdata = pr.result;
				for(var i = 0; i < temdata.length; i++){
					var temp = JSON.parse(temdata[i].contentBytesStr);
					temp.id = temdata[i].id;
					temp.canvasWidth = temdata[i].canvasWidth;
					temp.canvasHeight = temdata[i].canvasHeight;
					jsondata.push(temp);
					canvasWidth += parseInt(temdata[i].canvasWidth);
					canvasHeight += parseInt(temdata[i].canvasHeight);
				}
			}
		}
	});
	/**
	 * 后台请求流程的历史节点路径信息
	 */
	var _myflow;
	var historyPath=null;
	$.ajax({
        url:basePath+"bpmnAction/scanBpmnLog/findAllNodesHitoryPath.do?tokenid="+tokenID,    
		type:"POST",
		data:"ticketId=" + ticketId +"&bpmnType=" +bpmnType,  
		dataType:"json",
		async:false,
		success:function(pr, textStatus){
			if(pr.success){
				historyPath = pr.result;		
				/**
				 * 创建GooFlow对象
				 */
				_myflow=$.createGooFlow($("#myflow"),{
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
				//_myflow.loadData(jsondata[0]);
				for(var i = 0; i < jsondata.length; i++){
					debugger;
					var processContentBytes = JSON.stringify(jsondata[i]);
					var processContentBytesObj = JSON.parse(processContentBytes);
					var nodeList = processContentBytesObj.nodes;
					var lineList = processContentBytesObj.lines;
					if(i != 0){
						_myflow.loadData(jsondata[i]);
						var maxTop = 0;
						//找到当前流程的上一个流程的节点
						var processContentBytesPreProcess = JSON.stringify(jsondata[i-1]);
						var processContentBytesObjPreProcess = JSON.parse(processContentBytesPreProcess);
						var nodeListPreProcess = processContentBytesObjPreProcess.nodes;
						//获取当前流程的上一个流程中的最大的坐标
						$.each(nodeListPreProcess,function(k,node){
							if(maxTop < node.top){
								maxTop = node.top;
							}
						});
						$.each(nodeList,function(i,node){
							_myflow.moveNode(i,node.left,node.top+maxTop+50);
						});
						$.each(lineList,function(j,line){
							if(line.type == "tb"){
								_myflow.setLineM(j,line.M + (maxTop+50));
							}
						});
					}else{
						_myflow.loadData(jsondata[i]);
					}
				}
				$.each(_myflow.$nodeDom,function(key,n){
					if(key.indexOf("startevent") == 0 || key.indexOf("endevent") == 0){
						n.css("zIndex","");
					}
				});
				/**
				 * 不同颜色显示流程日志
				 * 		当前节点：绿色
				 * 		历史节点与线：红色
				 */
				$.each( historyPath, function(i, n){
//					if(i==historyPath.length-1){
//						_myflow.markItem(n.taskKey,'currentNode',true);
//					}else{
//						_myflow.markItem(n.taskKey,'historyNode',true);
//					}
					if(n.taskKey.indexOf("usertask") == 0 && n.endTime == ""){
						_myflow.markItem(n.taskKey,'currentNode',true);
					}else{
						_myflow.markItem(n.taskKey,'historyNode',true);
					}
					if(historyPath[i].taskKey=="startevent_userTask"&&i==historyPath.length-1){
						_myflow.markItem(historyPath[0].taskKey,'currentNode',true);
					}
					_myflow.markItem(n.sequenceKey,'line',true);
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
				$("#myflow").css({"background":"white","border":"#ADD2ED 0px solid","width":"100%","height":iframeHeight});
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
	//获取隐藏的节点的信息
	function getHideNodeInfo(){
		var theData=[];
		$.each( historyPath, function(i, n){
			if(n.taskKey=="startevent_userTask"){
				theData.push({assginee:n.assigneeName,startTime:n.startTime,endTime:n.endTime,comment:n.comment});
			}
		});
		return theData;
	}
	/**
	 * 注册选中事件：选中某个单元时，显示该单元在工作流中的处理信息。
	 */
	_myflow.onItemFocus=function(id,type){
		if(isShowNodeMessage == "1"){
			_myflow.$editable=false;
			$("#divProperty").empty();
			var dataObject;
			if(type == 'node'){
				$("#divProperty").css({"left":_myflow.$nodeData[id].left+"px","top":_myflow.$nodeData[id].top+45+"px","z-index":"11"});
				dataObject = $("<table>",{
					id:"list",
				}).appendTo($("#divProperty"));
			}else{
				return false;
			}
			var theData=[];
			var maxStartTime="";
			$.each( historyPath, function(i, n){
				if(id==n.taskKey){
					if(id.indexOf("sub") != 0 && id.indexOf("countersign") != 0){
						theData.push({assginee:n.assigneeName,startTime:n.startTime,endTime:n.endTime,comment:n.comment});
					}
					if(id.indexOf("countersign") == 0){
						theData.push({assginee:n.assigneeName,startTime:n.startTime,endTime:n.endTime,comment:n.comment,operation:n.operation,property:n.property});
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
				height :"562px",
				scrolling:"no"
			});
			var count=1;
			$.each( historyPath, function(i, n){
				if(id==n.taskKey){
					if(i==0){
						//loadStartJqGrid(dataObject,theData);
						//loadStartDataGrid(dataObject,theData);
						var dataInfo=getHideNodeInfo();
						loadHideStartDataGrid(dataObject,dataInfo);
					}else if(i>0 && i<historyPath.length){
						if(n.taskKey.indexOf("exclusivegateway")<0)
						{
							if(n.taskKey.indexOf("endevent")==0){
								//loadEndJqGrid(dataObject,theData);
								loadEndDataGrid(dataObject,theData);
							}else if(n.taskKey.indexOf("countersign")==0){
								debugger;
								//会签节点
								loadCountersignNodeHistoryDataGrid(dataObject,theData);
							}else{
								if(id.indexOf("sub") != 0){
									//loadHistoryJqGrid(dataObject,theData);
									loadHistoryDataGrid(dataObject,theData);
								}else  if(true){
								//}else  if(new Date(n.startTime.replace(/-/g,"/"))-maxStartTime==0){
									var pdKey = "";
									var nodes = _myflow.exportData().nodes;
									var subStartTime = n.startTime;
									$.each(nodes,function(h,k){
										if(id.indexOf(h) == 0){
											pdKey = k.general.calledElement;
											return true;
										}
									});
									if(pdKey == ""){
										//loadHistoryJqGrid(dataObject,theData);
										loadHistoryDataGrid(dataObject,theData);
									}else{
										 var ziDialogDom = $("#ziDialog");
										ziDialogDom.dialog({
											height : 600,
											width : 1000,
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
											}
										});
										ziDialogDom.dialog("open");
										var src=basePath+"hqbpmn/bpmnlog/subScanBpmnLog.jsp?ticketId="+
										ticketId+"&bpmnType="+bpmnType+"&executionId="+n.executionId+"&pdKey="+pdKey+"&nodeId="+id+"&subStartTime="+subStartTime+
										"&isShowNodeMessage="+isShowNodeMessage+"&isShowBackgroundGrid="+isShowBackgroundGrid+"";
										if(tokenID){
											src=basePath+"hqbpmn/bpmnlog/subScanBpmnLog.jsp?ticketId="+
											ticketId+"&bpmnType="+bpmnType+"&executionId="+n.executionId+"&pdKey="+pdKey+"&nodeId="+id+"&subStartTime="+subStartTime+
											"&isShowNodeMessage="+isShowNodeMessage+"&isShowBackgroundGrid="+isShowBackgroundGrid+"&tokenid="+tokenID+"";
										}
										/*$("<iframe>",{
											src:src,
											width:"100%",
											height:"100%",
											frameborder:"0",
											scrolling:"no"
										}).appendTo(ziDialogDom);*/
										if(!$("#iframeId").length>0){
											divContainer.appendTo(ziDialogDom);
										}
										var tab=$("<div>",{
											id       :i,
											scrolling:"no"
										}).css("height","532px");
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
	_myflow.moveNode={};
	_myflow.$ghost={};
	_myflow.$textArea={};
	_myflow.$editable=false;
	/**
	 * 注册工作空间单击事件
	 */
	$(_myflow.$workArea).on("click",function(){
		$("#divProperty").empty();
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
		$("#divProperty").css("width","635px");
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
				        		var firstString=value.substring(0,14);
				        		var arr=[];
				        		arr=firstString.split(",");
				        		var showValue = value.length>14?(arr[0]+"..."):value;
								return "<span title='"+value+"'>"+ showValue+"</span>";
						 }},
				        {field:'startTime',title:'开始时间',width:150,align:'center'},
				        {field:'endTime',title:'结束时间',width:150,align:'center'},
				        {field:'comment',title:'意见',width:150,align:'center'}
				    ]]
		});
		}
	/**
	 * 会签节点信息的表格样式
	 */
	function loadCountersignNodeHistoryDataGrid(dataObject,theData){
		$("#divProperty").css("width","817px");
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
				        		var firstString=value.substring(0,14);
				        		var arr=[];
				        		arr=firstString.split(",");
				        		var showValue = value.length>14?(arr[0]+"..."):value;
								return "<span title='"+value+"'>"+ showValue+"</span>";
						 }},
				        {field:'startTime',title:'开始时间',width:150,align:'center'},
				        {field:'endTime',title:'结束时间',width:150,align:'center'},
				        {field:'operation',title:'操作',width:185,align:'center'},
				        {field:'property',title:'属性',width:150,align:'center'},
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
		    colNames: ['创建人','创建时间'],
			colModel: [
			    {name:'assginee',index:'assginee'},
				{name:'startTime',index:'startTime'}
			],
			height: 'auto',
			width: 'auto',
			hidegrid: false,
			gridview: true            
		}).closest(".ui-jqgrid-bdiv").css({'overflow-x':'hidden'});
	}
	function loadStartDataGrid(dataObject,theData){
		$("#divProperty").css("width","315px");
		dataObject.datagrid({
		    data: theData,
		    datatype: "local",
			columns:[[
				        {field:'assginee',title:'创建人',width:150,align:'center'},
				        {field:'startTime',title:'开始时间',width:150,align:'center'}
				    ]]
		});
	}
	function loadHideStartDataGrid(dataObject,theData){
		$("#divProperty").css("width","485px");
		dataObject.datagrid({
		    data: theData,
		    datatype: "local",
			columns:[[
				        {field:'assginee',title:'创建人',width:150,align:'center',
				        	formatter: function(value,row,index){
				        		var firstString=value.substring(0,14);
				        		var arr=[];
				        		arr=firstString.split(",");
				        		var showValue = value.length>14?(arr[0]+"..."):value;
								return "<span title='"+value+"'>"+ showValue+"</span>";
						 }},
				        {field:'startTime',title:'开始时间',width:150,align:'center'},
				        {field:'endTime',title:'结束时间',width:150,align:'center'}
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
		    colNames: ['结束时间'],
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
});




