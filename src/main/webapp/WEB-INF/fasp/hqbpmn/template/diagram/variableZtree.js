/**
 * 变量池
 */
var VariableTree = {
		openVariableDialog:function(event) {
			// 定义一个变量数组，用于保存myflow中变量的值
			var variableJsonArray = [];
			var tableSelectVariableTreeDom = null;
			var operateType = event.data.operateType;
			var dialogDivDom = event.data.dialogDivDom;
			var ztreeDom=event.data.ztreeDom;
			var inputDomList=dialogDivDom.find("[name]");
			var perpertyTypeDom=null;
			var perpertyNameDom=null;
			var perpertyShowNameDom=null;
			var perpertyConfirmDom=null;
			var perpertyCancelDom = null;
			var fieldTableDom = null;
			var inputDom;
			var node = null;
			
			if (operateType == "add") {
				node = {
					    name:"",
					    type:"",
					    showName:""
				};
			} else if (operateType == "modify") {
				var nodes = ztreeDom.getSelectedNodes();
				if (nodes.length == 0) {
					alert("必须选择一个节点！");
					return;
				} else if (nodes.length > 1) {
					alert("最多只能选择一个节点！");
					return;
				}
				node = nodes[0];
			} else if (operateType == "selectAdd") {
				// 表树区域
				var treeId = event.data.id + "OfTableAddVariable";
				var tableDivDom = UIUtil.getDiv({}).css({"overflow":"auto", "width":"150px", "height":"350px","position":"absolute", "top": "40px"}).appendTo(dialogDivDom);
				tableUlDom = UIUtil.getUl({id:treeId, className:"ztree"});
				tableUlDom.appendTo(tableDivDom);
				createTableTree(tableUlDom, basePath+"bpmnAction/templateDef/findTableByBpmnType.do?tokenid="+tokenID, tableTreeOnClick, "");
				// 字段区域
				var fieldDivDom = UIUtil.getDiv({}).css({"position":"absolute", "top":"45px", "left":"200px"}).appendTo(dialogDivDom);
				// 字段表id
				var fieldTableId = event.data.id + "OfFieldAddVariable";
			    fieldTableDom = UIUtil.getTabel({id:fieldTableId});
				fieldTableDom.appendTo(fieldDivDom);
				
				// 追加按钮
				var buttonDivDom = UIUtil.getDiv({}).attr("class", "gzl003").css({"position":"absolute", "top":"380px", "left":"250px"}).appendTo(dialogDivDom);
				var confirmButton = UIUtil.getButton({value:"确定"}).on("click", {dialogDivDom:dialogDivDom,ztreeDom:ztreeDom}, clickConfirmButton).appendTo(buttonDivDom);
				var cancelButton = UIUtil.getButton({value:"取消"}).on("click", {dialogDivDom:dialogDivDom}, closeSelectFieldDialog).appendTo(buttonDivDom);
			}
			
			if (operateType == "add" || operateType == "modify") {
				$(inputDomList).each(function(index,inputDiv){
					inputDom=$(inputDiv);
					switch (inputDom.attr("name")) {
						case "perpertyType":
							inputDom.val(node.type);
							perpertyTypeDom=inputDom;
							break;
						case "perpertyName":
							inputDom.val(node.name);
							perpertyNameDom=inputDom;
							break;
						case "perpertyShowName":
							inputDom.val(node.showName);
							perpertyShowNameDom=inputDom;
							break;
						case "perpertyConfirm":
							perpertyConfirmDom=inputDom;
							break;
						case "perpertyCancel":
							perpertyCancelDom=inputDom;
							break;
						default:
							break;
					}
				});
				dialogDivDom.dialog({
					onClose:function(){
						perpertyConfirmDom.off("click",variableTreeChange);
						perpertyCancelDom.off("click",variableDialogClose);
					}
				});
				
				if (perpertyConfirmDom != null && perpertyCancelDom != null) {
					perpertyConfirmDom.off("click",variableTreeChange);
					perpertyConfirmDom.on("click",{dialogDivDom:dialogDivDom,
													perpertyTypeDom:perpertyTypeDom,
													perpertyNameDom:perpertyNameDom,
													perpertyShowNameDom:perpertyShowNameDom,
													ztreeDom:ztreeDom,
													changeType:operateType
													},variableTreeChange);
					perpertyCancelDom.off("click",variableDialogClose);
					perpertyCancelDom.on("click",{dialogDivDom:dialogDivDom},variableDialogClose);
				}
			}
			dialogDivDom.dialog("open"); 
			
			// 关闭选择字段的dialog
			function closeSelectFieldDialog(event) {
				var dialogDivDom = event.data.dialogDivDom;
				dialogDivDom.dialog("close");
			}
			
			// 关闭增加或者修改变量树dialog
			function variableDialogClose(event) {
				var dialogDivDom = event.data.dialogDivDom;
				dialogDivDom.dialog("close");
			}

			// 改变变量池树节点
			function variableTreeChange(event) {
				// 改变的类型
				var changeType = event.data.changeType;
				var dialogDivDom = event.data.dialogDivDom;
				var type = event.data.perpertyTypeDom.val();
				var name = event.data.perpertyNameDom.val();
				var showName = event.data.perpertyShowNameDom.val();
				if (name == null || name == "" || name == undefined) {
					alert("名称不能为空！");
					return;
				}
				if (showName == null || showName == "" || showName == undefined) {
					alert("显示名称不能为空！");
					return;
				}
				var ztreeDom = event.data.ztreeDom;
			    var newNodes = {id:"", processDefinitionId:"",name:name,type:type,showName:showName};
				if (changeType == "add") {
					ztreeDom.addNodes(null, newNodes);
					$(ztreeDom).trigger("change",{changeNode:newNodes,changeType:changeType});
				} else if (changeType == "modify") {
					var selectNode = (ztreeDom.getSelectedNodes())[0];
					var oldName = selectNode.name;
					selectNode.type = type;
					selectNode.name = name;
					selectNode.showName = showName;
					ztreeDom.updateNode(selectNode);
					$(ztreeDom).trigger("change",{changeNode:selectNode,changeType:changeType,oldName:oldName});
				}
				dialogDivDom.dialog("close");  
			}	

			// 打开选择字段dialog中创建左侧的表树
			function createTableTree(ulDom, url, treeOnClick, tableId) {
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
								title : "",
								url:url
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
					 url:url,
			         type:"post",  
			         data:"bpmnType=" + _myflow.$bpmnType,
			         dataType:"json", 
			         async:false,
			         success:function(data) {  
			        	 if (data.success) {
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
							tableSelectVariableTreeDom = $.fn.zTree.init(ulDom, setting, nodes).expandAll(true); 
			         }else {
							alert(data.message);
						}
			         }   
			     }); 
			}
			
			// 加载列表数据
			function loadFieldDataGrid(theData){
				fieldTableDom.datagrid({
				    data: theData,
				    datatype: "local",
				    fitColumns: true,
				    title : "字段",
				    columns:[[
						        {field:'id',title:'ID',width:10,align:'center',hidden:true},
						        {field:'dbName',title:'名称',width:20,align:'center'},
						        {field:'name',title:'显示名称',width:20,align:'center'},
						        {field:'type',title:'类型',width:20,align:'center',hidden:true}
						    ]],
					singleSelect: false,
				    height: 270,
				    width:430,
				    onSelect:onSelect
			    });
				
				// 当前行被选中或者去勾选的时候
				function onSelect(rowid, rowData) {
	                var data = $("#"+rowid +">td"); //获取这个行里所有的td元素，即：获取所有子元素
	                var tableId =rowData.tableId;
	                var fieldId = rowData.id;
	                var name = rowData.dbName;
	                var showName = rowData.name;
	                
	                var variableObj = {
							id:id,
							processDefinitionId:"",
							name:name,
							showName:showName,
							// 目前类型暂时设置为string
							type:"string",
							tableId:tableId,
							fieldId:fieldId
					};
					
					// 避免变量树中出现重复数据
					var nodes = ztreeDom.getNodes();
					if (rowData) {
							var flag = true;
							if(nodes.length != 0){
								
							}
							$.each(nodes, function(index, data){
								if (data.tableId == variableObj.tableId && data.fieldId == variableObj.fieldId) {
									flag = false;
									return false;
								}
							});
							$.each(variableJsonArray, function(index, item){
								if (item.tableId == variableObj.tableId && item.fieldId == variableObj.fieldId) {
									flag = false;
									return false;
								}
							});
							if (flag) {
								variableJsonArray.push(variableObj);
							}
						
					} else {
						variableJsonArray.shift(variableObj);
					}
	            }
			}
			// 选择字段dialog中点击表节点的时候调用
			function tableTreeOnClick(event, treeId, treeNode){
				$.ajax({
					url:basePath+"bpmnAction/templateDef/findFieldByTableId.do?tokenid="+tokenID,
					type:"POST",
					data:"tableId=" + treeNode.id,
					dataType:"json",
					async:false,
					success:function(pr, textStatus) {
						var mydata = pr.result;
						loadFieldDataGrid(mydata);
					}
				});	
				
				// 回显字段，需要根据myflow中变量的值和数组的值进行回显
				var variableValue = _myflow.exportData().diagram.variable.variable;
				if (variableValue.length > 0) {
					$(variableValue).each(function(index,data){
						// 如果当前选择的字段被修改后，这时候就不应该回显，目前暂时没有处理
						if (data.tableId == treeNode.id) {
							fieldTableDom.find("tr[id= '" + data.fieldId + "']").find("input").eq(0).attr("checked", "checked");
						}
					});
				}
				// 通过数组的值进行回显
				if (variableJsonArray.length > 0) {
					$(variableJsonArray).each(function(index,data){
						// 如果当前选择的字段被修改后，这时候就不应该回显，目前暂时没有处理
						if (data.tableId == treeNode.id) {
							fieldTableDom.find("tr[id= '" + data.fieldId + "']").find("input").eq(0).attr("checked", "checked");
						}
					});
				}
			}

			// 当点击选择字段列表中“确定”按钮时，这时候需要把数组的值设置到json串变量中。
			function clickConfirmButton(event) {
				var dialogDivDom = event.data.dialogDivDom;
			    var ztreeDom = event.data.ztreeDom;
			    var variableJson = eval(variableJsonArray);
			    for (var i = 0,length = variableJson.length; i < length; i++) {
			    	ztreeDom.addNodes(null, variableJson[i]);
			    	$(ztreeDom).trigger("change",{changeNode:variableJson[i],changeType:"add"});
			    }
			    dialogDivDom.dialog("close");
			}
		}, 
		
		getTreePropertyDialogDivDom:function(config){
			var divDom= $("<div>",{
				title:config.title
			}).attr("class", "gzl003");
			var tableDom=$("<table>",{
				border:"0",
				cellpadding:"10",
				cellspacing:"10"
			}).css({"height":"200px", "width":"300px"}).appendTo(divDom);
			
			var trDom=$("<tr>");
			trDom.appendTo(tableDom);
			$("<td>",{
			    text:"类型"	
			}).attr("class","gzl007").appendTo(trDom);
			var tdInputDom=$("<td>").appendTo(trDom);
			$("<select>",{
				name:"perpertyType"
			}).attr("class","gzl005").append($("<option>",{
				value:"string",
				text:"字符串"
			})).appendTo(tdInputDom);
			
			trDom=$("<tr>");
			trDom.appendTo(tableDom);
			$("<td>",{
			    text:"名称"	
			}).attr("class","gzl007").appendTo(trDom);
			var tdInputDom=$("<td>").appendTo(trDom);
			$("<input>",{
				type:"text",
				name:"perpertyName"
			}).attr("class","gzl005").appendTo(tdInputDom);
			
			trDom=$("<tr>");
			trDom.appendTo(tableDom);
			$("<td>",{
			    text:"显示名称"	
			}).attr("class","gzl007").appendTo(trDom);
			var tdInputDom=$("<td>").appendTo(trDom);
			$("<input>",{
				type:"text",
				name:"perpertyShowName"
			}).attr("class","gzl005").appendTo(tdInputDom);
			
			trDom=$("<tr>");
			trDom.appendTo(tableDom);
			$("<td>").appendTo(trDom);
			var buttonTdDom=$("<td>",{
				align:"center",
				colspan:3
			}).attr("class","gzl007").appendTo(trDom);
			UIUtil.getButton({
				name:"perpertyConfirm",
				value : "确定"
			}).appendTo(buttonTdDom);
			UIUtil.getButton({
				name:"perpertyCancel",
				value : "取消"
			}).appendTo(buttonTdDom);
			
			return divDom;
		},
		
		// 创建树
		createTree:function(jqDom, zNodes) {
			var setting = {
					data:{
						key : {
							name : "showName",
							title : "",
						},
						simpleData : {
							enable : false,
							idKey : "id",
							pIdKey : "",
							rootPId : null
						}
					}
		    };
		    return $.fn.zTree.init(jqDom, setting, zNodes);
		},

		// 删除节点
		variableTreeDelete:function(event) {
			var ztreeDom=event.data.ztreeDom;
			var nodes = ztreeDom.getSelectedNodes();
			if (nodes.length == 0) {
				alert("必须选择节点！");
				return;
			}
			if (confirm("确认删除吗？")) {
				var selectNode = nodes[0];
				ztreeDom.removeNode(selectNode);
				$(ztreeDom).trigger("change",{changeNode:selectNode,changeType:"delete"});
			} 
		}
}