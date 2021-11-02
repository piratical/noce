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

// Standard file system stuff, fs:
import * as fs from 'fs';

const optionList = 'all ack hasler sep trager ipa iph atom allo';

function printUsage(){
  console.log('ncv (c) 2021 by Edward H. Trager. All Rights Reserved.');
  console.log(`USAGE: node ${process.argv[1]} <orthography> <file or phrase>`);
  console.log(`       orthography options: ${optionList}`);
}

if(process.argv.length!=4){
  printUsage();
  process.exit(1);
}

const option = process.argv[2];
if(!optionList.includes(option)){
  console.log(`Sorry, "${option}" is not a valid option`);
  printUsage();
  process.exit(1);
}

const fileOrPhrase = process.argv[3];
let input='';
// See if input is a valid file name:
// Synchronous file reading is good enough for now:
if(fs.existsSync(fileOrPhrase)){
 // Read file:
 input = fs.readFileSync(fileOrPhrase);
}else{
 input=fileOrPhrase;
}
//
// As currently written, convertNahuatl always does
// all of the conversions:
//
const result = NOCE.convertNahuatl(input);
if(option==='all'){
  console.log(result);
}else{
  console.log(result[option]);
}
process.exit(0);

