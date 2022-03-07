////////////////////
//
// MAIN
//
////////////////////

//
// INCLUDES:
//
//const NWT  = require('./nahuatl_tools.js');
//const NOCE = require('./noce.js');

// ES6 import:
import * as NWT  from './nahuatl_tools.js';
import * as NOCE from './noce.js';
import { tty_color as TTYC } from './tty_color.js';

// Standard file system stuff, fs:
import * as fs from 'fs';

const optionList = 'all ack hasler sep trager ipa iph atom allo';

function printUsage(){
  // Localize the usage message at least for spanish and english:
  const env = process.env;
  const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
  if(language.match(/^es_/)){
    // SPANISH LANGUAGE:
    console.log(`${TTYC.green}ncv ${TTYC.magenta}(c) 2021, 2022 por Edward H. Trager. Todos los derechos reservados.${TTYC.reset}`);
    console.log(`${TTYC.green}USO: node ncv.js (runF2M) <orthografía> <fichero o frase>${TTYC.reset}`);
    console.log(`${TTYC.blue}       opciones de ortografía: ${optionList}${TTYC.reset}`);
  }else{
    // ENGLISH OTHERWISE:
    console.log(`${TTYC.green}ncv ${TTYC.magenta}(c) 2021, 2022 by Edward H. Trager. All Rights Reserved.${TTYC.reset}`);
    console.log(`${TTYC.green}USAGE: node ncv.js (runF2M) <orthography> <file or phrase>${TTYC.reset}`);
    console.log(`${TTYC.blue}       orthography options: ${optionList}${TTYC.reset}`);
  }
}

if(process.argv.length<4){
  printUsage();
  process.exit(1);
}

//
// Should we run the F=>M pipeline first?
// CHECK IF PREOPTION WAS SPECIFIED:
let runF2M=false;
if(process.argv.length===5){
  if(process.argv[2]==='runF2M'){
    runF2M=true;
  }else{
    printUsage();
    console.error('The only allowed pre-option directive is "runF2M"');
    process.exit(1);
  }
}

// GRAB THE ORTHOGRAPHY AND FILEORPHRASE OPTIONS:
let option='';
let fileOrPhrase='';
if(process.argv.length===5){
  option       = process.argv[3];
  fileOrPhrase = process.argv[4];
}else{
  option       = process.argv[2];
  fileOrPhrase = process.argv[3];
}

if(!optionList.includes(option)){
  console.log(`Sorry, "${option}" is not a valid option`);
  printUsage();
  process.exit(1);
}

let input='';
// See if input is a valid file name:
// Synchronous file reading is good enough for now:
if(fs.existsSync(fileOrPhrase)){
 // Read file:
 const buffer = fs.readFileSync(fileOrPhrase);
 input = buffer.toString();
}else{
 input=fileOrPhrase;
}
//
// As currently written, convertNahuatl always does
// all of the conversions:
//
const result = NOCE.convertNahuatl(input,runF2M);
if(option==='all'){
  console.log(result);
}else{
  console.log(result[option]);
}
process.exit(0);

