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
    checkMaintenant.click();
     /*   dessins();
        fixePhases=0;
        canvasPartielAspects.hidden=true;*/
}, false);

canvasTarget.addEventListener('mousemove', function(evt) {
    if (fixePhases==1 || tableau.hidden==false) return;
    margeNoir();
        //réaffiche les canvas si cachés par le survol des planètes en marge
        canvas1.hidden=false;//secteurs signes
        if (checkMaisons.checked==true)canvas2.hidden=false; //maisons
        canvas3.hidden=false; //symboles planetes
        canvas4.hidden=false; //symboles signes
        canvas5.hidden=true; //mondial
        canvasGlobalAspects.hidden=false;
        canvasPartielAspects.hidden=true;
        canvasLive.hidden=false;
      //  if (checkThemeLive.checked==false) canvasPartielAspects.hidden=true;
        
   var mousePos = getMousePos(canvas1, evt);
   var nested = document.getElementById("annotation");
        if (nested) {garbage = canvasTarget.removeChild(nested);}
       
                
   var symbole={
        maison: [lMaison,hMaison],
        signe: [lSigne,hSigne],
        planete: [lPlanete,hPlanete],
        jour: [lLive,hLive]
   } 
   //teste position souris/positions symboles
        var a=["maison","signe","planete","jour"],
            x,y,ctx;
            
        for (var j=0;j<a.length;j++){
            for (var i=0;i<symbole[a[j]][0].length;i++){
            if (mousePos.x<= symbole[a[j]][0][i]+10 && mousePos.x>= symbole[a[j]][0][i]-10 && mousePos.y<= symbole[a[j]][1][i]+10 && mousePos.y>= symbole[a[j]][1][i]-10){
                //création canvas (ne pas déplacer)
                [canvas,ctx]=creeCanvas("annotation",canvas);
                ctx.font = '14px serif';
                ctx.fillStyle="blue";
                //position du symbole survolé
                x=symbole[a[j]][0][i];
                y=symbole[a[j]][1][i];
                
                switch(j){
                //numéros maisons
                case 0:
                    var abc=convPositiontoDegres(positionMaison[i]);
                    var message=AtoR( i+1 )+"  "+abc.degres+" "+signes[abc.signe];
                    break;
                //symboles signes
                case 1:
                    var message=signes[i];
                    var l=browser.i18n.getMessage("dignites").split(",");
                    //dignités
                    var d=[pMaitre,,pExil,pChute,pExaltation];
                    for (var k=0;k<=4;k++){
                        if (k==1){continue}
                        message+="+"+l[k]+" : ";
                        for (var m=0;m<d[k][i].length;m++){
                            message+=planetes[d[k][i][m]];
                            if (d[k][i].length>1 && m<1){message+=", "}
                        }
                    }
                    break;
                //planètes du thème
                case 2:
                    //sort si AS-MC non coché
                    if ((i==13 || i==14) && checkAsMc.checked==false) return;
                    var message=planetes[i];
                    if (testRetrograde(i)==1) message+=" (R)";
                    if (okProgresse==0) var abc=convPositiontoDegres(positionNatal[i]);
                    else var abc=convPositiontoDegres(positionPlanete[i]);
                    message+=" "+abc.degres+" "+signes[abc.signe];  
                 //   message+=" "+abc.secondes+" "+signes[abc.signe];  
                    //liste des aspects
                    var liste=listAspects.planete[i].split(",");
                    var aspects=listAspects.aspect[i].split(","); 
                    var orbe=listAspects.orbe[i].split(",");
                    for (var k=1;k<liste.length;k++){
                        if ((liste[k]==13 || liste[k]==14) && checkAsMc.checked==false) continue; //AS-MC
                        message+="+"+aspect[aspects[k]]+" "+planetes[liste[k]]+" "+ convPositiontoDegres(orbe[k]).degres;
                    }
                    //si aspects, redessine planetes+aspects dans canvasPartielAspects
                    if (i<=14 && liste.length>1) survolAspects(i,0);
                    //position en haut à gauche pour affichage du détail planete+aspects
                    x=20; //centre[0]-(1.35*rayon);
                    y=canvas1.height/30;
                    break;
                //planetes en transit
                case 3:
                    if (okTransits==0) continue;
                    var abc=convPositiontoDegres(positionLive[i]);
                    var message="Transit ";
                    if (nomTheme2) message="Aspects "; //synastrie
                    message+=planetes[i]+ " "+abc.degres+" "+signes[abc.signe] ;
                 //   var message="Transit "+planetes[i]+ " "+abc.secondes+" "+signes[abc.signe] ;
                              
                    //testBoucle
                    var liste=listAspectsTransits.planete[i].split(",");
                    var aspects=listAspectsTransits.aspect[i].split(","); 
                    var orbe=listAspectsTransits.orbe[i].split(",");
                    for (var k=1;k<liste.length;k++){
                        if ((liste[k]==13 || liste[k]==14) && checkAsMc.checked==false) continue; //AS-MC
                        message+="+"+aspect[aspects[k]]+" "+planetes[liste[k]]+" "+ convPositiontoDegres(orbe[k]).degres;
                    }
                    //si aspects, redessine planetes+aspects dans canvasPartielAspects
                    if (i<12 && liste.length>1) survolAspects(i,1);
                    //position en haut à gauche pour affichage du détail planete+aspects
                    x=20; //centre[0]-(1.35*rayon);
                    y=canvas1.height/30;
                    break;
                }
                //affichage détails
                fillTextMultiLine(j,ctx, message, x, y);
                break;
            }
        }
    }
}, false);

function fillTextMultiLine(type,ctx, text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.2;
    var lines = text.split("+");
    //l=nombre max de caractères sur une ligne
    var l=1,iref;
    for (var i = 0; i < lines.length; ++i) {
        if (lines[i].length>l){
            l=lines[i].length;
            iref=i;
        }
    }
    //largeur max du texte
    var lineWidthMax= ctx.measureText(lines[iref]).width// * 1.2;
    //origine du texte pour maisons et signes + fond jaune
    if (type<2){
        y-=lineHeight*lines.length;
        ctx.fillStyle="yellow";
        ctx.fillRect(x-10,y-lineHeight,lineWidthMax+20,lineHeight*(lines.length+0.5));
    }
    //ecriture texte
    for (i = 0; i < lines.length; ++i) {
        //texte en bleu
        ctx.fillStyle="blue";
        ctx.fillText(lines[i], x, y);
        y += lineHeight;
    }
}

//**********gestion souris sur utc,latitude,longitude, cacheGauche, cacheCentre, cacheTitre

infoUtc.onmouseover=function(e){
     displayDivInfo(labelsGauche[17],e.pageX,e.pageY);
}
infoUtc.onmouseout=function(){
     displayDivInfo();
}
infoLatitude.onmouseover=function(e){
     displayDivInfo(labelsGauche[13],e.pageX,e.pageY);
}
infoLatitude.onmouseout=function(){
     displayDivInfo();
}
infoLongitude.onmouseover=function(e){
     displayDivInfo(labelsGauche[12],e.pageX,e.pageY);
}
infoLongitude.onmouseout=function(){
     displayDivInfo();
}
infoEquationTemps.onmouseover=function(e){
     displayDivInfo(labelsCentre[16],e.pageX,e.pageY);
}
infoEquationTemps.onmouseout=function(){
     displayDivInfo();
}
infoTransits.onmouseover=function(e){
     displayDivInfo(labelsDroite[28],e.pageX-100,e.pageY+10);
}
infoTransits.onmouseout=function(){
     displayDivInfo();
}
infoSynastrie.onmouseover=function(e){
     displayDivInfo(labelsDroite[32],e.pageX-100,e.pageY+10);
}
infoSynastrie.onmouseout=function(){
     displayDivInfo();
}
infoLieu.onmouseover=function(e){
     displayDivInfo(labelsGauche[18],e.pageX,e.pageY);
}
infoLieu.onmouseout=function(){
     displayDivInfo();
}

function displayDivInfo(text,x,y,titre){
    while (document.getElementById('divInfo')) {
       garbage=document.body.removeChild(document.getElementById('divInfo'));
    }
    if(text){
        var divInfo = document.createElement('div');
        divInfo.style.position = 'absolute';
        divInfo.style.left = x+20+'px';
        divInfo.style.top = y+'px';
        divInfo.style.color="blue";
        divInfo.style.background = 'yellow';
        divInfo.id = 'divInfo';
        divInfo.style.font = '14px serif';
        var abc=text.split("_");
        var h=abc.length;
        var element;
        if (h>1) {
            divInfo.style.top = y-15*(h+1)+'px';
            element=document.createElement('p');
            element.textContent=titre;
            element.style.fontStyle="italic"
            divInfo.appendChild(element);
          //  divInfo.textContent=titre;
            divInfo.align="center";
        }
        
        for (var i=0;i<h;i++) {
            element=document.createElement('p');
            element.textContent=abc[i];
            //si tableau des elements, mise en gras des signes du thème (avec () à la fin)
            if (abc[i].search(/\(/)>=0) element.style.fontWeight="bold";
            divInfo.appendChild(element);
        }
        document.body.appendChild(divInfo);
    }
  /*  else{
        document.body.removeChild(document.getElementById('divInfo'));
    }*/
}

/*
 //v.1.3.0 : suppression zoom (trop long pour charger les images des aspects (canvasPl)
//************************************* zoom sur canvas *******************************************************

//source : http://phrogz.net/tmp/canvas_zoom_to_cursor.html

function redraw(){
    if (!android){
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
                    }*//*
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
*/
