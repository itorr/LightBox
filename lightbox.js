
var 
html=document.documentElement,
toArray=function(arr){
	return Array.prototype.slice.call(arr);
},
getAllImages=function(){
	var 
	imgs=document.querySelectorAll('img[lightbox]');

	imgs=toArray(imgs);
},
最后一张图,
showImage=function(dom){

	var 
	rect=dom.getClientRects()[0];

	console.log(rect);

	html.setAttribute('lightbox-switch',1);

	DOM.classList.remove('hide');



	var 
	img=document.createElement('img');

	img.src=dom.getAttribute('data-url')||dom.src;

	放大倍数=默认放大倍数;
	
	BOX.appendChild(img);

	if(最后一张图){
		BOX.removeChild(最后一张图);
	}

	最后一张图=img;
},
closeAll=function(){
	html.removeAttribute('lightbox-switch');
	DOM.classList.add('hide');
};

var 
DOM=document.createElement('div');

DOM.className='lightbox-shadow hide';

DOM.innerHTML='<div class="lightbox-box"></div><h4></h4><i></i>';


document.body.appendChild(DOM);

var 
BOX=DOM.querySelector('.lightbox-box');

document.body.addEventListener('click',function(e){
	var 
	target=e.target;

	if(target.getAttribute('lightbox')===''){
		showImage(target);
	}else if(target.classList.contains('lightbox-shadow')){
		closeAll();
	}
});



DOM.onmousemove=function(e){
	console.log(e);
	var 
	o=e.target;

	最后一张图.style.cssText+='transform-origin:'+e.clientX/html.clientWidth*100+'% '+e.clientY/html.clientHeight*100+'%;';
};

var 
放大倍数=1,
默认放大倍数=1,
最大放大倍数=5;
DOM.onmousewheel = function(e) {
	var 
	o=e.target;

	最后一张图.style.cssText+='transform-origin:'+e.clientX/html.clientWidth*100+'% '+e.clientY/html.clientHeight*100+'%;';

    // console.log(e.deltaY,e.target);

    放大倍数=放大倍数 + (e.deltaY/400 * (放大倍数/最大放大倍数));

    if(放大倍数<默认放大倍数){
    	放大倍数=默认放大倍数;
    }
    if(放大倍数>最大放大倍数){
    	放大倍数=最大放大倍数;
    }

	最后一张图.style.cssText+='transform:scale('+放大倍数+');';
};