
/* ===========================================

    GLOBAL VARIABLES

   ===========================================*/

const CONFIRM = document.getElementById('confirm');
const BD = document.getElementById('body');

/*===========================================

    CODE FOR GUESSING  

  ===========================================*/

/* get the name given by user and display guesses */
function nameInput(){
  let inputNameVar = document.getElementById("input-name");
  let name = inputNameVar.value;

  removeSect();
  nation(name);
}

/* fetch the api with given name */
async function nation(nameGiven){
  darkenScreen();

  let nameToNation =  await fetch(`https://api.nationalize.io/?name=${nameGiven}`);
  let res = await nameToNation.json();
  let isos = await res.country;

  removeDarkScrn();
  createGuess(isos);
}

/* create a DOM for guess */
function createGuess(isos){
  const CONT = document.createElement('div');
  const IMG = document.createElement('img');
  const PEL = document.createElement('p');
  const DIV = document.createElement('div');
  const BTNG = document.createElement('button');
  const BTNN = document.createElement('button');

  let PTXT = document.createTextNode("");
  let GTXT = document.createTextNode('Great!');
  let NTXT = document.createTextNode('No');

  CONT.setAttribute('id', 'guess-div');
  IMG.setAttribute('id', 'ctry-flag');
  IMG.setAttribute('src', "");
  IMG.setAttribute('width', '300');
  PEL.setAttribute('id', 'guess-p');
  DIV.setAttribute('id', 'great-no');
  BTNG.setAttribute('id', 'great-btn');
  BTNN.setAttribute('id', 'no-btn');

  CONT.appendChild(IMG);
  CONT.appendChild(PEL);
  DIV.appendChild(BTNG);
  DIV.appendChild(BTNN);
  CONT.appendChild(DIV);

  PEL.appendChild(PTXT);
  BTNG.appendChild(GTXT);
  BTNN.appendChild(NTXT);

  BTNN.addEventListener('click', function(){noBtn(isos)});

  BD.appendChild(CONT);

  text(isos);
}



/* to show what country it is */
let counter = [];

async function text(isos){

  let pGuess = document.getElementById('guess-p');
  let cLength = counter.length;

  let isoCurrent = "";
  if(isos.length > 0){
    try {
      isoCurrent = isos[cLength].country_id;
    } catch(err) {
      document.getElementById('guess-div').remove();
      wrongGuess();
    }
  } 

  let cName = await fetch(`https://api.first.org/data/v1/countries?q=${isoCurrent}`);
  let cJson = await cName.json();
  let cObj = await cJson.data[isoCurrent];
  let countryName = await cObj.country;  

  flag(isoCurrent);

  switch(cLength){
    case 0:
      return pGuess.textContent = `I think it is ${countryName}`;
    case 1:
      return pGuess.textContent = `Ow I'm sure it's ${countryName}`;
    case 2: 
      return pGuess.textContent = `Last guess!, ${countryName}`;
    default:
      return pGuess.textContent = `Please check the spelling of your name`;
  }
}

/* function for dynamic showing of flag depends on name */
function flag(isoCurrent){
  let f = isoCurrent;
  let imgGuess = document.getElementById('ctry-flag');
  
  if(f.length > 0){
    imgGuess.src = `https://flagcdn.com/${f.toLocaleLowerCase()}.svg`;
  }
}

function noBtn(isos){
  counter.push(0);
  text(isos);
}

/* to darken the screen */
function darkenScreen(){
  const darkScrn = document.createElement('div');
  darkScrn.setAttribute('id', 'dark-screen');
  BD.appendChild(darkScrn);
}

/* remove section from page */
function removeSect(){
  document.getElementById('input-name-cont').remove();
}

/* remove dark sreen div from page */
function removeDarkScrn(){
  document.getElementById('dark-screen').remove();
}

/*===========================================

    GUESSES ARE WRONG

  ===========================================*/

  function wrongGuess(){
    const CONT = document.createElement('div');
    const IEL = document.createElement('i');
    const PEL = document.createElement('p');
    const AEL = document.createElement('p');

    let aTxt = document.createTextNode('Try other name');
    let pTxt = document.createTextNode('Aw! all my guesses are wrong');

    CONT.setAttribute('id', 'wrong-guess');
    IEL.setAttribute('class', 'fas fa-sad-cry');
    PEL.setAttribute('id', 'wrong-p');
    AEL.setAttribute('id', 'new-name');

    AEL.appendChild(aTxt);
    PEL.appendChild(pTxt);

    AEL.addEventListener('click', function(){
      location.reload();
    });

    CONT.appendChild(IEL);
    CONT.appendChild(AEL);
    CONT.appendChild(PEL);

    BD.appendChild(CONT);
  }

/*===========================================

    SHORTCUT KEYS 

  ===========================================*/

/* shortcut for enter */
function entr(e){
  if(e.code === "Enter"){
    nameInput();
  }
}

/*===========================================

   EVENT LISTENERS

  ===========================================*/

/* add events on the page */
document.addEventListener('keyup', entr);
CONFIRM.addEventListener('click', nameInput);


/* clear events on page */
function clearEvents(){
  document.removeEventListener('keyup', entr);
  CONFIRM.removeEventListener('click', nameInput);
}

window.addEventListener('beforeunload', clearEvents);