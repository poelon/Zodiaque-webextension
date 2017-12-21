
//traductions
 var label=browser.i18n.getMessage("options").split(",");
 document.getElementById("labelPlace").textContent=label[0];
 document.getElementById("bouton").textContent=label[1];
 
function saveOptions(e) {
    var clef="zodiaque";
    var valeur=[];
    var a=["#place","#utcDef","#latDef","#longDef"];
    for (var i=0;i<=3;i++){
        valeur[i]=document.querySelector(a[i]).value;
    }
    e.preventDefault();
    var storing=browser.storage.local.set({[clef] : valeur});
}

function restoreOptions() {

  function setCurrentChoice(result) {
    var a=["#place","#utcDef","#latDef","#longDef"];
    var b=[];
    var objTest = Object.keys(result);
        if (objTest.length){b=result.zodiaque;}
    for (var i=0;i<=3;i++){
        document.querySelector(a[i]).value = b[i];
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }
  var getting = browser.storage.local.get("zodiaque");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
