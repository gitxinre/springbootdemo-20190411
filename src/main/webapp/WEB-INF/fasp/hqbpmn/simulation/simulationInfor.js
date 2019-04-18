$(function(){
	initPage(false);
	
	/**
	 * 初始化页面
	 * isReload为true，代表重新加载页面，false代表新加载页面
	 */
	function initPage(isReload){
		initProcessBtns();
		initBpmnInfo(isReload);
		initVariable();
		initPrivilege();
		initExtend(isReload);
	}
	
	/**
	 * 初始化流程按钮，包括启动按钮,连接线按钮，业务定制按钮，自由跳转按钮
	 */
	function initProcessBtns(){
		$.ajax({
			url:basePath+"bpmnAction/processinstance/getProcess.do",
			type:"POST",
			data:{
				userId:userName,
				ticketId:ticketId,
				bpmnType:bpmnType
			},
			dataType:"json",
			success:function(pr, textStatus){
				initButtonGroupHandler(pr.result);
			}
		});
		function initButtonGroupHandler(bpmnProcesses){
			var button;
			var processParam;
			var startBtnDomObj=$("#startBtn");
			var sequenceBtnDomObj=$("#sequenceBtn");
			var businessCustomBtnDomObj=$("#businessCustomBtn");
			var extendBpmnBtnDomObj=$("#extendBpmnBtn");
			startBtnDomObj.empty();
			sequenceBtnDomObj.empty();
			businessCustomBtnDomObj.empty();
			extendBpmnBtnDomObj.empty();
			$(bpmnProcesses).each(function(index,bpmnProcess){
				processParam=JSON.stringify(bpmnProcess);
				button=$("<span>",{
					"class":"metroBtn",
					text:bpmnProcess.name,
					bpmnProcess:processParam
				}).click(runBpmnProcess);
				if(bpmnProcess.type==1){// 创建新的流程实例
					button.appendTo(startBtnDomObj);
				}else if(bpmnProcess.type==2||bpmnProcess.type==4){//流程流转或创建引用流程
					button.appendTo(sequenceBtnDomObj);
					if(bpmnProcess.type==4){
						$("<label>",{
							text:"引用流程工单号:"
						}).appendTo(sequenceBtnDomObj);
						UIUtil.getInput({}).css({"margin-right":"8px"}).attr("variable_name","bpmnSubTicketId").appendTo(sequenceBtnDomObj);
					}
				}else if(bpmnProcess.type==5){//自定义按钮
					button.appendTo(businessCustomBtnDomObj);
				}else{//扩展按钮
					button.appendTo(extendBpmnBtnDomObj);
				}
			});
		};
		//转办
		function showBpmnInsideBtn(bpmnProcess,type){
			if(type=="hqbpmn_toBeReturned"){
				$.ajax({
					url:basePath+"bpmnAction/processinstance/getBackNodes.do",
					type:"POST",
					async:false,
					data:{
						bpmnProcess:bpmnProcess,
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						taskId:$("#simTaskId").val()
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							var preAction={};
							preAction.candidateUsers=true;
							var data = eval(pr.result);
							var nodes="";
							if (data.length > 0) {
							  for (var i = 0; i < data.length; i++){
								  if(i!=0){
									  nodes+=",";
								  }
								  nodes+=data[i].key;
							  }
						    }
							preAction.candidateUser=nodes;
							var dialogDivDom=null;
							dialogDivDom=$("#dialogDiv").dialog({
								title : '退回节点',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
							SimulationLookUp.showBpmnInsideBtn({
								dialogDivDom:dialogDivDom,
								preAction:preAction,
								variable:"",
								btnType:JSON.parse(bpmnProcess).id
							});
							var divs=dialogDivDom.children();
							if($(divs[0]).attr("class")=="panel"){
								$(divs[0]).remove();
							}
						}
					}
				});
				return ;
			}
			if(type=="hqbpmn_partReturn"){
				$.ajax({
					url:basePath+"bpmnAction/processinstance/getBackNodes.do",
					type:"POST",
					async:false,
					data:{
						bpmnProcess:bpmnProcess,
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						taskId:$("#simTaskId").val()
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							var preAction={};
							preAction.candidateUsers=true;
							var data = eval(pr.result);
							var nodes="";
							if (data.length > 0) {
								for (var i = 0; i < data.length; i++){
									if(i!=0){
										nodes+=",";
									}
									nodes+=data[i].key;
								}
							}
							preAction.candidateUser=nodes;
							var dialogDivDom=null;
							dialogDivDom=$("#dialogDiv").dialog({
								title : '退回节点',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate,newTicketId){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId,newTicketId);
							});
							SimulationLookUp.showBpmnInsideBtn({
								dialogDivDom:dialogDivDom,
								preAction:preAction,
								variable:"",
								btnType:JSON.parse(bpmnProcess).id
							});
							var divs=dialogDivDom.children();
							if($(divs[0]).attr("class")=="panel"){
								$(divs[0]).remove();
							}
						}
					}
				});
				return ;
			}
			if(type=="hqbpmn_innerCountersign_info"){
				$.ajax({
					url:basePath+"bpmnAction/processinstance/getCountersignInfo.do",
					type:"POST",
					async:false,
					data:{
						bpmnProcess:bpmnProcess,
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						taskId:$("#simTaskId").val()
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							var data = eval(pr.result);
							if (data.length > 0) {
								for (var i = 0; i < data.length; i++){
									//nodes+=data[i].key;
								}
							}
							
						}
					}
				});
				return ;
			}
			if(type=="hqbpmn_handleEnd"){
				var result = "流程办结！";
				$.ajax({
					url:basePath+"bpmnAction/processinstance/handleEnd.do",
					type:"POST",
					async:false,
					data:{
						userId:userName,
						ticketId:ticketId,
						bpmnType:bpmnType,
						bpmnProcess:bpmnProcess
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							alert(result);
							reloadPage();
						}
					}
				});
				return ;
			}
			if(type=="hqbpmn_toBeDelete"){
				var result = "删除流程！";
				$.ajax({
					url:basePath+"bpmnAction/processinstance/deleteProcess.do",
					type:"POST",
					async:false,
					data:{
						userId:userName,
						bpmnProcess:bpmnProcess
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							alert(result);
							reloadPage();
						}
					}
				});
				return ;
			}
			if(type=="hqbpmn_processTrack"){
					$.ajax({
						url:basePath+"bpmnAction/processinstance/getPath.do",
						type:"POST",
						data:{
							bpmnType:bpmnType,
							ticketId:ticketId
						},
						dataType:"json",
						success:function(pr, textStatus){
							if(pr.success){
								var dialogDivDom=$("#dialogDiv").dialog({
									title : '流程流转记录',
									width : 1000,
									height : 600
								}).css("overflow","auto");
								SimulationLookUp.showBpmnPath({
									dialogDivDom:dialogDivDom,
									bpmnPaths:pr.result
								});
								var divs=dialogDivDom.children();
								if($(divs[0]).attr("class")=="panel"){
									$(divs[0]).remove();
								}
							}
						}
					});
				return ;
			}
			if(type=="over_innerCountersign"){
				var result = "内部会签结束！";
				var variable=getVariable();
				$.ajax({
					url:basePath+"bpmnAction/processinstance/setProcess.do",
					type:"POST",
					data:{
						userId:userName,
						bpmnProcess:bpmnProcess,
						ticketId:ticketId,
						bpmnType:bpmnType,
						variable:variable
					},
					dataType:"json",
					success:function(pr, textStatus){
						if(textStatus){
							alert(result);
							if(pr.success){
								initPage(true);
							}
						}
					}
				});
				return ;
			}
			if(type=="hqbpmn_toBeSupplement"){
				$.ajax({
					url:basePath+"bpmnAction/processinstance/getBackNodes.do",
					type:"POST",
					async:false,
					data:{
						bpmnProcess:bpmnProcess,
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						taskId:$("#simTaskId").val()
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							var preAction={};
							preAction.candidateUsers=true;
							var data = eval(pr.result);
							var nodes="";
							if (data.length > 0) {
							  for (var i = 0; i < data.length; i++){
								  if(i!=0){
									  nodes+=",";
								  }
								  nodes+=data[i].key;
							  }
						    }
							preAction.candidateUser=nodes;
							var dialogDivDom=null;
							dialogDivDom=$("#dialogDiv").dialog({
								title : '补正节点',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
							SimulationLookUp.showBpmnInsideBtn({
								dialogDivDom:dialogDivDom,
								preAction:preAction,
								variable:"",
								btnType:JSON.parse(bpmnProcess).id
							});
							var divs=dialogDivDom.children();
							if($(divs[0]).attr("class")=="panel"){
								$(divs[0]).remove();
							}
						}
					}
				});
				return ;
			}
			$.ajax({
				url:basePath+"bpmnAction/processinstance/getButtonUsers.do",
				type:"POST",
				async:false,
				data:{
					bpmnProcess:bpmnProcess,
					ticketId:ticketId,
					bpmnType:bpmnType,
					userId:userName,
					taskId:$("#simTaskId").val()
				},
				success:function(pr, textStatus){
					if(textStatus&&pr.success){
						var preAction={};
						preAction.candidateUsers=true;
						preAction.candidateUser=pr.result;
						var dialogDivDom=null;
						if(type=="hqbpmn_tranform"){
							dialogDivDom=$("#dialogDiv").dialog({
								title : '转办用户',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
						}else if(type=="hqbpmn_reading"){
							dialogDivDom=$("#dialogDiv").dialog({
								title : '阅办',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
						}else if(type=="hqbpmn_tranformReading"){
							dialogDivDom=$("#dialogDiv").dialog({
								title : '传阅',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
						}else if(type=="hqbpmn_toBeReturned"){
							dialogDivDom=$("#dialogDiv").dialog({
								title : '退回',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
						}else if(type=="hqbpmn_partReturn"){
							dialogDivDom=$("#dialogDiv").dialog({
								title : '部分回退',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
						}else if(type=="hqbpmn_innerCountersign"){
							dialogDivDom=$("#dialogDiv").dialog({
								title : '内部会签',
								width : 800,
								height : 500
							}).on("renderBpmnInsideBtnAction",function(event,condidate){
								renderBpmnInsideBtnAction(JSON.parse(bpmnProcess).id,condidate,JSON.parse(bpmnProcess).taskId);
							});
						}
						SimulationLookUp.showBpmnInsideBtn({
							dialogDivDom:dialogDivDom,
							preAction:preAction,
							variable:"",
							btnType:JSON.parse(bpmnProcess).id
						});
						var divs=dialogDivDom.children();
						if($(divs[0]).attr("class")=="panel"){
							$(divs[0]).remove();
						}
						
					}
				}
			});
		}
		function renderBpmnInsideBtnAction(btnType,condidate,taskId,newTicketId){
			if(btnType=='hqbpmn_tranform'){//转办时
				var result = "转办成功";
				$.ajax({
					url:basePath+"bpmnAction/processinstance/tranformDealAction.do",
					type:"POST",
					async:false,
					data:{
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						destUserId:condidate,
						taskKey:$("#simTaskKey").val(),
						taskId:taskId
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							alert(result);
							reloadPage();
						}
					}
				});
			}else if(btnType=='hqbpmn_reading'||btnType=='hqbpmn_tranformReading'){//阅办
				var readingType = "2";
				var result = "阅办成功";
				if(btnType=='hqbpmn_tranformReading'){
					readingType = "1";
					result = "传阅成功";
				}
				$.ajax({
					url:basePath+"bpmnAction/processinstance/readingDealAction.do",
					type:"POST",
					async:false,
					data:{
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						destUserId:condidate,
						taskId:taskId,
						readingType:readingType
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							alert(result);
							reloadPage();
						}
					}
				});
			}else if(btnType=='hqbpmn_toBeReturned'){//退回
				$.ajax({
					url:basePath+"bpmnAction/processinstance/exeBackAction.do",
					type:"POST",
					async:false,
					data:{
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						taskKey:condidate,
						taskId:taskId,
						readingType:readingType
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							alert("退回成功");
							reloadPage();
						}
					}
				});
			}else if(btnType=='hqbpmn_partReturn'){//部分回退
				$.ajax({
					url:basePath+"bpmnAction/processinstance/partReturnAction.do",
					type:"POST",
					async:false,
					data:{
						oldTicketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						destinationTaskKey:condidate,
						newTicketId:newTicketId
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							alert("部分回退成功");
							reloadPage();
							
						}else{
							alert(pr.message);
							reloadPage();
						}
					}
				});
			}else if(btnType=='hqbpmn_innerCountersign'){//转办时
				var result = "内部会签成功";
				$.ajax({
					url:basePath+"bpmnAction/processinstance/innerCountersignAction.do",
					type:"POST",
					async:false,
					data:{
						ticketId:ticketId,
						bpmnType:bpmnType,
						userId:userName,
						destUserId:condidate,
						taskKey:$("#simTaskKey").val(),
						taskId:taskId
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							alert(result);
							reloadPage();
						}
					}
				});
			}else if(btnType=='hqbpmn_toBeSupplement'){
				var result = "补正成功";
				var variable=getVariable();
				$.ajax({
					url:basePath+"bpmnAction/processinstance/setToBeSupplement.do",
					type:"POST",
					data:{
						userId:userName,
						taskKey:condidate,
						ticketId:ticketId,
						bpmnType:bpmnType,
						taskId:taskId,
						variable:variable
					},
					dataType:"json",
					success:function(pr, textStatus){
						if(textStatus){
							alert(result);
							reloadPage();
						}
					}
				});
			}
			
		}
		
		function reloadPage(){
			location.href=basePath+"hqbpmn/simulation/simulationInfor.jsp?userName="+userName+"&ticketId="+ticketId+"&bpmnType="+bpmnType;
		}
		
		function runBpmnProcess(event){
			var button=$(event.target);
			var bpmnProcess=button.attr("bpmnProcess");
			bpmnProcessObj=JSON.parse(bpmnProcess);
			if(bpmnProcessObj.type==3){//创建子任务按钮
				createSubTask(bpmnProcess);
			}else if(bpmnProcessObj.type==5){//业务自定义按钮
				if(bpmnProcessObj.id == "hqbpmn_tranform"){ //转办
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_reading"){ //阅办
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_tranformReading"){ //传阅
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_toBeReturned"){ //退回
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_partReturn"){ //部分回退
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_innerCountersign"){ //阅办
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_innerTranform"){ //阅办
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_innerCountersign_info"){ //阅办
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_handleEnd"){ //办结
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_toBeDelete"){ //删除
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_processTrack"){ //流程跟踪
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "over_innerCountersign"){ //流程跟踪
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "over_innerCountersign"){ //流程跟踪
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else if(bpmnProcessObj.id == "hqbpmn_toBeSupplement"){ //补正
					showBpmnInsideBtn(bpmnProcess,bpmnProcessObj.id);
				}else{
					var dialogDivDom=$("#dialogDiv").dialog({
						title : '业务自定义按钮',
						width : 800,
						height : 500
					});
					SimulationLookUp.showBusinessCustomBtn({
						dialogDivDom:dialogDivDom,
						bpmnProcess:bpmnProcess
					});
					var divs=dialogDivDom.children();
					if($(divs[0]).attr("class")=="panel"){
						$(divs[0]).remove();
					}
				}
				return;
			}else{
				var sequenceExtends=null;
				$.ajax({
					url:basePath+"bpmnAction/processinstance/getPreAction.do",
					type:"POST",
					async:false,
					data:{
						bpmnProcess:bpmnProcess,
						ticketId:ticketId,
						userId:userName,
						bpmnType:bpmnType
					},
					success:function(pr, textStatus){
						if(textStatus&&pr.success){
							sequenceExtends=pr.result;
						}
					}
				});
				var variable=getVariable();
				if(bpmnProcessObj.type==4){//创建引用流程
					var bpmnSubTicketIdDoms=button.parent().children("[variable_name='bpmnSubTicketId']");
					var bpmnSubTicketIdDom=$(bpmnSubTicketIdDoms[0]);
					if(bpmnSubTicketIdDom.val()){
						var variableObject=JSON.parse(variable);
						variableObject.push({name:"bpmnSubTicketId",type:"string",value:bpmnSubTicketIdDom.val()});//将子工单号存入参数池
						variable=JSON.stringify(variableObject);
					}else{
						var r=confirm("确认引用流程工单号使用空值？\n点击确认继续，点击取消填写工单号。");
						if (r==true){
						}else{
							bpmnSubTicketIdDoms[0].focus();
							return;
						}
					}
				}
				if(sequenceExtends&&sequenceExtends.length>0){
					var preAction=SimulationLookUp.transformSequenceExtends(sequenceExtends);
					if(preAction.candidateGroups||preAction.candidateUsers||preAction.needComment||preAction.openPanel){
						executionBpmnPreAction(bpmnProcess,preAction,variable);
					}else{
						executionBpmnProcess(bpmnProcess,variable);
					}
				}else{
					executionBpmnProcess(bpmnProcess,variable);
				}
				
			}
		}
		
		function executionBpmnPreAction(bpmnProcess,preAction,variable){
			var dialogDivDom=$("#dialogDiv").dialog({
				title : '前置动作',
				width : 800,
				height : 500
			}).attr("style","overflow:auto").on("executionBpmn",function(event,variable){
				executionBpmnProcess(bpmnProcess,variable);
			});
			SimulationLookUp.showBpmnPreActionDialog({
				dialogDivDom:dialogDivDom,
				preAction:preAction,
				variable:variable
			});
			var divs=dialogDivDom.children();
			if($(divs[0]).attr("class")=="panel"){
				$(divs[0]).remove();
			}
		}
		
		function executionBpmnProcess(bpmnProcess,variable){
			$.ajax({
				url:basePath+"bpmnAction/processinstance/setProcess.do",
				type:"POST",
				data:{
					userId:userName,
					bpmnProcess:bpmnProcess,
					ticketId:ticketId,
					bpmnType:bpmnType,
					variable:variable
				},
				dataType:"json",
				success:function(pr, textStatus){
					if(textStatus){
						alert(pr.message);
						if(pr.success){
							initPage(true);
						}
					}
				}
			});
		}
		
		function createSubTask(bpmnProcess){
			alert("createSubTask to be continued...");
		}
	}
	
	/**
	 * 初始化流程基础新，包括流程类别，工单号，流程状态（鼠标悬浮显示详细信息）
	 */
	function initBpmnInfo(isReload){
		$.ajax({
			url:basePath+"bpmnAction/processinstance/getBpmnState.do",
			type:"POST",
			data:{
				ticketId:ticketId,
				bpmnType:bpmnType
			},
			dataType:"json",
			success:function(pr, textStatus){
				if(textStatus&&pr.success){
					var statusDomObj=$("#status");
					statusDomObj.empty();
					statusDomObj.off("mouseenter");
					statusDomObj.off("mouseleave");
					function showStatusInfo(){
						var dialogDivDom=$("#dialogDiv").dialog({
							title : '状态信息',
							width : 800,
							height : 500
						});
						SimulationLookUp.showBpmnTaskInfo({
							dialogDivDom:dialogDivDom,
							taskInfo:statusDomObj.attr("bpmnTicket")
						});
						var divs=dialogDivDom.children();
						if($(divs[0]).attr("class")=="panel"){
							$(divs[0]).remove();
						}
					}
					var taskInfoArray=JSON.parse(JSON.stringify(pr.result));
					$(taskInfoArray).each(function(index,taskInfoElement){
						$("#simTaskId").val(taskInfoElement.taskId);
						$("#simTaskKey").val(taskInfoElement.stateKey);
					});
					$(pr.result).each(function(index,bpmnTicket){
						if(index>0){
							statusDomObj.append(",");
						}
						statusDomObj.append(bpmnTicket.state);
					});
					statusDomObj.attr("bpmnTicket",JSON.stringify(pr.result)).css({"cursor":"wait"});
					var timeOut=null;
					statusDomObj.mouseenter(function(){
						timeOut=setTimeout(showStatusInfo,1000);
					});
					statusDomObj.mouseleave(function(){
						 clearTimeout(timeOut);
					});
				}
			}
		});
		if(isReload){
			return;
		}
		$("#bpmnType").append(bpmnType);
		$("#ticketId").append(ticketId);
		$("#userName").append(userName);
	}
	
	/**
	 * 初始化参数池信息
	 */
	function initVariable(){
		$.ajax({
			url:basePath+"bpmnAction/processinstance/getVariable.do",
			type:"POST",
			data:{
				ticketId:ticketId,
				bpmnType:bpmnType
			},
			dataType:"json",
			success:function(pr, textStatus){
				if(textStatus&&pr.success){
					var variables=pr.result;
					var variableDomObj=$("#variable");
					variableDomObj.empty();
					$(variables).each(function(index,variable){
						$("<label>",{
							text:variable.name+":"
						}).appendTo(variableDomObj);
						UIUtil.getInput({}).css({"margin-right":"8px"}).attr("variable_name",variable.name).appendTo(variableDomObj);
					});
					$.ajax({
						url:basePath+"bpmnAction/processinstance/getProcessVariables.do",
						type:"POST",
						data:{bpmnType:bpmnType,ticketId:ticketId},
						dataType:"json",
						success:function(pr, textStatus){
							if(textStatus&&pr.success){
								var processVariable=pr.result;
								var inputDomObj;
								$.each(processVariable,function(name,value){
									inputDomObj=variableDomObj.children("input[variable_name='"+name+"']");
									if(inputDomObj.length>0){
										inputDomObj.val(value);
									}else{
										UIUtil.getLabel({label:name+":"+value}).css({"margin-right":"8px"}).appendTo(variableDomObj);
									}
								});
							}
						}
					});
				}
			}
		});
	}
	
	/**
	 * 获得参数池信息
	 * 规则：如果不输入值，则认为不传参数；如果输入空格，则认为为参数赋空值；其它情况会切割前后空格	
	 */
	function getVariable(){
		var variableDomObj=$("#variable");
		var variableInputDomObjs=variableDomObj.find("input");
		var variables=[];
		var variableValue;
		var variableName;
		$(variableInputDomObjs).each(function(index,variableInputDomObj){
			variableValue=variableInputDomObj.value;
			if(variableValue){
				variableName=variableInputDomObj.getAttribute("variable_name");
				variableValue=$.trim(variableValue);
				variables.push({name:variableName,value:variableValue});
			}
		});
		return JSON.stringify(variables);
	}
	
	/**
	 * 初始化权限信息
	 */
	function initPrivilege(){
		$.ajax({
			url:basePath+"bpmnAction/processinstance/getPrivilege.do",
			type:"POST",
			data:{userId:userName,
				ticketId:ticketId,
				bpmnType:bpmnType
			},
			dataType:"json",
			success:function(pr, textStatus){
				if(textStatus&&pr.success){
					var privilegeDomObj=$("#privilege");
					privilegeDomObj.empty();
					if(pr.result){
						var privilege=pr.result;
						var textDivDomObj;
						if(privilege.starter&&privilege.starterList.length>0){
							textDivDomObj=$("<div>",{
								text:"创建人 "
							}).appendTo(privilegeDomObj);
							rendPrivilege(textDivDomObj,privilege.starterList);
						}
						if(privilege.submitter&&privilege.submitterList.length>0){
							textDivDomObj=$("<div>",{
								text:"提交人 "
							}).appendTo(privilegeDomObj);
							rendPrivilege(textDivDomObj,privilege.submitterList);
						}
						if(privilege.candidater&&privilege.candidaterList.length>0){
							textDivDomObj=$("<div>",{
								text:"处理人 "
							}).appendTo(privilegeDomObj);
							rendPrivilege(textDivDomObj,privilege.candidaterList);
						}
					}else{
						privilegeDomObj.text(pr.message);
					}
				}
			}
		});
	}
	
	function rendPrivilege(textDivDomObj,privilegeList){
		var runtimeBpmnRole=textDivDomObj.text();
		var text;
		$(privilegeList).each(function(index,privilege){
			text=privilege.tableName+":";
			text+=privilege.canNotAdd?"不":"";
			text+="可新增,";
			text+=privilege.canNotDelete?"不":"";
			text+="可删除,";
			text+=privilege.canNotVisible?"不":"";
			text+="可见,";
			text+=privilege.canNotModify?"不":"";
			text+="可改。";
			var timeOut=null;
			UIUtil.getSpan({text:text}).appendTo(textDivDomObj)
			.mouseenter(function(){
				timeOut=setTimeout(function(){
					showPrivilege(privilege,runtimeBpmnRole);
				},1000);
			}).mouseleave(function(){
				clearTimeout(timeOut);
			}).css({"cursor":"wait"});
		});
	}
	
	function showPrivilege(privilege,runtimeBpmnRole){
		var dialogDivDom=$("#dialogDiv").dialog({
			title : "权限信息:"+runtimeBpmnRole,
			width : 1000,
			height : 700
		});
		SimulationLookUp.showPrivilege({
			dialogDivDom:dialogDivDom,
			privilege:privilege
		});
		var divs=dialogDivDom.children();
		if($(divs[0]).attr("class")=="panel"){
			$(divs[0]).remove();
		}
	}
	
	function initExtend(isReload){
		if(isReload){
			return;
		}
		$("#showLog").on("click",function(){
			$.ajax({
				url:basePath+"bpmnAction/processinstance/getPath.do",
				type:"POST",
				data:{
					bpmnType:bpmnType,
					ticketId:ticketId
				},
				dataType:"json",
				success:function(pr, textStatus){
					if(pr.success){
						var dialogDivDom=$("#dialogDiv").dialog({
							title : '流程流转记录',
							width : 1000,
							height : 600
						}).css("overflow","auto");
						SimulationLookUp.showBpmnPath({
							dialogDivDom:dialogDivDom,
							bpmnPaths:pr.result
						});
						var divs=dialogDivDom.children();
						if($(divs[0]).attr("class")=="panel"){
							$(divs[0]).remove();
						}
					}
				}
			});
		});
	}
});