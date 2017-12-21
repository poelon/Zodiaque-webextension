
//----------------------------source : http://pgj.pagesperso-orange.fr/position-planetes.htm----------------------------------

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

    var heure1 = heure + (minute / 60) +(seconde / 3600);
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


//---------------------- source : http://www.stjarnhimlen.se/comp/ppcomp.html ou tutorial.html-------------------------

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

function planetesCalc(y,h,jj,planete){
    //jours depuis le 1/1/2000 0:0
    var d=jj - 2451544;
    d =Math.round(d)+h/24.0;
     //soleil
        var [N,i,w,a,e,M]=orbitParams(d,0);
        Mso=reboucle360(M%360);
        Lso=reboucle360((w+M)%360);
    //Orbital elements
        var [N,i,w,a,e,M]=orbitParams(d,planete);
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
        var xh = r * Math.cos(lonecl/r2d) * Math.cos(latecl/r2d);
        var yh = r * Math.sin(lonecl/r2d) * Math.cos(latecl/r2d);
        var zh = r * Math.sin(latecl/r2d);
    //geocentric ecliptic
        var [lonsun,xs,ys]=soleil(y,h,jj);
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
    return l;
}

function soleil(Epoch,UT,jj){
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
    return [lonsun,xs,ys];
}

//valide d'environ 1800 à environ 2100
function pluton(Epoch,UT,jj){
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
        var [lonsun,xs,ys]=soleil(Epoch,UT,jj);
        var xg = xh + xs;
        var yg = yh + ys;
        var zg = zh;
    //longitude
        var l=reboucle360(Math.atan2(yg,xg)*r2d);
    return l;
}

//---------------------------------------fin ---------------------------------------------------


    
