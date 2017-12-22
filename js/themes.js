
function calculEphemerides(date,heure){
    
    var reponse="non";
    var message="";
    var heuredecimale=Number(heure.split(':')[0])+ (Number(heure.split(':')[1])/60)-utc;
     //vérifie si format date correct (aaaa-mm-jj)
    if (date.split('-').length==3){
        //détermination du jour julien(les calculs se font à utc=0)
        heure=String(heure.split(":")[0]-utc)+":"+String(heure.split(":")[1]);
        var jj=calcJourJulien(date,heure);
        var an=date.split('-')[0];
        var mois=Number(date.split('-')[1]);
        var jour=Number(date.split('-')[2]);
        //Soleil
        var [lSol1,xs,ys]=soleil(Number(an),heuredecimale,jj);
        var [lSol2,xs,ys]=soleil(Number(an),heuredecimale,jj+1);
        positionPlanete[0]=lSol1;
        message="0 : "+String(positionPlanete[0])+"\n";
        ecartJour[0]=reboucle(lSol2-lSol1);
        //Lune à Neptune
        for (var i=1; i<=8; i++){
            var lPlan1=planetesCalc(Number(an),heuredecimale,jj,i);
            var lPlan2=planetesCalc(Number(an),heuredecimale,jj+1,i)
            positionPlanete[i]=lPlan1;
            message+=i + " : " +String(positionPlanete[i])+"\n";
            ecartJour[i]=reboucle(lPlan2-lPlan1);
            //rétograde si écart négatif
            retrograde[i]=0
            if (ecartJour[i]<0){retrograde[i]=1;}
        }
        //Pluton
            var lPlan1=pluton(Number(an),heuredecimale,jj);
            var lPlan2=pluton(Number(an),heuredecimale,jj+1);
            positionPlanete[9]=lPlan1;
            message+="9 : "+positionPlanete[9]+"\n";
            ecartJour[9]=reboucle(lPlan2-lPlan1);
            //rétograde si écart négatif
            retrograde[9]=0
            if (ecartJour[9]<0){retrograde[9]=1;}
        //nbre de jours depuis le 1/01/1900 (pour recherche dans éphémérides)
        var  refTime=new Date('1900-01-01');
        var endTime=new Date(date);
        var timeDiff = endTime - refTime;
        var daysDiff = timeDiff / (1000 * 60 * 60 * 24)+1;
        //NN
        rechercheEphemerides(daysDiff,heuredecimale,10);
        message+="10 : "+positionPlanete[10]+"\n";
        //NS
        var omega=positionPlanete[10]+180;
        positionPlanete[12]=reboucle360(omega);
        //Lilith
        rechercheEphemerides(daysDiff,heuredecimale,11);
        message+="11 : "+positionPlanete[11];
  //  console.log(message);
    reponse= "oui";        
  }
   return reponse;
}

 //NN Lilith************************************recherche dans éphémérides*************************
function rechercheEphemerides(jours,heuredecimale,i){
     
        jours=Math.round(jours);
                 //en-dehors plage éphémérides
                 if (jours<=0 || jours >= contenuEphemerides.length){
                    positionPlanete[i]=NaN;
                    ecartJour[i]=0;
                    retrograde[i]=0;
                 }
                 else {
                //jour j
                    let car=contenuEphemerides[jours].split(" ")[i-10];
                //jour j+1
                    let car2=contenuEphemerides[jours+1].split(" ")[i-10];
                //ecart journalier (ou annuel en progressé)
                    ecartJour[i]=Number(car2)-Number(car);
                    ecartJour[i]=reboucle(ecartJour[i]);
                //rétrograde si écart négatif
                    retrograde[i]=0;
                    if (ecartJour[i] <0){retrograde[i]=1;}
                //position planete à 0h UTC
                    positionPlanete[i]=Number(car);
                //position planete à heure réelle
                    positionPlanete[i]+=(ecartJour[i]*heuredecimale/24);
                }
}
 

//*************************************recherche Maisons*************************************************
function rechercheMaisons(heure,date){
//source : https://www.scribd.com/doc/6495552/An-Astrological-House-Formulary
    var heureSideraleNumerique,
        tempsSideral,
        heure0=Number(heure.split(':')[0])+ (Number(heure.split(':')[1])/60), //hh+mm en nombre décimal
        heureSideraleNumerique=siderale(heure0,longitude,date); //temps sidéral en nombre décimal (hh.mm) =valeur à ajouter ou retrancher à l'heure solaire
        
        
    var an=Number(date.split('-')[0]),
        mois=Number(date.split('-')[1]),
        jour=Number(date.split('-')[2]);
    var T=((an+((mois)*30.4375+jour)/365.25)-1900)/100,
        T2=T*T,
        T3=T2*T;
    /*calcul de l'obliquité : e = 23o 27' 08.26" - 46.845" x T - .0059" x T2 + .00181" x T3
    where T is in fractions of a century starting from Jan 1, 1900*/  
    var e=23+(27/60)+(8.26/3600)-(46.845/3600*T)-(0.0059/3600*T2)+(0.00181/3600*T3);  
     // e=23.4392911;
    //temps sidéral en degrés (15 deg/heure)
    var ramc=heureSideraleNumerique*15, 
        f=latitude;
     
     
     //AS
     var a1=Math.sin(Math.PI/180*ramc);
     var a2=Math.cos(Math.PI/180*e); 
     var a120=a1*a2;
     var b1=Math.tan(Math.PI/180*latitude);
     var b2=Math.sin(Math.PI/180*e);
     var b120=b1*b2;
     var x=a120+b120
     var y=-Math.cos(Math.PI/180*ramc);
     var AS=Math.atan2(y,x)*180/Math.PI;
        //correction
        AS=reboucle180(AS);
    //sauvegarde
     positionMaison[0]=AS;
     positionMaison[12]=AS;
     
     //MC
     y=Math.tan(Math.PI/180*ramc);
     x=Math.cos(Math.PI/180*e);
     var MC=Math.atan2(y,x)*180/Math.PI;
        //corrections
        if (ramc>90 && ramc<=270){MC+=180;}
        else if(ramc>270 && ramc<=360){MC+=360;}
     //sauvegarde
     MC=reboucle360(MC);
     positionMaison[9]=MC;
     
    //Maisons 11,12,2,3
    var p=[10,11,1,2,30,60,120,150,1/3,2/3,2/3,1/3];
    var d11;
    var a11,m11,r11,h11,b1,b2;
    for (var i=0; i<=3;i++){
            //cuspal declinations
            d11=Math.asin(Math.sin(Math.PI/180*e)*Math.sin(Math.PI/180*(ramc+p[i+4])))*180/Math.PI;
    
            //intermediate values
            b1=Math.tan(Math.PI/180*f);
            b2=Math.tan(Math.PI/180*d11);
            x=b1*b2;
            a11=p[i+8]*Math.asin(x)*180/Math.PI;

            h11=reboucle360(ramc+p[i+4]);
            b1=Math.cos(Math.PI/180*(h11));
            b2=Math.tan(Math.PI/180*d11);
            x=b1*b2;
            y=Math.sin(Math.PI/180*a11);            
            m11=Math.atan2(y,x)*180/Math.PI;

            y=Math.tan(Math.PI/180*(h11))*Math.cos(Math.PI/180*m11);
            x=Math.cos(Math.PI/180*(m11+e));          
            r11=Math.atan2(y,x)*180/Math.PI; 
            
            //corrections
            if (h11>=180){r11+=180;}
            r11=reboucle360(r11);
            //sauvegarde
            positionMaison[p[i]]=r11;
   }   
        
        //Maisons complémentaires 4,5,6,7,8,9
        var pos=[3,4,5,6,7,8];
        var offset=6;
        for (var j=0; j<6; j++){
            if (j>=3) {offset=-6;}   
            positionMaison[pos[j]]=positionMaison[pos[j]+offset]+180;
            if (positionMaison[pos[j]]>360){positionMaison[pos[j]]-=360;} 
        }
        if (checkMaisons.checked==true){asc=positionMaison[0];}
        else{asc=180;}
        
     //maisons habitées
     for (var i=0; i<=12;i++){
         planeteHabite[i]=100; //sert pour maisons interceptées
         for (var j=0; j<=11;j++){
            var k=j+1;
            if (k>11) k=0;
            var m1=positionMaison[j];
            var m2=positionMaison[k];
            //passage à 0 ?
            var [a1,a2,offset]= testBoucle(m1,m2);
            if ((positionPlanete[i]>a1 && positionPlanete[i]<a2) || (positionPlanete[i]+offset>a1 && positionPlanete[i]+offset<a2)){
                planeteHabite[i]=j;
                break;
            }
        }
     }
     
     //maisons gouvernées
        //signes en fonction des planètes; ex g[0]=soleil=4 (lion), g[2]=mercure=2 (gémeaux) et 5 (vierge)
        var g=[[4,4],[3,3],[2,5],[1,6],[0,7],[8,11],[9,10],[9,10],[8,11],[0,7]];
        planeteGouverne=[[],[],[],[],[],[],[],[],[],[]];
    for (var i=0; i<=11;i++){
         var a=convDegres(positionMaison[i]).signe;
         for (var j=0; j<=9;j++){
            if (a==g[j][0] || a==g[j][1]){
                var k=planeteGouverne[j].length;
                planeteGouverne[j][k]=i;
            }
        }
    }
    
    //maisons interceptées
    for (var i=0; i<=9;i++){
            var a=g[i].length;
            var b=planeteGouverne[i].length;
            for (var j=0;j<a;j++){
                var min=30*g[i][j]
                var max=min+30;
                for (var k=0;k<=11;k++){
                    var l=k+1;
                    if (l>11) l=0;
                    var m1=positionMaison[k];
                    var m2=positionMaison[l];
                        //passage à 0 ?
                        var [a1,a2,offset]= testBoucle(m1,m2);
                    if (a1<min && a2>max){
                        planeteGouverne[i][b]=k+100; //100 permet la détection pour écrire en mauve dans le tableau
                        break;
                    }
                } 
           }                
    }
}

function testBoucle(a1,a2){
    var offset=0;
    if (Math.abs(a1-a2)>300){
        offset=360;
        if (a1==Math.min(a1,a2)){a1+=360;}
        else {a2+=360}
    }
    return [a1,a2,offset];
}

function sauvePositionsMaisons(type){
    for (i=0;i<=12;i++){
        switch(type){
            case "natal":
                positionMaisonNatal[i]=positionMaison[i];
                break;
            case "progresse":
                positionMaisonProgresse[i]=positionMaison[i];
        }
    }
}

//*************************************sous-routines***************************************     
function siderale(heure,longitude,date){ 
   var  refTime=new Date('2000-01-01'),
        endTime=new Date(date),
        // intervalle en ms depuis ou avant le 1/1/2000
        timeDiff = endTime - refTime, 
        //conversion en jours (avec décimales)
        daysDiff = timeDiff / (1000 * 60 * 60 * 24),
        offsetSiderale;
    
    //ajout heure de naissance (-0.5 car référence greenwich prise à 12h)
    daysDiff+=((heure-utc)/24)-0.5;
    //calcul temps sidéral
    offsetSiderale=((daysDiff*24.065709824419)+18.697374558+(longitude/15))% 24; //%=modulo, 18.697=heure sidérale du 1/01/2000 à 12h TU
    if (offsetSiderale<0){offsetSiderale +=24;} 
    return offsetSiderale;
}  
 
function reboucle(valeur){
    if (valeur<-300){valeur+=360;}
    if (valeur>300){valeur-=360;} 
    return valeur;
}

function reboucle360(valeur){
    if (valeur<0){valeur+=360;}
    if (valeur>360){valeur-=360;} 
    return valeur;
}

function reboucle180(valeur){
    if (Number.isNaN(valeur)==false){
        if (valeur<180){valeur+=180;}
        else{valeur-=180;} 
    }else{console.log("erreur NaN ");}
    return valeur;
}

function updateProgressBar(indiceProgress){
    contenuProgress.value=indiceProgress;
    
}

//************************************progressé********************************************************
 function parametresProgresse(date,heure,datetransit,anneetransit){
    //determination de l'âge
    var refTime=new Date(date.slice(6,10),date.slice(3,5)-1,date.slice(0,2)), //date de naissance (aaaa,mm,jj)
        endTime=new Date(datetransit), // date affichée (aaaa-mm-jj)  
        timeDiff = endTime - refTime, // intervalle en ms
        daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); //intervalle en jours
            //année bissextile ? si oui ajout d'un jour sinon l'âge n'incrémente que le lendemain du jour anniversaire=>saut sur le théme progressé
            if (refTime.getUTCFullYear()%4==0){daysDiff+=1;}
    var age=Math.floor(daysDiff/365.25);
        
    //date anniversaire année transit
    refTime=new Date(anneetransit,date.slice(3,5)-1,date.slice(0,2));
    //2 méthodes concernant l'année progressée
        //méthode 1 : la ligne d'éphémérides commence au jour d'anniversaire de l'année progressée
    if (refTime>=endTime){
        refTime=new Date(anneetransit-1,date.slice(3,5)-1,date.slice(0,2));
    }
                //méthode 2 apparemment inexacte : la ligne d'éphémérides commence au 1er janvier de l'année progressée
                /* if (refTime>=endTime){
                    refTime=new Date(annee,0,1); //1er janvier
                }else{
                    refTime=new Date(annee,11,31); //31 décembre
                }*/
                
    timeDiff=endTime-refTime;
    //jours à ajouter ou retrancher(méthode 2 seulement) dans l'année progressée
    var joursProgresse=Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
        //jours à ajouter au jour anniversaire pour obtenir le 1er janvier de l'année progressée
        //attention, le changement d'âge fait avancer d'une ligne éphémérides
        var jours=Number(date.slice(0,2))+age; 
        //date à chercher dans les éphémérides (=1er janvier ou date anniversaire de l'année progressée ?)=date anniversaire + age exprimé en jours
        refTime=new Date(date.slice(6,10),date.slice(3,5)-1,String(jours+1));
        
     return [joursProgresse,refTime];
}

function rechercheThemeProgresse(date,heure,type){
    //récupère nombre de jours entre date anniversaire précédent et date en cours + date correspondant au 1er janvier de l'année progressée
    var [jours,date1Janvier]=parametresProgresse(date,heure,dateMaisons,annee) //dateMaisons sinon pb avec ancien format de date
    //récupère positions des planètes au 1er janvier de l'année progressée (avec date format string jj/mm/aaaa)
    var jour=date1Janvier.getUTCDate();
    var mois=date1Janvier.getUTCMonth() +1;
    var an=date1Janvier.getUTCFullYear();
    calculEphemerides(an+"-"+mois+"-"+jour,heure);
    
    var texte1=labelsDroite[16] //heure de naissance;
    if (heureNatal !==heure){
       texte1+=labelsDroite[17] //" modifiée ";
    }
   
    //positions planètes progressées au jour exact
    traiteProgresse(jours);
    
    //maisons natales
    if (choixProgresseNatal.checked==true){
        var type="natal";
        var texte2= "- "+labelsDroite[13]+" - " +labelsDroite[14];
        var dateMaisonsProgresse=dateNatal.slice(6,10) +"-"+dateNatal.slice(3,5)+"-"+dateNatal.slice(0,2);
    }
    //maisons progressées
    else if (choixProgresseNatal.checked==false || type=="progresse"){
       var dateMaisonsProgresse=String(date1Janvier.getUTCFullYear())+"-"+String(date1Janvier.getUTCMonth()+1)+"-"+String(date1Janvier.getUTCDate());
       var texte2= "- "+labelsDroite[13]+" - "+labelsDroite[15];
    }
    
    rechercheMaisons(choixHeure.value,dateMaisonsProgresse);
    sauvePositionsMaisons(type);   
    personne=nomNatal+texte2+datelongue(dateMaisons)+texte1+choixHeure.value +")";
}

function traiteProgresse(jours){
  for (var i=0; i<=9 ; i++){
    //ecartJour=écart annuel
    positionPlanete[i]=positionPlanete[i]+(jours*(ecartJour[i]/365)); //+(ecartJour[i]/720) ; 1/2jour  enlevé car décale les transits !
    if (positionPlanete[i]<0){positionPlanete[i]+=360;}
    if (positionPlanete[i]>360){positionPlanete[i]-=360;}     
  }
}

