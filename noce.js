//////////////////////////////////////////////////////////////
//
// NOCE
//
// Nahuatl Orthography Conversion Engine
//
// (c) 2019, 2020, 2021 by Edward H. Trager.
// 
//////////////////////////////////////////////////////////////

//
// INCLUDES
//
//const NWT = require('./nahuatl_tools.js');

// ES6 import:
import * as NWT from './nahuatl_tools.js';

const nab = NWT.nab;
const nwt = NWT.nwt;
const alo = NWT.alo;

// Experimental:
//const gmn = require('./geminate.js').gmn;
import { gmn } from './geminate.js';

////////////////////////////////////////////////////////////////
//
// convertNahuatl()
//
// => This pipeline now generally handles capitalization and
//    punctuation correctly.
//
// => THE GENERAL APPROACH HERE IS AS FOLLOWS:
//
//    1. We split the input string into METAWORDs. METAWORDs
//       have an element which places the word into the normalized
//       ATOMIC orthography.
//
//    2. We don't know if the input string was provided in an
//       "M" (morphophonemic) or "F" (phonetic) orthography, but
//       what we try to do is convert the input, to the extent
//       possible, into an "M" morphonemic form. This entails
//       making sure, *inter alia*, that words like 'kali' and 'kuali' are 
//       geminated to the "M"-form 'kalli' and 'kualli', respectively.
//
//    3. Once we have the ATOMIC words in "M" form (or as close to 
//       "M" form as we can get, then we can also construct an
//       ALLOPHONIC "F" form, also in the ATOMIC orthography.
//
//    4. With both "M" and "F" forms available, it is a straightforward
//       task to output the entire string in any "M" or "F" orthography.
//
//    5. We can also build "M"-based and "F"-based international
//       phonetic alphabet (IPA) outputs.  The "M" based output is
//       simply called "IPA" while the "F"-based output is here 
//       called "IPH".
//
////////////////////////////////////////////////////////////////
function convertNahuatl(inString){

  if(!inString){
    return;
  }
  //
  // 2021.11.25.ET ADDENDUM: the splitToMetaWords() function
  // relies on the presence of spaces between words. If the
  // inString is just a list of words from a file and only has 
  // carriage returns at the end of each line and no spaces, e.g.
  // if inString looks like this:
  // "tsitsimitl\nyejyektsij\npilsiuatsijtsi\nmichih\nnoçivatzih"
  // ... then the splitToMetaWords function is not going to parse
  // correctly. If we make '\n' act like just another "white
  // space" character, then we lose the formatting of simple word
  // lists like this. A reasonable solution —which we implement 
  // here— is to convert all '\n' to ' \n' —that is, we just add
  // a space before each new line. So now all the words in the word
  // list have a space after them, and the '\n' gets treated as 
  // a "prefixed" punctuation and the list formatting is then
  // preserved:
  inString = inString.replace(/\n/g,' \n');
  
  // CREATE RESULT SET CONTAINERS:
  let hmod=''; // Hasler Modern
  let sep =''; // SEP
  let ack =''; // ACK
  let tmod=''; // Trager Modern
  let ipa =''; // IPA
  let atom=''; // Atomic
  let allo=''; // Allophonic
  let iph =''; // IPA *PHONETIC* <= This is much better than the plain old IPA because it is based on the allophones
  
  ///////////////////////////////////////////
  //
  // SET UP BEFORE ITERATING OVER METAWORDS:
  //
  ///////////////////////////////////////////
  
  //
  // LL2HL SETUP: Allophone rule for words like 
  // 'illia' and 'illamiki' which become 'ihlia' and
  // 'ihlamiqui' respectively.
  //
  // NOTA BENE: For this rule, we need to construct
  // a regex because the "exclude" words might have
  // prefixes or suffixes:
  //
  const ll2hlExcluder = nwt.arrayToOptionString(alo.ll2hl.exclude);
  const ll2hlExcluderRegex = new RegExp(ll2hlExcluder);
  
  //
  // L2LL SETUP: Geminate words like 'kali' to 'kalli' etc.
  //
  const l2llExcluder = nwt.arrayToOptionString(alo.l2ll.exclude);
  // NOTA BENE HOW WE HAVE ADDED "ELI" AS AN ISOLATED WORD HERE:
  const l2llExcluderRegex = new RegExp( '^eli$|(' + l2llExcluder + ')$' );
  
  //
  // HK2WK SETUP: Back convert preterit verb forms like 'pehki' to 'pewki'
  //
  const hk2wkExcluder = nwt.arrayToOptionString(alo.hk2wk.exclude);
  const hk2wkExcluderRegex = new RegExp( '(' + l2llExcluder + ')$' );

  ///////////////////////////////////////////////////////////////////
  // 
  // SPLIT STRING INTO METAWORDS:
  //
  // 2021.10.12.ET: NFC Normalization moved here:
  // NFC in particular is needed to recognize the 
  // long vowels correctly.
  //
  ///////////////////////////////////////////////////////////////////
  const metaWords = nwt.splitToMetaWords(inString.normalize('NFC'));
  
  ////////////////////////////////////
  //
  // START ITERATING OVER METAWORDS:
  //
  ////////////////////////////////////
  for(const metaWord of metaWords){
    // CONVERT WORDS TO OUTPUT ORTHOGRAPHIES:
    
    // EXPERIMENTAL: See if the word should have a geminated consonant:
    // NB: This has only limited utility at the moment. Might be better
    // to remove it altogether ... but it is harmless ...
    //metaWord.atomic = gmn.findGeminate(metaWord.atomic);

    // THE FOLLOWING APPROACH TO RE-GEMINATION MAY BE BETTER:
    
    ////////////////////////////////////////////////////////////////////
    //
    // "F" TO "M" RULE: [AEIO]LI => [AEIO]LLI
    //
    // HERE WE RECOGNIZE that in general most words that end in
    // a vowel + li should be geminated. There is a small list
    // of words that should *not* be geminated, and we exclude those:
    // 
    ////////////////////////////////////////////////////////////////////
    if(!metaWord.atomic.match(l2llExcluderRegex)){
      metaWord.atomic = nwt.atomicL2LLGeminator(metaWord.atomic);
    }
    ////////////////////////////////////////////////////////////////////
    //
    // "F" TO "M" RULE: HK(I|EH) => WK(I|EH)
    //
    // Preterit verb forms like 'pehki' and 'kohkeh' are derived from
    // verbs whose stems end in /w/: pewa, kowa, etc. Therefore, we should
    // safely be able to back-convert the [h] in the coda of the syllable
    // preceding the preterit ending ki (singular) or keh (plural) to
    // the labialized (rounded lips) /w/ phoneme:
    //
    ////////////////////////////////////////////////////////////////////
    if(!metaWord.atomic.match(hk2wkExcluderRegex)){
      metaWord.atomic = nwt.atomicHK2WKLabializor(metaWord.atomic);
    }
    ////////////////////////////////////////////////////////////////////
    //
    // "F" TO "M" RULE: TERMINAL "H" => TERMINAL "W"
    //
    // This covers common words like 'tonatih' and '-coneh'
    //
    // The list of included words that will be converted is quite small
    // and may not be comprehensive. 
    //
    // NOTA BENE: This MUST precede the call to nwt.atomicAllophoneH2N()
    //
    ////////////////////////////////////////////////////////////////////
    metaWord.atomic = nwt.atomicAllophoneH2W(metaWord.atomic);
    
    ////////////////////////////////////////////////////////////////////
    //
    // "F" TO "M" RULE: TERMINAL "H" => TERMINAL "N"
    //
    // NOTA BENE: This rule is hard to do comprehensively. But we
    // can most certainly handle the easy cases like 'tzih' => 'tzin',
    // etc.:
    //
    ////////////////////////////////////////////////////////////////////
    metaWord.atomic = nwt.atomicAllophoneH2N(metaWord.atomic);
    
    ////////////////////////////////////////////////
    //
    // SET UP 'allophonic' TO HOLD THE ALLOPHONIC
    // VERSION OF EVERYTHING. This is the version in 
    // which all allophone rules are applied for "F"
    // phonetic orthographies like SEP and Hasler.
    //
    // APPLY ALLOPHONE RULES, EXCEPT WHEN EXCLUSIONS APPLY:
    //
    ////////////////////////////////////////////////
    let allophonic = metaWord.atomic;
    
    //
    // /ll/ TO [hl] RULE: For verbs like 'illia'=>'ihlia'
    // and 'illamiki'=>'ihlamiki'
    //
    if(!allophonic.match(ll2hlExcluderRegex)){
      allophonic = nwt.atomicAllophoneLL2HL(allophonic);
    }
    
    //
    // TERMINAL /n/ TO [h] RULE:
    //
    // NOTA BENE: For this rule, we can 
    // directly look up the full word in the 
    // alo.n2h.exclude object map:
    //
    if(!alo.n2h.exclude[allophonic]){
      allophonic = nwt.atomicAllophoneN2H(allophonic);
    }
    //
    // /w/ AS CODA TO [h] RULE: No exclusions that I know of:
    //
    allophonic = nwt.atomicAllophoneW2H(allophonic);
    //
    // /kw/ AS CODA TO [k] RULE: No exclusions that I know of:
    //
    allophonic = nwt.atomicAllophoneKw2K(allophonic);
    
    // FINALLY WE CAN CONVERT FROM ALLOPHONIZED
    // ATOMIC TO DESTINATION "F" ORTHOGRAPHIES:
    
    // FOR HASLER, DO *NOT* DEGEMINATE:
    let hhmod  = nwt.atomicToHaslerModern( allophonic );
    
    // ONLY SEP DEGEMINATES:
    let ssep   = nwt.atomicToSEP( nwt.atomicToDegeminate(allophonic) );
    
    //////////////////////////////////////////
    //
    // "M" (MORPHOPHONEMIC) ORTHOGRAPHIES:
    //
    //////////////////////////////////////////
    let aack   = nwt.atomicToACK( metaWord.atomic );
    let ttmod  = nwt.atomicToTragerModern( metaWord.atomic );
    
    // IPA:
    let iipa   = nwt.atomicToIPA( metaWord.atomic );
    
    // ATOMIC (NO CHANGE):
    let aatom  = metaWord.atomic;
    
    ////////////////////////////////////
    //
    // READY TO ACCUMULATE RESULTS:
    //
    ////////////////////////////////////
    
    //
    // 1. Add back in any prefixes from the
    //    original metaWord:
    if(metaWord.prefixed){
      hmod += metaWord.prefixed;
      sep  += metaWord.prefixed;
      ack  += metaWord.prefixed;
      tmod += metaWord.prefixed;
      //ipa  += metaWord.prefixed;
      //atom += metaWord.prefixed;
      //allo += metaWord.prefixed;
    }
    
    //
    // 2. Add the word to the accumulator:
    //    If the original was capitalized,
    //    capitalize it again:
    //
    // 2021.11.20.ET: Handle immutable words
    // to prevent spelling changes:
    // 
    // However, since Trager's orthography uses
    // non-Latin symbols, we *do* want to convert tmod
    // "immutable"s:
    //
    if(metaWord.isImmutable){
      // DEBUG: console.log(`IMMUTABLE: |${metaWord.word}|`);
      
      // Because names are tagged as "immutable",
      // for the Latin-based orthographies
      // we let them "pass through" unchanged:
      hmod += metaWord.word;
      sep  += metaWord.word;
      ack  += metaWord.word;
      ipa  += metaWord.word;
      atom += metaWord.word;
      allo += metaWord.word;
      //
      // However —as mentioned— in the case of Trager orthography, 
      // we *DO* want to convert and, since we know with certainty
      // that it is an immutable, we also check whether we can 
      // prefix the word with a properName, place, or deity prefix:
      //
      if( metaWord.isDeityName ){
        //console.log(`DEITY: ${metaWord.word}`);
        tmod += nab.prefixDeity + ttmod;
      }else if( metaWord.isPlaceName ){
        //console.log(`PLACE: ${metaWord.word}`);
        tmod += nab.prefixPlace + ttmod;
      }else if( metaWord.isProperName ){
        //console.log(`PROPER NOUN: ${metaWord.word}`);
        tmod += nab.prefixName + ttmod;
      }else{
        // We know only that it is immutable, 
        // but we do not know for sure what kind of name 
        // it is. At this point, we think it is best to 
        // prefix it with the generic name prefix:
        //console.log(`NOT SURE WHAT KIND OF NAME: ${metaWord.word}`);
        tmod += nab.prefixName +nab.prefixName + ttmod;
      }
      
    }else if(metaWord.flic){
      // FLIC: First letter is capitalized, so:
      
      // Hasler Modern:
      hmod += nwt.capitalize(hhmod);
      // SEP:
      sep  += nwt.capitalize(ssep );
      // ACK:
      ack  += nwt.capitalize(aack );
      // IPA: ignore capitalization for IPA:
      ipa  += iipa;
      // ATOM: Treat just like the others so that examples with names can be atomized:
      atom += nwt.capitalize(aatom);
      // ALLO:
      allo += nwt.capitalize(allophonic);
      //
      // TRAGER ORTHOGRAPHY does not capitalize but uses symbolic prefixes
      //
      // NOTA BENE: Test for deity first because a few deity names look like 
      // they have place name suffixes:
      //
      if( metaWord.isDeityName ){
        tmod += nab.prefixDeity + ttmod;
      }else if( metaWord.isPlaceName ){
        tmod += nab.prefixPlace + ttmod;
      }else if( metaWord.isProperName ){
        tmod += nab.prefixName + ttmod;
      }else{
        // Capitalized but classified:
        // This occurs at the beginnings of
        // sentences and is normal, so
        // just add the word with no prefix:
        tmod += ttmod;
      }
    }else{
      // NOT CAPITALIZED:
      hmod += hhmod;
      sep  += ssep ;
      ack  += aack ;
      tmod += ttmod;
      // IPA: ignore capitalization for IPA:
      ipa  += iipa;
      // ATOM: also ignoring capitalization:
      atom += aatom;
      allo += allophonic;
    }
    
    //
    // 3. Add back in any postfixes from the
    //    original metaWord:
    if(metaWord.postfixed){
      hmod += metaWord.postfixed;
      sep  += metaWord.postfixed;
      ack  += metaWord.postfixed;
      tmod += metaWord.postfixed;
      //ipa  += metaWord.postfixed;
      //atom += metaWord.postfixed;
      //allo += metaWord.postfixed;
    }
    
    //
    // 4. Add space after the word:
    //
    hmod += ' ';
    sep  += ' ';
    ack  += ' ';
    tmod += ' ';
    ipa  += ' ';
    atom += ' ';
    allo += ' ';
  }
  // END OF for metaWord of metaWords LOOP

  // Show the results:
  //ta_hasler.value = hmod;
  //ta_sep.value    = sep;
  //ta_ack.value    = ack;
  //ta_trager.value = tmod;
  hmod = hmod.trim();
  sep  = sep.trim();
  ack  = ack.trim();
  tmod = tmod.trim();
  ipa  = ipa.trim();
  atom = atom.trim();
  allo = allo.trim();
  // 2021.10.12.ET Addendum: Fill in IPA Phonetic based on the allo data:
  // 2021.11.15.ET Addendum: Also iph needs to be all lower-case, just like IPA:
  iph  = nwt.atomicToIPAPhonetic(allo.toLowerCase());
  
  return { 
    ack:ack,
    trager:tmod,
    hasler:hmod,
    sep:sep,
    atom:atom,
    allo:allo,
    ipa:ipa,
    iph:iph
  };
}

//
// EXPORTS:
//
//exports.convertNahuatl = convertNahuatl;

// ES6 export:
export { convertNahuatl }
