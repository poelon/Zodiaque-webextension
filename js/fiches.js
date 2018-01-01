
//source : https://github.com/mdn/webextensions-examples/tree/master/quicknote

//si ajout ou suppression d'un champ, ajuster ligne 74 : max-3
var noteContainer = document.querySelector('.note-container');
var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');
var listeNoms=document.getElementById('listenoms');
var boutonExport = document.getElementById("export");
var boutonImport = document.getElementById("import");
var fileJson = document.getElementById("filejson");
var champJson=[];
 
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
//ne marche pas : listeNoms.addEventListener("change",editNote(listeNoms.value));
listeNoms.addEventListener("change",() => {
    editNote(listeNoms.value);
},onError);

/* generic error handler */
function onError(error) {
  console.log(error);
}

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
     clearBtn.disabled=true;
     var vide=0;
     // Removing all children from an element
     while (noteContainer.firstChild) {
        noteContainer.removeChild(noteContainer.firstChild);
     }
     while (listeNoms.firstChild) {
        listeNoms.removeChild(listeNoms.firstChild);
     }
     var fiche=document.createElement('option');
     fiche.text="modifications";
     listenoms.appendChild(fiche);
     champJson=[];
     //lecture fichier local storage (clef=nom, valeurs=date,heure,lieu,utc,latitude,longitude)
     var gettingAllStorageItems = browser.storage.local.get(null);
     gettingAllStorageItems.then((results) => {
     var clefs = Object.keys(results); //ex. fiche_nom1, fiche_nom2
     //console.log("clefs : "+clefs);
        if (clefs.length){
            for (let clef of clefs) {
                //option ville par défaut ou stockages d'autres applis
                if (clef=="zodiaque" || clef.search("fiche_")==-1){
                    continue;
                }
                vide+=1;
                var valeur = results[clef]; 
                clef=clef.slice(6);
                champJson.push({clef,valeur});//ne pas changer=nom des champs
                displayNote(clef,valeur);
            }
        } 
        if(vide==0) {
            displayNote("Leonard de Vinci",["14/04/1452","22:30","Vinci","1","43.47","10.55"]);
        }
        else {clearBtn.disabled=false;}
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
        for (var i=0; i<abc.length;i++){
            console.log('json - envoi données ' + abc[i].clef);
            storeNote(abc[i].clef,abc[i].valeur);
        }
        clearBtn.disabled=false;
        console.log('envoi données json terminé !');
    }
}    


/* Add a note to the display, and storage */

function addNote() {
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
        }
        i+=1;
    }while(max==0);
    
    
  //contrôles et sauvegarde
  var gettingItem = browser.storage.local.get("fiche_"+clef);
    //dom.forms.datetime=true (aaaa-mm-jj ) ou false (jj/mm/aaaa) 
    //contrôle format date : aaaa-mm-jj (type date à convertir en jj/mm/aaaa) ou (jj/mm/aaaa (type text ok)
    if (choixDate.type==="date"){
        var abc=valeur[0];
        valeur[0]=abc.split("-")[2]+"/"+abc.split("-")[1]+"/"+abc.split("-")[0];//abc.slice(8,10) +"/"+abc.slice(5,7)+"/"+ abc.slice(0,4); 
    }   
    gettingItem.then((result) => {
        var objTest = Object.keys(result);
        //objTest.length < 1 = le nom n'existe pas déjà
        if(objTest.length < 1 && clef !== '' && valeur[0] !== '' && valeur[1] !== '' && valeur[2] !== '' && valeur[0].split('/').length===3 && valeur[0].length==10 && valeur[1].split(':').length===2 && valeur[1].length==5) {
            //efacement des champs sauf utc, latitude et longitude (adapter max-3 si ajout ou suppression de champs)
            for (var i=0;i<=max-3;i++){
                element=document.getElementById(String(i)); 
                element.value="";
            }
            storeNote(clef,valeur);
            champJson.push({clef,valeur});
            clearBtn.disabled=false;
           // addBtn.disabled=false;
            }
    }, onError);
}

/* function to store a new note in storage */

function storeNote(clef, valeur) {
 var storingNote = browser.storage.local.set({ ["fiche_"+ clef]:valeur});
  storingNote.then(() => {
     displayNote(clef,valeur);
  }, onError);
}


/*note display box : clef=nom+prénom, valeur=date+heure+lieu+latitude+longitude*****************************/

function displayNote(clef,valeur) {
   //liste des noms
  var fiche=document.createElement('option');
    fiche.value=clef;
    fiche.text=clef;
    listenoms.appendChild(fiche);
  
  var note = document.createElement('div');
  var noteDisplay = document.createElement('ul');
  var noteAffiche=[];
  
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
 });
 
 //double clic sur nom: affichage ou désaffichage des champs de coordonnées
 noteAffiche[clef+0].ondblclick=function() {
     switch(noteDetails.style.display){
            case "none":
                noteDetails.style.display ='block';
                break;
            case "block":
                noteDetails.style.display ='none';
    }
 }
}
 
/*************note edit box : clef=nom+prénom, valeur=date+heure+lieu+latitude+longitude************/  

function editNote(clef){ 
   var noteEdit = document.createElement('div');
   var gettingItem = browser.storage.local.get("fiche_"+clef);
   gettingItem.then((result) => {
        var objTest = Object.keys(result);
        var valeur = result["fiche_"+clef]
   
   
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
  noteContainer.appendChild(noteEdit);

  
 /*****************************listeners edit box*******************************/

    deleteBtn.addEventListener('click',(e) => {
        var abc=labelsGauche[9];
        if (window.confirm(abc+listeNoms.value)) { 
            removeNote("fiche_"+listeNoms.value);
            initialize();
        }
    });

    //annulation modif
    cancelBtn.addEventListener('click',() => {
        //noteDisplay.style.display = 'block';
        noteEdit.style.display = 'none';
        listeNoms.value="modifications";
    });
    
    //confirmation modif
    updateBtn.addEventListener('click',() => {        
        //vérifie formats date et heure
        if (noteEdite[1].value.split('/').length===3 && noteEdite[1].value.length==10 && noteEdite[2].value.split(':').length===2 && noteEdite[2].value.length==5){
          var clef=noteEdite[0].value;
          //valeur = date naissance + heure + lieu + latitude + longitude
          var valeur=[];
             for (i=0;i<noteEdite.length-1;i++){
                valeur[i]=noteEdite[i+1].value;
             }
          //écriture
          updateNote(listeNoms.value,clef,valeur);
        }
    }); 
    
 });  
}
// fin editNote

/* function to update notes */

function updateNote(delNote,clef,valeur) {
  var storingNote = browser.storage.local.set({ ["fiche_"+ clef] : valeur});
  storingNote.then(() => {
      if(delNote !== clef) {
      removeNote("fiche_"+delNote);
      }
      initialize();
  }, onError);
}

function removeNote(delNote){
     var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
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
