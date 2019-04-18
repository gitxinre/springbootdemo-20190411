/*******************************************************************************
 * 获得基础DOM模型
 */
var UIUtil = {
	/**
	 * 
	 * @param config
	 *            支持属性：readOnly,options,value
	 * @returns
	 */
	getSelect : function(config) {
		var inputDomObj = $("<select>", {
			disabled : config.readOnly ? true : false,
			"class" : "gzl005",
			multiple:config.multiple?config.multiple:false,
					id : config.id ? config.id : "",
		});
		if (config.options) {
			var options = UIUtil.getOptions({
				options : config.options,
				value : config.value
			});
			$(options).each(function(index, option) {
				option.appendTo(inputDomObj);
			});
		}
		return inputDomObj;
	},
	getOptions : function(config) {
		var options = [ $("<option>", {
			value : "",
			text : "",
			id : config.id ? config.id : "",
		}) ];
		$(config.options).each(function(index, option) {
			$.each(option, function(showValue, value) {
				options.push($("<option>", {
					value : value,
					text : showValue,
					selected : value == config.value
				}));
			});
		});
		return options;
	},
	getCheckbox : function(config) {
		return $("<input>", {
			id : config.id,
			name : config.name,
			type : "checkbox",
			checked : config.checked,
			value : config.value,
			"class" : "gzl008"
		});
	},
	/**
	 * 
	 * @param config
	 *            支持属性：name,value,checked
	 * @returns
	 */
	getRadio : function(config) {
		return $("<input>", {
			type : "radio",
			name : config.name,
			value : config.value,
			"class" : "gzl008",
			checked : config.checked
		});
	},
	/**
	 * 
	 * @param config
	 *            支持属性：readOnly,value,style
	 * @returns
	 */
	getInput : function(config) {
		return $("<input>", {
			type : "text",
			readOnly : config.readOnly ? config.readOnly : false,
			value : config.value ? config.value : "",
			style : config.style ? config.style : "",
			id : config.id ? config.id : "",
			"class" : "gzl005"
		});
	},
	getHidden : function(config) {
		return $("<input>", {
			type : "hidden",
			readOnly : config.readOnly ? config.readOnly : false,
			value : config.value ? config.value : "",
			style : config.style ? config.style : "",
			id : config.id ? config.id : "",
			"class" : "gzl005"
		});
	},
	/**
	 * 
	 * @param config
	 *            支持属性：value
	 * @returns
	 */
	getTextarea : function(config) {
		return $("<textarea>", {
			value : config.value ? config.value : "",
			css : {
				position : "relative",
				display : "inline",
				width : "150px",
				height : "100%",
				border : "1px solid #86a8e3",
				resize: "none"
			}
		});
	},
	getTextarea_lookup : function(config) {
		var valueConfig;
		if (config.showValue) {
			valueConfig = {
				value : config.showValue,
				realValue : config.value,
				tempValue : config.tempValue
			};
		} else {
			valueConfig = {
				value : config.value
			};
		}
		var textAreaConfig = $.extend({
			css : {
				position : "static",
				display : "inline-block",
				display : "inline",
				width : "110px",
				height : "60px",
				border : "1px solid #86a8e3"
			}
		}, valueConfig);
		return $("<textarea>", textAreaConfig);
	},
	/**
	 * 
	 * @param config
	 *            支持属性：id,border
	 * @returns
	 */
	getTabel : function(config) {
		return $("<table>", {
			id : config.id ? config.id : "",
			border : config.border,
			"class" : "gzl003"
		});
	},
	/**
	 * 
	 * @param config
	 *            暂无支持属性
	 * @returns
	 */
	getTr : function(config) {
		 if("undefined" == typeof (config)){
			return $("<tr>", {
				"align" : "left"
			});
		 }else{
			 return $("<tr>", {
					"align" : "left",
					"class" : config.className ? config.className : ""
				});
		 }
	},
	/**
	 * 
	 * @param config
	 *            支持属性：className,text
	 * @returns
	 */
	getTd : function(config) {
		return $("<td>", {
			"align" : "left",
			text : config.text ? config.text : "",
			"class" : config.className
		});
	},
	/**
	 * 
	 * @param config
	 *            支持属性：className,text
	 * @returns
	 */
	getTh : function(config) {
		return $("<th>", {
			"align" : "left",
			text : config.text ? config.text : "",
			"class" : config.className
		});
	},
	/**
	 * 
	 * @param config
	 *            支持属性：label
	 * @returns
	 */
	getLabel : function(config) {
		return $("<label>", {
			text : config.label,
			css : config.css ? config.css : ""
		});
	},
	/**
	 * 
	 * @param config
	 *            支持属性：id,css,className,title,text
	 * @returns
	 */
	getDiv : function(config) {
		return $("<div>", {
			id : config.id,
			css : config.css,
			"class" : config.className ? config.className : "",
			title : config.title,
			text : config.text
		});
	},

	/**
	 * 
	 * @param config
	 *            支持属性：css,className,title,text
	 * @returns
	 */
	getSpan : function(config) {
		return $("<span>", {
			css : config.css,
			"class" : config.className ? config.className : "",
			title : config.title,
			text : config.text ? config.text : ""
		});
	},

	/**
	 * 
	 * @param config
	 *            支持属性：text,css
	 * @returns
	 */
	getH3 : function(config) {
		return $("<h3>", {
			text : config.text,
			css : config.css
		});
	},
	/**
	 * 
	 * @param config
	 *            支持属性：value,onclick,className
	 * @returns
	 */
	getButton : function(config) {
		 var inputobj = $("<span>", {
			name : config.name ? config.name : "",
			text : config.value ? config.value : "",
			"class" : "bpmnDesignerbtnIn",
			onclick : config.onclick ? config.onclick : ""
		});
		 return inputobj;
	},
	/**
	 * 
	 * @param config
	 *            支持属性：id,className
	 * @returns
	 */
	getUl : function(config) {
		return $("<ul>", {
			id : config.id,
			"class" : config.className ? config.className : ""
		});
	},

	/**
	 * 
	 * @param config
	 *            支持属性：href,text
	 * @returns
	 */
	getA : function(config) {
		return $("<a>", {
			href : config.href ? config.href : "",
			text : config.text ? config.text : ""
		});
	},

	/**
	 * 
	 * @param config
	 * 
	 * @returns
	 */
	getLi : function(config) {
		if("undefined" == typeof (config)){
			return $("<li>", {
			});
		 }else{
			 return $("<li>", {
				 id : config.id
				});
		 }
		
	}
};
