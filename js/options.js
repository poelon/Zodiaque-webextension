
//traductions
var label=browser.i18n.getMessage("options").split(",");
document.getElementById("labelPlace").textContent=label[0];
document.getElementById("boutonSauve").textContent=label[1];
document.getElementById("boutonDefautPosition").textContent=label[3];
document.getElementById("boutonDefautOrbes").textContent=label[3];
document.getElementById("cherchePosition").textContent=label[5];
document.getElementById("chercheUtc").textContent=label[5];
document.getElementById("titreOrbes").textContent=label[4];

label=browser.i18n.getMessage("labelsGauche").split(",");
document.getElementById("1").textContent=label[12];//utc
document.getElementById("2").textContent=label[13];//latitude
document.getElementById("3").textContent=label[12];//longitude

label=browser.i18n.getMessage("labelsDroite").split(",");
document.getElementById("labelLux").textContent=label[26].split("- ")[1];
document.getElementById("4").textContent="    ";

var aspects=browser.i18n.getMessage("aspects").split(",");


function saveOptions(e) {
    var clef="zodiaque";
    var valeur=[];
    var a=["#place","#utcDef","#latDef","#longDef","#luxDef"];
    for (var i=0;i<a.length;i++){
        valeur[i]=document.querySelector(a[i]).value;
    }
    //orbes
    for (i=0;i<=8;i++){
        valeur[i+5]=document.getElementById("numA"+i).value;    
    }
    //enregistrement
    e.preventDefault();
    var storing=browser.storage.local.set({[clef] : valeur});
    document.getElementById("ok").textContent="ok";
}

//position par défaut (sauf lieu)
var posDef=["place","utcDef","latDef","longDef","luxDef"];
var posVal=[,1,48.51,2.21,0.15];
document.getElementById("boutonDefautPosition").addEventListener("click", () => {
    for (var i=1;i<=posDef.length;i++){
        document.getElementById(posDef[i]).value =posVal[i];
    }
});

//cherche position sur wikipedia et utc sur "time.is"
document.getElementById("cherchePosition").addEventListener("click", () => {
    var adresse="https://" + navigator.language.slice(0,2)+".wikipedia.org/wiki/";
    adresse+=document.getElementById("place").value;//lieu
   // window.open(adresse);//déconseillé
    browser.tabs.create({url: adresse});
});
document.getElementById("chercheUtc").addEventListener("click", () => {
    var adresse="https://time.is/" + navigator.language.slice(0,2)+"/";
    adresse+=document.getElementById("place").value;//lieu
    browser.tabs.create({url: adresse});
});

//orbes par défaut
var orbes=[15,2,2,4,8,8,2,0.5,10];
document.getElementById("boutonDefautOrbes").addEventListener("click",() => {
    for (var i=0;i<=8;i++){
        document.getElementById("numA"+i).value=orbes[i];
    }
});

function restoreOptions() {
    
    function setCurrentChoice(result) {
        var b=[];
        var objTest = Object.keys(result);
        if (objTest.length){b=result.zodiaque;}
            //lieu, utc, longitude,latitude (si valeur absente, écriture de la valeur par défaut sauf pour lieu)
            for (var i=0;i<posDef.length;i++){
                if (b[i]) document.getElementById(posDef[i]).value = b[i];
                else if(!b[i] && i>0) document.getElementById(posDef[i]).value = posVal[i];
            }
            //orbes (si absent, écriture de la valeur par défaut sinon pas d'aspects affichés !)
            for (i=0;i<=8;i++){
                document.getElementById("labelA"+i).textContent=aspects[i];
                if (b[i+5]) document.getElementById("numA"+i).value=b[i+5];
                else document.getElementById("numA"+i).value=orbes[i];
            }
    }
    
    function onError(error) {
        console.log(`Error: ${error}`);
    }
    var getting = browser.storage.local.get("zodiaque");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("boutonSauve").addEventListener("click", saveOptions);
