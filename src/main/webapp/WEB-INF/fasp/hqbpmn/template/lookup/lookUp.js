/**
 * 
 */
var varTableIdAndFields = [];// 绑定表单数据
//by函数接受一个成员名字符串做为参数
//并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
function by(name){
 return function(o, p){
   var a, b;
   if (typeof o === "object" && typeof p === "object" && o && p) {
     a = o[name];
     b = p[name];
     if (a === b) {
       return 0;
     }
     if (typeof a === typeof b) {
       return a < b ? -1 : 1;
     }
     return typeof a < typeof b ? -1 : 1;
   }
   else {
     throw ("error");
   }
 }
}
//获取变量条件子表数据
function getTableFiled(fieldName,id,treeNodeName){

	var fieldslist = new Array(); //点击加载子树数据
	$.ajax({
		url : basePath+"bpmnAction/processinstance/selectBusinessFieldsByTableIdAndField.do?tokenid="+tokenID,
		type : "POST",
		data : {
			"tableName":fieldName[0],
			"fieldName":fieldName[1]
		},
		dataType : "json",
		async : false,
		success : function(pr,textStatus) {
			if (pr.success) {
				var result = pr.result;
				fieldslist.push({
					id : id,
					processDefinitionId : "",
					showName : result[0].taskDefKey,
					name : treeNodeName+"H___Q"+result[0].tableDBName+"H___Q",
					type : "string"
			});	
				for(var i = 1;i < result.length;i++){
					fieldslist.push({
					id : treeNodeName+"H___Q"+result[0].tableDBName+"H___Q",
					processDefinitionId : "",
					showName : result[i].taskDefKey,
					name : treeNodeName+result[0].tableDBName+"H___Q"+result[i].tableDBName+"H___Q",
					type : "string"
					});
				}
			}
		}
	});
	for (var j = 0; j < fieldslist.length; j++) { 
			var count=0;
			for(var x in varTableIdAndFields)
			{ 
			if(varTableIdAndFields[x]["name"]==fieldslist[j]["name"]){
				count+=1;
			}
		}
		if(count == 0){
			varTableIdAndFields.push(fieldslist[j]);
		}
	}

}
//翻译条件表达式，type=c 汉译英
function translationExpression(contentDom,type){
	var tempValue;
	if(contentDom[0]=='$'&&contentDom[1]=='{'){
		tempValue = contentDom.substring(2,contentDom.length-1);
	}else{
		tempValue = contentDom;
	}
	var jsonArray = new Array();
	var nameArray = new Array();
	//如果存在and,先以  and 分割
	if(tempValue.indexOf("and") > 0){
		var valueAnd = tempValue.split(" and ");
		for(var i = 0;i < valueAnd.length;i++){
			//如果存在or，再以  or 分割
			if(valueAnd[i].indexOf("or") > 0){
				var valueOr = valueAnd[i].split(" or ");
				    //循环数组valueOr
					for(var m = 0;m < valueOr.length;m++){
						var start1 = 0;
						var end;
						for(var k = 0;k < valueOr[m].length;k++){
							var char = valueOr[m][k];
							var showId;
							if(char == "=" || (char == "!" && valueOr[m][k+1] == "=")  || char == "<" || char == ">"){
								if((char == "!" && valueOr[m][k+1] == "=")){
									end = valueOr[m].lastIndexOf(char);
								}else{
									end = valueOr[m].indexOf(char);
								}
								if(valueOr[m].indexOf("(") >= 0){
									start1= valueOr[m].lastIndexOf("(") + 1;
								}
								showId = valueOr[m].substring(start1,end);
								if(showId.indexOf("!") >= 0){
									showId = showId.substring(showId.lastIndexOf("!")+1,showId.length);
								}
								if(showId.indexOf(" ") == 0 ||showId.lastIndexOf(" ") >= 0){
									showId = showId.replace(/(^\s*)|(\s*$)/g, "");
								}
								//根据showId获取name
								if(showId =="prevTransactorDept" || showId =="上一步处理人部门"){
									name = "上一步处理人部门";
									var str = {"showId":"prevTransactorDept","name":name};
									nameArray.push(str);
								}else if(showId =="prevTransactorRole" || showId =="上一步处理人角色"){
									name = "上一步处理人角色";
									var str = {"showId":"prevTransactorRole","name":name};
									nameArray.push(str);
								}else if(showId == "bpmnTransitionId" || showId =="线ID"){
									name = "线ID";
									var str = {"showId":"bpmnTransitionId","name":name};
									nameArray.push(str);
								}else{
									var flag =false;
									//参数池数据
									var variablePool = _myflow.exportData().diagram.variable.variable;
									for(var s=0;s<variablePool.length;s++){
										if(showId == variablePool[s].name || showId ==variablePool[s].showName){
											name = variablePool[s].showName;
											var str = {"showId":variablePool[s].name,"name":name};
											nameArray.push(str);
											flag = true;
										}
									}
									if(!flag){
										//在业务表中的情况
										if(type=="e"){
										var tableAndFiled = showId.split("H___Q");
										if(tableAndFiled.length==5){
											for(var x in varTableIdAndFields)
											{ 
											if(varTableIdAndFields[x]["name"]==showId){
												var name2=varTableIdAndFields[x]["showName"];
												var pid=varTableIdAndFields[x]["id"];
											}
										}
											for(var x in varTableIdAndFields)
											{ 
											if(varTableIdAndFields[x]["name"]==pid){
												var name1=varTableIdAndFields[x]["showName"];
											}
										}
											name="["+name1+"]"+name2;
											if(typeof(name1)!="undefined" || typeof(name2)!="undefined"){
												var str = {"showId":showId,"name":name};
												nameArray.push(str);}
										
										}else{
											var tableId = tableAndFiled[0];
											var fieldId = tableAndFiled[1];
											if(typeof(tableId)!="undefined" || typeof(fieldId)!="undefined"){
											var str = {"tableId":tableId,"fieldId":fieldId};
											jsonArray.push(str);}
											}
										}else if(type=="c"){
											var tableAndFiled = showId.split("]");
												for(var x in varTableIdAndFields)
												{ 
												if(varTableIdAndFields[x]["showName"]==tableAndFiled[0].substr(1)){
													var pname=varTableIdAndFields[x]["name"];
													for(var y in varTableIdAndFields)
													{
													if(varTableIdAndFields[y]["id"]==pname){
														if(varTableIdAndFields[y]["showName"]==tableAndFiled[1]){
														var name=varTableIdAndFields[y]["name"];
														}
													}
												}
												}
											}
												if(typeof(name)!="undefined"){
													var str = {"showId":name,"name":showId};
													nameArray.push(str);}
										}
									}
								}
								break;
							}
						}
					}
			}else{
				//有and,不存在or的情况
				for(var j = 0;j < valueAnd[i].length;j++){
					var char = valueAnd[i][j];
					var showId;
					var start2 = 0;
					var end;
					if(char == "=" || (char == "!" && valueAnd[i][j+1] == "=") || char == "<" || char == ">"){
						if(char == "!" && valueAnd[i][j+1] == "="){
							end = valueAnd[i].lastIndexOf(char);
						}else{
							end = valueAnd[i].indexOf(char);
						}
						if(valueAnd[i].indexOf("(") >= 0){
							start2 = valueAnd[i].lastIndexOf("(") + 1;
						}
						showId = valueAnd[i].substring(start2,end);
						if(showId.indexOf("!") >= 0){
							showId = showId.substring(showId.lastIndexOf("!")+1,showId.length);
						}
						if(showId.indexOf(" ") == 0 ||showId.lastIndexOf(" ") >= 0){
							showId = showId.replace(/(^\s*)|(\s*$)/g, "");
						}
						//根据showId获取name
						if(showId =="prevTransactorDept" || showId =="上一步处理人部门"){
							name = "上一步处理人部门";
							var str = {"showId":"prevTransactorDept","name":name};
							nameArray.push(str);
						}else if(showId =="prevTransactorRole" || showId =="上一步处理人角色"){
							name = "上一步处理人角色";
							var str = {"showId":"prevTransactorRole","name":name};
							nameArray.push(str);
						}else if(showId == "bpmnTransitionId" || showId =="线ID"){
							name = "线ID";
							var str = {"showId":"bpmnTransitionId","name":name};
							nameArray.push(str);
						}else{
							var flag =false;
							//参数池数据
							var variablePool = _myflow.exportData().diagram.variable.variable;
							for(var s=0;s<variablePool.length;s++){
								if(showId == variablePool[s].name || showId ==variablePool[s].showName){
									name = variablePool[s].showName;
									var str = {"showId":variablePool[s].name,"name":name};
									nameArray.push(str);
									flag = true;
								}
							}
							if(!flag){
								//在业务表中的情况
								if(type=="e"){
								var tableAndFiled = showId.split("H___Q");
								if(tableAndFiled.length==5){
									for(var x in varTableIdAndFields)
									{ 
									if(varTableIdAndFields[x]["name"]==showId){
										var name2=varTableIdAndFields[x]["showName"];
										var pid=varTableIdAndFields[x]["id"];
									}
								}
									for(var x in varTableIdAndFields)
									{ 
									if(varTableIdAndFields[x]["name"]==pid){
										var name1=varTableIdAndFields[x]["showName"];
									}
								}
									name="["+name1+"]"+name2;
									if(typeof(name1)!="undefined" || typeof(name2)!="undefined"){
										var str = {"showId":showId,"name":name};
										nameArray.push(str);}
								
								}else{
									var tableId = tableAndFiled[0];
									var fieldId = tableAndFiled[1];
									if(typeof(tableId)!="undefined" || typeof(fieldId)!="undefined"){
									var str = {"tableId":tableId,"fieldId":fieldId};
									jsonArray.push(str);}
									}
								}else if(type=="c"){
									var tableAndFiled = showId.split("]");
										for(var x in varTableIdAndFields)
										{ 
										if(varTableIdAndFields[x]["showName"]==tableAndFiled[0].substr(1)){
											var pname=varTableIdAndFields[x]["name"];
											for(var y in varTableIdAndFields)
											{
											if(varTableIdAndFields[y]["id"]==pname){
												if(varTableIdAndFields[y]["showName"]==tableAndFiled[1]){
												var name=varTableIdAndFields[y]["name"];
												}
											}
										}
										}
									}
										if(typeof(name)!="undefined"){
											var str = {"showId":name,"name":showId};
											nameArray.push(str);}
								}
							}
						}
						break;
					}
				}
			}
		}
	}else{
		//只存在or的情况
		if(tempValue.indexOf(" or ") > 0){
			var valueOr = tempValue.split(" or ");
			for(var p = 0; p< valueOr.length;p++){
				for(var t = 0; t < valueOr[p].length; t++){
					var char = valueOr[p][t];
					var showId;
					var start3 = 0;
					var end;
					if(char == "=" ||  (char == "!" && valueOr[p][t+1] == "=") || char == "<" || char == ">"){
						if(char == "!" && valueOr[p][t+1] == "="){
							end = valueOr[p].lastIndexOf(char);
						}else{
							end = valueOr[p].indexOf(char);
						}
						if(valueOr[p].indexOf("(") >= 0){
							start3 = valueOr[p].lastIndexOf("(") + 1;
						}
						showId = valueOr[p].substring(start3,end);
						if(showId.indexOf("!") >= 0){
							showId = showId.substring(showId.lastIndexOf("!")+1,showId.length);
						}
						if(showId.indexOf(" ") == 0 ||showId.lastIndexOf(" ") >= 0){
							showId = showId.replace(/(^\s*)|(\s*$)/g, "");
						}
						//根据showId获取name
						if(showId =="prevTransactorDept" || showId =="上一步处理人部门"){
							name = "上一步处理人部门";
							var str = {"showId":"prevTransactorDept","name":name};
							nameArray.push(str);
						}else if(showId =="prevTransactorRole" || showId =="上一步处理人角色"){
							name = "上一步处理人角色";
							var str = {"showId":"prevTransactorRole","name":name};
							nameArray.push(str);
						}else if(showId == "bpmnTransitionId" || showId =="线ID"){
							name = "线ID";
							var str = {"showId":"bpmnTransitionId","name":name};
							nameArray.push(str);
						}else{
							var flag =false;
							//参数池数据
							var variablePool = _myflow.exportData().diagram.variable.variable;
							for(var s=0;s<variablePool.length;s++){
								if(showId == variablePool[s].name || showId ==variablePool[s].showName){
									name = variablePool[s].showName;
									var str = {"showId":variablePool[s].name,"name":name};
									nameArray.push(str);
									flag = true;
								}
							}
							if(!flag){
								//在业务表中的情况
								if(type=="e"){
								var tableAndFiled = showId.split("H___Q");
								if(tableAndFiled.length==5){
									for(var x in varTableIdAndFields)
									{ 
									if(varTableIdAndFields[x]["name"]==showId){
										var name2=varTableIdAndFields[x]["showName"];
										var pid=varTableIdAndFields[x]["id"];
									}
								}
									for(var x in varTableIdAndFields)
									{ 
									if(varTableIdAndFields[x]["name"]==pid){
										var name1=varTableIdAndFields[x]["showName"];
									}
								}
									name="["+name1+"]"+name2;
									if(typeof(name1)!="undefined" || typeof(name2)!="undefined"){
										var str = {"showId":showId,"name":name};
										nameArray.push(str);}
								
								}else{
									var tableId = tableAndFiled[0];
									var fieldId = tableAndFiled[1];
									if(typeof(tableId)!="undefined" || typeof(fieldId)!="undefined"){
									var str = {"tableId":tableId,"fieldId":fieldId};
									jsonArray.push(str);}
									}
								}else if(type=="c"){
									var tableAndFiled = showId.split("]");
										for(var x in varTableIdAndFields)
										{ 
										if(varTableIdAndFields[x]["showName"]==tableAndFiled[0].substr(1)){
											var pname=varTableIdAndFields[x]["name"];
											for(var y in varTableIdAndFields)
											{
											if(varTableIdAndFields[y]["id"]==pname){
												if(varTableIdAndFields[y]["showName"]==tableAndFiled[1]){
												var name=varTableIdAndFields[y]["name"];
												}
											}
										}
										}
									}
										if(typeof(name)!="undefined"){
											var str = {"showId":name,"name":showId};
											nameArray.push(str);}
								}
							}
						}
						break;
					}
				}
			}
		}else{
			//既不存在and也不存在or的情况
				for(var t = 0; t < tempValue.length; t++){
					var char = tempValue[t];
					var showId;
					var start4 = 0;
					var end;
					if(char == "=" || (char == "!" && tempValue[t+1] == "=")  || char == "<" || char == ">"){
						if(char == "!" && tempValue[t+1] == "="){
							end = tempValue.lastIndexOf(char);
						}else{
							end = tempValue.indexOf(char);
						}
						if(tempValue.indexOf("(") >= 0){
							start4 = tempValue.lastIndexOf("(") + 1;
						}
						showId = tempValue.substring(start4,end);
						if(showId.indexOf("!") >= 0){
							showId = showId.substring(showId.lastIndexOf("!")+1,showId.length);
						}
						if(showId.indexOf(" ") == 0 ||showId.lastIndexOf(" ") >= 0){
							showId = showId.replace(/(^\s*)|(\s*$)/g, "");
						}
						//根据showId获取name
						if(showId =="prevTransactorDept" || showId =="上一步处理人部门"){
							name = "上一步处理人部门";
							var str = {"showId":"prevTransactorDept","name":name};
							nameArray.push(str);
						}else if(showId =="prevTransactorRole" || showId =="上一步处理人角色"){
							name = "上一步处理人角色";
							var str = {"showId":"prevTransactorRole","name":name};
							nameArray.push(str);
						}else if(showId == "bpmnTransitionId" || showId =="线ID"){
							name = "线ID";
							var str = {"showId":"bpmnTransitionId","name":name};
							nameArray.push(str);
						}else{
							var flag =false;
							//参数池数据
							var variablePool = _myflow.exportData().diagram.variable.variable;
							for(var s=0;s<variablePool.length;s++){
								if(showId == variablePool[s].name || showId ==variablePool[s].showName){
									name = variablePool[s].showName;
									var str = {"showId":variablePool[s].name,"name":name};
									nameArray.push(str);
									flag = true;
								}
							}
							if(!flag){
								//在业务表中的情况
								if(type=="e"){
								var tableAndFiled = showId.split("H___Q");
								if(tableAndFiled.length==5){
									for(var x in varTableIdAndFields)
									{ 
									if(varTableIdAndFields[x]["name"]==showId){
										var name2=varTableIdAndFields[x]["showName"];
										var pid=varTableIdAndFields[x]["id"];
									}
								}
									for(var x in varTableIdAndFields)
									{ 
									if(varTableIdAndFields[x]["name"]==pid){
										var name1=varTableIdAndFields[x]["showName"];
									}
								}
									name="["+name1+"]"+name2;
									if(typeof(name1)!="undefined" || typeof(name2)!="undefined"){
										var str = {"showId":showId,"name":name};
										nameArray.push(str);}
								
								}else{
									var tableId = tableAndFiled[0];
									var fieldId = tableAndFiled[1];
									if(typeof(tableId)!="undefined" || typeof(fieldId)!="undefined"){
									var str = {"tableId":tableId,"fieldId":fieldId};
									jsonArray.push(str);}
									}
								}else if(type=="c"){
									var tableAndFiled = showId.split("]");
										for(var x in varTableIdAndFields)
										{ 
										if(varTableIdAndFields[x]["showName"]==tableAndFiled[0].substr(1)){
											var pname=varTableIdAndFields[x]["name"];
											for(var y in varTableIdAndFields)
											{
											if(varTableIdAndFields[y]["id"]==pname){
												if(varTableIdAndFields[y]["showName"]==tableAndFiled[1]){
												var name=varTableIdAndFields[y]["name"];
												}
											}
										}
										}
									}
										if(typeof(name)!="undefined"){
											var str = {"showId":name,"name":showId};
											nameArray.push(str);}
								}
							}
						}
						break;
					}
				}
		
		}
	}

	//显示变量池里的数据和固定的上一步处理人部门/角色
	if(type=="e"){
		for(var i = 0;i < nameArray.length;i++){
			var tempName = nameArray[i].name;
			var tempShowId = nameArray[i].showId;
			if(tempValue.indexOf(tempShowId) >= 0){
				tempValue = tempValue.replace(tempShowId,tempName);
			}
		}

		 $.ajax({
				url : basePath+ "bpmnAction/processinstance/selectFieldNameByTableIdAndFieldId.do?tokenid="+ tokenID,
				data : {"arr" : JSON.stringify(jsonArray)},
				type : "post",
				dataType:"json",
				async: false,
				success : function(pr,textStatus) {
					if (pr.success) {
						var result = pr.result;
						for(var i = 0;i < result.length;i++){
							var tempKey = result[i].KEY;
							var tempName = result[i].NAME;
							if(tempValue.indexOf(tempKey) >= 0){
								tempValue = tempValue.replace(tempKey,tempName);
							}
						}
					}
				}
			});
		}else if(type=="c"){
			for(var i = 0;i < nameArray.length;i++){
				var tempName = nameArray[i].name;
				var tempShowId = nameArray[i].showId;
				if(tempValue.indexOf(tempName) >= 0){
					tempValue = tempValue.replace(tempName,tempShowId);
				}
		}
		}
		return tempValue;
}

var FieldLookUp = {
	
		showUserLookUp : function(event) {
			var dialogDivDom = event.data.treeDialogDivDom;
			var	source= event.data.source;
			dialogDivDom.dialog({
				height : 400,
				width : 600,
				modal : true,
				resizable : false,
				closed: true,
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
				close : function() {
					dialogDivDom.empty();// 清空内容
				}
			});
			dialogDivDom.dialog("open");
			var queryDivDom = UIUtil.getDiv({
				id : "dep",
				className : "gzl003"
			}).appendTo(dialogDivDom);
			var dataOfDeptAndUser = [];
			var userTreeDom = null;
			var userDivDom = UIUtil.getDiv({
				id : "user"
			}).css({
				"border" : "2px solid #84C1FF",
				"position" : "absolute",
				"overflow" : "auto",
				"height" : "300px",
				"width" : "200px",
				"top" : "30px",
				"left" : "40px"
			}).appendTo(queryDivDom);
			var tdLable = UIUtil.getTd({}).appendTo(queryDivDom);
			UIUtil.getLabel({
				label : "人员",
			}).appendTo(tdLable).css({
				"position" : "absolute",
				"left" : "50px",
				"top" : "10px",
			});
			var userTreeUl = UIUtil.getUl({
				id : "userTree",
				className : "ztree"
			}).appendTo(userDivDom);
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
			$.ajax({
				url : basePath + "bpmnAction/templateDef/findBpmnIdUser.do?tokenid="+tokenID+"&province="+province,
				type : "post",
				dataType : "json",
				async : false,
				success : function(pr) { 
					if(pr.success){
						users = pr.result;
						$(users).each(function(i, user) {
							dataOfDeptAndUser.push(user);
						});
					}
					userTreeDom = $.fn.zTree.init(userTreeUl, getSetting(), dataOfDeptAndUser);
				}
			});
			
			var buttonDivDom = null;
			buttonDivDom = UIUtil.getDiv({
					className : "gzl003"
				}).css({
					"position" : "absolute",
					"top" : "300px",
					"left" : "280px"
				}).appendTo(dialogDivDom);

			UIUtil.getButton({
					value : "确定"
				}).appendTo(buttonDivDom).on("click", {
					treeDialogDivDom : dialogDivDom
				}, confirm);
			UIUtil.getButton({
					value : "取消"
				}).appendTo(buttonDivDom).on("click", {
					treeDialogDivDom : dialogDivDom
				}, closeLookupDialog);
			var showValues = "";
			var realValue = "";
			function confirm(event) {
				var nodes = null;
				nodes = userTreeDom.getCheckedNodes(true);
				if (nodes) {
					$(nodes).each(function(index, node) {
							showValues += node.name+",";
							realValue+=node.id+",";
					});
				}
				showValues = showValues.substring(0,showValues.lastIndexOf(','));
				realValue = realValue.substring(0,realValue.lastIndexOf(','));
				source.attr("value", realValue);
				source.attr("realValue", showValues);
				closeLookupDialog(event);
			}
			function closeLookupDialog(event) {
				event.data.treeDialogDivDom.dialog("close");
			}
		},
		//时间服务
		showTimeServiceLookUp:function(event) {
			var tableDomObj = UIUtil.getTabel({}).css("width", "100%");
			var dialogDivDom = event.data.dialogDivDom;
			dialogDivDom.dialog("open").dialog({
				closed : false,
				onClose:function(){
					tableDomObj.empty();
				}
			});
			tableDomObj.appendTo(
					dialogDivDom);
			var trDomObj = UIUtil.getTr().appendTo(tableDomObj);
			var tdDomObj = UIUtil.getTd({
				//"className" : "gzl007"
			}).css({
				"width":"50px",
				"align":"right",
			}).appendTo(trDomObj);
			UIUtil.getLabel({
				label : "办理时限:"
			}).appendTo(tdDomObj);
			 UIUtil.getInput({
			}).css({
				"width":"40px",
			}).appendTo(tdDomObj);
			 UIUtil.getLabel({
					label : "天"
				}).appendTo(tdDomObj);
			 UIUtil.getInput({
				}).css({
					"width":"40px",
				}).appendTo(tdDomObj);
			 UIUtil.getLabel({
					label : "时"
				}).appendTo(tdDomObj);
			 UIUtil.getInput({
				}).css({
					"width":"40px",
				}).appendTo(tdDomObj);
			 UIUtil.getLabel({
					label : "分"
				}).appendTo(tdDomObj);
			 UIUtil.getCheckbox({
				}).css({
					"width":"40px",
				}).appendTo(tdDomObj);
			 UIUtil.getLabel({
					label : "工作时间"
				}).appendTo(tdDomObj);
			 //-----------------
			  trDomObj = UIUtil.getTr().appendTo(tableDomObj);
				 tdDomObj = UIUtil.getTd({
					//"className" : "gzl007"
				}).css({
					"width":"50px",
					"align":"right",
				}).appendTo(trDomObj);
				UIUtil.getLabel({
					label : "预警时限:"
				}).appendTo(tdDomObj);
				 UIUtil.getInput({
				}).css({
					"width":"40px",
				}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "天"
					}).appendTo(tdDomObj);
				 UIUtil.getInput({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "时"
					}).appendTo(tdDomObj);
				 UIUtil.getInput({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "分"
					}).appendTo(tdDomObj);
				 UIUtil.getCheckbox({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "工作时间"
					}).appendTo(tdDomObj);
				 
				//----------------------
				 trDomObj = UIUtil.getTr().appendTo(tableDomObj);
				 tdDomObj = UIUtil.getTd({
					//"className" : "gzl007"
				}).css({
					"width":"50px",
					"align":"right",
				}).appendTo(trDomObj);
				UIUtil.getLabel({
					label : "提醒间隔:"
				}).appendTo(tdDomObj);
				 UIUtil.getInput({
				}).css({
					"width":"40px",
				}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "天"
					}).appendTo(tdDomObj);
				 UIUtil.getInput({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "时"
					}).appendTo(tdDomObj);
				 UIUtil.getInput({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "分"
					}).appendTo(tdDomObj);
				 UIUtil.getCheckbox({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "工作时间"
					}).appendTo(tdDomObj);
					//----------------------
				 trDomObj = UIUtil.getTr().appendTo(tableDomObj);
				 tdDomObj = UIUtil.getTd({
					//"className" : "gzl007"
				}).css({
					"width":"50px",
					"align":"right",
				}).appendTo(trDomObj);
				UIUtil.getLabel({
					label : "提醒次数:"
				}).appendTo(tdDomObj);
				 UIUtil.getInput({
				}).css({
					"width":"40px",
				}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "默认不限制"
					}).appendTo(tdDomObj);
					//----------------------
				 trDomObj = UIUtil.getTr().appendTo(tableDomObj);
				 tdDomObj = UIUtil.getTd({
					//"className" : "gzl007"
				}).css({
					"width":"50px",
					"align":"right",
				}).appendTo(trDomObj);
				UIUtil.getLabel({
					label : "提醒方式:"
				}).appendTo(tdDomObj);
				 UIUtil.getCheckbox({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "寻呼"
					}).appendTo(tdDomObj);
				 UIUtil.getCheckbox({
					}).css({
						"width":"40px",
					}).appendTo(tdDomObj);
				 UIUtil.getLabel({
						label : "短信"
					}).appendTo(tdDomObj);
				 trDomObj = UIUtil.getTr().appendTo(tableDomObj);
				 tdDomObj = UIUtil.getTd({
					//"className" : "gzl007"
				}).css({
					"width":"50px",
					"align":"right",
				}).appendTo(trDomObj);
					UIUtil.getButton({
						value : "确定"
					}).appendTo(tdDomObj).on("click", {}, function(event) {
					

				dialogDivDom.dialog("close");
					});
					UIUtil.getButton({
						value : "取消"
					}).appendTo(tdDomObj).on("click", {}, function(event) {
						dialogDivDom.dialog("close");
					});
				 
		},
		
	/*
	 * 引用流程参数，老版本
	 */
	showParameterLookUp2 : function(event) {
		var forDom = event.data.forDom;
		var dialogDivDom = event.data.dialogDivDom;
		var id = event.data.id;
		var idIndex = event.data.idIndex;
		var changeType = event.data.changeType;
		var parameterType = event.data.parameterType;
		var father = "";
		var son = "";
		var orderId = "";

		var rowId = null;
		if (changeType == "delete") {
			rowId = forDom.jqGrid("getGridParam", "selrow");
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			var r = confirm("是否删除?");
			if (r) {
				forDom.jqGrid("delRowData", rowId);
				forDom.trigger("change", {
					changeType : changeType,
					rowId : rowId,
					idIndex : idIndex
				});
			}
			return;
		}
		dialogDivDom.dialog("open").dialog({
			closed : false,
			close : function() {
				dialogDivDom.empty();// 清空内容
			}
		});

		var tableDomObj = UIUtil.getTabel({}).css("width", "100%").appendTo(
				dialogDivDom);
		var processIds = $(this).parent().parent().parent().parent().parent().children().eq(3).find("textarea").val();
		if(parameterType == FlowConstant.PARAMETER_INPUT_DATASOURCE_NAME){
			var trObjFather = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.InputSourceExpression, "", "fatherParameter");
			trObjFather.appendTo(tableDomObj);
			father = trObjFather.find("select");
			//var processIds = $(this).parent().parent().parent().parent().parent().children().eq(3).find("textarea").val();
			var trObjSon = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.InputTargetExpression, processIds, "parameter");
			trObjSon.appendTo(tableDomObj);
			son = trObjSon.find("select");
		}else if(parameterType == FlowConstant.PARAMETER_OUTPUT_DATASOURCE_NAME){
			
			var trObjSon = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.OutputSourceExpression, processIds, "parameter");
			trObjSon.appendTo(tableDomObj);
			son = trObjSon.find("select");
			var trObjFather = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.OutputTargetExpression, "", "fatherParameter");
			trObjFather.appendTo(tableDomObj);
			father = trObjFather.find("select");
		}

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "顺序"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var orderIdDom = UIUtil.getInput({
			style : "width:100%",
			value : orderId
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);

		UIUtil.getButton({
			value : "确定"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			var changeData = null;
			if(parameterType == FlowConstant.PARAMETER_INPUT_DATASOURCE_NAME){
				changeData = {
						sourceExpression : father.val(),
						target : son.val(),
						orderId : orderIdDom.val()
					};
			}else if(parameterType == FlowConstant.PARAMETER_OUTPUT_DATASOURCE_NAME){
				changeData = {
						sourceExpression : son.val(),
						target : father.val(),
						orderId : orderIdDom.val()
					};
			}
			if (changeType == "add") {
				var rowIds = forDom.datagrid('getRows');
				var newId = "newId_0";
				var maxNewNumber = -1;
				var newNumber;
				$(rowIds).each(function(iddex, rowId) {
					if (rowId.id.indexOf("newId_") > -1) {
						newNumber = parseInt(rowId.id.substring(6));
						if (newNumber > maxNewNumber) {
							maxNewNumber = newNumber;
						}
					}
				});
				if (maxNewNumber > -1) {
					newId = "newId_" + (maxNewNumber + 1);
				}
				changeData.id = newId;
				forDom.datagrid("appendRow", changeData);
			} else if (changeType == "modify") {
				var index = forDom.datagrid('getRowIndex', rowId); 
				forDom.datagrid('updateRow',{
					index: index,
					row: changeData
				});
			}
//			forDom.trigger("change", {
//				changeType : changeType,
//				changeData : changeData,
//				idIndex : idIndex
//			});

//				dialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			dialogDivDom.dialog("close");
		});
	},
	/*
	 * 引用流程参数
	 */
	showParameterLookUp : function(event) {
		var forDom = event.data.forDom;
		var dialogDivDom = event.data.dialogDivDom;
		var id = event.data.id;
		var idIndex = event.data.idIndex;
		var changeType = event.data.changeType;
		var parameterType = event.data.parameterType;
		var father = "";
		var son = "";
		var callProcessId = "";
		var orderId = "";
		
		var rowId = null;
		if (changeType == "delete") {
			rowId=forDom.datagrid('getSelected');
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			var r = confirm("是否删除?");
			if (r) {
				var index = forDom.datagrid('getRowIndex', rowId);  
				forDom.datagrid('deleteRow', index);
			}
			return;
		}
		var tableDomObj = UIUtil.getTabel({});
		dialogDivDom.dialog("open").dialog({
			closed : false,
			onClose : function() {
				tableDomObj.empty();// 清空内容
			}
		});

		tableDomObj.appendTo(
				dialogDivDom);
		var processIds = $(this).parent().parent().parent().parent().parent().parent().parent().parent().children().eq(1).find("textarea").val();
		
		var trCallProcess = DefinationProperty.newObject({
			targetDomObj : $("#divProperty")
		}).rendInfo("", "", "", "", FlowDict.CallProcessList, processIds, "callProcess");
		trCallProcess.appendTo(tableDomObj);
		callProcessId = trCallProcess.find("select");
		
		if(parameterType == FlowConstant.PARAMETER_INPUT_DATASOURCE_NAME){
			var trObjFather = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.InputSourceExpression, "", "fatherParameter");
			trObjFather.appendTo(tableDomObj);
			father = trObjFather.find("select");
			//var processIds = $(this).parent().parent().parent().parent().parent().children().eq(3).find("textarea").val();
			var trObjSon = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.InputTargetExpression, processIds, "parameter");
			trObjSon.appendTo(tableDomObj);
			son = trObjSon.find("select");
		}else if(parameterType == FlowConstant.PARAMETER_OUTPUT_DATASOURCE_NAME){
			
			var trObjSon = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.OutputSourceExpression, processIds, "parameter");
			trObjSon.appendTo(tableDomObj);
			son = trObjSon.find("select");
			var trObjFather = DefinationProperty.newObject({
				targetDomObj : $("#divProperty")
			}).rendInfo("", "", "", "", FlowDict.OutputTargetExpression, "", "fatherParameter");
			trObjFather.appendTo(tableDomObj);
			father = trObjFather.find("select");
		}
		
		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "顺序"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var orderIdDom = UIUtil.getInput({
			style : "width:95%",
			value : orderId
		}).appendTo(tdDomObj);
		
		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		
		UIUtil.getButton({
			value : "确定"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			var changeData = null;
			if(parameterType == FlowConstant.PARAMETER_INPUT_DATASOURCE_NAME){
				changeData = {
						sonPrcocessId : callProcessId.val(),
						sourceExpression : father.val(),
						target : son.val(),
						orderId : orderIdDom.val()
				};
			}else if(parameterType == FlowConstant.PARAMETER_OUTPUT_DATASOURCE_NAME){
				changeData = {
						sonPrcocessId : callProcessId.val(),
						sourceExpression : son.val(),
						target : father.val(),
						orderId : orderIdDom.val()
				};
			}
			if (changeType == "add") {
				var rowIds = forDom.datagrid('getRows');
				var newId = "newId_0";
				var maxNewNumber = -1;
				var newNumber;
				$(rowIds).each(function(iddex, rowId) {
					if (rowId.id.indexOf("newId_") > -1) {
						newNumber = parseInt(rowId.id.substring(6));
						if (newNumber > maxNewNumber) {
							maxNewNumber = newNumber;
						}
					}
				});
				if (maxNewNumber > -1) {
					newId = "newId_" + (maxNewNumber + 1);
				}
				changeData.id = newId;
				forDom.datagrid("appendRow", changeData);
			} else if (changeType == "modify") {
				var index = forDom.datagrid('getRowIndex', rowId); 
				forDom.datagrid('updateRow',{
					index: index,
					row: changeData
				});
			}
			forDom.trigger("change", {
				changeType : changeType,
				changeData : changeData,
				idIndex : idIndex
			});
			
				dialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			dialogDivDom.dialog("close");
		});
	},
	showParameterLookUp1 : function(event) {
		var forDom = event.data.forDom;
		var dialogDivDom = event.data.dialogDivDom;
		var id = event.data.id;
		var idIndex = event.data.idIndex;
		var changeType = event.data.changeType;

		var idValue = "";
		var sourceValue = "";
		var sourceExpressionValue = "";
		var targetValue = "";
		var targetExpressionValue = "";
		var orderId = "";

		var rowId = null;
		if (changeType == "modify") {
			rowId = forDom.jqGrid("getGridParam", "selrow");
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			var rowData = forDom.jqGrid("getRowData", rowId);
			idValue = rowData.id;
			sourceValue = rowData.source;
			sourceExpressionValue = rowData.sourceExpression;
			targetValue = rowData.target;
			targetExpressionValue = rowData.targetExpression;
			orderId = rowData.orderId;
		} else if (changeType == "delete") {
			rowId = forDom.jqGrid("getGridParam", "selrow");
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			var r = confirm("是否删除?");
			if (r) {
				forDom.jqGrid("delRowData", rowId);
				forDom.trigger("change", {
					changeType : changeType,
					rowId : rowId,
					idIndex : idIndex
				});
			}
			return;
		}
		var tableDomObj = UIUtil.getTabel({}).css("width", "100%");
		dialogDivDom.dialog("open").dialog({
			closed : false,
			close : function() {
				tableDomObj.empty();// 清空内容
			}
		});

		tableDomObj.appendTo(
				dialogDivDom);

		var trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		var tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "源"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var sourceInputDom = UIUtil.getInput({
			style : "width:100%",
			value : sourceValue
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "源表达式"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var sourceExpressionInputDom = UIUtil.getInput({
			style : "width:100%",
			value : sourceExpressionValue
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "目标"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var targetInputDom = UIUtil.getInput({
			style : "width:100%",
			value : targetValue
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "目标达式"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var targetExpressionInputDom = UIUtil.getInput({
			style : "width:100%",
			value : targetExpressionValue
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "顺序"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var orderIdDom = UIUtil.getInput({
			style : "width:100%",
			value : orderId
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);

		UIUtil.getButton({
			value : "确定"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			var changeData = {
				id : idValue,
				source : sourceInputDom.val(),
				sourceExpression : sourceExpressionInputDom.val(),
				target : targetInputDom.val(),
				targetExpression : targetExpressionInputDom.val(),
				orderId : orderIdDom.val()
			};

			if (changeType == "add") {
				var rowIds = forDom.jqGrid('getDataIDs');
				var newId = "newId_0";
				var maxNewNumber = -1;
				var newNumber;
				$(rowIds).each(function(iddex, rowId) {
					if (rowId.indexOf("newId_") > -1) {
						newNumber = parseInt(rowId.substring(6));
						if (newNumber > maxNewNumber) {
							maxNewNumber = newNumber;
						}
					}
				});
				if (maxNewNumber > -1) {
					newId = "newId_" + (maxNewNumber + 1);
				}
				changeData[idIndex] = newId;
				forDom.jqGrid("addRowData", newId, changeData, "last");
			} else if (changeType == "modify") {
				forDom.jqGrid("setRowData", rowId, changeData);
			}
			forDom.trigger("change", {
				changeType : changeType,
				changeData : changeData,
				idIndex : idIndex
			});

			dialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			dialogDivDom.dialog("close");
		});
	},
	
	//TODO 显示部门角色:
	showDepartmentAndRoleLookUp: function(event){
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var type = event.data.type;
		// 当前的元素Id
		var elementId = event.data.elementId;
		var dataOfDeptAndUser = [];
		var url = null;
		treeDialogDivDom.dialog({
			height : 600,
			width : 828,
			closed: true,
			onClose : function() {
				// 清空内容
				treeDialogDivDom.empty();// 清空内容
			}
		});
		var queryQuickInputDom = UIUtil.getInput({
			id : "queryInput"
		}).css({
			"height" : "26px",
			"width" : "300px",
			"position" : "absolute",
			"top" : "28px",
			"left" : "25px"
		}).appendTo(treeDialogDivDom);
		var queryQuickBtnDom = UIUtil.getButton({
			id : "queryBtn",
			value : "查询"
		}).css({
			"height" : "26px",
			"width" : "26px",
			"position" : "absolute",
			"top" : "40px",
			"left" : "335px",
			"line-height" : "26px",
	    	"display" : "inline-block",
	    	"padding" : "0 10px"
		}).appendTo(treeDialogDivDom).on("click",{
			queryQuickInputDom : queryQuickInputDom
		},function(event){
			//模糊查询并展开查询结果
			var name = event.data.queryQuickInputDom.val();
			if (name == "" || name == null) {
				alert("请输入用户名！");
				return;
			}
			//获取type，部门：1，角色：2，人员：3
			var	typeName=$(".bpmnDesignerbtnInEd").text();
			var type="";
			if(typeName == "部门"){
				type="1";
			}else if(typeName == "角色"){
				type="2";
			}else if(typeName == "人员"){
				type="3";
			}
			if(null !=type || !"".equals(type)){
				
			$.ajax({
				url : basePath+"bpmnAction/templateDef/findBpmnGroupOrUser.do?tokenid="+tokenID,
				type : "post",
				data : {
					"type" : type,
					"name" : name
				},
				dataType : "json",
				async : false,
				success : function(data) {
					if (data.success) {
						$.fn.zTree.destroy();
						$("#highGrade").hide();
						$("#usertaskNode").hide();
						$("#highGrade").hide();
						$("#highGrade1").hide();
						$("#k1").show();
						var settingdep = getSetting();
						treeDom = $.fn.zTree.init($("#k1"), settingdep, data.result);
					} else{
						alert(data.message);
					}
				}
			});
			}
		});
		
		var queryDivDom = UIUtil.getDiv({
			id : "dep",
			className : "gzl003"
		}).appendTo(treeDialogDivDom);
		var queryDivDom1 = UIUtil.getDiv({
			id : "dep2",
		}).css({
			"height" : "350px",
			"width" : "350px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "410px",
		}).appendTo(treeDialogDivDom);
		UIUtil.getTabel({
			id : "gridTable",
		}).css({}).appendTo(queryDivDom1);
		var contentDom = forDom.attr("value");
		var griddata = "";
		var textAreaDomVal = ""; 
		if (contentDom != "") {
			griddata = JSON.parse(contentDom);
			textAreaDomVal = griddata.processorExp;
		}
		createJqSeniorGrid(eval(griddata.processor));
		var buttonDivs = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "80px",
			"left" : "25px"
		}).appendTo(queryDivDom);
		UIUtil.getHidden({
			id : "hiddenType"
		}).appendTo(queryDivDom);

		
		UIUtil.getButton({
			id : "role",
			value : "角色"
		}).appendTo(buttonDivs).on("click", function(event) {
			$.fn.zTree.destroy();
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			var settingdep = getSetting();
			$.ajax({
				url : url,
				type : "post",
				dataType : "json",
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
				}
			});

		});

		UIUtil.getButton({
			value : "部门"
		}).appendTo(buttonDivs).on(
				"click",
				function(event) {
					$.fn.zTree.destroy();
					$("#highGrade").hide();
					$("#k1").show();
					$("#usertaskNode").hide();
					$("#highGrade").hide();
					$("#highGrade1").hide();
					$("#hiddenType").val("1");
					var url = basePath
							+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
					$.ajax({
						url : url,
						type : "post",
						dataType : "json",
						data : {
							"type" : "1",
						},
						async : false,
						success : function(data) { // json格式转换成对象
							dataOfDeptAndUser = data.result;
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
						}
					});
				});
		function setDeptNodeNocheck(nodes) {
			$(nodes).each(function(i, node) {
				var nodeChildrens = node.children;
				if (nodeChildrens) {
					node.nocheck = true;
					setDeptNodeNocheck(nodeChildrens);
				}
			});
		}
		UIUtil.getButton({
			value : "人员"
		}).appendTo(buttonDivs).on(
				"click",
				function(event) {
					// $.fn.zTree.destroy();
					$("#highGrade").hide();
					$("#k1").show();
					$("#usertaskNode").hide();
					$("#highGrade").hide();
					$("#highGrade1").hide();
					$("#hiddenType").val("3");
					var settingdep = getSetting();
					var url = basePath
							+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
					$.ajax({
						url : url,
						type : "post",
						dataType : "json",
						data : {
							"type" : "1",
						},
						async : false,
						success : function(data) { // json格式转换成对象
							dataOfDeptAndUser = data.result;
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
						}
					});
					$.ajax({
						url : basePath + "bpmnAction/templateDef/findBpmnIdUser.do?tokenid="+tokenID+"&province="+province,
						type : "post",
						dataType : "json",
						async : false,
						success : function(pr) {
							if (pr.success) {
								users = pr.result;
								$(users).each(function(i, user) {
									dataOfDeptAndUser.push(user);
								});
							}
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
							setFatherNodeNocheck(treeDom.getNodes());
						}
					});

				});
		function setFatherNodeNocheck(nodes) {
			$(nodes).each(function(i, node) {
				var nodeChildrens = node.children;
				if (nodeChildrens||node.type=="1") {
					node.nocheck = true;
					setFatherNodeNocheck(nodeChildrens);
				}
			});
		}
		UIUtil.getButton({
			value : "高级"
		}).appendTo(buttonDivs).on("click", function(event) {
			$("#hiddenType").val("5");
			var settingdep = getSetting();
			$("#highGrade").show();
			$("#k1").attr("style", "").hide();
			$.fn.zTree.init($("#k1"), settingdep, null);
		});

		UIUtil.getButton({
			value : "参数池"
		}).appendTo(buttonDivs).on("click", function(event) {
			$.fn.zTree.destroy();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			var variables = _myflow.exportData().diagram.variable.variable;
			var set = {

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
						name : "showName",
						title : "",
					},
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pId",
						rootPId : null
					}
				},
			};
			$("#hiddenType").val("4");
			treeDom = $.fn.zTree.init($("#k1"), set, variables);

		});
		UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "360px",
			"left" : "200px"
		}).appendTo(queryDivDom);
		// getTextarea区域
		if(textAreaDomVal == ""){
			var textAreaDom = UIUtil.getTextarea({
				id : "text",
				value : "行号必须写在小括号内……"
			}).css({
				"position" : "absolute",
				"top" : "495px",
				"left" : "25px",
				"width" : "720px",
				"height" : "60px"
			}).appendTo(queryDivDom);
		}else{
			var textAreaDom = UIUtil.getTextarea({
				id : "text",
				value : textAreaDomVal,
			}).css({
				"position" : "absolute",
				"top" : "495px",
				"left" : "25px",
				"width" : "720px",
				"height" : "60px",
			}).appendTo(queryDivDom);
		}
		if(textAreaDom.val() =='行号必须写在小括号内……'){
			textAreaDom.css({
				"color" : "red"
			});
		}
		textAreaDom.on("focus", function(event) {
			if(textAreaDom.val() =='行号必须写在小括号内……'){
				textAreaDom.val("");
			}
		});
		textAreaDom.on("blur", function(event) {
			debugger;
			if (textAreaDom.val() ==""){
				textAreaDom.val("行号必须写在小括号内……");
				textAreaDom.css({
					"color" : "red"
				});
			}
		});
		/*var textAreaDom = UIUtil.getTextarea({
			id : "text",
			value : textAreaDomVal,
		}).css({
			"position" : "absolute",
			"top" : "495px",
			"left" : "25px",
			"width" : "720px",
			"height" : "60px",
		}).appendTo(queryDivDom);*/
		var operates = [ {
			text : "0",
			"value" : "0"
		}, {
			text : "1",
			"value" : "1"
		}, {
			text : "2",
			"value" : "2"
		}, {
			text : "3",
			"value" : "3"
		}, {
			text : "4",
			"value" : "4"
		}, {
			text : "5",
			"value" : "5"
		}, {
			text : "6",
			"value" : "6"
		}, {
			text : "7",
			"value" : "7"
		}, {
			text : "8",
			"value" : "8"
		}, {
			text : "9",
			"value" : "9"
		}, {
			text : "并且",
			"value" : " and "
		}, {
			text : "或者",
			"value" : " or "
		}, {
			text : "(",
			"value" : "("
		}, {
			text : ")",
			"value" : ")"
		} ];// 操作按钮
		var operatesDivDom = null;
		if (operates) {
			operatesDivDom = UIUtil.getDiv({
				id : "operatesDivDom",
				css : {
					"position" : "absolute",
					"top" : "465px",
					"left" : "25px"
				}
			}).appendTo(queryDivDom);// 操作按钮DIV
			var operateBtnDom;
			$(operates).each(function(index, operate) {
				operateBtnDom = UIUtil.getButton({
					value : operate.text,
					className : "condidationOperateBtn"
				}).css("font-size", "12px").appendTo(operatesDivDom);
				operateBtnDom.on("click", function(event) {
					textAreaDom.focus();
					var numbera=operate.value;
					if(!isNaN(numbera)){
						numbera="("+operate.value+")";
					}
					if(textAreaDom.val().indexOf("行号必须写在小括号内……") > 0 ){
						var value = textAreaDom.val();
						value.remove("行号必须写在小括号内……");
						textAreaDom.val(value);
					}
					if(textAreaDom.val() != "行号必须写在小括号内……" ){
						textAreaDom.css({
							"color" : "black"
						});
					}
					textAreaDom.val(textAreaDom.val()+numbera);
					operate.value.focus();
				});
			});
		}
		url = basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
		var depDivDom = UIUtil.getDiv({
			id : "depxianshi"
		}).css({
			"overflow" : "auto",
			"height" : "350px",
			"width" : "320px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "25px",
			"border" : "2px solid #84C1FF"
		}).appendTo(queryDivDom);
		var options = {
			'与某处理者相同' : '0',
			'与表单某字段相同' : "1",
			'上一步办理人的' : "2",
			'与表单某字段' : '3',
			'与某处理者' : "4",
			'上一步办理人的部门' : "5",
			'上一步办理人的机构' : "6",
			'与某处理者相同的部门' : "7",
			'与某处理者相同的机构' : "8",
			'与上一步办理人相同' : "9"
		};
		var eventDomObj = UIUtil.getSelect({
			id : "highGrade",
			options : options,
			multiple : "true"
		}).css({
			height : "100px",
			"position" : "absolute",
			"left" : "4px",
			height : "150px"
		}).appendTo(depDivDom).hide();
		var listenerImplOptions = {};
		$.ajax({
			url : basePath + "bpmnAction/templateCode/selectCodeByCodeType.do?tokenid="+tokenID,
			type : "post",
			dataType : "json",
			data : {
				codeType : "personnelAllocation",
			},
			async : false,
			success : function(pr) { // json格式转换成对象
				$.each(pr.result, function(i, n) {
					listenerImplOptions[n.codeName] = n.codeKey;
				});
			}
		});
		UIUtil.getSelect({
			id : "highGrade1",
			options : listenerImplOptions,
			multiple : "true"
		}).css({
			height : "100px",
			"position" : "absolute",
			top : "180px",
			left : "4px",
			height : "150px"
		}).appendTo(depDivDom).hide();

		var usertaskNode = UIUtil.getSelect({
			id : "usertaskNode",
			multiple : "true"
		}).css({
			height : "150px",
			"position" : "absolute",
			left : "160px",
		}).appendTo(depDivDom).hide();
		
		$("#highGrade").change(
						function() {
							var arr = {};
							var val = $(this).val();
							if (val == "0"||val=="7"||val=="8") {// 与某处理者相同
								$("#highGrade1").hide();
								$.each(_myflow.exportData().nodes,function(i, n) {
													if (i != elementId&&(n.type=="UserTask"||n.type=="StartEvent")) {
														arr[n.name] =i ;
													}
												});
								usertaskNode.show();
								usertaskNode.empty();
								$("#highGrade option[value='']").remove();
								
								var options = UIUtil.getOptions({
									options : arr,
								});
								
								$(options).each(function(index, option) {
									option.appendTo(usertaskNode);
								});
								$("#usertaskNode option[value='']").remove();
							} else if (val == "1" || val == "3") {
								// 表单 table
								$("#usertaskNode").empty();
								$("#usertaskNode").show();
									$("#highGrade1").hide();
						
								var tableurl = basePath
										+ "bpmnAction/templateDef/findTableByBpmnType.do?tokenid="+tokenID;
								var nodes;
								$.ajax({
									url : tableurl,
									type : "post",
									data : "bpmnType=" + _myflow.$bpmnType,
									dataType : "json",
									async : false,
									success : function(data) {
										// json格式转换成对象
										nodes = data.result;

									}
								});
								// id
								var bpmnBusinessForms = _myflow.exportData().diagram.bpmn.bpmnBusinessForms;
								var bpmnBusinessFormsShowValue = _myflow
										.exportData().diagram.bpmn.bpmnBusinessFormsShowValue;
								var strsids = new Array(); // 定义一数组
								strsids = bpmnBusinessForms.split(","); // 字符分割
								// 显示的name
								var strsnames = new Array(); // 定义一数组
								strsnames = bpmnBusinessFormsShowValue
										.split(","); // 字符分割
								var tableId;
								for (i = 0; i < strsids.length; i++) {
									tableId = strsids[i];
									$("#usertaskNode").append("<optgroup label='" + strsnames[i]+ "'>");
									var mydata;
									$.ajax({url : basePath+ "bpmnAction/templateDef/findFieldByTableId.do?tokenid="+tokenID,
												type : "POST",
												data : "tableId=" + strsids[i],
												dataType : "json",
												async : false,
												success : function(pr,
														textStatus) {
													mydata = pr.result;
													for (var i = 0; i < mydata.length; i++) {
														$("#usertaskNode").append("<option key='"
																				+ tableId
																				+ "' value='"
																				+ mydata[i].id
																				+ "'>"
																				+ mydata[i].name
																				+ "</option>");
													}
													$("#usertaskNode").append(
															" </optgroup>");
												}
											});
								}
							
							} else if (val == "4") {// 与某处理者
								$("#highGrade1").hide();
								$.each(_myflow.exportData().nodes,function(i, n) {if (i != elementId&&( n.type=="UserTask"||n.type=="StartEvent")) {
														arr[n.name] = i;
													}
												});
								usertaskNode.show();
								usertaskNode.empty();
						
								var options = UIUtil.getOptions({
									options : arr,
								});
								$(options).each(function(index, option) {
									option.appendTo(usertaskNode);
								});
								$("#usertaskNode option[value='']").remove();
							
							} else if (val == "2") {// 与某处理者

								$("#usertaskNode").hide();
								$("#highGrade1").show();
								$("#usertaskNode option[value='']").remove();
							}  else if (val == "5"||val == "6"||val == "9") {// 与某处理者

								$("#usertaskNode").hide();
								$("#highGrade1").hide();
								$("#usertaskNode option[value='']").remove();
							}else
								usertaskNode.hide();
						});
				$('#usertaskNode').bind('click',function(){
			
			var checkVal=$("#highGrade").find("option:selected").val();
		
			if (checkVal == "3" || checkVal == "4" ) {
				$("#highGrade1").show();
			}else{
				$("#highGrade1").hide();
			}
			});
			$("#usertaskNode option[value='']").remove();
			$("#highGrade option[value='']").remove();
			$("#highGrade1 option[value='']").remove();
		var depTreeUl = UIUtil.getUl({
			id : "k1",
			className : "ztree",
		}).appendTo(depDivDom);
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
				//级联勾选
//				, 
//			    callback: { 
//			    	onCheck: treenodeClick 
//			    } 
			};
		}
		var settingdep = getSetting();
		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			data : {
				"type" : "0",
			},
			async : false,
			success : function(data) { // json格式转换成对象
				result = data.result;
				treeDom = $.fn.zTree.init(depTreeUl, settingdep, null);
			}
		});
		//点击树节点，获取节点的所有叶子节点
		function treenodeClick(event, treeId, treeNode, clickFlag) { 
		    //此处treeNode 为当前节点 
		     if(treeNode.isParent){
		         getAllChildrenNodes(treeNode);
		     }
		}
		//使用了递归，改变叶子节点选中状态
		function getAllChildrenNodes(treeNode){ 
		    if (treeNode.isParent) { 
		      var childrenNodes = treeNode.children; 
		      if (childrenNodes) { 
		          for (var i = 0; i < childrenNodes.length; i++) { 
		        	  childrenNodes[i].checked=true;
		        	  treeDom.updateNode(childrenNodes[i]);
			          if(childrenNodes[i].isParent){
			        	  getAllChildrenNodes(childrenNodes[i]); 
			          }
		          } 
		      } 
		    } 
		}
		// 增加 删除按钮的添加
		var AddAndDelbuttonDivDom = UIUtil.getDiv({}).css({
			"position" : "absolute",
			"top" : "180px",
			"left" : "360px"
		}).appendTo(queryDivDom);
		UIUtil.getButton({
			value : "->"
		}).css({
			"width" : "15px",
			"position" : "absolute",
			"top" : "10px",
			"left" : "0px"
		}).appendTo(AddAndDelbuttonDivDom).on("click", function(event) {
			var data = [];
			var treeObj = $.fn.zTree.getZTreeObj("k1");
			var sNodes = treeObj.getCheckedNodes(true);
			var nodeIds="";
			var nodeNames="";
			if (sNodes.length > 0) {
				var typeCode = $("#hiddenType").val();
				var type = "";
				if (typeCode == 3) {
					type = "人员";
				}
				if (typeCode == 2) {
					type = "角色";
				}
				if (typeCode == 1) {
					type = "部门";
				}
				if (typeCode == 4) {
					type = "变量池";
				}
				for (var i = 0; i < sNodes.length; i++) {
					if(i!=0){
						nodeIds+=",";
						nodeNames+=",";
					}
					nodeIds+=sNodes[i].id;
					nodeNames+=sNodes[i].name;
				}
				data.push({
					id : nodeIds,
					name : nodeNames,
					type : typeCode,
					key:"",
					orderNo:"",
					tableId:"",
					typeName:type
				});
			}
			var showName = "";
			var typeCode = $("#hiddenType").val();
			if (typeCode == 5) {
				var data1 = [];
				// 高级
				// 第一个框
				var trigger = null;
				var gradeId;
				var gradeType;
				var gradetableId;
				var gradekey;
				if ($("#highGrade option:selected").length > 0) {
					$("#highGrade option:selected").each(function() {
						showName += "【" + $(this).text() + "】";
						var firstCol = "";
						switch ($(this).text()) {
						case "与某处理者相同":
							firstCol = "5_1";
							break;
						case "与表单某字段相同":
							firstCol = "5_2";
							break;
						case "上一步办理人的":
							firstCol = "5_3";
							break;
						case "与表单某字段":
							firstCol = "5_4";
							break;
						case "与某处理者":
							firstCol = "5_5";
							break;
						case "上一步办理人的部门":
							firstCol = "5_6";
							gradekey="2";
							break;
						case "上一步办理人的机构":
							firstCol = "5_7";
							gradekey="3";
							break;
						case "与某处理者相同的部门":
							firstCol = "5_8";
							gradekey="3";
							break;
						case "与某处理者相同的机构":
							firstCol = "5_9";
							gradekey="3";
							break;
						case "与上一步办理人相同":
							firstCol = "5_10";
							gradekey="3";
							break;
						default:
							firstCol = "";
						}
						trigger = firstCol;
						gradeType = firstCol;
						
					});

				}
				if ($("#usertaskNode option:selected").length > 0) {
					$("#usertaskNode option:selected").each(function() {
						showName += "【" + $(this).text() + "】";
						gradekey = $(this).val();
						if (trigger == "5_2" || trigger == "5_4") {
							gradetableId = $(this).attr("key");
						}
					});
				}
				if ($("#highGrade1 option:selected").length > 0) {
					$("#highGrade1 option:selected").each(function() {
						showName += $(this).text();
						gradeId = $(this).val();
					});

				}else{
					gradeId = showName;
				}
				data1.push({
					id : gradeId,
					name : showName,
					type : gradeType,
					key:gradekey,
					orderNo:"",
					tableId:gradetableId,
					typeName:"高级"
				});
				addJqGrid(data1);
			}else{
				addJqGrid(data);
				treeObj.checkAllNodes(false);
			}
		});
		
		function createJqSeniorGrid(data){
			if(typeof data=='string'){
				data= JSON.parse(data);
			}
			jQuery("#gridTable").empty();
			jQuery("#gridTable").datagrid({
				width: '100%',
				height: '310px',
				data:data,
				fit:true,//自动补全
				singleSelect : true,
				rownumbers : true,
				columns :[[
				           	{ field: 'id', title: 'id', width: 50, hidden : true },
				           	{ field: 'typeName', title: '类型', width: 50 , align : 'left' }, 
				           	{ field: 'name', title: '名称', width: 300 , align : 'left ' ,formatter: function(value,row,index){
				        		var showValue = value.length>30?value.substring(0,30)+"...":value;
								return "<span title='"+value+"'>"+ showValue+"</span>";
						 }},
				           	{ field: 'key', title: 'key', width: 100, align : 'center', hidden : true },
				           	{ field: 'orderNo', title: 'orderNo', width: 100 , align : 'center', hidden : true },
				           	{ field: 'tableId', title: 'tableId', width: 100 , align : 'center', hidden : true },
				           	{ field: 'type', title: 'type', width: 100 , align : 'center', hidden : true }
				         ]],
		         onLoadSuccess : function(){
		         }
			});
			$(".datagrid-body").css({'overflow-x' : 'auto'});
		}

		
		function addJqGrid(data) {
			if (data.length > 0) {
				var flag = true;
				var rows = $('#gridTable').datagrid("getRows");
				$.each(rows,function(index,row){
					outerloop:
					for (var i = 0; i < data.length; i++){
						if(row.name==data[i].name){
							flag = false;
							break outerloop;
						}
					}
				});
				if(flag){
					for (var i = 0; i < data.length; i++){
						$('#gridTable').datagrid('insertRow',{
							row: {
								id : data[i].id,
								typeName : data[i].typeName,
								name : data[i].name,
								key : data[i].key,
								orderNo : data[i].orderNo,
								tableId : data[i].tableId,
								type : data[i].type
							}
						});
					}
				}
			}
		}
		
		/**
		 * 删除修改为 行的删除
		 */

		UIUtil.getButton({
			value : "<-"
		}).css({
			"width" : "15px",
			"position" : "absolute",
			"top" : "50px",
			"left" : "0px"
		}).appendTo(AddAndDelbuttonDivDom)
				.on(
						"click",
						function(event) {
							var rowId=$("#gridTable").datagrid('getSelected');
						     if(!rowId){
						    	return;
						     }else{  
						    	 var index = $("#gridTable").datagrid('getRowIndex', rowId);  
						    	 $("#gridTable").datagrid('deleteRow', index);
						     } 
						});
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "560px",
			"left" : "330px"
		}).appendTo(treeDialogDivDom);

		UIUtil.getButton({
			value : "检测表达式"
		}).appendTo(buttonDivDom).on("click", {
		},  function(event){
			var url = basePath+ "bpmnAction/templateDef/validateExpression.do?tokenid="+tokenID;
			$.ajax({
				url : url,
				type : "post",
				//data : "processorExpression="+textAreaDom.val(),
				data : {
					"processorExpression" : textAreaDom.val(),
					"lineSize" : $("#gridTable").datagrid('getRows').length
				},
				dataType : "json",
				async : false,
				success : function(data) {
					alert(data.message);
				}
			});
		});


		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {}, function(event) {
			var o = $("#gridTable");
			var rows = o.datagrid('getRows'); // 获取当前显示的记录
			var orderN=0;
			$.each(rows,function(index,row){
				orderN++;
//				alert(row.id);
//				if(row.id == ""){
//					alert(1);
//					row.id=orderN;
//				}
				row.orderNo=orderN;
			});
			var datas = {
					processor : rows,
					processorExp : textAreaDom.val()
				};
			if (rows ==null) {
				forDom.attr("value", "");// 赋显示值
			} else {
				var jsonData = JSON.stringify(datas);
				var jsonDataTemp = JSON.parse(jsonData);
				if(typeof (jsonDataTemp)=="string"){
					jsonData = jsonDataTemp;
				}
				forDom.attr("value", jsonData);// 赋显示值
			}
			forDom.trigger("change");
			treeDialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		showDefaultRole();
		function showDefaultRole() {
			$.fn.zTree.destroy();
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			$("#dep span:first").attr("class","bpmnDesignerbtnInEd");
			var settingdep = getSetting();
			$.ajax({
				url : url,
				type : "post",
				dataType : "json",
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
				}
			});
		}
		function confirm(event) {

			// forDom.attr("value", JSON.stringify(processor));// 赋显示值

			// event.data.treeDialogDivDom.dialog("close");

			var contentDom = $(lookUpDivDom.find("textarea")[0]);
			var jsonProcessor = JSON.stringify(processor);
			var jsonProcessorTemp = JSON.parse(jsonProcessor);
			if(typeof (jsonProcessorTemp)=="string"){
				jsonProcessor = jsonProcessorTemp;
			}
			forDom.attr("value", jsonProcessor);// 赋显示值
			forDom.trigger("change");

			event.data.treeDialogDivDom.dialog("close");

		}
		function closeLookupDialog(event) {
			$('#k').remove();
			event.data.treeDialogDivDom.dialog("close");
		}
		// 清空所有复选框
		function empty(event) {
			$('#k').remove();
			// $("#operatesDivDom").empty();
			alert("清空");
		}
			
			
	
		
	},
	/*
	 * 候选高级配置
	 */
	showCandidateHighGradeConfigLookUp : function(event){
		var forDom = event.data.forDom;
		//var stepExpDom = event.data.expDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var type = event.data.type;
		// 当前的元素Id
		var elementId = event.data.elementId;
		var dataOfDeptAndUser = [];
		var url = null;
		treeDialogDivDom.dialog({
			height : 530,
			width : 790,
			closed: true,
			onClose : function() {
				// 清空内容
				treeDialogDivDom.empty();// 清空内容
			}
		});
		var queryQuickInputDom = UIUtil.getInput({
			id : "queryInput"
		}).css({
			"height" : "26px",
			"width" : "300px",
			"position" : "absolute",
			"top" : "28px",
			"left" : "25px"
		}).appendTo(treeDialogDivDom);
		var queryQuickBtnDom = UIUtil.getButton({
			id : "queryBtn",
			value : "查询"
		}).css({
			"height" : "26px",
			"width" : "26px",
			"position" : "absolute",
			"top" : "40px",
			"left" : "335px",
			"line-height" : "26px",
	    	"display" : "inline-block",
	    	"padding" : "0 10px"
		}).appendTo(treeDialogDivDom).on("click",{
			queryQuickInputDom : queryQuickInputDom
		},function(event){
			//模糊查询并展开查询结果
			var name = event.data.queryQuickInputDom.val();
			if (name == "" || name == null) {
				alert("请输入用户名！");
				return;
			}
			//获取type，部门：1，角色：2，人员：3
			var	typeName=$(".bpmnDesignerbtnInEd").text();
			var type="";
			if(typeName == "部门"){
				type="1";
			}else if(typeName == "角色"){
				type="2";
			}else if(typeName == "人员"){
				type="3";
			}
			if(null !=type || !"".equals(type)){
			$.ajax({
				url : basePath+"bpmnAction/templateDef/findBpmnGroupOrUser.do?tokenid="+tokenID,
				type : "post",
				data : {
					"type" : type,
					"name" : name
				},
				dataType : "json",
				async : false,
				success : function(data) {
					if (data.success) {
						$.fn.zTree.destroy();
						$("#highGrade").hide();
						$("#usertaskNode").hide();
						$("#highGrade").hide();
						$("#highGrade1").hide();
						$("#k1").show();
						var settingdep = getSetting();
						treeDom = $.fn.zTree.init($("#k1"), settingdep, data.result);
					} else{
						alert(data.message);
					}
				}
			});
			}
		});
		
		var queryDivDom = UIUtil.getDiv({
			id : "dep",
			className : "gzl003"
		}).appendTo(treeDialogDivDom);
		var queryDivDom1 = UIUtil.getDiv({
			id : "dep2",
		}).css({
			"height" : "350px",
			"width" : "350px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "410px",
		}).appendTo(treeDialogDivDom);
		UIUtil.getTabel({
			id : "gridTable",
		}).css({}).appendTo(queryDivDom1);
		//var contentDom = stepExpDom.attr("tempValue");
		//var oldContentDom =  stepExpDom.attr("value");
		//var contentDom = forDom.attr("tempValue");
		var contentDom = forDom.attr("value");
		var oldContentDom =  forDom.attr("realValue");
		if(oldContentDom == null || oldContentDom == undefined || oldContentDom == ""){
			oldContentDom = forDom.attr("value");
		}
		var griddata = "";
		var textAreaDomVal = ""; 
		if (contentDom != "" && contentDom !=null) {
			griddata = JSON.parse(contentDom);
			if(undefined != griddata.processor && null != griddata.processor){
				createJqSeniorGrid(JSON.stringify(griddata.processor));
			}else if(griddata[0].hasOwnProperty('dept') && griddata[0].hasOwnProperty('role') && griddata[0].hasOwnProperty('user')){
				var arry = eval(oldContentDom);
				var deptIdExp  = "";
				var roleIdExp  = "";
				var userIdExp  = "";
				for(var i = 0; i < arry.length; i++){
					deptIdExp  = arry[i].dept;
					roleIdExp  = arry[i].role;
					userIdExp  = arry[i].user;
				}
				var deptNames = "";
				var roleNames = "";
				var userNames = "";
				//根据deptIdExp，roleIdExp，userIdExp查出对应的部门名称，组名称和用户名
				$.ajax({  
			         url:basePath+"bpmnAction/templateDef/selectUserAndDeptAndRoleName.do?tokenid="+tokenID, 
			         data: "deptId="+deptIdExp+"&roleId="+roleIdExp+"&userId="+userIdExp,
			         type:"post",
			         dataType:"json",  
			         success:function(pr) { 
			        	 if(pr.success){
			        		 var result = pr.result;
			        		 if(undefined != result && result.length > 0){
			        			 for(var i = 0; i < result.length; i++){
				        			 var temp = result[i];
									 if(undefined != temp.DEPTNAME && "" != temp.DEPTNAME ){
										 deptNames +="," + temp.DEPTNAME; 
									 }else if(undefined != temp.ROLENAME && "" != temp.ROLENAME ){
										 roleNames +="," + temp.ROLENAME; 
									 }else if(undefined != temp.USERNAME && "" != temp.USERNAME ){
										 userNames +="," + temp.USERNAME; 
									 }
									 if(deptNames != "" && deptNames.indexOf(",",0) == 0){
										 deptNames = deptNames.substring(1);
										}
									 if(roleNames != "" && roleNames.indexOf(",",0) == 0){
										 roleNames = roleNames.substring(1);
										}
									 if(userNames != "" && userNames.indexOf(",",0) == 0){
										 userNames = userNames.substring(1);
										}
									 var deptJson = {
												"id"       : deptIdExp,
								                "typeName" : "部门",
										        "name"     :  deptNames,
										        "key"      : "",
										        "orderNo"  : 1,
										        "tableId"  : "",
										        "type"     : "1"
								        };
										 var roleJson = {
									    		   "id"       : roleIdExp,
									               "typeName" : "角色",
											       "name"     : roleNames,
											       "key"      : "",
											       "orderNo"  : 2,
											       "tableId"  : "",
											       "type"     : "2"
									        };
									     var userJson = {
									    		   "id"       : userIdExp,
									               "typeName" : "人员",
											       "name"     : userNames,
											       "key"      : "",
											       "orderNo"  : 3,
											       "tableId"  : "",
											       "type"     : "3"
									        };
									     var arry = new Array();
									     if(deptNames != undefined && "" != deptNames){
									    	 arry.push(deptJson);
									     }
										if (roleNames != undefined && "" != roleNames) {
											arry.push(roleJson);
										}
										if (userNames != undefined && "" != userNames) {
											arry.push(userJson);
										}
										//解决oa发起人配置后不能回显的问题start
										//var jsonObj = {"processor" : JSON.stringify(arry)};
										var jsonObj = {"processor" : JSON.parse(JSON.stringify(arry))};
										//解决oa发起人配置后不能回显的问题end
										var temp = JSON.stringify(jsonObj);
										griddata = JSON.parse(temp);
										createJqSeniorGrid(eval(griddata.processor));
				        		 }
			        		 }else{
			        			 createJqSeniorGrid(eval(griddata.processor));
			        		 }
			        		 
			        	 }else{
			        		 alert(pr.message);
			        	 }
			         }   
			     }); 
			}else{
				textAreaDomVal = griddata.processorExp;
				//createJqSeniorGrid(JSON.stringify(griddata.processor));
			}
		}
		if((contentDom == null ||contentDom == "" || contentDom == undefined) && oldContentDom != "" && oldContentDom != null && oldContentDom != undefined){
			var processorsObj = JSON.parse(oldContentDom);
			
			if(undefined !=processorsObj && null != processorsObj && processorsObj.length == 1){
				if(processorsObj[0].hasOwnProperty('dept') && processorsObj[0].hasOwnProperty('role') && processorsObj[0].hasOwnProperty('user')){
					var arry = eval(oldContentDom);
					var deptIdExp  = "";
					var roleIdExp  = "";
					var userIdExp  = "";
					for(var i = 0; i < arry.length; i++){
						deptIdExp  = arry[i].dept;
						roleIdExp  = arry[i].role;
						userIdExp  = arry[i].user;
					}
					var deptNames = "";
					var roleNames = "";
					var userNames = "";
					//根据deptIdExp，roleIdExp，userIdExp查出对应的部门名称，组名称和用户名
					$.ajax({  
				         url:basePath+"bpmnAction/templateDef/selectUserAndDeptAndRoleName.do?tokenid="+tokenID, 
				         data: "deptId="+deptIdExp+"&roleId="+roleIdExp+"&userId="+userIdExp,
				         type:"post",
				         dataType:"json",  
				         success:function(pr) { 
				        	 if(pr.success){
				        		 var result = pr.result;
				        		 if(undefined != result && result.length > 0){
				        			 for(var i = 0; i < result.length; i++){
					        			 var temp = result[i];
										 if(undefined != temp.DEPTNAME && "" != temp.DEPTNAME ){
											 deptNames +="," + temp.DEPTNAME; 
										 }else if(undefined != temp.ROLENAME && "" != temp.ROLENAME ){
											 roleNames +="," + temp.ROLENAME; 
										 }else if(undefined != temp.USERNAME && "" != temp.USERNAME ){
											 userNames +="," + temp.USERNAME; 
										 }
										 if(deptNames != "" && deptNames.indexOf(",",0) == 0){
											 deptNames = deptNames.substring(1);
											}
										 if(roleNames != "" && roleNames.indexOf(",",0) == 0){
											 roleNames = roleNames.substring(1);
											}
										 if(userNames != "" && userNames.indexOf(",",0) == 0){
											 userNames = userNames.substring(1);
											}
										 var deptJson = {
													"id"       : deptIdExp,
									                "typeName" : "部门",
											        "name"     :  deptNames,
											        "key"      : "",
											        "orderNo"  : 1,
											        "tableId"  : "",
											        "type"     : "1"
									        };
											 var roleJson = {
										    		   "id"       : roleIdExp,
										               "typeName" : "角色",
												       "name"     : roleNames,
												       "key"      : "",
												       "orderNo"  : 2,
												       "tableId"  : "",
												       "type"     : "2"
										        };
										     var userJson = {
										    		   "id"       : userIdExp,
										               "typeName" : "人员",
												       "name"     : userNames,
												       "key"      : "",
												       "orderNo"  : 3,
												       "tableId"  : "",
												       "type"     : "3"
										        };
										     var arry = new Array();
										     if(deptNames != undefined && "" != deptNames){
										    	 arry.push(deptJson);
										     }
											if (roleNames != undefined && "" != roleNames) {
												arry.push(roleJson);
											}
											if (userNames != undefined && "" != userNames) {
												arry.push(userJson);
											}
											//解决oa发起人配置后不能回显的问题start
											//var jsonObj = {"processor" : JSON.stringify(arry)};
											var jsonObj = {"processor" : JSON.parse(JSON.stringify(arry))};
											//解决oa发起人配置后不能回显的问题end
											var temp = JSON.stringify(jsonObj);
											griddata = JSON.parse(temp);
											createJqSeniorGrid(eval(griddata.processor));
					        		 }
				        		 }else{
				        			 createJqSeniorGrid(eval(griddata.processor));
				        		 }
				        		 
				        	 }else{
				        		 alert(pr.message);
				        	 }
				         }   
				     });  
				}
			}else if (undefined !=processorsObj && null != processorsObj){
				createJqSeniorGrid(JSON.stringify(processorsObj.processor));
			}
		}else{
			createJqSeniorGrid(eval(griddata.processor));
		}
		var buttonDivs = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "80px",
			"left" : "25px"
		}).appendTo(queryDivDom);
		UIUtil.getHidden({
			id : "hiddenType"
		}).appendTo(queryDivDom);

		
		UIUtil.getButton({
			id : "role",
			value : "角色"
		}).appendTo(buttonDivs).on("click", function(event) {
			$.fn.zTree.destroy();
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			var settingdep = getSetting();
			$.ajax({
				url : url,
				type : "post",
				dataType : "json",
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
				}
			});

		});

		UIUtil.getButton({
			value : "部门"
		}).appendTo(buttonDivs).on(
				"click",
				function(event) {
					$.fn.zTree.destroy();
					$("#highGrade").hide();
					$("#k1").show();
					$("#usertaskNode").hide();
					$("#highGrade").hide();
					$("#highGrade1").hide();
					$("#hiddenType").val("1");
					var url = basePath
							+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
					$.ajax({
						url : url,
						type : "post",
						dataType : "json",
						data : {
							"type" : "1",
						},
						async : false,
						success : function(data) { // json格式转换成对象
							dataOfDeptAndUser = data.result;
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
						}
					});
				});
		function setDeptNodeNocheck(nodes) {
			$(nodes).each(function(i, node) {
				var nodeChildrens = node.children;
				if (nodeChildrens) {
					node.nocheck = true;
					setDeptNodeNocheck(nodeChildrens);
				}
			});
		}
		UIUtil.getButton({
			value : "人员"
		}).appendTo(buttonDivs).on(
				"click",
				function(event) {
					// $.fn.zTree.destroy();
					$("#highGrade").hide();
					$("#k1").show();
					$("#usertaskNode").hide();
					$("#highGrade").hide();
					$("#highGrade1").hide();
					$("#hiddenType").val("3");
					var settingdep = getSetting();
					var url = basePath
							+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
					$.ajax({
						url : url,
						type : "post",
						dataType : "json",
						data : {
							"type" : "1",
						},
						async : false,
						success : function(data) { // json格式转换成对象
							dataOfDeptAndUser = data.result;
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
						}
					});
					$.ajax({
						url : basePath + "bpmnAction/templateDef/findBpmnIdUser.do?tokenid="+tokenID+"&province="+province,
						type : "post",
						dataType : "json",
						async : false,
						success : function(pr) {
							if (pr.success) {
								users = pr.result;
								$(users).each(function(i, user) {
									dataOfDeptAndUser.push(user);
								});
							}
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
							setFatherNodeNocheck(treeDom.getNodes());
						}
					});

				});
		function setFatherNodeNocheck(nodes) {
			$(nodes).each(function(i, node) {
				var nodeChildrens = node.children;
				if (nodeChildrens||node.type=="1") {
					node.nocheck = true;
					setFatherNodeNocheck(nodeChildrens);
				}
			});
		}
		UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "360px",
			"left" : "200px"
		}).appendTo(queryDivDom);
		url = basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
		var depDivDom = UIUtil.getDiv({
			id : "depxianshi"
		}).css({
			"overflow" : "auto",
			"height" : "350px",
			"width" : "320px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "25px",
			"border" : "2px solid #84C1FF"
		}).appendTo(queryDivDom);

		var usertaskNode = UIUtil.getSelect({
			id : "usertaskNode",
			multiple : "true"
		}).css({
			height : "150px",
			"position" : "absolute",
			left : "160px",
		}).appendTo(depDivDom).hide();
		var depTreeUl = UIUtil.getUl({
			id : "k1",
			className : "ztree",
		}).appendTo(depDivDom);
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
				//级联勾选
//				, 
//			    callback: { 
//			    	onCheck: treenodeClick 
//			    } 
			};
		}
		var settingdep = getSetting();
		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			data : {
				"type" : "0",
			},
			async : false,
			success : function(data) { // json格式转换成对象
				result = data.result;
				treeDom = $.fn.zTree.init(depTreeUl, settingdep, null);
			}
		});
		//点击树节点，获取节点的所有叶子节点
		function treenodeClick(event, treeId, treeNode, clickFlag) { 
		    //此处treeNode 为当前节点 
		     if(treeNode.isParent){
		         getAllChildrenNodes(treeNode);
		     }
		}
		//使用了递归，改变叶子节点选中状态
		function getAllChildrenNodes(treeNode){ 
		    if (treeNode.isParent) { 
		      var childrenNodes = treeNode.children; 
		      if (childrenNodes) { 
		          for (var i = 0; i < childrenNodes.length; i++) { 
		        	  childrenNodes[i].checked=true;
		        	  treeDom.updateNode(childrenNodes[i]);
			          if(childrenNodes[i].isParent){
			        	  getAllChildrenNodes(childrenNodes[i]); 
			          }
		          } 
		      } 
		    } 
		}
		// 增加 删除按钮的添加
		var AddAndDelbuttonDivDom = UIUtil.getDiv({}).css({
			"position" : "absolute",
			"top" : "180px",
			"left" : "360px"
		}).appendTo(queryDivDom);
		UIUtil.getButton({
			value : "->"
		}).css({
			"width" : "15px",
			"position" : "absolute",
			"top" : "10px",
			"left" : "0px"
		}).appendTo(AddAndDelbuttonDivDom).on("click", function(event) {
			var data = [];
			var treeObj = $.fn.zTree.getZTreeObj("k1");
			var sNodes = treeObj.getCheckedNodes(true);
			var nodeIds="";
			var nodeNames="";
			if (sNodes.length > 0) {
				var typeCode = $("#hiddenType").val();
				var type = "";
				if (typeCode == 3) {
					type = "人员";
				}
				if (typeCode == 2) {
					type = "角色";
				}
				if (typeCode == 1) {
					type = "部门";
				}
				/*if (typeCode == 4) {
					type = "变量池";
				}*/
				for (var i = 0; i < sNodes.length; i++) {
					if(i!=0){
						nodeIds+=",";
						nodeNames+=",";
					}
					nodeIds+=sNodes[i].id;
					nodeNames+=sNodes[i].name;
				}
				data.push({
					id : nodeIds,
					name : nodeNames,
					type : typeCode,
					key:"",
					orderNo:"",
					tableId:"",
					typeName:type
				});
			}
			var showName = "";
			var typeCode = $("#hiddenType").val();
				addJqGrid(data);
				treeObj.checkAllNodes(false);
			//}
		});
		
		function createJqSeniorGrid(data){
			if(typeof data=='string'){
				data= JSON.parse(data);
			}
			jQuery("#gridTable").empty();
			jQuery("#gridTable").datagrid({
				width: '100%',
				height: '310px',
				data:data,
				fit:true,//自动补全
				singleSelect : true,
				rownumbers : true,
				columns :[[
				           	{ field: 'id', title: 'id', width: 50, hidden : true },
				           	{ field: 'typeName', title: '类型', width: 50 , align : 'left' }, 
				           	{ field: 'name', title: '名称', width: 300 , align : 'left ' ,formatter: function(value,row,index){
				        		var showValue = value.length>30?value.substring(0,30)+"...":value;
								return "<span title='"+value+"'>"+ showValue+"</span>";
						 }},
				           	{ field: 'key', title: 'key', width: 100, align : 'center', hidden : true },
				           	{ field: 'orderNo', title: 'orderNo', width: 100 , align : 'center', hidden : true },
				           	{ field: 'tableId', title: 'tableId', width: 100 , align : 'center', hidden : true },
				           	{ field: 'type', title: 'type', width: 100 , align : 'center', hidden : true }
				         ]],
		         onLoadSuccess : function(){
		         }
			});
			$(".datagrid-body").css({'overflow-x' : 'auto'});
		}

		
		function addJqGrid(data) {
			if (data.length > 0) {
				var flag = true;
				var rows = $('#gridTable').datagrid("getRows");
				$.each(rows,function(index,row){
					outerloop:
					for (var i = 0; i < data.length; i++){
						if(row.name==data[i].name){
							flag = false;
							break outerloop;
						}
					}
				});
				if(flag){
					for (var i = 0; i < data.length; i++){
						$('#gridTable').datagrid('insertRow',{
							row: {
								id : data[i].id,
								typeName : data[i].typeName,
								name : data[i].name,
								key : data[i].key,
								orderNo : data[i].orderNo,
								tableId : data[i].tableId,
								type : data[i].type
							}
						});
					}
				}
			}
		}
		
		/**
		 * 删除修改为 行的删除
		 */

		UIUtil.getButton({
			value : "<-"
		}).css({
			"width" : "15px",
			"position" : "absolute",
			"top" : "50px",
			"left" : "0px"
		}).appendTo(AddAndDelbuttonDivDom)
				.on(
						"click",
						function(event) {
							var rowId=$("#gridTable").datagrid('getSelected');
						     if(!rowId){
						    	return;
						     }else{  
						    	 var index = $("#gridTable").datagrid('getRowIndex', rowId);  
						    	 $("#gridTable").datagrid('deleteRow', index);
						     } 
						});
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "480px",
			"left" : "330px"
		}).appendTo(treeDialogDivDom);


		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {}, function(event) {
			debugger;
			var o = $("#gridTable");
			var rows = o.datagrid('getRows'); // 获取当前显示的记录
			var orderN=0;
			$.each(rows,function(index,row){
				orderN++;
//				alert(row.id);
//				if(row.id == ""){
//					alert(1);
//					row.id=orderN;
//				}
				row.orderNo=orderN;
			});
			var datas = {
					processor : rows,
					processorExp : ""
				};
			if (rows ==null) {
				forDom.attr("value", "");// 赋显示值
			} else {
				var jsonData = JSON.stringify(datas);
				var jsonDataTemp = JSON.parse(jsonData);
				if(typeof (jsonDataTemp)=="string"){
					jsonData = jsonDataTemp;
				}
				/*var stepExpObj=[];
				var stepName = "";
				var deptExp = "";
				var roleExp = "";
				var userExp = "";
				var deptName = "";
				var roleName = "";
				var userName = "";
				//1是部门，2是角色，3是人员
				for(var i = 0; i < rows.length; i++){
					if(rows[i].type == "1"){
						//部门
						deptExp +="," + rows[i].id;
						deptName +="," + rows[i].name;
					}else if(rows[i].type == "2"){
						//角色
						roleExp  +="," + rows[i].id;
						roleName  +="," + rows[i].name;
					}else if(rows[i].type == "3"){
						//人员表
						userExp  +="," + rows[i].id;
						userName  +="," + rows[i].name;
					}
				}
				if(deptExp != "" && deptExp.indexOf(",",0) == 0){
					deptExp = deptExp.substring(1);
				}
				if(deptName != "" && deptName.indexOf(",",0) == 0){
					deptName = deptName.substring(1);
				}
				if(roleExp != "" && roleExp.indexOf(",",0) == 0){
					roleExp = roleExp.substring(1);
				}
				if(roleName != "" && roleName.indexOf(",",0) == 0){
					roleName = roleName.substring(1);
				}
				if(userExp != "" && userExp.indexOf(",",0) == 0){
					userExp = userExp.substring(1);
				}
				if(userName != "" && userName.indexOf(",",0) == 0){
					userName = userName.substring(1);
				}
				stepExpObj.push({
					dept : deptExp,
					role : roleExp,
					user : userExp
				});
				stepName = "部门:"+deptName+";角色:"+roleName+";人员:"+userName+";";
				var stepExp = JSON.stringify(stepExpObj);
				var stepExpTemp = JSON.parse(stepExp);
				if(typeof (stepExpTemp)=="string"){
					stepExp = stepExpTemp;
				}*/
				forDom.attr("value", jsonData);
				/*forDom.attr("realValue", stepExp);*/
				//forDom.attr("tempValue", jsonData);
				/*stepExpDom.attr("value", stepExp);
				stepExpDom.attr("realValue", stepExp);
				stepExpDom.trigger("change");*/
			}
			forDom.trigger("change");
			treeDialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		showDefaultRole();
		function showDefaultRole() {
			$.fn.zTree.destroy();
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			$("#dep span:first").attr("class","bpmnDesignerbtnInEd");
			var settingdep = getSetting();
			$.ajax({
				url : url,
				type : "post",
				dataType : "json",
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
				}
			});
		}
		function confirm(event) {

			// forDom.attr("value", JSON.stringify(processor));// 赋显示值

			// event.data.treeDialogDivDom.dialog("close");

			var contentDom = $(lookUpDivDom.find("textarea")[0]);
			var jsonProcessor = JSON.stringify(processor);
			var jsonProcessorTemp = JSON.parse(jsonProcessor);
			if(typeof (jsonProcessorTemp)=="string"){
				jsonProcessor = jsonProcessorTemp;
			}
			forDom.attr("value", jsonProcessor);// 赋显示值
			forDom.trigger("change");

			event.data.treeDialogDivDom.dialog("close");

		}
		function closeLookupDialog(event) {
			$('#k').remove();
			event.data.treeDialogDivDom.dialog("close");
		}
		// 清空所有复选框
		function empty(event) {
			$('#k').remove();
			// $("#operatesDivDom").empty();
			alert("清空");
		}
		
	},
	/*
	 * 人员配置
	 */
	showPersonnelAllocationLookUp : function(event){
		var stepDom = event.data.forDom;
		var targetDialogDivDom = event.data.treeDialogDivDom;
		var stepExpDom = event.data.expDom;
		var url = basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
		var deptTreeDom = null;
		var roleTreeDom = null;
		var userTreeDom = null;
		var dataOfDeptAndUser = [];
		targetDialogDivDom.empty();
		targetDialogDivDom.dialog({
			height : 450,
			width : 700,
			closed: true,
			onClose : function() {
				// 清空内容
				targetDialogDivDom.empty();// 清空内容
			}
		});
		var	queryDivDom = UIUtil.getDiv({
				id:"dep",
				className : "gzl003"
			}).appendTo(targetDialogDivDom);
		var tdLable = UIUtil.getTd({}).appendTo(queryDivDom);
		UIUtil.getLabel({
				label : "部门",
			}).appendTo(tdLable).css({
				"position" : "absolute",
				"left" : "30px",
				"top":"60px",
			});
		var tdLable = UIUtil.getTd({}).appendTo(queryDivDom);
		UIUtil.getLabel({
				label : "角色",
			}).appendTo(tdLable).css({
				"position" : "absolute",
				"left" : "250px",
				"top":"60px",
			});
		var tdLable = UIUtil.getTd({}).appendTo(queryDivDom);
		UIUtil.getLabel({
				label : "人员",
			}).appendTo(tdLable).css({
				"position" : "absolute",
				"left" : "470px",
				"top":"60px",
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
		//部门
		var	depDivDom = UIUtil.getDiv({	id:"depxianshi"}).css({
			"border" : "2px solid #84C1FF",
			"position" : "absolute",
			"overflow" : "auto",
			"height" : "300px",
			"width" : "200px",
			"top" : "80px",
			"left" : "30px"
		}).appendTo(queryDivDom);
		var deptTreeUl = UIUtil.getUl({
			id : "deptTree",
			className : "ztree"
		}).appendTo(depDivDom);
		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			data : {
				"type":"1",
			},
			async : false,
			success : function(data) { // json格式转换成对象
				dataOfDeptAndUser = data.result;
				deptTreeDom = $.fn.zTree.init(deptTreeUl, getSetting(), data.result);
				callShowTreeNode(stepExpDom,deptTreeDom);
			}
		});
		
		// 角色
		var	roleDivDom = UIUtil.getDiv({	id:"role"}).css({
			"border" : "2px solid #84C1FF",
			"position" : "absolute",
			"overflow" : "auto",
			"height" : "300px",
			"width" : "200px",
			"top" : "80px",
			"left" : "250px"
		}).appendTo(queryDivDom);
		var roleTreeUl = UIUtil.getUl({
			id : "roleTree",
			className : "ztree"
		}).appendTo(roleDivDom);
		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			data : {
				"type":"2",
			},
			async : false,
			success : function(data) { // json格式转换成对象
				result = data.result;
				roleTreeDom = $.fn.zTree.init(roleTreeUl, getSetting(), result);
				callShowTreeNode(stepExpDom,roleTreeDom);
			}
		});
		
		// 人员
		var	userDivDom = UIUtil.getDiv({id:"user"}).css({
			"border" : "2px solid #84C1FF",
			"position" : "absolute",
			"overflow" : "auto",
			"height" : "300px",
			"width" : "200px",
			"top" : "80px",
			"left" : "470px"
		}).appendTo(queryDivDom);
		var userTreeUl = UIUtil.getUl({
			id : "userTree",
			className : "ztree"
		}).appendTo(userDivDom);
		$.ajax({
			url : basePath + "bpmnAction/templateDef/findBpmnIdUser.do?tokenid="+tokenID+"&province="+province,
			type : "post",
			dataType : "json",
			async : false,
			success : function(pr) { 
				if(pr.success){
					users = pr.result;
					$(users).each(function(i, user) {
						dataOfDeptAndUser.push(user);
					});
				}
				userTreeDom = $.fn.zTree.init(userTreeUl, getSetting(), dataOfDeptAndUser);
				setFatherNodeNocheck(userTreeDom.getNodes());
				callShowTreeNode(stepExpDom,userTreeDom);
				userTreeDom.refresh();
			}
		});
		
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
				className : "gzl003"
			}).css({
				"position" : "absolute",
				"top" : "400px",
				"left" : "280px"
			}).appendTo(targetDialogDivDom);

		UIUtil.getButton({
				value : "确定"
			}).appendTo(buttonDivDom).on("click", {
				treeDialogDivDom : targetDialogDivDom
			}, confirm);
		UIUtil.getButton({
				value : "取消"
			}).appendTo(buttonDivDom).on("click", {
				treeDialogDivDom : targetDialogDivDom
			}, closeLookupDialog);;
		
		targetDialogDivDom.dialog("open");
		
		function confirm(event) {
			var stepExpObj=[];
			var stepName = "";
			var deptExp = produceStepNameAndExpression(deptTreeDom).stepExp;
			var roleExp = produceStepNameAndExpression(roleTreeDom).stepExp;
			var userExp = produceStepNameAndExpression(userTreeDom).stepExp;
			var deptName = produceStepNameAndExpression(deptTreeDom).stepName;
			var roleName = produceStepNameAndExpression(roleTreeDom).stepName;
			var userName = produceStepNameAndExpression(userTreeDom).stepName;
//			if(deptExp != "" && roleExp != "" && userExp != ""){
				stepExpObj.push({
					dept : deptExp,
					role : roleExp,
					user : userExp
				});
//			}
//			if(deptName != "" && roleName != "" && userName != ""){
				stepName = "部门:"+deptName+";角色:"+roleName+";人员:"+userName+";";
//			}
			var stepExp = JSON.stringify(stepExpObj);
			var stepExpTemp = JSON.parse(stepExp);
			if(typeof (stepExpTemp)=="object"){
				stepDom.attr("value", stepName);
				stepExpDom.attr("value", stepExp);
			}else{
				stepDom.attr("value", stepName);
				stepExpDom.attr("value", stepExpTemp);
			}
			
			
			event.data.treeDialogDivDom.dialog("close");
		}
		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}
		function setFatherNodeNocheck(nodes){
			$(nodes).each(function(i,node){
				var nodeChildrens=node.children;
				if(nodeChildrens||node.type==1){
					node.nocheck=true;
					setFatherNodeNocheck(nodeChildrens);
				}
			});
		}
		function produceStepNameAndExpression (treeObj){
			// 如果一个也没有选择，清空输入区域和隐藏input的值
			var nodes = null;
			if (treeObj != null) {
				nodes = treeObj.getCheckedNodes(true);
			}
			var showValues = "";
			var values = "";
			if (nodes) {
				$(nodes).each(function(index, node) {
					if (showValues.length > 0) {
						showValues += ",";
						values += ",";
					}
					showValues += node.name;
					values += node.id;
				});
			}
			return {
				stepName : showValues,
				stepExp : values
			};
		}
		//回显
		function callShowTreeNode(parametersDom,treeDom){
			// 获取目前输入框中的值，在打开树窗口的时候设置已选中的节点
			if(!parametersDom.val() == ""){
				var selectedIds = null;
				var treeId = treeDom.setting.treeId;
				if(treeId == "deptTree"){
					selectedIds = JSON.parse(parametersDom.attr("value"))[0].dept;
				}else if(treeId == "roleTree"){
					selectedIds = JSON.parse(parametersDom.attr("value"))[0].role;
				}else if(treeId == "userTree"){
					selectedIds = JSON.parse(parametersDom.attr("value"))[0].user;
				}
				if (selectedIds != undefined && selectedIds != ""
						&& selectedIds != "null") {
					var array = selectedIds.split(",");
					for (var i = 0; i < array.length; i++) {
						var selectNode = treeDom.getNodeByParam("id", array[i],
								null);
						treeDom.checkNode(selectNode==null?"":selectNode, true, true);
					}
					treeDom.expandAll(true);
				}
			}
		}
	},
	
	//旧版本，人员配置
	showPersonnelAllocationLookUp1:function(event){

		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var expDom = event.data.expDom;
		var url = null;
		var stepName = "";
		treeDialogDivDom.dialog({
			height : 500,
			width : 650,
			closed: true,
			close : function() {
				// 清空内容
				treeDialogDivDom.empty();// 清空内容
			}
		});
		var	queryDivDom = UIUtil.getDiv({
				id:"dep",
				className : "gzl003"
			}).appendTo(treeDialogDivDom);
	
		var tdLable = UIUtil.getTd({}).appendTo(queryDivDom);
		UIUtil.getLabel({
				label : "部门",
			}).appendTo(tdLable).css({
				"position" : "absolute",
				"left" : "26px",
				"top":"30px",
			});
		var tdLable = UIUtil.getTd({}).appendTo(queryDivDom);
		UIUtil.getLabel({
				label : "角色",
			}).appendTo(tdLable).css({
				"position" : "absolute",
				"left" : "26px",
				"top":"180px",
			});
//		UIUtil.getDiv({
//			className : "gzl003"
//		}).css({
//			"position" : "absolute",
//			"top" : "360px",
//			"left" : "200px"
//		}).appendTo(queryDivDom);
		var textAreaDom = 	UIUtil.getTextarea({
			id:"text",
			value:	forDom.attr("value"), //回显
		}).css({
			"position" : "absolute",
			"top" : "50px",
			"left" : "200px",
			"width":"400px",
			"height": "250px",
		}).appendTo(queryDivDom);
		var operates = [ {
			text : "且",
			"value" : " and "
		}, {
			text : "或",
			"value" : " or "
		}, {
			text : "左括号",
			"value" : "("
		}, {
			text : "右括号",
			"value" : ")"
		}];// 操作按钮
		var operatesDivDom = null;
		if (operates) {
			operatesDivDom = UIUtil.getDiv({
				id:"operatesDivDom",
				css : {
					"margin-top" : "290px",
					"margin-left" : "200px",
				}
			}).appendTo(queryDivDom);// 操作按钮DIV
			var operateBtnDom;
			$(operates).each(function(index, operate) {
				operateBtnDom = UIUtil.getButton({
					value : operate.text,
					className : "condidationOperateBtn"
				}).css("font-size", "12px").appendTo(operatesDivDom);
				operateBtnDom.on("click", function(event) {
					var old=$(queryDivDom.find("textarea")[0]).val();
					$(queryDivDom.find("textarea")[0]).each(function() {
						$(this).text($(this).val(old+operate.value)); 
						stepName += operate.value;
					}); 
					$(queryDivDom.find("textarea")[0]).focus();
				});
			});
		}
		function zTreeOnCheck(event, treeId, treeNode) {
			var old=$(queryDivDom.find("textarea")[0]).val();
			$(queryDivDom.find("textarea")[0]).each(function() {
				$(this).text($(this).val(old+" "+treeNode.name+" ")); 
				stepName += " "+treeNode.id+" ";
			}); 
			$(queryDivDom.find("textarea")[0]).focus();
			
			
//			FieldLookUp.insertAtCursor(textAreaDom[0], " "+treeNode.id+"  ");
		};
		url = basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
		var	depDivDom = UIUtil.getDiv({	id:"depxianshi"}).css({
			"overflow" : "auto",
			"height" : "115px",
			"width" : "160px",
			"position" : "absolute",
			"top" : "50px",
			"left" : "25px",
			"border" : "2px solid #84C1FF"
		}).appendTo(queryDivDom);
		var depTreeUl = UIUtil.getUl({
			id : "k1",
			className : "ztree"
		}).appendTo(depDivDom);
		
		function getSetting() {
			return {
				callback: {
					onClick: zTreeOnCheck
				},
			view : {
				dblClickExpand : false
			},
			callback: {
				onClick: zTreeOnCheck
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
			},
		};
		}
		var settingdep =getSetting();
		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			data : {
				"type":"0",
			},
			async : false,
			success : function(data) { // json格式转换成对象
				
				result = data.result;
				treeDom = $.fn.zTree.init(depTreeUl, settingdep, result);
			}
		});
		
		
		// 部门
	var	roleDivDom = UIUtil.getDiv({	id:"role"}).css({
		"position" : "absolute",
		"top" : "200px",
		"left" : "25px",
		"overflow" : "auto",
		"height" : "115px",
		"width" : "160px",
		"border" : "2px solid #84C1FF"
	}).appendTo(queryDivDom);
	var variableTreeUl;
	variableTreeUl = UIUtil.getUl({
		id : "k",
		className : "ztree"
	}).appendTo(roleDivDom);
	var setting1 =getSetting();

	$.ajax({
		url : url,
		type : "post",
		dataType : "json",
		data : {
			"type":"1",
		},
		async : false,
		success : function(data) { // json格式转换成对象
			result = data.result;
			$.fn.zTree.init(variableTreeUl, setting1, result);
		}
	});
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "360px",
			"left" : "200px"
		}).appendTo(treeDialogDivDom);

		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		;
		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);;
		
		treeDialogDivDom.dialog("open");

		function confirm(event) {
			var contentDom = $(queryDivDom.find("textarea")[0]);
			forDom.attr("value", contentDom.val());// 赋显示值
			expDom.attr("value", stepName);
//			$('#k').remove();
//			var a = $("#nextStepExpression");//上一步表达式
//			var b = $("#prevStepExpression");//下一步表达式
//			var c = $("#relationshipType");//关系
//			var d = $("#allocationName");//配置名称
//			var e = $("#prevStep");//上一步
//			var f = $("#nextStep");//下一步
			event.data.treeDialogDivDom.dialog("close");
		}
		function closeLookupDialog(event) {
//			$('#k').remove();
			event.data.treeDialogDivDom.dialog("close");
		}
		// 清空所有复选框
		function empty(event) {
			$('#k').remove();
			//  $("#operatesDivDom").empty();
			alert("清空");
		}
	},
	//显示流程Id
	showPrcessIdsLookUp : function(event){
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = null;
		url = basePath + "bpmnAction/templateDef/getProcessIds.do?tokenid="+tokenID;
		var treeDom = null;
		var zNodes = null;
		var setting = {
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
					checked : "checked",
					children : "children",
					name : "BPMNTYPENAME",
					title : "",
					url : url
				
				},
				simpleData : {
					enable : true,
					idKey : "BPMNTYPE",
					pIdKey : "PID",
					rootPId : null
				}
			},
			async : {
				enable : true
			},
		};

		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			async : false,
			success : function(data) {
				zNodes = data.result;
				treeDom = $.fn.zTree.init(treeUlDom, setting, zNodes);
				setFatherNodeNocheck(treeDom.getNodes());
			}
		});
		function setFatherNodeNocheck(nodes){
			$(nodes).each(function(i,node){
				var nodeChildrens=node.children;
				if(nodeChildrens){
					node.nocheck=true;
					setFatherNodeNocheck(nodeChildrens);
				}
			});
		}
		// 用户选择的ProcessID
		var selectedUserTreeDom = null;
		var selectedUserDivDom = UIUtil.getDiv({});
		var id = treeUlDom.attr("processId") + "OfselectedUser";
		var selectedUserUlDom = UIUtil.getUl({
			id : id,
			className : "ztree"
		}).appendTo(selectedUserDivDom);
		if (type == "processId") {
			// 获取目前输入框中的值，在打开树窗口的时候设置已选中的节点
			var selectedIds = forDom.attr("realValue");
			if (selectedIds != undefined && selectedIds != ""
					&& selectedIds != "null") {
				var array = selectedIds.split(",");
				for (var i = 0; i < array.length; i++) {
					var selectNode = treeDom.getNodeByParam("PROCESSID", array[i],
							null);
					treeDom.checkNode(selectNode, true, true);
				}
			}
		} 
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "320px",
			"left" : "200px"
		}).appendTo(treeDialogDivDom);
		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			type : type,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		UIUtil.getButton({
			value : "清空"
		}).appendTo(buttonDivDom).on("click", {
			treeDom : treeDom,
			type : type,
			selectedUserTreeDom : selectedUserTreeDom
		}, empty);

		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		// 选择用户或者用户分组后点击确定按钮
		function confirm(event) {
			var forDom = event.data.forDom;
			// 如果一个也没有选择，清空输入区域和隐藏input的值
			var treeObj = event.data.treeDom;
			var nodes = null;
				if (treeObj != null) {
					nodes = treeObj.getCheckedNodes(true);
				}
			var showValues = "";
			var values = "";
			if (nodes) {
				$(nodes).each(function(index, node) {
					if(node.PROCESSID != undefined){
						if (showValues.length > 0) {
							showValues += ",";
							values += ",";
						}
						showValues += node.PROCESSID;
						values += node.PROCESSID;
					}
				});
			}
			forDom.attr("value", showValues);// 赋显示值
			forDom.attr("realValue", values);// 赋实际值
			forDom.trigger("change");

			closeLookupDialog(event);
		}

		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}

		// 清空所有复选框
		function empty(event) {
			var treeObj = event.data.treeDom;
			treeObj.checkAllNodes(false);
			
		}
	},
	
	//显示流程Id
	showPrcessIdsLookUp1 : function(event){
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = null;
		url = basePath + "bpmnAction/templateDef/getProcessIds.do?tokenid="+tokenID;
		var treeDom = null;
		var zNodes = null;
		var setting = {
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
					checked : "checked",
					children : "children",
					name : "processId",
					title : "",
					url : url
				},
				simpleData : {
					enable : true,
					idKey : "processId",
					pIdKey : "",
					rootPId : null
				}
			},
			async : {
				enable : true
			},
		};

		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			async : false,
			success : function(data) {
				zNodes = data.result;
				treeDom = $.fn.zTree.init(treeUlDom, setting, zNodes);
			}
		});
		// 用户选择的ProcessID
		var selectedUserTreeDom = null;
		var selectedUserDivDom = UIUtil.getDiv({});
		var id = treeUlDom.attr("processId") + "OfselectedUser";
		var selectedUserUlDom = UIUtil.getUl({
			id : id,
			className : "ztree"
		}).appendTo(selectedUserDivDom);
		if (type == "processId") {
			// 获取目前输入框中的值，在打开树窗口的时候设置已选中的节点
			var selectedIds = forDom.attr("realValue");
			if (selectedIds != undefined && selectedIds != ""
					&& selectedIds != "null") {
				var array = selectedIds.split(",");
				for (var i = 0; i < array.length; i++) {
					var selectNode = treeDom.getNodeByParam("processId", array[i],
							null);
					treeDom.checkNode(selectNode, true, true);
				}
			}
		} 
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "320px",
			"left" : "200px"
		}).appendTo(treeDialogDivDom);
		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			type : type,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		UIUtil.getButton({
			value : "清空"
		}).appendTo(buttonDivDom).on("click", {
			treeDom : treeDom,
			type : type,
			selectedUserTreeDom : selectedUserTreeDom
		}, empty);

		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		// 选择用户或者用户分组后点击确定按钮
		function confirm(event) {
			var forDom = event.data.forDom;
			// 如果一个也没有选择，清空输入区域和隐藏input的值
			var treeObj = event.data.treeDom;
			var nodes = null;
				if (treeObj != null) {
					nodes = treeObj.getCheckedNodes(true);
				}
			var showValues = "";
			var values = "";
			if (nodes) {
				$(nodes).each(function(index, node) {
					if (showValues.length > 0) {
						showValues += ",";
						values += ",";
					}
					showValues += node.processId;
					values += node.processId;
				});
			}
			forDom.attr("value", showValues);// 赋显示值
			forDom.attr("realValue", values);// 赋实际值
			forDom.trigger("change");

			closeLookupDialog(event);
		}

		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}

		// 清空所有复选框
		function empty(event) {
			var treeObj = event.data.treeDom;
			treeObj.checkAllNodes(false);
			
		}
	},

	showCustomButtonLookUp : function(event) {
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		treeDialogDivDom.empty();
		treeDialogDivDom.css("overflow", "auto").append(UIUtil.getUl({
			className : "ztree"
		}));
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = null;
		url = basePath + "bpmnAction/templateDef/getCustomButton.do?tokenid="+tokenID;
		var treeDom = null;
		var zNodes = null;
		
		$.ajax({
			url : url,
			type : "post",
			data :{
				"buttonType" :'["0","1"]'
			},
			dataType : "json",
			async : false,
			success : function(data) {
				zNodes = data.result;
				for(var i=0; i<zNodes.length; i++){
					var treeLiDom = $("<li><input id='"+zNodes[i].codeKey+"_ckb' type='checkbox' value='"+zNodes[i].codeKey+"' style='float:left;'/><div style='width:16%;float:left;'>"+ zNodes[i].codeName+"</div><input type='text' value='"+ zNodes[i].codeName+"'><input id='"+zNodes[i].codeKey+"_btn' type='button' value='设置'></li>");
					
					var textDomObj = UIUtil.getTextarea_lookup({
						value : "",
						showValue : ""
					});
					var isLunchTypeName = $("<label>", {
						id : zNodes[i].codeKey+"_radName",
						text : "查询发起人"
					});
					var isLunchType = $("<input>", {
						id : zNodes[i].codeKey+"_rad",
						type : "checkbox",
					});
					var orderName = $("<label>", {
						id : zNodes[i].codeKey+"_lab",
						text : "序号："
					});
					var orderDom = $("<input>", {
						id : zNodes[i].codeKey+"_order",
						type : "text",
						value : ""
					});
					textDomObj.appendTo(treeLiDom);
					textDomObj.hide();
					isLunchTypeName.appendTo(treeLiDom);
					isLunchType.appendTo(treeLiDom);
					orderName.appendTo(treeLiDom);
					orderName.hide();
					orderDom.appendTo(treeLiDom);
					orderDom.hide();
					treeLiDom.appendTo(treeUlDom);
					var buttonDomObj = $("#"+zNodes[i].codeKey+"_btn");
					var checkboxDomObj = $("#"+zNodes[i].codeKey+"_ckb");
					var highGradeDivDom = UIUtil.getDiv({
						title : "选择高级用户"
					});
					var bpmnNodeDivDom = UIUtil.getDiv({
						title : "选择流程流转的节点"
					}).css("display","none");
					
					if(!(zNodes[i].codeKey == "hqbpmn_tranform" || zNodes[i].codeKey == "hqbpmn_reading" || zNodes[i].codeKey == "hqbpmn_tranformReading" || zNodes[i].codeKey == "hqbpmn_innerCountersign" || zNodes[i].codeKey == "hqbpmn_innerTranform")){
						/*if(zNodes[i].codeKey != "hqbpmn_toBeReturned"){
							buttonDomObj.hide();
						}*/
						if(!(zNodes[i].codeKey == "hqbpmn_partReturn" ||zNodes[i].codeKey == "hqbpmn_toBeReturned" || zNodes[i].codeKey == "hqbpmn_toBeSupplement")){
							buttonDomObj.hide();
						}
						$("#"+zNodes[i].codeKey+"_radName").hide();
						$("#"+zNodes[i].codeKey+"_rad").hide();
					}
					checkboxDomObj.bind("change",{
						checkboxDomObj : checkboxDomObj
					},isChecked);
					//if(zNodes[i].codeKey == "hqbpmn_toBeReturned"){
					if(zNodes[i].codeKey == "hqbpmn_partReturn" ||zNodes[i].codeKey == "hqbpmn_toBeReturned" || zNodes[i].codeKey == "hqbpmn_toBeSupplement"){
						buttonDomObj.on("click", {
							forDom : textDomObj,
							treeDialogDivDom : bpmnNodeDivDom,
							type : FlowConstant.DEPARTMENT_AND_ROLE_DATASOURCE_NAME,
							elementId : id
						}, FieldLookUp.showBpmnUserTaskNode);
					}else{
						buttonDomObj.on("click", {
							forDom : textDomObj,
							treeDialogDivDom : highGradeDivDom,
							type : FlowConstant.DEPARTMENT_AND_ROLE_DATASOURCE_NAME,
							elementId : id
						}, FieldLookUp.showDepartmentAndRoleLookUp);
					}
				}
				callShow();
			}
		});
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "relative",
			"top" : "20px",
			"left" : "200px",
			"width" : "200px"
		}).appendTo(treeDialogDivDom);
		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			type : type,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog(FlowConstant.DIAGRAMOPEN_SETTING);
		treeDialogDivDom.dialog("open");
		
		//配置完后确定按钮功能
		function confirm(event) {
			var customButtonDom =[];
			var treeLiDom = treeUlDom.find("li");
			if(treeLiDom.length > 0){
				$.each(treeLiDom, function(i,n){
					var isChecked = n.childNodes[0].checked;
					if(isChecked){
						var buttonProcessorVal = "";
						var lunchType = null;
						if(n.childNodes[4].value != ""){
							buttonProcessorVal = JSON.parse(n.childNodes[4].value);
						}
						if(n.childNodes[6].checked){
							lunchType = "1";
						}else{
							lunchType = "0";
						}
						//解决当自定义按钮的名称为空时，在业务中显示为空的问题,start
						if(n.childNodes[2].value == ""){
							n.childNodes[2].value = n.childNodes[2].defaultValue;
						}
						//end
						customButtonDom.push({
							buttonKey : n.childNodes[0].value,
							buttonName : n.childNodes[2].value,
							buttonProcessor : buttonProcessorVal,
							buttonOrder : n.childNodes[8].value,
							lunchType : lunchType,
						});
					}
				});
			}
			var forDom = event.data.forDom;
			var jsoncustomButtonDom = JSON.stringify(customButtonDom);
			var jsoncustomButtonDomTemp = JSON.parse(jsoncustomButtonDom);
			if(typeof (jsoncustomButtonDomTemp)=="string"){
				jsoncustomButtonDom = jsoncustomButtonDomTemp;
			}
			forDom.attr("value", jsoncustomButtonDom);// 赋显示值
			forDom.trigger("change");
			closeLookupDialog(event);
		}
		// 关闭dialog对话框
		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}
		// 回显
		function callShow(){
			if(forDom.val() != ""){
				var valDom = JSON.parse(forDom.val());
				var treeLiDom = treeUlDom.find("li");
				$.each(valDom,function(i,n){
					if(n.buttonKey != ""){
						$.each(treeLiDom,function(j,k){
							if(k.childNodes[0].value == n.buttonKey){
								k.childNodes[0].checked = true;
								k.childNodes[2].value = n.buttonName;
								var jsonButtonProcessor = JSON.stringify(n.buttonProcessor);
								var jsonButtonProcessorTemp = JSON.parse(jsonButtonProcessor);
								if(typeof (jsonButtonProcessorTemp)=="string"){
									jsonButtonProcessor = jsonButtonProcessorTemp;
								}
								k.childNodes[4].value = jsonButtonProcessor;
								if(n.lunchType == "1"){
									k.childNodes[6].checked = true;
								}
								$("#"+n.buttonKey+"_lab").show();
								$("#"+n.buttonKey+"_order").show();
								if(n.buttonOrder == undefined){
									k.childNodes[8].value = "";
								}else{
									k.childNodes[8].value = n.buttonOrder;
								}
							}
						});
					}
				});
			}
		}
		// 判断复选框是否选中
		function isChecked(event){
			var checkboxDom = event.data.checkboxDomObj;
			var treeLiDom = treeUlDom.find("li");
			$.each(treeLiDom,function(i,n){
				if(n.childNodes[0].value == checkboxDom.val()){
					var isCheck = n.childNodes[0].checked;
					if(isCheck){
						$("#"+checkboxDom.val()+"_lab").show();
						$("#"+checkboxDom.val()+"_order").show();
					}else{
						$("#"+checkboxDom.val()+"_lab").hide();
						$("#"+checkboxDom.val()+"_order").attr("value","");
						$("#"+checkboxDom.val()+"_order").hide();  
					}
				}
			});
		}
	},
	showcustomPropertyLookUp : function(event) {
		//自定义流转线属性
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		treeDialogDivDom.empty();
		treeDialogDivDom.css("overflow", "auto").append(UIUtil.getUl({
			className : "ztree"
		}));
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = null;
		url = basePath + "bpmnAction/templateDef/getCustomButton.do?tokenid="+tokenID;
		var treeDom = null;
		var zNodes = null;
		
		$.ajax({
			url : url,
			type : "post",
			data :{
				"buttonType" :'["3"]'
			},
			dataType : "json",
			async : false,
			success : function(data) {
				zNodes = data.result;
				for(var i=0; i<zNodes.length; i++){
					//var treeLiDom = $("<li><input id='"+zNodes[i].codeKey+"_ckb' type='checkbox' value='"+zNodes[i].codeKey+"' style='float:left;'/><div style='width:16%;float:left;'>"+ zNodes[i].codeName+"</div><input type='text' value='"+ zNodes[i].codeName+"'><input id='"+zNodes[i].codeKey+"_btn' type='button' value='设置'></li>");
					var treeLiDom = $("<li><input id='"+zNodes[i].codeKey+"_ckb' type='checkbox' value='"+zNodes[i].codeKey+"' style='float:left;'/><div style='width:16%;float:left;'>"+ zNodes[i].codeName+"</div><input type='text' value='"+ zNodes[i].codeName+"'></li>");
					
					var textDomObj = UIUtil.getTextarea_lookup({
						value : "",
						showValue : ""
					});
					/*var isLunchTypeName = $("<label>", {
						id : zNodes[i].codeKey+"_radName",
						text : "查询发起人"
					});
					var isLunchType = $("<input>", {
						id : zNodes[i].codeKey+"_rad",
						type : "checkbox",
					});*/
					var orderName = $("<label>", {
						id : zNodes[i].codeKey+"_lab",
						text : "序号："
					});
					var orderDom = $("<input>", {
						id : zNodes[i].codeKey+"_order",
						type : "text",
						value : ""
					});
					textDomObj.appendTo(treeLiDom);
					textDomObj.hide();
					//isLunchTypeName.appendTo(treeLiDom);
					//isLunchType.appendTo(treeLiDom);
					orderName.appendTo(treeLiDom);
					orderName.hide();
					orderDom.appendTo(treeLiDom);
					orderDom.hide();
					treeLiDom.appendTo(treeUlDom);
					/*var buttonDomObj = $("#"+zNodes[i].codeKey+"_btn");
					var checkboxDomObj = $("#"+zNodes[i].codeKey+"_ckb");
					var highGradeDivDom = UIUtil.getDiv({
						title : "选择高级用户"
					});
					var bpmnNodeDivDom = UIUtil.getDiv({
						title : "选择流程流转的节点"
					}).css("display","none");
					if(!(zNodes[i].codeKey == "hqbpmn_tranform" || zNodes[i].codeKey == "hqbpmn_reading" || zNodes[i].codeKey == "hqbpmn_tranformReading" || zNodes[i].codeKey == "hqbpmn_innerCountersign" || zNodes[i].codeKey == "hqbpmn_innerTranform")){
						if(zNodes[i].codeKey != "hqbpmn_toBeReturned"){
							buttonDomObj.hide();
						}
						if(!(zNodes[i].codeKey == "hqbpmn_toBeReturned" || zNodes[i].codeKey == "hqbpmn_toBeSupplement")){
							buttonDomObj.hide();
						}
						$("#"+zNodes[i].codeKey+"_radName").hide();
						$("#"+zNodes[i].codeKey+"_rad").hide();
					}
					checkboxDomObj.bind("change",{
						checkboxDomObj : checkboxDomObj
					},isChecked);
					//if(zNodes[i].codeKey == "hqbpmn_toBeReturned"){
					if(zNodes[i].codeKey == "hqbpmn_toBeReturned" || zNodes[i].codeKey == "hqbpmn_toBeSupplement"){
						buttonDomObj.on("click", {
							forDom : textDomObj,
							treeDialogDivDom : bpmnNodeDivDom,
							type : FlowConstant.DEPARTMENT_AND_ROLE_DATASOURCE_NAME,
							elementId : id
						}, FieldLookUp.showBpmnUserTaskNode);
					}else{
						buttonDomObj.on("click", {
							forDom : textDomObj,
							treeDialogDivDom : highGradeDivDom,
							type : FlowConstant.DEPARTMENT_AND_ROLE_DATASOURCE_NAME,
							elementId : id
						}, FieldLookUp.showDepartmentAndRoleLookUp);
					}*/
				}
				callShow();
			}
		});
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "relative",
			"top" : "20px",
			"left" : "200px",
			"width" : "200px"
		}).appendTo(treeDialogDivDom);
		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			type : type,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog(FlowConstant.DIAGRAMOPEN_SETTING);
		treeDialogDivDom.dialog("open");
		
		//配置完后确定按钮功能
		function confirm(event) {
			var customButtonDom =[];
			var treeLiDom = treeUlDom.find("li");
			if(treeLiDom.length > 0){
				$.each(treeLiDom, function(i,n){
					var isChecked = n.childNodes[0].checked;
					if(isChecked){
						//var buttonProcessorVal = "";
						var lunchType = null;
						if(undefined != n.childNodes[4].value && n.childNodes[4].value != ""){
							buttonProcessorVal = JSON.parse(n.childNodes[4].value);
						}
						if(n.childNodes[0].checked){
							lunchType = "1";
						}else{
							lunchType = "0";
						}
						//解决当自定义按钮的名称为空时，在业务中显示为空的问题,start
						if(n.childNodes[2].value == ""){
							n.childNodes[2].value = n.childNodes[2].defaultValue;
						}
						//end
						customButtonDom.push({
							buttonKey : n.childNodes[0].value,
							buttonName : n.childNodes[2].value,
							//buttonProcessor : buttonProcessorVal,
							buttonOrder : n.childNodes[5].value,
							lunchType : lunchType,
						});
					}
				});
			}
			var forDom = event.data.forDom;
			var jsoncustomButtonDom = JSON.stringify(customButtonDom);
			var jsoncustomButtonDomTemp = JSON.parse(jsoncustomButtonDom);
			if(typeof (jsoncustomButtonDomTemp)=="string"){
				jsoncustomButtonDom = jsoncustomButtonDomTemp;
			}
			forDom.attr("value", jsoncustomButtonDom);// 赋显示值
			forDom.trigger("change");
			closeLookupDialog(event);
		}
		// 关闭dialog对话框
		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}
		// 回显
		function callShow(){
			if(forDom.val() != ""){
				var valDom = JSON.parse(forDom.val());
				var treeLiDom = treeUlDom.find("li");
				$.each(valDom,function(i,n){
					if(n.buttonKey != ""){
						$.each(treeLiDom,function(j,k){
							if(k.childNodes[0].value == n.buttonKey){
								k.childNodes[0].checked = true;
								k.childNodes[2].value = n.buttonName;
								/*var jsonButtonProcessor = JSON.stringify(n.buttonProcessor);
								var jsonButtonProcessorTemp = JSON.parse(jsonButtonProcessor);
								if(typeof (jsonButtonProcessorTemp)=="string"){
									jsonButtonProcessor = jsonButtonProcessorTemp;
								}
								k.childNodes[4].value = jsonButtonProcessor;*/
								/*if(n.lunchType == "1"){
									k.childNodes[6].checked = true;
								}*/
								//$("#"+n.buttonKey+"_lab").show();
								//$("#"+n.buttonKey+"_order").show();
								if(n.buttonOrder == undefined){
									k.childNodes[5].value = "";
								}else{
									k.childNodes[5].value = n.buttonOrder;
								}
							}
						});
					}
				});
			}
		}
		// 判断复选框是否选中
		function isChecked(event){
			var checkboxDom = event.data.checkboxDomObj;
			var treeLiDom = treeUlDom.find("li");
			$.each(treeLiDom,function(i,n){
				if(n.childNodes[0].value == checkboxDom.val()){
					var isCheck = n.childNodes[0].checked;
					if(isCheck){
						$("#"+checkboxDom.val()+"_lab").show();
						$("#"+checkboxDom.val()+"_order").show();
					}else{
						$("#"+checkboxDom.val()+"_lab").hide();
						$("#"+checkboxDom.val()+"_order").attr("value","");
						$("#"+checkboxDom.val()+"_order").hide();  
					}
				}
			});
		}
	},
	
	/*
	 * 内置按钮的退回功能显示流程usertask节点id
	 */
	showBpmnUserTaskNode : function(event){
		var targetDialogDivDom = event.data.treeDialogDivDom;
		var forDom = event.data.forDom;
		targetDialogDivDom.dialog({
			height : 400,
			width : 600,
			onClose : function() {
				// 清空内容
				targetDialogDivDom.empty();// 清空内容
			}
		});
		targetDialogDivDom.css("overflow-y","auto").append(UIUtil.getUl({
			className : "ztree"
		}));
		var treeUlDom = targetDialogDivDom.find("ul");
		var nodes = _myflow.exportData().nodes;
		var foucsNodeId = _myflow.$focus;
		var flag = true;
		$.each(nodes,function(i,n){
			var treeLiDom = "";
			if(n.type=="StartEvent"&&flag){
				flag=false;
				treeLiDom = $("<li><input id='startevent_userTask_ckb' type='checkbox' value='startevent_userTask'/>"+ n.name +"</li>");
				treeUlDom.append(treeLiDom);
			}
			if(n.type=="UserTask"){
				if(i != foucsNodeId){
					treeLiDom = $("<li><input id='"+ i +"_ckb' type='checkbox' value='"+ i +"'/>"+ n.name +"</li>");
					treeUlDom.append(treeLiDom);
				}
			}
		});
		callShow();
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "relative",
			"top" : "20px",
			"left" : "200px",
			"width" : "200px"
		}).appendTo(targetDialogDivDom);
		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			forDom : forDom,
			treeUlDom : treeUlDom
		}, confirm);
		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			targetDialogDivDom : targetDialogDivDom
		}, closeLookupDialog);
		
		function confirm(event) {
			var treeLiDom = treeUlDom.find("li");
			var shoeValues = "";
			var values = "";
			if(treeLiDom.length > 0){
				$.each(treeLiDom, function(i,n){
					var isChecked = n.childNodes[0].checked;
					if(isChecked){
						if (values.length > 0) {
							values += ",";
							shoeValues += ",";
						}
						values += n.childNodes[0].value;
						shoeValues += n.childNodes[1].data;
					}
				});
			}
			data = [];
			data.push({
				taskKeys : values,
				taskKeyNames : shoeValues
			});
			var forDom = event.data.forDom;
			var jsonData = JSON.stringify(data);
			var jsonDataTemp = JSON.parse(jsonData);
			if(typeof (jsonDataTemp)=="string"){
				jsonData = jsonDataTemp;
			}
			forDom.attr("value", jsonData);// 赋显示值
			targetDialogDivDom.dialog("close");
		}
		// 关闭dialog对话框
		function closeLookupDialog(event) {
			event.data.targetDialogDivDom.dialog("close");
		}
		//回显
		function callShow(){
			if(forDom.val() != "" && forDom.val() != "\"\""){
				var valDom = JSON.parse(forDom.val());
				var taskKeys = valDom[0].taskKeys;
				var treeLiDom = treeUlDom.find("li");
				$.each(treeLiDom, function(i,n){
					if(taskKeys.indexOf(n.childNodes[0].value) >= 0){
						n.childNodes[0].checked = true;
					}
				});
			}
		}
	},
	/*
	 * 定制按钮回显功能刚加上
	 */
	showCustomButtonLookUp2 : function(event) {
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = null;
		url = basePath + "bpmnAction/templateDef/getCustomButton.do?tokenid="+tokenID;
		var treeDom = null;
		var zNodes = null;
		var setting = {
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
					checked : "checked",
					children : "children",
					name : "codeName",
					title : "",
					url : url
				},
				simpleData : {
					enable : true,
					idKey : "codeKey",
					pIdKey : "",
					rootPId : null
				}
			},
			async : {
				enable : true
			},
		};

		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			async : false,
			success : function(data) {
				// json格式转换成对象
				zNodes = data.result;
				 for(var i=0; i<zNodes.length; i++)
				  {
					 var treeLiDom = $("<li><input type='checkbox' value='"+zNodes[i].codeKey+"'/>&nbsp;"+ zNodes[i].codeName+"&nbsp;<input type='text' value='"+ zNodes[i].codeName+"'><input id='"+zNodes[i].codeKey+"_btn' type='button' value='设置'></li>");
					 treeUlDom.append(treeLiDom);
					 //zNodes[i].codeName= zNodes[i].codeKey+" " + zNodes[i].codeName;
					 var textDomObj = UIUtil.getTextarea_lookup({
							value : "",
							showValue : ""
						});
					 textDomObj.hide();
					 var buttonDomObj = $("#"+zNodes[i].codeKey+"_btn");
					 var treeDialogDivDom = UIUtil.getDiv({
						title : "选择高级用户"
					 });
					 var queryDivDom = null;
					 var trDom = null;
					 // 当类型为用户时追加查询区域
					 queryDivDom = UIUtil.getDiv({
						className : "gzl003"
					 }).appendTo(treeDialogDivDom);
					 var selectUserTdDom = UIUtil.getTd({}).css("width", "200px");
					 trDom = UIUtil.getTr({}).append(selectUserTdDom);
					 var tableDom = UIUtil.getTabel({}).append(trDom);
					 var treeUlDivDom = UIUtil.getDiv({}).append(tableDom);
					 treeDialogDivDom.append(tableDom);
					 treeDialogDivDom.appendTo($(document.body));
					 treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);
					 buttonDomObj.on("click", {
						forDom : textDomObj,
						treeDialogDivDom : treeDialogDivDom,
						queryDivDom : queryDivDom,
						trDom : trDom,
						type : FlowConstant.DEPARTMENT_AND_ROLE_DATASOURCE_NAME,
						elementId : id
					 }, FieldLookUp.showDepartmentAndRoleLookUp);
					 textDomObj.appendTo(treeLiDom);
				  }
				 callShow();
			}
		});
		// 用户选择的候选人
		var selectedUserTreeDom = null;
		var selectedUserDivDom = UIUtil.getDiv({});
		var id = treeUlDom.attr("id") + "OfselectedUser";
		var selectedUserUlDom = UIUtil.getUl({
			id : id,
			className : "ztree"
		}).appendTo(selectedUserDivDom);
		if (type == "customButton") {
			// 获取目前输入框中的值，在打开树窗口的时候设置已选中的节点
			var selectedIds = forDom.attr("realValue");
			if (selectedIds != undefined && selectedIds != ""
					&& selectedIds != "null") {
				var array = selectedIds.split(",");
				for (var i = 0; i < array.length; i++) {
					var selectNode = treeDom.getNodeByParam("codeKey", array[i],
							null);
					treeDom.checkNode(selectNode, true, true);
				}
			}
		} 
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "320px",
			"left" : "200px"
		}).appendTo(treeDialogDivDom);
		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			type : type,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		UIUtil.getButton({
			value : "清空"
		}).appendTo(buttonDivDom).on("click", {
			treeDom : treeDom,
			type : type,
			selectedUserTreeDom : selectedUserTreeDom
		}, empty);

		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		// 选择用户或者用户分组后点击确定按钮
		function confirm(event) {
			var customButtonDom =[];
			var treeLiDom = treeUlDom.find("li");
			if(treeLiDom.length > 0){
				$.each(treeLiDom, function(i,n){
					var isChecked = n.childNodes[0].checked;
					if(isChecked){
						customButtonDom.push({
							buttonKey : n.childNodes[0].value,
							buttonName : n.childNodes[2].value,
							buttonProcessor : JSON.parse(n.childNodes[4].value)
						});
					}
				});
			}
			var forDom = event.data.forDom;
			var jsoncustomButtonDom = JSON.stringify(customButtonDom);
			var jsoncustomButtonDomTemp = JSON.parse(jsoncustomButtonDom);
			if(typeof (jsoncustomButtonDomTemp)=="string"){
				jsoncustomButtonDom = jsoncustomButtonDomTemp;
			}
			forDom.attr("value", jsoncustomButtonDom);// 赋显示值
			forDom.trigger("change");
			closeLookupDialog(event);
		}

		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}

		// 清空所有复选框
		function empty(event) {
			var treeObj = event.data.treeDom;
			treeObj.checkAllNodes(false);
			
		}
		// 回显
		function callShow(){
			if(forDom.val() != ""){
				var valDom = JSON.parse(forDom.val());
				var treeLiDom = treeUlDom.find("li");
				$.each(valDom,function(i,n){
					if(n.buttonKey != ""){
						$.each(treeLiDom,function(j,k){
							if(k.childNodes[0].value == n.buttonKey){
								k.childNodes[0].checked = true;
								k.childNodes[2].value = n.buttonName;
							}
						});
					}
				});
			}
		}
	},
	showCustomButtonLookUp1 : function(event) {
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var queryDivDom = event.data.queryDivDom;
		var trDom = event.data.trDom;
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = null;
		url = basePath + "bpmnAction/templateDef/getCustomButton.do?tokenid="+tokenID;
		var treeDom = null;
		var zNodes = null;

		var setting = {
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
					checked : "checked",
					children : "children",
					name : "codeName",
					title : "",
					url : url
				},

				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "",
					rootPId : null
				}
			},
			async : {
				enable : true
			},
		};

		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			async : false,
			success : function(data) {
				// json格式转换成对象
				zNodes = data.result;
				for(var i=0; i<zNodes.length; i++)
				{
					 zNodes[i].codeName="["+ zNodes[i].codeKey+"] " + zNodes[i].codeName;
				}
				treeDom = $.fn.zTree.init(treeUlDom, setting, zNodes);
			}
		});

		if (type == "customButton") {
			// 获取目前输入框中的值，在打开树窗口的时候设置已选中的节点
			var selectedIds = forDom.attr("realValue");
			if (selectedIds != undefined && selectedIds != ""
					&& selectedIds != "null") {
				var array = selectedIds.split(",");
				for (var i = 0; i < array.length; i++) {
					var selectNode = treeDom.getNodeByParam("id", array[i],
							null);
					treeDom.checkNode(selectNode, true, true);
				}
			}else{
				
			}
		} else if (type == "candidateUser") {
			
			// 用户选择的候选人
			var selectedUserTreeDom = null;
			var selectedUserDivDom = UIUtil.getDiv({});
			var id = treeUlDom.attr("id") + "OfselectedUser";
			var selectedUserUlDom = UIUtil.getUl({
				id : id,
				className : "ztree"
			}).appendTo(selectedUserDivDom);

			// 判断当前候选人输入框区域总是否有值，如果有，需要回显信息
			var oldNodesArray = [];
			var showValueStr = $(forDom).attr("value");
			if (showValueStr != null && showValueStr != ""
					&& showValueStr != undefined) {
				var realValueStr = $(forDom).attr("realValue");
				var selectedTreeObj = {
					id : "",
					name : ""
				};
				var showValueArray = showValueStr.split(",");
				var realValueArray = realValueStr.split(",");
				for (var i = 0; i < showValueArray.length; i++) {
					selectedTreeObj.id = realValueArray[i];
					selectedTreeObj.name = showValueArray[i];
					oldNodesArray.push(selectedTreeObj);
					selectedTreeObj = {
						id : "",
						name : ""
					};
				}
				selectedUserTreeDom = $.fn.zTree.init(selectedUserUlDom,
						setting, eval(oldNodesArray));
			}
			var selectedUserTdDom = UIUtil.getTd({}).appendTo(trDom);
			// 没有ul的话才追加
			if (trDom.find("td").eq(2).find("ul").length == 0) {
				selectedUserDivDom.css({
					"position" : "absolute",
					"top" : "50px",
					"left" : "400px",
					"overflow" : "auto",
					"height" : "300px",
					"width" : "240px",
					"border" : "2px solid #84C1FF"
				}).appendTo(selectedUserTdDom);
			}
		}

		var buttonDivDom = null;

		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "320px",
			"left" : "200px"
		}).appendTo(treeDialogDivDom);

		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			type : type,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		;

		UIUtil.getButton({
			value : "清空"
		}).appendTo(buttonDivDom).on("click", {
			treeDom : treeDom,
			type : type,
			selectedUserTreeDom : selectedUserTreeDom
		}, empty);

		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		// 选择用户或者用户分组后点击确定按钮
		function confirm(event) {
			var forDom = event.data.forDom;
			var type = event.data.type;
			// 如果一个也没有选择，清空输入区域和隐藏input的值
			var treeObj = event.data.treeDom;
			var nodes = null;
			if (type == "customButton") {
				if (treeObj != null) {
					nodes = treeObj.getCheckedNodes(true);
				}
			} else if (type == "candidateUser") {
				if (selectedUserTreeDom != null) {
					nodes = selectedUserTreeDom.getNodes();
				}
			}
			var showValues = "";
			var values = "";
			if (nodes) {
				$(nodes).each(function(index, node) {
					if (showValues.length > 0) {
						showValues += ",";
						values += ",";
					}
					showValues += node.codeKey;
					values += node.id;
				});
			}
			forDom.attr("value", showValues);// 赋显示值
			forDom.attr("realValue", values);// 赋实际值
			forDom.trigger("change");

			closeLookupDialog(event);
		}

		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}

		// 清空所有复选框
		function empty(event) {
			var treeObj = event.data.treeDom;
			var type = event.data.type;
			var selectedUserTreeDom = event.data.selectedUserTreeDom;
			treeObj.checkAllNodes(false);
			if (type == "candidateUser") {
				if (selectedUserTreeDom != null) {
					selectedUserTreeDom.destroy();
				}
				selectedUserTreeDom = $.fn.zTree.init(selectedUserUlDom,
						setting, null);
			}
		}

	},
	// 显示权重
	showweightUp : function(event) {
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var queryDivDom = event.data.queryDivDom;
		var trDom = event.data.trDom;
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = null;
		if (type == "weight") {
			treeDialogDivDom.dialog({
				height : 500,
				width : 660,
				closed: true,
				onClose : function() {
					// 清空内容
					trDom.find("td").eq(0).find("ul").empty();
					trDom.find("td").eq(1).empty();
					trDom.find("td").eq(2).empty();
				}
			});
		}
		url = basePath + "bpmnAction/templateDef/findBpmnUserByGroupName.do?tokenid="+tokenID;
		var result = null;
		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			data : {
				"user" : $(this).parent().parent().prevAll().children().eq(1)
						.parent().parent().find("textarea").val(),
				"group" : $(this).parent().parent().prevAll().children().eq(1)
						.find("textarea").attr("realvalue")
			},
			async : false,
			success : function(data) { // json格式转换成对象
				zNodes = data.result;
				result = data.result;
			}
		});

		var treeDom = null;
		var zNodes = null;
		var setting = {
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
					checked : "checked",
					children : "children",
					name : "name",
					title : "",
					url : url
				},
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "",
					rootPId : null
				}
			},
			async : {
				enable : true
			},
		};
		// 用户选择的候选人
		var selectedUserTreeDom = null;
		var selectedUserDivDom = UIUtil.getDiv({});
		var id = treeUlDom.attr("id") + "OfselectedUser";
		var selectedUserUlDom = UIUtil.getUl({
			id : id,
			className : "ztree"
		}).appendTo(selectedUserDivDom);
		// 判断当前权重是否有值，如果有，需要回显信息
		var oldNodesArray = [];
		// 获取权重文本框的值
		var showValueStr = forDom.attr("value");
		if (showValueStr != null && showValueStr != ""
				&& showValueStr != undefined) {
			var obj = eval('(' + showValueStr + ')');
			var selectedTreeObj = {
				id : "",
				name : ""
			};
			for (var i = 0; i < obj.length; i++) {
				selectedTreeObj.id = obj[i].user;
				selectedTreeObj.name = obj[i].user + ":" + obj[i].userWeight;
				oldNodesArray.push(selectedTreeObj);
				selectedTreeObj = {
					id : "",
					name : ""
				};
			}
			selectedUserTreeDom = $.fn.zTree.init(selectedUserUlDom, setting,
					eval(oldNodesArray));

		}
		// 构造增加和移除按钮区域
		var buttonTdDom = UIUtil.getTd({}).appendTo(trDom);
		var addInput = UIUtil.getInput({
			id : "addWeight",
		}).css({
			"position" : "absolute",
			"top" : "145px",
			"left" : "310px",
			"width" : "40px",
		}).appendTo(trDom);
		if (trDom.find("td").eq(1).find("input").length == 0) {
			var buttonDivDom = UIUtil.getDiv({}).css({
				"position" : "absolute",
				"top" : "180px",
				"left" : "245px"
			}).appendTo(buttonTdDom);
			var addButtonDom = UIUtil.getButton({
				value : "增加->"
			}).css({
				"position" : "absolute",
				"top" : "10px",
				"left" : "50px",
				"width" : "45px"
			}).on("click", {
				selectedUserDivDom : selectedUserDivDom
			}, addUser).appendTo(buttonDivDom);
			var removeButtonDom = UIUtil.getButton({
				value : "<-移除"
			}).css({
				"position" : "absolute",
				"top" : "40px",
				"left" : "50px",
				"width" : "45px"
			}).on("click", {}, removeUser).appendTo(buttonDivDom);
			var selectedUserTdDom = UIUtil.getTd({}).appendTo(trDom);
			// 没有ul的话才追加
			if (trDom.find("td").eq(2).find("ul").length == 0) {
				selectedUserDivDom.css({
					"position" : "absolute",
					"top" : "50px",
					"left" : "400px",
					"overflow" : "auto",
					"height" : "300px",
					"width" : "240px",
					"border" : "2px solid #84C1FF"
				}).appendTo(selectedUserTdDom);
			}
		}
		var oldNodesArray = [];
		var showValueStr = result.toString();
		if (showValueStr != null && showValueStr != ""
				&& showValueStr != undefined) {
			var realValueStr = showValueStr;
			var selectedTreeObj = {
				id : "",
				name : ""
			};
			var showValueArray = showValueStr.split(",");
			var realValueArray = realValueStr.split(",");
			for (var i = 0; i < showValueArray.length; i++) {
				selectedTreeObj.id = realValueArray[i];
				selectedTreeObj.name = showValueArray[i];
				oldNodesArray.push(selectedTreeObj);
				selectedTreeObj = {
					id : "",
					name : ""
				};
			}
			treeDom = $.fn.zTree.init(treeUlDom, setting, eval(oldNodesArray));
		}
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "360px",
			"left" : "200px"
		}).appendTo(treeDialogDivDom);

		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom,
			type : type,
			forDom : forDom,
			treeDom : treeDom
		}, confirm);
		;

		UIUtil.getButton({
			value : "清空"
		}).appendTo(buttonDivDom).on("click", {
			treeDom : treeDom,
			type : type,
			selectedUserTreeDom : selectedUserTreeDom
		}, empty);

		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		// 增加用户
		function addUser(event) {
			var nodes = treeDom.getCheckedNodes(true);
			if (nodes.length == 0) {
				alert("没有选择任何会签用户！");
				return;
			}
			var addWeightVal = $("#addWeight").val();
			if (addWeightVal == "") {
				alert("没有为选择的任何会签用户分配权重！");
				return;
			}

			for (var i = 0, length = nodes.length; i < length; i++) {
				nodes[i].checked = false;
				nodes[i].name = nodes[i].name + ":" + addWeightVal;
			}
			var selectedUserDivDom = event.data.selectedUserDivDom;
			var userTreeUlDom = selectedUserDivDom.find("ul");
			if (selectedUserTreeDom == null || selectedUserTreeDom == undefined) {
				selectedUserTreeDom = $.fn.zTree.init(userTreeUlDom, setting,
						nodes);
			} else {
				var existNodes = selectedUserTreeDom.getNodes();
				// 右树中删除重复数据
				for (var i = 0; i < nodes.length; i++) {
					var id = nodes[i].id;
					var node = selectedUserTreeDom.getNodeByParam("id", id,
							null);
					if (node != undefined) {
						selectedUserTreeDom.removeNode(node);
					}
				}
				selectedUserTreeDom.addNodes(null, nodes);
			}
		}

		// 移除用户
		function removeUser(event) {
			if (selectedUserTreeDom != null) {
				var selectedNodes = selectedUserTreeDom.getCheckedNodes(true);
				if (selectedNodes.length == 0) {
					alert("至少选择一个会签用户权重");
					return;
				}
				for (var i = 0, length = selectedNodes.length; i < length; i++) {
					var node = selectedUserTreeDom.getNodeByParam("id",
							selectedNodes[i].id, null);
					selectedUserTreeDom.removeNode(node);
					// 移除的时候同时需要设置左边的用户选择树中这个节点的checkbox去勾选
					var leftNode = treeDom.getNodeByParam("id",
							selectedNodes[i].id, null);
					if (leftNode != null) {
						leftNode.checked = false;
						treeDom.updateNode(leftNode);
					}
				}
			} else {
				alert("至少选择一个会签用户权重");
				return;
			}
		}

		// 选择用户或者用户分组后点击确定按钮
		function confirm(event) {
			var forDom = event.data.forDom;
			var type = event.data.type;
			// 如果一个也没有选择，清空输入区域和隐藏input的值
			var treeObj = event.data.treeDom;
			var nodes = null;
			if (selectedUserTreeDom != null) {
				nodes = selectedUserTreeDom.getNodes();
			}
			var data = [];
			if (nodes) {
				$(nodes).each(function(index, node) {

					var row = {};
					row.user = node.name.split(":")[0];
					row.userWeight = node.name.split(":")[1];
					data.push(row);
				});
			}
			if (data.length == 0) {
				forDom.attr("value", "");// 赋显示值
				forDom.attr("realValue", "");// 赋实际值
				forDom.trigger("change");
				closeLookupDialog(event);
			} else {
				var jsonData = JSON.stringify(data);
				var jsonDataTemp = JSON.parse(jsonData);
				if(typeof (jsonDataTemp)=="string"){
					jsonData = jsonDataTemp;
				}
				forDom.attr("value", jsonData);// 赋显示值
				forDom.attr("realValue", jsonData);// 赋实际值
				forDom.trigger("change");
				closeLookupDialog(event);
			}

		}

		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}
		// 清空所有复选框
		function empty(event) {
			var treeObj = event.data.treeDom;
			var type = event.data.type;
			var selectedUserTreeDom = event.data.selectedUserTreeDom;
			treeObj.checkAllNodes(false);
			if (type == "candidateUser") {
				if (selectedUserTreeDom != null) {
					selectedUserTreeDom.destroy();
				}
				selectedUserTreeDom = $.fn.zTree.init(selectedUserUlDom,
						setting, null);
			}
		}
	},
	showExcutionListenerLookUp : function(event) {
		var forDom = event.data.forDom;
		var dialogDivDom = event.data.dialogDivDom;
		var id = event.data.id;
		var idIndex = event.data.idIndex;
		var changeType = event.data.changeType;
		var listenerType = event.data.listenerType;

		var idValue = "";
		var event = "";
		var type = "";
		var listenerImplementation = "";
		var field = [];
		var orderId = "";

		var rowId = null;
		if (changeType == "modify") {
			rowId=forDom.datagrid('getSelected');
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			idValue = rowId.id;
			event = rowId.event;
			type = rowId.type;
			listenerImplementation = rowId.listenerImplementation;
			field = eval(rowId.field);
			orderId = rowId.orderId;
		} else if (changeType == "delete") {
			rowId=forDom.datagrid('getSelected');
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			var r = confirm("是否删除?");
			if (r) {
				var index = forDom.datagrid('getRowIndex', rowId);  
				forDom.datagrid('deleteRow', index);
				forDom.trigger("change", {
					changeType : changeType,
					rowId : rowId,
					//解决业务驱动不能删除监听的问题start
					//idIndex : idIndex
					idIndex : rowId.id
					//解决业务驱动不能删除监听的问题end
				});
			}
			return;
		}
		
		var tableDomObj = UIUtil.getTabel({}).appendTo(
				dialogDivDom);
		dialogDivDom.dialog(FlowConstant.DIAGRAMOPEN_SETTING);

		var trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		var tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "事件"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var options = {};
		if (listenerType == FlowConstant.NODE_EXCUTION_LISTENER_DATASOURCE_NAME) {
			options = {
				start : "start",
				end : "end"
			};
		} else if (listenerType == FlowConstant.TASK_LISTENER_DATASOURCE_NAME) {
			options = {
				create : "create",
				assignment : "assignment",
				complete : "complete",
				all : "all"
			};
		} else if (listenerType == FlowConstant.Line_EXCUTION_LISTENER_DATASOURCE_NAME) {
			options = {
				take : "take"
			};
		}
		var eventDomObj = UIUtil.getSelect({
			options : options,
			value : event
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "类型"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "Java类"
		}).appendTo(tdDomObj);
		UIUtil.getRadio({
			name : "style",
			value : "class",
			checked : type == "class" ? true : false
		}).appendTo(tdDomObj);
		UIUtil.getLabel({
			label : "代理表达式"
		}).appendTo(tdDomObj);
		UIUtil.getRadio({
			name : "style",
			value : "delegateExpression",
			checked : type == "delegateExpression" ? true : false
		}).appendTo(tdDomObj);
		dialogDivDom.find("[type=radio]").css({
			"margin-left" : "5px",
			"margin-right" : "15px"
		});

		/*
		 * 配置方式实现监听实现的下拉列表框
		 */
		var listenerImplementObj = null;
		if (listenerType == FlowConstant.TASK_LISTENER_DATASOURCE_NAME) {
			listenerImplementObj = FlowDict.TaskListenerImpl;
		} else if (listenerType == FlowConstant.Line_EXCUTION_LISTENER_DATASOURCE_NAME
				|| listenerType == FlowConstant.NODE_EXCUTION_LISTENER_DATASOURCE_NAME) {
			listenerImplementObj = FlowDict.ExecutionListenerImpl;
		}
		var trObj = DefinationProperty.newObject({
			targetDomObj : $("#divProperty")
			//解决因修改发起人的界面时导致监听的配置页面显示异常的问题
		}).rendInfo("", "", "", "", "",listenerImplementObj, "", "assignment");
		trObj.appendTo(tableDomObj);
		var listenerImplementationDomObj = trObj.find("select");
		var ops = listenerImplementationDomObj.find("option");
		for (var i = 0; i < ops.length; i++) {
			if (ops[i].value == listenerImplementation) {
				ops[i].selected = true;
				break;
			}
		}
		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "顺序"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var orderIdDomObj = UIUtil.getInput({
			value : orderId
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "字段"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var fieldInfoTableDomObj = UIUtil.getTabel({
			id : id + "_field_infor_table"
		}).css({
			width : "98%"
		}).appendTo(tdDomObj);
		fieldInfoTableDomObj.datagrid({
			width : parseInt(fieldInfoTableDomObj.css("width")),
			height : 130,
			data : field,
			fitColumns:true,
			singleSelect : true,
			columns :[[
			           	{ field: 'id', title: 'ID',index : 'id', width: 50, key : true,hidden : false },
			           	{ field: 'fieldName', title: '字段名',index : 'fieldName', width: 32 }, 
			           	{ field: 'stringValue', title: '字符串值',index : 'stringValue', width: 32 },
			           	{ field: 'expression', title: '表达式',index : 'expression', width: 100 }
			         ]]
		});
		var fieldExtenionDialogDivDom = UIUtil.getDiv({
			title : "字段扩展信息",
			css : {
				display : "none"
			}
		});
		fieldExtenionDialogDivDom.appendTo(forDom).dialog(
				FlowConstant.DIAGRAM_SETTING);
		UIUtil.getButton({
			value : "删除"
		}).css({
			"float" : "right",
			"margin-top" : "5px",
			"margin-right" : "10px"
		}).appendTo(tdDomObj).on("click", {
			forDom : fieldInfoTableDomObj,
			changeType : "delete"
		}, FieldLookUp.showFieldExtenionLookUp);
		UIUtil.getButton({
			value : "修改"
		}).css({
			"float" : "right",
			"margin-top" : "5px"
		}).appendTo(tdDomObj).on("click", {
			forDom : fieldInfoTableDomObj,
			dialogDivDom : fieldExtenionDialogDivDom,
			changeType : "modify"
		}, FieldLookUp.showFieldExtenionLookUp);
		UIUtil.getButton({
			value : "新增"
		}).css({
			"float" : "right",
			"margin-top" : "5px"
		}).appendTo(tdDomObj).on("click", {
			forDom : fieldInfoTableDomObj,
			dialogDivDom : fieldExtenionDialogDivDom,
			changeType : "add"
		}, FieldLookUp.showFieldExtenionLookUp);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);

		UIUtil.getButton({
			value : "确定"
		}).appendTo(tdDomObj).on(
				"click",
				{},
				function(event) {
					var jsonfieldInfoTableDomObj = JSON.stringify(fieldInfoTableDomObj
							.datagrid("getRows"));
					var jsonfieldInfoTableDomObjTemp = JSON.parse(jsonfieldInfoTableDomObj);
					if(typeof (jsonfieldInfoTableDomObjTemp)=="string"){
						jsonfieldInfoTableDomObj = jsonfieldInfoTableDomObjTemp;
					}
					var changeData = {
						id : idValue,
						event : eventDomObj.val(),
						type : dialogDivDom.find("[type=radio]:checked").val(),
						listenerImplementation : listenerImplementationDomObj
								.val(),
						field : jsonfieldInfoTableDomObj,
						orderId : orderIdDomObj.val()

					};
					if (changeType == "add") {
//						var rowIds = forDom.datagrid('getDataIDs');
						var rowIds = forDom.datagrid('getRows');
						var newId = "newId_0";
						var maxNewNumber = -1;
						var newNumber;
						$(rowIds).each(function(iddex, rowId) {
							if (rowId.id.indexOf("newId_") > -1) {
								newNumber = parseInt(rowId.id.substring(6));
								if (newNumber > maxNewNumber) {
									maxNewNumber = newNumber;
								}
							}
						});
						if (maxNewNumber > -1) {
							newId = "newId_" + (maxNewNumber + 1);
						}
						changeData.id = newId;
						forDom.datagrid("appendRow", changeData);
					} else if (changeType == "modify") {
						var index = forDom.datagrid('getRowIndex', rowId); 
						forDom.datagrid("updateRow",{
							index: index,
							row: changeData
						});
					}
					setTimeout(forDom.trigger("change", {
						changeType : changeType,
						changeData : changeData,
						idIndex : idIndex
					}),1000);
					
					dialogDivDom.dialog("close");
				});
		UIUtil.getButton({
			value : "取消"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			dialogDivDom.dialog("close");
		});

	},
	showFieldExtenionLookUp : function(event) {
		var forDom = event.data.forDom;
		var dialogDivDom = event.data.dialogDivDom;
		var changeType = event.data.changeType;

		var fieldName = "";
		var stringValue = "";
		var expression = "";
		var rowId = null;
		if (changeType == "modify") {
			rowId=forDom.datagrid('getSelected');
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			fieldName = rowId.fieldName;
			stringValue = rowId.stringValue;
			expression = rowId.expression;
		} else if (changeType == "delete") {
//			rowId = forDom.datagrid("getGridParam", "selrow");
			rowId=forDom.datagrid('getSelected');
			if (!rowId) {
				alert("请选择一条记录!");
				return;
			}
			var r = confirm("是否删除?");
			if (r) {
//				forDom.jqGrid("delRowData", rowId);
				var index = forDom.datagrid('getRowIndex', rowId);  
				forDom.datagrid('deleteRow', index);
			}
			return;
		}
		var tableDomObj = UIUtil.getTabel({}).css("width", "100%");
		dialogDivDom.dialog("open").dialog({
			closed : false,
			onClose : function() {
				tableDomObj.empty();// 清空内容
			}
		});

		tableDomObj.appendTo(
				dialogDivDom);

		var trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		var tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "字段名"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var fieldNameDomObj = UIUtil.getInput({
			value : fieldName
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "字符串值"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var stringValueDomObj = UIUtil.getInput({
			style : "width:95%",
			value : stringValue
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		UIUtil.getLabel({
			label : "表达式"
		}).appendTo(tdDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		var expressionDomOjb = UIUtil.getTextarea({
			value : expression
		}).css({
			width : "95%",
			height : "85px"
		}).appendTo(tdDomObj);

		trDomObj = UIUtil.getTr().appendTo(tableDomObj);
		tdDomObj = UIUtil.getTd({
			"className" : "gzl007"
		}).appendTo(trDomObj);
		tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
		UIUtil.getButton({
			value : "确定"
		}).css({
			"margin-top" : "5px"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			var changeData = {
				fieldName : fieldNameDomObj.val(),
				stringValue : stringValueDomObj.val(),
				expression : expressionDomOjb.val()
			};
			if (changeType == "add") {
				var rowIds = forDom.datagrid('getRows');
				var newId = "newId_0";
				var maxNewNumber = -1;
				var newNumber;
				$(rowIds).each(function(iddex, rowId) {
					if (rowId.id.indexOf("newId_") > -1) {
						newNumber = parseInt(rowId.id.substring(6));
						if (newNumber > maxNewNumber) {
							maxNewNumber = newNumber;
						}
					}
				});
				if (maxNewNumber > -1) {
					newId = "newId_" + (maxNewNumber + 1);
				}
				changeData.id = newId;
				forDom.datagrid("appendRow", changeData);
			} else if (changeType == "modify") {
				var index = forDom.datagrid('getRowIndex', rowId); 
				forDom.datagrid('updateRow',{
					index: index,
					row: changeData
				});
			}
			dialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).css({
			"margin-top" : "5px"
		}).appendTo(tdDomObj).on("click", {}, function(event) {
			dialogDivDom.dialog("close");
		});
	},
	showCandidationLookUp : function(event) {
		var forDom = event.data.forDom;
		var dialogDivDom = event.data.dialogDivDom;
		var id = event.data.id;
		var elementId = event.data.elementId;
		var varDeptAndRole = [];// 部门与角色变量
		var variableDatas = [];// 条件中的所有数据
		varTableIdAndFields = [];// 绑定表单数据
		var tableIdsStr = _myflow.exportData().diagram.bpmn.bpmnBusinessForms;
		var tableIdNamesStr= _myflow.exportData().diagram.bpmn.bpmnBusinessFormsShowValue;
		var tableNamesStr= _myflow.exportData().diagram.bpmn.bpmnBusinessFormsTableName;
		if(tableIdsStr != undefined && tableIdsStr != "" && tableIdsStr != "null"){
			var tableIds = tableIdsStr.split(",");
			var tableIdNames = tableIdNamesStr.split(",");
			var tableNames = tableNamesStr.split(",");
			if(tableIds.length > 0){
				for (var i=0;i<tableIds.length ;i++ ) {
					varTableIdAndFields.push({
						id : "#",
						processDefinitionId : "",
						showName : tableIdNames[i],
						name : tableIds[i],
						type : "string"
					});
					$.ajax({
						url:basePath+"bpmnAction/templateDef/findFieldByTableId.do?tokenid="+tokenID,
						type:"POST",
						data:"tableId=" + tableIds[i],
						dataType:"json",
						async:false,
						success:function(pr, textStatus) {
							debugger;
							fields = pr.result;
							if(fields.length > 0){
								for (var j = 0; j < fields.length; j++) { 
									varTableIdAndFields.push({
										id : tableIds[i],
										processDefinitionId : "",
										showName : fields[j].name,
										name : tableNames[i]+"H___Q"+fields[j].dbName+"H___Q",
										type : "string"
									});
								}
							}
						}
					});	
				}
			}
		}
		varDeptAndRole.unshift({
			id : "",
			processDefinitionId : "",
			showName : "上一步处理人部门",
			name : "prevTransactorDept",
			type : "string"
		},{
			id : "",
			processDefinitionId : "",
			showName : "上一步处理人角色",
			name : "prevTransactorRole",
			type : "string"
		});
		var variables = _myflow.exportData().diagram.variable.variable;// 参数池数据
		variableDatas.push(variables);
		variableDatas.push(varDeptAndRole);

		//***********************
		var value = forDom.attr("value");
		if(value != "" && value!= "undefined" ){
		var valueAnd=value.split(" and ");
		for(var i = 0;i < valueAnd.length;i++){
		var valueOr=valueAnd[i].split(" or ");
		for (var m = 0;m < valueOr.length;m++){
		var start1 = 0;
		var end;
		for(var k = 0;k < valueOr[m].length;k++){
			var char = valueOr[m][k];
			var showId;
			if(char == "=" || (char == "!" && valueOr[m][k+1] == "=")  || char == "<" || char == ">"){
				if((char == "!" && valueOr[m][k+1] == "=")){
					end = valueOr[m].lastIndexOf(char);
				}else{
					end = valueOr[m].indexOf(char);
				}
				if(valueOr[m].indexOf("(") >= 0){
					start1= valueOr[m].lastIndexOf("(") + 1;
				}
				showId = valueOr[m].substring(start1,end);
				if(showId.indexOf("!") >= 0){
					showId = showId.substring(showId.lastIndexOf("!")+1,showId.length);
				}
				if(showId.indexOf(" ") == 0 ||showId.lastIndexOf(" ") >= 0){
					showId = showId.replace(/(^\s*)|(\s*$)/g, "");
				}
				break;
			}
				}
		if(showId.indexOf("H___Q") > 0){
		var fieldName=showId.split("H___Q");
		if(fieldName.length == 5){
		var treeNodeName=fieldName[0]+"H___Q"+fieldName[1]+"H___Q";
		for(var x in varTableIdAndFields)
		{
		if(varTableIdAndFields[x]["name"]==treeNodeName){
			var id=varTableIdAndFields[x]["id"];
			getTableFiled(fieldName,id,treeNodeName);
			break;
						}
					}
				}
			}
		}
	}
		}
		varTableIdAndFields.sort(by('name'));
		variableDatas.push(varTableIdAndFields);
		//***********************

		var operates = [{
			text : "大于",
			"value" : ">"
		}, {
			text : "不小于",
			"value" : ">="
		}, {
			text : "小于",
			"value" : "<"
		}, {
			text : "不大于",
			"value" : "<="
		}, {
			text : "等于",
			"value" : "=="
		}, {
			text : "不等于",
			"value" : "!="
		}, {
			text : "且",
			"value" : " and "
		}, {
			text : "或",
			"value" : " or "
		}, {
			text : "非",
			"value" : "!"
		}, {
			text : "左括号",
			"value" : "("
		}, {
			text : "右括号",
			"value" : ")"
		}, {
			text : "'",
			"value" : "'"
		} ];// 操作按钮

		var lookUpDivDom = FieldLookUp.getLookUpDivDom(variableDatas, operates,
				forDom.attr("value"), id);
		lookUpDivDom.css("width", "100%").appendTo(dialogDivDom);

		UIUtil.getButton({
			value : "确定"
		}).css({
			"margin-left" : "350px",
			"margin-top" : "20px"
		}).appendTo(dialogDivDom).on("click", {}, function(event) {
			var contentDom = $(lookUpDivDom.find("textarea")[0]);
			var englishExpression=translationExpression(contentDom.val(),"c");
			if(/.*[\u4e00-\u9fa5]+.*$/.test(englishExpression) || englishExpression.indexOf("undefined") > 0){
				alert("翻译失败，请检查表达式！\n"+englishExpression);
			}else{
			forDom.attr("value", englishExpression);// 赋显示值
			forDom.trigger("change");
			dialogDivDom.dialog("close");
			}
		});

		UIUtil.getButton({
			value : "取消"
		}).css({
			"position" : "absolute",
			"margin-left" : "20px",
			"margin-top" : "20px"
		}).appendTo(dialogDivDom).on("click", {}, function(event) {
			dialogDivDom.dialog("close");
		});
		
		UIUtil.getButton({
			value : "翻译表达式"
		}).css({
			"position" : "absolute",
			"margin-left" : "80px",
			"margin-top" : "20px"
		}).appendTo(dialogDivDom).on("click", {}, function(event) {
			var contentDom = $(lookUpDivDom.find("textarea")[0]).val();
			var tempValue=translationExpression(contentDom,"c");
			if((/.*[\u4e00-\u9fa5]+.*$/.test(tempValue)) || tempValue.indexOf("undefined") > 0){
				alert("翻译失败，请检查表达式！\n"+tempValue);
			}else{
			alert("${"+tempValue+"}");}});
		//dialogDivDom.dialog(FlowConstant.DIAGRAMOPEN_SETTING);
		dialogDivDom.dialog({
			height : 600,
			width : 900,
			modal : true,
			resizable : false,
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
			onClose : function() {
				$(this).empty();// 清空内容
			}
		});
	},
	getLookUpDivDom : function(variableDatas, operates, value, treeId) {
		var lookUpDivDom = UIUtil.getDiv({});
		var variableRangeDivDom = UIUtil.getDiv({}).css("height","30%");// 值区域
		var contentDivDom = UIUtil.getDiv({}).css("margin-top","20px");// 输入框DIV
		var textAreaDom = UIUtil.getTextarea({
			value : value
		}).css("font-size", "12px").css("resize", "none").css("width", "95%")
				.css("height", "440px").appendTo(contentDivDom);// 渲染输入框
		var variableDivDom = null;
		if (variableDatas) {
			variableDivDom = UIUtil.getDiv({id:"variableDivDom"});// 参数池DIV
			var variableTreeUl;
			var setting = {
				data : {

					key : {
						children : "children",
						name : "showName",
						title : "type",
					},
					simpleData : {
						enable : true,
						idKey : "name",
						pIdKey : "id",
						rootPId : null
					}
//					key : {
//						name : "showName",// 显示值
//						title : "type", // 鼠标悬浮提示信息
//					},
//					simpleData : {
//						enable : true,
//						idKey : "name",
//						pIdKey : "",
//						rootPId : null
//					}
				},
				callback : {
					onClick : zTreeOnClickS,
					onDblClick : zTreeOnClickDb
				}
			};
			$(variableDatas).each(function(index, variableData) {
				variableTreeUl = UIUtil.getUl({
					id : treeId + "_" + index,
					className : "ztree"
				}).appendTo(variableDivDom);		
				//解决oa变量池添加便利，再去配置线上条件时，线上条件配置页面无法打开的问题start
				//$.fn.zTree.init(variableTreeUl, setting, variableData=="[]"?"":variableData);
				$.fn.zTree.init(variableTreeUl, setting, variableData=="[]"?"":eval(variableData));
				//解决oa变量池添加便利，再去配置线上条件时，线上条件配置页面无法打开的问题start
			});
		}
		var operatesDivDom = null;
		if (operates) {
			operatesDivDom = UIUtil.getDiv({
				css : {
					"margin-top" : "10px"
				}
			});// 操作按钮DIV
			var operateBtnDom;
			$(operates).each(function(index, operate) {
				operateBtnDom = UIUtil.getButton({
					value : operate.text,
					className : "condidationOperateBtn"
				}).css("font-size", "12px").appendTo(operatesDivDom);
				operateBtnDom.on("click", function(event) {
					FieldLookUp.insertAtCursor(textAreaDom[0], operate.value);
				});
			});

		}
		setLayout(lookUpDivDom, {
			variableRangeDiv : variableRangeDivDom,
			rightCenterDiv : contentDivDom,
			variableDivDom : variableDivDom,
			rightBottomDiv : operatesDivDom
		});
		return lookUpDivDom;
		//ztree单击回调
		var TimeFn = null;
		function zTreeOnClickS(event, treeId, treeNode){
		    // 取消上次延时未执行的方法
		    clearTimeout(TimeFn);
		    //执行延时
		    TimeFn = setTimeout(function(){
		    	zTreeOnClick(event, treeId, treeNode,1);
		    },500);	
		}
		//ztree双击回调
		function zTreeOnClickDb(event, treeId, treeNode){
		    // 取消上次延时未执行的方法
		    clearTimeout(TimeFn);
		    zTreeOnClick(event, treeId, treeNode,2);
		}
		//ztree回调   clickType=1 单击;clickType=2双击
		function zTreeOnClick(event, treeId, treeNode,clickType) {
			// 点击的时候，初始化值变量池值域tree
			variableRangeDivDom.empty();
			if(treeNode.name == "prevTransactorRole" || treeNode.name == "prevTransactorDept"){  //角色
				var typeValue = "";
				if(treeNode.name == "prevTransactorDept"){
					typeValue = "1";
				}else{
					typeValue = "2";
				}
				$.ajax({
					url : basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province,
					type : "post",
					dataType : "json",
					data : {
						"type": typeValue,
					},
					async : false,
					success : function(pr, textStatus) { // json格式转换成对象
							var data = pr.result;
							if (data.length != 0) {
								var roleTempObj = [];
								$(data).each(function(t2,n){
									roleTempObj.push({
										codeName : n.name,
										codeKey : n.id,
										pId : n.pId,
										type : n.type
									});
								});
								initVariableRangeTree(roleTempObj);
						} else {
							return;
						}
					}
				});
				var cName=treeNode.showName;
			}else{
				$.ajax({
					url : basePath + "bpmnAction/templateCode/findVariableRangeByType.do?tokenid="+tokenID,
					type : "POST",
					data : "codeType=" + treeNode.name + "&bpmnType=" + _myflow.$bpmnType,
					dataType : "json",
					async : false,
					success : function(pr, textStatus) {
						if (pr.success) {
							var data = pr.result;
							if (data.length != 0) {
								initVariableRangeTree(data);
							}
						} else {
							return;
						}
					}
				});
				var oldlength=varTableIdAndFields.length;
				if(treeNode.level==1&&!treeNode.isParent&&clickType==2){
					var fieldName=treeNode.name.split("H___Q");
					var id=treeNode.id;
					var treeNodeName=treeNode.name;
					getTableFiled(fieldName,id,treeNodeName);
					}
				if(treeNode.name.split("H___Q").length>=3){
					var cName="["+treeNode.getParentNode().showName+"]"+treeNode.showName;
				}else{
					var cName=treeNode.showName;
		       	}
	       	}
			var newlength=varTableIdAndFields.length;
			if(oldlength !== newlength){
				oncliclRefreshTree();
				var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
				zTreeObj.expandNode(treeNode.getParentNode(),true,false,true);
			}
			if(!treeNode.isParent&&clickType==1){
			FieldLookUp.insertAtCursor(textAreaDom[0], cName);
			}
		}
		//刷新变量树
		function oncliclRefreshTree(){
			var variableDatas = [];
			var varDeptAndRole = [];// 部门与角色变量
			var variables = _myflow.exportData().diagram.variable.variable;// 参数池数据
			variableDatas.push(variables);
			varDeptAndRole.unshift({
				id : "",
				processDefinitionId : "",
				showName : "上一步处理人部门",
				name : "prevTransactorDept",
				type : "string"
			},{
				id : "",
				processDefinitionId : "",
				showName : "上一步处理人角色",
				name : "prevTransactorRole",
				type : "string"
			});
			varTableIdAndFields.sort(by('name'));
			variableDatas.push(varDeptAndRole);
			variableDatas.push(varTableIdAndFields);
			var variableDivDom = document.getElementById('variableDivDom');
			if (variableDatas) {
				var newvariableTreeUl;
				var setting = {
					data : {
						key : {
							children : "children",
							name : "showName",
							title : "type",
						},
						simpleData : {
							enable : true,
							idKey : "name",
							pIdKey : "id",
							rootPId : null
						}
					},
					callback : {
						onClick : zTreeOnClickS,
						onDblClick : zTreeOnClickDb
					}
				};
				$("#variableDivDom").empty();
				$(variableDatas).each(function(index, variableData) {
					newvariableTreeUl = UIUtil.getUl({
						id : treeId + "_" + index,
						className : "ztree"
					}).appendTo(variableDivDom);		
					$.fn.zTree.init(newvariableTreeUl, setting, variableData=="[]"?"":eval(variableData));
				});
			}
		}
		function initVariableRangeTree(data) {
			var setting = {
				data : {

					key : {
						children : "children",
						name : "codeName",
						title : "type",
					},
					simpleData : {
						enable : true,
						idKey : "codeKey",
						pIdKey : "pId",
						rootPId : null
					}
//					key : {
//						name : "codeName",// 显示值
//						title : "type", // 鼠标悬浮提示信息
//					},
//					simpleData : {
//						enable : true,
//						idKey : "codeKey",
//						pIdKey : "",
//						rootPId : null
//					}
				},
				callback : {
					onClick : variableRangeTreeOnClick
				}
			};
			var valueTreeUl = UIUtil.getUl({
				id : "variableRangeTree",
				className : "ztree"
			}).appendTo(variableRangeDivDom);
			$.fn.zTree.init(valueTreeUl, setting, data);
		}

		function variableRangeTreeOnClick(event, treeId, treeNode) {
			FieldLookUp.insertAtCursor(textAreaDom[0], treeNode.codeKey);
		}
		function setLayout(targetDiv, divs) {
			var leftDiv = UIUtil.getDiv({});
			leftDiv.css("float", "left").css("width", "25%", "height", "100%")
					.appendTo(targetDiv);
			if (divs.variableDivDom) {
				UIUtil.getDiv({
					text : "变量："
				}).css("height", "20px").appendTo(leftDiv);
				divs.variableDivDom.css({
					"overflow" : "auto",
					"width" : "100%",
					"height" : "250px",
					"border" : "2px solid #84C1FF"
				}).appendTo(leftDiv);
				UIUtil.getDiv({
					text : "变量值域："
				}).css("height", "20px").appendTo(leftDiv);
			}
			if (divs.variableRangeDiv) {
				divs.variableRangeDiv.css({
					"overflow" : "auto",
					"width" : "100%",
					"height" : "200px",
					"border" : "2px solid #84C1FF"
				}).appendTo(leftDiv);
			}

			var rightDiv = UIUtil.getDiv({}).appendTo(targetDiv);
			rightDiv.css("float", "right").css("width", "73%").css("height",
					"100%");

			var rightCenterDiv = divs.rightCenterDiv;
			rightCenterDiv.css("width", "100%").css("height", "440px").appendTo(
					rightDiv);
			if (divs.rightBottomDiv) {
				var rightBottomDiv = divs.rightBottomDiv;
				rightBottomDiv.appendTo(rightDiv);
			}
			var contentDom = $(lookUpDivDom.find("textarea")[0]).val();
			var tempValue=translationExpression(contentDom,"e");
			$(lookUpDivDom.find("textarea")[0]).val(tempValue);
		}
	},
	
	insertAtCursor : function(taregetField, insertValue) {
		
		//$(window.top.document).find("#corp-tree").tree('reload');
		if (document.selection) {// IE support
			taregetField.focus();
			sel = document.selection.createRange();
			sel.text = insertValue;
			sel.select();
		} else if (taregetField.selectionStart
				|| taregetField.selectionStart == '0') {// MOZILLA/NETSCAPE
			// support
			var startPos = taregetField.selectionStart;
			var endPos = taregetField.selectionEnd;
			// save scrollTop before insert
			var restoreTop = taregetField.scrollTop;
			taregetField.value = taregetField.value.substring(0, startPos)
					+ insertValue
					+ taregetField.value.substring(endPos,
							taregetField.value.length);
			if (restoreTop > 0) {
				// restore previous scrollTop
				taregetField.scrollTop = restoreTop;
			}
			taregetField.focus();
			taregetField.selectionStart = startPos + insertValue.length;
			taregetField.selectionEnd = startPos + insertValue.length;
		} else {
			taregetField.value += insertValue;
			taregetField.focus();
		}
	},

	// 业务权限
	showPrivilegeLookUp : function(event) {

		// 数组增加indexOf和remove方法
		Array.prototype.indexOf = function(val, type) {
			for (var i = 0; i < this.length; i++) {
				// 当为表权限时
				if (type == "table") {
					if (this[i].tId == val.tId) {
						return i;
					}
				}

				// 当为字段权限时
				if (type == "field") {
					if (this[i].tId == val.tId && this[i].fId == val.fId) {
						return i;
					}
				}
			}
			return -1;
		};

		Array.prototype.remove = function(val, type) {
			var index = this.indexOf(val, type);
			if (index > -1) {
				this.splice(index, 1);
			}
		};

		var dialogDivDom = event.data.dialogDivDom;
		var forDom = event.data.forDom;
		var value = forDom.attr("value");
		var privilege = null;

		if (value != "") {
			privilege = JSON.parse(value);
		} else {
			privilege = {
				starter : [],
				submitter : [],
				candidater : []
			};
		}

		// 整个区域
		var wholeDivDom = UIUtil.getDiv({}).appendTo(dialogDivDom);
		// tab页的dom
//		var tabUlDom = UIUtil.getUl({}).appendTo(wholeDivDom);
		var starterTabDiv = UIUtil.getDiv({
			id : "tabs-starter",
			title : "创建人"
		}).css("overflow-x","hidden").css("overflow-y","auto").appendTo(wholeDivDom);
		var submitterTabDiv = UIUtil.getDiv({
			id : "tabs-submitter",
			title : "提交人"
		}).css("overflow-x","hidden").css("overflow-y","auto").appendTo(wholeDivDom);
		var candidaterTabDiv = UIUtil.getDiv({
			id : "tabs-candidater",
			title : "处理人"
		}).css("overflow-x","hidden").css("overflow-y","auto").appendTo(wholeDivDom);
		
		wholeDivDom.tabs({    
		    border:false,   
		    onSelect:function(title){
		    	if(title=="创建人"){
		    		changeTabDiv(starterTabDiv,"starter");
		    	}else if(title=="提交人"){
		    		changeTabDiv(submitterTabDiv,"submitter");
		    	}else if(title=="处理人"){
		    		changeTabDiv(candidaterTabDiv,"candidater");
		    	}
		    }   
		});

		var checkboxDivDom = null;
		var tableUlDom = null;
		var fieldTableDom = null;
		
		// 按钮区域
		var buttonDivDom = null;
		dialogDivDom.dialog(FlowConstant.DIAGRAMOPEN_SETTING);

		var passId = event.data.id;
		var tableUlDomId = passId + "OfTable";
		var tableListId = passId + "OfList";
		var roleType = null;

		// 默认第一次点开dialog的时候显示的为处理人tab
		wholeDivDom.find("li").eq(0).click();

		function changeTabDiv(targetDivDom,type) {
			targetDivDom.empty();
			// 类型，是创建人，还是提交人，还是处理人
			roleType = type;
			tableUlDomId = tableUlDomId + type;

			tableListId = tableListId + type;
			// 表树区域
			var tableDivDom = UIUtil.getDiv({}).appendTo(targetDivDom);
			tableUlDom = UIUtil.getUl({
				id : tableUlDomId,
				className : "ztree"
			});
			tableUlDom.appendTo(tableDivDom);

			// 表权限区域
			checkboxDivDom = UIUtil.getDiv({
				className : "gzl003"
			});
			// 字段权限区域
			var fieldDivDom = UIUtil.getDiv({id:"datatable"}).css("height","auto").css("width","410px").css("overflow","hidden");
			fieldTableDom = UIUtil.getTabel({
				id : tableListId
			});
			fieldTableDom.appendTo(fieldDivDom);
			//按钮区域
			buttonDivDom = UIUtil.getDiv({
				className : "gzl003"
			}).css("padding-left","150px");
			var buttonDomObj = UIUtil.getButton({
				value : "确定"
			});
			buttonDomObj.on("click", {
				forDom : forDom,
				value : privilege,
				dialogDivDom : dialogDivDom
			}, changeTextValue);
			buttonDomObj.appendTo(buttonDivDom);
			buttonDomObj = UIUtil.getButton({
				value : "取消"
			});
			buttonDomObj.on("click", {
				dialogDivDom : dialogDivDom
			}, closePrivilegeDialog);
			buttonDomObj.appendTo(buttonDivDom);
			buttonDivDom.appendTo(dialogDivDom);

			// 设置布局
			setLayout(targetDivDom, {
				leftDiv : tableDivDom,
				rightCheckboxDiv : checkboxDivDom,
				rightFieldDiv : fieldDivDom,
				buttonDivDom : buttonDivDom
			});

			// 创建table树
			createTree(tableUlDom, basePath
					+ "bpmnAction/templateDef/findTableByBpmnType.do?tokenid="+tokenID+ "&bpmnType=" + _myflow.$bpmnType,
					tableTreeOnClick, "");

		}

		function setLayout(targetDiv, divs) {
			var tableDom = UIUtil.getTabel({}).appendTo(targetDiv.css("height","330px"));
			var firstTrDom = UIUtil.getTr({}).appendTo(tableDom);
			var treeTdDom = UIUtil.getTd({}).appendTo(firstTrDom);
			var checkboxTdDom = UIUtil.getTd({}).appendTo(firstTrDom);

			divs.leftDiv.css({
				"overflow" : "auto",
				"width" : "150px",
				"height" : "320px"
			}).appendTo(treeTdDom);
			divs.rightCheckboxDiv.css({
			}).appendTo(checkboxTdDom);

			var rightFieldDiv = divs.rightFieldDiv;
			var buttonDivDom = divs.buttonDivDom;
			rightFieldDiv.appendTo(checkboxTdDom);
			buttonDivDom.appendTo(checkboxTdDom);
		}

		// 点击确定按钮后设置输入框的值
		function changeTextValue(event) {
			var dialogDivDom = event.data.dialogDivDom;
			var forDom = event.data.forDom;
			var obj = event.data.value;
			// json转字符串
			var jsonobj = JSON.stringify(obj);
			var jsonobjTemp = JSON.parse(jsonobj);
			if(typeof (jsonobjTemp)=="string"){
				jsonobj = jsonobjTemp;
			}
			var str = jsonobj;
			if (obj.starter.length == 0 && obj.submitter.length == 0
					&& obj.candidater.length == 0) {
				str = null;
			}
			forDom.attr("value", str);
			forDom.trigger("change");
			dialogDivDom.dialog("close");
		}

		// 点击取消按钮的时候调用
		function closePrivilegeDialog(event) {
			var dialogDivDom = event.data.dialogDivDom;
			dialogDivDom.dialog("close");
		}

		// 创建树
		function createTree(ulDom, url, treeOnClick, tableId) {
			var setting = {
				data : {
					keep : {
						leaf : false,
						parent : false
					},
					key : {
						checked : "checked",
						children : "children",
						name : "name",
						dbName : "dbName",
						title : "",
						url : url
					},
					simpleData : {
						enable : true,
						idKey : "id",
						pIdKey : "pId",
						rootPId : null
					}
				},
				async : {
					enable : true
				},
				callback : {
					onClick : tableTreeOnClick
				}
			};

			var nodes;
			$.ajax({
				url : url,
				type : "post",
				data : "",
				dataType : "json",
				async : false,
				success : function(data) {
					if (data != null && data.success) {
						// json格式转换成对象
						nodes = data.result;
						var tableIdsStr = _myflow.exportData().diagram.bpmn.bpmnBusinessForms;
						if(tableIdsStr != undefined && tableIdsStr != "" && tableIdsStr != "null"){
							var tableIds = tableIdsStr.split(",");
							var isAddBindingProcessNode = false;
							if(tableIds.length > 0){
								for(var i=0; i<nodes.length; i++)
								{
									$(tableIds).each(function(j,tableId){
										if(nodes[i].id == tableId){
											nodes[i].pId= "#";
											isAddBindingProcessNode = true;
										}
									});
								}
								if(isAddBindingProcessNode){
									nodes.unshift({
										id : "#",
										name : "主表单"
									});
								}
							}
						}
						$.fn.zTree.init(ulDom, setting, nodes).expandAll(true); 
					} else if (data != null){
						alert(data.message);
					}
				}
			});
		}

		// 点击表节点时，插入一条表权限数据
		function tableTreeOnClick(event, treeId, treeNode) {
			// 清除上一次的checkboxdiv中的内容
			$(checkboxDivDom).empty();
			var config = {
				node1 : {
					type : "canNotAdd",
					label : "不可新增",
					value : "0"
				},
				node2 : {
					type : "canNotDelete",
					label : "不可删除",
					value : "0"
				},
				node3 : {
					type : "canNotVisble",
					label : "不可见",
					value : "0"
				},
				node4 : {
					type : "canNotModify",
					label : "不可改",
					value : "0"
				}
			};
			if (privilege[roleType].length != 0) {
				// 回显表权限信息
				$(privilege[roleType]).each(function(index, data) {
					if (data.tId == treeNode.id && data.fId == undefined) {
						if (data.a) {
							config.node1.value = data.a;
						}
						if (data.d) {
							config.node2.value = data.d;
						}
						if (data.v) {
							config.node3.value = data.v;
						}
						if (data.m) {
							config.node4.value = data.m;
						}
					}
				});
			}
			// 创建四个复选框
			var labelConfig = null;
			var ulDom = UIUtil.getUl({}).css({
				"list-style" : "none outside none",
				"margin-left" : "-40px"
			}).appendTo(checkboxDivDom);
			$.each(config, function(node, nodeConfig) {
				var liDom = UIUtil.getLi({}).css({
					"display" : "inline-block",
					"margin-left" : "30px"
				});
				labelConfig = {
					label : nodeConfig.label,
					css : {
						"vertical-align" : "middle",
						"margin-left" : "10px"
					}
				};
				var label = UIUtil.getLabel(labelConfig);
				var checkboxConfig = nodeConfig.value == 1 ? {
					checked : "checked",
					css : {
						"vertical-align" : "middle",
						"margin-left" : "20px"
					}
				} : {
					css : {
						"vertical-align" : "middle",
						"margin-left" : "15px"
					}
				};
				var checkbox = UIUtil.getCheckbox(checkboxConfig);
				label.appendTo(liDom);
				checkbox.on("change", {
					tableUlDom : tableUlDom,
					privilegeType : "tablePrivilege",
					type : nodeConfig.type
				}, changeJsonStr);
				checkbox.appendTo(liDom);
				liDom.appendTo(ulDom);
			});

			$.ajax({
				url : basePath + "bpmnAction/templateDef/findFieldByTableId.do?tokenid="+tokenID,
				type : "POST",
				data : "tableId=" + treeNode.id,
				dataType : "json",
				async : false,
				success : function(pr, textStatus) {
					if (pr.success) {
						var mydata = pr.result;
//						/mydata.unshift({name:"全   选"});
//						fieldTableDom.datagrid("deleteRow").datagrid(
//								'setGridParam', {
//									data : mydata
//								}).trigger("reloadGrid");
						loadJqGrid(mydata);
					} else {
						alert(pr.message);
					}
				}
			});

			// 设置字段权限
			var trCount = fieldTableDom.find("tr").length;
			if (trCount > 1) {
				// 这时候需要回显字段权限信息
				$(privilege[roleType]).each(function(index, data) {
					if (data.v == 1) {
						fieldTableDom
								.find("tr[id= '" + data.fId + "']")
								.find("input").eq(0).prop("checked",
										true);
					}
					if (data.m == 1) {
						fieldTableDom
								.find("tr[id= '" + data.fId + "']")
								.find("input").eq(1).prop("checked",
										true);
					}
					if (data.mfi == 1) {
						fieldTableDom
								.find("tr[id= '" + data.fId + "']")
								.find("input").eq(2).prop("checked",
										true);
					}
				});
			}
		}

		function loadJqGrid(theData) {
			fieldTableDom.empty();
			var tr = UIUtil.getTr({});
			UIUtil.getTh({"text":"id"}).css("display","none").appendTo(tr);
			UIUtil.getTh({"text":"name"}).appendTo(tr);
			UIUtil.getTh({"text":"dbName"}).css("display","none").appendTo(tr);
			UIUtil.getTh({"text":"description"}).css("display","none").appendTo(tr);
			UIUtil.getTh({"text":"tableId"}).css("display","none").appendTo(tr);
			UIUtil.getCheckbox({id:"canNotVisbleChk"}).css("height","15px").css("margin-top","10px").appendTo(UIUtil.getTh({"text":"不可见"}).appendTo(tr));
			UIUtil.getCheckbox({id:"canNotModifyChk"}).css("height","15px").css("margin-top","10px").appendTo(UIUtil.getTh({"text":"不可改"}).appendTo(tr));
			UIUtil.getCheckbox({id:"mustFillInChk"}).css("height","15px").css("margin-top","10px").appendTo(UIUtil.getTh({"text":"必填"}).appendTo(tr));
			tr.appendTo(fieldTableDom);
			$(theData).each(function(index,data){
				var tr = UIUtil.getTr({}).attr("id",data.id);
				UIUtil.getTd({"text":data.id}).css("display","none").appendTo(tr);
				UIUtil.getTd({"text":data.name}).appendTo(tr);
				UIUtil.getTd({"text":data.dbName}).css("display","none").appendTo(tr);
				UIUtil.getTd({"text":data.description}).css("display","none").appendTo(tr);
				UIUtil.getTd({"text":data.tableId}).css("display","none").appendTo(tr);
				UIUtil.getCheckbox({id:""}).css("height","15px").css("margin","2px").appendTo(UIUtil.getTd({"text":""}).appendTo(tr));
				UIUtil.getCheckbox({id:""}).css("height","15px").css("margin","2px").appendTo(UIUtil.getTd({"text":""}).appendTo(tr));
				UIUtil.getCheckbox({id:""}).css("height","15px").css("margin","2px").appendTo(UIUtil.getTd({"text":""}).appendTo(tr));
				tr.appendTo(fieldTableDom);
			});
			$("#canNotVisbleChk").live("change", {
				tableUlDom : tableUlDom,
				privilegeType : "fieldPrivilege",
				type : "canNotVisble"
			}, multiSelectEvent);
			$("#canNotModifyChk").live("change", {
				tableUlDom : tableUlDom,
				privilegeType : "fieldPrivilege",
				type : "canNotModify"
			}, multiSelectEvent);
		    $("#mustFillInChk").live("change", {
				tableUlDom : tableUlDom,
				privilegeType : "fieldPrivilege",
				type : "mustFillIn"
			}, multiSelectEvent);
		    
		 // 对列表中的checkbox添加事件
		    fieldTableDom.find("tr").each(function(index, data) {
				var tds = $(data).find("td");
				var trId = $(data).attr("id");
				tds.eq(5).find("input").on("change", {
					tableUlDom : tableUlDom,
					privilegeType : "fieldPrivilege",
					type : "canNotVisble",
					trId : trId
				}, changeJsonStr);
				tds.eq(6).find("input").on("change", {
					tableUlDom : tableUlDom,
					privilegeType : "fieldPrivilege",
					type : "canNotModify",
					trId : trId
				}, changeJsonStr);
				tds.eq(7).find("input").on("change", {
					tableUlDom : tableUlDom,
					privilegeType : "fieldPrivilege",
					type : "mustFillIn",
					trId : trId
				}, changeJsonStr);
			});
		}
		
		// 全选字段的checkbox添加事件
		function multiSelectEvent(event){
			var checkboxDom = $(event.target);
			var privilegeType = event.data.privilegeType;
			var type = event.data.type;
			var checkValue = checkboxDom.prop("checked") == true ? "1" : "0";
			if(checkValue == "1"){  //打钩全选按钮
				if(privilegeType == "fieldPrivilege"){
					if(type == "canNotVisble"){
						fieldTableDom.find("tr").each(function(index, data){
							var tds = $(data).find("td");
							var trId = $(data).attr("id");
							var isChecked = tds.eq(5).find("input").prop("checked") == true ? "1" : "0";
							if(isChecked == "0"){
								tds.eq(5).find("input").prop("checked",true);
								tds.eq(5).find("input").trigger("change", {
									tableUlDom : tableUlDom,
									privilegeType : "fieldPrivilege",
									type : "canNotVisble",
									trId : trId
								}, changeJsonStr);
							}
						});
					}else if(type == "canNotModify"){
						fieldTableDom.find("tr").each(function(index, data){
							var tds = $(data).find("td");
							var trId = $(data).attr("id");
							var isChecked = tds.eq(6).find("input").prop("checked") == true ? "1" : "0";
							if(isChecked == "0"){
								tds.eq(6).find("input").prop("checked",true);
								tds.eq(6).find("input").trigger("change", {
									tableUlDom : tableUlDom,
									privilegeType : "fieldPrivilege",
									type : "canNotModify",
									trId : trId
								}, changeJsonStr);
							}
						});
					}else if(type == "mustFillIn"){
						fieldTableDom.find("tr").each(function(index, data){
							var tds = $(data).find("td");
							var trId = $(data).attr("id");
							var isChecked = tds.eq(7).find("input").prop("checked") == true ? "1" : "0";
							if(isChecked == "0"){
								tds.eq(7).find("input").prop("checked",true);
								tds.eq(7).find("input").trigger("change", {
									tableUlDom : tableUlDom,
									privilegeType : "fieldPrivilege",
									type : "mustFillIn",
									trId : trId
								}, changeJsonStr);
							}
						});
					}
				}
			}else{  //不打钩全选
				if(privilegeType == "fieldPrivilege"){
					if(type == "canNotVisble"){
						fieldTableDom.find("tr").each(function(index, data){
							var tds = $(data).find("td");
							var trId = $(data).attr("id");
							var isChecked = tds.eq(5).find("input").prop("checked") == true ? "1" : "0";
							if(isChecked == "1"){
								tds.eq(5).find("input").prop("checked",false);
								tds.eq(5).find("input").trigger("change", {
									tableUlDom : tableUlDom,
									privilegeType : "fieldPrivilege",
									type : "canNotVisble",
									trId : trId
								}, changeJsonStr);
							}
						});
					}else if(type == "canNotModify"){
						fieldTableDom.find("tr").each(function(index, data){
							var tds = $(data).find("td");
							var trId = $(data).attr("id");
							var isChecked = tds.eq(6).find("input").prop("checked") == true ? "1" : "0";
							if(isChecked == "1"){
								tds.eq(6).find("input").prop("checked",false);
								tds.eq(6).find("input").trigger("change", {
									tableUlDom : tableUlDom,
									privilegeType : "fieldPrivilege",
									type : "canNotModify",
									trId : trId
								}, changeJsonStr);
							}
						});
					}else if(type == "mustFillIn"){
						fieldTableDom.find("tr").each(function(index, data){
							var tds = $(data).find("td");
							var trId = $(data).attr("id");
							var isChecked = tds.eq(7).find("input").prop("checked") == true ? "1" : "0";
							if(isChecked == "1"){
								tds.eq(7).find("input").prop("checked",false);
								tds.eq(7).find("input").trigger("change", {
									tableUlDom : tableUlDom,
									privilegeType : "fieldPrivilege",
									type : "mustFillIn",
									trId : trId
								}, changeJsonStr);
							}
						});
					}
				}
			}
		}

		// 权限改变的时候调用此函数更新json字符串
		function changeJsonStr(event) {
			var checkboxDom = $(event.target);
			var privilegeType = event.data.privilegeType;
			var type = event.data.type;

			var tableUlId = event.data.tableUlDom.attr("id");
			var checkValue = checkboxDom.attr("checked") == "checked" ? "1"
					: "0";

			var tableTreeObj = $.fn.zTree.getZTreeObj(tableUlId);
			var table = tableTreeObj.getSelectedNodes()[0];

			var tableObj = {
				type : "0",
				tId : "",
				tDBName : "",
				a : "0",
				d : "0",
				v : "0",
				m : "0"
			};

			var fieldObj = {
				type : "1",
				tId : "",
				tDBName : "",
				fId : "",
				fDBName : "",
				v : "0",
				m : "0",
				mfi : "0"
			};
			// 当为表权限时
			if (privilegeType == "tablePrivilege") {
				if (privilege[roleType].length == 0) {
					tableObj.tId = table.id;
					tableObj.tDBName = table.dbName;
					if (type == "canNotAdd") {
						tableObj.a = checkValue;
					} else if (type == "canNotDelete") {
						tableObj.d = checkValue;
					} else if (type == "canNotVisble") {
						tableObj.v = checkValue;
					} else if (type == "canNotModify") {
						tableObj.m = checkValue;
					}
					if (tableObj.a != 0 || tableObj.d != 0 || tableObj.v != 0
							|| tableObj.m != 0) {
						privilege[roleType].push(tableObj);
					}
				} else {
					var flag = true;
					var objectIndex = null;
					$(privilege[roleType]).each(function(index, data) {
						if (data.tId == table.id && data.fId == undefined) {
							flag = false;
							objectIndex = index;
						}
					});
					if (flag) {
						// 做新增操作
						tableObj.tId = table.id;
						tableObj.tDBName = table.dbName;
						if (type == "canNotAdd") {
							tableObj.a = checkValue;
						} else if (type == "canNotDelete") {
							tableObj.d = checkValue;
						} else if (type == "canNotVisble") {
							tableObj.v = checkValue;
						} else if (type == "canNotModify") {
							tableObj.m = checkValue;
						}
						if (tableObj.a != 0 || tableObj.d != 0
								|| tableObj.v != 0 || tableObj.m != 0) {
							privilege[roleType].push(tableObj);
						}
					} else {
						// 做更新操作
						if (type == "canNotAdd") {
							privilege[roleType][objectIndex].a = checkValue;
						} else if (type == "canNotDelete") {
							privilege[roleType][objectIndex].d = checkValue;
						} else if (type == "canNotVisble") {
							privilege[roleType][objectIndex].v = checkValue;
						} else if (type == "canNotModify") {
							privilege[roleType][objectIndex].m = checkValue;
						}
						if (privilege[roleType][objectIndex].a == 0
								&& privilege[roleType][objectIndex].d == 0
								&& privilege[roleType][objectIndex].v == 0
								&& privilege[roleType][objectIndex].m == 0) {
							// 这时候判断是否有对应的字段数据，若没有对应的字段数据，则删除该表权限
							var deleteTablePri = true;
							$.each(privilege[roleType], function(index, data) {
								if (data.tId == table.id
										&& data.fId != undefined) {
									deleteTablePri = false;
									return false;
								}
							});
							if (deleteTablePri) {
								privilege[roleType].remove(
										privilege[roleType][objectIndex],
										"table");
							}
						}
					}
				}
			} else if (privilegeType == "fieldPrivilege") {
				
				var trId = checkboxDom.parent().parent().attr("id");
				var rowData = fieldTableDom.find("tr[id='"+trId+"']").find("td");
				if (privilege[roleType].length == 0) {
					fieldObj.tId = table.id;
					fieldObj.tDBName = table.dbName;
					fieldObj.fId = rowData.eq(0).text();
					fieldObj.fDBName = rowData.eq(2).text();
					if (type == "canNotVisble") {
						fieldObj.v = checkValue;
					} else if (type == "canNotModify") {
						fieldObj.m = checkValue;
					} else if (type == "mustFillIn") {
						fieldObj.mfi = checkValue;
					}
					if (fieldObj.v != 0 || fieldObj.m != 0 || fieldObj.mfi != 0) {
						privilege[roleType].push(fieldObj);
					}

					// 校验是否有对应的表数据
					var flag = true;
					$(privilege[roleType]).each(function(index, data) {
						if (data.tId == table.id && data.fId == undefined) {
							flag = false;
							return false;
						}
					});
					var tableObj = {
						type : "0",
						tId : table.id,
						tDBName : table.dbName,
						a : "0",
						d : "0",
						v : "0",
						m : "0"
					};

					if (flag) {
						// 做新增操作
						// if (fieldObj.v != 0 || fieldObj.m != 0) {
						privilege[roleType].push(tableObj);
						// }
					}
				} else {
					var flag = true;
					var objectIndex = null;
					$(privilege[roleType]).each(function(index, data) {
						if (data.fId == rowData.eq(0).text()) {
							flag = false;
							objectIndex = index;
						}
					});
					if (flag) {
						fieldObj.tId = table.id;
						fieldObj.tDBName = table.dbName;
						fieldObj.fId = rowData.eq(0).text();
						fieldObj.fDBName = rowData.eq(2).text();
						if (type == "canNotVisble") {
							fieldObj.v = checkValue;
						} else if (type == "canNotModify") {
							fieldObj.m = checkValue;
						} else if (type == "mustFillIn") {
							fieldObj.mfi = checkValue;
						}
						if (fieldObj.v != 0 || fieldObj.m != 0
								|| fieldObj.mfi != 0) {
							privilege[roleType].push(fieldObj);
						}

						// 校验是否有对应的表数据
						var flag = true;
						$(privilege[roleType]).each(function(index, data) {
							if (data.tId == table.id && data.fId == undefined) {
								flag = false;
								return false;
							}
						});
						var tableObj = {
							type : "0",
							tId : table.id,
							tDBName : table.dbName,
							a : "0",
							d : "0",
							v : "0",
							m : "0"
						};

						if (flag) {
							// 做新增操作
							// if (fieldObj.v != 0 || fieldObj.m != 0) {
							privilege[roleType].push(tableObj);
							// }
						}
					} else {
						if (type == "canNotVisble") {
							privilege[roleType][objectIndex].v = checkValue;
						} else if (type == "canNotModify") {
							privilege[roleType][objectIndex].m = checkValue;
						} else if (type == "mustFillIn") {
							privilege[roleType][objectIndex].mfi = checkValue;
						}
						if (privilege[roleType][objectIndex].v == 0
								&& privilege[roleType][objectIndex].m == 0
								&& privilege[roleType][objectIndex].mfi == 0) {
							privilege[roleType].remove(
									privilege[roleType][objectIndex], "field");
							// 这时候如果表下面的所有字段均没有选择字段权限，此时也需要删除对应的表权限
							var deleteTablePri = true;
							$.each(privilege[roleType], function(index, data) {
								if (data.tId == table.id
										&& data.fId != undefined) {
									// 存在字段权限
									deleteTablePri = false;
									return false;
								}
							});
							if (deleteTablePri) {
								// 如果不存在字段权限，这时候判断对应的表权限值是否均为0
								var tablePri = null;
								$.each(privilege[roleType], function(index,
										data) {
									if (data.tId == table.id && data.a == 0
											&& data.d == 0 && data.v == 0
											&& data.m == 0) {
										tablePri = data;
										return false;
									}
								});
								privilege[roleType].remove(tablePri, "table");
							}
						}
					}
				}
			}
		}
	},
	
	// 选择业务表单
	selectBusinessFormsLookUp : function(event){

		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var treeUlDom = treeDialogDivDom.find("ul");
		var type = event.data.type;
		var url = basePath+"bpmnAction/templateDef/findTableByBpmnType.do?tokenid="+tokenID+ "&bpmnType=" + _myflow.$bpmnType;

		
		var treeDom = null;
		var zNodes = null;

		var setting = {
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
					checked : "checked",
					children : "children",
					name : "name",
					dbName : "dbName",
					title : "",
					url : url
				},
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "",
					rootPId : null
				}
			},
			async : {
				enable : true
			},
		};

		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			async : false,
			success : function(data) {
				// json格式转换成对象
				if(data != null){
					zNodes = data.result;
				}
			//	zNodes = data.result;
				treeDom = $.fn.zTree.init(treeUlDom, setting, zNodes);
			}
		});
		treeDialogDivDom.dialog("open");
		// 获取目前输入框中的值，在打开树窗口的时候设置已选中的节点
		var selectedIds = forDom.attr("realValue");
		if (selectedIds != undefined && selectedIds != ""
				&& selectedIds != "null") {
			var array = selectedIds.split(",");
			for (var i = 0; i < array.length; i++) {
				var selectNode = treeDom.getNodeByParam("id", array[i],
						null);
				treeDom.checkNode(selectNode, true, true);
			}
		}

		if (treeDialogDivDom.children("input").length == 0) {
			var buttonDivDom = UIUtil.getDiv({
				className : "gzl003"
			}).css({
				"position" : "absolute",
				"top" : "320px",
				"left" : "200px"
			}).appendTo(treeDialogDivDom);
			UIUtil.getButton({
				value : "确定"
			}).appendTo(buttonDivDom).on("click", {
				treeDialogDivDom : treeDialogDivDom,
				type : type,
				forDom : forDom,
				treeDom : treeDom
			}, confirm);
			UIUtil.getButton({
				value : "清空"
			}).appendTo(buttonDivDom).on("click", {
				treeDom : treeDom,
				type : type
			}, empty);

			UIUtil.getButton({
				value : "取消"
			}).appendTo(buttonDivDom).on("click", {
				treeDialogDivDom : treeDialogDivDom
			}, closeLookupDialog);
		}

		

		// 选择业务表单之后点击确定按钮
		function confirm(event) {
			var forDom = event.data.forDom;
			// 如果一个也没有选择，清空输入区域和隐藏input的值
			var treeObj = event.data.treeDom;
			var nodes = null;
			if (treeObj != null) {
				nodes = treeObj.getCheckedNodes(true);
			}
			var showValues = "";
			var values = "";
			var tableName = "";
			if (nodes) {
				$(nodes).each(function(index, node) {
					if (showValues.length > 0) {
						showValues += ",";
						values += ",";
						tableName += ",";
					}
					showValues += node.name;
					values += node.id;
					tableName += node.dbName;
				});
			}
			forDom.attr("value", showValues);// 赋显示值
			forDom.attr("realValue", values);// 赋实际值
			forDom.attr("tableName", tableName);// 表名
			
			forDom.trigger("change");

			closeLookupDialog(event);
		}

		function closeLookupDialog(event) {
			event.data.treeDialogDivDom.dialog("close");
		}

		// 清空所有复选框
		function empty(event) {
			var treeObj = event.data.treeDom;
			treeObj.checkAllNodes(false);
		}
	},
//--------------UserTask---处理组配置及回显---------------Begin-------------------
	selectCandidationLookUp : function(event) {
		var forDom = event.data.forDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var type = event.data.type;
		// 当前的元素Id
		var elementId = event.data.elementId;
		var dataOfDeptAndUser = [];
		var url = null;
		treeDialogDivDom.dialog({
			height : 530,
			width : 730,
			closed: true,
			onClose : function() {
				// 清空内容
				treeDialogDivDom.empty();
			}
		});
		var queryQuickInputDom = UIUtil.getInput({
			id : "queryInput"
		}).css({
			"height" : "26px",
			"width" : "300px",
			"position" : "absolute",
			"top" : "28px",
			"left" : "25px"
		}).appendTo(treeDialogDivDom);
		var queryQuickBtnDom = UIUtil.getButton({
			id : "queryBtn",
			value : "查询"
		}).css({
			"height" : "26px",
			"width" : "26px",
			"position" : "absolute",
			"top" : "40px",
			"left" : "335px",
			"line-height" : "26px",
	    	"display" : "inline-block",
	    	"padding" : "0 10px"
		}).appendTo(treeDialogDivDom).on("click",{
			queryQuickInputDom : queryQuickInputDom
		},function(event){
			//模糊查询并展开查询结果
			var name = event.data.queryQuickInputDom.val();
			if (name == "" || name == null) {
				alert("请输入用户名！");
				return;
			}
			//获取type，部门：1，角色：2，人员：3
			var	typeName=$(".bpmnDesignerbtnInEd").text();
			var type="";
			if(typeName == "部门"){
				type="1";
			}else if(typeName == "角色"){
				type="2";
			}else if(typeName == "人员"){
				type="3";
			}
			if(null !=type || !"".equals(type)){
				if (!Array.prototype.indexOf){
					  Array.prototype.indexOf = function(elt /*, from*/){
					    var len = this.length >>> 0;

					    var from = Number(arguments[1]) || 0;
					    from = (from < 0)
					         ? Math.ceil(from)
					         : Math.floor(from);
					    if (from < 0)
					      from += len;

					    for (; from < len; from++){
					      if (from in this && this[from] === elt)
					        return from;
					    }
					    return -1;
					  };
					}
				$.ajax({
					url : basePath+"bpmnAction/templateDef/findBpmnGroupOrUser.do?tokenid="+tokenID,
					type : "post",
					data : {
						"name" : name,
						"type" : type
					},
					dataType : "json",
					async : false,
					success : function(data) {
						if (data.success) {
							$("#highGrade").hide();
							$("#usertaskNode").hide();
							$("#highGrade").hide();
							$("#highGrade1").hide();
							$("#k1").show();
							var settingdep = getSetting();
							var nodes = data.result;
							var checkedNodesOfRole = new Array();
							var checkedNodesOfDep= new Array();
							var roleFlag = false;
							var deptFlag = false;
							for (var i=0, l=nodes.length; i < l; i++) {
								if(nodes[i].type == 2){
									var treeObj = $.fn.zTree.getZTreeObj("k1");
									if(!roleFlag){
										//获取原来勾选的角色
										checkedNodesOfRole = treeObj.getCheckedNodes(true);
										roleFlag = true;
									}
									if(checkedNodesOfRole.indexOf(nodes[i]) < 0){
										var existElement = array_contain(checkedNodesOfRole,nodes[i]);
										if(undefined != existElement  && null != existElement && !existElement){
											checkedNodesOfRole.push(nodes[i]);
										}
									}
								}else if(nodes[i].type == 1){
									var treeObj = $.fn.zTree.getZTreeObj("k2");
									if(!deptFlag){
										checkedNodesOfDep = treeObj.getCheckedNodes(true);
										deptFlag = true;
									}
									if(checkedNodesOfDep.indexOf(nodes[i]) < 0){
										var existElement = array_contain(checkedNodesOfDep,nodes[i]);
										if(undefined != existElement  && null != existElement && !existElement){
											checkedNodesOfDep.push(nodes[i]);
										}
									}
								}
							}
							if(checkedNodesOfRole.length > 0){
								$.fn.zTree.init($("#k1"), settingdep, checkedNodesOfRole);
							}
							if(checkedNodesOfDep.length > 0){
								$.fn.zTree.init($("#k2"), settingdep, checkedNodesOfDep);
							}
						} else{
							alert(data.message);
						}
					}
				});
			}
		});	
		function array_contain(array, obj){
		    for (var i = 0; i < array.length; i++){
		        if (array[i].id == obj.id)
		            return true;
		    }
		    return false;
		}
		var queryDivDom = UIUtil.getDiv({
			id : "dep",
			className : "gzl003"
		}).appendTo(treeDialogDivDom);
		var queryDivDom1 = UIUtil.getDiv({
			id : "dep2",
		}).css({
			"height" : "350px",
			"width" : "350px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "370px",
		}).appendTo(treeDialogDivDom);
		var realContentDom =  forDom.attr("realValue");
		var buttonDivs = UIUtil.getDiv({    //---角色按钮
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "80px",
			"left" : "24px",
			"width" : "700px"
		}).appendTo(queryDivDom);
		UIUtil.getHidden({
			id : "hiddenType"
		}).appendTo(queryDivDom);
		UIUtil.getButton({
			id : "role",
			value : "角色"
		}).appendTo(buttonDivs).on("click", function(event) {
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			var settingdep = getSetting();
			var url = basePath
					+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
			$.ajax({
				url : url,
				type : "post",
				dataType : "json", 
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) {
					result = data.result;
					var results = realContentDom;
					if(undefined != results && results.length > 0){
						var resultTemp1 = [];
						var resultTemp2 = [];
						var resultV;
						var split = results.split(",");
						$.each(result,function(i, k){
							$.each(split,function(j, v){
								if(k.id == v){
									resultTemp1.push(k);
									delete result[i];
								}
							});
						});
					    for(var item in result){
					    	resultTemp2.push(result[item]);
					    }
						for(var n = 0; n <resultTemp2.length; n++ ){
							resultTemp1.push(resultTemp2[n]);
						}
						resultV = resultTemp1;
						treeDom = $.fn.zTree.init($("#k1"), settingdep, resultV);
					}else{
						treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
					}
				}
			});
			loadSelectedNodes();
		});
		UIUtil.getButton({
			value : "部门"
		}).css({
			"position" : "absolute",
			"left" : "355px"
		}).appendTo(buttonDivs).on(
				"click",
				function(event) {
					$("#highGrade").hide();
					$("#k1").show();
					$("#usertaskNode").hide();
					$("#highGrade").hide();
					$("#highGrade1").hide();
					$("#hiddenType").val("1");
					var url = basePath
							+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
					$.ajax({
						url : url,
						type : "post",
						dataType : "json",
						data : {
							"type" : "1",
						},
						async : false,
						success : function(data) {
							dataOfDeptAndUser = data.result;
							treeDom = $.fn.zTree.init($("#k2"), settingdep,
									dataOfDeptAndUser);
						}
					});
					loadSelectedNodes();
				});
		function setDeptNodeNocheck(nodes) {
			$(nodes).each(function(i, node) {
				var nodeChildrens = node.children;
				if (nodeChildrens) {
					node.nocheck = true;
					setDeptNodeNocheck(nodeChildrens);
				}
			});
		}
		url = basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
		var depDivDom = UIUtil.getDiv({
			id : "depxianshi"
		}).css({
			"overflow" : "auto",
			"height" : "350px",
			"width" : "320px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "25px",
			"border" : "2px solid #84C1FF"
		}).appendTo(queryDivDom);
		
		var depDivDom1 = UIUtil.getDiv({
			id : "depxianshi1"
		}).css({
			"overflow" : "auto",
			"height" : "350px",
			"width" : "320px",
			"position" : "absolute",
			"left" : "10px",
			"border" : "2px solid #84C1FF"
		}).appendTo(queryDivDom1);

		var depTreeUl = UIUtil.getUl({
			id : "k1",
			className : "ztree",
		}).appendTo(depDivDom);
		var depTreeUl1 = UIUtil.getUl({
			id : "k2",
			className : "ztree",
		}).appendTo(depDivDom1);
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
						checked : "checked",
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
		var settingdep = getSetting();
		$.ajax({
			url : basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province,
			type : "post",
			dataType : "json",
			data : {
				"type" : "0",
			},
			async : false,
			success : function(data) {
				result = data.result;
				treeDom = $.fn.zTree.init(depTreeUl, settingdep, null);
			}
		});
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "480px",
			"left" : "290px"
		}).appendTo(treeDialogDivDom);

		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {}, function(event) {
			
			var treeObj = $.fn.zTree.getZTreeObj("k1");
			var treeObj1 = $.fn.zTree.getZTreeObj("k2");
			var sNodes = treeObj.getCheckedNodes(true);
			var sNodes1 = treeObj1.getCheckedNodes(true);
			var roleIds = "";
			var roleNames = "";
			var deptIds = "";
			var deptNames = "";
			var allGroups ;
			var allGroupsName ;
			if((sNodes == null ||sNodes.length == 0)&&(sNodes1 == null ||sNodes1.length == 0)){
				forDom.attr("value", "");// 赋显示值
				forDom.attr("realValue", "");// 赋实际值
			}else if((sNodes == null || sNodes.length == 0) && sNodes1.length > 0){
				for (var i = 0; i < sNodes1.length; i++) {
					if(i!=0){
						deptIds+=",";
						deptNames+=",";
					}
					deptIds+=sNodes1[i].id;
					deptNames+=sNodes1[i].name;
				}
				allGroups = deptIds;
				allGroupsName = deptNames;
				forDom.attr("value", allGroupsName);
				forDom.attr("realValue", allGroups);
			}else if(sNodes.length > 0 && (sNodes1 == null ||sNodes1.length == 0)){
				for (var i = 0; i < sNodes.length; i++) {
					if(i!=0){
						roleIds+=",";
						roleNames+=",";
					}
					roleIds+=sNodes[i].id;
					roleNames+=sNodes[i].name;
				}
				allGroups = roleIds;
				allGroupsName = roleNames;
				forDom.attr("value", allGroupsName);
				forDom.attr("realValue", allGroups);
			}else if (sNodes.length > 0 && sNodes1.length > 0) {
				for (var i = 0; i < sNodes.length; i++) {
					if(i!=0){
						roleIds+=",";
						roleNames+=",";
					}
					roleIds+=sNodes[i].id;
					roleNames+=sNodes[i].name;
				}
				for (var i = 0; i < sNodes1.length; i++) {
					if(i!=0){
						deptIds+=",";
						deptNames+=",";
					}
					deptIds+=sNodes1[i].id;
					deptNames+=sNodes1[i].name;
				}
				
				allGroups = roleIds + "," + deptIds;
				allGroupsName = roleNames + "," + deptNames;
				forDom.attr("value", allGroupsName);
				forDom.attr("realValue", allGroups);
			}
			
			treeObj.checkAllNodes(false);
			forDom.trigger("change");
			treeDialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).css({
			"position" : "absolute",
			"left" : "100px"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		showDefaultRole();
		showDefaultDef();
		function showDefaultRole() {
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			$("#dep span:first").attr("class","bpmnDesignerbtnInEd");
			var settingdep = getSetting();
			$.ajax({
				url : basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province,
				type : "post",
				dataType : "json",
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					var results = realContentDom;
					if(undefined != results && results.length > 0){
						var resultTemp1 = [];
						var resultTemp2 = [];
						var resultV;
						var split = results.split(",");
						$.each(result,function(i, k){
							$.each(split,function(j, v){
								if(k.id == v){
									resultTemp1.push(k);
									delete result[i];
								}
							});
						});
					    for(var item in result){
					    	resultTemp2.push(result[item]);
					    }
						for(var n = 0; n <resultTemp2.length; n++ ){
							resultTemp1.push(resultTemp2[n]);
						}
						resultV = resultTemp1;
						treeDom = $.fn.zTree.init($("#k1"), settingdep, resultV);
					}else{
						treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
					}
				}
			});
			loadSelectedNodes();
		}
		function showDefaultDef() {
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k2").show();
			$("#hiddenType").val("1");
			$("#dep span:first").attr("class","bpmnDesignerbtnInEd");
			var settingdep = getSetting();
			$.ajax({
				url : basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province,
				type : "post",
				dataType : "json",
				data : {
					"type" : "1",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					treeDom = $.fn.zTree.init($("#k2"), settingdep, result);
				}
			});
			loadSelectedNodes();
		}
		function loadSelectedNodes(){
			$.ajax({  
				url:basePath+"bpmnAction/templateDef/selectUserAndDeptAndRoleNameByGoupIds.do?tokenid="+tokenID, 
				data: "groupId="+realContentDom,
				type:"post",
				dataType:"json",  
				success:function(pr) { 
					if(pr.success){
						var result = pr.result;
						if(undefined != result && result.length > 0){
							for(var i = 0; i < result.length; i++){
			        			 var temp = result[i];
								 if(temp.GROUPTYPE == '1'){
									 var treeObj = $.fn.zTree.getZTreeObj("k2"); 
									 var nodes = treeObj.getNodesByParam("id", temp.GROUPID, null);
									 if(nodes.length > 0){
										 treeObj.checkNode(nodes[0], true, true);
										 var nodess = nodes[0].getParentNode();
										 treeObj.expandNode(nodess, true, false, false);
									 }
								 }else if(temp.GROUPTYPE == '2'){
									 var treeObj = $.fn.zTree.getZTreeObj("k1"); 
									 var nodes = treeObj.getNodesByParam("id", temp.GROUPID, null);
									 if(nodes.length > 0){
										 treeObj.checkNode(nodes[0], true, true);
									 }
								 }
			        		}
						}
					}
				}
			});
		}
		
		//勾选节点与未勾选节点排序
		function SortedCheckedNodes(){
			
		}
//--------------UserTask---处理组配置及回显---------------end-----------------------
		
		function confirm(event) {
			var contentDom = $(lookUpDivDom.find("textarea")[0]);
			var jsonProcessor = JSON.stringify(processor);
			var jsonProcessorTemp = JSON.parse(jsonProcessor);
			if(typeof (jsonProcessorTemp)=="string"){
				jsonProcessor = jsonProcessorTemp;
			}
			forDom.attr("value", jsonProcessor);// 赋显示值
			forDom.trigger("change");

			event.data.treeDialogDivDom.dialog("close");
		}
		function closeLookupDialog(event) {
			$('#k').remove();
			event.data.treeDialogDivDom.dialog("close");
		}
		// 清空所有复选框
		function empty(event) {
			$('#k').remove();
			// $("#operatesDivDom").empty();
			alert("清空");
		}
	},
	/**
	 * 线上处理人配置
	 * */
	showSequenceCandidateHighGradeConfigLookUp : function(event){
		var forDom = event.data.forDom;
		var stepExpDom = event.data.expDom;
		var treeDialogDivDom = event.data.treeDialogDivDom;
		var type = event.data.type;
		// 当前的元素Id
		var elementId = event.data.elementId;
		var dataOfDeptAndUser = [];
		var url = null;
		treeDialogDivDom.dialog({
			height : 530,
			width : 790,
			closed: true,
			onClose : function() {
				// 清空内容
				treeDialogDivDom.empty();// 清空内容
			}
		});
		var queryQuickInputDom = UIUtil.getInput({
			id : "queryInput"
		}).css({
			"height" : "26px",
			"width" : "300px",
			"position" : "absolute",
			"top" : "28px",
			"left" : "25px"
		}).appendTo(treeDialogDivDom);
		var queryQuickBtnDom = UIUtil.getButton({
			id : "queryBtn",
			value : "查询"
		}).css({
			"height" : "26px",
			"width" : "26px",
			"position" : "absolute",
			"top" : "40px",
			"left" : "335px",
			"line-height" : "26px",
	    	"display" : "inline-block",
	    	"padding" : "0 10px"
		}).appendTo(treeDialogDivDom).on("click",{
			queryQuickInputDom : queryQuickInputDom
		},function(event){
			//模糊查询并展开查询结果
			var name = event.data.queryQuickInputDom.val();
			if (name == "" || name == null) {
				alert("请输入用户名！");
				return;
			}
			//获取type，部门：1，角色：2，人员：3
			var	typeName=$(".bpmnDesignerbtnInEd").text();
			var type="";
			if(typeName == "部门"){
				type="1";
			}else if(typeName == "角色"){
				type="2";
			}else if(typeName == "人员"){
				type="3";
			}
			if(null !=type || !"".equals(type)){
			$.ajax({
				url : basePath+"bpmnAction/templateDef/findBpmnGroupOrUser.do?tokenid="+tokenID,
				type : "post",
				data : {
					"type" : type,
					"name" : name
				},
				dataType : "json",
				async : false,
				success : function(data) {
					if (data.success) {
						$.fn.zTree.destroy();
						$("#highGrade").hide();
						$("#usertaskNode").hide();
						$("#highGrade").hide();
						$("#highGrade1").hide();
						$("#k1").show();
						var settingdep = getSetting();
						treeDom = $.fn.zTree.init($("#k1"), settingdep, data.result);
					} else{
						alert(data.message);
					}
				}
			});
			}
		});
		
		var queryDivDom = UIUtil.getDiv({
			id : "dep",
			className : "gzl003"
		}).appendTo(treeDialogDivDom);
		var queryDivDom1 = UIUtil.getDiv({
			id : "dep2",
		}).css({
			"height" : "350px",
			"width" : "350px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "410px",
		}).appendTo(treeDialogDivDom);
		UIUtil.getTabel({
			id : "gridTable",
		}).css({}).appendTo(queryDivDom1);
		var contentIdDom = forDom.attr("realValue");
		//var contentNameDom =  forDom.attr("value");
		//var contentIdDom = stepExpDom.attr("tempValue");
		var oldContentIdDom =  stepExpDom.attr("value");
		var griddata = "";
		var textAreaDomVal = ""; 
		/*if (contentDom != "" && contentDom !=null) {
			griddata = JSON.parse(contentDom);
			textAreaDomVal = griddata.processorExp;
		}*/
		if((contentIdDom != "" && contentIdDom != undefined ) || oldContentIdDom != ""){
			if(contentIdDom == undefined &&  oldContentIdDom != ""){
				contentIdDom = oldContentIdDom;
			}
			var arryId = eval(contentIdDom);
			var deptIdExp  = "";
			var roleIdExp  = "";
			var userIdExp  = "";
			for(var i = 0; i < arryId.length; i++){
			deptIdExp  = arryId[i].dept;
			roleIdExp  = arryId[i].role;
			userIdExp  = arryId[i].user;
			}
			var deptNames = "";
			var roleNames = "";
			var userNames = "";
			$.ajax({  
		         url:basePath+"bpmnAction/templateDef/selectUserAndDeptAndRoleName.do?tokenid="+tokenID, 
		         data: "deptId="+deptIdExp+"&roleId="+roleIdExp+"&userId="+userIdExp,
		         type:"post",
		         dataType:"json",  
		         success:function(pr) { 
		        	 if(pr.success){
		        		 var result = pr.result;
		        		 if(undefined != result && result.length > 0){
		        			 for(var i = 0; i < result.length; i++){
			        			 var temp = result[i];
								 if(undefined != temp.DEPTNAME && "" != temp.DEPTNAME ){
									 deptNames   +="," +  temp.DEPTNAME; 
								 }else if(undefined != temp.ROLENAME && "" != temp.ROLENAME ){
									 roleNames   +="," +  temp.ROLENAME; 
								 }else if(undefined != temp.USERNAME && "" != temp.USERNAME ){
									 userNames   +="," +  temp.USERNAME; 
								 }
								 if(deptNames != "" && deptNames.indexOf(",",0) == 0){
									 deptNames = deptNames.substring(1);
									}
									if(roleNames != "" && roleNames.indexOf(",",0) == 0){
										roleNames = roleNames.substring(1);
									}
									if(userNames != "" && userNames.indexOf(",",0) == 0){
										userNames = userNames.substring(1);
									}
								 var deptJson = {
											"id"       : deptIdExp,
							                "typeName" : "部门",
									        "name"     :  deptNames,
									        "key"      : "",
									        "orderNo"  : 1,
									        "tableId"  : "",
									        "type"     : "1"
							        };
									 var roleJson = {
								    		   "id"       : roleIdExp,
								               "typeName" : "角色",
										       "name"     : roleNames,
										       "key"      : "",
										       "orderNo"  : 2,
										       "tableId"  : "",
										       "type"     : "2"
								        };
								     var userJson = {
								    		   "id"       : userIdExp,
								               "typeName" : "人员",
										       "name"     : userNames,
										       "key"      : "",
										       "orderNo"  : 3,
										       "tableId"  : "",
										       "type"     : "3"
								        };
								     var arry = new Array();
								     if(deptNames != undefined && "" != deptNames){
								    	 arry.push(deptJson);
								     }
									if (roleNames != undefined && "" != roleNames) {
										arry.push(roleJson);
									}
									if (userNames != undefined && "" != userNames) {
										arry.push(userJson);
									}
									//解决业务驱动线上处理人配置后不回显的问题start
									//var jsonObj = {"processor" : JSON.stringify(arry)};
									var jsonObj = {"processor" : JSON.parse(JSON.stringify(arry))};
									//解决业务驱动线上处理人配置后不回显的问题end
									var temp = JSON.stringify(jsonObj);
									griddata = JSON.parse(temp);
									createJqSeniorGrid(eval(griddata.processor));
			        		 }
		        		 }else{
		        			 createJqSeniorGrid(eval(griddata.processor));
		        		 }
		        		 
		        	 }else{
		        		 alert(pr.message);
		        	 }
		         }   
		     });  
		}else{
			createJqSeniorGrid(eval(griddata.processor));
		}
		var buttonDivs = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "80px",
			"left" : "25px"
		}).appendTo(queryDivDom);
		UIUtil.getHidden({
			id : "hiddenType"
		}).appendTo(queryDivDom);

		
		UIUtil.getButton({
			id : "role",
			value : "角色"
		}).appendTo(buttonDivs).on("click", function(event) {
			$.fn.zTree.destroy();
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			var settingdep = getSetting();
			$.ajax({
				url : url,
				type : "post",
				dataType : "json",
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
				}
			});

		});

		UIUtil.getButton({
			value : "部门"
		}).appendTo(buttonDivs).on(
				"click",
				function(event) {
					$.fn.zTree.destroy();
					$("#highGrade").hide();
					$("#k1").show();
					$("#usertaskNode").hide();
					$("#highGrade").hide();
					$("#highGrade1").hide();
					$("#hiddenType").val("1");
					var url = basePath
							+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
					$.ajax({
						url : url,
						type : "post",
						dataType : "json",
						data : {
							"type" : "1",
						},
						async : false,
						success : function(data) { // json格式转换成对象
							dataOfDeptAndUser = data.result;
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
						}
					});
				});
		function setDeptNodeNocheck(nodes) {
			$(nodes).each(function(i, node) {
				var nodeChildrens = node.children;
				if (nodeChildrens) {
					node.nocheck = true;
					setDeptNodeNocheck(nodeChildrens);
				}
			});
		}
		UIUtil.getButton({
			value : "人员"
		}).appendTo(buttonDivs).on(
				"click",
				function(event) {
					// $.fn.zTree.destroy();
					$("#highGrade").hide();
					$("#k1").show();
					$("#usertaskNode").hide();
					$("#highGrade").hide();
					$("#highGrade1").hide();
					$("#hiddenType").val("3");
					var settingdep = getSetting();
					var url = basePath
							+ "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
					$.ajax({
						url : url,
						type : "post",
						dataType : "json",
						data : {
							"type" : "1",
						},
						async : false,
						success : function(data) { // json格式转换成对象
							dataOfDeptAndUser = data.result;
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
						}
					});
					$.ajax({
						url : basePath + "bpmnAction/templateDef/findBpmnIdUser.do?tokenid="+tokenID+"&province="+province,
						type : "post",
						dataType : "json",
						async : false,
						success : function(pr) {
							if (pr.success) {
								users = pr.result;
								$(users).each(function(i, user) {
									dataOfDeptAndUser.push(user);
								});
							}
							treeDom = $.fn.zTree.init($("#k1"), settingdep,
									dataOfDeptAndUser);
							setFatherNodeNocheck(treeDom.getNodes());
						}
					});

				});
		function setFatherNodeNocheck(nodes) {
			$(nodes).each(function(i, node) {
				var nodeChildrens = node.children;
				if (nodeChildrens||node.type=="1") {
					node.nocheck = true;
					setFatherNodeNocheck(nodeChildrens);
				}
			});
		}
		UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "360px",
			"left" : "200px"
		}).appendTo(queryDivDom);
		url = basePath + "bpmnAction/templateDef/queryBpmnGroupByType.do?tokenid="+tokenID+"&province="+province;
		var depDivDom = UIUtil.getDiv({
			id : "depxianshi"
		}).css({
			"overflow" : "auto",
			"height" : "350px",
			"width" : "320px",
			"position" : "absolute",
			"top" : "110px",
			"left" : "25px",
			"border" : "2px solid #84C1FF"
		}).appendTo(queryDivDom);

		var usertaskNode = UIUtil.getSelect({
			id : "usertaskNode",
			multiple : "true"
		}).css({
			height : "150px",
			"position" : "absolute",
			left : "160px",
		}).appendTo(depDivDom).hide();
		var depTreeUl = UIUtil.getUl({
			id : "k1",
			className : "ztree",
		}).appendTo(depDivDom);
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
				//级联勾选
//				, 
//			    callback: { 
//			    	onCheck: treenodeClick 
//			    } 
			};
		}
		var settingdep = getSetting();
		$.ajax({
			url : url,
			type : "post",
			dataType : "json",
			data : {
				"type" : "0",
			},
			async : false,
			success : function(data) { // json格式转换成对象
				result = data.result;
				treeDom = $.fn.zTree.init(depTreeUl, settingdep, null);
			}
		});
		//点击树节点，获取节点的所有叶子节点
		function treenodeClick(event, treeId, treeNode, clickFlag) { 
		    //此处treeNode 为当前节点 
		     if(treeNode.isParent){
		         getAllChildrenNodes(treeNode);
		     }
		}
		//使用了递归，改变叶子节点选中状态
		function getAllChildrenNodes(treeNode){ 
		    if (treeNode.isParent) { 
		      var childrenNodes = treeNode.children; 
		      if (childrenNodes) { 
		          for (var i = 0; i < childrenNodes.length; i++) { 
		        	  childrenNodes[i].checked=true;
		        	  treeDom.updateNode(childrenNodes[i]);
			          if(childrenNodes[i].isParent){
			        	  getAllChildrenNodes(childrenNodes[i]); 
			          }
		          } 
		      } 
		    } 
		}
		// 增加 删除按钮的添加
		var AddAndDelbuttonDivDom = UIUtil.getDiv({}).css({
			"position" : "absolute",
			"top" : "180px",
			"left" : "360px"
		}).appendTo(queryDivDom);
		UIUtil.getButton({
			value : "->"
		}).css({
			"width" : "15px",
			"position" : "absolute",
			"top" : "10px",
			"left" : "0px"
		}).appendTo(AddAndDelbuttonDivDom).on("click", function(event) {
			var data = [];
			var treeObj = $.fn.zTree.getZTreeObj("k1");
			var sNodes = treeObj.getCheckedNodes(true);
			var nodeIds="";
			var nodeNames="";
			if (sNodes.length > 0) {
				var typeCode = $("#hiddenType").val();
				var type = "";
				if (typeCode == 3) {
					type = "人员";
				}
				if (typeCode == 2) {
					type = "角色";
				}
				if (typeCode == 1) {
					type = "部门";
				}
				/*if (typeCode == 4) {
					type = "变量池";
				}*/
				for (var i = 0; i < sNodes.length; i++) {
					if(i!=0){
						nodeIds+=",";
						nodeNames+=",";
					}
					nodeIds+=sNodes[i].id;
					nodeNames+=sNodes[i].name;
				}
				data.push({
					id : nodeIds,
					name : nodeNames,
					type : typeCode,
					key:"",
					orderNo:"",
					tableId:"",
					typeName:type
				});
			}
			var showName = "";
			var typeCode = $("#hiddenType").val();
				addJqGrid(data);
				treeObj.checkAllNodes(false);
			//}
		});
		
		function createJqSeniorGrid(data){
			if(typeof data=='string'){
				data= JSON.parse(data);
			}
			jQuery("#gridTable").empty();
			jQuery("#gridTable").datagrid({
				width: '100%',
				height: '310px',
				data:data,
				fit:true,//自动补全
				singleSelect : true,
				rownumbers : true,
				columns :[[
				           	{ field: 'id', title: 'id', width: 50, hidden : true },
				           	{ field: 'typeName', title: '类型', width: 50 , align : 'left' }, 
				           	{ field: 'name', title: '名称', width: 300 , align : 'left ' ,formatter: function(value,row,index){
				        		var showValue = value.length>30?value.substring(0,30)+"...":value;
								return "<span title='"+value+"'>"+ showValue+"</span>";
						 }},
				           	{ field: 'key', title: 'key', width: 100, align : 'center', hidden : true },
				           	{ field: 'orderNo', title: 'orderNo', width: 100 , align : 'center', hidden : true },
				           	{ field: 'tableId', title: 'tableId', width: 100 , align : 'center', hidden : true },
				           	{ field: 'type', title: 'type', width: 100 , align : 'center', hidden : true }
				         ]],
		         onLoadSuccess : function(){
		         }
			});
			$(".datagrid-body").css({'overflow-x' : 'auto'});
		}

		
		function addJqGrid(data) {
			if (data.length > 0) {
				var flag = true;
				var rows = $('#gridTable').datagrid("getRows");
				$.each(rows,function(index,row){
					outerloop:
					for (var i = 0; i < data.length; i++){
						if(row.name==data[i].name){
							flag = false;
							break outerloop;
						}
					}
				});
				if(flag){
					for (var i = 0; i < data.length; i++){
						$('#gridTable').datagrid('insertRow',{
							row: {
								id : data[i].id,
								typeName : data[i].typeName,
								name : data[i].name,
								key : data[i].key,
								orderNo : data[i].orderNo,
								tableId : data[i].tableId,
								type : data[i].type
							}
						});
					}
				}
			}
		}
		
		/**
		 * 删除修改为 行的删除
		 */

		UIUtil.getButton({
			value : "<-"
		}).css({
			"width" : "15px",
			"position" : "absolute",
			"top" : "50px",
			"left" : "0px"
		}).appendTo(AddAndDelbuttonDivDom)
				.on(
						"click",
						function(event) {
							var rowId=$("#gridTable").datagrid('getSelected');
						     if(!rowId){
						    	return;
						     }else{  
						    	 var index = $("#gridTable").datagrid('getRowIndex', rowId);  
						    	 $("#gridTable").datagrid('deleteRow', index);
						     } 
						});
		var buttonDivDom = null;
		buttonDivDom = UIUtil.getDiv({
			className : "gzl003"
		}).css({
			"position" : "absolute",
			"top" : "480px",
			"left" : "330px"
		}).appendTo(treeDialogDivDom);


		UIUtil.getButton({
			value : "确定"
		}).appendTo(buttonDivDom).on("click", {}, function(event) {
			var o = $("#gridTable");
			var rows = o.datagrid('getRows'); // 获取当前显示的记录
			var orderN=0;
			$.each(rows,function(index,row){
				orderN++;
//				alert(row.id);
//				if(row.id == ""){
//					alert(1);
//					row.id=orderN;
//				}
				row.orderNo=orderN;
			});
			var datas = {
					processor : rows,
					processorExp : ""
				};
			if (rows ==null) {
				forDom.attr("value", "");// 赋显示值
			} else {
				var jsonData = JSON.stringify(datas);
				var jsonDataTemp = JSON.parse(jsonData);
				if(typeof (jsonDataTemp)=="string"){
					jsonData = jsonDataTemp;
				}
				var stepExpObj=[];
				var stepName = "";
				var deptExp = "";
				var roleExp = "";
				var userExp = "";
				var deptName = "";
				var roleName = "";
				var userName = "";
				//1是部门，2是角色，3是人员
				for(var i = 0; i < rows.length; i++){
					if(rows[i].type == "1"){
						//部门
						deptExp +="," + rows[i].id;
						deptName +="," + rows[i].name;
					}else if(rows[i].type == "2"){
						//角色
						roleExp  +="," + rows[i].id;
						roleName  +="," + rows[i].name;
					}else if(rows[i].type == "3"){
						//人员表
						userExp  +="," + rows[i].id;
						userName  +="," + rows[i].name;
					}
				}
				if(deptExp != "" && deptExp.indexOf(",",0) == 0){
					deptExp = deptExp.substring(1);
				}
				if(deptName != "" && deptName.indexOf(",",0) == 0){
					deptName = deptName.substring(1);
				}
				if(roleExp != "" && roleExp.indexOf(",",0) == 0){
					roleExp = roleExp.substring(1);
				}
				if(roleName != "" && roleName.indexOf(",",0) == 0){
					roleName = roleName.substring(1);
				}
				if(userExp != "" && userExp.indexOf(",",0) == 0){
					userExp = userExp.substring(1);
				}
				if(userName != "" && userName.indexOf(",",0) == 0){
					userName = userName.substring(1);
				}
				stepExpObj.push({
					dept : deptExp,
					role : roleExp,
					user : userExp
				});
				stepName = "部门:"+deptName+";角色:"+roleName+";人员:"+userName+";";
				var stepExp = JSON.stringify(stepExpObj);
				var stepExpTemp = JSON.parse(stepExp);
				if(typeof (stepExpTemp)=="string"){
					stepExp = stepExpTemp;
				}
				forDom.attr("value", stepName);
				forDom.attr("realValue", stepExp);
				//forDom.attr("tempValue", jsonData);
				stepExpDom.attr("value", stepExp);
				stepExpDom.attr("realValue", stepExp);
				stepExpDom.trigger("change");
			}
			//forDom.trigger("change");
			treeDialogDivDom.dialog("close");
		});
		UIUtil.getButton({
			value : "取消"
		}).appendTo(buttonDivDom).on("click", {
			treeDialogDivDom : treeDialogDivDom
		}, closeLookupDialog);
		treeDialogDivDom.dialog("open");
		showDefaultRole();
		function showDefaultRole() {
			$.fn.zTree.destroy();
			$("#highGrade").hide();
			$("#usertaskNode").hide();
			$("#highGrade").hide();
			$("#highGrade1").hide();
			$("#k1").show();
			$("#hiddenType").val("2");
			$("#dep span:first").attr("class","bpmnDesignerbtnInEd");
			var settingdep = getSetting();
			$.ajax({
				url : url,
				type : "post",
				dataType : "json",
				data : {
					"type" : "2",
				},
				async : false,
				success : function(data) { // json格式转换成对象
					result = data.result;
					treeDom = $.fn.zTree.init($("#k1"), settingdep, result);
				}
			});
		}
		function confirm(event) {

			// forDom.attr("value", JSON.stringify(processor));// 赋显示值

			// event.data.treeDialogDivDom.dialog("close");

			var contentDom = $(lookUpDivDom.find("textarea")[0]);
			var jsonProcessor = JSON.stringify(processor);
			var jsonProcessorTemp = JSON.parse(jsonProcessor);
			if(typeof (jsonProcessorTemp)=="string"){
				jsonProcessor = jsonProcessorTemp;
			}
			forDom.attr("value", jsonProcessor);// 赋显示值
			forDom.trigger("change");

			event.data.treeDialogDivDom.dialog("close");

		}
		function closeLookupDialog(event) {
			$('#k').remove();
			event.data.treeDialogDivDom.dialog("close");
		}
		// 清空所有复选框
		function empty(event) {
			$('#k').remove();
			// $("#operatesDivDom").empty();
			alert("清空");
		}
	}
};