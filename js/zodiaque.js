var canvasTarget = document.getElementById("canvasTarget"),
    canvas1 = document.getElementById("canvas1"),
    canvas2 = document.getElementById("canvas2"),
    cadre=document.querySelector('.cadredroite'),//ne marche pas avec document.getElementsByClassName('cadredroite')
    cadre1=document.querySelector('.cadregauche'),
    cadre2=document.querySelector('.cadrecentre'),
    contenuMaisons = document.getElementById("maisons"),
    choixDate=document.getElementById('choixDate'),
    checkMaisons=document.getElementById('checkMaisons'),
    checkMaintenant=document.getElementById('checkMaintenant'),
    choixHeure=document.getElementById('choixHeure'),
    commentaire = document.getElementById("commentaire"),
    cacheGauche=document.getElementById("cachegauche"),
    cacheCentre=document.getElementById("cachecentre"),
    cacheTitre=document.getElementById("cachetitre"),
    titreCanvas= document.getElementById("titrecanvas"),
    choixNatal = document.getElementById("natal"),
    choixProgresse = document.getElementById("progresse"),
    choixProgresseNatal = document.getElementById("progresseNatal"),
    choixAnneeTransit = document.getElementById("anneeTransit"),
    choix2transitsMondiaux = document.getElementById("transitsMondiaux"),
    choix2transitsProgresseNatal = document.getElementById("transitsProgresseNatal"),
    choix2transitsProgresseProgresse = document.getElementById("transitsProgresseProgresse"),
    boutonBascule = document.getElementById("bascule"),
    boutonTest = document.getElementById("test"),
    contenuProgress = document.getElementById("progress"),
    anneeTransit=document.getElementById("anneeTransit"),
    groupe1=document.getElementById("groupe1"),
    coeffOrbe=document.getElementById("coefforbe"),
    labelCoeff=document.getElementById("labelcoeff"),
    labelCoeff2=document.getElementById("labelcoeff2"),
    labelProg=document.getElementById("labelprog"),
    fileElem = document.getElementById("fileElem"),
    choixUtc=document.getElementById("utc"),
    choixLatitude=document.getElementById("latitude"),
    choixLongitude=document.getElementById("longitude"),
    epheFrame=document.getElementById("ephemeridesIframe");
var personne="?",
    canvas,
    ctx1,
    ctx2,
    survol,
    android,
    timeoutID;
var image1= new Image;
var image2= new Image; 

var utc,
    longitude,
    latitude;
    
//valeurs par défaut (lieu...)
var placeDef="?",
    utcDef="1",
    latDef="48.51",
    longDef="2.21";
    
    
var tableau = document.createElement('table');  
    cadre.appendChild(tableau);
var tabResume = document.createElement('table');  
    cadre2.appendChild(tabResume);

var dateInterne, //(format jj/mm/yyyy) la date Firefox est aaaa-mm-jj avec dom.forms.datetime=true
    dateBrowser,
    dateMaisons,
    dateNatal,
    dateLong,
    heureNatal,
    nomNatal,
    jourSemaine,
    annee;
//Coordonnées rectangulaires équatoriales du Soleil   
var xs,
    ys,
    zs;

var planetesImages=['../images/planetes/sun-celestial.jpg','../images/planetes/moon-celestial.jpg','../images/planetes/mercury-celestial.jpg','../images/planetes/venus-celestial.jpg','../images/planetes/mars-celestial.jpg','../images/planetes/jupiter-symbol.jpg','../images/planetes/saturn-symbol.jpg','../images/planetes/uranus-symbol.jpg','../images/planetes/neptune-symbol.jpg','../images/planetes/pluto-symbol.jpg','../images/planetes/earth-astrology-symbol.jpg','../images/planetes/juno-symbol.jpg'];
var signesImages=["../images/signes/aries-zodiac-symbol.jpg","../images/signes/taurus-zodiac-symbol.jpg","../images/signes/gemini-zodiac-symbol.jpg","../images/signes/cancer-zodiac-symbol.jpg","../images/signes/leo-zodiac-symbol.jpg","../images/signes/virgo-zodiac-symbol.jpg","../images/signes/libra-zodiac-symbol.jpg","../images/signes/scorpio-zodiac-symbol.jpg","../images/signes/sagittarius-symbol.jpg","../images/signes/capricorn-symbol.jpg","../images/signes/aquarius-symbol.jpg","../images/signes/pisces-zodiac-symbol.jpg",];
var planetesFonts=["A","B","C","D","E","F","G","H","I","J","M","N","W"];
var signesFonts=["a","b","c","d","e","f","g","h","i","j","k","l"];

//secteurs radians=(Math.PI/180)*degrés : (degrés de 0 à 360)
var dignites={
   maitrise : [[4],[3],[2,5],[1,6],[0,7],[8,11],[9,10],[9,10],[8,11],[0,7]],//[planete[signe]]
   exil: [[10],[9],[11,8],[0,7],[1,6],[2,5],[3,4],[3,4],[2,5],[1,6]],
   chute: [[6],[7],[2,11],[5,8],[3,10],[4,9],[0,1],[20],[20],[20]],
   exaltation: [[0],[1],[5,8],[2,11],[4,9],[3,10],[6,7],[20],[20],[20]]
}

var positionPlanete=[],
    positionNatal=[],
    retrograde=[],   
    positionMaison=[163,185,214,248,285,317,343,6,34,69,105,137,163],
    positionMaisonNatal=[],
    positionMaisonProgresse=[],
    lPlanete=[],
    hPlanete=[],
    lMaison=[],
    hMaison=[],
    lSigne=[],
    hSigne=[],
    planeteHabite=[],
    planeteGouverne=[0,0,0,0,0,0,0,0,0,0,0],
    aspectGeneral=[];
    
var asc=180;
var r2d = 180 / Math.PI;
 
//progressé
var ecartJour=[],
    okProgresse=0;
    
//traductions
    var planetes=browser.i18n.getMessage("planetes").split(",");
    var signes=browser.i18n.getMessage("signes").split(",");
    //cadre centre
    var labelsCentre=browser.i18n.getMessage("labelsCentre").split(",");
    document.getElementById("maintenant").textContent=labelsCentre[0];
    document.getElementById("maisons").textContent=labelsCentre[1];
    document.getElementById("theme").textContent=labelsCentre[2];
    document.getElementById("choixProgresse").textContent=labelsCentre[8];
    document.getElementById("choixProgresseNatal").textContent=labelsCentre[9];
   // document.getElementById("choixProgresseProgresse").textContent=labelsCentre[4];
    document.getElementById("choixTransitsMondiaux").textContent=labelsCentre[5];
    document.getElementById("choixTransitsProgresseNatal").textContent=labelsCentre[3];
    document.getElementById("choixTransitsProgresseProgresse").textContent=labelsCentre[4];
    boutonBascule.value=labelsCentre[6];
    labelCoeff.textContent=labelsCentre[7]+" "+String.fromCharCode(177);
    labelCoeff2.textContent=labelsCentre[12];
    //cadre gauche
    var labelsGauche=browser.i18n.getMessage("labelsGauche").split(",");
    document.getElementById("nom").textContent=labelsGauche[0];
    document.getElementById("date").textContent=labelsGauche[1];
    document.getElementById("heure").textContent=labelsGauche[2];
    document.getElementById("lieu").textContent=labelsGauche[3];
    document.getElementById("add").textContent=labelsGauche[4];
    document.getElementById("effacer").textContent=labelsGauche[5];
    document.getElementById("1").placeholder=labelsGauche[11];
     //cadre droit
    var labelsDroite=browser.i18n.getMessage("labelsDroite").split(",");
 
    
//***************************exécution au démarrage***************************************** 
    for (var i=0; i<12; i++){
        positionPlanete[i]=Math.random()*30*i;
    }
  //  tableauResume();
  //  chargeDefaut();
   // dessins();
     
 //  workerEphemerides1.postMessage('blabla');
  // console.log('envoi demande chargement éphémérides1');     
   
//**********************************tracé zodiaque******************************************
/* generic error handler */
function onError(error) {
  console.log(error);
}

function ajoutZero(e){
    if (e.length==1){e="0"+e;}
    return e
}

function convDegres(z){
    var x=z%30;
    var deg=Math.floor(x);
    var minutes=Math.round(60*(x-deg));
    //utile si minutes=60
    if (minutes >=60){
        deg+=1;
        minutes=0;
    }
    var min=ajoutZero(String(minutes));
    var y=Math.floor(z/30);
    var signe=signes[y];
    return {
        degres: deg+String.fromCharCode(176)+min+"'",
        signe: y
    };
}

function valideBtns(){
    choixNatal.disabled=false;
    choixNatal.checked=true;
    choixProgresse.disabled=false;
    choixProgresseNatal.disabled=false;
    choix2transitsMondiaux.disabled=false;
    choix2transitsProgresseNatal.disabled=false;
    choix2transitsProgresseProgresse.disabled=false;
}

function devalideBtns(){
    choixNatal.disabled=true;
    choixNatal.checked=true;
    choixProgresse.disabled=true;
    choixProgresseNatal.disabled=true;
    choix2transitsMondiaux.disabled=true;
    choix2transitsProgresseNatal.disabled=true;
    choix2transitsProgresseProgresse.disabled=true;
}

function tableauResume(){
    if (tabResume){cadre2.removeChild(tabResume);}
    tabResume=document.createElement('table');  
    cadre2.appendChild(tabResume);
    //en-tête
    var header=document.createElement('theader');
    tabResume.appendChild(header);
    var row=document.createElement('tr');
    tabResume.appendChild(row);
    var cell=document.createElement('th');
    cell.setAttribute('colspan', 6);
    cell.setAttribute('class', 'thead');
    cell.textContent = choixDate.value +"  " + choixHeure.value;
    row.appendChild(cell);
    //lignes
    for (var i=0; i<=12; i++){
        row=document.createElement('tr');
        tabResume.appendChild(row);           
        //colonnes
        for (var j=0; j<=5; j++){
            cell=document.createElement('td');
            row.appendChild(cell);
            switch(j){
                case 0:
                    //planetes
                    cell.style.font="16px Zodiac";  
                    if (i<=9){cell.textContent=String.fromCharCode(65+i);}
                        //NN, Lilith
                        else if (i==10 || i==11){cell.textContent=String.fromCharCode(67+i);}
                        //NS
                        else if (i==12){cell.textContent=String.fromCharCode(87);}
                    //dignités
                    if (i<=9){
                       var abc=convDegres(positionPlanete[i]);
                       var l=["maitrise","exil","chute","exaltation"];
                       var c=["green","red","orange","blue"];
                       for (var x=0;x<l.length;x++){;
                           var max=dignites[l[x]][i].length;
                           for (var k=0;k<max;k++){
                               if (abc.signe==dignites[l[x]][i][k]){
                                   //double dignité
                                   if (cell.style.color>""){
                                        var tabCell = document.createElement('table');
                                        cell.appendChild(tabCell);
                                        tabCell.setAttribute('class','tabcell'); //pas de bordures
                                        var row2 = document.createElement('tr');
                                        tabCell.appendChild(row2);
                                        var cell2=document.createElement('td');
                                        row2.appendChild(cell2); 
                                        cell2.setAttribute('class','tabcell');
                                        cell2.textContent=String.fromCharCode(65+i);
                                        cell2.style.color=c[x];
                                   } else{cell.style.color=c[x];}
                                  break;
                               }
                           }
                      } 
                    }
                    break;
                case 1:
                    if (retrograde[i]){
                        cell.style.font = '12px serif';
                        cell.textContent="R";
                    }
                    break;
                case 2:
                    //maisons habitées (100=non défini)
                    if (planeteHabite[i]<100){
                        cell.style.font='12px serif';
                        cell.textContent=AtoR(planeteHabite[i]+1);
                        //message au survol souris
                        cell.onmouseover=function(e){
                            displayDivInfo(labelsCentre[10],e.clientX,e.clientY);
                        }
                        cell.onmouseout=function(){
                            displayDivInfo();
                        }
                    }
                    break;
                case 3:
                    //maisons gouvernées
                    if (i<=9){
                        var tabCell = document.createElement('table');
                        cell.appendChild(tabCell);
                        tabCell.setAttribute('class','tabcell'); //pas de bordures
                        var row2 = document.createElement('tr');
                        tabCell.appendChild(row2);
                        row2.style.font='12px serif';
                        row2.style.color="black";
                        for (var k=0;k<planeteGouverne[i].length;k++){ 
                            var cell2=document.createElement('td');
                            row2.appendChild(cell2); 
                            cell2.setAttribute('class','tabcell')
                            var car=planeteGouverne[i][k];
                                //maison interceptée ?
                                if (car>=100){
                                    car-=100;
                                    cell2.style.color="fuchsia";
                                }
                            cell2.textContent=String(car+1);
                        }
                        //message au survol souris
                        cell.onmouseover=function(e){
                            displayDivInfo(labelsCentre[11],e.clientX,e.clientY);
                        }
                        cell.onmouseout=function(){
                            displayDivInfo();
                        }
                    }
                    break;
                case 4:
                     //degrés
                    if (positionPlanete[i]){
                        var abc=convDegres(positionPlanete[i]);
                        cell.style.font='12px serif';
                        cell.textContent=abc.degres;
                    }
                    break;
                case 5:
                     //signes
                    cell.style.font="16px Zodiac";
                    cell.textContent=String.fromCharCode(97+abc.signe);
             }        
        }
    } 
    //légende bas du tableau
    //var l=["maitrise","exil","chute","exaltation",,"Maison interceptée"];
    var l=browser.i18n.getMessage("dignites").split(",");
    var c=["green","red","orange","blue",,"fuchsia"];
    for (var i=0;i<=4;i+=2){
        row=document.createElement('tr');
        row.align='left';
        row.style.font="'12px serif'";
        tabResume.appendChild(row);
        for (j=0;j<=1;j++){
            cell=document.createElement('td');
            row.appendChild(cell);
            cell.setAttribute('colspan', 3);
            cell.setAttribute('class','tabcell');
            if (i==4 && j==0)continue;
            cell.style.color=c[i+j];
            cell.textContent=l[i+j];
        }
    }
}

//ajustement canvas en position et taille
//source : http://jsfiddle.net/9Rmwt/11/show/ 
function setCanvas(){       
    var a=[canvas1,canvas2];
    for (var i=0;i<=1;i++){
        var canvasNode =a[i];
        var pw = canvasNode.parentNode.clientWidth;
        //=0 !  var ph = canvasNode.parentNode.clientHeight;
        canvasNode.height = pw;
        canvasNode.width = pw;
        canvasNode.style.top = 0 + "px";
        canvasNode.style.left = (pw-canvasNode.width)/2 + "px";
    }
}


function dessins() {
    //taille symboles images
var tSigne=20,
    tPlanete=30,
    AS=Math.PI/180*(asc-180);//offset en degrés de l'ascendant
    titreCanvas.textContent=personne
    //création canvas1 pour le zodiaque (effacé chaque fois sinon superpositions)
    if (canvas1) {
  	canvasTarget.removeChild(canvas1);
    }
    canvas1 = document.createElement('canvas');
    canvasTarget.appendChild(canvas1);
     //création canvas2 pour axe X
    if (canvas2) {
        canvasTarget.removeChild(canvas2);
    }
    canvas2 = document.createElement('canvas');
    canvasTarget.appendChild(canvas2);
    //dimensions et positionnement
    setCanvas();
    ctx1 = canvas1.getContext("2d");
    ctx2 = canvas2.getContext("2d");
    var centre=[canvas1.width/2,canvas1.height/2.8];
    var rayon=0.3*canvas1.width //width;   
    
    //tracé axe X
    ctx2.beginPath();
    ctx2.moveTo(centre[0]-rayon, centre[1]);
    ctx2.lineTo(centre[0]+rayon, centre[1]);
    ctx2.stroke()
    //annotations AS-DS
    ctx2.font = '16px serif';
    ctx2.fillText(convDegres(asc).degres+" AS", centre[0]-rayon-90, centre[1]+8);
    ctx2.fillText("DS", centre[0]+rayon+10, centre[1]+8);
    
    //tracé zodiaque en partant du centre
    ctx1.moveTo(centre[0], centre[1]);
    for (var i=0; i < 12 ; i++){
        
      //signes
        //couleur et style des secteurs signes (cw) : hsla(H, S, L, A) H=couleur (0=rouge, 30=orange, 60=jaune)
        ctx1.fillStyle ="hsla(" + 60*i + ",70%, 50%,0.10)" 
        
        //tracé secteurs signes : ctx1.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        ctx1.beginPath(); // laisser là sinon il n'y a qu'une couleur utilisée
        ctx1.arc(centre[0], centre[1], rayon, i*(Math.PI/6)+AS, (i+1)*(Math.PI/6)+AS, false);
        ctx1.lineTo(centre[0], centre[1]);
        ctx1.fill();
        
     //maisons   
        //couleur et style des secteurs maisons (ccw)
        ctx2.moveTo(centre[0], centre[1]);
        ctx2.beginPath();
        ctx2.strokeStyle ='rgba(' + 0  + ', ' + 0 + ', ' + 0 +  ',' + 0.5 + ')'
        ctx2.setLineDash([2, 2]) //pointillés

        //ecart0=écart/origine (maison 1 à 180 deg.)
        var ecart0=positionMaison[i]-positionMaison[0];
        if (ecart0<0){
            ecart0+=360; 
        } 
        var startAngle=Math.PI-(Math.PI/180*ecart0)
        
        //ecart1=écart entre 2 position maisons
        var ecart1=positionMaison[i+1]-positionMaison[i];
        if (ecart1<0){
            ecart1+=360; 
        } 
        var endAngle=startAngle-(Math.PI/180*ecart1)
        
        //axe MC en trait continu
        if (i===8 || i===2){
             ctx2.setLineDash([]);
        }    
        // annotation MC
         if (i===9){
             var lMC=centre[0]+(Math.cos(startAngle*1.03)*(rayon+10));
             var hMC=centre[1]+(Math.sin(startAngle*1.03)*(rayon+10));
             ctx2.fillText("MC ", lMC, hMC);
             ctx2.fillText(convDegres(positionMaison[9]).degres, lMC-10, hMC-20);
         } 
         
         // annotation FC
         if (i===3){
             var lMC=centre[0]+(Math.cos(startAngle*1.015)*(rayon+18));
             var hMC=centre[1]+(Math.sin(startAngle*1.015)*(rayon+18));
             ctx2.fillText("FC", lMC-8, hMC+8);
         } 
         
        //tracé secteurs maisons
            //cercle externe
            ctx2.arc(centre[0], centre[1], rayon+10, startAngle, endAngle, true);
            ctx2.lineTo(centre[0], centre[1]);
            //cercle interne
            ctx2.arc(centre[0], centre[1], rayon/4+20, startAngle, endAngle, true);
            ctx2.stroke();
        
        //écriture numéros maisons
             
        lMaison[i]=centre[0]+Math.cos((startAngle+endAngle)/2)*(rayon+10);
        hMaison[i]=centre[1]+Math.sin((startAngle+endAngle)/2)*(rayon+10);         
        ctx2.fillText(AtoR(i+1), lMaison[i]-8, hMaison[i]+8);
        
    //symboles signes et planètes  
        //position des symboles signes (x/y)
        lSigne[i]=centre[0]+Math.cos(i*Math.PI/6+Math.PI/12-AS)*(rayon/4);
        hSigne[i]=centre[1]-Math.sin(i*Math.PI/6+Math.PI/12-AS)*(rayon/4);
        
        //position des symboles planètes (x/y) avec décalage si superposition
        var offset=0;
        for (var j=0; j<=i;j++){
                if (Math.abs(positionPlanete[j]-positionPlanete[i])<5){
                    offset-=20;
                }
        }
        lPlanete[i]=centre[0]+Math.cos(Math.PI/180*positionPlanete[i]-AS)*(rayon+offset);
        hPlanete[i]=centre[1]-Math.sin(Math.PI/180*positionPlanete[i]-AS)*(rayon+offset);
        
        //écriture des symboles signes et planètes avec fonts Zodiac
        let taille=20;
        ctx1.font="20px Zodiac"  //String(taille)+"px Zodiac" //ne marche pas avec Chrome (="20px "Zodiac"")
        if (ctx1.font=="20px Zodiac"){  //condition à revoir  !
            ctx1.fillStyle="rgb(100,100,100)";     
            ctx1.fillText(signesFonts[i], lSigne[i]-taille/2, hSigne[i]+taille/2);
            ctx1.fillText(planetesFonts[i], lPlanete[i]-taille/2, hPlanete[i]+taille/2);
            //rétrograde ?
            if (retrograde[i]){
               ctx1.font = '12px serif';
               let lR=taille-10;
               if (lPlanete[i]-centre[0]<0){lR=-taille;}
               ctx1.fillText("R", lPlanete[i]+lR,hPlanete[i]); 
            }
            //NS
            if (i==11){
                ctx1.font="20px Zodiac" //String(taille)+"px Zodiac"
                lPlanete[12]=centre[0]+Math.cos(Math.PI/180*positionPlanete[12]-AS)*(rayon/1.4);
                hPlanete[12]=centre[1]-Math.sin(Math.PI/180*positionPlanete[12]-AS)*(rayon/1.4);
                ctx1.fillText(planetesFonts[12], lPlanete[12]-taille/2, hPlanete[12]+taille/2);
            }
         } else {
        //ancienne méthode avec des symboles en images
        /*symboles signes - ne pas déclarer en-dehors boucle sinon n'affiche que la dernière image
        ctx1.drawImage(image, dx, dy, dWidth, dHeight); dx:position calculée -1/2 dxwidth pour centrer l'image sur la position calculée (idem avec hauteur dy)*/
            var signe=new Image();
            signe.src=signesImages[i];
            signe.onload=ctx1.drawImage(signe, lSigne[i]-(tSigne/2), hSigne[i]-(tSigne/2),tSigne,tSigne);
            //symboles planètes
            var planete =new Image(); //ou = document.createElement('img');
            planete.src =planetesImages[i]; //ou = planete.setAttribute('src', list[i]);
            planete.onload=ctx1.drawImage(planete, lPlanete[i]-(tPlanete/2), hPlanete[i]-(tPlanete/2),tPlanete,tPlanete);
           }
  }
  if (checkMaisons.checked==false){
     canvas2.hidden=true
  }  
  tableauResume();
  aspects(ctx1,lPlanete,hPlanete);
  //sauvegarde images canvas pour zoom
  image1.src=canvas1.toDataURL("image/png");
  image2.src=canvas2.toDataURL("image/png");
  survol=1;
  trackTransforms(ctx1,ctx2);
}

 
// conversion d'un entier en nombre romain
function AtoR( nb ){
    var A = [ 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 ],
	R = [ "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" ],
	Alength = A.length;
	// on s'assure d'avoir un entier entre 1 et 3999.
	var x = parseInt( nb, 10 ) || 1,
		str = "";
 
	if ( x < 1 ){
		x = 1;
	} else if ( x > 3999 ){
		x = 3999;
	}
 
	// pour chaque A[ i ], 
	// tant que x est supérieur ou égal
	// on déduit A[ i ] de x.
	// arrêt de la boucle si x == 0
	for ( var i = 0; i < Alength; ++i ){
		while ( x >= A[ i ] ){
			x -= A[ i ];
			str += R[ i ];
		}
 
		if ( x == 0 ){
			break;
		}
	}
 
	return str;
}
 
    

//attention, aspects avec ctx1 (pas ctx2) sinon décalage dû à rotation de l'ascendant
function aspects(ctx1,lPlanete,hPlanete){
    var angle=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360],
      //  aspect=["conjonction","semi-sextile","semi-carré","sextile","carré","trigone","sesqui-carré","quinconce","opposition","quinconce","sesqui-carré","trigone","carré","sextile","semi-carré","semi-sextile","conjonction"],
        aspect=browser.i18n.getMessage("aspects").split(","),
        couleur=['red','blue','red','blue','red','blue','blueviolet','darkturquoise','red','darkturquoise','blueviolet','blue','red','blue','red','blue','blue'],
        orbe=[15,2,2,4,8,8,2,0.5,10,0.5,2,8,8,4,2,2,15],
        tolerance;
    var aspectSujet=[],
        aspectAgent=[];
        
        //tolérances progressé
        if (okProgresse==1){
            for (var i=0; i<=11; i++){
                orbe[i]=coeffOrbe.value*Math.abs(ecartJour[i]);
            }
        }
    var x=0;    
    //planete sujet
     for (var i=0; i<=11; i++){ 
         if (okProgresse==1){tolerance=orbe[i];}
        //planete agent
        for (var j=i+1; j<=11; j++){
            var gap=positionPlanete[i]-positionPlanete[j];
            if (gap<0){gap+=360;}
            //aspects
            for (var k=0; k<=16; k++){
                //exclusions (NN et Lilith conjonctions seulement)
                if (k>0 && k<16 && (i==10 || i==11 || j==10 || j==11)){continue;}
                //tolérance natal
                if (okProgresse==0){tolerance=orbe[k]} 
                //tracé aspects
                if (gap<(angle[k]+tolerance) && gap>(angle[k]-tolerance)){
                   ctx1.strokeStyle ="hsla(" + 70*i + ",100%, 50%,0.1)" 
                   ctx1.beginPath();
                   ctx1.moveTo(lPlanete[i], hPlanete[i]);
                   ctx1.lineTo(lPlanete[j], hPlanete[j]);
                   ctx1.strokeStyle = couleur[k];
                   ctx1.stroke();
                   //sauvegarde sujet,agent,aspect
                   aspectSujet[x]=[i,j,aspect[k]];
                   x+=1;
                   break;
                }
            }
        }
     }
    //sauvegarde agent,sujet,aspect
    x=0;
    for (var i=0;i<=11;i++){
        for (var j=0;j<aspectSujet.length;j++){
            if (aspectSujet[j][1]==i){
                aspectAgent[x]=[i,aspectSujet[j][0],aspectSujet[j][2]];
                x+=1;
            }
        }
    }
    //classement général sujet,aspect,agent
    aspectGeneral=[];
    for (var i=0;i<=11;i++){
        for (var j=0;j<aspectSujet.length;j++){
            if (aspectSujet[j][0]==i){
                if (aspectGeneral[i]) {aspectGeneral[i]+="+"+aspectSujet[j][2]+" "+planetes[aspectSujet[j][1]];}
                else {aspectGeneral[i]=aspectSujet[j][2]+" "+planetes[aspectSujet[j][1]];}
            } 
        }
        for (var j=0;j<aspectAgent.length;j++){
            if (aspectAgent[j][0]==i){
                if (aspectGeneral[i]) {aspectGeneral[i]+="+"+aspectAgent[j][2]+" "+planetes[aspectAgent[j][1]];}
                else {aspectGeneral[i]=aspectAgent[j][2]+" "+planetes[aspectAgent[j][1]];}
            }
        }
    }
}

    
function dateJour(){
    //date actuelle
    var datetime = new Date();
    annee=datetime.getFullYear();
        //jour et mois sur 2 chiffres
            var jour=String(datetime.getDate());
            jour=ajoutZero(jour);
            //ajoute 1 au mois (numérotés de 0 à 9)
            var mois=String(Number(datetime.getMonth())+1);
            //mois sur 2 chiffres
            mois=ajoutZero(mois);
        //date interne jj/mm/aaaa
        dateInterne=jour+"/"+mois+"/"+annee;
        anneeTransit.value=annee;
        
    //affiche heure actuelle sauf en progressé (UTChour=heure-1)
    if (okProgresse==0){
        var heure=String(Number(datetime.getUTCHours())+1);
        var minutes=String(datetime.getMinutes());
        //heure sur 2 chiffres
        heure=ajoutZero(heure);
        minutes=ajoutZero(minutes);
        choixHeure.value=heure+":"+minutes;
    }
    //contrôle format
    controleDate(dateInterne);
}


function controleDate(date){
 var reponse="non";
 if (date.length ==10){
     reponse="oui";
    //type date : aaaa-mm-jj, type text : jj/mm/aaaa
   if (choixDate.type==="date") { //dom.forms.datetime=true (aaaa-mm-jj)
       if (date.split('-').length>1){
            dateInterne=date.slice(8,10) +"/"+date.slice(5,7)+"/"+ date.slice(0,4);
            dateBrowser=date;
            dateMaisons=dateBrowser;
        }
        else if (date.split('/').length>1){
            dateInterne=date;
            dateBrowser=date.slice(6,10) +"-"+date.slice(3,5)+"-"+date.slice(0,2);
            dateMaisons=dateBrowser;
        }
   } else if (choixDate.type==="text"){ //dom.forms.datetime=false (jj/mm/aaaa) 
       if (date.split('-').length>1){
            dateInterne=date.slice(8,10) +"/"+date.slice(5,7)+"/"+ date.slice(0,4);
            dateBrowser=dateInterne;
            dateMaisons=date.slice(6,10) +"-"+date.slice(3,5)+"-"+date.slice(0,2);
        }
        else if (date.split('/').length>1){
            dateInterne=date;
            dateBrowser=date;
            dateMaisons=date.slice(6,10) +"-"+date.slice(3,5)+"-"+date.slice(0,2);
        }
     } 
 }
    
  dateLong=datelongue(dateMaisons);
  annee=dateInterne.slice(dateInterne.length-4);
  choixDate.value=dateBrowser;
  return reponse;
}  

//date au format long (jour de la semaine et mois en lettres)
function datelongue(date){
    var date = new Date(date);
    var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'};
    var langue=browser.i18n.getUILanguage()
    var dateTime=new Intl.DateTimeFormat(langue, options).format(date); 
    return dateTime;
}
  
function feuilleTransits(colonneDebut,colonneFin){
    var tabCell;
    choixNatal.checked=false;
    choixProgresseNatal.checked=false;
     if (tableau) {
  	cadre.removeChild(tableau);
    }
    //création tableau
    tableau = document.createElement('table');
    tableau.setAttribute('width', '100%');
    cadre.appendChild(tableau);
    //en-tête général
    var header=document.createElement('theader');
    tableau.appendChild(header);
    var row = document.createElement('tr');
    tableau.appendChild(row);
    var cell = document.createElement('th');
    cell.setAttribute('class', 'thead');
    cell.setAttribute('height', '30px');
    cell.setAttribute('colspan', 8);
    cell.textContent = 'en-tête';
    row.appendChild(cell);
    //en-têtes lignes et colonnes
        //lignes
        for (var i=0; i<15; i++){
            row = document.createElement('tr');
            tableau.appendChild(row);
            tableau.rows[i+1].style.font="16px Zodiac"
            
            //colonnes
            for (var j=colonneDebut-1; j<=colonneFin; j++){
                cell = document.createElement('td');
                row.appendChild(cell);
                if(i==0 && j>=colonneDebut){
                     cell.textContent = planetesFonts[j];
                        
                }else if(j<colonneDebut){
                     cell.style.font='16px serif';
                     cell.style.backgroundColor="rgb(240,240,240)";
                       if(i==1){
                        //"Maison";  
                        cell.textContent =labelsDroite[19];
                        }
                       else if(i==2){
                        //"Signe"; 
                        cell.textContent =labelsDroite[20];
                        }
                       else if(i>2){
                        //mois en lettres
                        var date = new Date(Date.UTC(2012,i-3,20));
                        var options = { month: 'long'};
                        var langue=browser.i18n.getUILanguage()
                        var dateTime=new Intl.DateTimeFormat(langue, options).format(date);  
                        cell.textContent =dateTime;
                        }
                        else{
                        tabCell = document.createElement('table');
                        cell.appendChild(tabCell); 
                        }
                    }
                row.appendChild(cell);
                }
        } 
}  

function feuilleEcritTransits(cellule,couleur,contenu){
     //cherche doublons 
     var abc;
     var index;
     var ok=1;
     var max=cellule.children.length;
     for (i=0;i<max;i++){
        abc=cellule.children.item(i).textContent;  
        index=abc.search("  ");
        var x=0;
        //caractères comparés 1 par 1 sinon le "+" (=aspect croissant) génère une erreur
        for (var j=0;j<index;j++){
            if (abc[j]==contenu[j]){x+=1;}
            else break;
        }
        //doublon
        if (x==index){
            ok=0;
            break;
        }
        
     }
     if (ok==1){
        cellule.align='center';
        //création d'une sous-cellule
        var row=document.createElement('tr');
        cellule.appendChild(row);
        var cell=document.createElement('td');
        row.appendChild(cell);
        cell.setAttribute('class','tabcell'); //pas de bordures
        cell.style.color=couleur;
        cell.textContent=contenu;
     }
}

function requetes(date,heure,nom){
    if (controleDate(date)=="oui"){
        choixHeure.value=heure;
        if (calculEphemerides(dateMaisons,choixHeure.value)=="oui"){
            if (!nom){
                personne=labelsDroite[0]+ dateLong + " -  " + choixHeure.value + " "+placeDef + " (utc "+utcDef +", lat. "+latDef +", long. "+ longDef +")";
                }else if(nom==nomNatal){
                    personne=nomNatal +labelsDroite[8]+dateLong +labelsDroite[18] +choixHeure.value;
                }
            rechercheMaisons(heure,dateMaisons);
            sauvePositionsMaisons("natal"); 
            dessins();
        }
    }
}    

//******************************************listeners**************************************


 checkMaintenant.addEventListener("change",() => {
    //charge les valeurs par défaut (ville,utc,etc.)
    var getting = browser.storage.local.get("zodiaque");
    getting.then((result) => {
        var objTest = Object.keys(result);
        if (objTest.length){
            placeDef=result.zodiaque[0];
            utcDef=result.zodiaque[1];
            latDef=result.zodiaque[2];
            longDef=result.zodiaque[3];
        }
     },onError);

    utc=Number(utcDef);
    //conversion deg.min en degres.decimales
    var x=Number(latDef); //48.51;
    var y=Math.floor(x);
    latitude=y+((x-y)*10/6);
    x=Number(longDef); //2.21;
    y=Math.floor(x);
    longitude=y+((x-y)*10/6);
    //divers
    devalideBtns();
    okProgresse=0;
    coeffOrbe.hidden=true;
    labelProg.hidden=true;
    tableau.hidden=true;
    dateJour();
    if (utc && latitude && longitude) {requetes(dateInterne,choixHeure.value);}
    else {console.log("placedef,utcdef,latdef,longdef : "+placeDef+", "+utcDef+", "+latDef+", "+longDef);}
},onError); 
 
 
 checkMaisons.addEventListener("change",() => {
    if (checkMaisons.checked==false){
         asc=180;
         canvas2.hidden=true;
    }else{
        asc=positionMaison[0];
        canvas2.hidden=false;
    }
     dessins();
},onError); 
 

choixDate.addEventListener("change",() => {
    checkMaintenant.checked=false
    tableau.hidden=true;
    if (okProgresse==0){
     requetes(choixDate.value,choixHeure.value);
    } else{
       controleDate(choixDate.value);
       rechercheThemeProgresse(dateNatal,choixHeure.value);
       dessins();
    }
},onError);   
 

choixHeure.addEventListener("change",() => {
    checkMaintenant.checked=false
    tableau.hidden=true;
    if (okProgresse==0){
        personne=labelsDroite[0] + dateLong +" - "+ choixHeure.value;
        requetes(choixDate.value,choixHeure.value);
    } else{
        rechercheThemeProgresse(dateNatal,choixHeure.value);
        dessins();
        
      }
},onError); 

//boutons radio choix1 : natal ou progresse (listener ne marche pas avec les 2 regroupés)
choixNatal.onchange=function(){
    checkMaintenant.checked=false;
    tableau.hidden=true;
    choix2transitsMondiaux.checked=false;
    choix2transitsProgresseNatal.checked=false;
    choix2transitsProgresseProgresse.checked=false;
    if (choixNatal.checked==true){
        okProgresse=0;
        coeffOrbe.hidden=true;
        labelProg.hidden=true;
        personne=nomNatal;
        requetes(dateNatal,heureNatal,nomNatal);
    }
} 
choixProgresse.onchange=function(){
    checkMaintenant.checked=false;
    tableau.hidden=true;
    choix2transitsMondiaux.checked=false;
    choix2transitsProgresseNatal.checked=false;
    choix2transitsProgresseProgresse.checked=false;
    if (choixProgresse.checked==true){
        okProgresse=1;
        coeffOrbe.hidden=false;
        labelProg.hidden=false;
        dateJour();
        rechercheThemeProgresse(dateNatal,choixHeure.value);
        dessins();
    }
}
//case maisons natales
choixProgresseNatal.onclick=function(){
    if (okProgresse==1){
        choixProgresse.checked=false;
        choixProgresse.click();        
    }
} 

choixAnneeTransit.onchange=function(){
    choix2transitsMondiaux.checked=false;
    choix2transitsProgresseNatal.checked=false;
    choix2transitsProgresseProgresse.checked=false;
}
//boutons radio choix2 : transits
choix2transitsMondiaux.onchange=function(){
    checkMaintenant.checked=false
    canvas1.hidden=true;
    canvas2.hidden=true;
    feuilleTransits(5,11);
    rechercheTransitsMondiaux(anneeTransit.value);    
}

choix2transitsProgresseNatal.onchange=function(){
    checkMaintenant.checked=false
    canvas1.hidden=true;
    canvas2.hidden=true;
    feuilleTransits(0,6);
    rechercheTransitsProgresses(dateNatal,choixHeure.value);
} 

choix2transitsProgresseProgresse.onchange=function(){
    checkMaintenant.checked=false
    canvas1.hidden=true;
    canvas2.hidden=true;
    feuilleTransits(0,6);
    rechercheTransitsProgresses(dateNatal,choixHeure.value);
} 


boutonBascule.onclick=function(){
    if (canvas1.hidden==true){
        canvas1.hidden=false;
        canvas2.hidden=false;
        tableau.hidden=true;
    }else{
        canvas1.hidden=true;
        canvas2.hidden=true;
        tableau.hidden=false;        
    }    
} 
 

//cache panneaux de gauche
cacheGauche.addEventListener("change",() => {
    if (cacheGauche.checked==true)cadre1.hidden=false;
            else cadre1.hidden=true;
    if (tableau.hidden==true)dessins();
},onError);
cacheCentre.addEventListener("change",() => {
    if (cacheCentre.checked==true)cadre2.hidden=false;
            else cadre2.hidden=true;
    if (tableau.hidden==true)dessins();
},onError);
cacheTitre.addEventListener("change",() => {
    if (cacheTitre.checked==true)titreCanvas.hidden=false;
            else titreCanvas.hidden=true;
},onError);
//orbe progressé
coefforbe.addEventListener("change",() => {
        dessins();
},onError);  

//teste fin de chargement de la page
window.onload=function() {
    commentaire.innerHTML ="Ephemerides NN-Lilith 1800-2039";
    checkMaintenant.click();
    survol=1;
    android=0;
    //pas de zoom si android
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
    if(isAndroid) {
	android=1;
    }
    //sauvegarde images canvas pour zoom
    image1.src=canvas1.toDataURL("image/png");
    image2.src=canvas2.toDataURL("image/png");
    trackTransforms();
}  

//pas utilisé ?
window.onresize =function() {
    if (canvas1.hidden==false){
        setCanvas();
        dessins();
    }
}

boutonTest.onclick=function(){

} 

//pas utilisé
fileElem.addEventListener("change",() => {
    gereFichier();
},onError); 
