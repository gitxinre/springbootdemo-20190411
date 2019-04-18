/*
	项目数据填报
	左1 右1 
*/
function MathLayoutBox_Fn(widthArr){//计算当前页面宽度 单位项目类别对应科目
	var oWidth = $("#MathLayoutBox").width();
	var oHeight = $(window).height();
	var titH = 40;
	if(widthArr){
		var width_L1 = widthArr[0];
	}else{
		var width_L1 = 280;
	}
	if($("#MathLayoutBox .layout_left_1").hasClass("noshow")){
		width_L1 = 0;
	}
	var width_R1 = oWidth - width_L1 - 10;
	var h = parseInt(oHeight)-38-10-10- $("#layoutAddTopTool").height();
	var height_L1_tree = h-2-$("#MathLayoutBox .layout_left_1 .layout_left_1_info").height();
	var height_R1_table = h-$("#MathLayoutBox .layout_right_1 .layout_right_1_t").height();
	var width_R2_l = width_R1 - $("#MathLayoutBox .layout_right_2_r").width()-10;
	var height_R2_l_table = height_R1_table - titH;
	var height_R2_r_table = (height_R1_table-10)/2-titH;
	var width_R2_half = parseInt((width_R1-50)/2);
	var width_R3_r = width_R1 - $("#MathLayoutBox .layout_right_3_l").width() - 10;
	var height_R3_l = height_R2_l_table;
	var height_R4_l = height_R1_table-2;
	var width_R4_r = width_R1 - $("#MathLayoutBox .layout_right_4_l").width()-2 - 10;
	var height_R4_table = height_R1_table - titH - 58;
	var width_R4_one = width_R1 - $("#MathLayoutBox .layout_right_4_l").width()-2;
	var height_R4_one_table = parseInt(height_R1_table- 58 - titH - titH)/2 ;
	var height_R5_table = Math.floor(height_R1_table - titH - titH -10)/2 ;
	
	$("#MathLayoutBox").css({"height":h});
	$("#MathLayoutBox .layout_left_1").css({"height":h-2});
	$("#MathLayoutBox .layout_left_1 .layout_left_1_tree").css({"height":height_L1_tree});
	$("#MathLayoutBox .layout_right_1").css({"width":width_R1});
	$("#MathLayoutBox .layout_right_1 .layout_right_1_table").css({"height":height_R1_table});
	$("#MathLayoutBox .layout_right_1 .layout_right_2").css({"height":height_R1_table});
	$("#MathLayoutBox .layout_right_1 .layout_right_2 .layout_right_2_l").css({"width":width_R2_l});
	//$("#MathLayoutBox .layout_right_1 .layout_right_2 .layout_right_2_r").css{"width":""};
	$("#MathLayoutBox .layout_right_2_l_table").css({"height":height_R2_l_table});
	$("#MathLayoutBox .layout_right_2_r_table").css({"height":height_R2_r_table});
	$("#MathLayoutBox .layout_right_2_half").css({"width":width_R2_half});
	$("#MathLayoutBox .layout_right_2_half_h").css({"height":height_R2_l_table-1});
	
	$("#MathLayoutBox .layout_right_1 .layout_right_3").css({"height":height_R1_table});
	$("#MathLayoutBox .layout_right_1 .layout_right_3_l_h").css({"height":height_R3_l-1});
	$("#MathLayoutBox .layout_right_3_r").css({"width":width_R3_r});
	
	$("#MathLayoutBox .layout_right_1 .layout_right_4").css({"height":height_R1_table});
	$("#MathLayoutBox .layout_right_4_l").css({"height":height_R4_l});
	$("#MathLayoutBox .layout_right_4_r").css({"width":width_R4_r});
	$("#MathLayoutBox .layout_right_4_r_table").css({"height":height_R4_table});
	//$("#MathLayoutBox .layout_right_4_one").css({"width":width_R4_one});
	$("#MathLayoutBox .layout_right_4_one_2table").css({"height":height_R4_one_table});
	
	$("#MathLayoutBox .layout_right_1 .layout_right_5").css({"height":height_R1_table});
	$("#MathLayoutBox .layout_right_5_2table").css({"height":height_R5_table});
	
	$("#MathLayoutBox .layout_right_1 .layout_right_1_2_table").css({"height":height_R1_table-titH});
	
	$("#MathLayoutBox .layout_right_1 .layout_right_1_3").css({"height":height_R1_table-titH - 37});
}



/*框架收缩*/
function layoutH(_this,arr){
	$("#MathLayoutBox .layout_left_1").hide();
	$("#MathLayoutBox .layout_left_1").addClass("noshow");
	$("#MathLayoutBox .layout_left_showBar").show();
	MathLayoutBox_Fn(arr);
}
function layoutS(_this){
	$("#MathLayoutBox .layout_left_1").show();
	$("#MathLayoutBox .layout_left_1").removeClass("noshow");
	$("#MathLayoutBox .layout_left_showBar").hide();
	MathLayoutBox_Fn();
}














