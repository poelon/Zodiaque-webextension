
//source : https://github.com/mdn/webextensions-examples/tree/master/quicknote

//si ajout ou suppression d'un champ, ajuster ligne 74 : max-3
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

//traductions groupes
var labelsGroupes=browser.i18n.getMessage("groupes").split(",");
boutonAnnuler.value = labelsGauche[6];
boutonOk.value = labelsGauche[7];
var groupesNoms=[];
var groupeDefaut=labelsGroupes[4];

/*  add event listeners to buttons */

addBtn.addEventListener('click', addNote);
clearBtn.addEventListener('click', clearAll);
boutonExport.addEventListener('click', exportJson);
fileJson.addEventListener('change', () => {
    importJson();
},onError);
boutonImport.addEventListener('click',() => {
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
        //en-tête et trait
        case labelsGroupes[0]:
            break;
        //créer groupe
        case labelsGroupes[1]:
            break;
        //renommer groupe
        case labelsGroupes[2]:
            break;
        //éditer groupes
        case labelsGroupes[3]:
            efface(noteContainer);
            groupesListe.disabled=true;
            editeGroupes();
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

function editeGroupes(){
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

//listeners (ne pas mettre à l'intérieur de "editeGroupes()" sinon répétitions...
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

function renommeGroupe(nom){
    alert(nom);
}
function boutonsDefaut(){
    clearBtn.hidden=false;
    boutonImport.hidden=false;
    boutonExport.hidden=false;
    boutonAnnuler.hidden=true;
    boutonOk.hidden=true;
}
function boutonsGroupes(){
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
        zone.removeChild(zone.firstChild);
    }
}

function initialize() {
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
    //lecture fichier local storage (clef=nom, valeurs=date,heure,lieu,utc,latitude,longitude)
    var valeur;
    var indice=0;
    var items=[];
    var gettingAllStorageItems = browser.storage.local.get(null);
    gettingAllStorageItems.then((results) => {
        var clefs = Object.keys(results); //ex. fiche_nom1, fiche_nom2
        //console.log("clefs : "+clefs);
        if (clefs.length){
            for (var clef of clefs) {
                //ignore option ville par défaut ou stockages d'autres applis
                if (clef=="zodiaque" || clef.search("fiche_")==-1){
                    continue;
                }
                valeur = results[clef]; 
                clef=clef.slice(6);
                //items(array) = clef(string) + valeur(array) => conversion de valeur de Array en String
                items[indice]=clef+"val:"+valeur; 
                indice+=1;
               // champJson.push({clef,valeur});//ne pas changer=nom des champs
            }
        } 
        
        //affichage
        if(indice==0) {
            displayNote("Leonard de Vinci",["14/04/1452","22:30","Vinci","1","43.47","10.55"]);
        }
        else {
            // sort by name
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
                    //clef0 : nom
                    nom=abc[0];
                    //clef1: groupe (par defaut : général)
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
                    if (existe==0){
                        groupesNoms[groupesNoms.length]=groupe;
                        element=document.createElement('option');
                        element.text=groupe;
                        groupesListe.insertBefore(element, trait);
                    }
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
                    //affiche si groupe "général"
                    if (groupe==groupeDefaut){displayNote(nom,valeur);}
                    
            }
            clearBtn.disabled=false;
        }
    }, onError);
}


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
}

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
    }
    initialize();
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
        valeur[0]=abc.split("-")[2]+"/"+abc.split("-")[1]+"/"+abc.split("-")[0];//abc.slice(8,10) +"/"+abc.slice(5,7)+"/"+ abc.slice(0,4); 
    }   
    //vérif si nom existe déjà
    var addOk=1;    
    for (var i=0; i<fiches.length; i++){
        if (fiches[i].nom==clef){
            addOk=0;
            break;
        }
    }
    //autres contrôles
    if(addOk==1 && clef !== '' && valeur[0] !== '' && valeur[1] !== '' && valeur[2] !== '' && valeur[0].split('/').length===3 && valeur[0].length==10 && valeur[1].split(':').length===2 && valeur[1].length==5) {
        //efacement des champs sauf utc, latitude et longitude (adapter max-3 si ajout ou suppression de champs)
        for (var i=0;i<=max-3;i++){
            element=document.getElementById(String(i)); 
            element.value="";
        }
        //sauvegarde
            //mémoire
            var fiche = new Fiche(
                groupeDefaut,
                clef,
                valeur,
            );
            fiches.push(fiche);
            //disque
            storeNote(clef,valeur,groupeDefaut);
        clef+="/*"+groupeDefaut;
        champJson.push({clef,valeur});
        clearBtn.disabled=false;
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
        // jourSemaine=joursem(jj)+" "; inutile, donné par datelongue (zodiaque)
        personne=noteAffiche[clef+0].textContent +labelsDroite[8] + datelongue(dateJulien) + " - " + heure + labelsDroite[9] + noteAffiche[clef+3].textContent + " (utc : " + noteAffiche[clef+4].textContent + ", lat. " + noteAffiche[clef+5].textContent + ", long. " + noteAffiche[clef+6].textContent + ")";
        choixHeure.value=noteAffiche[clef+2].textContent;
        dateNatal=noteAffiche[clef+1].textContent;
        heureNatal=noteAffiche[clef+2].textContent;
        nomNatal=noteAffiche[clef+0].textContent
        okProgresse=0;
        utc=Number(noteAffiche[clef+4].textContent);
        //latitude
        var x=Number(noteAffiche[clef+5].textContent);
        var y=Math.floor(x);
        latitude=y+((x-y)*10/6);
        //longitude
        x=Number(noteAffiche[clef+6].textContent);
        y=Math.floor(x);
        longitude=y+((x-y)*10/6);
        checkMaintenant.checked=false;
        choixNatal.checked=true;
        valideBtns();
        coeffOrbe.hidden=true;
        labelProg.hidden=true;
        tableau.hidden=true;
        choix2transitsMondiaux.checked=false;
        choix2transitsProgresseNatal.checked=false;
        choix2transitsProgresseProgresse.checked=false;
        requetes(dateNatal,heureNatal,personne);
        //sauvegarde positions planetes
        for (var i=0; i<12;i++){
            positionNatal[i]=positionPlanete[i];
        }
      }
    });
    
    //double clic sur nom: affichage ou désaffichage des champs de coordonnées
    noteAffiche[clef+0].ondblclick=function() {
        if (okEdit==1){ 
            okEdit=0;
            editNote(clef);
        }
    }
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
        noteEdit.appendChild(noteEdite[i]);
    } 
  //boutons 
    //traductions
    var labels=browser.i18n.getMessage("labelsGauche").split(",");
    var clearFix2 = document.createElement('div');
    noteEdit.appendChild(clearFix2);
    var cancelBtn = document.createElement('button');
    //cancelBtn.textContent = 'annulation';
    cancelBtn.textContent =labelsGauche[6];
    noteEdit.appendChild(cancelBtn);
    var updateBtn = document.createElement('button');
    // updateBtn.textContent = 'sauvegarde fiche';
    updateBtn.textContent =labelsGauche[7];
    noteEdit.appendChild(updateBtn);
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
            noteAffiche[clef+0].removeChild(noteEdit);
            okEdit=1;
            removeNote("fiche_"+clef+"/*"+groupe);
            validBtns();
            initialize();
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
            noteAffiche[clef+0].removeChild(noteEdit);
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
        if (init==1){initialize();}
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
