function GetLeftNavigation(){
	var selectedNode = $('.ms-core-listMenu-verticalBox li.selected'); 

    //Get Parent Nodes of Slected One
    var parent = selectedNode.parent('ul').parent('li').html();           

    //Get Child Nodes Of Selected One
    var child = selectedNode.children('ul').children('li').html();
    
    var leafs;
    var leftNav = '';            
        
    //Check if Parent is null
    if (parent == undefined) {                
 	   var cur = selectedNode.children('a').children('span').find('.menu-item-text').text();
       leftNav += '<div class="page-heading" id="page_head"><h2>'+ cur +'</h2></div>';
                
       leafs = selectedNode.children('ul').children('li');                                
    }
    
    //Check if Child is null
    else if (child == undefined) {                
    	var par = selectedNode.parent('ul').parent('li');
        var tpar = par.parent('ul').parent('li');
        if(tpar.length != 0)
    	    leftNav += '<div class="page-heading" id="explore_head"><h2>'+ tpar.children('a').children('span').text() +'</h2>'+
                          '<p>'+ par.children('a').children('span').text() +'</p></div>';                                    
        else
            leftNav += '<div class="page-heading" id="page_head"><h2>'+ par.children('a').children('span').text() +'</h2></div>';
                
        leafs = selectedNode.parent('ul').children('li');
    }
    else
    {
        var cur = selectedNode.children('a').children('span').find('.menu-item-text').text();
        var par = selectedNode.parent('ul').parent('li').children('a').children('span').text();                                
        leftNav += '<div class="page-heading" id="page_head"><h2>'+ par +'</h2>'+
                     '<p>'+ cur +'</p></div>';
                                
        leafs = selectedNode.children('ul').children('li');              
    }
            
    //Get Leaf Nodes
    leftNav += '<div class="menu_mgnt"><ul>';                
    leafs.each(function(){
    	if($(this).hasClass("selected"))
        	leftNav += '<li class="active"><a href="'+  $(this).children('a').attr("href") +'">>&nbsp; '+ $(this).children('a').children('span').find('.menu-item-text').text() +'</a></li>';
    	else
    	    leftNav += '<li><a href="'+  $(this).children('a').attr("href") +'">>&nbsp; '+ $(this).children('a').children('span').text() +'</a></li>';                    
     });                                
     leftNav += '</ul></div>';
                
     //Assign LeftNav to Navigation & Hide SP Left Navigation
     $('.leftNav').append(leftNav);            
     $('.ms-core-listMenu-verticalBox').hide();

}