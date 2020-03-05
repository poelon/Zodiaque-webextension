function definitions(choix){
    //aspect=["conjonction","semi-sextile","semi-carré","sextile","carré","trigone","sesqui-carré","quinconce","opposition","quinconce","sesqui-carré","trigone","carré","sextile","semi-carré","semi-sextile","conjonction"],
    var angle=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360],
        couleur=['blue','blue','red','blue','red','blue','fuchsia','green','red','green','fuchsia','blue','red','blue','red','blue','blue'],
        arc=[[0,0],[1,1],[1,2],[2,3],[3,3],[4,4],[4,4],[5,5],[5,6],[6,7],[7,7],[8,8],[8,8],[8,9],[9,10],[10,11],[11,11],[12,12],[12,12],[13,13],[13,14],[14,15],[15,15],[16,16],[0,0]];
        //couleurs sesqui-carrés et quinconces différentes sur graphe ou tableau transits (choix=1)
        if (choix==1){
            couleur[6]=couleur[10]='red'; //sesqui-carré
            couleur[7]=couleur[9]='blue'; //quinconce
        }
    return [angle,couleur,arc];
}


//******************************************** transits mondiaux *******************************************

function rechercheTransitsMondiaux(anneeTransit){
     //2 formats de date : new Date("aaaa-mm-jj") ou new Date("aaaa","m-1","j+1")
    var jour=1, //1er janvier année transit 
        premJanvier=(anneeTransit+"-"+"01"+"-"+"01"),
        mois,
        position,
        positionSigne,
        heuredecimale=utc; //12-utc,
        heure=ajoutZero(String(heuredecimale))+":00",
        ijmax=11,
        jourmax=365;
        if (Number(anneeTransit)%4==0 && Number(anneeTransit)!=1900){jourmax+=1;} //année bisextile
    //départ au 1er janvier
    var date=new Date(premJanvier);
    var jj=calcJourJulien(premJanvier,heure);
    //nbre de jours depuis le 1/01/1800 (pour recherche dans éphémérides NN et Lilith)
    var refTime=new Date('1800-01-01'),
        endTime=date,
        timeDiff = endTime - refTime,
        daysDiff = timeDiff / (1000 * 60 * 60 * 24)+1;
    //exclusion NN et Lilith si en-dehors plage 1800-2039
    if (Number(anneeTransit) <=1799 || Number(anneeTransit) >=2040){ijmax=9}
    
 do { 
     
    //transitantes Jupiter à Lilith
    for (var i=5; i<=ijmax; i++){
        mois=date.getUTCMonth()+1;
        //Jupiter à Neptune
        if (i<9){
            position=calcPlanetes(Number(anneeTransit),heuredecimale,jj,i);
        }
        //Pluton
        else if (i==9){
            position=calcPluton(Number(anneeTransit),heuredecimale,jj);
        }
        //NN
        else if (i==10 || i==11){ 
            position=calcNNLilith(jj,i);
        }  
       //obsolete Lilith
     /*   else if (i==11){ 
            position=rechercheEphemerides(daysDiff,heuredecimale,i);
            if (isNaN(position)){continue};
        }  */
        //écriture du signe de la planète au 1er janvier
        if (mois==1 && jour==1){
            var x=Math.floor(position/30);
            var signe=String.fromCharCode(97+x)
            var cellule=tableau.rows[3].cells[i-4];
            ecritCell(cellule,'green',signe);
        }
            //tolerance=0.22/Math.pow(2,i-4);
           // tolerance=Math.min(0.11,Math.abs(ecartJour[i])*2);
          //  if (Number.isNaN(position)==true || position <0 || position >360){console.log(i + " : " +position);}
            
        //transitées : planètes, maisons et signes
        for (var j=0; j<=ijmax; j++){
            //planètes de Soleil à Lilith
            if (j<=11 && isNaN(positionNatal[j])==false){
            traiteTransitsMondiaux(heuredecimale,jj,anneeTransit,position,positionNatal[j],i,j,jour,"planete");
            }
            //maisons AS et MC
            if (j==0 || j==9){
            traiteTransitsMondiaux(heuredecimale,jj,anneeTransit,position,positionMaisonNatal[j],i,j,jour,"maison"); 
            }
            //signes
            positionSigne=30*j;
            traiteTransitsMondiaux(heuredecimale,jj,anneeTransit,position,positionSigne,i,j,jour,"signe");
        }
   }
   jour+=1;
   jj+=1;
   daysDiff+=1;
   date.setUTCDate(date.getUTCDate()+1);
 } while (jour<=jourmax);
    
    doublonsTransits();
    tableau.rows[0].cells[0].textContent=titreTheme.split(" ")[0] + " - " +labelsDroite[10] +anneeTransit;
}

function traiteTransitsMondiaux(heuredecimale,jj,anneeTransit,position,transitee,i,j,jour,type){
    var [angle,couleur,arc]=definitions(1);
    var tolerance=0.11,
        planete,
        aspect,
        retro,
        position2,
        date2,
        jourReel,
        mois,
        ecart;
    var gap=position-transitee;
        if (gap<0){gap+=360}
    var gapArc=Math.floor(gap/15);
      /* if (gapArc <0 || gapArc >=24){console.log(i + " : " +position + "gaparc : " +gapArc);} 
        if (Number.isNaN(gapArc)==true) {
            console.log("i,j: " + i +","+j + " ,position: "+ position+ " ,transitée: "+transitee + " ,gap: " + gap + " ,gapArc : "+gapArc);
        }*/
    //tolerance lilith
    if (i==11){tolerance=Math.abs(ecartJour[i])}
    //recherche aspects
    for (var k=arc[gapArc][0]; k<=arc[gapArc][1]; k++){
        //exclusions
        switch(type){
        case "planete":
            //Jupiter : conjonction, carré, trigone et opposition seulement
            if (i==5 && (k==1 || k==2 || k==3 || k==6 || k==7 || k==9 || k==10 || k==13 || k==14 || k==15)){
                continue;
            }
            //NN : conjonction, carré, opposition
            if ((i==10 || j==10) && (k==1 || k==2 || k==3 || k==5 || k==6 || k==7 || k==9 || k==10 || k==11 || k==13 || k==14 || k==15)){
                continue;
            }
            //Lilith : conjonctions
            if (i==11 && k>0 && k<16){    
                continue; 
            }
            break;
        case "maison":
            //Maisons : conjonction, carré, trigone et opposition sauf lilith conjonction seulement
            if (i<11 && (k==1 || k==2 || k==3 || k==6 || k==7 || k==9 || k==10 || k==13 || k==14 || k==15) || (i==11 && k>0 && k<16)){
                continue;
            }
            break;
        case "signe":
            //conjonction
            if (k>0 && k<16){
                continue;
            }
        }
        //aspect trouvé
        if (gap<=(angle[k]+tolerance) && gap>=(angle[k]-tolerance)){
            //rétrograde ?
                //récupération jour et mois
                date2=new Date(anneeTransit,"0",String(jour+1)); //avec cette définition jour est compris entre 2 et 366 (ou 367)
                mois=date2.getUTCMonth()+1;
                jourReel=date2.getUTCDate(); //jour du mois
            //lecture position à jour+1
                //Jupiter à Neptune
                if (i<9) position2=calcPlanetes(Number(anneeTransit),heuredecimale,jj+1,i)
                //Pluton
                else if (i==9) position2=calcPluton(Number(anneeTransit),heuredecimale,jj+1);
                //NN - Lilith
                else if(i==10 || i==11) position2=calcNNLilith(jj+1,i);
                ecart=reboucle(position2-position);
                //rétrograde si écart négatif
                retro="";
                if (ecart<0){retro=String.fromCharCode(64);} //arrowbase
            //aspects : de conjonction m(109) à opposition u(117)
            aspect=String.fromCharCode(109+(k%16)); //k modulo 16 : 16=0=conjonction
                //"+" = croissants, "," = décroissants
                if (k>0 && k<8){aspect+="+";}
                else if(k>8 && k<16){aspect=String.fromCharCode((109+k)-2*(k-8))+",";}
            //planetes et maisons
            if (type=="planete"){
                //Soleil A=65 à Pluton J=74
                planete=String.fromCharCode(65+j);
                //NN et Lilith (NN: M=77, Lilith: N=78)
                if (j>=10){planete=String.fromCharCode(67+j);} 
            }else if (type=="maison"){
                //AS=K=75, MC=L=76
                if (j==0){planete=String.fromCharCode(75);}
                else if(j==9){planete=String.fromCharCode(76);}
            }
             //signes : a=97 à l=108
               else if (type=="signe"){
                   var signe=String.fromCharCode(97+j);
                   var abc=tableau.rows[3].cells[i-4].textContent;
                   if (abc.search(signe)==-1){
                        var cellule=tableau.rows[3].cells[i-4];
                        ecritCell(cellule,'green',aspect+signe +"  " + String(jourReel) + "/" + ajoutZero(String(mois)));
                   }
                   break;
               }  
            //données
            var abc=aspect+planete+"  " + String(jourReel);
            if (type=="maison"){abc+="/" + ajoutZero(String(mois));}    
            //cellule tableau
            var tabCell;
            if (type=="planete" || i==11 ){tabCell=tableau.rows[mois+3].cells[i-4]} //lilith (i=11) :planete+maison (les transits de lilith sur maison sont mis dans les cellulles planètes, le temps de filtrer les doublons puis remis en cellule maison (v. zodiaque doublonsTransit ligne 1127)
            else{tabCell=tableau.rows[2].cells[i-4]}
           // écriture tableau
           ecritCell(tabCell,couleur[k],retro+abc);
           break;
         }
     }
}


//*************************************** transits progressés ************************************

function rechercheTransitsProgresses(date,heure,pnpp){
    //pnpp=0=transits progressé/natal, pnpp=1=transits progressé/progressé
    var tolerance;//=Number(sensibilite.value); //0.1;
    var positionTransitante,
        positionTransitee,
        positionSigne,
        dateMaisonsProgresse,
        joursmois=[31,28,31,30,31,30,31,31,30,31,30,31];

    //année bissextile
    if (anneeTransit.value%4 ==0 && anneeTransit.value !=1900){
        joursmois[1]=29;
    }    
    //enregistre les positions des planètes au 1er janvier (= date anniversaire) de l'année progressée (recherche avec date format string jj/mm/aaaa)
    var [jours,date1Janvier,age]=parametresProgresse(date,heure,"01/01/"+anneeTransit.value,anneeTransit.value);
    var jour=ajoutZero(String(date1Janvier.getUTCDate()));
    var mois=ajoutZero(String(date1Janvier.getUTCMonth() +1));
    var an=String(date1Janvier.getUTCFullYear());
    calcPositionsPlanetes(an+"-"+mois+"-"+jour,heure);
    //positions planètes progressées au jour exact
    traitePlaneteProgresse(jours);
    
    //récupère les positions des maisons progressées (car peuvent être vides)
    if(pnpp==1){
        //recherche position ascendant à an+1 pour déterminer l'écart annuel ecartProg
        ascProgPlus1(heure,date1Janvier,jours);
        //sauve positions maisons progressées au 1er janvier
        var dateMaisonsProgresse=String(an)+"-"+String(mois)+"-"+String(jour);
        calcPositionsMaisons(heure,dateMaisonsProgresse,jours,1);
        sauvePositionsMaisons("progresse"); 
    }
    
jours=0;    
 for (mois=1; mois<=12; mois++){ 
    
    for (jour=1; jour<=joursmois[mois-1]; jour++){
        
        //transitantes Soleil à Saturne
        for (var i=0; i<=6 ; i++){
            positionTransitante=positionPlanete[i];
            tolerance=Math.abs(ecartJour[i]/365);
            
            //écriture du signe de la planète le 1er janvier
            if (mois==1 && jour==1){
                var x=Math.floor(positionTransitante/30);
                var signe=String.fromCharCode(97+x)
                var cellule=tableau.rows[3].cells[i+1];
                ecritCell(cellule,'green',signe);
            }
                
            //transités : Signes, Maisons et Planètes
            for (var j=0; j<=11; j++){ 
                //signes 
                positionSigne=30*j;
                    traiteTransitsprogresses(positionTransitante,positionSigne,tolerance,i,j,mois,jour,"signe");
               
                //maisons
                if (pnpp==0){positionTransitee=positionMaisonNatal[j]}
                else {
                    //ecartProg=écart annuel sur l'ascendant
                    positionTransitee=reboucle360(positionMaison[j]+(jours*ecartProg/365));
                }
                    traiteTransitsprogresses(positionTransitante,positionTransitee,tolerance,i,j,mois,jour,"maison");
               
                //planètes
                if (i==j) continue; 
                pnpp==1 ? positionTransitee=positionPlanete[j] : positionTransitee=positionNatal[j];
                    traiteTransitsprogresses(positionTransitante,positionTransitee,tolerance,i,j,mois,jour,"planete");     
            }            
        }
     //incrémente d'1 jour (dans themes.js)
     traitePlaneteProgresse(1);
     jours+=1;
    }
 }
    doublonsTransits();
    if (pnpp==1){var abc=" - "+labelsDroite[12];} //transits progressé/progressé "
    else {var abc=" - " + labelsDroite[11];} //]transits progressé/natal " 
    tableau.rows[0].cells[0].textContent=titreTheme.split(" ")[0] + abc + anneeTransit.value;
    if (checkEquationTemps.checked==true){
        tableau.rows[0].cells[0].textContent+=" ("+labelsCentre[15]+ " : "+equationProg+")";
    }
}

function traiteTransitsprogresses(transitante,transitee,tolerance,i,j,mois,jour,type){
    var [angle,couleur,arc]=definitions(1);    
    var gap,   
        gapArc,
        aspect,
        signe,
        planete;
    gap=transitante-transitee;
    if (gap<0){gap+=360;}
    gapArc=Math.floor(gap/15);    

 // uniquement les conjonctions pour signes et maisons sauf AS et MC
 if (type=="planete" || ((type=="signe" || type=="maison") && (gapArc==0 || gapArc>=23)) || (type=="maison" && (j==0 || j==9))){ 
    //recherche aspects
    for (var k=arc[gapArc][0]; k<=arc[gapArc][1]; k++){
        //aspect trouvé
        if (gap<=(angle[k]+tolerance) && gap>=(angle[k]-tolerance)){
           aspect=String.fromCharCode(109+(k%16)); //k modulo 16 : 16=0=conjonction
               if (k>0 && k<8){
                   //+ = croissants
                   aspect+="+";
               }else if(k>8 && k<16){
                   //, = décroissants
                   aspect=String.fromCharCode((109+k)-2*(k-8))+",";
               }
               //planètes : de Soleil A=65 à Pluton J=74 + NN M=77, Lilith N=78
               if (type=="planete"){
                    planete=String.fromCharCode(65+j)
                    //NN et Lilith
                    if (j>=10){
                        planete=String.fromCharCode(67+j)
                    } 
                    //écriture aspect+transitée+jour
                    var abc=tableau.rows[mois+3].cells[i+1].textContent
                        //évite doublons (si -1, la même planète n'existe pas déjà pour ce mois-là)
                        if (abc.search(planete)==-1){
                            var cellule=tableau.rows[mois+3].cells[i+1];
                            ecritCell(cellule,couleur[k],aspect+planete+"  "+String(jour));
                        }
                //maisons
               }else if (type=="maison"){
                   //console.log ("i " +i + " j "+j+ " "+transitante+ " "+transitee + " " + (transitante-transitee) +" "+tolerance);
                    var abc=tableau.rows[2].cells[i+1].textContent
                    if (abc.search(AtoR(j+1))==-1){
                        var cellule=tableau.rows[2].cells[i+1]
                        ecritCell(cellule,couleur[k],aspect+String(j+1) +"  "+ String(jour) + "/" + ajoutZero(String(mois)));
                    }
                //signes : a=97 à l=108
               }else if (type=="signe"){
                   signe=String.fromCharCode(97+j)
                   var abc=tableau.rows[3].cells[i+1].textContent
                    if (abc.search(signe)==-1){
                        var cellule=tableau.rows[3].cells[i+1];
                        ecritCell(cellule,'green',aspect+signe +"  " + String(jour) + "/" + ajoutZero(String(mois)));
                   }
               }  
        }
    } 
  } 
}


// **********************************************tableau transits **********************************************

function feuilleTransits(colonneDebut,colonneFin){
    var tabCell;
    choix1.item(0).checked=false;
    choix1.item(1).checked=false;
     if (tableau) {
  	garbage=cadre.removeChild(tableau);
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
    for (var i=0; i<=15; i++){
        row = document.createElement('tr');
        tableau.appendChild(row);
        tableau.rows[i+1].style.font="16px Zodiac"
            
        //colonnes
        for (var j=colonneDebut-1; j<=colonneFin; j++){
            cell = document.createElement('td');
            row.appendChild(cell);
            if((i==0 || i==15) && j>=colonneDebut){
                cell.width="12.5%";
                cell.textContent = planetesFonts[j];
                cell.style.backgroundColor="rgb(240,240,240)"; //gris
                     
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
                else if(i>2 && i<15){
                    //mois en lettres
                    var date = new Date(Date.UTC(2012,i-3,20));
                    var options = { month: 'long'};
                    var langue=browser.i18n.getUILanguage()
                    var dateTime=new Intl.DateTimeFormat(langue, options).format(date);  
                    cell.textContent =dateTime;
                }
            }else if (j==colonneFin && (i==1 || i>2)) cell.style.font='12px Zodiac'; //lilith
        }
    } 
    tableau.rows[1].cells[0].style.backgroundColor='white';
    tableau.rows[16].cells[0].style.backgroundColor='white';
}  

function ecritCell(cellule,couleur,contenu){
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

function doublonsTransits(){
    var x,
        max,
        cellule,
        cellRef,
        couleur,
        cell0,
        cell1,
        ajout,
        abc
        joursMois=[31,28,31,30,31,30,31,31,30,31,30,31];
    //année bissextile
    if (anneeTransit.value%4 ==0 && anneeTransit.value !=1900){
        joursMois[1]=29;
    }  
        
    //1er passage pour éliminer les doublons dans chaque cellule
     for (var l=1;l<=7;l++){ //colonnes
        for (var k=2;k<=15;k++){ //lignes
            cellule=tableau.rows[k].cells[l]
            max=cellule.children.length;
            if (max==0){continue};
            cell0=[];
            cell1=[];//[transit,date,doublon,couleur]
            //stocke dans cell1 tous les transits de la cellule après élimination des doublons
            for (var i=0;i<max;i++){
                cell0=cellule.children.item(i).textContent.split("  ");
                couleur=cellule.children.item(i).cells[0].style.color;
                var j=cell1.length-1;
                if (j>=0){
                    if (cell0[0].localeCompare(cell1[j][0])==0){ //0=identiques
                        cell1[j][2]+=1;
                        continue;
                    }
                }
                    cell1[cell1.length]=cell0;
                    cell1[cell1.length-1][2]=1; //nombre d'occurences ;length-1 car length a augmenté de 1 à la ligne précédente
                    cell1[cell1.length-1][3]=couleur;
            }
            
            //compression éventuelle de cell1 si pas de "rétrograde"(=@) entre 2 transits identiques ou inversement
            for (j=0;j<cell1.length;j++){
                if (cell1[j].length==0) continue;
                abc=cell1[j][0];
                //suppression ou ajout @
                abc.search("@") >= 0 ? abc = abc.slice(1) : abc = "@" + abc;
                for (var m=j+1;m<cell1.length;m++){
                    if (abc.localeCompare(cell1[m][0])==0) break;
                    if (cell1[j][0].localeCompare(cell1[m][0])==0){
                        cell1[j][2]+=cell1[m][2];
                        cell1[m]=[];
                    }
                }
            }
            
            // effacement cellule
            while (cellule.firstChild) {
                garbage=cellule.removeChild(cellule.firstChild);
            }
            //réécriture cellule
            for (j=0;j<cell1.length;j++){
                if (cell1[j].length==0) continue;
                if (cell1[j][1]){ //date présente
                    cell0=(""+cell1[j][1]).split("/"); //le "" sert à convertir le nombre cell1[...] en string
                    x=Math.ceil((+cell0[0])+(+cell1[j][2]/2-1)); //le +cell... sert à convertir un string en nombre
                    //1ère ligne : mois des transits sur Maison (si à cheval sur 2 mois, ex 33/01, convertit en 2/02)
                    if (cell0.length>1){
                        if(x>joursMois[cell0[1]-1]){
                            x-=joursMois[cell0[1]-1]
                            cell0[1]=Number(cell0[1])+1; //Number() sinon string...
                        }
                        x+="/"+cell0[1];
                    
                    };
                }else {x=""}; //pas de date (signe en progressé 2ème ligne)
                //création d'une sous-cellule (cellule,couleur,texte)
                cellRef=cellule;
                    //dans cellule maison si maison (et lilith)
                    if (cell1[j][0].search(String.fromCharCode(75))>0 || cell1[j][0].search(String.fromCharCode(76))>0){
                        cellRef=tableau.rows[2].cells[l];
                    }
                ecritCell(cellRef,cell1[j][3],cell1[j][0]+"  "+x);
            }
        }
    }
    
    //2ème passage pour éliminer les doublons entre 2 mois successifs (sauf lilith, maisons et signes)
    for (l=1;l<7;l++){ //colonnes=planetes
        for (k=4;k<15;k++){ //lignes=mois
            cell0=[];
            cell1=[];
            //lecture cellules mois et mois+1
            for (j=0;j<=1;j++){
                cellule=tableau.rows[k+j].cells[l]
                max=cellule.children.length;
                if (max==0){break};
                x=[cell0,cell1]; //mois et mois+1
                for (i=0;i<max;i++){
                    x[j][i]=cellule.children.item(i).textContent.split("  ");
                    couleur=cellule.children.item(i).cells[0].style.color;
                    x[j][i][2]=0;
                    x[j][i][3]=couleur;
                }
            }
            if (max==0){continue};
            //recherche doublons
            ajout=0;
            for (j=cell0.length-1;j>=0;j--){ //mois
                for (i=0;i<cell1.length;i++){ //mois+1
                    if (cell0[j][0].localeCompare(cell1[i][0])==0){
                        ajout=1;
                        //console.log("tableau transits "+anneeTransit.value+", doublons colonne : " +l+" lignes : "+k +"-"+Number(k+1));
                        x=Number(cell0[j][1])+joursMois[k-4]+Number(cell1[i][1]);
                        x=Math.floor(x/2);
                        if (x<=joursMois[k-4]){
                            cell0[j][1]=x;
                            cell1[i][0]="";
                        }else{
                            cell0[j][0]="";
                            cell1[i][1]=x-joursMois[k-4];
                        }
                    }
                }
            }
            if (ajout==1){
                //effacement et réécriture cellules mois et mois+1
                for (j=0;j<=1;j++){
                    cellule=tableau.rows[k+j].cells[l];
                    while (cellule.firstChild) {
                        garbage=cellule.removeChild(cellule.firstChild);
                    }
                    x=[cell0,cell1];
                    for (i=0;i<x[j].length;i++){
                        if (x[j][i][0]=="") {continue};
                        //création d'une sous-cellule (cellule,couleur,texte)
                        ecritCell(cellule,x[j][i][3],x[j][i][0]+"  "+x[j][i][1]);
                    }
                }
            }
        }
    }
}

//***********************************************************************************************

/* abc=String.fromCharCode(66) - a=97 à l=108, u=117, A=65 à J=74, 1=49
 * 
 * 'aspects décroissants
								for m=9 to 15
									if aspect_transit=aspect(m) then
									symbole_aspect_transit=chr$(109+m-2*(m-8)) '109=m, de m à u conjonction à opposition
 * 'aspects et planètes écrits en symboles	avec la police "Zodiac S" 
 '9 aspects (conjonction à opposition) = m à u(opposition)
'12 signes (bélier à poissons) = a à l
 '10 planètes (soleil à pluton) = A à J
'4 compléments AS=K, MC=L, NN=M, Lilith=N
 'flèche aspect croissant = +  décroissant = ,
 
 case 0 to 9 'thème externe
				abc=chr$(65+i) 'A à J
				case 16 to 25 'thème interne
				abc=chr$(49+i) 'A à J
				case 10,26'NN
				abc="M"
				case 11,27 'Lilith
				abc="N"
				case 12,28'AS
				abc="K",*/
