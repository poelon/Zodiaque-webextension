
//source : https://github.com/mdn/webextensions-examples/tree/master/quicknote

//si ajout ou suppression d'un champ, ajuster ligne 505 : max-3
var noteContainer = document.querySelector('.note-container');
var cadreBas = document.querySelector('.cadregaucheverticalbas');
var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');
var groupesListe=document.getElementById('groupes');
var boutonExport = document.getElementById("export");
var boutonImport = document.getElementById("import");
var boutonAnnuler = document.getElementById("annuler");
var boutonOk = document.getElementById("ok");
var fileJson = document.getElementById("filejson");
var champJson=[];
var noteAffiche=[];
var okEdit=1;
var error = document.querySelector('.error');

//traductions groupes
var labelsGroupes=browser.i18n.getMessage("groupes").split(",");
boutonAnnuler.value = labelsGauche[6];
boutonOk.value = labelsGauche[7];
var groupesNoms=[];
var groupeDefaut=labelsGroupes[4];

//document.getElementById('affichage').textContent=labelsGauche[16];

/*  add event listeners to buttons */

addBtn.addEventListener('click', function(){
    var total=0,element,abc="";
    for (var i=0; i<=6; i++){
        element=document.getElementById(String(i));
        if (!element.value){
            abc +=labelsGauche[i]+", ";
            continue;
        }
        total+=1;
    }
    if (total==7){addNote();}
    else {error.innerText=labelsGauche[15]+"  "+ abc;}
});

clearBtn.addEventListener('click', clearAll);
boutonExport.addEventListener('click', exportJson);
fileJson.addEventListener('change', () => {
    importJson();
},onError);
boutonImport.addEventListener('click',() => { //ne pas modifier, nécessite fileJson ligne au-dessus
    fileJson.click();
},onError);

//création object Fiche
function Fiche(groupe,nom,details) {
  this.groupe = groupe;
  this.nom = nom;
  this.details = details;
}
var fiches = [];

//ne marche pas : groupes.addEventListener("change",editNote(groupes.value));
groupesListe.addEventListener("change",() => {
    switch (groupesListe.value){
        //trait
        case labelsGroupes[0]:
            efface(noteContainer);
            break;
        //créer groupe
        case labelsGroupes[1]:
            efface(noteContainer);
            groupesListe.disabled=true;
            creeGroupe();
            break;
        //renommer groupe
        case labelsGroupes[2]:
            if (groupesNoms.length > 1){
                efface(noteContainer);
                groupesListe.disabled=true;
                renommeGroupe();
            }
            break;
        //assigner groupes
        case labelsGroupes[3]:
            if (groupesNoms.length > 1){
                efface(noteContainer);
                groupesListe.disabled=true;
                assigneGroupes();
            }
            break;
        //nom d'un groupe
        default:
            efface(noteContainer);
            //affichage
            for (var i=0; i<fiches.length; i++){
                if (fiches[i].groupe==groupesListe.value){displayNote(fiches[i].nom,fiches[i].details);}
            }
    }
},onError);

function creeGroupe(){
    
    var element=document.createElement('input');
    noteContainer.appendChild(element);
    element.setAttribute("id","entree");
    var entree=document.getElementById("entree");
    
    var cancelBtn = document.createElement('button');
    cancelBtn.textContent =labelsGauche[6];
    noteContainer.appendChild(cancelBtn);
    cancelBtn.setAttribute("id","annuleCree");
    var annuleCree=document.getElementById("annuleCree");
    
    var okBtn = document.createElement('button');
    okBtn.textContent ="ok";
    noteContainer.appendChild(okBtn);
    okBtn.setAttribute("id","okCree");
    var okCree=document.getElementById("okCree");
    
    //listeners
    cancelBtn.addEventListener('click',() => {
        efface(noteContainer);
        groupesListe.disabled=false;
        initialize();
    });
    okBtn.addEventListener('click',() => {
        var ajout=1;
        for (var j=0; j<groupesNoms.length; j++){
            if (groupesNoms[j]==entree.value){
                entree.value=labelsGroupes[5]; //"existe déjà";
                ajout=0;
                break;
            }
        }
        if (ajout==1){
            groupesNoms[groupesNoms.length]=entree.value;
            element=document.createElement('option');
            element.text=entree.value;
            groupesListe.insertBefore(element, trait);
            
            efface(noteContainer);
            var element=document.createElement('label');
            element.textContent=labelsGroupes[6];
            noteContainer.appendChild(element);
            groupesListe.disabled=false;
            element=document.getElementById("trait");
            element.selected=true;
        }
    });
}

function renommeGroupe(){
    var element;
    for (var i=0; i<groupesNoms.length; i++){
        element=document.createElement('input');
        element.setAttribute("id","ele"+String(i));
        element.value=groupesNoms[i];
        //ajoute mention "(protégé)" au groupe par défaut (général)
        if (groupesNoms[i]==groupeDefaut) element.value+="  "+labelsGroupes[8];
        noteContainer.appendChild(element);
    }  
    //création boutons ok et annuler + message
    var cancelBtn = document.createElement('button');
    cancelBtn.textContent =labelsGauche[6];
    noteContainer.appendChild(cancelBtn);
    
    var okBtn = document.createElement('button');
    okBtn.textContent ="ok";
    noteContainer.appendChild(okBtn);
    
    element=document.createElement('label');
    element.textContent=labelsGroupes[7];
    noteContainer.appendChild(element);
    
    //listeners
    cancelBtn.addEventListener('click',() => {
        efface(noteContainer);
        groupesListe.disabled=false;
        initialize();
    });
    okBtn.addEventListener('click',() => {
        for (var i=0; i<groupesNoms.length; i++){
            element=document.getElementById("ele"+String(i));
            //nom groupe inchangé
            if (groupesNoms[i]==element.value) continue;
            //nom "général" protégé
            if (groupesNoms[i]==groupeDefaut) continue;
            //nom groupe changé
            for (var j=0; j<fiches.length; j++){
                if (groupesNoms[i] == fiches[j].groupe){
                    //écriture nouveau groupe (général si sans nom)
                    updateNote(fiches[j].nom,fiches[j].nom,fiches[j].details,element.value || groupeDefaut);
                    console.log("mise à jour : " + fiches[j].nom + " groupe : " + (element.value || groupeDefaut));
                    //effacement ancien groupe
                    var removingNote = browser.storage.local.remove("fiche_"+fiches[j].nom+"/*"+fiches[j].groupe);
                    removingNote.then(() => {
                      //  console.log("effacement : " + fiches[j].nom + " groupe : " + fiches[j].groupe);//génère message d'erreur !
                    }, onError);
                }
            }
        }
        groupesListe.disabled=false;
        initialize();
    });
}

function assigneGroupes(){
    
    var nom,select,option,element;
    for (var i=0; i<fiches.length; i++){
        nom=document.createElement('label');
        nom.textContent=fiches[i].nom;
        noteContainer.appendChild(nom);
        select=document.createElement('select');
        select.setAttribute("id","ele"+String(i));
        for (var j=0; j<groupesNoms.length; j++){
            option=document.createElement('option');
            option.text=groupesNoms[j];
            if (option.text==fiches[i].groupe){option.selected=true;}
            select.appendChild(option);
        }
        noteContainer.appendChild(select);
        element=document.createElement('br');
        noteContainer.appendChild(element);
    }    
    boutonsGroupes();
} 

//listeners pour "assigneGroupes" (ne pas mettre à l'intérieur de "assigneGroupes()" sinon répétitions...)
boutonAnnuler.addEventListener('click',() => {
    boutonsDefaut();
    groupesListe.disabled=false;
    initialize();
});

boutonOk.addEventListener('click',() => {
    for (var i=0; i<fiches.length; i++){
        element=document.getElementById("ele"+String(i));
        if (element.value != fiches[i].groupe){
            //écriture nouveau groupe
            updateNote(fiches[i].nom,fiches[i].nom,fiches[i].details,element.value);
            console.log("mise à jour : " + fiches[i].nom + " groupe : " + element.value);
            //effacement ancien groupe
            var removingNote = browser.storage.local.remove("fiche_"+fiches[i].nom+"/*"+fiches[i].groupe);
            removingNote.then(() => {
                // console.log("effacement : " + fiches[i].nom + " groupe : " + fiches[i].groupe);//génère message d'erreur !
            }, onError);
            // fiches[i].groupe=element.value;
        }
    }
    boutonsDefaut();
    groupesListe.disabled=false;
    initialize();
});


function boutonsDefaut(){
    addBtn.hidden=false;
    clearBtn.hidden=false;
    boutonImport.hidden=false;
    boutonExport.hidden=false;
    boutonAnnuler.hidden=true;
    boutonOk.hidden=true;
}
function boutonsGroupes(){
    addBtn.hidden=true;
    clearBtn.hidden=true;
    boutonImport.hidden=true;
    boutonExport.hidden=true;
    boutonAnnuler.hidden=false;
    boutonOk.hidden=false;
}

/* generic error handler */
function onError(error) {
    console.log(`Erreur: ${error}`);
}

/* display previously-saved stored notes on startup */

initialize();

function efface(zone) {
    // Removing all children from an element
    while (zone.firstChild) {
        garbage=zone.removeChild(zone.firstChild);
    }
}

function initialize(Group) {
    clearBtn.disabled=true;
    efface(noteContainer);
    efface(groupesListe);
    //options des groupes (créer, renommmer,etc.)
    groupesNoms=[groupeDefaut];//général
    var element;
    for (var i=0 ; i<=3; i++){
        element=document.createElement('option');
        if (i==0){element.setAttribute("id","trait");}
        element.text=labelsGroupes[i];
        groupesListe.appendChild(element);
    }
    var trait = document.getElementById("trait");
    element=document.createElement('option');
    element.text=groupeDefaut;
    element.selected=true;
    groupesListe.insertBefore(element, trait);
    //
    champJson=[];
    fiches = [];
    //lecture fichier local storage (clef=fiche_+nom+"/*"+groupe, valeurs=date,heure,lieu,utc,latitude,longitude)
    var valeur;
    var indice=0;
    var items=[];
    var gettingAllStorageItems = browser.storage.local.get(null);
    gettingAllStorageItems.then((results) => {
        var clefs = Object.keys(results); //ex. fiche_nom1, fiche_nom2
        if (clefs.length){
            for (var clef of clefs) {
                //ignore option ville par défaut ou stockages d'autres applis
                if (clef=="zodiaque" || clef.search("fiche_")==-1){continue;}
                valeur = results[clef]; 
                clef=clef.slice(6);
                //items(array) = clef(string) + valeur(array) => conversion de valeur de Array en String
                items[indice]=clef+"val:"+valeur; 
                indice+=1;
            }
        } 
        
        //affichage
        if(indice==0) {
            displayNote("Leonard de Vinci",["14/04/1452","22:30","Vinci","1","43.47","10.55"]);
        }
        else {
            // sort by name (majuscules=minuscules)
            items.sort(function(a, b) {
            var nameA = a.toUpperCase(); // ignore upper and lowercase
            var nameB = b.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
            });
            
            //affichage
            var abc,nom,groupe;
            for (var i=0; i<indice ; i++){
                clef=items[i].split("val:")[0];
                abc=items[i].split("val:")[1];
                valeur=[];
                //reconversion de Valeur de String en Array
                for (var j=0; j<=5; j++){
                    valeur.push(abc.split(",")[j]);
                }
                
                //gestion des groupes
                abc=clef.split("/*");
                    nom=abc[0];
                    //groupe par defaut : général
                    groupe=groupeDefaut;
                    if (abc.length > 1 && abc[1] != ""){
                        groupe=abc[1];
                    }else{
                        //pas de groupe défini : ajoute fiche sur disque avec groupe "général" et efface fiche sans groupe
                        console.log(" ajoute " +nom+" - " +valeur+" - " +groupe);
                        updateNote(nom,nom,valeur,groupe); 
                        var removingNote = browser.storage.local.remove("fiche_"+nom);
                        removingNote.then(() => {
                            console.log("effacement : " + "fiche_"+nom);
                        }, onError);
                    }
                    //teste si groupe existe déjà
                    var existe=0;
                    for (var j=0; j<groupesNoms.length; j++){
                        if (groupesNoms[j]==groupe){
                            existe=1;
                            break;
                        }
                    }
                    //non, ajoute nouveau groupe
                    if (existe==0) groupesNoms[groupesNoms.length]=groupe;

                    //sauvegarde fiche en object
                    var fiche = new Fiche(
                        groupe,
                        nom,
                        valeur,
                    );
                    fiches.push(fiche);
                    //json
                    clef=nom+"/*"+groupe;
                    champJson.push({clef,valeur});//ne pas changer=nom des champs
                    //affiche le groupe sélectionné sinon le groupe "général"
                    if (Group && groupe==Group){displayNote(nom,valeur);}
                    else if (!Group && groupe==groupeDefaut){displayNote(nom,valeur);}
                    
            }
            
            //alphabétise la liste des groupes (hors accents et majuscules/minuscules))
            var x=groupesNoms.sort();
            for (var i=0;i<groupesNoms.length;i++){
                if (x[i]==groupeDefaut) continue;
                element=document.createElement('option');
                element.text=x[i];
                groupesListe.insertBefore(element, trait);
            }
            //affiche groupe général ou groupe sélectionné
            if (groupe==Group) element.selected=true;
            clearBtn.disabled=false;
        }
    }, onError);
}

//remplace la permission "downloads" de manifest.json
//source : https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download (fichier, texte) {
    const element = document.createElement('a');
    element.setAttribute('href', texte);
    element.setAttribute('download',fichier);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//l'option "save as" apparaît si dans préférences de firefox, téléchargements : Toujours demander où enregistrer les fichiers
function exportJson(fileType="application/json"){
    if (champJson.length){
        var abc= JSON.stringify(champJson,null, ' ');
        var blob = new Blob([abc], {type: fileType});
        var downloadUrl = URL.createObjectURL(blob);
        download("zodiaque.json",downloadUrl);
        URL.revokeObjectURL(blob);
    }
}

/*obsolete : nécessite la permission "downloads" dans manifest.json
function exportJson(fileType="application/json"){
    if (champJson.length){
        var abc= JSON.stringify(champJson,null, ' ');
        var blob = new Blob([abc], {type: fileType});
        var downloadUrl = URL.createObjectURL(blob);
        if (!android){
            var downloading=chrome.downloads.download({
                url: downloadUrl,
                filename: "zodiaque.json",
                saveAs: true
            }, onError);
        }else{
            var downloading=chrome.downloads.download({
                url: downloadUrl,
                filename: "zodiaque.json",
                //  saveAs: true // ne marche pas avec android: pas de sauvegarde
            }, onError);
        }
        URL.revokeObjectURL(blob);
    }
}*/

function importJson(){
    var reader = new FileReader();
    var file = fileJson.files[0];
    var abc=""
    
    //lecture fichier json, affichage et sauvegarde en storage local
    reader.readAsText(file);
    reader.onload = function(event) {
        console.log(reader.result);
        abc= JSON.parse(reader.result);
        console.log(abc); 
        champJson=[];
        var bcd,groupe;
        for (var i=0; i<abc.length;i++){
            bcd=abc[i].clef.split("/*")
            if (bcd.length > 1 && bcd[1] != ""){groupe=bcd[1];}
            else {groupe=groupeDefaut;}
            console.log('json - réception données ' + bcd[0] + " - groupe : "+groupe);  
            storeNote(bcd[0],abc[i].valeur,groupe);
        }
        clearBtn.disabled=false;
        console.log('réception données json terminé !');
        initialize(); //ne pas mettre en-dehors des {} sinon ne fonctionne pas
    }
}    


/* Add a note to the display, and storage */

function addNote() {
    //récupération éléments de la nouvelle fiche
    //max = nombre(-1) de champs de coordonnées
    var max=0;
    var element;
    var i=0;
    var clef;
    var valeur=[];
    do{
        element=document.getElementById(String(i));
        if (element==null){
            max=i-1;
            break;
        } 
        if (i==0){
            clef=element.value;
        }else{
            valeur[i-1]=element.value;
            //supprime les ","sinon pb à l'affichage (trop de champs dans array)
            valeur[i-1]=valeur[i-1].replace(/,/g," ");
        }
        i+=1;
    }while(max==0);
    
    
    //contrôles et sauvegarde
    
    //dom.forms.datetime=true (aaaa-mm-jj ) ou false (jj/mm/aaaa) 
    //contrôle format date : aaaa-mm-jj (type date à convertir en jj/mm/aaaa) ou (jj/mm/aaaa (type text ok)
    if (choixDate.type==="date"){
        var abc=valeur[0];
        valeur[0]=abc.split("-")[2]+"/"+abc.split("-")[1]+"/"+abc.split("-")[0];
    }   
    //vérif si nom existe déjà
    var addOk=1;    
    for (var i=0; i<fiches.length; i++){
        if (fiches[i].nom==clef){
            error.innerText = fiches[i].nom + "  " + labelsGroupes[5] + " (" + fiches[i].groupe + ")"; //"existe déjà";
            addOk=0;
            break;
        }
    }
    if (addOk==1){error.innerText ="";}
    
    //autres contrôles
    if(addOk==1 && clef !== '' && valeur[0].split('/').length===3 && valeur[0].length==10 && valeur[1].split(':').length===2 && valeur[1].length==5) {
        //efacement des champs sauf utc, latitude et longitude (adapter max-3 si ajout ou suppression de champs)
        for (var i=0;i<=max-3;i++){
            element=document.getElementById(String(i)); 
            element.value="";
        }
        
        //vérifie si groupe sélectionné, sinon groupe par défaut (général)
        var groupe=groupeDefaut;
        for (i=0; i<groupesNoms.length; i++){
            if (groupesNoms[i]==groupesListe.value){
                groupe=groupesListe.value;
                break;
            }
        }
        //sauvegarde
        storeNote(clef,valeur,groupe);
        clef+="/*"+groupe;
        champJson.push({clef,valeur});
        clearBtn.disabled=false;
        initialize(groupe);
    }else{
        if (!error.innerText) {error.innerText= labelsGauche[14];} //erreur
    }
}

/* function to store a new note in storage */

function storeNote(clef, valeur, groupe) {
    if (!groupe){groupe=groupeDefaut;}
    var storingNote = browser.storage.local.set({ ["fiche_"+ clef + "/*" + groupe]:valeur});
    storingNote.then(() => {
      //  displayNote(clef,valeur);
    }, onError);
}


/****************note display box : clef=nom+prénom, valeur=date+heure+lieu+latitude+longitude****************/

function displayNote(clef,valeur) {
    //liste des noms
    
    var note = document.createElement('div');
    var noteDisplay = document.createElement('ul');
    
  //coordonnées
    //nom+prenom
    noteAffiche[clef+0]=document.createElement('li');
    noteAffiche[clef+0].textContent = clef;
    noteDisplay.appendChild(noteAffiche[clef+0]);
    
    //date,heure,lieu,utc, latitude,longitude
    var noteDetails = document.createElement('div'); 
    for(var i=1; i<=valeur.length; i++){
        noteAffiche[clef+i] = document.createElement('p');
        noteAffiche[clef+i].textContent = valeur[i-1];
        noteDetails.appendChild(noteAffiche[clef+i]);
    }
    
    //trait de séparation
    var clearFix = document.createElement('div');
    noteDetails.appendChild(clearFix);
    var separation = document.createElement('p');
    separation.textContent = "--------------------------";
    noteDetails.appendChild(separation);
    //affichage 
    noteDetails.style.display = 'none';
    noteDisplay.appendChild(noteDetails);
    note.appendChild(noteDisplay);
    noteContainer.appendChild(note);
    
    //************listeners display box**********************
    //clic sur le nom
    noteAffiche[clef+0].addEventListener('click',(e) => {
      if (okEdit==1){
        var date=noteAffiche[clef+1].textContent;
        var dateJulien=date.slice(6,10) +"-"+date.slice(3,5)+"-"+date.slice(0,2);
        var heure=noteAffiche[clef+2].textContent;
        var jj=calcJourJulien(dateJulien,heure);
        //utc,coordonnées
        utc=Number(noteAffiche[clef+4].textContent);
            //conversion deg.min en degres.decimales
            var x=Number(noteAffiche[clef+5].textContent);
            var y=Number(noteAffiche[clef+6].textContent);
        [latitude,longitude]= convDegresMinutestoDegresDecimal(x,y);
        
        //theme ou synastrie ?
            //date,heure,nom
            var a1=noteAffiche[clef+1].textContent;
            var a2=noteAffiche[clef+2].textContent;
            var a3=noteAffiche[clef+0].textContent;
            nomTheme2="";
             //synastrie
            if (okTransits==1){
                dateTheme2=a1;
                heureTheme2=a2;
                nomTheme2=a3;
                if (controleDate(dateTheme2)=="oui"){
                    //calcul des positions planètes, mises en "live"
                    calcPositionsPlanetes(dateMaisons,heureTheme2);
                    //sauvegarde
                    for (var i=0;i<=11;i++){
                        positionLive[i]=positionPlanete[i];
                        ecartLive[i]=ecartJour[i];
                    } 
                    choixHeure.value=heureTheme2;
                    incDateHeure();
                    dessins();
                }
                return; //sortie
            }
            //thème
            choixHeure.value=noteAffiche[clef+2].textContent;
            dateNatal=a1;
            heureNatal=a2;
            nomNatal=a3;
        //titre du thème
        coordonnees= noteAffiche[clef+3].textContent + " (utc : " + noteAffiche[clef+4].textContent + ", lat. " + noteAffiche[clef+5].textContent + ", long. " + noteAffiche[clef+6].textContent + ")";
        titreTheme=noteAffiche[clef+0].textContent +labelsDroite[8] + dateLongue(dateJulien) + " - " + heure + labelsDroite[9] + coordonnees;
        //différents paramètres
        okProgresse=0;
        fixePhases=0;
        okTransits=0;
        margeNoir();
        natProg=1;
        checkMaintenant.checked=false;
        checkMaisonsNatales.disabled=false;
        resetChoix(false);
        labelProg.hidden=true;
        tableau.hidden=true;
        margeDiv.hidden=false;
        //bouton radio natal
            choix1.item(0).checked=true;
        //boutons radio transits
            choix2.item(0).checked=false;
            choix2.item(1).checked=false;
            choix2.item(2).checked=false;
        //boutons radio theme ou transits graphiques
            choix4.item(0).disabled=false;
            choix4.item(0).checked=true;
            choix4.item(1).disabled=false;
        canvasCache(false);
        requetes(dateNatal,heureNatal,titreTheme);
      }
    });
    
    //double clic sur nom: affichage ou désaffichage des champs de coordonnées
    noteAffiche[clef+0].ondblclick=function() {
        if (okEdit==1 && champJson.length){ 
            okEdit=0;
            editNote(clef);
        }
    }
    
    //message au survol souris
   /* noteAffiche[clef+0].onmouseover=function(e){
        displayDivInfo(labelsGauche[16],e.clientX,e.clientY);
    }
    noteAffiche[clef+0].onmouseout=function(){
        displayDivInfo();
    }*/
}

/*************note edit box : clef=nom+prénom, valeur=date+heure+lieu+latitude+longitude************/  

function editNote(clef){
    //dévalide boutons
    clearBtn.disabled=true;
    boutonImport.disabled=true;
    boutonExport.disabled=true;
    groupesListe.disabled=true;
    addBtn.disabled=true;
    //recherche fiche
    for (var i=0; i<fiches.length; i++){
        if (fiches[i].nom==clef){
            var valeur=fiches[i].details;
            var groupe=fiches[i].groupe;
            var posRef=i;
            break;
        }
    }
    var noteEdit = document.createElement('div');
    //coordonnées=nom,date,heure,lieu,latitude,longitude
    var noteEdite=[];
    //nom+prénom
    noteEdite[0]=document.createElement('input');
    noteEdite[0].value=clef;
    noteEdit.appendChild(noteEdite[0]);
    //date,heure,lieu,latitude,longitude
    for (var i=1;i<=valeur.length;i++){
        noteEdite[i]=document.createElement('input');
        noteEdite[i].value = valeur[i-1];
        if (i==4) noteEdite[i].placeholder="utc ±";
        else if (i==5) noteEdite[i].placeholder="latitude deg.min";
        else if (i==6) noteEdite[i].placeholder="longitude deg.min";
        noteEdit.appendChild(noteEdite[i]);
    } 
  //boutons 
    //traductions
    var labels=browser.i18n.getMessage("labelsGauche").split(",");
    var clearFix2 = document.createElement('div');
    noteEdit.appendChild(clearFix2);
    var updateBtn = document.createElement('button');
    // updateBtn.textContent = 'sauvegarde fiche';
    updateBtn.textContent =labelsGauche[7];
    noteEdit.appendChild(updateBtn);
    var cancelBtn = document.createElement('button');
    //cancelBtn.textContent = 'annulation';
    cancelBtn.textContent =labelsGauche[6];
    noteEdit.appendChild(cancelBtn);
    var deleteBtn = document.createElement('button');
    //deleteBtn.textContent = 'effacement fiche';
    deleteBtn.textContent =labelsGauche[8];
    noteEdit.appendChild(deleteBtn);
    //traductions
    document.getElementById("nom").textContent=labelsGauche[0];
    //affichage
    noteAffiche[clef+0].appendChild(noteEdit);
    
    /*****************************listeners edit box*******************************/
    
    deleteBtn.addEventListener('click',(e) => {
        var abc=labelsGauche[9];
        // if (window.confirm(abc+groupes.value)) { 
        if (window.confirm(abc+clef)) { 
            // removeNote("fiche_"+groupes.value);
            garbage=noteAffiche[clef+0].removeChild(noteEdit);
            okEdit=1;
            removeNote("fiche_"+clef+"/*"+groupe);
            validBtns();
            initialize(groupe);
        }
    });
    
    //annulation modif
    cancelBtn.addEventListener('click',() => {
        noteAffiche[clef+0].removeChild(noteEdit);
        okEdit=1;
        validBtns();
    });
    
    //confirmation modif
    updateBtn.addEventListener('click',() => {        
        //vérifie formats date et heure
        if (noteEdite[1].value.split('/').length===3 && noteEdite[1].value.length==10 && noteEdite[2].value.split(':').length===2 && noteEdite[2].value.length==5){
            garbage=noteAffiche[clef+0].removeChild(noteEdit);
            okEdit=1;
            var clef_old=clef;
            clef=noteEdite[0].value;
            //valeur = date naissance + heure + lieu + latitude + longitude
            var valeur=[];
            for (i=0;i<noteEdite.length-1;i++){
                valeur[i]=noteEdite[i+1].value;
                //supprime les ","sinon pb à l'affichage (trop de champs dans array)
                valeur[i]=valeur[i].replace(/,/g," ");
            }
            //écriture disque
            updateNote(clef_old,clef,valeur,groupe,1);
            validBtns();
        }
    }); 
}
// fin editNote

function validBtns(){
//valide boutons
    clearBtn.disabled=false;
    boutonImport.disabled=false;
    boutonExport.disabled=false;
    groupesListe.disabled=false;
    addBtn.disabled=false;
}

/* function to update notes */

function updateNote(delNote,clef,valeur,groupe,init) {
    var storingNote = browser.storage.local.set({ ["fiche_"+ clef + "/*" + groupe] : valeur});
    storingNote.then(() => {
        if(delNote !== clef) {
            removeNote("fiche_"+delNote+ "/*" + groupe);
        }
        if (init==1){initialize(groupe);}
    }, onError);
}

function removeNote(delNote){
    var removingNote = browser.storage.local.remove(delNote);
    removingNote.then(() => {
        console.log("effacement : " + delNote);
    }, onError);
} 

/* Clear all notes from the display/storage */

function clearAll() { 
    var abc=labelsGauche[10];
    if (window.confirm(abc)) {
        var gettingItem = browser.storage.local.get(null);
        gettingItem.then((results) => {
            var clefs = Object.keys(results);
            if (clefs.length){
                for (let clef of clefs) {
                    if (clef.search("fiche_")!=-1){
                        var removingNote = browser.storage.local.remove(clef);
                        removingNote.then(() => {
                        }, onError);
                    }   
                }
            }
            initialize();
        }, onError);
    }
}
