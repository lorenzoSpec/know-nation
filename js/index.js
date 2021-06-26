
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

  if(name.length !== 0){
    nation(name);
    removeSect();
  } else {
    console.log('none');
  }
}

/* fetch the api with given name */
async function nation(nameGiven) {
  darkenScreen();

  let nameToNation = await fetch(`https://api.nationalize.io/?name=${nameGiven}`).catch(handleErr);
  let res = await nameToNation.json();

  if(res.country.length === 0){
    console.log("ERROR", nameGiven);
    noNameServer(nameGiven)
  } else {
    let isos = await res.country;
    createGuess(isos);
  }

  removeDarkScrn();
}

function noNameServer(nameGiven) {
  const P = document.createElement('p');
  P.setAttribute('id', "no-name-like-that");
  let pTxt = document.createTextNode(`Hmm, ${nameGiven} I don't know that name!`);
  P.appendChild(pTxt);
  BD.appendChild(P);
  tryNewName();
}

/* handle error if thre is an error on fetching the API */
function handleErr(err){
  console.warn(err);
  let res = new Promise(
    JSON.stringify({
      message: "An error occur!"
    })
  );
  return res;
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

  BD.appendChild(CONT);

  BTNG.addEventListener('click', function(){greatGuess(isos)});
  BTNN.addEventListener('click', function(){noBtn(isos)});

  text(isos);
}

/* to show what country it is */
let counter = [];
let countryName = [];

async function text(isos){

  let cLength = counter.length;

  let isoCurrent = "";
  if(isos.length > 0){
    try {
      isoCurrent = isos[cLength].country_id;
    } catch(err) {
      removeGuessDiv();
      wrongGuess();
    }
  } 

  flag(isoCurrent);
  await isoToFull(isoCurrent);
  console.log('text was called');
  return diffText(cLength, countryName[countryName.length - 1]);
}

async function isoToFull(isoCurrent){
  let cName = await fetch(`https://api.first.org/data/v1/countries?q=${isoCurrent}`);
  let cJson = await cName.json();
  let cObj = await cJson.data[isoCurrent];
  let countryNameA = await cObj.country;  
  countryName.push(countryNameA);
}

function diffText(cLength, fllNm){
  let pGuess = document.getElementById('guess-p');

  switch(cLength){
    case 0:
      return pGuess.textContent = `I think it is ${fllNm}`;
    case 1:
      return pGuess.textContent = `Ow I'm sure it's ${fllNm}`;
    case 2: 
      return pGuess.textContent = `Last guess!, ${fllNm}`;
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

/* no button */
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

/* remove the guess div */
function removeGuessDiv(){
  document.getElementById('guess-div').remove();
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

    GUESS IS CORRECT

  ===========================================*/

async function greatGuess(isos){

  let varProb = showProb(isos);

  let cLength = counter.length;
  let isoCurrent = "";
  if(isos.length > 0){
    isoCurrent = isos[cLength].country_id;
  } 

  const CONT = document.createElement('div');
  const IMG = document.createElement('img');
  const DIV = document.createElement('div');
  const CNAME = document.createElement('p');
  const IEL = document.createElement('i');
  const PROB = document.createElement('p');

  let probTxt = document.createTextNode("Prob: " + varProb);
  let fullCName = document.createTextNode(countryName[countryName.length - 1]);

  CONT.setAttribute('id', 'great-div');
  IMG.setAttribute('id', 'great-img');
  IMG.setAttribute('src', `https://flagcdn.com/${isoCurrent.toLocaleLowerCase()}.svg`);
  IMG.setAttribute('alt', isoCurrent);
  IMG.setAttribute('width', '300');
  DIV.setAttribute('id', 'great-info-div');
  CNAME.setAttribute('id', 'great-p');
  IEL.setAttribute('class', "fas fa-thumbs-up");
  PROB.setAttribute('id', 'prob-p');

  CONT.appendChild(IMG);
  DIV.appendChild(CNAME);
  DIV.appendChild(IEL);
  CONT.appendChild(DIV);
  CONT.appendChild(PROB);

  PROB.appendChild(probTxt);
  CNAME.appendChild(fullCName);

  BD.appendChild(CONT);

  tryNewName();
  removeGuessDiv();
}

function showProb(isos){
  let cLth = counter.length;
  let probCurrent = "";
  if(isos.length > 0){
    probCurrent = isos[cLth].probability;
  } 

  return probCurrent;
}


/*===========================================

    GUESSES ARE WRONG

  ===========================================*/

function wrongGuess() {
  const AEL = tryNewName();

  const CONT = document.createElement('div');
  const IEL = document.createElement('i');
  const PEL = document.createElement('p');

  let pTxt = document.createTextNode('Aw! all my guesses are wrong');

  CONT.setAttribute('id', 'wrong-guess');
  IEL.setAttribute('class', 'fas fa-sad-cry');
  PEL.setAttribute('id', 'wrong-p');

  PEL.appendChild(pTxt);

  CONT.appendChild(IEL);
  CONT.appendChild(AEL);
  CONT.appendChild(PEL);

  BD.appendChild(CONT);
}

/* reusable try new name link */
function tryNewName(){
  const AEL = document.createElement('p');
  let aTxt = document.createTextNode('Try other name');

  AEL.setAttribute('id', 'new-name');
  AEL.setAttribute('title', 'play with other names');
  AEL.appendChild(aTxt);

  AEL.addEventListener('click', function(){
    location.reload();
  });
  
  return BD.appendChild(AEL);
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