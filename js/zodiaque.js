//canvas
var canvasTarget = document.getElementById("canvasTarget"),
//div
    cadre=document.querySelector('.cadredroite'),//ne marche pas avec document.getElementsByClassName('cadredroite')
    cadre1=document.querySelector('.cadregauche'),
    cadre2=document.querySelector('.cadrecentre'),
    commentaire=document.getElementById("commentaire"),
    groupe1=document.getElementById("groupe1"),
    margeDiv=document.getElementById("marge"),
//image
    infoUtc=document.getElementById("info_utc"),
    infoLatitude=document.getElementById("info_latitude"),
    infoLongitude=document.getElementById("info_longitude"),
    infoEquationTemps=document.getElementById("imgEquationTemps"),
    infoTransits=document.getElementById("infoTransits"),
    infoSynastrie=document.getElementById("infoSynastrie"),
    infoLieu=document.getElementById("infoLieu"),
//input button
    boutonBascule = document.getElementById("bascule"),
    boutonTest = document.getElementById("test"),
//input checkbox
    checkMaisons=document.getElementById('checkMaisons'),
    checkMaintenant=document.getElementById('checkMaintenant'),
    cacheGauche=document.getElementById("cacheGauche"),
    cacheCentre=document.getElementById("cacheCentre"),
    cacheTitre=document.getElementById("cacheTitre"),
    checkMaisonsNatales = document.getElementById("checkMaisonsNatales"),//maisons natales en progressé
    checkEquationTemps = document.getElementById("checkEquationTemps"),
    checkAsMc = document.getElementById("checkAsMc"),
//input date, time
    choixDate=document.getElementById('choixDate'),
    choixHeure=document.getElementById('choixHeure'),
//input file pas utilisé
    fileElem = document.getElementById("fileElem"),
//input number
    anneeTransit=document.getElementById("anneeTransit"),
    coeffOrbe=document.getElementById("coefforbe"),
    valUtc=document.getElementById("4"),
    valLatitude=document.getElementById("5"),
    valLongitude=document.getElementById("6"),
    luminosite=document.getElementById("luminosite"),
    incJour=document.getElementById("incJour"),
    incMois=document.getElementById("incMois"),
    incAn=document.getElementById("incAn"),
    incHeure=document.getElementById("incHeure"),
    incMinute=document.getElementById("incMinute"),
//input radio
    choix1=document.getElementsByName("choix1"), //thème natal ou progressé
    choix2=document.getElementsByName("choix2"), //transits
    choix3=document.getElementsByName("choix3"), //éléments
    choix4=document.getElementsByName("choix4"), //theme ou transits graphiques
//label, titre
    titreCanvas= document.getElementById("titrecanvas"),
    labelCoeff=document.getElementById("labelcoeff"),
    labelCoeff2=document.getElementById("labelcoeff2"),
    labelProg=document.getElementById("labelprog"),
    labelMaisonsNatales=document.getElementById("labelMaisonsNatales"),
    labelEquationTemps=document.getElementById("labelEquationTemps"),
    choixUtc=document.getElementById("utc"),
    choixLatitude=document.getElementById("latitude"),
    choixLongitude=document.getElementById("longitude");
 
    
var titreTheme="?",
    coordonnees,
    canvas,
    canvas1, //secteurs signes, annotations marge
    canvas2, //secteurs maisons
    canvas3, //symboles planètes
    canvas4, //symboles signes
    canvas5, //mondial
    canvasPartielAspects, //aspects ou phases / planete,
    canvasGlobalAspects, //aspects theme + aspects-planetes externes
    canvasLive, //planetes en transit (exterieur du theme)
    ctx1,
    ctx2,
    ctx3,
    ctx4,
    ctx5,
    centre=[],
    rayon,
    taille=20,
    fontTableau,
    navigateur,
    android,
    garbage,
    fixePhases=0,
    refPhase,
    okTransits,
    timeoutID;

//v.1.3.0 : suppression zoom    
/*var image1= new Image,
    image2= new Image; 
var imAs=[new Image,new Image,new Image,new Image,new Image,new Image,new Image,new Image,new Image,new Image,new Image,new Image];*/

var utc,
    utcLocal,
    longitude,
    longLocal,
    latitude,
    latLocal,
    lux=0.15,
    demarrage;
    
//valeurs par défaut (lieu...)
var utcDef="1",
    latDef="48.51",
    longDef="2.21",
    luxDef, //="0.2";
    orbesDef=[];
    valUtc.value=utcDef;
    
var tableau = document.createElement('table');  
    cadre.appendChild(tableau);
var tabResume = document.createElement('table');  
    cadre2.appendChild(tabResume);
var tabDominantes = document.createElement('table');  
    cadre2.appendChild(tabDominantes);

var dateInterne, //(format jj/mm/yyyy) la date Firefox est aaaa-mm-jj avec dom.forms.datetime=true
    dateBrowser,
    dateMaisons,
    dateNatal,
    dateTheme2,
    dateLong,
    heureNatal,
    heureTheme2,
    nomNatal,
    nomTheme2,
    anChinois,
    natProg,
    equationProg,
    anChinois,
    elementChinois;
    
//Coordonnées rectangulaires équatoriales du Soleil   
var xs,
    ys,
    zs;

var planetesFonts=["A","B","C","D","E","F","G","H","I","J","M","N","W","K","L"];
var signesFonts=["a","b","c","d","e","f","g","h","i","j","k","l"];

//secteurs radians=(Math.PI/180)*degrés : (degrés de 0 à 360)
var dignites={
   maitrise : [[4],[3],[2,5],[1,6],[0,7],[8,11],[9,10],[9,10],[8,11],[0,7]],//[planete[signe]]
   exil: [[10],[9],[11,8],[0,7],[1,6],[2,5],[3,4],[3,4],[2,5],[1,6]],
   chute: [[6],[7],[2,11],[5,8],[3,10],[4,9],[0,1],[20],[20],[20]],
   exaltation: [[0],[1],[5,8],[2,11],[4,9],[3,10],[6,7],[20],[20],[20]]
}
//planetes maîtresses, exil,etc en fonction des signes; ex pMaitre[0]=belier=4(mars) et 9(pluton), pMaitre[2]=gemeaux=2(mercure)
var pMaitre=[[4,9],[3],[2],[1],[0],[2],[3],[4,9],[5,8],[6,7],[6,7],[5,8]];
var pExil=[[3],[4,9],[5,8],[6,7],[6,7],[5,8],[4,9],[3],[2],[1],[0],[2]];
var pChute=[[6],[6],[2],[4],[5],[3],[0],[1],[3],[5],[4],[2]];
var pExaltation=[[0],[1],[3],[5],[4],[2],[6],[6],[2],[4],[5],[3]];

var positionPlanete=[],
    positionNatal=[],
    retrograde=[], 
    retrogradeNatal=[],
    positionMaison=[163,185,214,248,285,317,343,6,34,69,105,137,163],
    positionMaisonNatal=[],
    positionMaisonProgresse=[],
    positionLive=[],
    lPlanete=[],
    hPlanete=[],
    lMaison=[],
    hMaison=[],
    lSigne=[],
    hSigne=[],
    lLive=[],
    hLive=[],
    lInt=[],
    hInt=[],
    lExt=[],
    hExt=[],
    planeteHabite=[],
    planeteGouverne=[0,0,0,0,0,0,0,0,0,0,0],
    listAspects={
        planete: [],
        aspect: [],
        couleur: [],
        orbe: []
   };
   listAspectsTransits={
        planete: [],
        aspect: [],
        couleur: [],
        orbe: []
   };

//ex utilisation : dominante["binaire"[0], dominante["binaire"[1], dominante[a[j]][0].length, dominante[a[j]][0][i]
var dominantes={
        binaire: [], //yang,yin[planètes personnnelles,collectives]
        ternaire: [], //cardinal,fixe,mutable
        quaternaire: [], //feu,terre,air,eau
        qualite: [], //sec,humide
        primarite: [], //primaire,secondaire
        hemicyclesAB: [], //A,B
        hemicyclesCD: [] //C,D
   };
   
var signes_indiv=[];
var bulles=[[0,2,4,6,8,10],[1,3,5,7,9,11],[0,3,6,9],[1,4,7,10],[2,5,8,11],[0,4,8],[1,5,9],[2,6,10],[3,7,11],[0,3,4,7,8,11],[1,2,5,6,9,10],[0,1,2,9,10,11],[3,4,5,6,7,8],[6,7,8,9,10,11],[0,1,2,3,4,5]];
 /*   yang: [0,2,4,6,8,10]=belier,gemeaux,etc.
    yin,cardinal,fixe,mutable,feu,terre,air,eau,primaire,secondaire,A,B,C,D=bélier à vierge}*/

var asc=180;
var AS;//offset en degrés de l'ascendant
var AStemp;
var r2d = 180 / Math.PI;
 
//progressé
var ecartJour=[],
    ecartLive=[],
    ecartProg,
    okProgresse=0;
//marge droite
var margePl=[];
    
//********************************* traductions *****************************************************
    var planetes=browser.i18n.getMessage("planetes").split(",");
    var signes=browser.i18n.getMessage("signes").split(",");
    var aspect=browser.i18n.getMessage("aspects").split(",");
    var labelOptions=browser.i18n.getMessage("options").split(",");
    var placeDef=labelOptions[2]; //"?", //ville par défaut non définie

    var labelsGauche=browser.i18n.getMessage("labelsGauche").split(",");
    var labelsCentre=browser.i18n.getMessage("labelsCentre").split(",");
    var labelsDroite=browser.i18n.getMessage("labelsDroite").split(",");
    var labelsDominantes=browser.i18n.getMessage("dominantes").split(",");
   
    var chine=browser.i18n.getMessage("chine").split(",");
   
function traductions(){
    //cadre gauche
    var a=["nom","date","heure","lieu","add","effacer","1"];
    var b=[0,1,2,3,4,5,11];
    for (var i=0;i<b.length;i++){
        document.getElementById(a[i]).textContent=labelsGauche[b[i]];
    }
    //cadre centre
    a=["maintenant","maisons","theme","choixTransitsProgresseNatal","choixTransitsProgresseProgresse","choixTransitsMondiaux","choixProgresse","labelMaisonsNatales","labelEquationTemps","choixTheme"];
    b=[0,1,2,3,4,5,8,9,15,2];
    for (i=0;i<b.length;i++){
        document.getElementById(a[i]).textContent=labelsCentre[b[i]];
    }
    //cadre droit
    a=["labelCache0","labelCache1","labelCache2","labelLuminosite","jma","choixTransits"];
    b=[23,24,25,26,29,31];
    for (i=0;i<b.length;i++){
        document.getElementById(a[i]).textContent=labelsDroite[b[i]];
    }
    //dominantes
    a=["label2Choix3","label3Choix3","label4Choix3","label0Choix3"];
    b=[19,20,21,22];
    for (i=0;i<b.length;i++){
        document.getElementById(a[i]).textContent=labelsDominantes[b[i]];
    }
    
    boutonBascule.value=labelsCentre[6];
    labelCoeff.textContent=labelsCentre[7]+" "+String.fromCharCode(177);
    labelCoeff2.textContent=labelsCentre[12];
}

//***************************exécution au démarrage***************************************** 
 
 //  workerEphemerides1.postMessage('blabla');
  // console.log('envoi demande chargement éphémérides1');     
   
//**********************************initialisations******************************************
/* generic error handler */
function onError(error) {
  console.log(error);
}

function terminaison(texte,fin){
    if (texte.endsWith(fin)==true){texte=texte.slice(0,texte.length-fin.length)}
    return texte;
}

function canvasCache(choix){
    if (!canvas1)return;
    canvas1.hidden=choix;
    canvas2.hidden=choix;
    if (checkMaisons.checked==false)canvas2.hidden=true; //maisons
    canvas3.hidden=choix;
    canvas4.hidden=choix;
    canvas5.hidden=true;
    margeDiv.hidden=choix; 
    canvasGlobalAspects.hidden=choix;
    canvasPartielAspects.hidden=true; 
    canvasLive.hidden=choix;    
}

function ajoutZero(e){
    if (e.length==1){e="0"+e;}
    return e
}

function convPositiontoDegres(z){
    var negatif="";
    if (z<0) {
        negatif="-";
        z=Math.abs(z);
    }
    var x=z%30;
    var deg=Math.floor(x);
    var minutesFull=60*(x-deg);
    var minutesLow=Math.floor(minutesFull);
    var minutes=Math.round(minutesFull);
    var secondes=Math.round(60*(minutesFull-minutesLow));
    var degSec=deg;
    var inc=0;
    
    //utile si minutes=60
    if (minutes >=60){
        deg+=1;
        if (deg >= 30) {
            deg=0;
            inc=1;
        }
        if (minutesFull>=60) degSec+=1; // si affichage des secondes, pas d'arrondissement des minutes donc pas d'augmentation d'1 degré si minutes réelles <60
        minutes=0;
    }
     //utile si secondes=60
    if (secondes >=60){
        minutes+=1;
        secondes=0;
    }
    var min=ajoutZero(String(minutes));
    if ((minutes-minutesLow)>1) minutesLow+=1; //sinon passage de x'59 à x+1'00 par x'00 !...
    var minReel=ajoutZero(String(minutesLow));
    var sec=ajoutZero(String(secondes));
    var y=Math.floor(z/30)+inc; //inc=1 si passage à 0deg pour incrémenter le signe sinon le changement de signe est décalé
    if (y==12)y=0;//passage poissons à belier
    var signe=signes[y];
    return {
        degres: negatif+deg+String.fromCharCode(176)+min+"'",
        signe: y,
        secondes:negatif+degSec+String.fromCharCode(176)+minReel+"'"+sec+'"'
    };
}

function convDegresMinutestoDegresDecimal(lat,long){
    //latitude
    var x=Math.abs(lat);
    var y=Math.floor(x);
    latitude=y+((x-y)*10/6);
    if (lat<0) latitude=-latitude;
    //longitude
    x=Math.abs(long);
    y=Math.floor(x);
    longitude=y+((x-y)*10/6);
    if (long<0) longitude=-longitude;
    
    return [latitude,longitude];
}

// conversion d'un entier en nombre romain
//source : https://www.developpez.net/forums/d1276262/webmasters-developpement-web/general-conception-web/contribuez/conversion-chiffres-arabes-chiffres-romains-inversement/
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
 
	// pour chaque A[ i ], tant que x est supérieur ou égal on déduit A[ i ] de x.
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
 
 
//********************************** tableaux résumés ******************************************
function calcSigneChinois(){
    
    //signe chinois (1900=année du rat)
    var x=(anChinois-1900)%12;
    if (x<0) x+=12;
    abc=chine[x]; //traduction signe
    
    //éléments : année finissant en 0-1 métal, 2-3 eau, 4-5 bois, 6-7 feu, 8-9 terre
    var x=anChinois%10; //dernier chiffre de l'année
    var abc;
    for (var i=0;i<=8;i+=2){
        if (x==i || x==i+1) {
           abc+= " - " + chine[12+(i/2)]; //traduction élément
           break;
        }
    }
    return abc;
}

//a=0:individuelles, a=1:collectives, b=signe (0 à 11), c=planetes
function calcDominantes(a,b,c){   
    dominantes.binaire[2*a+b%2]+=1; //yang ou chaud,yin ou froid inviduelles (a=0),collectives (a=1)
    dominantes.ternaire[3*a+b%3]+=1; //cardinal,fixe,mutable
    dominantes.quaternaire[4*a+b%4]+=1; //feu,terre,air,eau
    dominantes.qualite[2*a+Math.trunc((b%4)/2)]+=1; //sec, humide (math.trunc=partie entière)
    var x=b%4%3;
    if (x>1){x=1};
    dominantes.primarite[2*a+x]+=1;  //primaire,secondaire
    x=0;
    if (b>=3 && b<=8){x=1};
    dominantes.hemicyclesAB[2*a+x]+=1; //A,B
    x=1;
    if (b>=6){x=0};
    dominantes.hemicyclesCD[2*a+x]+=1; //C,D
}


//message au survol souris
function infobulle(cell,info,titre){
    var lieu = new Image(15,15);
    lieu.src = '../images/bulle.png';
    cell.appendChild(lieu);
    lieu.onmouseover=function(e){
        displayDivInfo(info,e.pageX,e.pageY,titre);
    }
    lieu.onmouseout=function(){
        displayDivInfo();
    }
}
function ajout_lignes(t){
    row=document.createElement('tr');
    row.align='left';
    row.style.font=fontTableau;
    t.appendChild(row);
    cell=document.createElement('td');
    row.appendChild(cell);
    cell.setAttribute('colspan', 3);
    return [cell,row];
}
function tableauxInit(x,texte){
    cadre2.appendChild(x);
   //en-tête
    var header=document.createElement('theader');
    x.appendChild(header);
    var row=document.createElement('tr');
    x.appendChild(row);
    var cell=document.createElement('th');
    cell.setAttribute('colspan', 6);
    cell.setAttribute('class', 'thead');
    cell.textContent = texte;
    row.appendChild(cell);    
}
function tableauResume(){
    //remise à 0 dominantes
    dominantes.binaire=[0,0,0,0];//laisser les 0 sinon calcDominantes donne des NaN à cause de +=
    dominantes.ternaire=[0,0,0,0,0,0];
    dominantes.quaternaire=[0,0,0,0,0,0,0,0];
    dominantes.qualite=[0,0,0,0];
    dominantes.primarite=[0,0,0,0];
    dominantes.hemicyclesAB=[0,0,0,0];
    dominantes.hemicyclesCD=[0,0,0,0];
    signes_indiv=[0,0,0,0,0,0,0,0,0,0,0,0]; //signes individuels du thème
    
    //création tableau
    if (tabResume){garbage=cadre2.removeChild(tabResume);}
    tabResume=document.createElement('table'); 
    var abc=titreTheme.split(labelsDroite[9])[0]; //supprime affichage lieu de naissance et suite
    tableauxInit(tabResume,abc.split("(utc")[0]); //supprime utc et suite si pas de lieu de naissance
    var row,cell;
    var digne=[0,0,0,0,0]; //affiche (1) ou pas (0) les dignités ou la maison interceptée (digne[4]) 
    
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
                       var abc=convPositiontoDegres(positionPlanete[i]);
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
                                        digne[x]=1;
                                   }
                                   //simple dignité
                                   else {
                                       cell.style.color=c[x];
                                       digne[x]=1;
                                   }
                                  break;
                               }
                           }
                      } 
                    }
                    break;
                case 1:
                    if (retrograde[i]){
                        cell.style.font = fontTableau;
                        cell.textContent="R";
                    }
                    break;
                case 2:
                    //maisons habitées (100=non défini)
                    if (planeteHabite[i]<100){
                        cell.style.font=fontTableau;
                        cell.textContent=AtoR(planeteHabite[i]+1);
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
                        row2.style.font=fontTableau;
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
                                    digne[4]=1;
                                }
                            cell2.textContent=String(car+1);
                        }
                    }
                    break;
                case 4:
                     //degrés
                    if (positionPlanete[i]){ //NN Lilith en-dehors plage 1800-2039
                        var signeDegres=convPositiontoDegres(positionPlanete[i]);
                        cell.style.font=fontTableau;
                        cell.textContent=signeDegres.degres;
                    }
                    break;
                case 5:
                     //signes + dominantes
                    if (positionPlanete[i]){ //NN Lilith en-dehors plage 1800-2039
                        cell.style.font="16px Zodiac";
                        cell.textContent=String.fromCharCode(97+signeDegres.signe);
                        if (i<=6){
                            calcDominantes(0,signeDegres.signe,i);//individuelles
                            signes_indiv[signeDegres.signe]+=1; //signe du thème, à mettre en rouge dans infobulle
                        }else if (i>=7 && i<=9){
                            calcDominantes(1,signeDegres.signe,i);//collectives
                        }
                    }
             }        
        }
    }
    //ajout ASC,MC aux dominantes personnelles et FC, DS aux collectives
    var a=[0,9,3,6],
        b=[0,0,1,1],
        abc;
    for (i=0;i<=3;i++){
        abc=convPositiontoDegres(positionMaison[a[i]]);
        calcDominantes(b[i],abc.signe);
        if (i<2){signes_indiv[abc.signe]+=1}; //signe du thème, à mettre en rouge dans infobulle
    }
    //ajout 1 ligne pour infobulles (Retrograde,Maisons habitées,Maisons gouvernées)
    var bulle=["Retrograde",labelsCentre[10],labelsCentre[11]];
    row=document.createElement('tr');
    tabResume.appendChild(row); 
    cell=document.createElement('td');
    row.appendChild(cell);
    for (i=0;i<=2;i++){
        cell=document.createElement('td');
        row.appendChild(cell);
        infobulle(cell,bulle[i]);
    }
    
    //légende bas du tableau
    var l=browser.i18n.getMessage("dignites").split(",");
    var c=["green","fuchsia","red","orange","blue"];
        //maitrise
        [cell,row]=ajout_lignes(tabResume);
        if (digne[0]==1){
            cell.style.color=c[0];
            cell.textContent=l[0];
        }
        //maison interceptée
        if (digne[4]==1){
            cell=document.createElement('td');
            row.appendChild(cell);
            cell.setAttribute('colspan', 3);
            cell.setAttribute('class','tabcell');
            cell.style.color=c[1];
            cell.textContent=l[1];
        }
        //exil,chute,exaltation
        for (i=2;i<=4;i+=1){
            if (digne[i-1]==1){
                [cell,row]=ajout_lignes(tabResume);
                cell.style.color=c[i];
                cell.textContent=l[i];
            }
        }
        
    //signe chinois
    abc=chine[17];
    abc+= calcSigneChinois();
    tableauxInit(tabResume,abc);
}

//max en gras (2ème et 3ème cellules du tableau des dominantes)
function max_en_gras(tab,col,array){
    var max=Math.max(...array),
        pos=[];
    pos[0]=array.indexOf(max); 
    tab.rows[col[pos[0]]].cells[1].style.fontWeight="bold";
    tab.rows[col[pos[0]]].cells[2].style.fontWeight="bold";
    //cherche si plusieurs max
    var ind=1;
    if (pos<array.length-1){
        for (var i=pos[0]+1;i<array.length;i++){
            if (array[i]==max){
                pos[ind]=i;
                ind+=1;
                tab.rows[col[i]].cells[1].style.fontWeight="bold";
                tab.rows[col[i]].cells[2].style.fontWeight="bold"; 
            }
        }
    }
    return pos;
}
//tableau des dominantes
function tableauDominantes(){
    tableauResume();
    //création tableau
    if (tabDominantes){garbage=cadre2.removeChild(tabDominantes);}
    tabDominantes=document.createElement('table'); 
    tableauxInit(tabDominantes,labelsDominantes[23] +" - type ");
    var row,cell,bulle;
    //lignes
    for (var i=0; i<=14; i++){
        row=document.createElement('tr');
        tabDominantes.appendChild(row); 
        bulle="";
        //colonnes
        for (var j=0; j<=3; j++){
            cell=document.createElement('td');
            row.appendChild(cell);
            cell.style.font='16px serif';
                    //infobulles
                    if (j==0){
                        for (var k=0;k<bulles[i].length;k++){
                            bulle+="_"+signes[bulles[i][k]];
                            if (signes_indiv[bulles[i][k]]>=1){bulle+=" ("+signes_indiv[bulles[i][k]]+")"};
                        }
                        infobulle(cell,bulle,labelsDominantes[i]);
                    };
                    //nom des dominantes
                    if (j==1){
                        cell.textContent=labelsDominantes[i];
                    };
                    if (i>=2 && i<=4 || i>=9 && i<=10 || i>=13){
                        cell.style.backgroundColor="rgb(235,235,235)"; //gris
                    };
        }
    } 
    
//écriture dominantes personnelles et collectives
    var max,
        pos,
        sec_humide,
        qualite,
        couple;
        
    //yang/yin = chaud/froid
    var a=[1,2,1,2]; //lignes
    var b=[2,2,3,3]; //colonnes
    var c=[0,0,0,0]; //pour recherche max
    for (i=0;i<=3;i++){
        tabDominantes.rows[a[i]].cells[b[i]].textContent=dominantes.binaire[i];
        if (i<=1){c[i]=dominantes.binaire[i]};
    };
        var pos=max_en_gras(tabDominantes,a,c);
        var chaud_froid=pos[0]; //chaud=0, froid=1
    //cardinal,fixe,mutable    
    var x=[0,0];
    a=[3,4,5,3,4,5];
    b=[2,2,2,3,3,3];
    c=[];
    for (i=0;i<=5;i++){
        tabDominantes.rows[a[i]].cells[b[i]].textContent=dominantes.ternaire[i];
        if (i<=2){c[i]=dominantes.ternaire[i]};
    };
        x[0]=max_en_gras(tabDominantes,a,c);
    //feu,terre,air,eau    
    a=[6,7,8,9,6,7,8,9];
    b=[2,2,2,2,3,3,3,3];
    c=[];
    for (i=0;i<=7;i++){
        tabDominantes.rows[a[i]].cells[b[i]].textContent=dominantes.quaternaire[i];
        if (i<=3){c[i]=dominantes.quaternaire[i]};
    };
        x[1]=max_en_gras(tabDominantes,a,c);
        //si plusieurs éléments max (feu,terre,air,eau), détermination avec chaud_froid(=yang/yin) et sec_humide (=qualite)
        if (x[1].length>1) {
            for (i=0;i<=1;i++){
                c[i]=dominantes.qualite[i];
            };
            max=Math.max(...c);
            pos=c.indexOf(max);
            sec_humide=pos; //sec=0, humide=1
            qualite=[chaud_froid,sec_humide];
            //couple=[chaud_froid,air_humide] 0-0=feu, 1-0=terre, 0-1=air, 1-1=eau
            couple=[[0,0],[1,0],[0,1],[1,1]]; 
            for (i=0;i<=3;i++){
                if (couple[i][0]==chaud_froid && couple[i][1]==sec_humide){
                    x[1]=i;
                    qualite=[chaud_froid,sec_humide];
                }
            }
        }else{
            x[1]=x[1][0];
            qualite=[];
        }
    //primaire,secondaire    
    a=[10,11,10,11];
    b=[2,2,3,3];
    c=[];
    for (i=0;i<=3;i++){
        tabDominantes.rows[a[i]].cells[b[i]].textContent=dominantes.primarite[i];
        if (i<=1){c[i]=dominantes.primarite[i]};
            
    };
        pos=max_en_gras(tabDominantes,a,c);
    //hémicyles A,B    
    a=[12,13,12,13];
    b=[2,2,3,3];
    c=[];
    for (i=0;i<=3;i++){
        tabDominantes.rows[a[i]].cells[b[i]].textContent=dominantes.hemicyclesAB[i];
        if (i<=1){c[i]=dominantes.hemicyclesAB[i]};
    };
        pos=max_en_gras(tabDominantes,a,c);
    //hémicyles C,D    
    a=[14,15,14,15];
    b=[2,2,3,3];
    c=[];
    for (i=0;i<=3;i++){
        tabDominantes.rows[a[i]].cells[b[i]].textContent=dominantes.hemicyclesCD[i];
        if (i<=1){c[i]=dominantes.hemicyclesCD[i]};    
    };
        pos=max_en_gras(tabDominantes,a,c);
        
//recherche et affichage du signe "type" dans l'en-tête du tableau
    //couple=[ternaire,quaternaire] de Bélier à Poissons, ex [0,0]=[cardinal,feu]=Bélier ou [1,3]=[fixe,eau]=Scorpion
    couple=[[0,0],[1,1],[2,2],[0,3],[1,0],[2,1],[0,2],[1,3],[2,0],[0,1],[1,2],[2,3]]; 
    bulle="";
    for (j=0;j<x[0].length;j++){
        for (i=0;i<=11;i++){
            if (couple[i][0]==x[0][j] && couple[i][1]==x[1]){
                cell=tabDominantes.rows[0].cells[0];
                cell.textContent+="\n" + signes[i] + "  "; //\n=LF ne marche pas dans une cellule de tableau
                //info bulle
                bulle+= labelsDominantes[2+x[0][j]]+" & "+labelsDominantes[5+x[1]]+ ", " //"\n";
                if (qualite.length>0 && j==x[0].length-1){
                    bulle+=" ["+labelsDominantes[15+qualite[0]]+"/"+labelsDominantes[17+qualite[1]]+"]";
                };
                break;
            };
        };
    };
        bulle=terminaison(bulle,", "); //supprime la virgule de fin
        infobulle(cell,bulle);
        
//ajout 1 ligne pour infobulles
    bulle=[labelsCentre[13],labelsCentre[14]];
    row=document.createElement('tr');
    tabDominantes.appendChild(row); 
    for (i=0;i<=3;i++){
        cell=document.createElement('td');
        row.appendChild(cell);
        if (i>=2){infobulle(cell,bulle[i-2])};
    }
}

//****************************************** tracé zodiaque ******************************************************
//ajustement canvas en position et taille
//source : http://jsfiddle.net/9Rmwt/11/show/ 
function setCanvas(canevas){       
        var canvasNode =canevas;
        var pw = canvasNode.parentNode.clientWidth;
        //=0 !  var ph = canvasNode.parentNode.clientHeight;
        canvasNode.height = pw*0.9;
        canvasNode.width = pw*1;
        canvasNode.style.top = 0 + "px";
        canvasNode.style.left = (pw-canvasNode.width)/2 + "px";
}

function creeCanvas(id,canevas){
    var nested = document.getElementById(id);
    if (nested) {garbage = canvasTarget.removeChild(nested);}
    canevas = document.createElement('canvas');
    canevas.setAttribute("Id",id);
    canvasTarget.appendChild(canevas);
    setCanvas(canevas);
    var ctx= canevas.getContext("2d");
    return [canevas,ctx];
}

//tracé secteurs signes du zodiaque
function secteursSignes(){
    var x;
    for (var i=0;i<=3;i++){
        if (choix3.item(i).checked){
         //conditional operator, syntaxe : condition ? vrai : faux
            i==0 ? x=12 : x=i+1;
            break;
        }
    }
    couleurSecteurs(x);
    //légende
    var y=[[0,1],[2,4],[5,8]];
    x-=2;
    if (x<10)choix3Legende(y[x][0],y[x][1]);
}

function dessins() {
    //taille symboles images
var offset,
    ctx;
    AS=Math.PI/180*(asc-180);
    
    //l'affichage du theme (non progressé) se fait toujours avec positionNatal
    if (okProgresse==0){
        for (var i=0;i<=14;i++){
            positionPlanete[i]=positionNatal[i];
        }
    }
    
    //création canvas
    [canvas1,ctx1]=creeCanvas("canvas1",canvas1);
    [canvas2,ctx2]=creeCanvas("canvas2",canvas2);
    [canvas3,ctx3]=creeCanvas("canvas3",canvas3);
    [canvas4,ctx4]=creeCanvas("canvas4",canvas4);
    [canvas5,ctx5]=creeCanvas("canvas5",canvas5);
    [canvasGlobalAspects,ctx]=creeCanvas("canvasGlobalAspects",canvasGlobalAspects);
    [canvasPartielAspects,ctx]=creeCanvas("canvasPartielAspects",canvasPartielAspects);
    [canvasLive,ctx]=creeCanvas("canvasLive",canvasLive);
        
    titreCanvas.textContent=titreTheme //laisser après la création des canvas sinon non affiché
    //dimensions et positionnement    
    centre=[canvas1.width/2.3,canvas1.height/2.6];
    rayon=0.22*canvas1.width;   
    
    //tracé axe X
    ctx2.beginPath();
    ctx2.moveTo(centre[0]-rayon, centre[1]);
    ctx2.lineTo(centre[0]+rayon, centre[1]);
    ctx2.stroke()
    //annotations AS-DS
    ctx2.font = '16px serif';
    ctx2.fillText(convPositiontoDegres(asc).degres+" AS", centre[0]-rayon-90, centre[1]+8);
    ctx2.fillText("DS", centre[0]+rayon+10, centre[1]+8);
    //tableaux résumés
    if (okTransits==0) tableauDominantes(); //appelle tableauResume()
    choix3.item(0).checked ? tabDominantes.hidden=true : tabResume.hidden=true;
    //secteurs signes (couleurs en fonction de choix3:normal,binaire,etc.)
    secteursSignes();  

    for (var i=0; i < 12 ; i++){
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
             ctx2.fillText(convPositiontoDegres(positionMaison[9]).degres, lMC-10, hMC-20);
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
        [lInt[i],hInt[i]]=[lPlanete[i],hPlanete[i]]=calcXYPlanete(i,positionPlanete,AS,canvas3);
                    
        //écriture des symboles signes et planètes avec fonts Zodiac (signes en ctx4 pour éviter effacement dans canvasPartielAspects)
        ctx3.font=taille+"px Zodiac";
        ctx4.font=taille-2+"px Zodiac";
        ctx3.fillStyle=ctx4.fillStyle="rgb(100,100,100)";
        ctx4.fillText(signesFonts[i], lSigne[i]-taille/2, hSigne[i]+taille/2);
        ctx3.fillText(planetesFonts[i], lPlanete[i]-taille/2, hPlanete[i]+taille/2);
        //rétrograde ?
        if (testRetrograde(i)==1){
            let lR=taille/3;
            ctx3.fillText(String.fromCharCode(64),lPlanete[i]+lR,hPlanete[i]);
        }
  }
  
    //ajout NS (+ AS et MC si AsMc coché);
    ctx3.font=taille+"px Zodiac";
    for (i=12;i<=14;i++){
        [lInt[i],hInt[i]]=[lPlanete[i],hPlanete[i]]=calcXYPlanete(i,positionPlanete,AS,canvas3);
        if ((i==13 || i==14) && checkAsMc.checked==false) continue; //laisser après calcul positions planetes (pour partialaspects)
        ctx3.fillText(planetesFonts[i], lPlanete[i]-taille/2, hPlanete[i]+taille/2);
    }

    if (checkMaisons.checked==false){
        canvas2.hidden=true;
    }  
    //choix sortie
    if (okProgresse==0 && okTransits==1){
        affiLive(AS); //laisser avant globalAspects sinon aspects live-theme non tracés
        globalAspects(positionLive);
    }else{
        globalAspects(positionPlanete);
    }
  
            //v.1.3.0 : suppression zoom
            //sauvegarde images canvas pour zoom
           /* image1.src=canvas1.toDataURL("image/png");
            image2.src=canvas2.toDataURL("image/png");
            trackTransforms(ctx1,ctx2);*/
}

function testRetrograde(i){
    var x=0;
    if (okProgresse==0 && okTransits==0 && retrogradeNatal[i]) x=1;
    else if (okProgresse==1 && retrograde[i]) x=1;
    else if (okTransits==1 && fixePhases==0 && retrogradeNatal[i]) x=1;
    else if (okTransits==1 && fixePhases==1 && ecartLive[i]<0) x=1;
    return x;
}

function calcXYPlanete(i,position,ascendant,canevas,ext){
    if (!ext)ext=1; //ext=1 intérieur, ext=-1.15 exterieur
    var offset=taille/ext; //position par défaut des symboles planetes
    
            //ancienne méthode pour éviter les superpositions
            /*  for (var j=0;j<i;j++){
                if (Math.abs(position[j]-position[i])<8 || Math.abs(position[j]-position[i])>352) offset+=taille/ext;
            }*/
            
    var x,y,sortie,myImageData,data,total;
    var ctx= canevas.getContext("2d");
    do {
        sortie=1;
        x=centre[0]+Math.cos(Math.PI/180*position[i]-ascendant)*(rayon*Math.abs(ext)-offset);
        y=centre[1]-Math.sin(Math.PI/180*position[i]-ascendant)*(rayon*Math.abs(ext)-offset);
        //récupère l'image de l'emplacement : 4 octets par pixel (rgba)
        myImageData = ctx.getImageData(x-taille/3, y-taille/3, taille*2/3, taille*2/3);
        data=myImageData.data;
        
        //vérifie si emplacement déjà occupé
        switch(canevas){
            case canvas3:
            case canvasLive:
                //1 seul pixel présent ? = offset
                for (var j=0;j<data.length;j++){
                    if (data[j]>0) {
                        offset+=taille/ext;
                        sortie=0;
                        break;
                    }
                }
            break;
            case canvasPartielAspects:
                // a>0  et r=g=b=0 ? = 1 pixel en noir = 1 planète déjà présente
                for (j=0;j<data.length;j+=4){
                    if (data[j+3]>0){
                        if (data[j]==0 && data[j+1]==0 && data[j+2]==0){
                            offset+=taille/ext;
                            sortie=0;
                            break;
                        }
                    }
                }
            break;
        }
    } while (sortie==0);
    return [x,y];
}

 //affiche planetes du jour à l'extérieur du thème et enregistre les transits en conjonction (orange ou rouge) pour affichage avec "souris.js"
function affiLive(ascendant){
    var posX,posY,gap,orbe;
    var ctx;
    [canvasLive,ctx]=creeCanvas("canvasLive",canvasLive);
    //planetes du jour
    for (var i=0;i<=11;i++){
        ctx.font="16px Zodiac";
        ctx.fillStyle="green"; //"#008000"
        //recherche transits par conjonction sur planetes du theme
        for (var j=0;j<=14;j++){ //13,14=AS,MC
            if (j==12) continue; // NS
            if ((j==13 || j==14) && checkAsMc.checked==false) continue; //AS-MC
            gap=Math.abs(positionNatal[j]-positionLive[i]);
            if (gap<=1){
                orbe=convPositiontoDegres(Math.abs(gap)).degres
                if (ctx.fillStyle=="#008000") ctx.fillStyle="orange";
                if (gap<=1/360) ctx.fillStyle="red";
            }
        }
        //affiche planete
        [lExt[i],hExt[i]]=[posX,posY]=calcXYPlanete(i,positionLive,ascendant,canvasLive,-1.15); //(-1.15=offset s'éloigne du cercle)
        ctx.fillText(planetesFonts[i], posX-taille/2, posY+taille/2);
        //retrograde ?
        if (ecartLive[i]<0) ctx.fillText(String.fromCharCode(64),posX+taille/3,posY);
        //sauvegarde ?
        if (ascendant==AS){
            lLive[i]=posX;
            hLive[i]=posY;
        }
    }
}


//********************************************** aspects *****************************************************

function globalAspects(position){
    //aspect=["conjonction","semi-sextile","semi-carré","sextile","carré","trigone","sesqui-carré","quinconce","opposition","quinconce","sesqui-carré","trigone","carré","sextile","semi-carré","semi-sextile","conjonction"],
   var  tolerance,
        gap,
        gapArc,
        decroissant,
        debut,
        positionRef=[],
        lTemp,
        hTemp,
        ext,
        [angle,couleur,arc]=definitions(); //voir transits.js
        
    var ctx;
    [canvasGlobalAspects,ctx]=creeCanvas("canvasGlobalAspects",canvasGlobalAspects);
    canvas5.hidden=true; //sinon planetes mondiales en gras quand on change la date, suite introduction fixePhases...
    
    //orbesDef=orbes stockés
    var orbe=[15,2,2,4,8,8,2,0.5,10,0.5,2,8,8,4,2,2,15];
    if (orbesDef.length==9){
        for (var i=0;i<=16;i++){
            if (i<=8 && orbesDef[i]) orbe[i]=orbesDef[i];
            else if (i>8) orbe[i]=orbe[i-2*(i-8)];//aspects descendants
         }
    }
    //initialisation matrices des aspects (theme et transits) (laisser avant boucle du dessous)
    var x=[listAspects,listAspectsTransits];
    for (var j=0;j<=1;j++){
        for (var i=0; i<=14; i++){ //12,13,14 pour NS,AS,MC
            //"x" permet ensuite de faire aspec...+=
            x[j].planete[i]="x";
            x[j].aspect[i]="x";
            x[j].couleur[i]="x";
            x[j].orbe[i]="x";
        }
    }
        
    //définition planete agent + tolerance si transits  
    if (okTransits==0){
        positionRef=positionPlanete;
        ext=1; //1 = intérieur
    }else if (okTransits==1){
        positionRef=positionNatal;
        ext=-1.15; //-1.15 = exterieur
        tolerance=1;
        if (fixePhases==1){
            tolerance=1;
        }
    }

    //planete sujet (toujours du thème affiché)
    for (i=0; i<=14; i++){ 
        if (i==12) continue; //NS
        if (isNaN(positionRef[i])){continue}; //si NN, Lilith en-dehors plage 1800-2039
        if (okProgresse==1){tolerance=coeffOrbe.value*Math.abs(ecartJour[i])}
        debut=i+1;
        if (okProgresse==0 && okTransits==1)debut=0;
        
        //planete agent (du thème ou en transit)
        for (var j=debut; j<=14; j++){
            if (j==12) continue; //NS
            if (isNaN(position[j]) || isNaN(positionRef[j])){continue};
            gap=positionRef[i]-position[j];
            decroissant=0;
            if ((gap>0 && gap <60) || (gap<0 && gap <-300)) decroissant=1;
            if (gap<0) gap+=360;
            
            gapArc=Math.floor(gap/15);
            //aspects
            for (var k=arc[gapArc][0]; k<=arc[gapArc][1]; k++){
                 //Lilith : conjonctions
                if ((j==11) && (k>0 && k<16)) continue; 
                //NN et axes : conjonction, carré, opposition
                if ((i==10 || j==10 || i==13 || i==14 || j==13 || j==14) && (k==1 || k==2 || k==3 || k==5 || k==6 || k==7 || k==9 || k==10 || k==11 || k==13 || k==14 || k==15)) continue;

                //tolérance natal
                if (okProgresse==0 && okTransits==0){
                    //Lilith et NN, tolerance conjonction=8 deg.
                    if (i==10 || i==11 || j==10 || j==11 && (k==0 || k==16)) tolerance=8;
                    else tolerance=orbe[k];
                } 
                
                //aspect trouvé
                if (gap<(angle[k]+tolerance) && gap>(angle[k]-tolerance)){
                    //tracé des aspects dans canvasGlobalAspects
                        //origine
                        ctx.beginPath();
                        [lTemp,hTemp]=[lInt[i],hInt[i]]; 
                        //vers intérieur
                        ctx.moveTo(lTemp,hTemp);
                        [lTemp,hTemp]=[lInt[j],hInt[j]];
                        //vers extérieur ext=-1.15 
                        if (ext<=0) [lTemp,hTemp]=[lExt[j],hExt[j]];
                        ctx.lineTo(lTemp,hTemp);
                        ctx.strokeStyle = couleur[k];
                    //conjonctions rouges ?
                    if (okTransits==0){
                        if ((k==0 || k==16) && i <=6 && j>=4){
                            //mars-pluton phase 12 ou lilith phases 1 et 12
                            if ((decroissant && j<=9) || j==11) ctx.strokeStyle = "red";
                        }
                    }
                    //tracé aspect sauf AS-MC si non coché
                    if ((i<=11 && j<=11) || ((i==13 || i==14 || j==13 || j==14) && checkAsMc.checked==true)){
                        ctx.stroke();
                    }

                    
                    //tracé mondial dans canvas5 (mars-pluton)
                    if (i>=4 && i<=9 && j>=4 && j<=9 && okTransits==0){
                        ctx5.font="20px Zodiac";
                        ctx5.beginPath();
                        //aspects
                        ctx5.moveTo(lPlanete[i], hPlanete[i]);
                        ctx5.lineTo(lPlanete[j], hPlanete[j]);
                        ctx5.strokeStyle = couleur[k];
                        ctx5.stroke();
                        //planetes mondiales
                        [posX,posY]=[lPlanete[i], hPlanete[i]]; //calcXYPlanete(i,positionPlanete,AS,canvas5);
                        ctx5.fillText(planetesFonts[i], posX-taille/2, posY+taille/2);
                            //retrograde ?
                            if (ecartJour[i]<0) ctx5.fillText(String.fromCharCode(64),posX+taille/3,posY);
                        [posX,posY]=[lPlanete[j], hPlanete[j]]; //calcXYPlanete(j,positionPlanete,AS,canvas5);
                        ctx5.fillText(planetesFonts[j], posX-taille/2, posY+taille/2);
                            //retrograde ?
                            if (ecartJour[j]<0) ctx5.fillText(String.fromCharCode(64),posX+taille/3,posY);
                    }
                    //sauvegarde aspects/planète sujet(i)                      
                    listAspects.planete[i]+=","+j;
                    listAspects.aspect[i]+=","+k;
                 //   listAspects.orbe[i]+=","+(gap-angle[k]);
                    listAspects.orbe[i]+=","+(angle[k]-gap);
                    listAspects.couleur[i]+=","+ctx.strokeStyle;
                    //sauvegarde aspects/planète agent(j), pour theme et transits séparément 
                    var x=[listAspects,listAspectsTransits];
                        for (var l=0;l<=1;l++){
                            if ((okTransits==0 && l==0) || (okTransits==1 && l==1)){
                                x[l].planete[j]+=","+i;
                                x[l].aspect[j]+=","+k;
                                x[l].orbe[j]+=","+(gap-angle[k]);
                                x[l].couleur[j]+=","+ctx.strokeStyle;
                            }
                        }
                break;
                }
            }
        }
     }
     
    //affichage liste des transits à droite du theme
    if (okTransits==1 && fixePhases==0){
        var message="",
            planetes,
            aspect,
            aspects,
            orbes,
            inc,
            y=70;
            
        ctx1.clearRect(centre[0]+rayon,0,400,1600);
        ctx1.fillStyle="blue";
        ctx1.font= '14px serif';
        //si nomTheme2 : synastrie
        nomTheme2 ? message=labelsDroite[30]  + " " + nomTheme2 : message=placeDef;
        ctx1.fillText(message,centre[0]+(1*rayon), y-50);
        nomTheme2 ? message="Aspects" : message="Transits";
        message+=" < 1"+String.fromCharCode(176)+"  "+ dateMoyenne(dateMaisons)+" "+choixHeure.value;
        ctx1.fillText(message,centre[0]+(1*rayon), y-30);
        //planetes en transit
        for (j=0;j<=11;j++){
            //planetes du theme
            for (i=0;i<=14;i++){
                if (i==12) continue; //NS
                if ((i==13 || i==14) && checkAsMc.checked==false) continue; //AS-MC
                planetes=listAspects.planete[i].split(",");
                //recherche si planete en transit présente
                for (k=1;k<planetes.length;k++){
                    if (planetes[k]==j){
                        aspects=listAspects.aspect[i].split(","); 
                        orbes=listAspects.orbe[i].split(",");
                        ctx1.font="14px Zodiac"; 
                        //symboles aspects (de conjonction m(109) à opposition u(117))
                        x=Number(aspects[k]);
                            //aspects décroissants
                            if (x>8){
                                inc=2*(x-8);
                                x-=inc;
                            }
                        aspect=String.fromCharCode(109+x);
                        //affichage agent (transit)-aspect-sujet (theme)
                        message=planetesFonts[planetes[k]]  + " " + aspect + " " + planetesFonts[i];
                        ctx1.fillText(message,centre[0]+(1.4*rayon), y);
                        //affichage orbe en degrés-minutes-secondes
                        ctx1.font= '14px serif';
                        message=convPositiontoDegres(orbes[k]).secondes;
                        if (message.search("00'0")>0) ctx1.fillStyle="red";//en rouge si orbe <1'
                        ctx1.fillText(message,centre[0]+(1.4*rayon+80), y);
                        ctx1.fillStyle="blue";
                        //écart lignes
                        y+=25;
                        break;
                    }
                }
            } 
        }
    }
}

function survolAspects(ref,tt){ //ref=planete, tt=theme ou transit (v.souris.js)
    //sort si AS-MC non coché
    if ((ref==13 || ref==14) && checkAsMc.checked==false) return;
    
    var posX,
        posY;
        
    //initialisation canvas et lecture données
    var [ctx,liste,couleur,num]=initAspectsPhases(ref,tt);
    
    //tracé planetes agents + aspects
    ctx.font=taille+"px Zodiac";
    ctx.setLineDash([]);    
    for (i=1;i<num;i++){
        ctx.beginPath();
        //position 2ème point aspect
        x=Number(liste[i]); 
        //élimine AS-MC si non coché
        if ((x==13 || x==14) && checkAsMc.checked==false) continue;
        //position 1er point aspect
        AStemp=AS;
        //inversion des planetes si interieur ou exterieur
        if (tt==0){
            posX=lPlanete[ref];
            posY=hPlanete[ref];
        }else if (tt==1){
            posX=lPlanete[x];
            posY=hPlanete[x];
        }
        //position planete sujet
        ctx.moveTo(posX, posY);
        //tracé aspect (sauf exceptions)
        posX=lPlanete[x];
        posY=hPlanete[x];
        if (okTransits==1){
            //inversion des planetes si interieur ou exterieur
            if (tt==0){
                posX=lLive[x];
                posY=hLive[x];
            }else if (tt==1){
                posX=lLive[ref];
                posY=hLive[ref];
            }
        }
        //affichage planete agent
        if (okTransits==0) ctx.fillText(planetesFonts[x], posX-taille/2, posY+taille/2);
        //tracé aspect
        ctx.lineTo(posX, posY);
        ctx.strokeStyle=couleur[i];
        ctx.stroke();
    } 
    
    //affiche toutes les planetes
    for (i=0;i<=14;i++){
        //élimine AS-MC si non coché
        if ((i==13 || i==14) && checkAsMc.checked==false) continue;
        //positions planetes
        posX=lPlanete[i];
        posY=hPlanete[i];
        ctx.fillText(planetesFonts[i], posX-taille/2, posY+taille/2);
        //rétrograde ?
        if (testRetrograde(i)==1){
            let lR=taille/3;
            ctx.fillText(String.fromCharCode(64),posX+lR,posY);
        }
    }
}

function initAspectsPhases(ref,tt){
    var ctx;
    //masquage de canvas
    canvas3.hidden=true; // symboles planetes
    canvas5.hidden=true; //aspects mondial
    canvasGlobalAspects.hidden=true; // aspects
    //création canvas
    [canvasPartielAspects,ctx]=creeCanvas("canvasPartielAspects",canvasPartielAspects);
    canvasPartielAspects.hidden=false;
    //lecture données
    if(!tt) tt=0;
    var x=[listAspects,listAspectsTransits];
    var liste=x[tt].planete[ref].split(",");
    var couleur=x[tt].couleur[ref].split(","); 
    var num=liste.length;
    
    return [ctx,liste,couleur,num];
}

function affiPhases(ref){ //ref=planete
    var position=[positionPlanete,positionLive];
    var affiche;
    //masquage de canvas
    canvas1.hidden=true;//secteurs signes
    canvas2.hidden=true; //maisons
    canvas4.hidden=true; //symboles signes
    canvasLive.hidden=true; //planetes externes
    
     //initialisation canvas et lecture données
    var [ctx,liste,couleur,num]=initAspectsPhases(ref,0);
    
    //cercle externe pour les phases
    ctx.setLineDash([1, 10]); //pointillés
    var startAngle=Math.PI/2,
        endAngle=5*Math.PI/2,
        ecart30=Math.PI/180*30,
        k=0,
        car=0,
        aspect,
        posX,
        posY,
        inc=1;
        
    //tracé cercle avec symboles aspects et numéros de phases
        //très important ! r,g,b sont >0 pour être distingués des pixels noirs des planètes (=0) (v. calcXYPlanete)
        ctx.strokeStyle = 'rgba(50, 50, 50,1)'; 
        ctx.lineWidth = 1.2; //meilleure détection des chevauchements de planètes ?
        
    for (var i=startAngle;i<=endAngle;i+=ecart30){
        ctx.beginPath();
        ctx.arc(centre[0], centre[1], rayon+10, i, i+ecart30,false);
        ctx.lineTo(centre[0], centre[1]);
        ctx.stroke();
        //écriture symboles aspects (de conjonction m(109) à opposition u(117))
        var x=[1];
        if (car==1 || car==4 || car==7 || car==10) x=[1/2,1]; //interphases
        for (var j=0;j<x.length;j++){
            posX=centre[0]+Math.cos(i+ecart30*x[j])*(rayon+10);
            posY=centre[1]+Math.sin(i+ecart30*x[j])*(rayon+10);         
            aspect=String.fromCharCode(109+(k+inc)%16);
            ctx.font=taille+"px Zodiac"; 
            ctx.fillText(aspect, posX-8, posY+8);
            //interphases
            if (x[j]==1/2){
                ctx.beginPath();
                ctx.moveTo(posX,posY);
                ctx.lineTo(centre[0], centre[1]);
                ctx.stroke();
            }
            //numéros des phases
            if (x[j]==1){
                posX=centre[0]+Math.cos(i+ecart30*x[j])*(rayon+30);
                posY=centre[1]+Math.sin(i+ecart30*x[j])*(rayon+30);
                ctx.font="14px Zodiac"; 
                ctx.fillText(String(12-car), posX-8, posY+8);
            }
            k=k+inc;
            if (k==8) inc=-1;
            if (k==0) inc=1;
        }
        car+=1;
    }
    
    //sortie si mondial
    if (ref==12) {
        //signe capricorne en phase 1, uniquement si "maisons" est décoché
        if (checkMaisons.checked==false) ctx.fillText(signesFonts[9], posX+50, posY+10);
        message=labelsDroite[27]+" "+dateMoyenne(dateMaisons);
        ctx.font= '14px serif';
        ctx.fillText(message, centre[0]-3.3*message.length, centre[1]-10);
        canvas5.hidden=false;
        return;
    }
    
    //affiche planète sujet au centre
    ctx.font="22px Zodiac"; 
    ctx.fillText(planetesFonts[ref], centre[0]-11, centre[1]+11);
    //ajoute 2 messages et calcule position de l'ascendant AStemp
    if (!isNaN(positionPlanete[ref])){
        //thème
        if (okTransits==0){
            var abc=convPositiontoDegres(positionPlanete[ref]);
            var message=labelsCentre[2]; //theme;
            AStemp=Math.PI/180*(positionPlanete[ref]+90);
        //transit (ou synastrie)+date
        }else if (okTransits==1){
            var abc=convPositiontoDegres(positionNatal[ref]);
            var message="Transits "+dateMoyenne(dateMaisons);
            if (nomTheme2) message=labelsDroite[30] + " " + nomTheme2; //synastrie
            AStemp=Math.PI/180*(positionNatal[ref]+90);
        }
        var titre=abc.degres+" "+signesFonts[abc.signe]; 
        ctx.font="14px Zodiac"; 
        ctx.fillText(titre, centre[0]-30, centre[1]+30);
        ctx.font= '14px serif';
        ctx.fillText(message, centre[0]-3.3*message.length, centre[1]-30);
    }

    ctx.font=taille+"px Zodiac";
    ctx.setLineDash([]); 
    
    //affiche aspects + planetes
    for (i=0;i<=14;i++){
        affiche=0;
        //saute AS-MC si non coché
        if ((i==13 || i==14) && checkAsMc.checked==false) continue;
        //supprime agent si sujet=agent
        if (i==refPhase && okTransits==0) continue;
       
        if (fixePhases==1) affiche=1;
        //aspect ?
        for (j=1;j<num;j++){
            if (i==Number(liste[j])) {
                affiche=2;
                break;
            }
        }
        if (affiche==0) continue;
         //coordonnées planète
        [posX,posY]=calcXYPlanete(i,position[okTransits],AStemp,canvasPartielAspects);
        //tracé aspect si existe
        if (affiche==2) {
            ctx.beginPath();
            //1er point aspect
            ctx.moveTo(centre[0], centre[1]);
            //2ème point aspect
            ctx.lineTo(posX, posY);
            ctx.strokeStyle=couleur[j];
            ctx.stroke();
        }
        //affichage planete agent (toujours si "fixePhases" sinon seulement si aspect)
        ctx.fillText(planetesFonts[i], posX-taille/2, posY+taille/2);  
         //retrograde ?
        if (ecartJour[i]<0) ctx.fillText(String.fromCharCode(64),posX+taille/3,posY);
    } 
}


//********************************************** gestion date *****************************************************    
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
      //  var heure=String(Number(datetime.getUTCHours())+1);
        var heure=String(Number(datetime.getHours()));
        var minutes=String(datetime.getMinutes());
        //heure sur 2 chiffres
        heure=ajoutZero(heure);
        minutes=ajoutZero(minutes);
        choixHeure.value=heure+":"+minutes;
    }
    //contrôle format
    var reponse=controleDate(dateInterne);
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
    
  dateLong=dateLongue(dateMaisons);
  annee=dateInterne.slice(dateInterne.length-4);
  choixDate.value=dateBrowser;
  return reponse;
}  

//3 formats de date
function dateFormat(date,options){
    var date = new Date(date);
    var langue=browser.i18n.getUILanguage();
    var dateTime=new Intl.DateTimeFormat(langue, options).format(date); 
    return dateTime;    
}

//date au format long (jour de la semaine et mois en lettres)
function dateLongue(date){
    var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'};
    return dateFormat(date,options);
}

//date au format moyen (mois en lettres abrégées)
function dateMoyenne(date){
    var options = { year: 'numeric', month: 'short', day: 'numeric'};
    return dateFormat(date,options);
}

//date au format court (jj/mm/aaaa)
function dateCourte(date){
    var options = { year: 'numeric', month: 'numeric', day: 'numeric'};
    return dateFormat(date,options);
}

//**************************************fin date ***************************************

function requetes(date,heure,nom){
    if (controleDate(date)=="oui"){
        choixHeure.value=heure;
        incDateHeure();
        
        if (calcPositionsPlanetes(dateMaisons,choixHeure.value)=="oui"){
            if (okTransits==0 && (!nom || nom=="?")){
                titreTheme=labelsDroite[0]+ dateLong + " -  " + choixHeure.value;
                    if (!nom){
                        coordonnees=" "+placeDef + " (utc "+utcDef +", lat. "+latDef +", long. "+ longDef +")";
                    }
                titreTheme+=" "+coordonnees;
            }
            else if(nom==nomNatal){
                titreTheme=nomNatal +labelsDroite[8]+dateLong +" - " + choixHeure.value + labelsDroite[9] + coordonnees;
            }
             //sortie selon options "theme" ou "transits" 
            if (okTransits==0){
                calcPositionsMaisons(heure,dateMaisons);
                sauvePositionsMaisons("natal"); 
                for (var i=0;i<=14;i++){ //laisser après calcul maisons pour AS et MC (13 et14)
                    positionNatal[i]=positionPlanete[i];
                    retrogradeNatal[i]=retrograde[i];
                }
                dessins();
            }else if (okTransits==1){
                for (var i=0;i<=12;i++){
                    positionLive[i]=positionPlanete[i];
                    ecartLive[i]=ecartJour[i];
                }
                affiLive(AS);
                globalAspects(positionLive);
            }
        }
    }
}    

//****************************************** listeners ********************************************************

 checkMaintenant.addEventListener("change",() => {
    //charge les valeurs par défaut (ville,utc,etc.)
    var getting = browser.storage.local.get("zodiaque");
    getting.then((result) => {
        var objTest = Object.keys(result); 
        if (objTest.length){ //=1 (clef "zodiaque")
            if (result.zodiaque[0]) placeDef=result.zodiaque[0];
            if (result.zodiaque[1]) valUtc.value=utcDef=result.zodiaque[1];
            if (result.zodiaque[2]) valLatitude.value=latDef=result.zodiaque[2];
            if (result.zodiaque[3]) valLongitude.value=longDef=result.zodiaque[3];
            //luminosité
            if (result.zodiaque[4]) luxDef=result.zodiaque[4];
            if (demarrage==1 && luxDef) {
                lux=Number(luxDef);
                luminosite.value=luxDef; 
                demarrage=0;
            }
            //orbes
            orbesDef=[];
            for (var i=0;i<=8;i++){
                if (result.zodiaque[i+5]) orbesDef[i]=Number(result.zodiaque[i+5]);
            }
            //temporisation sinon ctx1 non créé dans secteurSignes (créé par dessins)
        /*    let timer = setTimeout(() => {
                secteursSignes();
            }, 100);*/
        }
     },onError);
    //temporisation pour laisser le temps de lire ville,utc,longitude,latitude par défaut 
    let timer = setTimeout(() => {
        maintenantSuite();
    }, 100);
},onError);
 
function maintenantSuite(){
    if (demarrage==0) canvasCache(false);   
    utcLocal=utc=Number(utcDef);
    //conversion deg.min en degres.decimales
    var x=Number(latDef); //48.51;
    var y=Number(longDef); //2.21;
    [latitude,longitude]= convDegresMinutestoDegresDecimal(x,y);
    latLocal=latitude;
    longLocal=longitude;
    //divers
    nomTheme2="";
    okTransits=0;
    fixePhases=0;
    margeNoir();
    resetChoix(true);
    choix4.item(0).disabled=false;
    choix4.item(0).checked=true;
    choix4.item(1).disabled=false;
    anneeTransit.disabled=true;
    checkMaisonsNatales.disabled=true;
    okProgresse=0;
    okTransits=0;
    labelProg.hidden=true;
    tableau.hidden=true;
    margeDiv.hidden=false;
    dateJour();
    if (utc && latitude && longitude) requetes(dateInterne,choixHeure.value);
    else console.log("placedef,utcdef,latdef,longdef : "+placeDef+", "+utcDef+", "+latDef+", "+longDef);
    canvasCache(false);//laisser après requetes
    //sauvegarde positions planetes du jour
    for (var i=0;i<=11;i++){
        positionLive[i]=positionPlanete[i];
        ecartLive[i]=ecartJour[i];
    } 
    if (dateBrowser.search("/")>0) cacheTransits(); //ancien firefox
    checkMaintenant.checked=true;
}
 
 
//**************************** date et heure *************************************

/* exemple d'incrémentation : 
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);*/
function incDateHeure(){
    var abc=choixDate.value.split("-");
    //empêche jour vide ("") quand on arrive à 1 avec le calendrier principal, dans certains cas
    if (abc[2]) incJour.value=abc[2];
    if (abc[1]) incMois.value=abc[1];
    if (abc[0]) incAn.value=abc[0];
    
    abc=choixHeure.value.split(":");
    if (abc[0]) incHeure.value=abc[0]; //heures
    if (abc[1]) incMinute.value=abc[1]; //minutes
}

//********* date

choixDate.addEventListener("change",changeDate,false);

function changeDate(){
    incDateHeure();
    //devalRadios();
    //resetChoix(true);
    checkMaintenant.checked=false
    tableau.hidden=true;
    canvasCache(false);
    if (okProgresse==0){
        requetes(choixDate.value,choixHeure.value,"?"); // nom="?" : permet de conserver coordonnées (longitude, etc) 
        if (fixePhases==1)affiPhases(refPhase);
    } else if(okProgresse==1){
       var reponse=controleDate(choixDate.value);
       rechercheThemeProgresse(dateNatal,choixHeure.value);
       dessins();
    }
}

function checkDate(jour,mois,an){
    var date=choixDate.value.split("-");
    if(jour==-1) jour=Number(date[2]);
    if (mois==-1) mois=Number(date[1]);
    if (an==-1) an=Number(date[0]);
    var joursMois=[0,31,28,31,30,31,30,31,31,30,31,30,31];
    //année bissextile sauf 1900
    if (an%4==0 && an!=1900)joursMois[2]=29;
    checkMois();
    
    function checkMois(){
        if (mois<1){
            mois=12;
            an-=1;
        }
        else if (mois>12){
            mois=1;
            an+=1;
        }
    }
    
    if (jour<1){
        mois-=1;
        checkMois();
        jour=joursMois[mois];
    }
    else if (jour>joursMois[mois]){
        mois+=1;
        checkMois();
        jour=1;
    }
    choixDate.value=String(an) + "-" + ajoutZero(String(mois)) + "-" + ajoutZero(String(jour));
    changeDate();
}


incJour.onchange=changeJour; //ne pas modifier sinon pas d'appel de changeJour possible depuis checkJour
function changeJour(){
    var jour=Number(incJour.value);
    checkDate(jour,-1,-1);
}

incMois.onchange=function(){
    var mois=Number(incMois.value);
    checkDate(-1,mois,-1);
}

incAn.onchange=function(){
    var an=Number(incAn.value);
    checkDate(-1,-1,an);
}


 //**************** heure
 
choixHeure.addEventListener("change",changeHeure,false);
  
function changeHeure(){
    incDateHeure();
    //tableau progressé ? si oui, on le conserve affiché
    if (tableau.hidden==false){
        for (var i=1;i<=2;i++){
            if (choix2.item(i).checked==true){
                okProgresse=1;//évite changement de date après minuit
                choix2.item(i).checked=false;
                choix2.item(i).click();
                return;
            }
        }
    }
    //normal, affichage zodiaque
    //devalRadios();
    //resetChoix(true);
    checkMaintenant.checked=false
    tableau.hidden=true;
    canvasCache(false);
    if (okProgresse==0){
        requetes(choixDate.value,choixHeure.value,"?"); // nom="?" : permet de conserver coordonnées (longitude, etc) 
        if (fixePhases==1)affiPhases(refPhase);
    } else if(okProgresse==1){
        rechercheThemeProgresse(dateNatal,choixHeure.value);
        dessins();
      }
}

function checkJour(hh){
     //incrémente jour
    if (hh>23){
        hh=0;
        if (okProgresse==0){
            incJour.value=Number(incJour.value)+1; //sinon string
            changeJour();
        }
    }
     //décrémente jour
    else if (hh<0){
        hh=23;
        if (okProgresse==0){
            incJour.value=Number(incJour.value)-1;
            changeJour();
        }
    }
    return hh;
}

incHeure.onchange=function(){
    //date ancienne
    var heure=choixHeure.value.split(":");
    var minute=Number(heure[1]);;
    //nouvelle heure
    var hh=Number(incHeure.value);
    hh=checkJour(hh);
    choixHeure.value=ajoutZero(String(hh)) + ":" + ajoutZero(String(minute));
    changeHeure();
}

incMinute.onchange=function(){
    //date ancienne
    var heure=choixHeure.value.split(":");
    var hh=Number(heure[0]);
    //nouvelle minute
    var minute=incMinute.value;
    
    //fin d'heure
    if (minute>59){
        minute=0;
        hh+=1;
        hh=checkJour(hh);
    }
     //début d'heure
    else if (minute<0){
        minute=59;
        hh-=1;
        hh=checkJour(hh);
    } 
    choixHeure.value=ajoutZero(String(hh)) + ":" + ajoutZero(String(minute));
    changeHeure();
}

//*******************************reinit des boutons radio
function devalRadios(){
    choix1.item(0).checked=false;
    choix1.item(1).checked=false;
    choix2.item(0).checked=false;
    choix2.item(1).checked=false;
    choix2.item(2).checked=false;
}

function resetChoix(choix){
    choix1.item(0).disabled=choix;
    choix1.item(0).checked=!choix;
    choix1.item(1).disabled=choix;
  //  choix1.item(1).checked=!choix;
    choix2.item(0).disabled=choix;
    choix2.item(1).disabled=choix;
    choix2.item(2).disabled=choix;
 /*   choix4.item(0).disabled=!choix;
    choix4.item(0).checked=choix;
    choix4.item(1).disabled=!choix;
    choix4.item(1).checked=!choix;*/
    anneeTransit.disabled=choix;
}
function choix1Init(x){
    canvasCache(false);
    checkMaintenant.checked=false;
    labelProg.hidden=x;
    checkEquationTemps.hidden=x;
    checkMaisonsNatales.hidden=x;
    coeffOrbe.hidden=x;
        //boutons radio theme ou transits graphiques
        choix4.item(0).checked=true;
        choix4.item(1).checked=false;
     
    tableau.hidden=true;
    margeDiv.hidden=false;
    //tableau transits
    choix2.item(0).checked=false;
    choix2.item(1).checked=false;
    choix2.item(2).checked=false;
}

//********************************** entrées utilisateur ****************************************
function choixEcoute(){
    //choix1,2,3
    var x=[choix1,choix2,choix3,choix4];
    for (var i=0;i<x.length;i++){
        for (var j=0;j<x[i].length;j++){
            x[i][j].addEventListener("change",choixAgit,false);
        }
    }
    //autres
    x=[checkMaisons,checkMaisonsNatales,checkEquationTemps,anneeTransit,checkAsMc,cacheGauche,cacheCentre,cacheTitre,coefforbe,luminosite];
    for (i=0;i<x.length;i++){
        x[i].addEventListener("change",choixAgit,false);
    }
}

function choixAgit(e){
    switch(e.target.id){ //le "id" vient de zodiaque.html : doit être identique à la variable
        //choix1 thème
        case "natal":
            natProg=1;
            okTransits=0;
            okProgresse=0;
            choix1Init(true);
            choix4.item(1).disabled=false;
            choix4.item(1).checked=false;
            labelProg.hidden=true;
            //titreTheme=nomNatal;
            requetes(dateNatal,heureNatal,nomNatal);
            break;
        case "progresse":
            choix1Init(false);
            choix4.item(1).disabled=true;
            choix4.item(1).checked=false;
            okProgresse=1;
            okTransits=0;
            labelProg.hidden=false;
            if (natProg==1) dateJour(); //conserver sinon affichage thème progressé ne correspond plus à la date du jour
            incDateHeure();
            natProg=0;
            rechercheThemeProgresse(dateNatal,choixHeure.value);
            dessins();
            break;
        //choix2 transits
        case "transitsMondiaux":
            labelProg.hidden=true;
            checkMaintenant.checked=false;
            okProgresse=0;
            canvasCache(true);
            feuilleTransits(5,11);
            rechercheTransitsMondiaux(anneeTransit.value);
            break;
        case "transitsProgresseNatal":
            labelProg.hidden=false;
            checkEquationTemps.hidden=false;
            checkMaisonsNatales.hidden=true;
            checkMaisonsNatales.checked=false;
            coeffOrbe.hidden=true;
            okProgresse=1; //bloque les transits même si pas de perte du theme natal !
            choix2ProNat(0);
            break;
        case "transitsProgresseProgresse":
            labelProg.hidden=false;
            checkEquationTemps.hidden=false;
            checkMaisonsNatales.hidden=true;
            checkMaisonsNatales.checked=false;
            coeffOrbe.hidden=true;
            okProgresse=1; //bloque les transits sinon perte du theme natal
            choix2ProNat(1);
            break;
        //choix3 dominantes
        case "normal":
            couleurSecteurs(12);
            choix3Cache(false);
            ctx1.clearRect(centre[0]+rayon,0,400,1600);
            break;
        case "binaire":
            couleurSecteurs(2);
            choix3Cache(true);
            choix3Legende(0,1);
            break;
        case "ternaire":
            couleurSecteurs(3);
            choix3Cache(true);
            choix3Legende(2,4);
            break;
        case "quaternaire":
            couleurSecteurs(4);
            choix3Cache(true);
            choix3Legende(5,8);
            break;
        //choix4 theme ou transits graphiques
        case "radioTheme":
            checkMaintenant.checked=false;
            tableau.hidden=true;
            fixePhases=0;
            okTransits=0;
            asc=positionMaisonNatal[0];
            utc=utcLocal;
            longitude=longLocal;
            latitude=latLocal;
            requetes(choixDate.value,choixHeure.value);
            break;
        case "radioTransits":
            //blocage phases actives, progressé
            if (okProgresse==1 || fixePhases==1){
                choix4[1].checked=false;
                choix4[0].checked=true;
                return;
            }
         //   if (okProgresse==0 && fixePhases==0){ 
            if (okProgresse==0){ 
                checkMaintenant.checked=false;
                tableau.hidden=true;
                utc=utcLocal;
                longitude=longLocal;
                latitude=latLocal;
                okTransits=1;
                dateJour();
                incDateHeure();
                    //recalcul des positions live (sinon peuvent ne pas être à jour)
                    calcPositionsPlanetes(dateMaisons,choixHeure.value);
                    //sauvegarde
                    for (var i=0;i<=11;i++){
                        positionLive[i]=positionPlanete[i];
                        ecartLive[i]=ecartJour[i];
                    } 
                dessins();
                //dévalide option "progressé" (tracé et tableaux)
                choix1.item(1).disabled=true;
                choix2.item(1).disabled=true;
                choix2.item(2).disabled=true;
            }
            break;
        //autres
        case "checkMaisons":
            if (checkMaisons.checked==false){
                asc=180;
                canvas2.hidden=true;
            }else{
                choix1.item(1).checked==true ? asc=positionMaisonProgresse[0] : asc=positionMaisonNatal[0];
              //  asc=positionMaison[0];
                canvas2.hidden=false;
            }
            dessins();
            break;
        case "checkMaisonsNatales":
            if (tableau.hidden==true){
                choix1.item(1).checked=false;
                choix1.item(1).click();
              /*  if (checkMaisonsNatales.checked==true) checkEquationTemps.hidden=true;
                else checkEquationTemps.hidden=false;*/
            }
            break;
        case "checkEquationTemps":
            if (tableau.hidden==true){
                choix1.item(1).checked=false;
                choix1.item(1).click();
            }else if (choix2.item(2).checked==true){
                //il faut dévalider le bouton avant de cliquer dessus
                choix2.item(2).checked=false;
                choix2.item(2).click();
            }else if (choix2.item(1).checked==true){
                //il faut dévalider le bouton avant de cliquer dessus
                choix2.item(1).checked=false;
                choix2.item(1).click();
            }
            break;
        case "anneeTransit":
            for (var i=0;i<=2;i++){
                if (choix2.item(i).checked==true){
                    //il faut dévalider le bouton avant de cliquer dessus
                    choix2.item(i).checked=false;
                    choix2.item(i).click();
                    break;
                }
            }
            break;
        case "checkAsMc":
            dessins();
            break;
        case "cacheGauche":
            cacheGauche.checked==true ? cadre1.hidden=false : cadre1.hidden=true;
            if (tableau.hidden==true)dessins();
            break;
        case "cacheCentre":
            cacheCentre.checked==true ? cadre2.hidden=false : cadre2.hidden=true;
            if (tableau.hidden==true)dessins();
            break;
        case "cacheTitre":
            cacheTitre.checked==true ? titreCanvas.hidden=false : titreCanvas.hidden=true;
            break;
        case "coefforbe":
            if (tableau.hidden==true)dessins();
            break;
        case "luminosite":
            demarrage=0;
            lux=Number(luminosite.value);
            secteursSignes();
            break;
    }
}

    
function choix2ProNat(x){
    checkMaintenant.checked=false;
    canvasCache(true);
    feuilleTransits(0,6);
    rechercheTransitsProgresses(dateNatal,choixHeure.value,x);    
}

function choix3Cache(choix){
    tabResume.hidden=choix;
    tabDominantes.hidden=!choix;
}

function choix3Legende(x0,x1){
    ctx1.clearRect(centre[0]+rayon,0,400,1600);
    var y=150;
    ctx1.font=fontTableau;
    for (var i=0;i<=x1-x0;i++){
        //carrés de couleur
        ctx1.fillStyle="hsla(" + 60*(i%(x1-x0+1)) + ",70%, 50%,0.30)"; //0.30:luminosité des carrés de la légende
        ctx1.fillRect(centre[0]+(1.2*rayon),y-14,20,20);
        //texte légende
        ctx1.fillStyle="blue";
        ctx1.fillText(labelsDominantes[x1-i],centre[0]+(1.35*rayon), y);
        y-=40;
    }
}

//couleur des secteurs signes
function couleurSecteurs(x){
   luminosite.value=lux;
   if (lux==0)lux=0.15;
   for (var i=0; i<=11;i++){
        ctx1.beginPath();
        ctx1.arc(centre[0], centre[1], rayon, i*(Math.PI/6)+AS, (i+1)*(Math.PI/6)+AS, false);
        ctx1.lineTo(centre[0], centre[1]);
        ctx1.fillStyle ="white";
        ctx1.fill();
        ctx1.fillStyle ="hsla(" + 60*(i%x) + ",70%, 50%," + lux + ")"; //luminosité des secteurs signes du zodiaque
        ctx1.fill();
    }    
}

//************************************** fin des choix ***************************************************

//bascule thème/tableau
boutonBascule.onclick=function(){
   // canvasTarget.hidden=!canvasTarget.hidden;
  //  canvasInverse();
    if (tableau.hidden==false){
        canvasCache(false);
        tableau.hidden=true;
        okProgresse=0; //sinon affichage erronné des planètes rétrogrades, si "transits progressés" coché
    }else{
        canvasCache(true);
        tableau.hidden=false;
    }  
} 

function canvasInverse(){
    var x=[tableau,margeDiv,canvas1,canvas2,canvas3,canvas4,canvasGlobalAspects,canvasPartielAspects];
    for (var i=0;i<x.length;i++){
        x[i].hidden=!x[i].hidden;
    }
}

//cherche position sur wikipedia
infoLieu.addEventListener("click", () => {
    var adresse="https://" + navigator.language.slice(0,2)+".wikipedia.org/wiki/";
    adresse+=document.getElementById("3").value;//lieu
    // window.open(adresse);//déconseillé
    browser.tabs.create({url: adresse});
});

//cherche position sur wikipedia
infoUtc.addEventListener("click", () => {
    var adresse="https://time.is/" + navigator.language.slice(0,2)+"/";
    adresse+=document.getElementById("3").value;//lieu
    browser.tabs.create({url: adresse});
});

//*************************** marge droite *******************************
//AS=K=75(code)=13(planete), MC=L=76=14, NN=M=77=10, Lilith=N=78=11, Mondial=79=12

function margeClic(){
 //  fixePhases=0 ou 1
     if (okProgresse==0 ){
        fixePhases+=1;
        fixePhases=fixePhases%2;
        if (fixePhases==1){
            resetChoix(true); //devalide boutons radio
        }
        if (fixePhases==0 && okTransits==0){
            resetChoix(false); //revalide boutons radio
        }
    }
}

function margeNoir() {
    for (var i=0;i<margePl.length;i++){
        margePl[i].style.color="black";
    }
}

function margeSurvol(e){    //e.target représente l'index de l'array sur lequel on clique
    var x;
    //recherche planète (refPhase)
    for (var j=65;j<=79;j++){
        //planetes en noir
        margeNoir();
        //recherche
        if (String.fromCharCode(j)==e.target.innerText){
            if (j<=74) refPhase=j-65;
            else if (j==75 || j==76) refPhase=j-62 //AS,MC
            else if (j>76) refPhase=j-67; //lilith + NN + mondial
            x=j-65;
            break;
        }
    }
    if (okProgresse==0){
        //planete selectionnee en rouge
        margePl[x].style.color="red";
        //affichage
        affiPhases(refPhase);
    }
}

function margeSet(){
    var margeListe= document.createElement('div');
    margeListe.style.font="18px Zodiac";
    for (var i=0;i<=14;i++){
        margePl[i]=document.createElement('p');
        margePl[i].textContent = String.fromCharCode(65+i);
        margeListe.appendChild(margePl[i]);
        //listeners
        margePl[i].addEventListener("mousemove",margeSurvol,false); //consomme moins de mémoire que de placer la fonction ici..
        margePl[i].addEventListener("click",margeClic,false);
                            /*  margePl[i].onmouseover=function(e){
                                    if (checkThemeLive.checked==false && okProgresse==0 ){
                                        displayDivInfo(labelsDroite[29],e.pageX-150,e.pageY);
                                    }
                                }
                                margePl[i].onmouseout=function(){
                                    displayDivInfo();
                                }*/
    }
    margeDiv.appendChild(margeListe);
    //mondial
    margePl[14].onmouseover=function(e){
        displayDivInfo(labelsDroite[27],e.pageX-50,e.pageY+10);
    }
    margePl[14].onmouseout=function(){
        displayDivInfo();
    }
}

//******************************* fin marge***************************
function cacheTransits(){
    incJour.hidden=true;
    incMois.hidden=true;
    incAn.hidden=true;
    incHeure.hidden=true;
    incMinute.hidden=true;
}

//fin de chargement de la page
window.onload=function() {
    traductions();
    choixEcoute();
    margeSet();
    demarrage=1;
    //recherche du navigateur
    navigateur="";
    var x=["firefox","chrome","android"];
    var ua = navigator.userAgent.toLowerCase();
    for (var i=0; i<x.length;i++){
        if (ua.indexOf(x[i]) > -1){navigateur=x[i]} //&& ua.indexOf("mobile");
    }
    android=0;
    if (navigateur=="android"){
        taille-=4;
        android=1;
        cacheTransits();
    }
    fontTableau='12px serif';
    if (navigateur=="chrome") fontTableau='14px serif'; //tableau résumé plus lisible
     
    //temporisation au démarrage sinon symboles planetes non chargés
    //utiliser setTimeout uniquement sous cette forme ou la suivante sinon message erreur relatif à la sécurité
    let timer = setTimeout(() => {
        console.log('Zodiaque démarré');
        checkMaintenant.click();
    }, 100);
    //autre syntaxe pour utiliser un timer
    /*let timer = setTimeout(function () {
    console.log('Bonjour :)');
    }, 1000);*/
    
    
            //v.1.3.0 : suppression zoom
            //sauvegarde images canvas pour zoom
            /*image1.src=canvas1.toDataURL("image/png");
            image2.src=canvas2.toDataURL("image/png");
            trackTransforms();*/
}  

window.onresize =function() {
    if (canvas1.hidden==false){
      //  setCanvas();
        dessins();
    }
}

boutonTest.onclick=function(){
   // equationTemps();

} 

//pas utilisé
/*fileElem.addEventListener("change",() => {
    gereFichier();
},onError); */
