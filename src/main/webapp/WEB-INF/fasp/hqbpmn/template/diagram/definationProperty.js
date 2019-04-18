/**
 * 工作流、节点、连接线属性渲染对象
 */
var DefinationProperty = {
	newObject : function(config) {
		var targetDomObj = config.targetDomObj;
		if (!targetDomObj) {
			return null;
		}

		var contentDomObj = null;
		var newObject = {
			contentDomObj : contentDomObj,
			showPropertyInfo : rendPropertyDiv,
			changePropertyInfo : changeProperty,
			rendInfo : getField
		};

		return newObject;

		function changeProperty(elementData) {
			$.each(elementData, function(fieldId, fieldValue) {
//				$("input").trigger("change" + fieldId + "Value", fieldValue);
			});
		}

		/**
		 * 渲染属性面板信息 parameters : elementData : 元素属性数据 id : 元素ID type :
		 * 元素类型，包括node,line,diagram
		 */
		function rendPropertyDiv(elementData, id, type) {
			targetDomObj.empty();
			contentDomObj = UIUtil.getDiv({
				id : "divContent"
			});
			contentDomObj.appendTo(targetDomObj);
			
			// 渲染名称、坐标等信息
			rendDiagramAccordion(elementData, id, type);

			// 渲染分组信息
			var elementDictObj;
			if (type == "line") {
				elementDictObj = FlowDict.SequenceFlow;
			} else {
				elementDictObj = FlowDict[elementData.type];
			}
			$.each(elementDictObj, function(groupId, groupDictObj) {
				rendAccordion(groupId, elementData[groupId], groupDictObj, id,
						type);
			});
			accordion();
		}

		/**
		 * 渲染属性收缩框信息
		 */
		function rendAccordion(groupId, groupObj, groupDictObj, id, type) {
			var label = groupDictObj.label ? groupDictObj.label : groupId;
			var commonDiv=UIUtil.getDiv({
				title: label,
				css : {
					margin : "0px"
				}
			}).appendTo(contentDomObj);
			var accordionDomObj = UIUtil.getDiv({
				css : {
					margin : '0px'
				}
			}).appendTo(commonDiv);
			var fieldDomDiv;
			var tabelDomDiv = UIUtil.getTabel({
				border : 0
			});
			tabelDomDiv.appendTo(accordionDomObj);
			$.each(groupDictObj, function(fieldId, fieldDictObj) {
				if (typeof (fieldDictObj) == "object") {
					fieldDomDiv = getField(groupId, fieldId,
							groupObj ? groupObj[fieldId] : "",
							groupObj ? groupObj[fieldId + "ShowValue"]
							: undefined,groupObj ? groupObj[fieldId + "TempValue"]
							: undefined ,fieldDictObj, id, type);
					tabelDomDiv.append(fieldDomDiv);
				}
			});
		}

		/**
		 * 渲染字段信息
		 */
		function getField(groupId, fieldId, fieldValue, fieldShowValue,fieldTempValue,
				fieldDictObj, id, type) {
			if (typeof (fieldDictObj.editor) == "string") {
				fieldDictObj.editor = {
					type : fieldDictObj.editor
				};
			}
			var editorType = fieldDictObj.editor.type;
			var fieldDomDiv;
			switch (editorType) {
			case "text":
				fieldDomDiv = getPropertyText(groupId, fieldId, fieldValue,
						fieldDictObj, id, type);
				break;
			case "textarea":
				fieldDomDiv = getPropertyTextarea(groupId, fieldId, fieldValue,
						fieldDictObj, id, type);
				break;
			case "radio":
				fieldDomDiv = getPropertyRadio(groupId, fieldId, fieldValue,
						fieldDictObj, id, type);
				break;
			case "checkbox":
				fieldDomDiv = getPropertyCheckbox(groupId, fieldId, fieldValue,
						fieldDictObj, id, type);
				break;
			case "textAreaLookup":
				fieldDomDiv = getPropertyTextAreaLookup(groupId, fieldId,
						fieldValue, fieldShowValue,fieldTempValue, fieldDictObj, id, type);
				break;
			case "tree":
				fieldDomDiv = getPropertyTree(groupId, fieldId, fieldValue,
						fieldDictObj, id, type);
				break;
			case "select":
				fieldDomDiv = getPropertySelect(groupId, fieldId, fieldValue,
						fieldDictObj, id, type);
				break;
			case "tableAreaLookup":
				fieldDomDiv = getPropertyTableLookup(groupId, fieldId,
						fieldValue, fieldDictObj, id, type);
				break;
			default:
				alert("editorType:" + editorType + " need develop!");
				break;
			}
			return fieldDomDiv;
		}

		function getPropertyTree(groupId, fieldId, fieldValue, fieldDictObj,
				id, type) {
			var trDomObj = UIUtil.getTr();

			var treePropertyDialogDivDom = VariableTree
					.getTreePropertyDialogDivDom({
						title : fieldDictObj.label
					});
			treePropertyDialogDivDom.appendTo(targetDomObj);
			treePropertyDialogDivDom.dialog({
				width : 450,
				height : 260,
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
				}
			});

			var selectFieldDialogDivDom = UIUtil.getDiv({
				title : fieldDictObj.label
			});
			selectFieldDialogDivDom.appendTo(targetDomObj);
			selectFieldDialogDivDom.dialog({
				width : 650,
				height : 450,
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
				onClose : function() {
					// 清空内容
					selectFieldDialogDivDom.empty();
				}
			});

			var tdDomObj = UIUtil.getTd({});
			tdDomObj.appendTo(trDomObj);
			var addButtonDomObj = UIUtil.getButton({
				value : "新增"
			}).appendTo(tdDomObj);

			var selectButtonDomObj = UIUtil.getButton({
				value : "选择"
			});
			selectButtonDomObj.appendTo(tdDomObj);

			var modifyButtonDomObj = UIUtil.getButton({
				value : "修改"
			});
			modifyButtonDomObj.appendTo(tdDomObj);

			var deleteButtonDomObj = UIUtil.getButton({
				value : "删除"
			});
			deleteButtonDomObj.appendTo(tdDomObj);

			var ulDivDom = UIUtil.getDiv({}).css({
				"overflow" : "auto",
				"height" : "200px"
			}).appendTo(tdDomObj);
			;
			// 树tree
			var ulDomObj = UIUtil.getUl({
				id : groupId + "_" + fieldId,
				className : "ztree"
			}).appendTo(ulDivDom);
			//如果fielValue是字符串，则改为数组start
			if (typeof fieldValue == "string") {
				 fieldValue = eval('(' + fieldValue + ')');
			}
			//如果fielValue是字符串，则改为数组end
			// 树append后开始构造树
			var ztreeDom = VariableTree.createTree(ulDomObj, fieldValue=="[]"?"":fieldValue);
			addButtonDomObj.on("click", {
				operateType : "add",
				dialogDivDom : treePropertyDialogDivDom,
				ztreeDom : ztreeDom
			}, VariableTree.openVariableDialog);
			selectButtonDomObj.on("click", {
				operateType : "selectAdd",
				dialogDivDom : selectFieldDialogDivDom,
				ztreeDom : ztreeDom,
				id : groupId,
				ulDivDom : ulDivDom
			}, VariableTree.openVariableDialog);
			modifyButtonDomObj.on("click", {
				operateType : "modify",
				dialogDivDom : treePropertyDialogDivDom,
				ztreeDom : ztreeDom
			}, VariableTree.openVariableDialog);
			deleteButtonDomObj.on("click", {
				ztreeDom : ztreeDom
			}, VariableTree.variableTreeDelete);

			$(ztreeDom).on("change", {
				groupId : groupId,
				fieldId : fieldId,
				id : id,
				type : type
			}, changeObject);
			return trDomObj;
		}

		function changeObject(event, triggerData) {
			var eventData = event.data;
			if (eventData.type == "diagram") {
				var fieldData = _myflow.$diagramData[eventData.groupId][eventData.fieldId];
				if (triggerData.changeType == "add") {
					var flag = true;
					var trId;
					if(eventData.fieldId=="variable"){
						trId = triggerData.changeNode.id;
					}else{
						trId = triggerData.changeData.id;
					}
					$.each(fieldData,function(i,k){
						if(k.id==trId){
							flag = false;
						}
					});
					if(flag||eventData.fieldId=="variable"){
						//fieldData.push(triggerData.changeNode);
						if (typeof fieldData == "string") {
							fieldData = new Array();
							_myflow.$diagramData[eventData.groupId][eventData.fieldId] = fieldData;
						}
						fieldData.push(triggerData.changeNode);
					}
				} else if (triggerData.changeType == "modify") {
					var oldName = triggerData.oldName;
					$(fieldData).each(function(index, data) {
						if (data.name == oldName) {
							data.type = triggerData.changeNode.type;
							data.name = triggerData.changeNode.name;
							data.showName = triggerData.changeNode.showName;
							return false;
						}
					});
				} else if (triggerData.changeType == "delete") {
					$(fieldData).each(function(index, data) {
						if (data.name == triggerData.changeNode.name) {
							fieldData.splice(index, 1);
							return false;
						}
					});
				}
			} else if (eventData.type == "node") {
				if (_myflow.$nodeData[eventData.id][eventData.groupId] == undefined) {
					_myflow.$nodeData[eventData.id][eventData.groupId] = {};
					_myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId] = [];
				} else if (_myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId] == undefined
						|| (typeof _myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId]) == "string") {
					
					if(_myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId] != ""){
						_myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId] = eval("("+_myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId]+")");
					}else{
						_myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId] = [];
					}
				}
				var fieldData = _myflow.$nodeData[eventData.id][eventData.groupId][eventData.fieldId];
				if (triggerData.changeType == "add") {
					var flag = true;
					var trId = triggerData.changeData.id;
					$.each(fieldData,function(i,k){
						if(k.id==trId){
							flag = false;
						}
					});
					if(flag){
						fieldData.push(triggerData.changeData);
					}
				} else if (triggerData.changeType == "modify") {
					var idIndex = triggerData.idIndex;
					var changeData = triggerData.changeData;
					$(fieldData).each(function(index, data) {
						if (data[idIndex] == changeData[idIndex]) {
							$.each(changeData, function(key, value) {
								data[key] = value;
							});
							return false;
						}
					});
				} else if (triggerData.changeType == "delete") {
					$(fieldData).each(function(index, data) {
					    //解决业务驱动不能删除监听的问题start
						//if (data[triggerData.idIndex] == triggerData.rowId) {
						if (triggerData.idIndex == data.id) {
						//解决业务驱动不能删除监听的问题end
							fieldData.splice(index, 1);
							return false;
						}
					});
				}
			} else if (eventData.type == "line") {
				if (_myflow.$lineData[eventData.id][eventData.groupId] == undefined) {
					_myflow.$lineData[eventData.id][eventData.groupId] = {};
					_myflow.$lineData[eventData.id][eventData.groupId][eventData.fieldId] = [];
				} else if ((typeof _myflow.$lineData[eventData.id][eventData.groupId][eventData.fieldId]) == "string") {
					
					if(_myflow.$lineData[eventData.id][eventData.groupId][eventData.fieldId] != ""){
						_myflow.$lineData[eventData.id][eventData.groupId][eventData.fieldId] = eval("("+_myflow.$lineData[eventData.id][eventData.groupId][eventData.fieldId]+")");
					}else{
						_myflow.$lineData[eventData.id][eventData.groupId][eventData.fieldId] = [];
					}
				}
				var fieldData = _myflow.$lineData[eventData.id][eventData.groupId][eventData.fieldId];
				if (triggerData.changeType == "add") {
					var flag = true;
					var trId = triggerData.changeData.id;
					$.each(fieldData,function(i,k){
						if(k.id==trId){
							flag = false;
						}
					});
					if(flag){
						fieldData.push(triggerData.changeData);
					}
				} else if (triggerData.changeType == "modify") {
					var idIndex = triggerData.idIndex;
					var changeData = triggerData.changeData;
					$(fieldData).each(function(index, data) {
						if (data[idIndex] == changeData[idIndex]) {
							$.each(changeData, function(key, value) {
								data[key] = value;
							});
							return false;
						}
					});
				} else if (triggerData.changeType == "delete") {
					$(fieldData).each(function(index, data) {
						//解决业务驱动不能删除监听的问题start
						//if (data[triggerData.idIndex] == triggerData.rowId) {
						if (triggerData.idIndex == data.id) {
						//解决业务驱动不能删除监听的问题end
							fieldData.splice(index, 1);
							return false;
						}
					});
				}
			} else {
				alert("in changeObject...");
			}
		}

		function getPropertyTableLookup(groupId, fieldId, fieldValue,
				fieldDictObj, id, type) {
			var trDomObj = UIUtil.getTr().css("width", "100%").css("height", "150px");
			var tdDomObj = UIUtil.getTd({});
			tdDomObj.appendTo(trDomObj);
			var tableDomObj = UIUtil.getTabel({
				id : groupId + "_" + fieldId + "_table"
			});
			if (typeof fieldValue == "string") {
				fieldValue = eval(fieldValue);
			}
			setTimeout(function() {
				var columns = new Array();
				  var cols = new Array();
				  var colData = new Object();
				$.each(fieldDictObj.editor.colModel, function(i, k) {    
					colData = new Object();
			        colData.field = k.index;
			        colData.title = k.label;
			        colData.hidden = k.hidden;
			        colData.width = k.width;
			        cols.push(colData);
				});
				columns.push(cols);
				tableDomObj.datagrid({
					data : fieldValue,
					fit:true,//自动补全
					columns : columns,
					fitColumns:true,
					singleSelect : true
				            	
				});
			}, 10);

			var addDomObj = UIUtil.getButton({
				value : "新增"
			}).appendTo(tdDomObj);
//			var modifyDomObj = UIUtil.getButton({
//				value : "修改"
//			}).appendTo(trDomObj);
			var deleteDomObj = UIUtil.getButton({
				value : "删除"
			}).appendTo(tdDomObj);

			if (isEndof(fieldDictObj.editor.dataSource,
					FlowConstant.LISTENER_DATASOURCE_EXT_NAME)) {
				//监听中添加修改按钮 ——Start
				var modifyDomObj = UIUtil.getButton({
					value : "修改"
				}).appendTo(tdDomObj);
				//监听中添加修改按钮 ——End
				var dialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				}).css("height","450px").css("overflow","hidden");
				dialogDivDom.appendTo(targetDomObj);

				var param = {
					forDom : tableDomObj,
					dialogDivDom : dialogDivDom,
					id : groupId + "_" + fieldId,
					idIndex : fieldDictObj.editor.idIndex,
					listenerType : fieldDictObj.editor.dataSource
				};
				addDomObj.on("click", $.extend({}, param, {
					changeType : "add"
				}), FieldLookUp.showExcutionListenerLookUp);
				modifyDomObj.on("click", $.extend({}, param, {
					changeType : "modify"
				}), FieldLookUp.showExcutionListenerLookUp);
				deleteDomObj.on("click", $.extend({}, param, {
					changeType : "delete"
				}), FieldLookUp.showExcutionListenerLookUp);
			} else if (isEndof(fieldDictObj.editor.dataSource,
					FlowConstant.PARAMETER_DATASOURCE_NAME)) {
				var dialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label,
					css : {
						display : "none"
					}
				});
				dialogDivDom.appendTo(targetDomObj).dialog(
						FlowConstant.DIAGRAM_SETTING);

				var param = {
					forDom : tableDomObj,
					dialogDivDom : dialogDivDom,
					id : groupId + "_" + fieldId,
					idIndex : fieldDictObj.editor.idIndex,
					//添加渲染类型
					parameterType : fieldDictObj.editor.dataSource
				};
				addDomObj.on("click", $.extend({}, param, {
					changeType : "add"
				}), FieldLookUp.showParameterLookUp);
//				modifyDomObj.on("click", $.extend({}, param, {
//					changeType : "modify"
//				}), FieldLookUp.showParameterLookUp);
				deleteDomObj.on("click", $.extend({}, param, {
					changeType : "delete"
				}), FieldLookUp.showParameterLookUp);
			} else {
				alert("dataSource:" + fieldDictObj.editor.dataSource
						+ " need develop!");
			}
			tableDomObj.appendTo(tdDomObj);
			tableDomObj.on("change", {
				groupId : groupId,
				fieldId : fieldId,
				id : id,
				type : type
			}, changeObject);
			return trDomObj;
		}

		function isEndof(sourceString, endString) {// 判断sourceString是否以endString结尾，如果是则返回true
			if (typeof sourceString != "string" || typeof endString != "string"
					|| endString.length == 0
					|| sourceString.length < endString.length) {
				return false;
			} else if (sourceString.substring(sourceString.length
					- endString.length) == endString) {
				return true;
			}
			return false;
		}

		function getPropertyTextAreaLookup(groupId, fieldId, fieldValue,
				fieldShowValue,fieldTempValue, fieldDictObj, id, type) {
			var trDomObj = UIUtil.getTr({
				"className" : groupId+"_"+fieldId
			});
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			});
			tdDomObj.appendTo(trDomObj);
			var labelDomObj = UIUtil.getLabel({
				label : fieldDictObj.label
			});
			labelDomObj.appendTo(tdDomObj);
			var validataDomObj = $("<font>",{text:"*"})
			.css({
				color : "red",
				"margin-left" : "2px"
			});
			
			var textDomObj = null;
			var buttonDomObj = null;
			textDomObj = UIUtil.getTextarea_lookup({
				value : fieldValue,
				showValue : fieldShowValue,
				tempValue : fieldTempValue
			});
			buttonDomObj = UIUtil.getButton({
				value : "选择"
			});
			buttonDomObj.css("position","relative");
			textDomObj.css("margin-bottom","10px");
			textDomObj.css("vertical-align","bottom");
			buttonDomObj.css("display","inline-block");
			buttonDomObj.css("padding-left","7px");
			buttonDomObj.css("padding-right","7px");
			buttonDomObj.css("margin-bottom","10px");
			if (fieldDictObj.editor.dataSource == FlowConstant.CANDIDATION_DATASOURCE_NAME) {
				var dialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label,
					className : "gzl003",
					css : {
						"width" : "100%"
					}
				});
				dialogDivDom.appendTo(targetDomObj);
				buttonDomObj.on("click", {
					forDom : textDomObj,
					dialogDivDom : dialogDivDom,
					id : groupId + "_" + fieldId,
					elementId : id
				}, FieldLookUp.showCandidationLookUp);
			} else if (fieldDictObj.editor.dataSource == FlowConstant.BUSINESSPRIVILEGE_DATASOURCE_NAME) {
				// 业务权限
				var dialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				dialogDivDom.appendTo(targetDomObj);
				buttonDomObj.on("click", {
					forDom : textDomObj,
					dialogDivDom : dialogDivDom,
					id : groupId + "_" + fieldId
				}, FieldLookUp.showPrivilegeLookUp);
			}else if(fieldDictObj.editor.dataSource == FlowConstant.CANDIDATE_SHOW_TYPE){
				//显示类型
				var dialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				dialogDivDom.appendTo(targetDomObj).dialog(
						FlowConstant.DIAGRAM_SETTING);
				buttonDomObj.on("click", {
					forDom : textDomObj,
					dialogDivDom : dialogDivDom,
					id : groupId + "_" + fieldId
				}, FieldLookUp.showCandidateShowType);
				
			}else if (fieldDictObj.editor.dataSource == FlowConstant.TIMESERVICE_DATASOURCE_NAME) {
				// 时间服务
				var dialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label,
					css : {
						display : "none"
					}
				});
				dialogDivDom.appendTo(targetDomObj).dialog(
						FlowConstant.DIAGRAM_SETTING);
				buttonDomObj.on("click", {
					forDom : textDomObj,
					dialogDivDom : dialogDivDom,
					id : groupId + "_" + fieldId
				}, FieldLookUp.showTimeServiceLookUp);
			}else if(fieldDictObj.editor.dataSource == FlowConstant.PROCESSID_DATASOURCE_NAME){
				//流程Id
//				var dialogDivDom = UIUtil.getDiv({
//					title : fieldDictObj.label
//				});
//				dialogDivDom.append(UIUtil.getUl({
//					id : groupId + "_" + fieldId,
//					className : "ztree"
//				}));
//				dialogDivDom.appendTo(targetDomObj).dialog(
//						FlowConstant.DIAGRAM_SETTING);
//				buttonDomObj.on("click", {
//					forDom : textDomObj,
//					dialogDivDom : dialogDivDom,
//					id : groupId + "_" + fieldId
//				}, FieldLookUp.showPrcessIdsLookUp);
//				}, FieldLookUp.showCustomButtonLookUp);
				
				
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				var queryDivDom = null;
				var trDom = null;
				treeDialogDivDom.append(UIUtil.getUl({
					id : groupId + "_" + fieldId,
					className : "ztree"
				}).css({
					"overflow" : "auto",
					"height" : "280px",
					"border" : "1px solid #84C1FF"
				}));

				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);

				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource
				}, FieldLookUp.showPrcessIdsLookUp);
			}
			else if (fieldDictObj.editor.dataSource == FlowConstant.CUSTOMBUTTON_DATASOURCE_NAME) {
				// 定制按钮
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				var queryDivDom = null;
				var trDom = null;
				treeDialogDivDom.append(UIUtil.getUl({
					id : groupId + "_" + fieldId,
					className : "ztree"
				}));

				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog({
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
						onClose : function() {
							// 清空内容
							treeDialogDivDom.empty();
						}
				});

				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource
				}, FieldLookUp.showCustomButtonLookUp);
			}else if (fieldDictObj.editor.dataSource == FlowConstant.CUSTOMPROPERTY_DATASOURCE_NAME) {
				// 流转线自定义属性
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				var queryDivDom = null;
				var trDom = null;
				treeDialogDivDom.append(UIUtil.getUl({
					id : groupId + "_" + fieldId,
					className : "ztree"
				}));

				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog({
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
						onClose : function() {
							// 清空内容
							treeDialogDivDom.empty();
						}
				});

				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource
				}, FieldLookUp.showcustomPropertyLookUp);
			} else if (fieldDictObj.editor.dataSource == FlowConstant.WEIGHT_DATASOURCE_NAME) {
				// 权重
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				}).css("overflow","hidden");
				var queryDivDom = null;
				var trDom = null;

				// 当类型为用户时追加查询区域
				queryDivDom = UIUtil.getDiv({
					className : "gzl003"
				}).appendTo(treeDialogDivDom);

				var selectUserTdDom = UIUtil.getTd({}).css("width", "200px");
				var treeDivDom = UIUtil.getDiv({}).css({
					"overflow" : "auto",
					"height" : "300px",
					"width" : "240px",
					"position" : "absolute",
					"top" : "50px",
					"border" : "2px solid #84C1FF",
					"margin-left" : "10px"
				}).append(UIUtil.getUl({
					id : groupId + "_" + fieldId,
					className : "ztree"
				})).appendTo(selectUserTdDom);
				trDom = UIUtil.getTr({}).append(selectUserTdDom);
				var tableDom = UIUtil.getTabel({}).append(trDom);

				var treeUlDivDom = UIUtil.getDiv({}).append(tableDom);
				treeDialogDivDom.append(tableDom);

				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);

				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource
				}, FieldLookUp.showweightUp);
			}else if (fieldDictObj.editor.dataSource == FlowConstant.DEPARTMENT_AND_ROLE_DATASOURCE_NAME) {
				//TODO 部门角色
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				}).css("overflow","hidden");
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
				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);
				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource,
					elementId : id
				}, FieldLookUp.showDepartmentAndRoleLookUp);	
			}else if (fieldDictObj.editor.dataSource == FlowConstant.DEFAULT_DEPARTMENT_AND_ROLE_DATASOURCE_NAME) {
				//TODO 部门角色
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				}).css("overflow","hidden");
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
				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);
				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource,
					elementId : id
				}, FieldLookUp.showDepartmentAndRoleLookUp);	
			}else if(fieldDictObj.editor.dataSource == FlowConstant.CANDIDATE_HIGH_GRADE_NAME){
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				}).css("overflow","hidden");
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
				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);
				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource,
					elementId : id
				}, FieldLookUp.showCandidateHighGradeConfigLookUp);	
			}else if(fieldDictObj.editor.dataSource == FlowConstant.CANDIDATION_GROUP_AND_USER_DATASOURCE_NAME){
				//线上条件的候选人
				//validataDomObj.appendTo(tdDomObj);
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				treeDialogDivDom.append(UIUtil.getUl({
					id : groupId + "_" + fieldId,
					className : "ztree"
				}));
				var showNameDom = UIUtil.getDiv({
					className : "gzl003"
				}).appendTo(targetDomObj);
				treeDialogDivDom.appendTo(targetDomObj);
				buttonDomObj.on("click", {
					forDom : showNameDom,
					treeDialogDivDom : treeDialogDivDom,
					expDom : textDomObj
				}, FieldLookUp.showSequenceCandidateHighGradeConfigLookUp);
			}else if(fieldDictObj.editor.dataSource == FlowConstant.BUSINESS_FORM_DATASOURCE_NAME){
				//业务表单
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				treeDialogDivDom.append(UIUtil.getUl({
					id : groupId + "_" + fieldId,
					className : "ztree"
				}));
				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);

				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					type : fieldDictObj.editor.dataSource
				}, FieldLookUp.selectBusinessFormsLookUp);
			
				
				
				
			}else if (fieldDictObj.editor.dataSource == FlowConstant.CANDIDATION_USER_DATASOURCE_NAME
					|| fieldDictObj.editor.dataSource == FlowConstant.CANDIDATION_GROUP_DATASOURCE_NAME) {
				function getTreeDialogDivDom(config) {
					return $("<div>", {
						title : config.title
					}).append($("<ul>", {
						id : config.id,
						"class" : "ztree"
					}));
				}
				var treeDialogDivDom = UIUtil.getDiv({
					title : fieldDictObj.label
				});
				var queryDivDom = null;
				var trDom = null;
				if (fieldDictObj.editor.dataSource == FlowConstant.CANDIDATION_USER_DATASOURCE_NAME) {
					// 当类型为用户时追加查询区域
					queryDivDom = UIUtil.getDiv({
						className : "gzl003"
					}).appendTo(treeDialogDivDom);

					var selectUserTdDom = UIUtil.getTd({})
							.css("width", "200px");
					//修改节点的处理组的样式
					var treeDivDom = UIUtil.getDiv({})/*.css({
						"overflow" : "auto",
						"height" : "300px",
						"width" : "240px",
						"position" : "absolute",
						"top" : "50px",
						"border" : "2px solid #84C1FF"
					})*/.append(UIUtil.getUl({
						id : groupId + "_" + fieldId,
						className : "ztree"
					})).appendTo(selectUserTdDom);
					trDom = UIUtil.getTr({}).append(selectUserTdDom);
					var tableDom = UIUtil.getTabel({}).append(trDom);

					var treeUlDivDom = UIUtil.getDiv({}).append(tableDom);
					treeDialogDivDom.append(tableDom);
				} else if (fieldDictObj.editor.dataSource == FlowConstant.CANDIDATION_GROUP_DATASOURCE_NAME) {
					//修改节点的处理组的样式
					/*treeDialogDivDom.append($("<div>").css({
						"border": "1px solid rgb(132, 193, 255)",
						"position" : "absolute",
					    "overflow" : "auto",
					    "height" : "290px", 
					    "width"  : "545px", 
					    "top" : "46px",
					    "margin-left" : "20px"
					}).append(UIUtil.getUl({
						id : groupId + "_" + fieldId,
						className : "ztree"
					})));*/
				}
				
				treeDialogDivDom.appendTo(targetDomObj);
				treeDialogDivDom.dialog(FlowConstant.DIAGRAM_SETTING);

				buttonDomObj.on("click", {
					forDom : textDomObj,
					treeDialogDivDom : treeDialogDivDom,
					queryDivDom : queryDivDom,
					trDom : trDom,
					type : fieldDictObj.editor.dataSource
				}, FieldLookUp.selectCandidationLookUp);
			}

			textDomObj.on("change", {
				groupId : groupId,
				fieldId : fieldId,
				id : id,
				type : type,
				imgType : fieldDictObj.editor.type
			}, changeData);

			tdDomObj = UIUtil.getTd({});
			buttonDomObj.appendTo(tdDomObj);
			textDomObj.appendTo(tdDomObj);
			buttonDomObj.appendTo(tdDomObj);
			tdDomObj.appendTo(trDomObj);

			return trDomObj;
		}

		function getPropertyTextarea(groupId, fieldId, fieldValue,
				fieldDictObj, id, type) {
			var trDomObj = UIUtil.getTr({
				"className" : groupId+"_"+fieldId
			});
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			});
			tdDomObj.appendTo(trDomObj);
			var labelDomObj = UIUtil.getLabel({
				label : fieldDictObj.label
			});
			labelDomObj.appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({});
			tdDomObj.appendTo(trDomObj);
			var textDomObj = UIUtil.getTextarea({
				value : fieldValue
			});
			textDomObj.on("change", {
				groupId : groupId,
				fieldId : fieldId,
				id : id,
				type : type,
				imgType : fieldDictObj.editor.type
			}, changeData);
			textDomObj.appendTo(tdDomObj);

			return trDomObj;
		}

		function getPropertySelect(groupId, fieldId, fieldValue, fieldDictObj,
				id, type) {
			var trDomObj = UIUtil.getTr({
				"className" : groupId+"_"+fieldId
			});
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			});
			tdDomObj.appendTo(trDomObj);
			var labelDomObj = UIUtil.getLabel({
				label : fieldDictObj.label
			});
			labelDomObj.appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({});
			tdDomObj.appendTo(trDomObj);
			var selectDomObj = UIUtil.getSelect({
				readOnly : fieldDictObj.editor.readOnly
			});
			if(fieldDictObj.editor.readOnly){
				selectDomObj.attr("disabled" , "disabled");
				if(selectDomObj[0].attributes["class"].value == "gzl005"){
					selectDomObj.css("background","#E1E1E1");
					selectDomObj.css("color","#828282");
				}
			}
			var fff = $(".general_completeConditionType").find(".gzl005").val();
			if(fff == 'oneVoteVeto'){
				$(".general_completeCondition").find(".gzl005").val("");
				$(".general_completeCondition").find(".gzl005").css({'background':'#E1E1E1','color':'#828282'});
				$(".general_completeCondition").find(".gzl005").attr({"disabled":true});
				}
			var callProcessId = "";
			if (type != "assignment") {
				if(type != "fatherParameter"){
					if(type != "parameter"){
						if(type != "callProcess"){
							selectDomObj.on("change", {
								groupId : groupId,
								fieldId : fieldId,
								id : id,
								type : type,
								imgType : fieldDictObj.editor.type
							}, changeData);
						}
					}else{
						selectDomObj.on("click", function(){
							var callProcessIdTemp =  $(this).parent().parent().parent().children().eq(0).children().find("select").val();
							if(callProcessId != callProcessIdTemp){
								callProcessId = callProcessIdTemp;
								//selectDomObj.find("option").remove(); 
								$.ajax({
									url : basePath + "bpmnAction/templateDef/findBpmnVariable.do?tokenid="+tokenID,
									data : "processIdStr="+callProcessId,
									type : "post",
									dataType : "json",
									async : false,
									success : function(data) {
										var result = data.result;
										var pdId = result[0].processDefinitionId;
										var arrayTemp = [];
										options = [];
										var option;
										$(result).each(function(index, code) {
											selectDomObj.empty();
											option = {};
											if(!contains(arrayTemp,code.TABLEIDS)){
												arrayTemp.push(code.TABLEIDS);
												formIdsStr += code.TABLEIDS;
												formIdNamesStr += code.TABLEIDNAMES;
											}
											if(fieldDictObj.editor.dataSource == "inputTargetClass"){
												option[code.name] = code.name;
											}else if(fieldDictObj.editor.dataSource == "outputSourceClass"){
												option[code.name] = '${'+code.name+'}';
											}
											options.push(option);
										});
										options = UIUtil.getOptions({
											options : options,
											value : fieldValue
										});
										$(options).each(function(index, option) {
											option.appendTo(selectDomObj);
										});
										
										$.ajax({
											url : basePath + "bpmnAction/templateDef/findBpmnFormInfo.do?tokenid="+tokenID,
											data : "pdId="+pdId,
											type : "post",
											dataType : "json",
											async : false,
											success : function(pr) {
												var formInfo = pr.result;
												//添加绑定流程表单字段的变量_start
												if(formInfo[0].FORMIDS != undefined && formInfo[0].FORMIDS != "" && formInfo[0].FORMIDS != "null"){
													var tableIds = formInfo[0].FORMIDS.split(",");
													var tableIdNames = formInfo[0].FORMIDNAMES.split(",");
													if(tableIds.length > 0){
														for (var i=0;i<tableIds.length ;i++ ) {
															selectDomObj.append("<optgroup label='" + tableIdNames[i] + "'>");
															$.ajax({
																url:basePath+"bpmnAction/templateDef/findFieldByTableId.do?tokenid="+tokenID,
																type:"POST",
																data:"tableId=" + tableIds[i],
																dataType:"json",
																async:false,
																success:function(pr, textStatus) {
																	fields = pr.result;
																	if(fields.length > 0){
																		for (var j = 0; j < fields.length; j++) { 
																			if(fieldDictObj.editor.dataSource == "outputSourceClass"){
																				selectDomObj.append("<option key='" + tableIds[i] + "' value='${" + fields[j].dbName + "}'>" + fields[j].name + "</option>");
																			}else if(fieldDictObj.editor.dataSource == "inputTargetClass"){
																				selectDomObj.append("<option key='" + tableIds[i] + "' value='" + fields[j].dbName + "'>" + fields[j].name + "</option>");
																			}
																		}
																	}
																	selectDomObj.append("</optgroup>");
																}
															});	
														}
													}
												}
												//添加绑定流程表单字段的变量_end
											}
										});
									}
								});
							}
							if(callProcessId == ""){
								alert("请选择！引用流程ID");
								return;
							}
						});
					}
				}
			}
			selectDomObj.appendTo(tdDomObj);
			var options;
			var tableIdsStr = _myflow.exportData().diagram.bpmn.bpmnBusinessForms;
			var tableIdNamesStr = _myflow.exportData().diagram.bpmn.bpmnBusinessFormsShowValue;
			if(type == "fatherParameter"){
				var result = _myflow.exportData().diagram.variable.variable;
				var option;
				options = [];
				var option;
				$(result).each(function(index, code) {
					option = {};
					if(fieldDictObj.editor.dataSource == "inputSourceClass"){
						option[code.showName] = '${'+code.name+'}';
					}else if(fieldDictObj.editor.dataSource == "outputTargetClass"){
						option[code.showName] = code.name;
					}
					options.push(option);
				});
				
				optionsDom = UIUtil.getOptions({
					options : options
				});
				$(optionsDom).each(function(index, option) {
					option.appendTo(selectDomObj);
				});
					//添加绑定流程表单字段的变量_start
				if(tableIdsStr != undefined && tableIdsStr != "" && tableIdsStr != "null"){
					var tableIds = tableIdsStr.split(",");
					var tableIdNames = tableIdNamesStr.split(",");
					if(tableIds.length > 0){
						for (var i=0;i<tableIds.length ;i++ ) {
							selectDomObj.append("<optgroup label='" + tableIdNames[i] + "'>");
							$.ajax({
								url:basePath+"bpmnAction/templateDef/findFieldByTableId.do?tokenid="+tokenID,
								type:"POST",
								data:"tableId=" + tableIds[i],
								dataType:"json",
								async:false,
								success:function(pr, textStatus) {
									fields = pr.result;
									if(fields.length > 0){
										for (var j = 0; j < fields.length; j++) { 
											if(fieldDictObj.editor.dataSource == "inputSourceClass"){
												//option[code.showName] = '${'+code.name+'}';
												selectDomObj.append("<option key='" + tableIds[i] + "' value='${" + fields[j].dbName + "}'>" + fields[j].name + "</option>");
											}else if(fieldDictObj.editor.dataSource == "outputTargetClass"){
												//option[code.showName] = code.name;
												selectDomObj.append("<option key='" + tableIds[i] + "' value='" + fields[j].dbName + "'>" + fields[j].name + "</option>");
											}
										}
									}
									selectDomObj.append("</optgroup>");
								}
							});	
						}
					}
				}
				//添加绑定流程表单字段的变量_end
			}else if(type == "callProcess"){
				var result = id.split(",");
				var option;
				options = [];
				var option;
				$(result).each(function(index, code) {
					option = {};
					option[code] = code;
					options.push(option);
				});
				
				optionsDom = UIUtil.getOptions({
					options : options
				});
				$(optionsDom).each(function(index, option) {
					option.appendTo(selectDomObj);
				});
			}else if(type != "parameter"){
				if (fieldDictObj.editor.dataSource) {
					var url = null;
					var data = null;
					var formIdsStr = "";
					var formIdNamesStr = "";
					if (fieldDictObj.editor.dataSource == "bathComplete") {
						data = "buttonType=['2']";
						url = basePath + "bpmnAction/templateDef/getCustomButton.do?tokenid="+tokenID;
						//data = "";
					}else if (fieldDictObj.editor.dataSource == FlowConstant.CUSTOM_CLASS_CONDITION) {
						data = "buttonType=['4']";
						url = basePath + "bpmnAction/templateDef/getCustomButton.do?tokenid="+tokenID;
						
					} else if(fieldDictObj.editor.dataSource == "inputTargetClass" || fieldDictObj.editor.dataSource == "outputSourceClass"){
						url = basePath + "bpmnAction/templateDef/findBpmnVariable.do?tokenid="+tokenID;
//						if(selectProcessId == ""){
//							data = "processIdStr=null";
//						}else{
						data = "processIdStr="+callProcessId;
//						}
						//添加绑定流程表单字段的变量_start
						//添加绑定流程表单字段的变量_end
					} else if(fieldDictObj.editor.dataSource == "defaultFlow1"){
						var lines = _myflow.$lineData;
						options = [];
						$.each(lines,function(key,line){
							if(line.from == id){
								var option = {};
								if(line.name != null && line.name != ""){
									option[line.name] = key;
								}else{
									option[key] = key;
								}
								options.push(option);
							}
						});
						optionsDom = UIUtil.getOptions({
							options : options,
							value : fieldValue
						});
						$(optionsDom).each(function(index, option) {
							selectDomObj.append(option);
						});
					}
					else {
						url = basePath + "bpmnAction/templateDef/findBpmnCodeByType.do?tokenid="+tokenID;
						data = "codeType=" + fieldDictObj.editor.dataSource;
					}
					$.ajax({
						url : url,
						data : data,
						type : "post",
						dataType : "json",
						async : false,
						success : function(data) {
							var result = data.result;
							var arrayTemp = [];
							options = [];
							var option;
							$(result).each(function(index, code) {
								option = {};
								if(!contains(arrayTemp,code.TABLEIDS)){
									arrayTemp.push(code.TABLEIDS);
									formIdsStr += code.TABLEIDS;
									formIdNamesStr += code.TABLEIDNAMES;
								}
								if (fieldDictObj.editor.dataSource == "bathComplete") {
									option['['+code.codeKey+']'+code.codeName] = code.codeKey;
								}else if(fieldDictObj.editor.dataSource == "inputTargetClass"){
									option[code.name] = code.name;
								}else if(fieldDictObj.editor.dataSource == "outputSourceClass"){
									option[code.name] = '${'+code.name+'}';
								}else if(fieldDictObj.editor.dataSource == "taskDescription"){
									option['['+code.codeKey+']'+code.codeName] = code.codeKey;
								}else if(fieldDictObj.editor.dataSource == "customCondition"){
									option['['+code.codeKey+']'+code.codeName] = code.codeKey;
								}else{
									option[code.codeName] = code.codeKey;
								}
								options.push(option);
							});
							options = UIUtil.getOptions({
								options : options,
								value : fieldValue
							});
							$(options).each(function(index, option) {
								option.appendTo(selectDomObj);
							});
						}
					});
				} else {
					options = UIUtil.getOptions({
						options : fieldDictObj.editor.options,
						value : fieldValue
					});
					$(options).each(function(index, option) {
						
						option.appendTo(selectDomObj);
					});
					selectDomObj.on('change',function(){
						if(selectDomObj[0].value == "oneVoteVeto"){
							$(".general_completeCondition").find(".gzl005").val("");
							$(".general_completeCondition").find(".gzl005").css({'background':'#E1E1E1','color':'#828282'});
							$(".general_completeCondition").find(".gzl005").attr({"disabled":true});
							$(".general_approveCondition").find(".gzl005").css({'background':'#E1E1E1','color':'#828282'});
							$(".general_approveCondition").find(".gzl005").val("");
							$(".general_approveCondition").find(".gzl005").attr({"disabled":true});
						}else{
							$(".general_completeCondition").find(".gzl005").css({'background':'#FFFFFF','color':'#646464'});
							$(".general_completeCondition").find(".gzl005").attr({"disabled":false});
							$(".general_approveCondition").find(".gzl005").css({'background':'#FFFFFF','color':'#646464'});
							$(".general_approveCondition").find(".gzl005").attr({"disabled":false});
						}
					});
				}
			}
			return trDomObj;
		}
		function contains(arr, obj){
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] === obj){
					return true;
				}
			}
		return false;
		}
		
		function getPropertyRadio(groupId, fieldId, fieldValue,
				fieldDictObj, id, type) {
			var options = fieldDictObj.editor.options;
			if (fieldDictObj.editor.dataSource) {
				$.ajax({
					url : basePath + "bpmnAction/templateDef/findBpmnCodeByType.do?tokenid="+tokenID,
					type : "post",
					data : "codeType=" + fieldDictObj.editor.dataSource,
					dataType : "json",
					async : false,
					success : function(data) {
						var result = data.result;
						options = [];
						var option;
						$(result).each(function(index, code) {
							option = {};
							option[code.codeName] = code.codeKey;
							options.push(option);
						});
					}
				});
			}
			var trDomObj = UIUtil.getTr();
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			});
			tdDomObj.appendTo(trDomObj);
			var labelDomObj = UIUtil.getLabel({
				label : fieldDictObj.label
			});
			labelDomObj.appendTo(tdDomObj);

			var checkboxDomObj;
			tdDomObj = UIUtil.getTd({});
			tdDomObj.appendTo(trDomObj);
			$(options).each(function(index, option) {
				$.each(option, function(label, value) {
					labelDomObj = UIUtil.getLabel({
						label : label
					});
					radioDomObj = UIUtil.getRadio({
						name : id+"_"+fieldId+"_radio",
						value : value,
						checked : fieldValue == value ? true : false
					});
					radioDomObj.on("change", {
						groupId : groupId,
						fieldId : fieldId,
						id : id,
						type : type,
						imgType : fieldDictObj.editor.type
					}, changeData);
					if(fieldValue==""){
						if(label=="并发"||label=="等待"||label=="发起人"){
							radioDomObj.attr("checked","checked");
							radioDomObj.trigger("change", {
								groupId : groupId,
								fieldId : fieldId,
								id : id,
								type : type,
								imgType : fieldDictObj.editor.type
							});
						}
					}
					labelDomObj.css("position","relative");
					labelDomObj.css("margin-bottom","10px");
					radioDomObj.css("margin-bottom","10px");
					labelDomObj.css("vertical-align","bottom");
					labelDomObj.css("display","inline-block");
					tdDomObj.append(radioDomObj);
					tdDomObj.append(labelDomObj);
				});
			});

			return trDomObj;
		}

		function getPropertyCheckbox(groupId, fieldId, fieldValue,
				fieldDictObj, id, type) {
			var options = fieldDictObj.editor.options;
			if (fieldDictObj.editor.dataSource) {
				$.ajax({
					url : basePath + "bpmnAction/templateDef/findBpmnCodeByType.do?tokenid="+tokenID,
					type : "post",
					data : "codeType=" + fieldDictObj.editor.dataSource,
					dataType : "json",
					async : false,
					success : function(data) {
						var result = data.result;
						options = [];
						var option;
						$(result).each(function(index, code) {
							option = {};
							option[code.codeName] = code.codeKey;
							options.push(option);
						});
					}
				});
			}
			var trDomObj = UIUtil.getTr();
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			});
			tdDomObj.appendTo(trDomObj);
			var labelDomObj = UIUtil.getLabel({
				label : fieldDictObj.label
			});
			labelDomObj.appendTo(tdDomObj);
			var checkboxDomObj;
			tdDomObj = UIUtil.getTd({});
			tdDomObj.appendTo(trDomObj);
			$(options).each(function(index, option) {
				$.each(option, function(label, value) {
					labelDomObj = UIUtil.getLabel({
						label : label
					});
					labelDomObj.appendTo(tdDomObj);
					if(fieldValue==undefined){
						fieldValue='';
					}
					var chkarr = fieldValue.split(',');
					checkboxDomObj = UIUtil.getCheckbox({
						name : id+"_"+fieldId+"_chk",
						value : value,
						checked : $.inArray(value, chkarr)==-1?false:true
					});
					checkboxDomObj.on("change", {
						groupId : groupId,
						fieldId : fieldId,
						id : id,
						type : type,
						imgType : fieldDictObj.editor.type
					}, changeData);
					labelDomObj.css("position","relative");
					labelDomObj.css("margin-bottom","10px");
					checkboxDomObj.css("margin-bottom","10px");
					labelDomObj.css("vertical-align","bottom");
					labelDomObj.css("display","inline-block");
					tdDomObj.append(checkboxDomObj);
					tdDomObj.append(labelDomObj);
				});
			});

			return trDomObj;
		}

		function getPropertyText(groupId, fieldId, fieldValue, fieldDictObj,
				id, type) {
			var trDomObj = UIUtil.getTr({
				"className" : groupId+"_"+fieldId
			});
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			});
			tdDomObj.appendTo(trDomObj);
			var labelDomObj = UIUtil.getLabel({
				label : fieldDictObj.label
			});
			labelDomObj.appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({});
			tdDomObj.appendTo(trDomObj);			
			var textDomObj = UIUtil.getInput({
				value : fieldValue,
				readOnly : fieldDictObj.editor.readOnly
			});
			var fff = $(".general_completeConditionType").find(".gzl005").val();
			if(fff == 'oneVoteVeto'){
				$(".general_approveCondition").find(".gzl005").val("");
				$(".general_approveCondition").find(".gzl005").css({'background':'#E1E1E1','color':'#828282'});
				$(".general_approveCondition").find(".gzl005").attr({"disabled":true});
			}
			if(fieldDictObj.editor.readOnly){
				textDomObj.attr({"disabled":true});
				if(textDomObj[0].attributes["class"].value == "gzl005"){
					textDomObj.css("background","#E1E1E1");
					textDomObj.css("color","#828282");
				}
			}
			textDomObj.on("change", {
				groupId : groupId,
				fieldId : fieldId,
				id : id,
				type : type,
				imgType : fieldDictObj.editor.type
			}, changeData);
			textDomObj.appendTo(tdDomObj);
			return trDomObj;
		}
		function valiData(event){
			var eventData = event.data;
			var value = $(event.target).val();
			var nodeP = _myflow.$nodeData;
			var flag = false;
			var msg = "存在相同名称节点";
			var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
			$.each(nodeP,function(i,k){
				if(!containSpecial.test(k.name)){
					if(value==k.name&&eventData.id!=i&&eventData.type!="line"){
						flag = true;
						$(event.target).val(eventData.id);
						_myflow.setName(eventData.id, eventData.id, eventData.type);
					}
				}else{
					flag = true;
					$(event.target).val(eventData.id);
					_myflow.setName(eventData.id, eventData.id, eventData.type);
					msg = "节点中存在特殊字符";
				}
			});
			if(flag){
				alert(msg);
				return;
			}
		}
		/**
		 * event内包括：groupId,fieldId,id,type,imgType
		 */
		function changeData(event) {
			var eventData = event.data;
			var value;
			var showValue = null;
			var tableName = null;
			var tempValue = null;
			switch (eventData.imgType) {
			case "checkbox":
				var chk_value =[];
				$('input[name="'+$(event.target).attr("name")+'"]:checked').each(function(){
					chk_value.push($(this).val()); 
				}); 
				value = chk_value.join(",");
				debugger;
				//如果是撤销，变成绿色；如果是退回，变成红色；如果都有，则变成黑色
				var node = _myflow.$nodeData[eventData.id];
				if (node != null && node.type != "Subprocess") {
					if (value && "toBeReturned" == eventData.fieldId
							&& node.extendConfig.toBeRevoked == false) {
						// 只有退回
						$("#"+eventData.id+".GooFlow_item").css("background", "#2DB291");
					} else if (value && "toBeRevoked" == eventData.fieldId
							&& node.extendConfig.toBeReturned == false) {
						// 只有撤销
						$("#"+eventData.id+".GooFlow_item").css("background", "#86B22D");
					} else if (value
							&& ((node.extendConfig.toBeReturned == "true"&&eventData.fieldId=="toBeRevoked") || (node.extendConfig.toBeRevoked == "true"&&eventData.fieldId=="toBeReturned"))) {
						// 既有退回又有撤销
						$("#"+eventData.id+".GooFlow_item").css("background", "#2D9CB2");
					}else if (value == ""
							&& (node.extendConfig.toBeReturned == "true" && node.extendConfig.toBeRevoked == "true")) {
						if (eventData.fieldId != "toBeReceived" && eventData.fieldId != "createSubTask" && eventData.fieldId != "showType") {
							// 既有退回又有撤销,又有其它checkbox被选中时，去掉撤销或者退回时
							if (eventData.fieldId == "toBeRevoked") {
								//去掉撤销
								$("#" + eventData.id + ".GooFlow_item").css(
										"background", "#2DB291");
							} else if(eventData.fieldId == "toBeReturned"){
								//去掉退回
								$("#" + eventData.id + ".GooFlow_item").css(
										"background", "#86B22D");
							}else if(eventData.fieldId == "toBeFreedomNode"){
								$("#"+eventData.id+".GooFlow_item").css("border", "none");
							}
						}else if(node.extendConfig.toBeReturned == "true"&& node.extendConfig.toBeRevoked == "true"&&eventData.fieldId=="toBeReceived"){
							$("#"+eventData.id+".GooFlow_item").css("background", "#2D9CB2");
						}
					}else if (value == "true"
							&& (node.extendConfig.toBeReturned == "true" && node.extendConfig.toBeRevoked == "true")) {
						if (eventData.fieldId != "toBeReceived" && eventData.fieldId != "createSubTask" && eventData.fieldId != "showType") {
							 if(eventData.fieldId == "toBeFreedomNode"){
								$("#"+eventData.id+".GooFlow_item").css("border", "#ffc90e 4px solid");
							}
						}else if(node.extendConfig.toBeReturned == "true"&& node.extendConfig.toBeRevoked == "true"&&eventData.fieldId=="toBeReceived"){
							$("#"+eventData.id+".GooFlow_item").css("background", "#2D9CB2");
						}
					}else if(node.extendConfig.toBeRevoked == ""&& node.extendConfig.toBeReturned == "true"&&eventData.fieldId=="toBeReturned"){
						//最后去掉退回时
						$("#"+eventData.id+".GooFlow_item").css("background", "#0686dd");
					}else if(node.extendConfig.toBeReturned == ""&& node.extendConfig.toBeRevoked == "true"&&eventData.fieldId=="toBeRevoked"){
						//最后去掉撤销时
						$("#"+eventData.id+".GooFlow_item").css("background", "#0686dd");
					}else if( value && "toBeFreedomNode" == eventData.fieldId && node.extendConfig.toBeFreedomNode == ""){
						$("#"+eventData.id+".GooFlow_item").css("border", "#ffc90e 4px solid");
					}else if(value == "true"&&"toBeFreedomNode" == eventData.fieldId &&node.extendConfig.toBeReturned == "" && node.extendConfig.toBeRevoked == "true"){
						//只有撤销，勾选是否自由流时
						$("#"+eventData.id+".GooFlow_item").css("background", "#86B22D");
						$("#"+eventData.id+".GooFlow_item").css("border", "#ffc90e 4px solid");
					}else if(value == "true"&&"toBeFreedomNode" == eventData.fieldId &&node.extendConfig.toBeRevoked == "" && node.extendConfig.toBeReturned == "true"){
						//只有退回，勾选是否自由流时
						$("#"+eventData.id+".GooFlow_item").css("background", "#2DB291");
						$("#"+eventData.id+".GooFlow_item").css("border", "#ffc90e 4px solid");
					}else if(value == "true" && node.extendConfig.toBeReturned == "" && node.extendConfig.toBeRevoked == "" && "toBeFreedomNode" == eventData.fieldId){
						//只勾选是否自由流时
						$("#"+eventData.id+".GooFlow_item").css("border", "#ffc90e 4px solid");
					}else if(value == "" && node.extendConfig.toBeReturned == "" && node.extendConfig.toBeRevoked == "" && "toBeFreedomNode" == eventData.fieldId){
						//最后去掉是否自由流时
						$("#"+eventData.id+".GooFlow_item").css("border", "none");
					}else if(value == ""&&"toBeFreedomNode" == eventData.fieldId &&node.extendConfig.toBeReturned == "" && node.extendConfig.toBeRevoked == "true"){
						//只有撤销，去掉是否自由流时
						$("#"+eventData.id+".GooFlow_item").css("background", "#86B22D");
						$("#"+eventData.id+".GooFlow_item").css("border", "none");
					}else if(value == ""&&"toBeFreedomNode" == eventData.fieldId &&node.extendConfig.toBeRevoked == "" && node.extendConfig.toBeReturned == "true"){
						//只有退回，去掉是否自由流时
						$("#"+eventData.id+".GooFlow_item").css("background", "#2DB291");
						$("#"+eventData.id+".GooFlow_item").css("border", "none");
					}
				}
				break;
			case "textAreaLookup":
				if ($(event.target).attr("realValue") != null
						&& $(event.target).attr("realValue") != undefined) {					
					if(event.type == 'change' && event.data.fieldId == 'candidateHighGradeConfig' && $(this).val() == ""){
						value = $(event.target).val();
						tempValue = $(event.target).val();
						showValue = $(event.target).val();
					}else if(event.type == 'change' && event.data.fieldId == 'candidateGroups' && $(this).val() == ""){
						value = $(event.target).val();
						showValue = $(event.target).val();
					}else if(event.type == 'change' && event.data.fieldId == 'bpmnBusinessForms' && $(this).val() == ""){
						value = $(event.target).val(); 
						showValue = $(event.target).val();
					}else{
						value = $(event.target).attr("realValue");
						var value1 =  $(event.target).attr("value");  
						if(value == value1 && event.data.fieldId  == 'candidateHighGradeConfig'){
							value = $(event.target).attr("realValue");
						}else if(value != value1 && event.data.fieldId == 'collectionGroup'){
							value = $(event.target).attr("realValue");
						}else if(value != value1 && event.data.fieldId == 'candidateGroups'){
							value = $(event.target).attr("realValue");
						}else if(value != value1 && event.data.fieldId == 'bpmnBusinessForms'){
							value = $(event.target).attr("realValue");
						}else{
							value = value1;
						}
						showValue = $(event.target).val();
						if($(event.target).attr("tempValue") != null && $(event.target).attr("tempValue") != undefined ){
							tempValue = $(event.target).attr("tempValue");
						}
						if($(event.target).attr("tableName") != null
								&& $(event.target).attr("tableName") != undefined){
							tableName = $(event.target).attr("tableName");
						}
					}												
				} else {
					value = $(event.target).val();
				}
				break;
			default:
				value = $(event.target).val();
				break;
			}
			if (eventData.type == "node") {
				valiData(event);
				var node = _myflow.$nodeData[eventData.id];
				if (eventData.fieldId == "left" || eventData.fieldId == "top") {
					var left = eventData.fieldId == "left" ? value : node.left;
					var top = eventData.fieldId == "top" ? value : node.top;
					_myflow.moveNode(eventData.id, left, top);
				} else if (eventData.fieldId == "width"
						|| eventData.fieldId == "height") {
					var width = eventData.fieldId == "width" ? value
							: node.width;
					var height = eventData.fieldId == "height" ? value
							: node.height;
					_myflow.resizeNode(eventData.id, width, height);
				} else if (eventData.fieldId == "name") {
					_myflow.setName(eventData.id, value, eventData.type);
					//定制按钮和节点名称联动start
					var nodeData = _myflow.$nodeData;
					$.each(nodeData,function(index,node){
						if(node.extendConfig != undefined && node.extendConfig.customButton != undefined && node.extendConfig.customButton != ""){
							var customButtons = JSON.parse(node.extendConfig.customButton);
							var customButtonsString;
							var arr = [];
							for(var i = 0; i < customButtons.length; i++){
								var temp = customButtons[i].buttonProcessor;
								if(temp != undefined && temp != ""){
									for(var j = 0; j < temp.length; j++){
										if(temp[j].taskKeys == eventData.id){
											temp[j].taskKeyNames = value;
										}
									}
								}
								arr.push(customButtons[i]);
							}
							if(arr.length > 0){
								customButtonsString = JSON.stringify(arr);
							}
							if(customButtonsString != undefined){
								node.extendConfig.customButton = customButtonsString;
							}
						}
					});
					//定制按钮和节点名称联动end
				} else if (eventData.fieldId == "id") {
					_myflow.transNewId(eventData.id, value, eventData.type);
					_myflow.blurItem();
					_myflow.focusItem(value, true);
				} else {
					if ((typeof node[eventData.groupId]) == "undefined") {
						node[eventData.groupId] = {};
					}
					node[eventData.groupId][eventData.fieldId] = value;
					if (showValue != null) {
						node[eventData.groupId][eventData.fieldId + "ShowValue"] = showValue;
					}
				}
			} else if (eventData.type == "line") {
				var line = _myflow.$lineData[eventData.id];
				if (eventData.fieldId == "name") {
					_myflow.setName(eventData.id, value, eventData.type);
				} else if (eventData.fieldId == "id") {
					_myflow.transNewId(eventData.id, value, eventData.type);
					_myflow.blurItem();
					_myflow.focusItem(value, true);
				} else {
					if ((typeof line[eventData.groupId]) == "undefined") {
						line[eventData.groupId] = {};
					}
					line[eventData.groupId][eventData.fieldId] = value;
					if (showValue != null) {
						line[eventData.groupId][eventData.fieldId + "ShowValue"] = showValue;
					}
				}
			} else if (eventData.type == "diagram") {
				if (eventData.fieldId == "name") {
					_myflow.$title = value;
				} else {
					if ((typeof _myflow.$diagramData[eventData.groupId]) == "undefined") {
						_myflow.$diagramData[eventData.groupId] = {};
					}
					_myflow.$diagramData[eventData.groupId][eventData.fieldId] = value;
					if (showValue != null) {
						_myflow.$diagramData[eventData.groupId][eventData.fieldId
								+ "ShowValue"] = showValue;
					}
					if(tempValue != null){
						_myflow.$diagramData[eventData.groupId][eventData.fieldId
						        								+ "TempValue"] = tempValue;
					}
					if (tableName != null) {
						_myflow.$diagramData[eventData.groupId][eventData.fieldId
						        								+ "TableName"] = tableName;
					}
				}
			} else {
				alert("in changeData...");
			}
		}

		/**
		 * 渲染目标DOM为手风琴收缩框
		 */
		function accordion() {
			contentDomObj.accordion({});  
//			contentDomObj.accordion({
//				heightStyle : "content"// 高度自适应
//			});
		}

		function changeFieldValue(event, triggerData) {
			$(event.target).val(triggerData);
		}

		/**
		 * 渲染视图元素基础属性收缩框信息
		 */
		function rendDiagramAccordion(elementData, id, type) {
			var porpDiv=UIUtil.getDiv({
				title: "属性信息",
				css : {
					margin : "0px"
				}
			}).appendTo(contentDomObj);
			var accordionDomObj = UIUtil.getDiv({
				css : {
					margin : '0px'
				}
			}).appendTo(porpDiv);
			var tabelDomDiv = UIUtil.getTabel({
				border : 0
			}).appendTo(accordionDomObj);
			// 渲染ID
			var trDomObj = UIUtil.getTr().appendTo(tabelDomDiv);
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			}).appendTo(trDomObj);
			UIUtil.getLabel({
				label : "ID"
			}).appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
			// UIUtil.getInput({value:id,readOnly:elementData.type=="Diagram"?true:false})
			var textDomObj=UIUtil.getInput({
				value : id,
				readOnly : true,
			}).on("change", {
				fieldId : "id",
				id : id,
				type : type
			}, changeData).appendTo(tdDomObj);
			if(tdDomObj[0].childNodes[1].attributes["readonly"].value == "readonly"){
				textDomObj.attr({"disabled":true});
				if(textDomObj[0].attributes["class"].value == "gzl005"){
					textDomObj.css("background","#E1E1E1");
					textDomObj.css("color","#828282");
				}
			}

			// 渲染名称
			var trDomObj = UIUtil.getTr().appendTo(tabelDomDiv);
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			}).appendTo(trDomObj);
			UIUtil.getLabel({
				label : "名称"
			}).appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
			UIUtil.getInput({
				value : elementData.name
			}).on("change", {
				fieldId : "name",
				id : id,
				type : type
			}, changeData).on("blur",{
				fieldId : "name",
				id : id,
				type : type,
				value : elementData.name
			}, valiData).appendTo(tdDomObj);

			if (type == "diagram" || type == "line") {// 判断类型是否为视图或连接线
				return;
			}

			// 渲染X坐标
			/*var trDomObj = UIUtil.getTr().appendTo(tabelDomDiv);
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			}).appendTo(trDomObj);
			UIUtil.getLabel({
				label : "X"
			}).appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
			var textDomObj=UIUtil.getInput({
				value : elementData.left,
				readOnly : true
			}).on("change", {
				fieldId : "left",
				id : id,
				type : type
			}, changeData).on("changeleftValue", changeFieldValue).appendTo(
					tdDomObj);
			if(tdDomObj[0].childNodes[1].attributes["readonly"].value == "readonly"){
				textDomObj.attr("disabled" , "disabled");
				if(textDomObj[0].attributes["class"].value == "gzl005"){
					textDomObj.css("background","#E1E1E1");
					textDomObj.css("color","#828282");
				}
			}
*/
			// 渲染Y坐标
			/*var trDomObj = UIUtil.getTr().appendTo(tabelDomDiv);
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			}).appendTo(trDomObj);
			UIUtil.getLabel({
				label : "Y"
			}).appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
			var textDomObj=UIUtil.getInput({
				value : elementData.top,
				readOnly : true
			}).on("change", {
				fieldId : "top",
				id : id,
				type : type
			}, changeData).on("changetopValue", changeFieldValue).appendTo(
					tdDomObj);
			if(tdDomObj[0].childNodes[1].attributes["readonly"].value == "readonly"){
				textDomObj.attr({"disabled":true});
				if(textDomObj[0].attributes["class"].value == "gzl005"){
					textDomObj.css("background","#E1E1E1");
					textDomObj.css("color","#828282");
				}
			}

			if (elementData.type == "StartEvent"
					|| elementData.type == "EndEvent") {// 判断是否为开始结束节点
				return;
			}*/

			// 渲染长
			/*var trDomObj = UIUtil.getTr().appendTo(tabelDomDiv);
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			}).appendTo(trDomObj);
			UIUtil.getLabel({
				label : "高"
			}).appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
			var textDomObj=UIUtil.getInput({
				value : elementData.height,
				readOnly : true
			}).on("change", {
				fieldId : "height",
				id : id,
				type : type
			}, changeData).on("changeheightValue", changeFieldValue).appendTo(
					tdDomObj);
			if(tdDomObj[0].childNodes[1].attributes["readonly"].value == "readonly"){
				textDomObj.attr({"disabled":true});
				if(textDomObj[0].attributes["class"].value == "gzl005"){
					textDomObj.css("background","#E1E1E1");
					textDomObj.css("color","#828282");
				}
			}*/

			// 渲染宽
			/*var trDomObj = UIUtil.getTr().appendTo(tabelDomDiv);
			var tdDomObj = UIUtil.getTd({
				"className" : "gzl007"
			}).appendTo(trDomObj);
			UIUtil.getLabel({
				label : "宽"
			}).appendTo(tdDomObj);

			tdDomObj = UIUtil.getTd({}).appendTo(trDomObj);
			var textDomObj=UIUtil.getInput({
				value : elementData.width,
				readOnly : true
			}).on("change", {
				fieldId : "width",
				id : id,
				type : type
			}, changeData).on("changewidthValue", changeFieldValue).appendTo(
					tdDomObj);
			if(tdDomObj[0].childNodes[1].attributes["readonly"].value == "readonly"){
				textDomObj.attr({"disabled":true});
				if(textDomObj[0].attributes["class"].value == "gzl005"){
					textDomObj.css("background","#E1E1E1");
					textDomObj.css("color","#828282");
				}
			}*/

		}
	}
};