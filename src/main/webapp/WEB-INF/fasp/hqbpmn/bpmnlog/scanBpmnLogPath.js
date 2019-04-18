window.onerror=function(){return true;};
$().ready(function(){
	/**
	 * 显示Loading图片，等待加载数据
	 */
	var target = $("#preview").get(0);
	var sp = new Spinner({            
        lines: 15, 			// 花瓣数目
        length: 15, 		// 花瓣长度
        width: 5, 			// 花瓣宽度
        radius: 25, 		// 花瓣距中心半径
        corners: 1, 		// 花瓣圆滑度 (0-1)
        rotate: 0, 			// 花瓣旋转角度
        direction: 1, 		// 花瓣旋转方向 1: 顺时针, -1: 逆时针
        color: '#646464', 	// 花瓣颜色
        speed: 1, 			// 花瓣旋转速度
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
	var _myflow;
	$.ajax({
        url:basePath+"bpmnAction/scanBpmnLog/spliceBpmnLogInfo.do?tokenid="+tokenID,    
		type:"POST",
		data:"ticketId=" +ticketId+"&bpmnType=" +bpmnType+ "&showLogType=" +showLogType+ "&perLineNodeNumber=" +perLineNodeNumber+ 
			 "&initStartNodeLeft=" +initStartNodeLeft+ "&initStartNodeTop=" +initStartNodeTop ,  
		dataType:"json",
		async:false,
		success:function(pr, textStatus){
			if(pr.success){
				jsondata = pr.result;	
				/**
				 * 创建GooFlow对象
				 */
				_myflow=$.createGooFlow($("#myflow"),{
					haveTool:true,
					haveGroup:true,
					useOperStack:true
				});
				/**
				 * 修改样式
				 */
				var iframeWidth = $(document).width();
				var iframeHeight = $(document).height();
				$("#myflow").css({"background":"white","border":"#ADD2ED 0px solid","width":"100%","height":iframeHeight});
				$("#GooFlow_work").css({"border":"#F3F3F3 0px solid","overflow":"auto","background":"white","width":"100%","height":iframeHeight});
				$("#GooFlow_work_inner").css({"position":"relative","overflow":"hidden"});
				if(showLogType == "0"){
					if(paintingWidth == "null" && paintingHeight == "null"){
						var defaultLineWidth = parseInt(initStartNodeLeft) + 40 + (105+100)*(count(jsondata.nodes) - 1) + 500;
						if(defaultLineWidth>iframeWidth){
							var iframeHeightValue = parseInt(iframeHeight)-17;
							$("#GooFlow_work_inner").css({"width":defaultLineWidth+"px","height":iframeHeightValue+"px"});
						}else{
							$("#GooFlow_work_inner").css({"width":"100%","height":iframeHeight});
						}
					}else if(paintingWidth == "null" && paintingHeight != "null"){
						var defaultLineWidth = parseInt(initStartNodeLeft) + 40 + (105+100)*(count(jsondata.nodes) - 1) + 500;
						if(defaultLineWidth>iframeWidth){
							$("#GooFlow_work_inner").css({"width":defaultLineWidth+"px","height":parseInt(paintingHeight)+"px"});
						}else{
							$("#GooFlow_work_inner").css({"width":"100%","height":parseInt(paintingHeight)+"px"});
						}
					}else if(paintingWidth != "null" && paintingHeight == "null"){
						if(parseInt(paintingWidth)>iframeWidth){
							var iframeHeightValue = parseInt(iframeHeight)-17;
							$("#GooFlow_work_inner").css({"width":parseInt(paintingWidth)+"px","height":iframeHeightValue+"px"});
						}else{
							$("#GooFlow_work_inner").css({"width":parseInt(paintingWidth)+"px","height":iframeHeight+"px"});
						}
					}else if(paintingWidth != "null" && paintingHeight != "null"){
						$("#GooFlow_work_inner").css({"width":parseInt(paintingWidth)+"px","height":parseInt(paintingHeight)+"px"});
					}
				}else{
					if(paintingWidth == "null" && paintingHeight == "null"){
						var rowNumber = 0;
						if(count(jsondata.nodes) % perLineNodeNumber > 0){
							rowNumber = Div(count(jsondata.nodes),perLineNodeNumber)+1;
						}else{
							rowNumber = Div(count(jsondata.nodes),perLineNodeNumber);
						}
						var defaultSZWidth = parseInt(initStartNodeLeft) + 105 + (105+100)*(perLineNodeNumber - 1) + 500;
						var defaultSZHeight = parseInt(initStartNodeTop) + 30*rowNumber + 70*(rowNumber-1) + 70;
						if(defaultSZWidth > iframeWidth){
							$("#GooFlow_work_inner").css({"width":defaultSZWidth,"height":defaultSZHeight});
						}else{
							$("#GooFlow_work_inner").css({"width":"100%","height":defaultSZHeight});
						}
					}else if(paintingWidth == "null" && paintingHeight != "null"){
						var defaultSZWidth = parseInt(initStartNodeLeft) + 105 + (105+100)*(perLineNodeNumber - 1) + 500;
						if(defaultSZWidth > iframeWidth){
							$("#GooFlow_work_inner").css({"width":defaultSZWidth,"height":parseInt(paintingHeight)+"px"});
						}else{
							$("#GooFlow_work_inner").css({"width":"100%","height":parseInt(paintingHeight)+"px"});
						}
					}else if(paintingWidth != "null" && paintingHeight == "null"){
						var rowNumber = 0;
						if(count(jsondata.nodes) % perLineNodeNumber > 0){
							rowNumber = Div(count(jsondata.nodes),perLineNodeNumber)+1;
						}else{
							rowNumber = Div(count(jsondata.nodes),perLineNodeNumber);
						}
						var defaultSZHeight = parseInt(initStartNodeTop) + 30*rowNumber + 70*(rowNumber-1) + 70;
						$("#GooFlow_work_inner").css({"width":parseInt(paintingWidth)+"px","height":defaultSZHeight});
					}else if(paintingWidth != "null" && paintingHeight != "null"){
						$("#GooFlow_work_inner").css({"width":parseInt(paintingWidth)+"px","height":parseInt(paintingHeight)+"px"});
					}
				}
				if(isShowBackgroundGrid == "0"){
					$("#GooFlow_work_inner").css({"background-image":"none"});
				}
				/**
				 * 加载数据成功，隐藏Loading图片显示流程日志信息
				 */
				sp.spin();
				/**
				 * 动态显示流程日志信息
				 */
				if(jsondata!=null){
					_myflow.loadData(jsondata);} 
				_myflow.moveNode={};
				_myflow.$ghost={};
				_myflow.$textArea={};
				_myflow.$editable=false;
			}
		}
	});
	/**
	 * 注册选中事件：选中某个单元时，显示该单元在工作流中的处理信息。
	 */
	_myflow.onItemFocus=function(id,type){
		if(isShowNodeMessage == "1"){
			_myflow.$editable=false;
			$("#divProperty").empty();
			var dataObject;
			if(type == 'node'){
				$("#divProperty").css({"left":_myflow.$nodeData[id].left+"px","top":_myflow.$nodeData[id].top+40+"px","z-index":"11"});
				dataObject = $("<table>",{
					id:"list",
				}).appendTo($("#divProperty"));
			}else{
				return false;
			}
			var theData=[];
			$.each( jsondata.nodes, function(i, n){
				if(id==i){
					theData.push({startTime:n.startTime,endTime:n.endTime,comment:n.comment});
				}
			});	
			/**
			 * 区分开始节点与其他节点的提示信息显示样式
			 */
			
			$.each( jsondata.nodes, function(i, n){
				if(id == i){
					if(i.indexOf("startevent") == 0){
						loadStartJqGrid(dataObject,theData);
					}else{
						if(i.indexOf("endevent") == 0){
							loadEndJqGrid(dataObject,theData);
						}else{
							loadHistoryJqGrid(dataObject,theData);
						}
					}
				}
			});	
			/**
			 * 遍历各个标题，然后去掉列的排序
			 */ 
			var th = $("#gview_list").children("div").eq(1).find("th");
			$.each(th, function(index, data) {
				$(data).children("div").children("span").remove(); 
			});
			return true;
		}
	};
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
		    colNames: ['ID','开始时间', '结束时间', '意见'],
			colModel: [
			    {name:'id',index:'id', hidden:true},
				{name:'startTime',index:'startTime'},
				{name:'endTime',index:'endTime'},
				{name:'comment',index:'comment'}
			],
			sortable:false,
			height: 'auto',
			width: 'auto',
			autowidth: true,
			hidegrid: false,
			gridview: true,
		}).closest(".ui-jqgrid-bdiv").css({'overflow-x':'hidden'});
	}
	/**
	 * 开始节点信息的表格样式
	 */
	function loadStartJqGrid(dataObject,theData){
		dataObject.jqGrid({
		    data: theData,
		    datatype: "local",
		    colNames: ['创建时间'],
			colModel: [
				{name:'startTime',index:'startTime'},
			],
			sortable:false,
			height: 'auto',
			width: 'auto',
			hidegrid: false,
			gridview: true            
		}).closest(".ui-jqgrid-bdiv").css({'overflow-x':'hidden'});
	};
	/**
	 * 结束节点信息的表格样式
	 */
	function loadEndJqGrid(dataObject,theData){
		dataObject.jqGrid({
		    data: theData,
		    datatype: "local",
		    colNames: ['结束时间'],
			colModel: [
				{name:'endTime',index:'endTime'},
			],
			sortable:false,
			height: 'auto',
			width: 'auto',
			hidegrid: false,
			gridview: true            
		}).closest(".ui-jqgrid-bdiv").css({'overflow-x':'hidden'});
	};
	/**
	 * 整除运算
	 */
	function Div(exp1, exp2)  
	{  
	    var n1 = Math.round(exp1); 		//四舍五入  
	    var n2 = Math.round(exp2); 		//四舍五入  
	    var rslt = n1/n2; 				//除  
	    if (rslt >= 0){  
	        rslt = Math.floor(rslt); 	//返回小于等于原rslt的最大整数。  
	    }else{  
	        rslt = Math.ceil(rslt); 	//返回大于等于原rslt的最小整数。  
	    }  
	    return rslt;  
	}  
	/**
	 * 获取对象中元素的个数
	 */
	function count(obj){
		var t = typeof obj;
		if(t == "string"){
			return obj.length;
		}else if(t == "object"){
			var n = 0;
			for(var i in obj){
				n++;
			}
			return n;
		}
		return false;
	}
});



