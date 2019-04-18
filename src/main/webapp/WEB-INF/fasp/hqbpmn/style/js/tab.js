function setTab(name,cursel,n){
	for(i=1;i<=n;i++){
		var menu=document.getElementById(name+"_"+i);
		var con=document.getElementById("con_"+name+"_"+i);
		if(menu){
			menu.className=(i==cursel)?"hover":"";
		}
		if(con){
			con.style.display=(i==cursel)?"":"none";
		}
	}
}
	