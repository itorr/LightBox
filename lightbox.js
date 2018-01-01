(function(){

var 
html=document.documentElement,
body=document.body,
toArray=function(arr){
	return Array.prototype.slice.call(arr);
},
getAllImages=function(){
	var 
	imgs=document.querySelectorAll('img[lightbox]');

	imgs=toArray(imgs);
},
最后一张图,
loading=0,
根据限制返回长宽数值=function(宽,高,最大宽,最大高){

	var 
	比例=最大高/最大宽;



	最大宽=最大宽||html.clientWidth;
	最大高=最大高||html.clientHeight;//window.screen.availHeight;

	//window.screen.height;
	//window.screen.availHeight

	var 
	新比例=高/宽;

	if(宽<最大宽&&高<最大高){
		return {
			width:宽,
			height:高,
			top:(最大高-高)/2,
			left:(最大宽-宽)/2,
		};
	}

	if(宽>最大宽){
		宽=最大宽;
		高=宽*新比例;
	}

	if(高>最大高){
		高=最大高;
		宽=高/新比例;
	}

	return {
		width:宽,//Math.round(宽),
		height:高,//Math.round(高),
		top:(最大高-高)/2,
		left:(最大宽-宽)/2,
	};
},
根据限制返回左延距离=function(width){
	var 
	最大宽=body.offsetWidth;

	return (最大宽-width)/2;
},
根据限制返回顶部距离=function(height){
	var 
	最大高=html.clientHeight;

	return (最大高-height)/2;
},
展示副本=function(dom,over){

	var 
	rect=dom.getBoundingClientRect();


	var 
	ghost=dom.ghost||dom.cloneNode(1);

	var 
	差比例=rect.width/(over.width-rect.width);


	var 
	顶距=rect.top-over.top;
	trTop=(顶距*差比例);
	trTop=trTop/rect.height*100;//+50;


	var 
	差左=rect.left-over.left;
	trLeft=(差左*差比例);
	trLeft=trLeft/rect.width*100;//+50;


	var 
	比例=(over.width/rect.width);


	ghost.removeAttribute('lightbox');
	ghost.className='lightbox-ghost';
	ghost.style.cssText='transform-origin:'+trLeft+'% '+trTop+'%;'+
						'width:'+rect.width+'px;'+
						'height:'+rect.height+'px;'+
						'top:'+rect.top+'px;'+
						'right:'+rect.right+'px;'+
						'bottom:'+rect.bottom+'px;'+
						'left:'+rect.left+'px;';


	BOX.appendChild(ghost);


	setTimeout(function(){
		ghost.style.cssText+='transform:scale('+比例+');';
	});

	return ghost;

},
showImage=function(dom){
	if(loading){
		return;
	}

	if(最后一张图 && 最后一张图.img && 最后一张图.img.parentNode){
		closeImage(最后一张图,1);
	}


	loading=1;

	html.setAttribute('lightbox-loading',1);

	html.setAttribute('lightbox-switch',1);


	var 
	img;
	if(dom.img){
		img=dom.img;
	}else{
		img=document.createElement('img');
		img.className='lightbox-bigger-img';
		img.src=dom.getAttribute('data-url')||dom.src;
	}

	放大倍数=默认放大倍数;



	var 
	width=Math.max(+dom.getAttribute('data-width'),dom.naturalWidth*2),
	height=Math.max(+dom.getAttribute('data-height'),dom.naturalHeight*2);

	var 
	over=根据限制返回长宽数值(width,height);
	var 
	ghost=展示副本(dom,over);

	dom.ghost=ghost;
	dom.img=img;
	
	var 
	start=+new Date();

	img.style.cssText=
		'width:'+over.width+'px;'+
		'height:'+over.height+'px;';

	var 
	onload=function(){
		var 
		now=+new Date(),
		diff=now-start,
		func=function(){
			BOX.appendChild(img);
			判断分组信息(dom);
			loading=0;
		};

		html.removeAttribute('lightbox-loading');

		if(diff>300){
			func();
		}else{
			setTimeout(func,300-diff);
		}
	};
	if(img.complete){
		onload();
	}else{

		img.onload=onload;
	}

	dom.classList.add('lightbox-hidden');
	DOM.classList.remove('hide');

	最后一张图=dom;
},
closeImage=function(dom,shadow){
	if(loading){
		return;
	}
	BOX.appendChild(dom.ghost);
	BOX.removeChild(dom.img);

	setTimeout(function(){
		dom.ghost.style.cssText+='transform:scale(1);';
	});

	if(!shadow){
		DOM.classList.add('shadowout');
		GROUP.innerHTML='';
	}
	
	setTimeout(function(){
		BOX.removeChild(dom.ghost);
		dom.classList.remove('lightbox-hidden');


		if(!shadow){
			html.removeAttribute('lightbox-switch');
			DOM.classList.add('hide');
			DOM.classList.remove('shadowout');
		}
	},300);

},
closeAll=function(){
	if(最后一张图){
		closeImage(最后一张图);
	};
},
判断分组信息=function(dom){

	var 
	group=dom.getAttribute('data-group');

	if(!group){
		GROUP.innerHTML='';
		return;
	}

	var 
	imgs=Array.prototype.slice.call(document.querySelectorAll('img[lightbox][data-group="'+group+'"]'));

	var 
	length=imgs.length;

	if(length<=1){
		GROUP.innerHTML='';
		return;
	}

	var 
	i=imgs.indexOf(dom);

	GROUP.innerHTML=(i+1)+'/'+length;

},
nextImage=function(){
	if(loading){
		return;
	}

	if(!最后一张图){
		return;
	}

	var 
	group=最后一张图.getAttribute('data-group');


	if(!group){
		return;
	}

	var 
	imgs=Array.prototype.slice.call(document.querySelectorAll('img[lightbox][data-group="'+group+'"]'));

	if(!imgs.length){
		return;
	}

	var 
	i=imgs.indexOf(最后一张图);

	var 
	num=i+1;

	if(num==imgs.length){
		return;
	}

	showImage(imgs[num]);

};

var 
DOM=document.createElement('div');

DOM.className='lightbox-shadow hide';

DOM.innerHTML='<div class="lightbox-box"></div><h4></h4><i></i>';


body.appendChild(DOM);

var 
BOX=DOM.querySelector('.lightbox-box');
var 
GROUP=DOM.querySelector('i');

body.addEventListener('click',function(e){
	var 
	target=e.target;

	if(target.getAttribute('lightbox')===''){
		showImage(target);
	}
});

DOM.onclick=function(){
	closeAll();
};

DOM.onmousemove=function(e){
	// console.log(e);
	var 
	o=e.target;

	最后一张图.img.style.cssText+='transform-origin:'+e.clientX/html.clientWidth*100+'% '+e.clientY/html.clientHeight*100+'%;';
};

var 
放大倍数=1,
默认放大倍数=1,
最大放大倍数=5;
DOM.onmousewheel = function(e) {
	var 
	o=e.target;

	最后一张图.img.style.cssText+='transform-origin:'+e.clientX/html.clientWidth*100+'% '+e.clientY/html.clientHeight*100+'%;';

    // console.log(e.deltaY,e.target);

    放大倍数=放大倍数 + (e.deltaY/400 * (放大倍数/最大放大倍数));

    if(放大倍数<默认放大倍数){
    	放大倍数=默认放大倍数;
    }
    if(放大倍数>最大放大倍数){
    	放大倍数=最大放大倍数;
    }

	最后一张图.img.style.cssText+='transform:scale('+放大倍数+');';
};

})();