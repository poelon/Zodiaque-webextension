
//----------------------------/source : http://pgj.pagesperso-orange.fr/position-planetes.htm----------------------------------

function tronque(x) {
if (x>0.0) return Math.floor(x);
else return Math.ceil(x);
}


//date="aaaa-mm-jj", heure="hh:mm"
function calcJourJulien(date,heure0){
    var ggg,jd,s,a,j1,j2,jd1,jd2dat1,jj,y;

    var annee=Number(date.split("-")[0]);
    var mois=Number(date.split("-")[1]);
    var jour=Number(date.split("-")[2]);
    
    var heure=Number(heure0.split(":")[0]);
    var minute=Number(heure0.split(":")[1]);
    var seconde=0;

    var heure1 = heure + (minute / 60) +(seconde / 3600)//- utc; (pb de sauts quand heure < utc + Lilith décalée aussi)
    ggg = 1;
    if (mois>2) y = annee;
    else y = annee - 1;
        
    if( annee < 1582 ) ggg = 0;
    if( annee < 1582 && mois < 10 ) ggg = 0;
    if( annee <= 1582 && mois == 10 && jour < 5 ) ggg = 0;

    jd = - 1 * tronque(7 * (tronque((mois + 9) / 12) + annee) / 4);
    s = 1
    if ((mois - 9) < 0) s = - 1;
    a = Math.abs(mois - 9);
    j1 = tronque(y + s * tronque(a / 7));
    j2 = - 1 * tronque(((tronque(j1 / 100) + 1) * 3 / 4));
    jd1 = jd + tronque((275 * mois / 9) + jour + (ggg * j2));
    jd2dat1 = jd1 + 1721027 + 2 * ggg + 367 * annee - 0.5 ;
    jj = jd2dat1 + (heure1 / 24);

    return jj;
}

//------------------ source : http://michel.lalos.free.fr/cadrans_solaires/outils_gno/eqt_complements.html -------------

function equationTemps(date){
    var an,
        mois,
        j,
        joursmois=[31,28,31,30,31,30,31,31,30,31,30,31];
        
    //teste format date car date natal="jj/mm/aaa" et date progressée = "aaaa-mm-jj" !
        if (date.search("-") >0) {
            an=Number(date.split("-")[0]);
            mois=Number(date.split("-")[1]);
            j=Number(date.split("-")[2]);
        }
        else if (date.search("/") >0) {
            an=Number(date.split("/")[2]);
            mois=Number(date.split("/")[1]);
            j=Number(date.split("/")[0]);
        }
    //année bissextile
    if (an%4 ==0 && an!=1900){
        joursmois[1]=29;
    }  
    if (mois >1){
        for (var i=0;i<mois-1;i++){
            j+=joursmois[i];
        }
    }
    var M = reboucle360(357.5291 + (0.98560028 * j));
        M = reboucle360(M%360);
    var C = (1.9148 * Math.sin(M/r2d)) + (0.02 * Math.sin(2*M/r2d)) + (0.0003 * Math.sin(3*M/r2d));
    var L = 280.4665 + C + (0.98564736 * j);
        L = reboucle360(L%360);
    var R = (-2.468 * Math.sin(2*L/r2d)) + (0.053 * Math.sin(4*L/r2d)) - (0.0014 * Math.sin(6*L/r2d));
    var temps = (C + R) * 4;
  //  console.log ("C = " + C + " R = "+R+" temps = "+temps+ " degrés = "+deg);
    return temps/60;
    
                    /*   Les unités des quantités M, C, L et R sont le degré.
                    M = 357.5291 + 0,98560028 x j
                    C = 1,9148 x sin(M) + 0,02 x sin(2M) + 0,0003 x sin(3M)
                    L = 280.4665 + C + 0,98564736 x j
                    R = -2,468 x sin(2L) + 0,053 x sin(4L) - 0,0014 x sin(6L)

                    Equation du Temps (en minutes) = (C + R) x 4

                    j représente le rang du jour dans l'année (1er janvier = 1)
                    M est l'anomalie moyenne en degrés
                    C est l'équation du centre (influence de l'ellipticité de l'orbite terrestre) en degrés
                    L est la longitude vraie du Soleil en degrés
                    R est la réduction à l'équateur (influence de l'inclinaison de l'axe terrestre) en degrés */
}

//---------------------- source : http://www.stjarnhimlen.se/comp/ppcomp.html ou tutorial.html -------------------------

var Mso,Lso,Mm,Lm,Nm;
function orbitParams(d,planete){
    //N-noeud,i-inclinaison,w-agument du periastre,a-axe semi-hauteur,e-excentricité,M-anomalie moyenne,E-anomalie excentrique
    var N,i,w,a,e,M,E;
    switch(planete){
    case 0:
        //Orbital elements of the Sun:
        N = 0.0;
        i = 0.0;
        w = 282.9404 + 4.70935E-5 * d;
        a = 1.000000; //  (AU)
        e = 0.016709 - 1.151E-9 * d;
        M = 356.0470 + 0.9856002585 * d;
     break;
     case 1:
        //Orbital elements of the Moon:
        N = 125.1228 - 0.0529538083 * d;
        i = 5.1454;
        w = 318.0634 + 0.1643573223 * d;
        a = 60.2666;
        e = 0.054900;
        M = 115.3654 + 13.0649929509 * d;
        Mm=reboucle360(M %360);
        Lm=reboucle360((N+w+M) %360);
        Nm=reboucle360(N %360);
     break;
     case 2:
       // Orbital elements of Mercury:
        N =  48.3313 + 3.24587E-5 * d;
        i = 7.0047 + 5.00E-8 * d;
        w =  29.1241 + 1.01444E-5 * d;
        a = 0.387098
        e = 0.205635 + 5.59E-10 * d;
        M = 168.6562 + 4.0923344368 * d;
     break;
     case 3:
        //Orbital elements of Venus:
        N =  76.6799 + 2.46590E-5 * d;
        i = 3.3946 + 2.75E-8 * d;
        w =  54.8910 + 1.38374E-5 * d;
        a = 0.723330;
        e = 0.006773 - 1.302E-9 * d;
        M =  48.0052 + 1.6021302244 * d;
     break;
     case 4:
        //Orbital elements of Mars:
        N =  49.5574 + 2.11081E-5 * d;
        i = 1.8497 - 1.78E-8 * d;
        w = 286.5016 + 2.92961E-5 * d;
        a = 1.523688;
        e = 0.093405 + 2.516E-9 * d;
        M =  18.6021 + 0.5240207766 * d;
     break;
     case 5:
        //Orbital elements of Jupiter:
        N = 100.4542 + 2.76854E-5 * d;
        i = 1.3030 - 1.557E-7 * d;
        w = 273.8777 + 1.64505E-5 * d;
        a = 5.20256;
        e = 0.048498 + 4.469E-9 * d;
        M =  19.8950 + 0.0830853001 * d;
     break;
     case 6:
        //Orbital elements of Saturn:
        N = 113.6634 + 2.38980E-5 * d;
        i = 2.4886 - 1.081E-7 * d;
        w = 339.3939 + 2.97661E-5 * d;
        a = 9.55475;
        e = 0.055546 - 9.499E-9 * d;
        M = 316.9670 + 0.0334442282 * d;
     break;
     case 7:
        //Orbital elements of Uranus:
        N =  74.0005 + 1.3978E-5 * d;
        i = 0.7733 + 1.9E-8 * d;
        w =  96.6612 + 3.0565E-5 * d;
        a = 19.18171 - 1.55E-8 * d;
        e = 0.047318 + 7.45E-9 * d;
        M = 142.5905 + 0.011725806 * d;
     break;
     case 8:
        //Orbital elements of Neptune:
        N = 131.7806 + 3.0173E-5 * d;
        i = 1.7700 - 2.55E-7 * d;
        w = 272.8461 - 6.027E-6 * d;
        a = 30.05826 + 3.313E-8 * d;
        e = 0.008606 + 2.15E-9 * d;
        M = 260.2471 + 0.005995147 * d;
     break;
    }
    return [N,i,w,a,e,reboucle360(M%360)];
}

function perturbations(planete,d){
    var Mj = (19.8950 + 0.0830853001 * d)/r2d;
    var Ms = (316.9670 + 0.0334442282 * d)/r2d;
    var Mu = (142.5905 + 0.011725806 * d)/r2d;
    var plo=0;//laisser à 0 sinon retour de valeurs indéfinies
    var pla=0;
    var pr=0;

    switch(planete){
    case 1:
        //Moon's mean elongation
        var D=Lm-Lso;
        //Moon's argument of latitude
        var F=Lm-Nm;
        plo= -1.274 * Math.sin(Mm/r2d - 2*D/r2d)//    (Evection)
        +0.658 * Math.sin(2*D/r2d)//         (Variation)
        -0.186 * Math.sin(Mso/r2d) //         (Yearly equation)
        -0.059 * Math.sin(2*Mm/r2d - 2*D/r2d)
        -0.057 * Math.sin(Mm/r2d - 2*D/r2d + Mso/r2d)
        +0.053 * Math.sin(Mm/r2d + 2*D/r2d)
        +0.046 * Math.sin(2*D/r2d - Mso/r2d)
        +0.041 * Math.sin(Mm/r2d - Mso/r2d)
        -0.035 * Math.sin(D/r2d) //           (Parallactic equation)
        -0.031 * Math.sin(Mm/r2d + Mso/r2d)
        -0.015 * Math.sin(2*F/r2d - 2*D/r2d)
        +0.011 * Math.sin(Mm/r2d - 4*D/r2d);
        
        pla= -0.173 * Math.sin(F/r2d - 2*D/r2d)
        -0.055 * Math.sin(Mm/r2d - F/r2d - 2*D/r2d)
        -0.046 * Math.sin(Mm/r2d + F/r2d - 2*D/r2d)
        +0.033 * Math.sin(F/r2d + 2*D/r2d)
        +0.017 * Math.sin(2*Mm/r2d + F/r2d);
    break;
    //Perturbations for Jupiter Add these terms to the longitude:
    case 5:
        plo= -0.332 * Math.sin(2*Mj - 5*Ms - 67.6/r2d)
        -0.056 * Math.sin(2*Mj - 2*Ms + 21/r2d)
        +0.042 * Math.sin(3*Mj - 5*Ms + 21/r2d)
        -0.036 * Math.sin(Mj - 2*Ms)
        +0.022 * Math.cos(Mj - Ms)
        +0.023 * Math.sin(2*Mj - 3*Ms + 52/r2d)
        -0.016 * Math.sin(Mj - 5*Ms - 69/r2d);
    break;
    //Perturbations for Saturn. Add these terms to the longitude:
    case 6:
        plo= 0.812 * Math.sin(2*Mj - 5*Ms - 67.6 /r2d)
        -0.229 * Math.cos(2*Mj - 4*Ms - 2 /r2d)
        +0.119 * Math.sin(Mj - 2*Ms - 3 /r2d)
        +0.046 * Math.sin(2*Mj - 6*Ms - 69 /r2d)
        +0.014 * Math.sin(Mj - 3*Ms + 32 /r2d);
        //For Saturn: also add these terms to the latitude:
        pla= -0.020 * Math.cos(2*Mj - 4*Ms - 2 /r2d)
        +0.018 * Math.sin(2*Mj - 6*Ms - 49 /r2d);
    break;
    //Perturbations for Uranus: Add these terms to the longitude:
    case 7:
        plo= 0.040 * Math.sin(Ms - 2*Mu + 6 /r2d)
        +0.035 * Math.sin(Ms - 3*Mu + 33 /r2d)
        -0.015 * Math.sin(Mj - Mu + 20 /r2d);
    break;
    } 
    return [plo,pla,pr];
}

function calcPlanetes(y,h,jj,planete){
    //jours depuis le 1/1/2000 0:0
    var d=jj - 2451544;
    d =Math.round(d)+h/24.0;
     //soleil
        var [N,i,w,a,e,M]=orbitParams(d,0);
        Mso=reboucle360(M%360);
        Lso=reboucle360((w+M)%360);
    //Orbital elements
        [N,i,w,a,e,M]=orbitParams(d,planete);
    //E : anomalie excentrique
        var E;
        E = M + e*r2d * Math.sin(M/r2d) * ( 1.0 + e * Math.cos(M/r2d) );
    //Kepler
        var E0=E;
        var deltaE=1;
        while (Math.abs(deltaE)>1.0E-5){
            E = E0 - ( E0 - (e*r2d) *  Math.sin(E0/r2d) - M ) / ( 1 - e *  Math.cos(E0/r2d) )
            deltaE=E-E0;
            E0=E;    
        };
    //planet's distance 
        var xv = a * ( Math.cos(E/r2d) - e );
        var yv = a * ( Math.sqrt(1.0 - e*e) * Math.sin(E/r2d) );
        var r = Math.sqrt( xv*xv + yv*yv );
    //true anomaly:
        var v = Math.atan2( yv, xv );
    //heliocentric ecliptic sauf lune geocentric
        var xh = r * ( (Math.cos(N/r2d) * Math.cos(v+(w/r2d))) - (Math.sin(N/r2d) * Math.sin(v+(w/r2d)) * Math.cos(i/r2d)) );
        var yh = r * ( (Math.sin(N/r2d) * Math.cos(v+(w/r2d))) + (Math.cos(N/r2d) * Math.sin(v+(w/r2d)) * Math.cos(i/r2d)) );
        var zh = r * ( Math.sin(v+(w/r2d)) * Math.sin(i/r2d) );
    //ecliptic longitude and latitude (heliocentric sauf lune geocentric)
        var lonecl = Math.atan2( yh, xh )*r2d;
        var latecl = Math.atan2( zh, Math.sqrt(xh*xh+yh*yh) )*r2d;
    //precession
        var lon_corr = 3.82394E-5 * ( 365.2422 * ( y - 2000.0 ) - d );
        lonecl+=lon_corr;
    //perturbations (lune,jupiter,saturne,uranus)
        var [plo,pla,pr]=perturbations(planete,d);
        lonecl+=plo;
        latecl+=pla;
    //perturbed heliocentric ecliptic
        xh = r * Math.cos(lonecl/r2d) * Math.cos(latecl/r2d);
        yh = r * Math.sin(lonecl/r2d) * Math.cos(latecl/r2d);
        zh = r * Math.sin(latecl/r2d);
    //geocentric ecliptic
        var [lonsun,xs,ys]=calcSoleil(y,h,jj);
        var xg = xh + xs;
        var yg = yh + ys;
        var zg = zh;
    //longitude géocentrique
        var l=reboucle360(Math.atan2(yg,xg)*r2d);
        var n3=reboucle360((l-w-v*r2d)%360);
        if (planete==1){l=reboucle360(lonecl%360);}
    //correction topocentrique : négligeable !
        var ppar = (8.794/3600) / r;
        l = l - ppar * Math.cos(l/r2d);
    return reboucle360(l);
}

function calcSoleil(Epoch,UT,jj){
    var d=Math.round(jj - 2451544)+UT/24.0;
    var [N,i,w,a,e,M]=orbitParams(d,0);
    //anomalie excentrique
        var E = M + e*r2d * Math.sin(M/r2d) * ( 1.0 + e * Math.cos(M/r2d) );
        var xv = Math.cos(E/r2d) - e;
        var yv = Math.sqrt(1.0 - e*e) * Math.sin(E/r2d);
        var v = Math.atan2( yv, xv );
        var rs = Math.sqrt( xv*xv + yv*yv );
    //longitude vraie
        var lonsun = reboucle360((v*r2d + w)%360);
    //precession (sauf lune)
        var lon_corr = 3.82394E-5 * ( 365.2422 * ( Epoch - 2000.0 ) - d );
    //    if (planete !=1) {lonsun+=lon_corr;}
        lonsun+=lon_corr;
        var xs = rs * Math.cos(lonsun/r2d);
        var ys = rs * Math.sin(lonsun/r2d);
    return [reboucle360(lonsun),xs,ys];
}

//valide d'environ 1800 à environ 2100
function calcPluton(Epoch,UT,jj){
    var d=jj - 2451544;
    d = Math.round(d) + UT/24.0;
    //corrections
    var S  =   50.03  +  0.033459652 * d;
    S=S/r2d;
    var P  =  238.95  +  0.003968789 * d;
    P=P/r2d;
    var lonecl = 238.9508  +  0.00400703 * d
            - 19.799 * Math.sin(P)      + 19.848 *  Math.cos(P)
             + 0.897 *  Math.sin(2*P)    - 4.956 *  Math.cos(2*P)
             + 0.610 *  Math.sin(3*P)    + 1.211 *  Math.cos(3*P)
             - 0.341 *  Math.sin(4*P)    - 0.190 *  Math.cos(4*P)
             + 0.128 *  Math.sin(5*P)    - 0.034 *  Math.cos(5*P)
             - 0.038 *  Math.sin(6*P)    + 0.031 *  Math.cos(6*P)
             + 0.020 *  Math.sin(S-P)    - 0.010 *  Math.cos(S-P);
             
    var latecl =  -3.9082
             - 5.453 *  Math.sin(P)     - 14.975 *  Math.cos(P)
             + 3.527 *  Math.sin(2*P)    + 1.673 *  Math.cos(2*P)
             - 1.051 *  Math.sin(3*P)    + 0.328 *  Math.cos(3*P)
             + 0.179 *  Math.sin(4*P)    - 0.292 *  Math.cos(4*P)
             + 0.019 *  Math.sin(5*P)    + 0.100 *  Math.cos(5*P)
             - 0.031 *  Math.sin(6*P)    - 0.026 *  Math.cos(6*P)
                                   + 0.011 *  Math.cos(S-P);
    var r    =  40.72
            + 6.68 *  Math.sin(P)       + 6.90 *  Math.cos(P)
            - 1.18 *  Math.sin(2*P)     - 0.03 *  Math.cos(2*P)
            + 0.15 *  Math.sin(3*P)     - 0.14 *  Math.cos(3*P);
    
    //heliocentric ecliptic
        var xh = r * Math.cos(lonecl/r2d) * Math.cos(latecl/r2d);
        var yh = r * Math.sin(lonecl/r2d) * Math.cos(latecl/r2d);
        var zh = r * Math.sin(latecl/r2d);
    //geocentric ecliptic
        var [lonsun,xs,ys]=calcSoleil(Epoch,UT,jj);
        var xg = xh + xs;
        var yg = yh + ys;
        var zg = zh;
    //longitude
        var l=reboucle360(Math.atan2(yg,xg)*r2d);
    return l;
}


//.......Noeud lunaire et Lilith vrais

//source : https://fr.mathworks.com/matlabcentral/fileexchange/39130-orbital-elements-of-the-moon
//fichier elp2000.m

function calcNNLilith(jj,planete){
    var dtr = Math.PI / 180;
    var t = (jj - 2451545 - utc/24) / 36525;  //ajouté : - utc/24: meilleure précision

    var t2 = t * t;
    var t3 = t * t2;
    var t4 = t * t3;
    var t5 = t * t4;

    var t2e4 = t2 * 1e-4; //=t2E-4
    var t3e6 = t3 * 1e-6;
    var t4e8 = t4 * 1e-8;
    
 switch(planete){
       
     //NN vrai
      case 10:
// longitude of the ascending node

    var sr = - 1.4979 * Math.sin(dtr * (49.1562 - 75869.8120 * t + 35.458 * t2e4
    + 4.231 * t3e6 - 2.001 * t4e8))
    - 0.1500 * Math.sin(dtr * (357.5291 + 35999.0503 * t - 1.536 * t2e4
    + 0.041 * t3e6 + 0.000 * t4e8))
    - 0.1226 * Math.sin(dtr * (235.7004 + 890534.2230 * t - 32.601 * t2e4
    + 3.664 * t3e6 - 1.769 * t4e8))
    + 0.1176 * Math.sin(dtr * (186.5442 + 966404.0351 * t - 68.058 * t2e4
    - 0.567 * t3e6 + 0.232 * t4e8))
    - 0.0801 * Math.sin(dtr * (83.3826 - 12006.2998 * t + 247.999 * t2e4
    + 29.262 * t3e6 - 13.826 * t4e8))
    - 0.0616 * Math.sin(dtr * (51.6271 - 111868.8623 * t + 36.994 * t2e4
    + 4.190 * t3e6 - 2.001 * t4e8))
    + 0.0490 * Math.sin(dtr * (100.7370 + 413335.3554 * t - 122.571 * t2e4
    - 10.684 * t3e6 + 5.028 * t4e8))
    + 0.0409 * Math.sin(dtr * (308.4192 - 489205.1674 * t + 158.029 * t2e4
    + 14.915 * t3e6 - 7.029 * t4e8))
    + 0.0327 * Math.sin(dtr * (134.9634 + 477198.8676 * t + 89.970 * t2e4
    + 14.348 * t3e6 - 6.797 * t4e8))
    + 0.0324 * Math.sin(dtr * (46.6853 - 39870.7617 * t + 33.922 * t2e4
    + 4.272 * t3e6 - 2.001 * t4e8))
    + 0.0196 * Math.sin(dtr * (98.3124 - 151739.6240 * t + 70.916 * t2e4
    + 8.462 * t3e6 - 4.001 * t4e8))
    + 0.0180 * Math.sin(dtr * (274.1928 - 553068.6797 * t - 54.513 * t2e4
    - 10.116 * t3e6 + 4.797 * t4e8))
    + 0.0150 * Math.sin(dtr * (325.7736 - 63863.5122 * t - 212.541 * t2e4
    - 25.031 * t3e6 + 11.826 * t4e8))
    - 0.0150 * Math.sin(dtr * (184.1196 + 401329.0556 * t + 125.428 * t2e4
    + 18.579 * t3e6 - 8.798 * t4e8))
    - 0.0078 * Math.sin(dtr * (238.1713 + 854535.1727 * t - 31.065 * t2e4
    + 3.623 * t3e6 - 1.769 * t4e8))
    - 0.0045 * Math.sin(dtr * (10.6638 + 1367733.0907 * t + 57.370 * t2e4
    + 18.011 * t3e6 - 8.566 * t4e8))
    + 0.0044 * Math.sin(dtr * (321.5076 + 1443602.9027 * t + 21.912 * t2e4
    + 13.780 * t3e6 - 6.566 * t4e8))
    - 0.0042 * Math.sin(dtr * (162.8868 - 31931.7561 * t - 106.271 * t2e4
    - 12.516 * t3e6 + 5.913 * t4e8))
    - 0.0031 * Math.sin(dtr * (170.9849 - 930404.9848 * t + 66.523 * t2e4
    + 0.608 * t3e6 - 0.232 * t4e8))
    + 0.0031 * Math.sin(dtr * (103.2079 + 377336.3051 * t - 121.035 * t2e4
    - 10.724 * t3e6 + 5.028 * t4e8))
    + 0.0029 * Math.sin(dtr * (222.6120 - 1042273.8471 * t + 103.516 * t2e4
    + 4.798 * t3e6 - 2.232 * t4e8))
    + 0.0028 * Math.sin(dtr * (184.0733 + 1002403.0853 * t - 69.594 * t2e4
    - 0.526 * t3e6 + 0.232 * t4e8));

    var srp = 25.9 * Math.sin(dtr * (125.0 - 1934.1 * t))
    - 4.3 * Math.sin(dtr * (220.2 - 1935.5 * t));

    var srpp = 0.38 * Math.sin(dtr * (357.5 + 35999.1 * t));

    var raan = 125.0446 - 1934.13618 * t + 20.762 * t2e4
    + 2.139 * t3e6 - 1.650 * t4e8 + sr
    + 1e-3 * (srp + srpp * t);

    return reboucle360((raan)%360); 
    break;
    
     //Lilith vraie (=longitude apogée)
      case 11:
// longitude of perigee

    var sp = - 15.448 * Math.sin(dtr * (100.7370 + 413335.3554 * t - 122.571 * t2e4
    - 10.684 * t3e6 + 5.028 * t4e8))
    - 9.642 * Math.sin(dtr * (325.7736 - 63863.5122 * t - 212.541 * t2e4
    - 25.031 * t3e6 + 11.826 * t4e8))
    - 2.721 * Math.sin(dtr * (134.9634 + 477198.8676 * t + 89.970 * t2e4
    + 14.348 * t3e6 - 6.797 * t4e8))
    + 2.607 * Math.sin(dtr * (66.5106 + 349471.8432 * t - 335.112 * t2e4
    - 35.715 * t3e6 + 16.854 * t4e8))
    + 2.085 * Math.sin(dtr * (201.4740 + 826670.7108 * t - 245.142 * t2e4
    - 21.367 * t3e6 + 10.057 * t4e8))
    + 1.477 * Math.sin(dtr * (10.6638 + 1367733.0907 * t + 57.370 * t2e4
    + 18.011 * t3e6 - 8.566 * t4e8))
    + 0.968 * Math.sin(dtr * (291.5472 - 127727.0245 * t - 425.082 * t2e4
    - 50.062 * t3e6 + 23.651 * t4e8))
    - 0.949 * Math.sin(dtr * (103.2079 + 377336.3051 * t - 121.035 * t2e4
    - 10.724 * t3e6 + 5.028 * t4e8))
    - 0.703 * Math.sin(dtr * (167.2476 + 762807.1986 * t - 457.683 * t2e4
    - 46.398 * t3e6 + 21.882 * t4e8))
    - 0.660 * Math.sin(dtr * (235.7004 + 890534.2230 * t - 32.601 * t2e4
    + 3.664 * t3e6 - 1.769 * t4e8))
    - 0.577 * Math.sin(dtr * (190.8102 - 541062.3799 * t - 302.511 * t2e4
    - 39.379 * t3e6 + 18.623 * t4e8))
    - 0.524 * Math.sin(dtr * (269.9268 + 954397.7353 * t + 179.941 * t2e4
    + 28.695 * t3e6 - 13.594 * t4e8))
    - 0.482 * Math.sin(dtr * (32.2842 + 285608.3309 * t - 547.653 * t2e4
    - 60.746 * t3e6 + 28.679 * t4e8))
    + 0.452 * Math.sin(dtr * (357.5291 + 35999.0503 * t - 1.536 * t2e4
    + 0.041 * t3e6 + 0.000 * t4e8))
    - 0.381 * Math.sin(dtr * (302.2110 + 1240006.0662 * t - 367.713 * t2e4
    - 32.051 * t3e6 + 15.085 * t4e8))
    - 0.342 * Math.sin(dtr * (328.2445 - 99862.5625 * t - 211.005 * t2e4
    - 25.072 * t3e6 + 11.826 * t4e8))
    - 0.312 * Math.sin(dtr * (44.8902 + 1431596.6029 * t + 269.911 * t2e4
    + 43.043 * t3e6 - 20.392 * t4e8))
    + 0.282 * Math.sin(dtr * (162.8868 - 31931.7561 * t - 106.271 * t2e4
    - 12.516 * t3e6 + 5.913 * t4e8))
    + 0.255 * Math.sin(dtr * (203.9449 + 790671.6605 * t - 243.606 * t2e4
    - 21.408 * t3e6 + 10.057 * t4e8))
    + 0.252 * Math.sin(dtr * (68.9815 + 313472.7929 * t - 333.576 * t2e4
    - 35.756 * t3e6 + 16.854 * t4e8))
    - 0.211 * Math.sin(dtr * (83.3826 - 12006.2998 * t + 247.999 * t2e4
    + 29.262 * t3e6 - 13.826 * t4e8))
    + 0.193 * Math.sin(dtr * (267.9846 + 1176142.5540 * t - 580.254 * t2e4
    - 57.082 * t3e6 + 26.911 * t4e8))
    + 0.191 * Math.sin(dtr * (133.0212 + 698943.6863 * t - 670.224 * t2e4
    - 71.429 * t3e6 + 33.708 * t4e8))
    - 0.184 * Math.sin(dtr * (55.8468 - 1018261.2475 * t - 392.482 * t2e4
    - 53.726 * t3e6 + 25.420 * t4e8))
    + 0.182 * Math.sin(dtr * (145.6272 + 1844931.9583 * t + 147.340 * t2e4
    + 32.359 * t3e6 - 15.363 * t4e8))
    - 0.158 * Math.sin(dtr * (257.3208 - 191590.5367 * t - 637.623 * t2e4
    - 75.093 * t3e6 + 35.477 * t4e8))
    + 0.148 * Math.sin(dtr * (156.5838 - 604925.8921 * t - 515.053 * t2e4
    - 64.410 * t3e6 + 30.448 * t4e8))
    - 0.111 * Math.sin(dtr * (169.7185 + 726808.1483 * t - 456.147 * t2e4
    - 46.439 * t3e6 + 21.882 * t4e8))
    + 0.101 * Math.sin(dtr * (13.1347 + 1331734.0404 * t + 58.906 * t2e4
    + 17.971 * t3e6 - 8.566 * t4e8))
    + 0.100 * Math.sin(dtr * (358.0578 + 221744.8187 * t - 760.194 * t2e4
    - 85.777 * t3e6 + 40.505 * t4e8))
    + 0.087 * Math.sin(dtr * (98.2661 + 449334.4057 * t - 124.107 * t2e4
    - 10.643 * t3e6 + 5.028 * t4e8))
    + 0.080 * Math.sin(dtr * (42.9480 + 1653341.4216 * t - 490.283 * t2e4
    - 42.734 * t3e6 + 20.113 * t4e8))
    + 0.080 * Math.sin(dtr * (222.5657 - 441199.8173 * t - 91.506 * t2e4
    - 14.307 * t3e6 + 6.797 * t4e8))
    + 0.077 * Math.sin(dtr * (294.0181 - 163726.0747 * t - 423.546 * t2e4
    - 50.103 * t3e6 + 23.651 * t4e8))
    - 0.073 * Math.sin(dtr * (280.8834 - 1495460.1151 * t - 482.452 * t2e4
    - 68.074 * t3e6 + 32.217 * t4e8))
    - 0.071 * Math.sin(dtr * (304.6819 + 1204007.0159 * t - 366.177 * t2e4
    - 32.092 * t3e6 + 15.085 * t4e8))
    - 0.069 * Math.sin(dtr * (233.7582 + 1112279.0417 * t - 792.795 * t2e4
    - 82.113 * t3e6 + 38.736 * t4e8))
    - 0.067 * Math.sin(dtr * (34.7551 + 249609.2807 * t - 546.117 * t2e4
    - 60.787 * t3e6 + 28.679 * t4e8))
    - 0.067 * Math.sin(dtr * (263.6238 + 381403.5993 * t - 228.841 * t2e4
    - 23.199 * t3e6 + 10.941 * t4e8))
    + 0.055 * Math.sin(dtr * (21.6203 - 1082124.7597 * t - 605.023 * t2e4
    - 78.757 * t3e6 + 37.246 * t4e8))
    + 0.055 * Math.sin(dtr * (308.4192 - 489205.1674 * t + 158.029 * t2e4
    + 14.915 * t3e6 -7.029 * t4e8))
    - 0.054 * Math.sin(dtr * (8.7216 + 1589477.9094 * t - 702.824 * t2e4
    - 67.766 * t3e6 + 31.939 * t4e8))
    - 0.052 * Math.sin(dtr * (179.8536 + 1908795.4705 * t + 359.881 * t2e4
    + 57.390 * t3e6 - 27.189 * t4e8))
    - 0.050 * Math.sin(dtr * (98.7948 + 635080.1741 * t - 882.765 * t2e4
    - 96.461 * t3e6 + 45.533 * t4e8))
    - 0.049 * Math.sin(dtr * (128.6604 - 95795.2683 * t - 318.812 * t2e4
    - 37.547 * t3e6 + 17.738 * t4e8))
    - 0.047 * Math.sin(dtr * (17.3544 + 425341.6552 * t - 370.570 * t2e4
    - 39.946 * t3e6 + 18.854 * t4e8))
    - 0.044 * Math.sin(dtr * (160.4159 + 4067.2942 * t - 107.806 * t2e4
    - 12.475 * t3e6 + 5.913 * t4e8))
    - 0.043 * Math.sin(dtr * (238.1713 + 854535.1727 * t - 31.065 * t2e4
    + 3.623 * t3e6 - 1.769 * t4e8))
    + 0.042 * Math.sin(dtr * (270.4555 + 1140143.5037 * t - 578.718 * t2e4
    - 57.123 * t3e6 + 26.911 * t4e8))
    - 0.042 * Math.sin(dtr * (132.4925 + 513197.9179 * t + 88.434 * t2e4
    + 14.388 * t3e6 - 6.797 * t4e8))
    - 0.041 * Math.sin(dtr * (122.3573 - 668789.4043 * t - 727.594 * t2e4
    - 89.441 * t3e6 + 42.274 * t4e8))
    - 0.040 * Math.sin(dtr * (105.6788 + 341337.2548 * t - 119.499 * t2e4
    - 10.765 * t3e6 + 5.028 * t4e8))
    + 0.038 * Math.sin(dtr * (135.4921 + 662944.6361 * t - 668.688 * t2e4
    - 71.470 * t3e6 + 33.708 * t4e8))
    - 0.037 * Math.sin(dtr * (242.3910 - 51857.2124 * t - 460.540 * t2e4
    - 54.293 * t3e6 + 25.652 * t4e8))
    + 0.036 * Math.sin(dtr * (336.4374 +  1303869.5784 * t - 155.171 * t2e4
    - 7.020 * t3e6 + 3.259 * t4e8))
    + 0.035 * Math.sin(dtr * (223.0943 - 255454.0489 * t - 850.164 * t2e4
    - 100.124 * t3e6 + 47.302 * t4e8))
    - 0.034 * Math.sin(dtr * (193.2811 - 577061.4302 * t - 300.976 * t2e4
    - 39.419 * t3e6 + 18.623 * t4e8))
    + 0.031 * Math.sin(dtr * (87.6023 - 918398.6850 * t - 181.476 * t2e4
    - 28.654 * t3e6 + 13.594 * t4e8));

    var spp = 2.4 * Math.sin(dtr * (103.2 + 377336.3 * t));

    var lp = 83.353 + 4069.0137 * t - 103.238 * t2e4
    - 12.492 * t3e6 + 5.263 * t4e8 + sp + 1e-3 * t * spp;
    
    return reboucle360((lp+180)%360); //+180 car Lilith=apogée=périgée+180
    break;
 }
}

