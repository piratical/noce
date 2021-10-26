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

import * as NWT  from './nahuatl_tools.js';
import * as NOCE from './noce.js';


if(process.argv.length!=3){
  console.log("Please specify a word or phrase to convert on the command line.");
  process.exit(1);
}

const input=process.argv[2];
//console.log(`INPUT: ${input}`);
const result = NOCE.convertNahuatl(input);

console.log(result);
process.exit(0);

