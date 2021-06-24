
/* ===========================================

    GLOBAL VARIABLES

   ===========================================*/

const CONFIRM = document.getElementById('confirm');
const BD = document.getElementById('body');
let ctrC = [];
let savedName = [];

/*===========================================

    CODE FOR GUESSING  

  ===========================================*/

/* get the name given by user and display guesses */
function nameInput(){
  let inputNameVar = document.getElementById("input-name");

  let name = "";
  if(savedName.length === 0){
    savedName.push(inputNameVar.value);
    name = savedName[0];
    removeSect();
  } else if (savedName.length > 0) {
    name = savedName[0];
  }
  
  nation(name);
}

/* fetch the api with given name */
async function nation(nameGiven){
  darkenScreen();

  let nameToNation =  await fetch(`https://api.nationalize.io/?name=${nameGiven}`);
  let res = await nameToNation.json();
  let ctry = await res.country;

  removeDarkScrn();
  text(ctry);
}

/* to show what country it is */
async function text(c){
  console.log(ctrC.length);
  let cCode = "";
  if(c.length > 0){
    cCode = c[ctrC.length].country_id;
  } 
  console.log('cCode', cCode);

  let cName = await fetch(`https://api.first.org/data/v1/countries?q=${cCode}`);
  let cJson = await cName.json();
  let cObj = await cJson.data[cCode];
  let countryName = await cObj.country;  

  console.log(countryName);
  createGuess(countryName, cCode);
}

/* create a DOM for guess */
function createGuess(country, cCode){
  let flg = flag(cCode);

  const CONT = document.createElement('div');
  const IMG = document.createElement('img');
  const PEL = document.createElement('p');
  const DIV = document.createElement('div');
  const BTNG = document.createElement('button');
  const BTNN = document.createElement('button');

  let PTXT = document.createTextNode(`I think it is ${country}`);
  let GTXT = document.createTextNode('Great!');
  let NTXT = document.createTextNode('No');

  CONT.setAttribute('id', 'guess-div');
  IMG.setAttribute('id', 'ctry-flag');
  IMG.setAttribute('src', flg);
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

  BTNN.addEventListener('click', noBtn);

  BD.appendChild(CONT);
}

function noBtn(){
  ctrC.push(0);
  console.log(ctrC);
  nameInput();
}

/* function for dynamic showing of flag depends on name */
function flag(cCode){
  let f = cCode;
  
  let src = '';
  if(f.length > 0){
    src = `https://flagcdn.com/${f.toLocaleLowerCase()}.svg`;
  }

  return src;
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