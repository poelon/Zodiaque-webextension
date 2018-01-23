//**************************gestion souris**************************

//**********survol souris sur canvas : affichage infos sur maisons, signes, planetes

function getMousePos(canvas1, evt) {
    var rect = canvas1.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
canvasTarget.addEventListener('dblclick', function(evt) {
        dessins();
}, false);

canvasTarget.addEventListener('mousemove', function(evt) {
 if (survol){
   var mousePos = getMousePos(canvas1, evt);
   var nested = document.getElementById("annotation");
        if (nested) {var garbage = canvasTarget.removeChild(nested);}
   var symbole={
        maison: [lMaison,hMaison],
        signe: [lSigne,hSigne],
        planete: [lPlanete,hPlanete]
   } 
   //teste position souris/positions symboles
        var a=["maison","signe","planete"];
        for (var j=0;j<a.length;j++){
            for (i=0;i<symbole[a[j]][0].length;i++){
            if (mousePos.x<= symbole[a[j]][0][i]+10 && mousePos.x>= symbole[a[j]][0][i]-10 && mousePos.y<= symbole[a[j]][1][i]+10 && mousePos.y>= symbole[a[j]][1][i]-10){
                switch(j){
                //numéros maisons
                case 0:
                    var abc=convDegres(positionMaison[i]);
                    var message=abc.degres+signes[abc.signe];
                    break;
                //symboles signes
                case 1:
                    var message=signes[i];
                    break;
                //symboles planètes
                case 2:
                    var message=planetes[i]
                    if (aspectGeneral[i]) {message+="+"+aspectGeneral[i];}
                }
                
                //création canvas
                canvas = document.createElement('canvas');
                canvas.setAttribute("Id","annotation");
                canvasTarget.appendChild(canvas);
                canvas.width = 1600;
                canvas.height = 1600;
                var ctx = canvas.getContext("2d");
                ctx.font = '14px serif';
                ctx.fillStyle="blue"
                var x=symbole[a[j]][0][i];
                var y=symbole[a[j]][1][i];
                fillTextMultiLine(ctx, message, x, y);
                break;
            }
        }
    }
  }  
}, false);

function fillTextMultiLine(ctx, text, x, y) {
  var lineHeight = ctx.measureText("M").width * 1.2;
  var lines = text.split("+");
    //recherche largeur max du texte
    var l=1;
    for (var i = 0; i < lines.length; ++i) {
        if (lines[i].length>l){l=lines[i].length;}
    }
    var x0= x-(3.5*l), y0=y-(lineHeight*lines.length);
    //fond jaune
    ctx.rect(x0-5,y0-lineHeight,l*8+8,lineHeight*lines.length+5);
    ctx.fillStyle="hsla(60, 100%, 60%, 0.9)"; 
    ctx.fill();
    //texte en bleu
    ctx.fillStyle="blue";
    for (var i = 0; i < lines.length; ++i) {
        ctx.fillText(lines[i], x0, y0);
        y0 += lineHeight;
    }
}

//**********gestion souris sur utc,latitude,longitude, cacheGauche, cacheCentre, cacheTitre

choixUtc.onmouseover=function(e){
     displayDivInfo(labelsGauche[12],e.clientX,e.clientY);
}
choixUtc.onmouseout=function(){
     displayDivInfo();
}
choixLatitude.onmouseover=function(e){
     displayDivInfo(labelsGauche[13],e.clientX,e.clientY);
}
choixLatitude.onmouseout=function(){
     displayDivInfo();
}
choixLongitude.onmouseover=function(e){
     displayDivInfo(labelsGauche[12],e.clientX,e.clientY);
}
choixLongitude.onmouseout=function(){
     displayDivInfo();
}
cacheGauche.onmouseover=function(){
     if (cacheGauche.checked==true)displayDivInfo(labelsDroite[21]+labelsDroite[23],cadre1.clientWidth+cadre2.clientWidth+8,50);
     else displayDivInfo(labelsDroite[22]+labelsDroite[23],cadre1.clientWidth+cadre2.clientWidth+8,50);
}
cacheGauche.onmouseout=function(){
     displayDivInfo();
}
cacheCentre.onmouseover=function(){
     if (cacheCentre.checked==true)displayDivInfo(labelsDroite[21]+labelsDroite[24],cadre1.clientWidth+cadre2.clientWidth+16,50);
     else displayDivInfo(labelsDroite[22]+labelsDroite[24],cadre1.clientWidth+cadre2.clientWidth+16,50);
}
cacheCentre.onmouseout=function(){
     displayDivInfo();
}
cacheTitre.onmouseover=function(){
     if (cacheTitre.checked==true)displayDivInfo(labelsDroite[21]+labelsDroite[25],cadre1.clientWidth+cadre2.clientWidth+60,50);
     else displayDivInfo(labelsDroite[22]+labelsDroite[25],cadre1.clientWidth+cadre2.clientWidth+60,50);
}
cacheTitre.onmouseout=function(){
     displayDivInfo();
}
function displayDivInfo(text,x,y){
    while (document.getElementById('divInfo')) {
       document.body.removeChild(document.getElementById('divInfo'));
    }
    if(text){
        var divInfo = document.createElement('div');
        divInfo.style.position = 'absolute';
        divInfo.style.left = x+'px';
        divInfo.style.top = y-30+'px';
        divInfo.style.color="blue";
        divInfo.style.background = 'yellow';
        divInfo.id = 'divInfo';
        divInfo.innerText = text;
        document.body.appendChild(divInfo);
    }
  /*  else{
        document.body.removeChild(document.getElementById('divInfo'));
    }*/
}

//************************************* zoom sur canvas *******************************************************

//source : http://phrogz.net/tmp/canvas_zoom_to_cursor.html

function redraw(){
    if (!android){
  //  survol=0;
        // Clear the entire canvasZoom
        var p1 = ctx1.transformedPoint(0,0);
        var p2 = ctx1.transformedPoint(canvas1.width,canvas1.height);
        ctx1.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
        ctx2.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
                            // Alternatively:
                            // ctx.save();
                            // ctx.setTransform(1,0,0,1,0,0);
                            // ctx.clearRect(0,0,canvas.width,canvas.height);
                            // ctx.restore();
        ctx1.drawImage(image1,0,0);
        if (checkMaisons.checked==true){ ctx1.drawImage(image2,0,0);}  
    }
}
                
function trackTransforms(){
		var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
		var xform = svg.createSVGMatrix();
		ctx1.getTransform = function(){ return xform; };
		
		var savedTransforms = [];
		var save = ctx1.save;
		ctx1.save = function(){
			savedTransforms.push(xform.translate(0,0));
			return save.call(ctx1);
		};
		var restore = ctx1.restore;
		ctx1.restore = function(){
			xform = savedTransforms.pop();
			return restore.call(ctx1);
		};

		var scale = ctx1.scale;
		ctx1.scale = function(sx,sy){
			xform = xform.scaleNonUniform(sx,sy);
			return scale.call(ctx1,sx,sy);
		};
		var rotate = ctx1.rotate;
		ctx1.rotate = function(radians){
			xform = xform.rotate(radians*180/Math.PI);
			return rotate.call(ctx1,radians);
		};
		var translate = ctx1.translate;
		ctx1.translate = function(dx,dy){
			xform = xform.translate(dx,dy);
			return translate.call(ctx1,dx,dy);
		};
		var transform = ctx1.transform;
		ctx1.transform = function(a,b,c,d,e,f){
			var m2 = svg.createSVGMatrix();
			m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
			xform = xform.multiply(m2);
			return transform.call(ctx1,a,b,c,d,e,f);
		};
		var setTransform = ctx1.setTransform;
		ctx1.setTransform = function(a,b,c,d,e,f){
			xform.a = a;
			xform.b = b;
			xform.c = c;
			xform.d = d;
			xform.e = e;
			xform.f = f;
			return setTransform.call(ctx1,a,b,c,d,e,f);
		};
		var pt  = svg.createSVGPoint();
		ctx1.transformedPoint = function(x,y){
			pt.x=x; pt.y=y;
			return pt.matrixTransform(xform.inverse());
		}
}//fin fonction trackTransforms
                
                
//listeners
var factor=1;
var lastX;
var lastY;
var dragStart,dragged;
canvasTarget.addEventListener('mousedown',function(evt){
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    lastX = evt.offsetX || (evt.pageX - canvas1.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - canvas1.offsetTop);
    dragStart = ctx1.transformedPoint(lastX,lastY);
    dragged = false;
},false);

canvasTarget.addEventListener('mousemove',function(evt){
    lastX = evt.offsetX || (evt.pageX - canvas1.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - canvas1.offsetTop);
    dragged = true;
    if (dragStart){
	var pt = ctx1.transformedPoint(lastX,lastY);
	ctx1.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            //ajustement des positions : ok
            for (var i=0; i<=11; i++){
                lMaison[i]+=pt.x-dragStart.x;
                hMaison[i]+=pt.y-dragStart.y;
                lSigne[i]+=pt.x-dragStart.x;
                hSigne[i]+=pt.y-dragStart.y;
                lPlanete[i]+=pt.x-dragStart.x;
                hPlanete[i]+=pt.y-dragStart.y;
            }
                //NS
                lPlanete[12]+=pt.x-dragStart.x;
                hPlanete[12]+=pt.y-dragStart.y;
	redraw();               
    }
},false);

canvasTarget.addEventListener('mouseup',function(evt){
    dragStart = null;
    if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
},false);

var scaleFactor = 1.1;
var zoom = function(clicks){
    var pt = ctx1.transformedPoint(lastX,lastY);
    ctx1.translate(pt.x,pt.y);
    factor = Math.pow(scaleFactor,clicks);
    ctx1.scale(factor,factor);
    ctx1.translate(-pt.x,-pt.y);
                    //ajustement des positions : ne marche pas
                   /* for (var i=0; i<=11; i++){
                        lMaison[i]=lMaison[i]*factor-((factor-1)*canvas1.width/2);
                        hMaison[i]=hMaison[i]*factor-((factor-1)*canvas1.height/2);
                        lSigne[i]=lSigne[i]*factor-((factor-1)*canvas1.width/2);
                        hSigne[i]=hSigne[i]*factor-((factor-1)*canvas1.height)/2;
                        lPlanete[i]=lPlanete[i]*factor-((factor-1)*canvas1.width/2);
                        hPlanete[i]=hPlanete[i]*factor-((factor-1)*canvas1.height)/2;
                    }*/
                  //  console.log("factor : "+factor+ ", hPlanete : "+hPlanete[0]+ ", lPlanete : "+lPlanete[0]);
    redraw();
}

var handleScroll = function(evt){
    var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
    if (delta) zoom(delta);
	return evt.preventDefault() && false;
    };
    
canvasTarget.addEventListener('DOMMouseScroll',handleScroll,false);
canvasTarget.addEventListener('mousewheel',handleScroll,false);

//-----------------------------------fin zoom sur canvas-----------------------------------------------------
