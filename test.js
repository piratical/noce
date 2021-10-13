////////////////////
//
// MAIN
//
////////////////////

//
// INCLUDES:
//
const NWT  = require('./nahuatl_tools.js');
const NOCE = require('./noce.js');

if(process.argv.length!=3){
  console.log("Please specify a word or phrase to convert on the command line.");
  return 1;
}

const input=process.argv[2];
console.log(`INPUT: ${input}`);
const result = NOCE.convertNahuatl(input);

//let stripped = NWT.nwt.stripPunctuation(input);
//console.log(stripped);

console.log(result);
return 0;

