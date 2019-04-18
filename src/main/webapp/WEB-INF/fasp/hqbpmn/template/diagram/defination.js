var _myflow;
var canvasWidth = null;
var canvasHeight = null;
$(function() {
	$("#divProperty").unbind("click").click(function(e){ 
		$("textarea[bgcolor='red']").hide();
	}
	
	); 
});

$(document).ready(function(){
	//$(".gzl004" ).button();
	$(document.body).css({
	    "overflow-x":"hidden",
	    "overflow-y":"hidden"
	});

    // id值不存在的时候进入的为新增页面
    var jsondata=null;
    //GooFlow工作区的宽度与高度
	
	if (id == "null") {
		// 根据分类实际值查询分类显示值
		jsondata = {
				id:null,
			    title:"新建工作流",
				initNum:1,
				diagram:{
					bpmn:{
				        categroy:category,
				        version:"0",
				        createBy:"",
				        deployState:"0",
				        versionState:"0",
				        processDefId:"",		        
				        procDefKey:pdKey,
				        candidateStartUsers:"",
				        candidateStartGroups:"",
				        document:""
					},
					variable:{
						variable:[]
					},
					listener:{
						bpmnListener:[]
					}
				},	
		};     
    } else {
 	   // 进入到修改页面的时候，根据json字符串初始化修改页面
 	   $.ajax({
 	        url:basePath+"bpmnAction/templateDef/findTemplateDefById.do?tokenid="+tokenID,    
 			type:"POST",
 			data:"id=" + id,  
 			dataType:"json",
 			async:false,
 			success:function(pr, textStatus){
 				if(pr.success){
 					// 将字符串转换成json
 					var temdata = pr.result;
 					canvasWidth = parseInt(temdata.canvasWidth);
 					canvasHeight = parseInt(temdata.canvasHeight);
 					jsondata = JSON.parse(temdata.contentBytesStr);
 					jsondata.diagram.bpmn.version = temdata.version.toString();
 					jsondata.diagram.bpmn.versionState = temdata.versionState.toString();
 					jsondata.diagram.bpmn.deployState = temdata.deployState.toString();
 					jsondata.id = temdata.id;
 				}
 			}
 		});
    }
    //快捷键定义 
     //TODO另存为   保存   重新发布
    $(document).keydown(function(event) { 
    	if ( event.ctrlKey && event.which == 83) {//添加ctrl+s保存功能
    		 event.preventDefault();  
    		 
    		  if(deployState==0){
    			  doRedistribute();
    		  }else{
    			  doSave();
    		  }
             return false;   
    	}else{ 
            return true;   
        } 
    });  
    
   
    /***********     创建工具条 start     **/
    //已部署
    if(deployState==0){
//    	$("#toolbar").dtoolbar({
//    		items:[
//             {
//    				id:'tb_saveas',
//    			    ico : 'btnSave',
//    			    text : '另存',
//    			    index : '0',
//    			    handler : function(){
//    			    	doSaveAs();
//    			    }		  
//    			  },{
//    					id:'tb_redistribute',
//    				    ico : 'btnrs',
//    				    text : '重新部署',
//    				    index : '1',
//    				    handler : function(){
//    				    	doRedistribute();
//    				    }		  
//    				  }]
//    	});
    }else{
//     	$("#toolbar").dtoolbar({
//    		items:[
//              {
//    			id:'tb_save',
//    		    ico : 'btnSave',
//    		    text : '保存',
//    			disabled:false,
//    		    handler : function(){
//    				doSave();
//    		    }		  
//    		  }]
//    	});
    }
    /**
     * 调整画布大小按钮
     */
//    $("#toolbar").dtoolbar({
//		items:[
//         {
//    			id:'tb_changeCanvas',
//    		    ico : 'btnEdit',
//    		    text : '调整画布',
//    			disabled:false,
//    		    handler : function(){
//    		    	openChangeCanvasSize();
//    		    }		  
//    		  }]
//	});
    /**
     * 调整流程位置按钮
     */
    var isShowMoveBpmn = true;
//    $("#toolbar").dtoolbar({
//		items:[
//         {
//    			id:'tb_moveBpmn',
//    		    ico : 'btnQuery',
//    		    text : '流程整体迁移',
//    			disabled:false,
//    		    handler : function(){
//    		    		if(isShowMoveBpmn){
//    		    			$("#moveBpmn").show();
//    		    			isShowMoveBpmn = false;
//    		    		}else{
//    		    			$("#moveBpmn").hide();
//    		    			isShowMoveBpmn = true;
//    		    		}
//    		    }		  
//    		  }, {
//	    			id:'tb_importBpmnXml',
//	    		    ico : 'btnClose2',
//	    		    text : '导出标准xml',
//	    			disabled:false,
//	    		    handler : function(){
//	    		    	exportBpmnXml();
//	    		    }		  
//	    		  }, {
//		    			id:'tb_importBpmnPic',
//		    		    ico : 'btnprint',
//		    		    text : '导出图片',
//		    			disabled:false,
//		    		    handler : function(){
//		    		    	processPic();
//		    		    }		  
//		    		  }, {
//			    			id:'tb_importTemplate',
//			    		    ico : 'btndowncatgory',
//			    		    text : '导入模板',
//			    			disabled:false,
//			    		    handler : function(){
//			    		    	openImportTemplate();
//			    		    }		  
//			    		  },{
//				    			id:'tb_copy',
//				    		    ico : 'btnChecked',
//				    		    text : '格式刷',
//				    			disabled:false,
//				    		    handler : function(){
//				    		    	copyProperty();
//				    		    }		  
//				    		  }]
//	});
	
	/***********     创建工具条 end     ****/	    
    var active_btn = null;//定义面板(palette)当前激活按钮，为jquery对象，用途：解决当前只有一个激活按钮；支持点击即可画图的功能。
	/*************设置工具箱的行为   start   ********************/
    //$("#divTool").accordion();
//	 $("#divTool")
//		.on('click','.flatbtn',function(event){
//				if(typeof(event.target.id)=="undefined"||event.target.id=="") return;
//				
//				if(active_btn!=null){
//					active_btn.css('background-color','#b4dcff');
//					active_btn.attr('active','false');
//				}
//				var _jqBtn = _getJQueryObj(event.target.id);
//				_jqBtn.css('background-color','lightblue');
//				_jqBtn.attr('active','true');
//				active_btn = _jqBtn;
//				event.stopPropagation();
//			})
//		.on('mouseover','.flatbtn',function(event){
//					if(typeof(event.target.id)=="undefined"||event.target.id=="") return;
//					if(_getJQueryObj(event.target.id).attr('active')=='true')  return;
//					try{_getJQueryObj(event.target.id).css('background-color','#efeded');}catch(e){}
//			})
//		.on('mouseout','.flatbtn',function(event){
//					if(typeof(event.target.id)=="undefined"||event.target.id=="") return;
//					if(_getJQueryObj(event.target.id).attr('active')=='true')  return;
//					try{_getJQueryObj(event.target.id).css('background-color','#b4dcff');}catch(e){}
//		    });/*************设置工具箱的行为   end   ********************/

	/******** 创建流程对象 start  *************/
	_myflow=$.createGooFlow($("#myflow"),{
		//width:1000,//定义面板的宽度，为数值型，不能带“px”或是“pt”，如果未定义，则系统取当前文档document的宽度
		//height:480,
		
		haveTool:true,//是否有工具箱，如果有，定义工具箱按钮信息
		
		haveToolbar:true,//是否有工具条，如果有，定义工具条按钮信息
		toolbar:'toolbar',
		
		haveGroup:true,//是否支持区块功能，如果有，则系统创建一个区块操作按钮，负责区块的创建和移动等操作wanhm2014/1/28
		useOperStack:true//是否提供堆栈记录操作的功能
	});	
	/**
	 * 初始化工作区画布大小
	 */
	if(id != "null"){
		$("#GooFlow_work_inner").css({"width":canvasWidth+"px","height":canvasHeight+"px"});
	}else{
		canvasWidth = _myflow.$workArea.width();
		canvasHeight = _myflow.$workArea.height();
	}
	
	_myflow.onItemDel=function(id,type){
		$(_myflow.$workArea).trigger("click");
		return true;
	};
	
	
	
	//设置属性窗口的位置
	$(".property").css("left",(_myflow.$bgDiv.width()-$(".property").width()-18)+"px").css("z-index","11");
	//渲染属性窗口
//	$("#divProperty").draggable();
	
	var definationProperty=DefinationProperty.newObject({targetDomObj:$("#divProperty")});
	var focusNodeBpmnBigDataBusinessPrivilege="";
	/**
	 * 注册选中事件：选中某个单元时，修改属性表单内容。
	 */
	_myflow.onItemFocus=function(id,type){
		var _json = null;
		//节点的点击事件 	
    	if(type=="node"){
		  _json = _myflow.$nodeData[id];
		  if(focusNodeBpmnBigDataBusinessPrivilege!=""){
			  _json.listener=focusNodeBpmnBigDataBusinessPrivilege;
			  focusNodeBpmnBigDataBusinessPrivilege="";
  		}
    	}else if(type=="line"){
		  _json = _myflow.$lineData[id];
		  if(_json.name == ""){
			  _json.name = id;  
		  }
    	}
    	//显示属性定义面板
    	definationProperty.showPropertyInfo(_json,id,type);
    	$.parser.parse();
    	$("#btnSelect").trigger("click");
    	return true;
	};
	
	_myflow.onItemAdd=function(id,type,json){
		if(json.type=="Subprocess"){
			json.zIndex="1";
			json.opacity=0.4;
		}
		if(id.indexOf("startevent") == 0 || id.indexOf("endevent") == 0){
			$.each(json,function(name,value){
				if(name == "zIndex"){
					delete json.zIndex;
				}
			});
		}
		return true;
	};
	
	_myflow.afterItemAdd=function(id,type,json){
		if(json.type=="Subprocess"){
			_myflow.$nodeDom[id].droppable({
				onDrop: function( event, ui ) {
					var droppableDom=$(event.target);
					var draggableDom=$(ui).closest("div");
					var droppableData=_myflow.$nodeData[droppableDom.attr("id")];
					if(!droppableData.childNodes){
						droppableData.childNodes=[];
					}
					var isNotContain=true;
					$(droppableData.childNodes).each(function(index,id){
						if(id==draggableDom.attr("id")){
							isNotContain=false;
							return false;
						}
					});
					if(isNotContain){
						droppableData.childNodes.push(draggableDom.attr("id"));
					}
				},
				onDragLeave: function( event, ui ) {
					var droppableDom=$(event.target);
					var draggableDom=$(ui).closest("div");
					var droppableData=_myflow.$nodeData[droppableDom.attr("id")];
					$(droppableData.childNodes).each(function(index,id){
						if(id==draggableDom.attr("id")){
							droppableData.childNodes.splice(index,1);
							return false;
						}
					});
					
				}
				
			});
		}else{
			var icoDom=_myflow.$nodeDom[id];
			if(icoDom){
				icoDom.draggable({
					handle:'.ico'
				});
				icoDom.on("mouseenter",function(event){
					if(_myflow.$nowType=="SequenceFlow"){
						$(icoDom).draggable('disable');
					}
				});
				icoDom.on("mouseleave",{id:id},function(event){
					if(_myflow.$nowType=="SequenceFlow"){
						$(icoDom).draggable('enable');
					}
				});
				icoDom.on("mousedown",{id:id},function(event){
					if(_myflow.$nowType=="SequenceFlow"){
						$(icoDom).draggable('enable');
					}
				});
			}
		}
	};
	
	_myflow.onItemMove=function(id,type,left,top){
//		definationProperty.changePropertyInfo({
//			left:left,
//			top:top
//		});
		var droppableData=_myflow.$nodeData[id];
		if(droppableData&&droppableData.type=="Subprocess"){
			var leftMove=left-droppableData.left;
			var topMove=top-droppableData.top;
			var childLeft;
			var childTop;
			$(droppableData.childNodes).each(function(index,childId){
				childLeft=_myflow.$nodeData[childId].left+leftMove;
				childTop=_myflow.$nodeData[childId].top+topMove;
				_myflow.moveNode(childId,childLeft,childTop);
			});
		}
		return true;
	};
	
	_myflow.onItemResize=function(id,type,width,height){
		var droppableData=_myflow.$nodeData[id];
		if(droppableData&&droppableData.type=="Subprocess"){
			var maxLeft=droppableData.left+width;
			var maxTop=droppableData.top+height;
			
			var childLeft;
			var childTop;
			var canResize=true;
			$(droppableData.childNodes).each(function(index,childId){
				childLeft=_myflow.$nodeData[childId].left+_myflow.$nodeData[childId].width;
				childTop=_myflow.$nodeData[childId].top+_myflow.$nodeData[childId].height;
				if(childLeft>maxLeft||childTop>maxTop){
					canResize=false;
					return false;
				}
			});
			if(!canResize){
				return false;
			}
		}
		
		definationProperty.changePropertyInfo({
			width:width,
			height:height
		});
		return true;
	};
	
	
	_myflow.loadData(jsondata);
	
	/**
	 * 注册工作空间单击事件
	 */
	$(_myflow.$workArea).on("click",function(event){
		if (_myflow.$nowType!="cursor") return ;
		var eTarget=$(event.target);
		var tagName=eTarget.prop("tagName");
		if(tagName=="svg"||(tagName=="DIV"&&eTarget.prop("class").indexOf("GooFlow_work")>-1)){
			var _json={
				name:_myflow.$title,
				type:"Diagram"	
			};
			$.each(_myflow.$diagramData,function(groupId,groupData){
				_json[groupId]=groupData;
			});
//			definationProperty.showPropertyInfo(_json,_myflow.$flowId,"diagram");
			$("#divContent").css("display","none");
		}
	});
	
	/**
	 * toolbox单击样式
	 */
	$(".navIn li div img").bind("click",function(){
		$(".navIn li div").eq($(this).parent().parent().index()).trigger("click");
	});
	$(".navIn li div").not("img").bind("click",function(){
		$(".navIn li div").attr("style","");
		$(".navIn li div").eq($(this).parent().index()).attr("style","display:inline-block;padding:0 10px;border-radius:5px;text-decoration:none;background:#e2e2e2;cursor:pointer;");
	});
	/**
	 * span单击样式
	 */
	$("#dep div:first span.bpmnDesignerbtnIn").live("click",function(){
		$("#dep div:first span.bpmnDesignerbtnInEd").attr("class","bpmnDesignerbtnIn");
		$("#dep div:first span.bpmnDesignerbtnIn").eq($(this).index()).attr("class","bpmnDesignerbtnInEd");
	});
	
	/**
	 * 调整工作区画布大小弹出层效果
	 */
	$(function() {
		$("#changeCanvasSize").dialog({
			height : 320,
			width : 600,
			modal : true,
			resizable : false,
			closed: true
		});
		$("#closeChangeCanvas").click(function() {
			$("#changeCanvasSize").dialog("close");
		});
		
	});
	
	//确认更改工作区画布大小功能
	$("#validateWidthAndHeight").click(function(){
		if(!isNaN(parseInt($('#canvasWidth').val()))){
			var temp = parseInt($('#canvasWidth').val());
			if(temp<1582 || temp>5000){
				alert("注意！宽度值的范围:1582~5000");
				return;
			}
		}else{
			alert("宽度值为非法值！");
			return;
		}
		if(!isNaN(parseInt($('#canvasHeight').val()))){
			var temp = parseInt($('#canvasHeight').val());
			if(temp<860 || temp>3000){
				alert("注意！高度值的范围:860~3000");
				return;
			}
		}else{
			alert("高度值为非法值！");
			return;
		}
		var maxWidth = 0;
		var maxHeight = 0;
		var initCanvasWidth = 1582;
		var initCanvasHeight = 860;
		var changeCanvasWidth = parseInt($.trim($("#canvasWidth").val()));
		var changeCanvasHeight = parseInt($.trim($("#canvasHeight").val()));
		var flowData = JSON.parse(JSON.stringify(_myflow.exportData()));
		$.each( flowData.nodes, function(i, n){
			if((n.left + n.width) > maxWidth){
				maxWidth = n.left + n.width;
			}
			if((n.top + n.height) > maxHeight){
				maxHeight = n.top + n.height;
			}
		});
		if(changeCanvasWidth > initCanvasWidth){
			canvasWidth = changeCanvasWidth;
		}else{
			canvasWidth = initCanvasWidth;
		}
		if(changeCanvasHeight > initCanvasHeight){
			canvasHeight = changeCanvasHeight;
		}else{
			canvasHeight = initCanvasHeight;
		}
		if(canvasWidth < maxWidth || canvasHeight < maxHeight){
			alert("工作区画布大小不能包括所有节点信息！");
			canvasWidth = _myflow.$workArea.width();
			canvasHeight = _myflow.$workArea.height();
		}
		$("#GooFlow_work_inner").css({"width":canvasWidth+"px","height":canvasHeight+"px"});
		$("#changeCanvasSize").dialog("close");
	});
	
	var currentSliderLRValue = null;  //左右slider变动之前的值
	var currentSliderUDValue = null;  //上下slider变动之前的值
	
	/**
	 * 整体调整流程模板左右的位置
	 */
	$("#slider-range-min-leftAndRight" ).slider({
//		range: "min",
		value: (canvasWidth)/2,
		min: 1,
		max: canvasWidth ,
		onSlideStart: function(value) {
			currentSliderLRValue = value;
		},
		onChange: function(newValue,oldValue) {
			var processContentBytes = JSON.stringify(_myflow.exportData());
			var processContentBytesObj = JSON.parse(processContentBytes);
			var nodeList = processContentBytesObj.nodes;
			var lineList = processContentBytesObj.lines;
			var maxLeft = 0;        
			var minLeft = 1000000;
			$.each(nodeList,function(i,node){
				if(maxLeft < node.left){
					maxLeft = node.left;
				}
				if(node.left < minLeft){
					minLeft = node.left;
				}
			});
			
			$.each(lineList,function(j,line){
				if(line.type == "lr"){
					if(maxLeft < line.M){
						maxLeft = line.M;
					}
					if(line.M < minLeft){
						minLeft = line.M;
					}
				}
			});
			$.each(nodeList,function(i,node){
				if(currentSliderLRValue > newValue){
					if((minLeft - (currentSliderLRValue - newValue)) > 1){
						_myflow.moveNode(i,node.left - (currentSliderLRValue - newValue),node.top);
					}else{
						$("#slider-range-min-leftAndRight" ).slider( 'setValue' , newValue ) ;
						return false;
					}
				}else{
					if((maxLeft + (newValue - currentSliderLRValue)) < (canvasWidth - 1)){
						_myflow.moveNode(i,node.left + (newValue - currentSliderLRValue),node.top);
					}else{
						$("#slider-range-min-leftAndRight" ).slider( 'setValue' , newValue ) ;
						return false;
					}
				}
			});
			$.each(lineList,function(j,line){
				if(currentSliderLRValue > newValue){
					if(line.type == "lr"){
						if((minLeft - (currentSliderLRValue - newValue)) > 1){
							_myflow.setLineM(j,line.M - (currentSliderLRValue - newValue));
						}else{
							$("#slider-range-min-leftAndRight" ).slider( 'setValue' , newValue ) ;
							return false;
						}
					}
				}else{
					if(line.type == "lr"){
						if((maxLeft + (newValue - currentSliderLRValue)) < (canvasWidth - 1)){
							_myflow.setLineM(j,line.M + (newValue - currentSliderLRValue));
						}else{
							$("#slider-range-min-leftAndRight" ).slider( 'setValue' , newValue ) ;
							return false;
						}
					}
				}
			});
		}
	});
	
	/**
	 * 整体调整流程模板上下的位置
	 */
	$("#slider-range-min-upAndDown" ).slider({
//		orientation: "vertical",  //竖直slider的属性
//		range: "min",
		value: (canvasHeight + 50)/2,
		min: 1,
		max: canvasHeight + 50,
		onSlideStart: function(value) { 
			currentSliderUDValue = value;
		},
		onChange: function(newValue,oldValue) {
			var processContentBytes = JSON.stringify(_myflow.exportData());
			var processContentBytesObj = JSON.parse(processContentBytes);
			var nodeList = processContentBytesObj.nodes;
			var lineList = processContentBytesObj.lines;
			var maxTop = 0;
			var minTop = 1000000;
			$.each(nodeList,function(i,node){
				if(maxTop < node.top){
					maxTop = node.top;
				}
				if(node.top < minTop){
					minTop = node.top;
				}
			});
			$.each(lineList,function(j,line){
				if(line.type == "tb"){
					if(maxTop < line.M){
						maxTop = line.M;
					}
					if(line.M < minTop){
						minTop = line.M;
					}
				}
			});
			$.each(nodeList,function(i,node){
				if(currentSliderUDValue > newValue){
					if((minTop - (currentSliderUDValue - newValue)) > 1){
						_myflow.moveNode(i,node.left,node.top - (currentSliderUDValue - newValue));
					}else{
						$("#slider-range-min-upAndDown" ).slider( 'setValue' , currentSliderUDValue ) ;
						return false;
					}
				}else{
					if((maxTop + (newValue - currentSliderUDValue)) < (canvasHeight - 1)){
						_myflow.moveNode(i,node.left,node.top + (newValue - currentSliderUDValue));
					}else{
						$("#slider-range-min-upAndDown" ).slider( 'setValue' , currentSliderUDValue ) ;
						return false;
					}
				}
			});
			$.each(lineList,function(j,line){
				if(currentSliderUDValue > newValue){
					if(line.type == "tb"){
						if((minTop - (currentSliderUDValue - newValue)) > 1){
							_myflow.setLineM(j,line.M - (currentSliderUDValue - newValue));
						}else{
							$("#slider-range-min-upAndDown" ).slider( 'setValue' , currentSliderUDValue ) ;
							return false;
						}
					}
				}else{
					if(line.type == "tb"){
						if((maxTop + (newValue - currentSliderUDValue)) < (canvasHeight - 1)){
							_myflow.setLineM(j,line.M + (newValue - currentSliderUDValue));
						}else{
							$("#slider-range-min-upAndDown" ).slider( 'setValue' , currentSliderUDValue ) ;
							return false;
						}
					}
				}
			});
		}
	});
	
	
	
	$(function() {
		$("#importTemplate").dialog({
			height : 280,
			width : 500,
			modal : true,
			resizable : false,
			closed: true
		});
		$("#attentionLayer").dialog({
			height : 280,
			width : 500,
			modal : true,
			resizable : false,
			closed: true
		});
		$("#closeImp").click(function() {
			$("#importTemplate").dialog("close");
		});
		$("#submitImportForm").click(function() {
			submitImportForm();
		});
		
	});
	//将可退回可撤销的节点用不同颜色回显
	var taskNodes=jsondata.nodes;
	if(taskNodes != null){
		$.each(taskNodes,function(taskId,taskObject){
			if(taskObject.extendConfig != null){
				if(taskObject.extendConfig.toBeReturned == "true" && taskObject.extendConfig.toBeRevoked == ""){
					if(taskObject.extendConfig.toBeFreedomNode == "true" ){
						//有退回和是否自由流时
						$("#"+taskId+".GooFlow_item").css("background", "#2DB291");
						$("#"+taskId+".GooFlow_item").css("border", "#ffc90e 4px solid");
					}else{
						//只有退回
						$("#"+taskId+".GooFlow_item").css("background", "#2DB291");
					}
				}else if(taskObject.extendConfig.toBeRevoked == "true" && taskObject.extendConfig.toBeReturned == ""){
					if(taskObject.extendConfig.toBeFreedomNode == "true" ){
						//有撤销和是否自由流时
						$("#"+taskId+".GooFlow_item").css("background", "#86B22D");
						$("#"+taskId+".GooFlow_item").css("border", "#ffc90e 4px solid");
					}else{
						//只有撤销
						$("#"+taskId+".GooFlow_item").css("background", "#86B22D");
					}
				}else if(taskObject.extendConfig.toBeRevoked == "true" && taskObject.extendConfig.toBeReturned == "true"){
					if(taskObject.extendConfig.toBeFreedomNode == "true" ){
						//有退回和撤销和是否自由流时
						$("#"+taskId+".GooFlow_item").css("border", "#ffc90e 4px solid");
						$("#"+taskId+".GooFlow_item").css("background", "#2D9CB2");
					}else{
						//只有退回和撤销时
						$("#"+taskId+".GooFlow_item").css("background", "#2D9CB2");
					}
				}else if(taskObject.extendConfig.toBeRevoked == "" && taskObject.extendConfig.toBeReturned == "" && taskObject.extendConfig.toBeFreedomNode == "true"){
					//只有是否自由流时
					$("#"+taskId+".GooFlow_item").css("border", "#ffc90e 4px solid");
				}
			}
		});
	}

	
	//导入标准xml
	function submitImportForm() {
		var val=$('input:radio[name="importType"]:checked').val();
		if($.trim($("#contentXML").val())==""){
			alert('请选择导入模板');
			return;
		}
		var url = "";
		if(val=='1'){
			url = basePath+"bpmnAction/templateDef/importTemplateXml.do?tokenid="+tokenID;
		}else if(val=='0'){
			url = basePath+"bpmnAction/templateDef/importTemplate.do?tokenid="+tokenID;
		}else{
			alert('请选择导入类型');
			return;
		}
		//把流程定义id提取出来,传进去
		//start
		 var src = $('#form1').context.URL;
		 var locationStart = src.indexOf("id");
		 var newString = "";
		 var idString = "";
		 if(locationStart >= 0){
			 var newString = src.substring(locationStart, src.length);
			 var  startLocation;
			 var  endLocation;
			 for(var i = 0;i < newString.length;i++){
				 var char = newString[i];
				 if(char == "="){
					 startLocation = i+1;
				 }
				 if(char == "&"){
					 endLocation = i;
					 break;
				 }
			 }
			 idString = newString.substring(startLocation,endLocation);
		 }
		 //end
		var v = $.trim($("#realValueImp").val());
		$('#form1').ajaxSubmit({
			type : 'POST',
			dataType : 'json',
			data : { categoryValue : v,
				                id : idString
				},
			url : url,
			success: function (responseText, statusText, xhr, $form)
	        {	
				if(responseText.success){
					if(idString != ""){
						alert("请确认要把导入的模版覆盖原来的模版吗？原来的模版会删除，保留新的模版");
	        			// 将字符串转换成json
	 					var temdata = responseText.result;
	 					var canvasWidth = parseInt(temdata.canvasWidth);
	 					var canvasHeight = parseInt(temdata.canvasHeight);
	 					var jsondata = JSON.parse(temdata.contentBytesStr);
	 					jsondata.diagram.bpmn.version = temdata.version.toString();
	 					jsondata.diagram.bpmn.versionState = temdata.versionState.toString();
	 					jsondata.diagram.bpmn.deployState = temdata.deployState.toString();
	 					jsondata.id = temdata.id;
	 					_myflow.loadData(jsondata);
	 					$("#importTemplate").dialog("close");
					}else{
						 alert(responseText.message);
		        		 var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?id="+responseText.result;
		        		 if(tokenID){
		        			 src=src+"&tokenid="+tokenID;
		        		 }
		        		 window.location.replace(src);
		        		 window.opener.location.reload();
					}
	        	 }else{
	        		 alert(responseText.message);
	        		 $("#importTemplate").dialog("close");
	        	 }
	        },
		});
		return true;
	}
});
//打开画布调整弹出层
function openImportTemplate(){
	$("#importTemplate").dialog("open");
	$("#importTemplate").find("div").css("display","block");
}
//打开注意事项弹出层
function openAttention(){
	$("#attentionLayer").dialog("open");
	$("#attentionLayer").find("div").css("display","block")
}
//复制
function copyProperty(){
//	$("#bt_tb_copy").toggleClass("click");
//    $("#bt_tb_copy").addClass("click");
	focusNodeBpmnBigDataBusinessPrivilege=_myflow.$nodeData[_myflow.$focus].listener;
	//alert();
}
//保存模版流程定义
function doSave() {
	debugger;
	var contentBytes = JSON.stringify(_myflow.exportData());
    var contentBytesTemp = JSON.parse(contentBytes);
	if(typeof (contentBytesTemp)=="string"){
		contentBytes = contentBytesTemp;
	}
	//保存的时候对会签节点校验，如果会签节点配置不完整则弹出提示start
	var nodeList = contentBytesTemp.nodes;
	var flag = false; 
	var haveVountersign = false;
	$.each(nodeList,function(i,node){
		if(i.indexOf("countersign") == 0){
			if(node.general.completeConditionType == "oneVoteVeto"){
				if(node.extendConfig.positiveSequence == ""){
					alert("保存失败！,会签节点"+ i + "的正向连接线没有配置！");
				}else if(node.extendConfig.negativeSequence == ""){
					alert("保存失败！,会签节点"+ i + "的负向连接线没有配置！");
				}else{
					flag = true;
				}
			}else{
				if(node.general.completeConditionType == ""){
					alert("保存失败！,会签节点"+ i + "的结束条件没有配置！");
				}else if(node.general.approveCondition == ""){
					alert("保存失败！,会签节点"+ i + "的通过百分比没有配置！");
				}else if(node.general.completeCondition == ""){
					alert("保存失败！,会签节点"+ i + "的结束条件值没有配置！");
				}else if(node.extendConfig.positiveSequence == ""){
					alert("保存失败！,会签节点"+ i + "的正向连接线没有配置！");
				}else if(node.extendConfig.negativeSequence == ""){
					alert("保存失败！,会签节点"+ i + "的负向连接线没有配置！");
				}else{
					flag = true;
				}
			}
			haveVountersign = true;
		}
	});
	if(haveVountersign && flag){
		$.ajax({  
	         url:basePath+"bpmnAction/templateDef/saveTemplateDef.do?tokenid="+tokenID, 
	         data:"id="+_myflow.$flowId+ "&contentBytes=" + contentBytes + "&canvasWidth=" + canvasWidth + "&canvasHeight=" + canvasHeight,
	         type:"post",  
	         dataType:"json",  
	         success:function(pr) { 
	        	 if(pr.success){
	        		 alert(pr.message);
	        		 var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?id="+pr.result;
	        		 if(tokenID){
	        			 src+="&tokenid="+tokenID;
	        		 }
	        		 window.location.replace(src);
	        		 if(window.opener.refreshDatagrid){
	        			 window.opener.refreshDatagrid(); 
	        		 }
	        		 else{
	        			 window.opener.window.zTreeOnClick();
	        		 }
	                
	        	 }else{
	        		 alert(pr.message);
	        	 }
	         }   
	     }); 
	}else if(!haveVountersign && !flag){
		$.ajax({  
	         url:basePath+"bpmnAction/templateDef/saveTemplateDef.do?tokenid="+tokenID, 
	         data:"id="+_myflow.$flowId+ "&contentBytes=" + contentBytes + "&canvasWidth=" + canvasWidth + "&canvasHeight=" + canvasHeight,
	         type:"post",  
	         dataType:"json",  
	         success:function(pr) { 
	        	 if(pr.success){
	        		 alert(pr.message);
	        		 var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?id="+pr.result;
	        		 if(tokenID){
	        			 src+="&tokenid="+tokenID;
	        		 }
	        		 window.location.replace(src);
	        		 if(window.opener.refreshDatagrid){
	        			 window.opener.refreshDatagrid(); 
	        		 }
	        		 else{
	        			 window.opener.window.zTreeOnClick();
	        		 }
	                
	        	 }else{
	        		 alert(pr.message);
	        	 }
	         }   
	     });
	}
	//保存的时候对会签节点校验，如果会签节点配置不完整则弹出提示end
}
//流程属性
function flowPro() {	
	var definationProperty=DefinationProperty.newObject({targetDomObj:$("#divProperty")});
	var eTarget=$(event.srcElement);
	var tagName=eTarget.prop("tagName");
	if(tagName=="svg"||(tagName=="DIV"&&eTarget.prop("class").indexOf("GooFlow_work")>-1)||(tagName=="SPAN")){
		var _json={
			name:_myflow.$title,
			type:"Diagram"	
		};
		$.each(_myflow.$diagramData,function(groupId,groupData){
			_json[groupId]=groupData;
		});
		definationProperty.showPropertyInfo(_json,_myflow.$flowId,"diagram");
	}
}
//redistributeTemplateDef
// 重新部署
function doRedistribute() {		
	var contentBytes = JSON.stringify(_myflow.exportData());
    var contentBytesTemp = JSON.parse(contentBytes);
	if(typeof (contentBytesTemp)=="string"){
		contentBytes = contentBytesTemp;
	}
	$.ajax({  
         url:basePath+"bpmnAction/templateDef/saveTemplateDef.do?tokenid="+tokenID, 
         data:"id="+_myflow.$flowId+ "&contentBytes=" + contentBytes+"&deployState=2" + "&canvasWidth=" + canvasWidth + "&canvasHeight=" + canvasHeight,
         type:"post",  
         dataType:"json",  
         success:function(pr) { 
        	 if(pr.success){
        		 alert(pr.message);
        		 var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?id="+pr.result+"&deployState=0";
        		 if(tokenID){
        			 src+="&tokenid="+tokenID;
        		 }
        		 window.location.replace(src);
        		 //window.opener.location.reload();
        		 window.opener.window.zTreeOnClick();
        	 }else{
        		 alert(pr.message);
        	 }
         }   
     });   
}
// 另存
function doSaveAs() {		
	var contentBytes = JSON.stringify(_myflow.exportData());
    var contentBytesTemp = JSON.parse(contentBytes);
	if(typeof (contentBytesTemp)=="string"){
		contentBytes = contentBytesTemp;
	}
	$.ajax({  
         url:basePath+"bpmnAction/templateDef/saveTemplateDef.do?tokenid="+tokenID, 
         data:"id="+_myflow.$flowId+ "&contentBytes=" + contentBytes+"&deployState=1" + "&canvasWidth=" + canvasWidth + "&canvasHeight=" + canvasHeight,
         type:"post",  
         dataType:"json",  
         success:function(pr) { 
        	 if(pr.success){
        		 alert(pr.message);
        		 var src=basePath+"hqbpmn/template/diagram/definationDiagram.jsp?id="+_myflow.$flowId+"&deployState=0";
        		 if(tokenID){
        			 src+="&tokenid="+tokenID;
        		 }
        		 window.location.replace(src);
        		 window.opener.location.reload();
        	 }else{
        		 alert(pr.message);
        	 }
         }   
     });   
}
//导出BPMN2.0XML
function exportBpmnXml() {
	 if (id == 'null') {
		alert('请先保存流程后再导出xml！');
		return;
	 }
	 var contentBytes = JSON.stringify(_myflow.exportData());
	 var contentBytesTemp = JSON.parse(contentBytes);
		if(typeof (contentBytesTemp)=="string"){
			contentBytes = contentBytesTemp;
		}
	 $("#exportBpmnXml").attr("method","POST"); 
	 $("#exportBpmnXml").attr("action", basePath+"bpmnAction/templateDef/exportBpmnXml.do?tokenid="+tokenID+"&id="+_myflow.$flowId);
	 $("#contentBytesXml").val(contentBytes);
	 $("#exportBpmnXml").submit();
}
//导出图片
function processPic() {
	if (id == 'null') {
		alert('请先保存流程后再导出图片！');
		return;
	}
	var contentBytes = JSON.stringify(_myflow.exportData());
	var contentBytesTemp = JSON.parse(contentBytes);
	if(typeof (contentBytesTemp)=="string"){
		contentBytes = contentBytesTemp;
	}
	$("#contentBytesXml").val(contentBytes);
	$("#exportBpmnXml").attr("method","POST"); 
	$("#exportBpmnXml").attr("target", "_blank");
	$("#exportBpmnXml").attr("action", basePath+"bpmnAction/templateDef/processPic.do?tokenid="+tokenID+"&id="+_myflow.$flowId);
	$("#exportBpmnXml").submit();
}
//打开画布调整弹出层
function openChangeCanvasSize(){
	$("#changeCanvasSize").dialog("open");
	$("#changeCanvasSize").find("div").css("display","block");
	//回显调整画布大小宽度与高度的值
	$("#canvasWidth").val(canvasWidth);
	$("#canvasHeight").val(canvasHeight);
}
//整体移动流程
var isShowMoveBpmn = true;
function showMoveBpmn(){
	if(isShowMoveBpmn){
		$("#moveBpmn").show();
		isShowMoveBpmn = false;
	}else{
		$("#moveBpmn").hide();
		isShowMoveBpmn = true;
	}
}
