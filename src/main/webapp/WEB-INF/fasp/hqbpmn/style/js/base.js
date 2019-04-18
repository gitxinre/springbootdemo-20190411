function showObj(obj){
	var t = $("#"+obj);
	if(t.hasClass("disnone")){
		t.removeClass("disnone");
	}else{
		t.addClass("disnone");
	}
}
function tocloseIt(_this,obj){
	var t = $("#"+obj);
	if(t.hasClass("disnone")){
		t.removeClass("disnone");
		$(_this).removeClass("hide");
	}else{
		t.addClass("disnone");
		$(_this).addClass("hide");
	}
}

function show_fade(btn,box){//无bug 触摸显示隐藏
	var btn = document.getElementById(btn);
	if(btn){
		var btn_box = document.getElementById(box);
		var btnclass = btn.className;
		btn.tim = null;
		clearTimeout(btn.tim)
		btn.onmouseover = function(){
			clearTimeout(btn.tim)
			btn_box.style.display = "block";
			btn.className = btnclass+" cho";
		}
		btn.onmouseout = function(){
			btn.tim = setTimeout(function(){
				btn_box.style.display = "none";
			},1000);
		}
		btn_box.onmouseover = function(){
			clearTimeout(btn.tim)
		}
		btn_box.onmouseout = function(){
			btn.tim = setTimeout(function(){
				btn_box.style.display = "none";
				btn.className = btnclass;
			},500);
		}
	}
}

function show_fade_click(btn,box){//无bug 点击显示隐藏
	var btn = document.getElementById(btn);
	if(btn){
		var btn_box = document.getElementById(box);
		var btnclass = btn.className;
		btn.tim = null;
		clearTimeout(btn.tim)
		btn.onclick = function(){
			clearTimeout(btn.tim)
			btn_box.style.display = "block";
			btn.className = btnclass+" cho";
		}
		btn.onmouseout = function(){
			btn.tim = setTimeout(function(){
				btn_box.style.display = "none";
			},1000);
		}
		btn_box.onmouseover = function(){
			clearTimeout(btn.tim)
		}
		btn_box.onmouseout = function(){
			btn.tim = setTimeout(function(){
				btn_box.style.display = "none";
				btn.className = btnclass;
			},500);
		}
	}
}

/*二级导航菜单*/
var DDSPEED = 10;
var DDTIMER = 15;
var OFFSET = -2;
var ZINT = 100;

function ddMenu(id,d){
  var h = document.getElementById(id + '-ddheader');
  var c = document.getElementById(id + '-ddcontent');
  clearInterval(c.timer);
  if(d == 1){
	clearTimeout(h.timer);
	c.style.display = 'block';
	if(c.maxh && c.maxh <= c.offsetHeight){return}
	else if(!c.maxh){
	  c.style.left = (h.offsetWidth + OFFSET) + 'px';
	  c.style.height = 'auto';
	  c.maxh = c.offsetHeight;
	  c.style.height = '0px';
	}
	ZINT = ZINT + 1;
	c.style.zIndex = ZINT;
	c.timer = setInterval(function(){ddSlide(c,1)},DDTIMER);
  }else{
	h.timer = setTimeout(function(){ddCollapse(c)},50);
  }
}

function ddCollapse(c){
  c.timer = setInterval(function(){ddSlide(c,-1)},DDTIMER);
}

function cancelHide(id){
  var h = document.getElementById(id + '-ddheader');
  var c = document.getElementById(id + '-ddcontent');
  clearTimeout(h.timer);
  clearInterval(c.timer);
  if(c.offsetHeight < c.maxh){
	c.timer = setInterval(function(){ddSlide(c,1)},DDTIMER);
  }
}

function ddSlide(c,d){
  var currh = c.offsetHeight;
  var dist;
  if(d == 1){
	dist = Math.round((c.maxh - currh) / DDSPEED);
  }else{
	dist = Math.round(currh / DDSPEED);
  }
  if(dist <= 1 && d == 1){
	dist = 1;
  }
  c.style.height = currh + (dist * d) + 'px';
  c.style.opacity = currh / c.maxh;
  c.style.filter = 'alpha(opacity=' + (currh * 100 / c.maxh) + ')';
  if(currh > (c.maxh - 2) && d == 1){
	clearInterval(c.timer);
  }else if(dist < 1 && d != 1){
	clearInterval(c.timer);
	c.style.display = 'none';
  }
}
/*二级导航菜单*/

function showThisMore(obj){
	var changeIt = $(obj).parent().find(".desIn");
	if($(obj).hasClass("hide")){
		changeIt.addClass("auto");
		$(obj).removeClass("hide");
	}else{
		changeIt.removeClass("auto");
		$(obj).addClass("hide");
	}
}

/*显示隐藏tab*/
function tabShowThis(obj,num,name){
	$(obj).parent().find("span").removeClass("cho");
	$(obj).addClass("cho");
	$("#"+name+" ."+name).hide();
	$("#"+name+" ."+name+":eq("+num+")").show();
}









