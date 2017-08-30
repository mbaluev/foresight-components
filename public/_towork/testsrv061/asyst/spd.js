//window.performance.timing

var waitLoad = function(callback){
    var timerId; 
    var interval = 777;
    var loaded = false;
    var ajaxed = false;

    var onLoad = function(a){
        console.debug(a);
        clearTimeout(timerId);
        if (!ajaxed)
          timerId = setTimeout(onTimer, interval);
    }
    var onStop = function(a){   
        console.debug(a);     
        clearTimeout(timerId);
        timerId = null;
        ajaxed = false;
        if (document.readyState == 'complete')
            timerId = setTimeout(onTimer, interval);
      }
    var onStart = function(a){
      console.debug(a);
      ajaxed = true;     
      clearTimeout(timerId);
    }
    var onTimer = function(){
        if (document.readyState == 'complete' && callback) callback();
    }   

    $(document).on('ajaxSend',onStart);
//    $(document).on('ajaxComplete',onStop);
    $(document).on('ajaxStop',onStop);
    if (document.readyState == 'complete'){
        onLoad();
    }
    else $(window).on('load', onLoad);
  
}
var spdRun = function(){  
    if (window.spdInited) return;
    window.spdInited = true;
    
    var spd = JSON.parse(localStorage.getItem('Asyst.spd'));

	if (!spd) return;
	
    if (spd.position === null || spd.position === undefined){     
        spd.position = -1;
    }
    spd.position++;
    if (spd.routes && spd.routes.length > spd.position){
        waitLoad(function(){         
            console.log("location = spd.routes[spd.position];");
			if (!spd.timing) spd.timing= {};
			spd.timing[spd.routes[spd.position-1]] = new Date - window.performance.timing.navigationStart
            localStorage.setItem('Asyst.spd', JSON.stringify(spd));
            debugger;
			
            location = spd.routes[spd.position];
        });
    } 
    
}();

function setSampleSpd(){
    var routes = ['/asyst/page/index', '/asyst/page/project', '/asyst/page/point', '/asyst/page/portfolio'];
    localStorage.setItem('Asyst.spd', JSON.stringify({routes:routes}))
}

function pagesRoutes(){
	var routes = [];
	var list =Asyst.API.View.load('MenuList').data;
	
	for(var i=0; i < list.length; i++){
		if (list[i].URL){
			routes.push(list[i].URL);
		}
	}
	return routes;
}

function showSum(){
	d = JSON.parse(localStorage.getItem('Asyst.spd'));
	var sum = 0;
	for(var c in d.timing){
		sum+= d.timing[c];
	}
	console.log(sum);
	//112284, 103305,98712
	//
}
	
//пооткрывать страниц
//пооткрывать реестры(?)
//пооткрывать карточки реестров(хотя бы ключевых сущностей)