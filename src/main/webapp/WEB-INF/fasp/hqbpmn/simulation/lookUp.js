var SimulationLookUp={
	DIALOG_SETTING:{
		height: 1400,
		width:1600,
		modal: true,
		resizable:false,
		autoOpen: false,
		show: {
			// 效果  关闭效果
			effect: "blind",
			duration: 100
		},
		hide: {
			effect: "blind",
			// 持续时间
			duration: 100
		}
	},
	showBpmnPreActionDialog:function(config){
		var dialogDivDom=config.dialogDivDom;
		var preAction=config.preAction;
		var variable=config.variable;
		
		dialogDivDom.dialog("open").dialog({
			onClose:function(){
				dialogDivDom.empty();//清空内容
				dialogDivDom.off("executionBpmn");
			}
		});
		
		var contentDomObj=UIUtil.getDiv({}).appendTo(dialogDivDom);
		var buttonDomObj=UIUtil.getDiv({}).appendTo(dialogDivDom);
		var confirmDomObj=UIUtil.getSpan({className:"metroBtn",text:"确定",css:{position:"relative",top:"10px"}}).appendTo(buttonDomObj);
		UIUtil.getSpan({className:"metroBtn",text:"取消",css:{position:"relative",top:"10px"}}).appendTo(buttonDomObj).click(function(){
			dialogDivDom.dialog("close");
		});
		
		
		renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,0);
		
		function renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,preActionIndex){
			switch (preActionIndex) {
				case "candidate":
					renderBpmnPreActionOfCondidate(contentDomObj,confirmDomObj,variable,preAction);
					break;
				case "comment":
					renderBpmnPreActionOfComment(contentDomObj,confirmDomObj,variable,preAction);
					break;
				case "openPanel":
					renderBpmnPreActionOfOpenPanel(contentDomObj,confirmDomObj,variable,preAction);
					break;
				default:
					contentDomObj.empty();
					if(preAction.candidateGroups||preAction.candidateUsers){
						renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,"candidate");
					}else if(preAction.needComment){
						renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,"comment");
					}else if(preAction.openPanel){
						renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,"openPanel");
					}else{//无下一步前置动作
						dialogDivDom.trigger("executionBpmn",variable);
						dialogDivDom.dialog("close");
					}
					break;
			}
		}
		
		function renderBpmnPreActionOfOpenPanel(contentDomObj,confirmDomObj,variable,preAction){
			contentDomObj.text("个性业务设置信息:"+preAction.openPanel);
			confirmDomObj.one("click",function(){
				preAction.openPanel=null;
				renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,0);
			});
		}
		
		function renderBpmnPreActionOfComment(contentDomObj,confirmDomObj,variable,preAction){
			contentDomObj.append(UIUtil.getLabel({label:"流转意见："}));
			var commentDomObj=UIUtil.getTextarea({}).appendTo(contentDomObj);
			
			confirmDomObj.one("click",function(){
				var comment=commentDomObj.val();
				var variableObject=JSON.parse(variable);
				variableObject.push({name:"bpmnComment",type:"string",value:comment});
				variable=JSON.stringify(variableObject);
				preAction.needComment=false;
				renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,0);
			});
		}
		
		function renderBpmnPreActionOfCondidate(contentDomObj,confirmDomObj,variable,preAction){
			var setting = {
				check: {
					enable: true,
					chkStyle: "checkbox"
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onClick: function(event, treeId, treeNode){
						$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, true, true);
					}
				}
			};
			var treeNodes = []; 
			var treeDomObj;
			if(preAction.candidateGroups){
				$(preAction.candidateGroup.split(",")).each(function(index,candidate){
					if(candidate.length>0){
						treeNodes.push({
							"id":index+1, "pId":0, "name":candidate
						});
					}
				});
				contentDomObj.append(UIUtil.getLabel({label:"候选组："}));
				treeDomObj=UIUtil.getDiv({id:"preActionCandidateGroup",className:"ztree"}).attr("candidateType","candidateGroup").appendTo(contentDomObj);
				$.fn.zTree.init(treeDomObj,setting, treeNodes);
			}
			treeNodes = []; 
			if(preAction.candidateUsers){
				$(preAction.candidateUser.split(",")).each(function(index,candidate){
					if(candidate.length>0){
						treeNodes.push({
							"id":index+1, "pId":0, "name":candidate
						});
					}
				});
				contentDomObj.append(UIUtil.getLabel({label:"候选人："}));
				treeDomObj=UIUtil.getDiv({id:"preActionCandidateUser",className:"ztree"}).attr("candidateType","candidateUser").appendTo(contentDomObj);
				$.fn.zTree.init(treeDomObj,setting, treeNodes);
			}
			confirmDomObj.one("click",function(){
				var variableObject=JSON.parse(variable);
				var ztreeDoms=contentDomObj.children("[class='ztree']");
				var ztreeDomObj;
				var nodes;
				var condidate;
				$(ztreeDoms).each(function(index,ztreeDom){
					ztreeDomObj=$(ztreeDom);
					nodes=$.fn.zTree.getZTreeObj(ztreeDomObj.attr("id")).getCheckedNodes(true);
					if(nodes.length<1){
						return true;
					}
					condidate="";
					$(nodes).each(function(index,node){
						if(index>0){
							condidate+=",";
						}
						condidate+=node.name;
					});
					switch (ztreeDomObj.attr("candidateType")) {
						case "candidateGroup":
							variableObject.push({name:"bpmnCandidateGroups",type:"string",value:condidate});
							break;
						case "candidateUser":
							variableObject.push({name:"bpmnCandidateUsers",type:"string",value:condidate});
							break;
					}
				});
				variable=JSON.stringify(variableObject);
				preAction.candidateGroups=false;
				preAction.candidateUsers=false;
				renderBpmnPreAction(contentDomObj,confirmDomObj,variable,preAction,0);
			});
		}
	},
	
	transformSequenceExtends:function(sequenceExtends){
		var preAction={};
		$(sequenceExtends).each(function(index,sequenceExtend){
			if(!preAction.candidateGroups&&sequenceExtend.candidateGroups){
				preAction.candidateGroups=sequenceExtend.candidateGroups;
				preAction.candidateGroup=sequenceExtend.candidateGroup;
			}
			if(!preAction.candidateUsers&&sequenceExtend.candidateUsers){
				preAction.candidateUsers=sequenceExtend.candidateUsers;
				preAction.candidateUser=sequenceExtend.candidateUser;
			}
			if(!preAction.needComment&&sequenceExtend.needComment){
				preAction.needComment=sequenceExtend.needComment;
			}
			if(!preAction.openPanel&&sequenceExtend.openPanel){
				preAction.openPanel=sequenceExtend.openPanel;
			}
		});
		return preAction;
	},
	
	showBpmnPath:function(config){
		var dialogDivDom=config.dialogDivDom;
		var bpmnPaths=config.bpmnPaths;
		
		dialogDivDom.dialog("open").dialog({
			onClose : function(){
				dialogDivDom.empty();
			}
		});
		
		UIUtil.getSpan({className:"metroBtn",text:"关闭",css:{position:"relative",bottom:"5px"}}).appendTo(dialogDivDom).on("click",function(event){
			dialogDivDom.dialog("close");
		});
		
		var table=UIUtil.getTabel({border:"1"}).appendTo(dialogDivDom);
		var tr=UIUtil.getTr({}).appendTo(table);
		addHeader(tr);
		$(bpmnPaths).each(function(index,bpmnPath){
			tr=UIUtil.getTr({});
			addContainer(bpmnPath,tr);
			tr.appendTo(table);
		});
		
		var src=basePath+"hqbpmn/bpmnlog/scanBpmnLog.jsp?ticketId="+
		ticketId+"&bpmnType="+bpmnType+"&isShowNodeMessage=1&isShowBackgroundGrid=0";
		$("<iframe>",{
			src:src,
			width:"100%",
			height:"300px",
			frameborder:"0",
			scrolling:"no"
		}).appendTo(dialogDivDom);
		
		src=basePath+"hqbpmn/bpmnlog/scanBpmnLogPath.jsp?ticketId="+
		ticketId+"&bpmnType="+bpmnType+"&showLogType=1&perLineNodeNumber=3&initStartNodeLeft=15&initStartNodeTop=15&isShowNodeMessage=1&isShowBackgroundGrid=0";
		$("<iframe>",{
			src:src,
			width:"100%",
			height:"300px",
			frameborder:"0",
			scrolling:"no"
		}).appendTo(dialogDivDom);
		
		function addContainer(bpmnPath,tr){
			var td=UIUtil.getTd({text:bpmnPath.taskName});
			td.appendTo(tr); 
			if(bpmnPath.assignee.indexOf(":") > 0){
				var str = bpmnPath.assignee;
				str=str.replace(new RegExp(/(:)/g),",");
				td=UIUtil.getTd({text:str});
				td.appendTo(tr); 
			}else if(bpmnPath.assignee.indexOf(":") == 0){
				var str = bpmnPath.assignee;
				str=str.replace(new RegExp(/(:)/g),"");
				td=UIUtil.getTd({text:str});
				td.appendTo(tr); 
			}else{
				td=UIUtil.getTd({text:bpmnPath.assignee});
				td.appendTo(tr); 
			}
			td=UIUtil.getTd({text:bpmnPath.startTime.toString()});
			td.appendTo(tr); 
			td=UIUtil.getTd({text:bpmnPath.endTime});
			td.appendTo(tr); 
			td=UIUtil.getTd({text:bpmnPath.durationInMillis});
			td.appendTo(tr); 
			td=UIUtil.getTd({text:bpmnPath.comment});
			td.appendTo(tr); 
		}
		
		function addHeader(tr){
			var td=UIUtil.getTd({text:"节点名"});
			td.appendTo(tr); 
			td=UIUtil.getTd({text:"处理人"});
			td.appendTo(tr);
			td=UIUtil.getTd({text:"开始时间"});
			td.appendTo(tr);  
			td=UIUtil.getTd({text:"结束时间人"});
			td.appendTo(tr); 
			td=UIUtil.getTd({text:"耗时"});
			td.appendTo(tr); 
			td=UIUtil.getTd({text:"审批信息"});
			td.appendTo(tr); 
		}
	},
	
	showPrivilege:function(config){
		var dialogDivDom=config.dialogDivDom;
		var privilege=config.privilege;
		
		dialogDivDom.dialog("open").dialog({
			onClose:function(){
				dialogDivDom.empty();//清空内容
			}
		});
		
		var text=privilege.tableName+"(";
		text+=privilege.tableDBName+"):";
		text+=privilege.canNotAdd?"不":"";
		text+="可新增,";
		text+=privilege.canNotDelete?"不":"";
		text+="可删除,";
		text+=privilege.canNotVisible?"不":"";
		text+="可见,";
		text+=privilege.canNotModify?"不":"";
		text+="可改。";
		UIUtil.getDiv({text:text,css:{"background-color":"#B4EEB4","margin-bottom":"5px"}}).appendTo(dialogDivDom);

		$(privilege.bpmnFieldPrivilegeList).each(function(index,fieldPrivilege){
			text=fieldPrivilege.fieldName+"(";
			text+=fieldPrivilege.fieldDBName+"):";
			text+=fieldPrivilege.canNotVisble?"不":"";
			text+="可见,";
			text+=fieldPrivilege.canNotModify?"不":"";
			text+="可改。";
			UIUtil.getDiv({text:text,css:{"background-color":"#C6E2FF"}}).appendTo(dialogDivDom);
		});
		
		UIUtil.getSpan({className:"metroBtn",text:"关闭",css:{position:"relative",top:"10px"}}).appendTo(dialogDivDom).on("click",function(event){
			dialogDivDom.dialog("close");
		});
	},
	
	showBpmnTaskInfo:function (config){
		var dialogDivDom=config.dialogDivDom;
		var taskInfo=config.taskInfo;
		
		dialogDivDom.dialog("open").dialog({
			onClose:function(){
				dialogDivDom.empty();//清空内容
			}
		});
		
		var taskInfoArray=JSON.parse(taskInfo);
		var text;
		$(taskInfoArray).each(function(index,taskInfoElement){
			text="流程状态:"+taskInfoElement.state;
			text+="\n英文名:"+taskInfoElement.stateKey;
			text+="\n描述:"+taskInfoElement.description;
			text+="\n状态ID:"+taskInfoElement.taskId;
			UIUtil.getDiv({text:text,css:{"background-color":"#FFF5EE","margin-bottom":"5px","font-size":"13px"}}).appendTo(dialogDivDom);
		});
		
		UIUtil.getSpan({className:"metroBtn",text:"关闭",css:{position:"relative",top:"10px"}}).appendTo(dialogDivDom).on("click",function(event){
			dialogDivDom.dialog("close");
		});
	},
	
	showBusinessCustomBtn:function(config){
		var dialogDivDom=config.dialogDivDom;
		var bpmnProcess=config.bpmnProcess;
		
		dialogDivDom.dialog("open").dialog({
			onClose:function(){
				dialogDivDom.empty();//清空内容
			}
		});
		
		bpmnProcess=JSON.parse(bpmnProcess);
		UIUtil.getDiv({text:"ID:"+bpmnProcess.id,css:{"background-color":"#EED5B7"}}).appendTo(dialogDivDom);
		UIUtil.getDiv({text:"名称:"+bpmnProcess.name,css:{"background-color":"#EED5B7"}}).appendTo(dialogDivDom);
		
		UIUtil.getSpan({className:"metroBtn",text:"关闭",css:{position:"relative",top:"10px"}}).appendTo(dialogDivDom).on("click",function(event){
			dialogDivDom.dialog("close");
		});
	},
	showBpmnInsideBtn:function(config){
		var dialogDivDom=config.dialogDivDom;
		var preAction=config.preAction;
		var variable=config.variable;
		var btnType=config.btnType;
		
		dialogDivDom.dialog("open").dialog({
			onClose:function(){
				dialogDivDom.empty();//清空内容
				dialogDivDom.off("renderBpmnInsideBtnAction");
			}
		});
		var contentDomObj=UIUtil.getDiv({}).appendTo(dialogDivDom);
		var buttonDomObj=UIUtil.getDiv({}).appendTo(dialogDivDom);
		var confirmDomObj=UIUtil.getSpan({className:"metroBtn",text:"确定",css:{position:"relative",top:"10px"}}).appendTo(buttonDomObj);
		UIUtil.getSpan({className:"metroBtn",text:"取消",css:{position:"relative",top:"10px"}}).appendTo(buttonDomObj).click(function(){
			dialogDivDom.dialog("close");
		});
		renderBpmnPreActionOfCondidate(contentDomObj,confirmDomObj,variable,preAction);
		function renderBpmnPreActionOfCondidate(contentDomObj,confirmDomObj,variable,preAction){
			var setting = {
				check: {
					enable: true,
					chkStyle: "checkbox"
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onClick: function(event, treeId, treeNode){
						$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, true, true);
					}
				}
			};
			var treeNodes = []; 
			var treeDomObj;
			if(preAction.candidateGroups){
				$(preAction.candidateGroup.split(",")).each(function(index,candidate){
					if(candidate.length>0){
						treeNodes.push({
							"id":index+1, "pId":0, "name":candidate
						});
					}
				});
				contentDomObj.append(UIUtil.getLabel({label:"候选组："}));
				treeDomObj=UIUtil.getDiv({id:"preActionCandidateGroup",className:"ztree"}).attr("candidateType","candidateGroup").appendTo(contentDomObj);
				$.fn.zTree.init(treeDomObj,setting, treeNodes);
			}
			treeNodes = [];
			if(preAction.candidateUsers){
				var aa= preAction.candidateUser+"";
				$(aa.split(",")).each(function(index,candidate){
					if(candidate.length>0){
						treeNodes.push({
							"id":index+1, "pId":0, "name":candidate
						});
					}
				});
				contentDomObj.append(UIUtil.getLabel({label:"新批次:"}));
				contentDomObj.append(UIUtil.getInput({id:"newTicketId"}));
				contentDomObj.append(UIUtil.getDiv({}));
				contentDomObj.append(UIUtil.getLabel({label:"候选人："}));
				treeDomObj=UIUtil.getDiv({id:"preActionCandidateUser",className:"ztree"}).attr("candidateType","candidateUser").appendTo(contentDomObj);
				$.fn.zTree.init(treeDomObj,setting, treeNodes);
			}
			confirmDomObj.one("click",function(){
				var ztreeDoms=contentDomObj.children("[class='ztree']");
				var ztreeDomObj;
				var nodes;
				var condidate;
				var newTicketId =contentDomObj.children('[id="newTicketId"]').val();
				$(ztreeDoms).each(function(index,ztreeDom){
					ztreeDomObj=$(ztreeDom);
					nodes=$.fn.zTree.getZTreeObj(ztreeDomObj.attr("id")).getCheckedNodes(true);
					if(nodes.length<1){
						return true;
					}
					condidate="";
					$(nodes).each(function(index,node){
						if(index>0){
							condidate+=",";
						}
						condidate+=node.name;
					});
//					switch (ztreeDomObj.attr("candidateType")) {
//					case "candidateGroup":
//						variableObject.push({name:"bpmnCandidateGroups",type:"string",value:condidate});
//						break;
//					case "candidateUser":
//						variableObject.push({name:"bpmnCandidateUsers",type:"string",value:condidate});
//						break;
//				}
			});
//			variable=JSON.stringify(variableObject);
				//alert(newTicketId)
			
					dialogDivDom.trigger("renderBpmnInsideBtnAction",[condidate,newTicketId]);
			
			//renderBpmnInsideBtnAction(btnType,condidate);
			});
		}
	}
};