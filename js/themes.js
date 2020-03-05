
function calcPositionsPlanetes(date,heure){
    
    var reponse="non, erreur de date",
        message="",
        heuredecimale=Number(heure.split(':')[0])+ (Number(heure.split(':')[1])/60)-utc,
        lPlan1,
        lPlan2;
        
     //équation du temps : adaptation heure progressée (ex thème perso sur echelle humaine : +19' en 2016 sur heure de naissance)
    if (checkEquationTemps.checked==true && checkEquationTemps.hidden==false){
        heure0ref=heuredecimale;
        equationProg="";
        heuredecimale+=equationTemps(date)-equationTemps(dateNatal);
        equationProg=String(Math.round((heuredecimale-heure0ref)*60)) + "'";
    }
    
    //vérifie si format date correct (aaaa-mm-jj)
    if (date.split('-').length!=3) return reponse
        //jour julien (les calculs se font à utc=0) 03/2019 : correction (-utc supprimé) sinon sauts lune entre 00:00 et 01:00
        var jj=calcJourJulien(date,heure);
        var an=date.split('-')[0];
        var mois=Number(date.split('-')[1]);
        var jour=Number(date.split('-')[2]);
    
    //détermination jour de l'an chinois (NL entre 21 janvier et 20 février)
    if (okTransits==0){
        var j1=21, m1=1;
        var jj1=calcJourJulien(an+"-01-21","00:00");
        var soleil,lune,jourAn,jourTheme;
        for (var i=0; i<=60; i++){
            [soleil,xs,ys]=calcSoleil(Number(an),heuredecimale,jj1);
            lune=calcPlanetes(Number(an),heuredecimale,jj1,1);
            if (Math.abs(soleil-lune)<=12) {
                jourAn=21+i;
                break;
            }
            jj1+=1;
        }
        anChinois=Number(an);
        jourTheme=100;
        if (mois==1) jourTheme=jour;
        else if (mois==2)jourTheme=31+jour;
        //avant jour de l'an chinois, signe de l'année précédente
        if (jourTheme <= jourAn) anChinois-=1;
    }  
        
        //Soleil
        var [lSol1,xs,ys]=calcSoleil(Number(an),heuredecimale,jj);
        var [lSol2,xs,ys]=calcSoleil(Number(an),heuredecimale,jj+1);
        positionPlanete[0]=lSol1;
        message="0 : "+String(positionPlanete[0])+"\n";
        ecartJour[0]=reboucle(lSol2-lSol1);
        retrograde[0]=0;
        //Lune à Neptune
        for (var i=1; i<=8; i++){
            lPlan1=calcPlanetes(Number(an),heuredecimale,jj,i);
            lPlan2=calcPlanetes(Number(an),heuredecimale,jj+1,i)
            positionPlanete[i]=lPlan1;
            message+=i + " : " +String(positionPlanete[i])+"\n";
            ecartJour[i]=reboucle(lPlan2-lPlan1);
            //rétrograde si écart négatif
            ecartJour[i]<0 ? retrograde[i]=1 : retrograde[i]=0;
        }
        //Pluton
            lPlan1=calcPluton(Number(an),heuredecimale,jj);
            lPlan2=calcPluton(Number(an),heuredecimale,jj+1);
            positionPlanete[9]=lPlan1;
            message+="9 : "+positionPlanete[9]+"\n";
            ecartJour[9]=reboucle(lPlan2-lPlan1);
            //rétrograde si écart négatif
            ecartJour[9]<0 ? retrograde[9]=1 : retrograde[9]=0;
        //NN et Lilith vrais
        for (var i=10; i<=11; i++){
            lPlan1=calcNNLilith(jj,i);
            lPlan2=calcNNLilith(jj+1,i);
            positionPlanete[i]=lPlan1;
            message+=i + " : "+positionPlanete[i]+"\n";
            ecartJour[i]=reboucle(lPlan2-lPlan1);
            //rétrograde si écart négatif
            ecartJour[i]<0 ? retrograde[i]=1 : retrograde[i]=0;
        }
        //NS
        var omega=positionPlanete[10]+180;
        positionPlanete[12]=reboucle360(omega);
        
        //obsolete nbre de jours depuis le 1/01/1800 (pour recherche dans éphémérides)
     /*   var refTime=new Date('1800-01-01');
        var endTime=new Date(date);
        var timeDiff = endTime - refTime;
        var daysDiff = timeDiff / (1000 * 60 * 60 * 24)+1;
        //il y a plus de 3 décimales à cause de la correction d'heure
        //Lilith
        positionPlanete[11]=rechercheEphemerides(daysDiff,heuredecimale,11);
        message+="11 : "+positionPlanete[11];*/
  //  console.log(message);
  
    reponse= "oui";        
    return reponse;
}


 //obsolete NN Lilith *********************************** recherche dans éphémérides *************************
 
function rechercheEphemerides(jours,heuredecimale,i){
        var position;
        jours=Math.round(jours);
                 //date en-dehors plage éphémérides
                    if (jours<=0 || jours+1 >= contenuEphemerides.length){
                        position=NaN;
                        ecartJour[i]=0;
                        retrograde[i]=0;
                        return position;
                    }
                    
            //version plusieurs colonnes
                //recherche du séparateur dans la ligne : espace ou tabulation
                 /*   var a=[" ","\t"];
                    var x,separateur;
                    for (var j=0;j<a.length;j++){
                        x=contenuEphemerides[jours].search(a[j]); 
                        if (x>0) {
                            separateur=a[j];
                            break;
                        }
                    }
                //séparateur inconnu, sortie
                    if (x==-1){
                        position=NaN;
                        ecartJour[j]=0;
                        retrograde[j]=0;
                        return position;
                    }
                //jour j
                    let car=contenuEphemerides[jours].split(separateur)[i-10]; //NN i=11, Lilith i=10
                //jour j+1
                    let car2=contenuEphemerides[jours+1].split(separateur)[i-10]; */
                 
            //version une seule colonne
                    //jour j
                    let car=contenuEphemerides[jours]; //Lilith i=11
                //jour j+1
                    let car2=contenuEphemerides[jours+1];
                    
            //tronc commun
                //ecart journalier (ou annuel en progressé)
                    ecartJour[i]=Number(car2)-Number(car);
                    ecartJour[i]=reboucle(ecartJour[i]);
                //rétrograde si écart négatif
                    ecartJour[i]<0 ? retrograde[i]=1 : retrograde[i]=0;
                //position planete à 0h UTC
                    position=Number(car);
                //position planete à heure réelle
                    position+=(ecartJour[i]*heuredecimale/24);
                    
                    return position;
}
 

//************************************ recherche Maisons *************************************************
//source : https://www.scribd.com/doc/6495552/An-Astrological-House-Formulary
function calcPositionsMaisons(heure,date,jours,traite){ //traite=traite maisons progressées
    var heureSideraleNumerique,
        tempsSideral,
        heure0ref,
        heure0=Number(heure.split(':')[0])+ (Number(heure.split(':')[1])/60); //hh+mm en nombre décimal
        
    //équation du temps : adaptation heure progressée (ex thème perso sur echelle humaine : +19' en 2016 sur heure de naissance)
    if (jours>=0 && checkEquationTemps.checked==true && checkMaisonsNatales.checked==false){
        heure0ref=heure0;
        equationProg="";
        heure0+=equationTemps(date)-equationTemps(dateNatal);  //heure0+=age*0.30645/60;
        if (traite) equationProg=String(Math.round((heure0-heure0ref)*60)) + "'"
    }
                                   
    heureSideraleNumerique=siderale(heure0,longitude,date); //temps sidéral en nombre décimal (hh.mm) =valeur à ajouter ou retrancher à l'heure solaire
        
    var an=Number(date.split('-')[0]),
        mois=Number(date.split('-')[1]),
        jour=Number(date.split('-')[2]);
    var T=((an+(mois*30.4375+jour)/365.25)-1900)/100,
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
        //ecart annuel en progressé, pas utilisé en natal
        ecartProg=reboucle360(positionMaison[0]-AS);
        //sauvegarde
        positionMaison[0]=AS;
        positionMaison[12]=AS;
        positionPlanete[13]=AS;
        //sortie si 1er passage en progressé (pour déterminer l'écart ascendant sur 1 an) 
        if (jours>=0 && !traite)return;
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
     positionPlanete[14]=MC;
     
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
       
    
   //calcule position Maisons Progressées au jour exact
    if (traite){
        for (i=0; i<=12 ; i++){
            //ecartProg=écart annuel
            positionMaison[i]=positionMaison[i]+(jours*ecartProg/365);
            positionMaison[i]=reboucle360(positionMaison[i]);
        }
   }
   
    //ascendant
    checkMaisons.checked==true ? asc=positionMaison[0] : asc=180;
        
     //maisons habitées
    var k,
        m1,
        m2;

     for (i=0; i<=12;i++){
         planeteHabite[i]=100; //sert pour maisons interceptées
         for (j=0; j<=11;j++){
            k=j+1;
            if (k>11) k=0;
            m1=positionMaison[j];
            m2=positionMaison[k];
            //passage à 0 ?
            [a1,a2,offset]= testBoucle(m1,m2);
            if ((positionPlanete[i]>a1 && positionPlanete[i]<a2) || (positionPlanete[i]+offset>a1 && positionPlanete[i]+offset<a2)){
                planeteHabite[i]=j;
                break;
            }
        }
     }
     
     //maisons gouvernées
     //signes en fonction des planètes; ex g[0]=soleil=4 (lion), g[2]=mercure=2 (gémeaux) et 5 (vierge)
    var g=[[4,4],[3,3],[2,5],[1,6],[0,7],[8,11],[9,10],[9,10],[8,11],[0,7]];
    var a;
    planeteGouverne=[[],[],[],[],[],[],[],[],[],[]]; //définie en global
    for (i=0; i<=11;i++){
        a=convPositiontoDegres(positionMaison[i]).signe;
        for (j=0; j<=9;j++){
            if (a==g[j][0] || a==g[j][1]){
                k=planeteGouverne[j].length;
                planeteGouverne[j][k]=i;
            }
        }
    }
    
    //maisons interceptées
    var b,
        min,
        max,
        l;
    for (i=0; i<=9;i++){
        a=2;
        if (i<=1){a=1}; //évite doublons pour soleil et lune
        b=planeteGouverne[i].length;
        for (j=0;j<a;j++){
            min=30*g[i][j];
            max=min+30;
            for (k=0;k<=11;k++){
                l=k+1;
                if (l>11) l=0;
                m1=positionMaison[k];
                m2=positionMaison[l];
                //passage à 0 ?
                [a1,a2,offset]= testBoucle(m1,m2);
                if ((a1<min && a2>max) || (a1<min+offset && a2>max+offset)){
                    planeteGouverne[i][b]=k+100; //100 permet la détection pour écrire en mauve dans le tableau
                    b+=1; //plusieurs maisons interceptées possibles
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
        a1==Math.min(a1,a2) ? a1+=360 : a2+=360;
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
                if (i==0) positionPlanete[13]=positionMaison[0];//AS
                if (i==9) positionPlanete[14]=positionMaison[9];//MC
        }
    }
}

//************************************ sous-routines ***************************************    

function siderale(heure,longitude,date){ 
   var  refTime=new Date('2000-01-01'),
        endTime=new Date(date),
        // intervalle en ms depuis ou avant le 1/1/2000
        timeDiff = endTime - refTime, 
        //conversion en jours (avec décimales)
        daysDiff = timeDiff / (1000 * 60 * 60 * 24),
        offsetSiderale;
    //ajout heure de naissance et -0.5 car référence greenwich prise à 12h
    daysDiff+=((heure-utc)/24)-0.5;
    //calcul temps sidéral
    offsetSiderale=((daysDiff*24.065709824419)+18.697374558+(longitude/15))% 24; //%=modulo, 18.697=heure sidérale du 1/01/2000 à 12h TU
    if (offsetSiderale<0){offsetSiderale +=24} 
    return offsetSiderale;
}  
 
function reboucle(valeur){
    if (valeur<-300){valeur+=360}
    if (valeur>300){valeur-=360} 
    return valeur;
}

function reboucle360(valeur){
    if (valeur<0){valeur+=360}
    if (valeur>360){valeur-=360} 
    return valeur;
}

function reboucle180(valeur){
    if (Number.isNaN(valeur)==false){
        valeur<180 ? valeur+=180 : valeur-=180; 
    }else{console.log("erreur NaN ");}
    return valeur;
}

//*********************************** progressé ********************************************************

function parametresProgresse(date,heure,datetransit,anneetransit){
     //2 formats de date : new Date("aaaa-mm-jj") ou new Date("aaaa","m-1","j+1")
    //determination de l'âge
    var refTime=new Date(date.slice(6,10)+"-"+date.slice(3,5)+"-"+date.slice(0,2)),//date de naissance (aaaa,mm,jj)
        endTime=new Date(datetransit), // date affichée (aaaa-mm-jj)  
        timeDiff = endTime - refTime, // intervalle en ms
        daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); //intervalle en jours
    var age=Math.trunc(daysDiff/365.25); //partie entière
        
    //date anniversaire année transit
    refTime=new Date(anneetransit+"-"+date.slice(3,5)+"-"+date.slice(0,2));
    //la ligne d'éphémérides commence au jour d'anniversaire de l'année progressée
    if (refTime>=endTime){
        refTime=new Date(anneetransit-1+"-"+date.slice(3,5)+"-"+date.slice(0,2));
    }
    timeDiff=endTime-refTime;
    //jours à ajouter ou retrancher dans l'année progressée
    var joursProgresse=Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    //si besoin, ajout d'un an au jour anniversaire sinon l'âge ne s'incrémente que le lendemain => saut sur le théme progressé
    if (joursProgresse==0 && daysDiff/365.25-age > 0.9)joursProgresse=365;
    
        //jours à ajouter au jour anniversaire pour obtenir le 1er janvier de l'année progressée
        //attention, le changement d'âge fait avancer d'une ligne éphémérides
        var jours=Number(date.slice(0,2))+age; 
        //date à chercher dans les éphémérides (1er janvier de l'année progressée) =date anniversaire + age exprimé en jours
        refTime=new Date(date.slice(6,10),date.slice(3,5)-1,String(jours+1));
        
     return [joursProgresse,refTime];
}

function rechercheThemeProgresse(date,heure){
    //récupère nombre de jours entre date anniversaire précédent et date en cours + date correspondant au 1er janvier de l'année progressée
    var [jours,date1Janvier]=parametresProgresse(date,heure,dateMaisons,annee) //dateMaisons sinon pb avec ancien format de date
    //récupère positions des planètes au 1er janvier de l'année progressée (avec date format string jj/mm/aaaa)
    var jour=ajoutZero(String(date1Janvier.getUTCDate()));
    var mois=ajoutZero(String(date1Janvier.getUTCMonth() +1));
    var an=String(date1Janvier.getUTCFullYear());
    calcPositionsPlanetes(an + "-" + mois + "-" + jour,heure);
    //positions planètes et maisons progressées au jour exact
    traitePlaneteProgresse(jours);
    
    var texte1=labelsDroite[16] //heure de naissance;
    if (heureNatal !==heure){
       texte1+=labelsDroite[17] //" modifiée ";
    }
    
    //maisons natales
    if (checkMaisonsNatales.checked==true){
        jours=0; //pas de correction heure progressée (equation du temps)
        var type="natal";
        var texte2= " - "+labelsDroite[13]+" - " +labelsDroite[14];
        var dateMaisonsProgresse=dateNatal.slice(6,10) +"-"+dateNatal.slice(3,5)+"-"+dateNatal.slice(0,2);
    }
    //maisons progressées
    else {
        var type="progresse";
        var dateMaisonsProgresse=String(date1Janvier.getUTCFullYear())+"-"+ajoutZero(String(date1Janvier.getUTCMonth()+1))+"-"+ajoutZero(String(date1Janvier.getUTCDate()));
        //recherche position ascendant à an+1 pour déterminer l'écart annuel ecartProg
        ascProgPlus1(choixHeure.value,date1Janvier,jours);

        var texte2= " - "+labelsDroite[13]+" - "+labelsDroite[15];
    }
    //laisser ici, valable aussi pour maisons natales
    calcPositionsMaisons(choixHeure.value,dateMaisonsProgresse,jours,1); //1=traite maisons progressées jour par jour avec ecartProg
    sauvePositionsMaisons(type);  
    //titre
    titreTheme=nomNatal+texte2+dateLongue(dateMaisons)+texte1+choixHeure.value +")";
     if (checkEquationTemps.checked==true){
            titreTheme+=" ("+labelsCentre[15]+ " : "+equationProg+")";
        }
}

function traitePlaneteProgresse(jours){
    for (var i=0; i<=11 ; i++){
        //ecartJour=écart annuel
        positionPlanete[i]=positionPlanete[i]+(jours*(ecartJour[i]/365)); //+(ecartJour[i]/720) ; 1/2jour enlevé car décale les transits !
        if (positionPlanete[i]<0){positionPlanete[i]+=360;}
        if (positionPlanete[i]>360){positionPlanete[i]-=360;} 
    }
}

function ascProgPlus1(heure,date,jours){
    //recherche position ascendant à an+1 pour déterminer l'écart annuel ecartProg
    var date1=new Date(String(date.getUTCFullYear()),String(date.getUTCMonth()),String(date.getUTCDate()+2));
    var dateMaisonsProgressePlus1=String(date1.getUTCFullYear())+"-"+ajoutZero(String(date1.getUTCMonth()+1))+"-"+ajoutZero(String(date1.getUTCDate()));
    calcPositionsMaisons(heure,dateMaisonsProgressePlus1,jours);
}
