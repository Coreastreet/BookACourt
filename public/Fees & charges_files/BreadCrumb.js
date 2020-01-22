String.prototype.toProperCase = function () {
    //remove the hashes # first
    var strBread = (this.indexOf("#")==-1)? this:this.substring(0,this.indexOf("#"));
    strBread = (this.indexOf(">")==-1)? this:this.substring(0,this.indexOf(">")-1);
    return strBread.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var path = "";
 var href = document.location.href.replace(/%20/g," ").replace(/%27/g,"'");
 
 //If url Contains Query String
 var queryString = "?";
 if(href.toUpperCase().indexOf(queryString) !== -1)
 {
 	href = href.split('?')[0];
 }
  
 var extension = '.ASPX';
 if(!(href.toUpperCase().indexOf(extension) !== -1))
 {		
 	//If url is Photo Album
 	var photoUrl = 'PHOTOS/IMAGES';
 	if((href.toUpperCase().indexOf(photoUrl) !== -1)){
 		path+="<li><A HREF='/Photos'>Photos</A></li>";
 		var title = ''; 
 		try{
 			path+="<li><A HREF='"+ href +"'>> &nbsp;"+ href.split('?q=')[1].toProperCase() +"</A></li>";
 		}
		catch(e){}
 	}
 	else{
 		var s = href.split("/");
 		s = s.filter(function(n){ return n != "" }); 
 		//this is the search exception case
 		//console.log(s);
 		if (s[2]){
	 		if (s[2].startsWith("search#")||s[2].startsWith("search?")){
	 			s[2] = "search";
	 		}
 		}
 		
 		
 		for (var i=2;i<(s.length-1);i++) {
 			path+="<li><A HREF=\""+href.substring(0,href.indexOf("/"+s[i])+s[i].length+1)+"/\">"+s[i].replace(/-/g," ").toProperCase()+" ></A> </li>";
 		}
 		i=s.length-1;
 		
 		var sPageTitle = s[i].replace(/-/g," ").toProperCase();
 		if(document.title != "")
 			if(document.title != 'Online Services') //After submitting form in OnlineServices, Title changing to "Online Services"
 				sPageTitle = document.title;
 		//var sPageTitle = (document.title)? document.title : s[i].replace(/-/g," ").toProperCase();
 		path+="<li><A HREF=\""+href.substring(0,href.indexOf(s[i])+s[i].length)+"\">"+sPageTitle+"</A></li>"; 	
 	
 	}
 	
 	document.writeln(path);
 }
 
