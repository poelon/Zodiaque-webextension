 
function rechercheTransitsMondiaux(anneeTransit) {
    var angle=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360],
        couleur=['blue','blue','red','blue','red','blue','red','blue','red','blue','red','blue','red','blue','red','blue','blue'],
        arc=[[0,0],[1,1],[1,2],[2,3],[3,3],[4,4],[4,4],[5,5],[5,6],[6,7],[7,7],[8,8],[8,8],[8,9],[9,10],[10,11],[11,11],[12,12],[12,12],[13,13],[13,14],[14,15],[15,15],[16,16],[0,0]];
    var tolerance=0.11,
        jour=2, //1er janvier année transit (jours vont de 2 à 366)
        position,
        dateAnalyse,
        heure=choixHeure.value,
        ijmax=11,
        jourmax=366;
        if (Number(anneeTransit)%4==0){jourmax+=1;}
    var heuredecimale=Number(choixHeure.value.split(':')[0])+ (Number(choixHeure.value.split(':')[1])/60)-utc;
    //départ au 1er janvier
    var date0=new Date(anneeTransit,"0",String(jour));
    var mois=date0.getUTCMonth()+1;
    //date aaaa-mm-jj 
    var date=String(date0.getUTCFullYear())+"-"+ajoutZero(String(mois))+"-"+ajoutZero(String(date0.getUTCDate()));
    var jj=calcJourJulien(date,heure);
      //nbre de jours depuis le 1/01/1900 (pour recherche dans éphémérides)
        var  refTime=new Date('1900-01-01');
        var endTime=date0;
        var timeDiff = endTime - refTime;
        var daysDiff = timeDiff / (1000 * 60 * 60 * 24)+1;
    //exclusion NN et Lilith si en-dehors plage 1900-2099
    if (Number.isNaN(positionPlanete[11])==true || Number(anneeTransit) <=1899 || Number(anneeTransit || index==-1) >=2100){ijmax=9;}
    
 do { 
     
    //transitantes Jupiter à Lilith
    for (var i=5; i<=ijmax; i++){
        mois=date0.getUTCMonth()+1;
        //Jupiter à Neptune
        if (i<9){
            position=planetesCalc(Number(anneeTransit),heuredecimale,jj,i);
        }
        //Pluton
        else if (i==9){
            position=pluton(Number(anneeTransit),heuredecimale,jj);
        }
       //NN Lilith
        else if (i==10 || i==11){ 
            rechercheEphemerides(daysDiff,heuredecimale,i);
            position=positionPlanete[i];
        }        
            // tolerance=ecartJour[i]*2;
          //  if (Number.isNaN(position)==true || position <0 || position >360){console.log(i + " : " +position);}
            
        //transitées : planètes et maisons
        for (var j=0; j<=ijmax; j++){
            //planètes de Soleil à Lilith
            if (j<=11){
            traiteTransitsMondiaux(angle,couleur,arc,heuredecimale,jj,anneeTransit,position,positionNatal[j],tolerance,i,j,jour,"planete");
            }
            //maisons AS et MC
            if (j==0 || j==9){
            traiteTransitsMondiaux(angle,couleur,arc,heuredecimale,jj,anneeTransit,position,positionMaisonNatal[j],tolerance,i,j,jour,"maison"); 
            }
        }
   }
   jour+=1;
   jj+=1;
   daysDiff+=1;
   date0.setUTCDate(date0.getUTCDate()+1);
 } while (jour<=jourmax);
 
    tableau.rows[0].cells[0].textContent=nomNatal + " - " +labelsDroite[10] +anneeTransit;
  //  console.log('recherche transits mondiaux : terminé');
}

function traiteTransitsMondiaux(angle,couleur,arc,heuredecimale,jj,anneeTransit,position,transitee,tolerance,i,j,jour,type){
    var planete,
        aspect,
        retro,
        position2,
        date2,
        mois,
        jour,
        ecart;
    var gap=position-transitee;
        if (gap<0){gap+=360;}
    var gapArc=Math.floor(gap/15);
      /*  if (gapArc <0 || gapArc >=24){console.log(i + " : " +position + "gaparc : " +gapArc);} 
        if (Number.isNaN(gapArc)==true) {
            console.log("i,j : " + i +","+j + " position : "+ position+ " gapArc : "+gapArc);
        }*/
        
    //recherche aspects
    for (var k=arc[gapArc][0]; k<=arc[gapArc][1]; k++){
        //exclusions
        switch(type){
        case "planete":
            //Jupiter : conjonction, carré, trigone et opposition seulement
            if (i==5 && (k==1 || k==2 || k==3 || k==6 || k==7 || k==9 || k==10 || k==13 || k==14 || k==15)){
                continue;
            }
            //NN
            if ((i==10 || j==10) && (k==1 || k==2 || k==3 || k==5 || k==6 || k==7 || k==9 || k==10 || k==11 || k==13 || k==14 || k==15)){
                continue;
            }
            //Lilith
            if (i==11 && k>0 && k<16){    
                continue; 
            }
            break;
        case "maison":
            //Maisons : conjonction, carré, trigone et opposition seulement
            if (k==1 || k==2 || k==3 || k==6 || k==7 || k==9 || k==10 || k==13 || k==14 || k==15){
                continue;
            }
        }
        //aspect trouvé
        if (gap<=(angle[k]+tolerance) && gap>=(angle[k]-tolerance)){
            //rétrograde ?
                //lecture position à jour+1
                date2=new Date(anneeTransit,"0",String(jour+1));
                mois=date2.getUTCMonth()+1;
                jour=date2.getUTCDate();
                //Jupiter à Neptune
                if (i<9){
                    position2=planetesCalc(Number(anneeTransit),heuredecimale,jj+1,i)
                    ecart=reboucle(position2-position);
                }
                //Pluton
                else if (i==9){
                    position2=pluton(Number(anneeTransit),heuredecimale,jj+1);
                }
                //NN - Lilith
                else if(i==10 || i==11){ecart=ecartJour[i];}
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
            //données
            var abc=aspect+planete+"  " + String(jour);
            if (type=="maison"){abc+="/" + String(mois);}    
            //cellule tableau
            var tabCell;
            if (type=="planete"){tabCell=tableau.rows[mois+3].cells[i-4];}
            else{tabCell=tableau.rows[2].cells[i-4];}
           // écriture tableau
           feuilleEcritTransits(tabCell,couleur[k],retro+abc);
           break;
         }
     }
}



//***************************************recherche transits progressés************************
function rechercheTransitsProgresses(date,heure){
    var tolerance;//=Number(sensibilite.value); //0.1;
    var positionTransitante,
        positionTransitee,
        positionSigne,
        joursmois=[31,28,31,30,31,30,31,31,30,31,30,31];

    //année bisextile
    if (anneeTransit.value%4 ==0){
        joursmois[1]=29;
    }    
    //enregistre les positions des planètes au 1er janvier (ou date anniversaire ?) de l'année progressée (recherche avec date format string jj/mm/aaaa)
    var [jours,date1Janvier]=parametresProgresse(date,heure,"01/01/"+anneeTransit.value,anneeTransit.value)
  //  rechercheEphemerides(date1Janvier.toLocaleDateString());
    var jour=date1Janvier.getUTCDate();
    var mois=date1Janvier.getUTCMonth() +1;
    var an=date1Janvier.getUTCFullYear();
    calculEphemerides(an+"-"+mois+"-"+jour,heure);
    //positionnement au 1er janvier
    traiteProgresse(jours);
    //récupère les positions des maisons progressées (car peuvent être vides)
    if(choix2transitsProgresseProgresse.checked==true){
       var dateMaisonsProgresse=String(date1Janvier.getUTCFullYear())+"-"+String(date1Janvier.getUTCMonth()+1)+"-"+String(date1Janvier.getUTCDate());
       rechercheMaisons(choixHeure.value,dateMaisonsProgresse);
       sauvePositionsMaisons("progresse"); 
    }
    
    
 for (var mois=1; mois<=12; mois++){ 
    
    for (var jour=1; jour<=joursmois[mois-1]; jour++){
        
        //transitantes Soleil à Saturne
        for (var i=0; i<=6 ; i++){
            positionTransitante=positionPlanete[i];
            tolerance=Math.abs(ecartJour[i]/365);
            
            //écriture du signe de la planète
            if (mois==1 && jour==1){
                var x=Math.floor(positionTransitante/30);
                var signe=String.fromCharCode(97+x)
                var cellule=tableau.rows[3].cells[i+1];
                feuilleEcritTransits(cellule,'green',signe);
            }
                
            //transités : Signes, Maisons et Planètes
            positionSigne=0;
            for (var j=0; j<=11; j++){ 
               //signes 
               if (choix2transitsProgresseNatal.checked==true || choix2transitsProgresseProgresse.checked==true){
                  positionTransitee=positionSigne;
                  traiteTransitsprogresses(positionTransitante,positionTransitee,tolerance,i,j,mois,jour,"signe");
                  positionSigne+=30;
               }
               
               //maisons
               if (choix2transitsProgresseNatal.checked==true){
                  positionTransitee=positionMaisonNatal[j];
               }else if(choix2transitsProgresseProgresse.checked==true){
                  positionTransitee=positionMaisonProgresse[j]; 
                }
                  traiteTransitsprogresses(positionTransitante,positionTransitee,tolerance,i,j,mois,jour,"maison");
               
               //planètes
               if (i==j || j>9){
                    continue;
               } 
               if (choix2transitsProgresseProgresse.checked==true){
                  positionTransitee=positionPlanete[j];
               }else if (choix2transitsProgresseNatal.checked==true){
                  positionTransitee=positionNatal[j];
               }
                  traiteTransitsprogresses(positionTransitante,positionTransitee,tolerance,i,j,mois,jour,"planete");     
            }            
        }
     //incrémente d'1 jour
     traiteProgresse(1);
    }
 }
    if (choix2transitsProgresseProgresse.checked==true){
        var abc=" - "+labelsDroite[12]; // transits progressé/progressé "
    } else {
        var abc=" - " + labelsDroite[11]; //]transits progressé/natal " 
        }
    tableau.rows[0].cells[0].textContent=nomNatal + abc + anneeTransit.value;
   // titreCanvas.textContent="";
}


function traiteTransitsprogresses(transitante,transitee,tolerance,i,j,mois,jour,type){
    
var angle=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360];
var couleur=['blue','blue','red','blue','red','blue','red','blue','red','blue','red','blue','red','blue','red','blue','blue'];
    //pour réduire les boucles aspects en fonction de la division par 15 des longitudes (1er chiffre : 1er aspect, 2ème chiffre : dernier aspect à considérer)
var arc=[[0,0],[1,1],[1,2],[2,3],[3,3],[4,4],[4,4],[5,5],[5,6],[6,7],[7,7],[8,8],[8,8],[8,9],[9,10],[10,11],[11,11],[12,12],[12,12],[13,13],[13,14],[14,15],[15,15],[16,16],[0,0]];
var gap,   
    gapArc,
    aspect,
    signe,
    planete;

    gap=transitante-transitee;
    if (gap<0){
     gap+=360;
    }
    gapArc=Math.floor(gap/15);
    

 // uniquement les conjonctions pour signes et maisons 
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
                                feuilleEcritTransits(cellule,couleur[k],aspect+planete+"  "+String(jour));
                            }
               }else if (type=="maison"){
                    //exclusions : conjonction, carré et opposition seulement
                    /*if (k==1 || k==2 || k==3 || k==5 || k==6 || k==7 || k==9 || k==10 || k==11 || k==13 || k==14 || k==15){
                        continue;
                    }*/
                    var abc=tableau.rows[2].cells[i+1].textContent
                    if (abc.search(AtoR(j+1))==-1){
                        var cellule=tableau.rows[2].cells[i+1]
                       // cellule.style.font='16px serif';
                       // feuilleEcritTransits(cellule,'green',"Maison "+ AtoR(j+1) +" "+ String(jour) + "/" + mois);
                        feuilleEcritTransits(cellule,couleur[k],aspect+String(j+1) +"  "+ String(jour) + "/" + ajoutZero(String(mois)));
                    }
                //signes : a=97 à l=108
               }else if (type=="signe"){
                   signe=String.fromCharCode(97+j)
                   var abc=tableau.rows[3].cells[i+1].textContent
                    if (abc.search(signe)==-1){
                        var cellule=tableau.rows[3].cells[i+1];
                        feuilleEcritTransits(cellule,'green',aspect+signe +"  " + String(jour) + "/" + mois);
                   }
               }  
      }
    } 
  } 
}



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
