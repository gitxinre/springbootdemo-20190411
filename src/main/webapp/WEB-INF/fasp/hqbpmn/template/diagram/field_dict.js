/**
 * 字段字典中使用的常量定义
 */
var FlowConstant = {
	CANDIDATION_DATASOURCE_NAME : "candidation", // 条件lookup数据源名称
	LISTENER_DATASOURCE_EXT_NAME : "Listener", // 事件执行监听lookup数据源名称
	NODE_EXCUTION_LISTENER_DATASOURCE_NAME : "nodeExcutionListener",
	Line_EXCUTION_LISTENER_DATASOURCE_NAME : "lineExcutionListener",
	TASK_LISTENER_DATASOURCE_NAME : "taskListener",
	BUSINESSPRIVILEGE_DATASOURCE_NAME : "businessPrivilege", // 业务权限lookup数据源名称
	CANDIDATION_USER_DATASOURCE_NAME : "candidateUser", // 候选用户数据源名称
	CANDIDATION_GROUP_DATASOURCE_NAME : "candidateGroup", // 候选分组数据源名称
	CANDIDATION_GROUP_AND_USER_DATASOURCE_NAME : "candidateUserAndGroup",//候选人和候选组数据源名称
	BUSINESS_FORM_DATASOURCE_NAME : "businessForms", //业务表单数据源名称
	PARAMETER_DATASOURCE_NAME : "Parameter",// 参数传递数据源名称
	PARAMETER_INPUT_DATASOURCE_NAME : "inputParameter",// 输入参数传递数据源名称
	PARAMETER_OUTPUT_DATASOURCE_NAME : "outputParameter",// 输出参数传递数据源名称
	WEIGHT_DATASOURCE_NAME : "weight",// 权重的数据源名称
	CUSTOMBUTTON_DATASOURCE_NAME : "customButton",//定制按钮
	CUSTOMPROPERTY_DATASOURCE_NAME : "customProperty",//自定义流转线属性
	PROCESSID_DATASOURCE_NAME : "processId",//流程Id
	DEPARTMENT_AND_ROLE_DATASOURCE_NAME :"departmentAndRole",//部门和角色
	DEFAULT_DEPARTMENT_AND_ROLE_DATASOURCE_NAME :"defaultDepartmentAndRole",//默认部门和角色
	TIMESERVICE_DATASOURCE_NAME:"timeService",//时间服务
	CANDIDATE_HIGH_GRADE_NAME:"candidateHighGrade",//候选高级配置
	CUSTOM_CLASS_CONDITION : "customCondition", // 自定义条件lookup数据源名称
	DIAGRAM_SETTING : {
		height : 400,
		width : 600,
		modal : true,
		resizable : false,
		closed : true,
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
	},
	DIAGRAMOPEN_SETTING : {
		height : 400,
		width : 600,
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
	}
};

/**
 * 定义规范： 类型首字母大写， 分组首字母小写， 字段名首字母小写
 * 
 */
// 定义域对象
var FlowDict = {};
/** ******* “流程模板”属性字典定义 ************ */
FlowDict.Diagram = {
	bpmn : {
		label : "工作流定义",
		categroy : {
			label : "流程分类",
			editor : {
				type : "text",
				readOnly : true
			}
		},
		procDefKey : {
			label : "流程ID",
			editor : {
				type : "text",
				/*validater : {
					required : true
				}*/
				readOnly : true
			}
		},
		version : {
			label : "版本",
			editor : {
				type : "text",
				readOnly : true
			}
		},
		deployState : {
			label : "发布状态",
			editor : {
				type : "select",
				dataSource : "deploystate",
				readOnly : true
			}
		},
		versionState : {
			label : "版本状态",
			editor : {
				type : "select",
				dataSource : "versionstate",
				readOnly : true
			}
		},

		candidateStartUsers : {
			label : "候选人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateUser"
			}
		},
		candidateStartGroups : {
			label : "候选组",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateGroup"
			}
		},
		candidateHighGradeConfig : {
			label : "发起人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateHighGrade"
			}
		},
		bpmnBusinessForms : {
			label : "业务表单",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "businessForms"
			}
		},
		document : {
			label : "描述",
			editor : "textarea"
		}
	},
	variable : {
		label : "变量池",
		variable : {
			label : "变量池维护",
			editor : {
				"type" : "tree"
			}
		}
	},
	listener : {
		label : "事件监听",
		bpmnListener : {
			label : "执行监听",
			editor : {
				"type" : "tableAreaLookup",
				dataSource : FlowConstant.NODE_EXCUTION_LISTENER_DATASOURCE_NAME,
				idIndex : "id",
				colModel : [ {
					name : 'id',
					index : 'id',
					hidden : true,
					key : true,
					label : "ID"
				}, {
					name : 'event',
					index : 'event',
					width : 32,
					label : "监听实现"
				}, {
					name : 'type',
					index : 'type',
					width : 32,
					label : "类型"
				}, {
					name : 'listenerImplementation',
					index : 'listenerImplementation',
					width : 100,
					label : "事件"
				}, {
					name : 'field',
					index : 'field',
					width : 50,
					label : "字段"
				}, {
					name : 'orderId',
					index : 'orderId',
					hidden : true,
					label : "排序"
				} ]
			}
		}
	}
	
};

/** ******* “用户任务”属性字典定义 ************ */
FlowDict.UserTask = {
	general : {
		label : "工作流定义",
		defaultFlow : {
			label : "默认连接线",
			editor : {
				"type" : "select",
				dataSource : "defaultFlow1" 
			}
		},
		candidateUsers : {
			label : "候选人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateUser"
			}
		},
		candidateGroups : {
			label : "处理组",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateGroup"
			}
		},
		roleAndDep : {
			label : "处理人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "departmentAndRole"
			}
		},
		defaultRoleAndDep : {
			label : "默认人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "defaultDepartmentAndRole"
			}
		},
		showType : {
			label : "显示类型",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"用户" : "user"
				}, {
					"角色" : "role"
				}, {
					"处室" : "dept"
				}, {
					"部门" : "org"
				} ]
			}
		},
		document : {
			label : "描述",
			editor : {
				type : "select",
				dataSource : "taskDescription"
			}
		}
	},
	
	/*timeServiceConfig : {
		label : "时间服务",
		timeStept : {
			label : "时间设置",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "timeService"
			}
		},
	},*/
	
	extendConfig : {
		label : "扩展定义",
		/*createSubTask : {
			label : "子任务",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				} ]
			}
		},*/
		customButton : {
			label : "定制按钮",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "customButton"
			}
		},
		toBeReceived : {
			label : "接收",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				} ]
			}
		},
		toBeRevoked : {
			label : "撤销",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				} ]
			}
		},
		toBeReturned : {
			label : "退回",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				}]
			}
		},
		toBeFreedomNode : {
			label : "自由节点",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				}]
			}
		},
		enabledAllUser : {
			label : "启用全部人员",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				}]
			}
		},
		bpmnBigDataBusinessPrivilege : {
			label : "业务权限",
			editor : {
				"type" : "textAreaLookup",
				dataSource : FlowConstant.BUSINESSPRIVILEGE_DATASOURCE_NAME
			}
		}
	},
	listener : {
		label : "事件监听",
		taskListener : {
			label : "任务监听",
			editor : {
				"type" : "tableAreaLookup",
				dataSource : FlowConstant.TASK_LISTENER_DATASOURCE_NAME,
				idIndex : "id",
				colModel : [ {
					name : 'id',
					index : 'id',
					hidden : true,
					key : true,
					label : "ID"
				}, {
					name : 'event',
					index : 'event',
					width : 32,
					label : "监听实现"
				}, {
					name : 'type',
					index : 'type',
					width : 32,
					label : "类型"
				}, {
					name : 'listenerImplementation',
					index : 'listenerImplementation',
					width : 100,
					label : "事件"
				}, {
					name : 'field',
					index : 'field',
					width : 50,
					label : "字段"
				}, {
					name : 'orderId',
					index : 'orderId',
					hidden : true,
					label : "排序"
				} ]
			}
		}
	}
};

/** ******* “会签节点”属性字典定义 ************ */
FlowDict.Countersign = {
	general : {
		label : "工作流定义",
		sequence : {
			label : "办理方式",
			editor : {
				"type" : "radio",
				"options" : [ {
					"并发办理" : "no"
				}, {
					"顺序办理" : "yes"
				} ]
			}
		},

		approveCondition : {
			label : "通过百分比",
			editor : {
				"type" : "text",
			}
		},
		completeConditionType : {
			label : "结束条件",
			editor : {
				"type" : "select",
				"options" : [ {
					"通过百分比" : "completevotePercentage"
				}, {
					"投票百分比" : "votePercentage"
				}, {
					"投票数量"   : "voteCount"
				}, {
					"一票否决"	  : "oneVoteVeto"
				} ]
			}
		},
		completeCondition : {
			label : "结束条件值",
			editor : {
				"type" : "text",

			}
		},

	},
	extendConfig : {
		label : "扩展定义",
		candidateUser : {
			label : "处理人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateUser"
			}
		},
		roleAndDep : {
			label : "处理人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "departmentAndRole"
			}
		},
		collectionGroup : {
			label : "处理组",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateGroup"
			}
		},
		/*weight : {
			label : "权重",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "weight"
			}
		},*/
		positiveSequence : {
			label : "正向连接线",
			editor : {
				"type" : "select",
				dataSource : "defaultFlow1" 
			}
		},
		negativeSequence : {
			label : "负向连接线",
			editor : {
				"type" : "select",
				dataSource : "defaultFlow1" 
			}
		},
		bpmnBigDataBusinessPrivilege : {
			label : "业务权限",
			editor : {
				"type" : "textAreaLookup",
				dataSource : FlowConstant.BUSINESSPRIVILEGE_DATASOURCE_NAME
			}
		}
	},
	listener : {
		label : "事件监听",
		taskListener : {
			label : "任务监听",
			editor : {
				"type" : "tableAreaLookup",
				dataSource : FlowConstant.TASK_LISTENER_DATASOURCE_NAME,
				idIndex : "id",
				colModel : [ {
					name : 'id',
					index : 'id',
					hidden : true,
					key : true,
					label : "ID"
				}, {
					name : 'event',
					index : 'event',
					width : 32,
					label : "监听实现"
				}, {
					name : 'type',
					index : 'type',
					width : 32,
					label : "类型"
				}, {
					name : 'listenerImplementation',
					index : 'listenerImplementation',
					width : 100,
					label : "事件"
				}, {
					name : 'field',
					index : 'field',
					width : 50,
					label : "字段"
				}, {
					name : 'orderId',
					index : 'orderId',
					hidden : true,
					label : "排序"
				} ]
			}
		}
	}
};

/** ******* “开始事件”属性字典定义 ************ */
FlowDict.StartEvent = {
	extendConfig : {
	label : "扩展定义",
	toBeRevoked : {
		label : "撤销",
		editor : {
			"type" : "checkbox",
			"options" : [ {
				"" : "true"
			} ]
		}
	},
	/*tranformReading : {
		label : "传阅",
		editor : {
			"type" : "checkbox",
			"options" : [ {
				"" : "true"
			} ]
		}
	},*/
	customButton : {
		label : "定制按钮",
		editor : {
			"type" : "textAreaLookup",
			dataSource : "customButton"
		}
	},
	bpmnBigDataBusinessPrivilege : {
		label : "业务权限",
		editor : {
			"type" : "textAreaLookup",
			dataSource : FlowConstant.BUSINESSPRIVILEGE_DATASOURCE_NAME
		}
	},
}};

/** ******* “截止事件”属性字典定义 ************ */
FlowDict.EndEvent = {
		general : {
			label : "工作流定义",
			document : {
				label : "描述",
				editor : {
					type : "select",
					dataSource : "taskDescription"
				}
			}
		}
	};

/** ******* “排他网关”属性字典定义 ************ */
FlowDict.ExclusiveGateway = {
	general : {
		label : "工作流定义",
		defaultFlow : {
			label : "默认连接线",
			editor : {
				"type" : "select",
				dataSource : "defaultFlow1" 
			}
		}
	}
};

/** ******* “并行网关”属性字典定义 ************ */
FlowDict.Parallelgateway = {
/*
 * general:{ label:"工作流定义" }
 */
};

/** ******* “兼容网关”属性字典定义 ************ */
FlowDict.InclusiveGateway = {
	general : {
		label : "工作流定义",
		defaultFlow : {
			label : "默认连接线",
			editor : {
				"type" : "select",
				dataSource : "defaultFlow1" 
			}
		}
	}	
};

/** ******* “流转线”属性字典定义 ************ */
FlowDict.SequenceFlow = {
	general : {
		label : "工作流定义",
		condition : {
			label : "条件",
			editor : {
				"type" : "textAreaLookup",
				dataSource : FlowConstant.CANDIDATION_DATASOURCE_NAME
			}
		},
		customClassCondition : {
			label : "业务条件",
			editor : {
				type : "select",
				dataSource : FlowConstant.CUSTOM_CLASS_CONDITION
			}
	    },
	    customConditionValue : {
			label : "业务条件值",
			editor : {
				"type" : "radio",
				"options" : [ {
					"true" : "1"
				}, {
					"false" : "0"
				}]
			}
		},
	    
	},
	extendConfig : {
		label : "扩展定义",
		candidateUser : {
			label : "候选人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateUser"
			}
		},
		candidateGroup : {
			label : "候选组",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateGroup"
			}
		},
		candidateUserAndGroup : {
			label : "处理人",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "candidateUserAndGroup"
			}
		},
		customProperty : {
			label : "自定义流转线属性",
			editor : {
				"type" : "textAreaLookup",
				dataSource : "customProperty"
			}
		},
		needComment : {
			label : "是否填写评论",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				} ]
			}
		},
		/*enabledAllUser : {
			label : "启用全部人员",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				} ]
			}
		},*/
		openPanel : {
			label : "个性业务设置",
			editor : "text"
		},
		candidateUsers : {
			label : "是否选候选人",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				} ]
			}
		},
		candidateGroups : {
			label : "是否选候组",
			editor : {
				"type" : "checkbox",
				"options" : [ {
					"" : "true"
				} ]
			}
		},
		bathCompleteVariable : {
			label : "批量处理类型",
			editor : {
				type : "select",
				dataSource : "bathComplete"
			}
		},
		sortNumber : {
			label : "排序号",
			editor : "text"
		},
		
	},
	listener : {
		label : "事件监听",
		executionListener : {
			label : "执行监听",
			editor : {
				"type" : "tableAreaLookup",
				dataSource : FlowConstant.Line_EXCUTION_LISTENER_DATASOURCE_NAME,
				idIndex : "id",
				colModel : [ {
					name : 'id',
					index : 'id',
					hidden : true,
					key : true,
					label : "ID"
				}, {
					name : 'event',
					index : 'event',
					width : 32,
					label : "监听实现"
				}, {
					name : 'type',
					index : 'type',
					width : 32,
					label : "类型"
				}, {
					name : 'listenerImplementation',
					index : 'listenerImplementation',
					width : 100,
					label : "事件"
				}, {
					name : 'field',
					index : 'field',
					width : 50,
					label : "字段"
				}, {
					name : 'orderId',
					index : 'orderId',
					hidden : true,
					label : "排序"
				} ]
			}
		}
	}
};

/** ******* “引用节点输入输出参数中选择被引用流程下拉列表框”属性字典定义 ************ */
FlowDict.CallProcessList = {
		label : "引用流程ID",
		editor : {
			type : "select",
			dataSource : "callProcessClass"
		}
};
/** ******* “引用节点输入参数原表达式”属性字典定义 ************ */
FlowDict.InputSourceExpression = {
	label : "父",
	editor : {
		type : "select",
		dataSource : "inputSourceClass"
	}
};

/** ******* “引用节点输入参数目标”属性字典定义 ************ */
FlowDict.InputTargetExpression = {
	label : "子",
	editor : {
		type : "select",
		dataSource : "inputTargetClass"
	}
};

/** ******* “引用节点输出参数原表达式”属性字典定义 ************ */
FlowDict.OutputSourceExpression = {
	label : "子",
	editor : {
		type : "select",
		dataSource : "outputSourceClass"
	}
};

/** ******* “引用节点输出参数目标”属性字典定义 ************ */
FlowDict.OutputTargetExpression = {
	label : "父",
	editor : {
		type : "select",
		dataSource : "outputTargetClass"
	}
};

/** ******* “任务监听实现”属性字典定义 ************ */
FlowDict.TaskListenerImpl = {
	label : "监听实现",
	editor : {
		type : "select",
		dataSource : "taskListenerClass"
	}
};

/** ******* “执行监听实现”属性字典定义 ************ */
FlowDict.ExecutionListenerImpl = {
	label : "监听实现",
	editor : {
		type : "select",
		dataSource : "executionListenerClass"
	}
};

/** ******* “子工作流”属性字典定义 ************ */
FlowDict.Subprocess = {
		general : {
			label : "工作流定义",
			calledElement : {
				label : "引用流程ID",
				editor : {
					"type" : "textAreaLookup",
					dataSource : FlowConstant.PROCESSID_DATASOURCE_NAME
					//"type" : "text"
				}
			},
			sequence : {
				label : "执行方式",
				editor : {
					"type" : "radio",
					"options" : [ {
						"并发" : "no"
					}, {
						"顺序" : "yes"
					} ]
				}
			},
			defaultFlow : {
				label : "是否等待",
				editor : {
					"type" : "radio",
					"options" : [ {
						"等待" : "1"
					}, {
						"不等待" : "0"
					},
					 {
						"并行不等待" : "2"
					}]
				}
			},
			enabledAllUser : {
				label : "启用全部人员",
				editor : {
					"type" : "checkbox",
					"options" : [ {
						"" : "true"
					}]
				}
			},
			roleAndDep : {
				label : "高级配置",
				editor : {
					"type" : "textAreaLookup",
					dataSource : "departmentAndRole"
				}
			},
			toAllBackUser : {
				label : "返回待办",
				editor : {
					"type" : "radio",
					"options" : [ {
						"发起人" : "0"
					}, {
						"所有待办人" : "1"
					}]
				}
			}
		}
		
};

/** ******* “引用流程”属性字典定义 ************ */
FlowDict.CallActivity = {
	general : {
		
		label : "工作流定义",
		calledElement : {
			label : "引用流程ID",
			editor : {
				"type" : "textAreaLookup",
				dataSource : FlowConstant.PROCESSID_DATASOURCE_NAME
				//"type" : "text"
			}
		},
		sequence1 : {
			label : "办理方式",
			editor : {
				"type" : "radio",
				"options" : [ {
					"顺序办理" : "yes"
				}, {
					"并发办理" : "no"
				} ]
			}
		},
		defaultFlow : {
			label : "默认连接线",
			editor : {
				"type" : "select",
				dataSource : "defaultFlow1" 
			}
		}
	},
	extendConfig : {
		label : "扩展定义",
		bpmnBigDataBusinessPrivilege : {
			label : "业务权限",
			editor : {
				"type" : "textAreaLookup",
				dataSource : FlowConstant.BUSINESSPRIVILEGE_DATASOURCE_NAME
			}
		}
	},
	parameter : {
		label : "参数定义",
		inputParameter : {
			label : "输入参数",
			editor : {
				"type" : "tableAreaLookup",
				dataSource : FlowConstant.PARAMETER_INPUT_DATASOURCE_NAME,
				idIndex : "id",
				colModel : [ {
					name : 'id',
					index : 'id',
					hidden : true,
					key : true,
					label : "ID"
				}, 
				{
					name : 'sonPrcocessId',
					index : 'sonPrcocessId',
					width : 90,
					label : "被引用流程ID"
				}, 
				{
					name : 'sourceExpression',
					index : 'sourceExpression',
					width : 55,
					label : "父"
				}, {
					name : 'target',
					index : 'target',
					width : 55,
					label : "子"
				}, 
//				{
//					name : 'targetExpression',
//					index : 'targetExpression',
//					width : 60,
//					label : "目标表达式"
//				}, 
				{
					name : 'orderId',
					index : 'orderId',
					width : 30,
//					hidden : true,
					label : "排序"
				} ]
			}
		},
		outputParameter : {
			label : "输出参数",
			editor : {
				"type" : "tableAreaLookup",
				dataSource : FlowConstant.PARAMETER_OUTPUT_DATASOURCE_NAME,
				idIndex : "id",
				colModel : [ {
					name : 'id',
					index : 'id',
					hidden : true,
					key : true,
					label : "ID"
				}, 
//				{
//					name : 'source',
//					index : 'source',
//					width : 40,
//					label : "源"
//				}, 
				{
					name : 'sonPrcocessId',
					index : 'sonPrcocessId',
					width : 90,
					label : "被引用流程ID"
				}, 
				{
					name : 'sourceExpression',
					index : 'sourceExpression',
					width : 55,
					label : "子"
				}, {
					name : 'target',
					index : 'target',
					width : 55,
					label : "父"
				}, 
//				{
//					name : 'targetExpression',
//					index : 'targetExpression',
//					width : 60,
//					label : "目标表达式"
//				}, 
				{
					name : 'orderId',
					index : 'orderId',
					width : 30,
//					hidden : true,
					label : "排序"
				} ]
			}
		}

	},
	listener : {
		label : "事件监听",
		executionListener : {
			label : "执行监听",
			editor : {
				"type" : "tableAreaLookup",
				dataSource : FlowConstant.NODE_EXCUTION_LISTENER_DATASOURCE_NAME,
				idIndex : "id",
				colModel : [ {
					name : 'id',
					index : 'id',
					hidden : true,
					key : true,
					label : "ID"
				}, {
					name : 'event',
					index : 'event',
					width : 32,
					label : "监听实现"
				}, {
					name : 'type',
					index : 'type',
					width : 32,
					label : "类型"
				}, {
					name : 'listenerImplementation',
					index : 'listenerImplementation',
					width : 100,
					label : "事件"
				}, {
					name : 'field',
					index : 'field',
					width : 50,
					label : "字段"
				}, {
					name : 'orderId',
					index : 'orderId',
					hidden : true,
					label : "排序"
				} ]
			}
		}
	}
};
