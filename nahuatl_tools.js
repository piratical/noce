///////////////////////////////////////
//
// nahuatl_tools.js
//
// (c) 2019, 2020, 2021 by Edward H. Trager
//     ALL RIGHTS RESERVED
//
// (c) 2019, 2020, 2021 por Edward H. TRAGER
//     TODOS LOS DERECHOS RESERVADOS
//
// This is FREE/LIBRE SOFTWARE published 
// under the GNU GPL License version 2.0
// or later.
//
// Este es software LIBRE publicado bajo 
// la licencia GNU GPL versión 2.0 
// o posterior.
//
// INITIAL CREATION DATE: 2019.09.13 ET
// LAST NOTED UPDATE: 2019.12.05.ET
// (SOME UPDATES MAY NOT BE 'NOTED':
// CHECK GITHUB HISTORY FOR THE AUTHORATIVE
// CHANGE LOG).
//
////////////////////////////////////////

// REQUIRES:
//const nms = require('./names.js').nms;

// ES6 import syntax:
import {nms} from './names.js';

////////////////////////////////////////////////////////////////////
//
// INTRODUCTION
//
// Here we introduce an internal code-use-only 
// "computational orthography" that is
// based on a modern Hasler orthography but where we
// reduce digraphs to single Unicode code points
// with the goal of simplifying the mapping and
// translation code. We currently use a few greek letters
// as 'placeholders' for Náhuatl phonemes which must be 
// written as digraphs in Latin-based orthographies. We call this 
// ATOMIC. The TRAGER orthography, which is included here, is the only 
// "non-computational orthography" that has unique letter symols for 
// all consonantal phonemes, thus eliminating the need for (and unwanted 
// complexity of) digraphs.
//
// With this ATOMIC orthography in place, the general idea is that we
// should be able —within reasonable bounds— to "map" almost *any*
// colonial-era or modern written representation of Nahuatl language
// into the ATOMIC orthography. From the ATOMIC representation,
// we can then run the mapping process the other way to produce output
// in any desired orthographic format. In practice, we limit the
// output formats to well-known orthographies: Hasler modern, ACK, SEP,
// —and of course also to the TRAGER orthography.
//
// Here is a summary diagram of this process:
//
//             COLONIAL-ERA           HASLER     INTERNET
//               NAHUATL       SEP    MODERN     INTUITIVE    ACK
//                 |            |       |            |         |
//                 +------------+-------+------------+---------+
//                                      |
//                                      V
//                                    ATOMIC
//                                      |
//                                      V
//                                      |
//                     +-------+--------+-------+--- ... -----+
//                     |       |        |       |             |
//                     V       V        V       V             V
//                   HASLER   ACK     TRAGER   SEP          (ETC.)
//
//
// It sounds simple, right? But of course the "devil is in the 
// details." For example, the code now includes a lookup-table of
// common names of people, so that we can intentionally avoid
// "converting" the spelling of people's names. Also, there is
// a lookup-table for the names of Aztec gods and dieties. And there
// is a heuristic function for place names. With these, we can
// look for capitalized words in a text and at least somewhat 
// heuristically decide what to do with them. For example, the TRAGER
// orthography does not have upper-case vs. lower-case 
// letters, but it does have a special set of prefix characters for
// marking names of people, names of deities, and place names. So
// the code here will mark off such names, although naturally it 
// can only do so within the mechanical limitations of the lookup
// tables and heuristics. Nevertheless, this feature saves time and
// reduces the amount of manual editing required. For the other
// orthographies, the main thing is to preserve capitalization and
// avoid unecessary conversions on the spellings of proper names.
//
// Note that recently we have been paying much more attention to 
// how the allophones work, or at least how the allophones appear
// to work in the Nahuatl of the northern part of the state of Veracruz
// near Chicontepec and surrounding areas. Based on this work, we
// can describe two classes of mappings:
//
// (1) "M" to "F" Mapping: This is the easier of the two classes of
// mapping and this one can be fully automated. When our source
// is in an "M" (morphophonemic) orthography (e.g., ACK or Trager),
// then we can fairly accurately map this to "F" (phonetic) orthographies
// like SEP or Hasler "intuitive" where words are spelled according to
// pronounciation. We just need to know what the allophone rules are
// and we should achieve fairly good results. As of this writing
// (2021.10.12), I think we cover the most common allophone
// rules. There may be less common rules that we don't yet cover,
// but we should be able to improve the code as we learn more.
//
// (2) "F" to "M" Mapping: "F" to "M" mapping is much more difficult and
// I think the best current solution is to try to avoid having do it.
// "F" to "M" mapping means taking a text in something like SEP and
// converting it to ACK or TRAGER. Too much information is missing
// so you cannot do it well using traditional deterministic algorithms
// such as we have written here. A Deep Learning approach would work, but
// we are not there yet. If your processing pipeline allows
// you to do manually editing, then OK, go ahead: you can do a "first pass"
// through the pipeline here, and then you'll have to manually edit things
// to get a usable result. If you want something completely automated
// in this "F"=>"M" direction, forget it!
//
////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
//
// STT OF ato definitions section
//
// ==> Classification of letters used
//     for the internal ATOMIC
//     orthography.
//
// ==> Anything not present here
//     should, as a general principle,
//     pass through without change.
//
// ==> Note that now 'b' and 'v' are included
//     as discrete items in the atomic set
//     so that we can preserve the spelling distinctions
//     between them for orthographies like Hasler and SEP
//     but we can still group them together (into the 'β')
//     for the TRAGER orthography (The phoneme-based TRAGER
//     orthography does not differentiate Spanish 'b' from 'v').
//
///////////////////////////////////////////////////////////////
const ato={
  vowels:{
    native:'aeioāēīō', // NB: Vowels with macrons are in Unicode precomposed form NFC
    foreign:'uū'
  },
  consonants:{
    native:'mnptkκτλςsxhlwy',
    foreign:'ñβdgfrρbv'  // NOTA BENE: ADDITION OF 'bv' AT END HERE
  }
};
//
// Convenience groupings:
//
ato.vowels.all     = ato.vowels.native     + ato.vowels.foreign;
ato.consonants.all = ato.consonants.native + ato.consonants.foreign;
ato.all            = ato.vowels.all + ato.consonants.all;
/////////////////////////////////////
//
// END OF ato definitions section
//
/////////////////////////////////////


///////////////////////////////////////////
//
// CURRENT ABUGIDA CODE POINTS SECTION:
//
// Trager's Nahuatl Abugida -> nab
//
///////////////////////////////////////////
const nab={
  ////////////////////////////////////////////////////////////////////
  //
  // CURRENT ABUGIDA CODE ASSIGNMENTS FOR THE TRAGER ORTHOGRAPHY
  //
  // CURRENTLY THESE ARE PRIVATE USE AREA
  // (PUA) ASSIGNMENTS USED IN THE NahuatlOne font.
  //
  // (Assignments taken from Trager's Nahuatl Tools C++ Transcoder)
  //
  ////////////////////////////////////////////////////////////////////
  // Vowels:
  vowelA:'\uED90',
  vowelE:'\uED91',
  vowelI:'\uED92',
  vowelO:'\uED93',
  vowelU:'\uED94',        // FOREIGN VOWEL
  // Long Vowel Sign:
  longVowelSign:'\uED95',
  // Vowel Signs:
  vowelSignA:'\uEDA0',
  vowelSignE:'\uEDA1',
  vowelSignI:'\uEDA2',
  vowelSignO:'\uEDA3',
  vowelSignU:'\uEDA4',
  // Native Consonants:
  consonantMA:'\uEDB0',
  consonantNA:'\uEDB1',
  consonantPA:'\uEDB2',
  consonantTA:'\uEDB3',
  consonantCA:'\uEDB4',
  consonantCUA:'\uEDB5',
  consonantTZA:'\uEDB6',
  consonantTLA:'\uEDB7',
  consonantCHA:'\uEDB8',
  consonantSA:'\uEDB9',
  consonantXA:'\uEDBA',
  consonantHA:'\uEDBB',
  consonantLA:'\uEDBC',
  consonantWA:'\uEDBE',   // Note WA WITZITZILIN (HUITZITZILIN) should come before YA in sorted order
  consonantYA:'\uEDBD',   // Note YA YOHUALLI should be the last letter in the native consonant series
  // Additional Spanish Consonants:
  consonantNYA:'\uEDC0',
  consonantBVA:'\uEDC1',
  consonantDA:'\uEDC2',
  consonantGA:'\uEDC3',
  consonantFA:'\uEDC4',
  consonantRA:'\uEDC5',
  consonantRRA:'\uEDC6',
  // Compound (Dipthong) Vowel Signs:
  vowelSignIA:'\uEDA5',
  vowelSignAI:'\uEDA6',
  vowelSignOA:'\uEDA7',
  vowelSignEO:'\uEDA8',
  vowelSignEI:'\uEDA9',
  vowelSignIO:'\uEDAA', // 2017.01.20.ET addendum
  vowelSignAO:'\uEDAC', // 2019.06.25.ET addendum
  // Subjoiner sign:
  subjoinerSign:'\uEDAB',
  // Special Prefix signs:
  prefixPlace:'\uEDAD',
  prefixName:'\uEDAE',
  prefixDeity:'\uEDAF'
  ///////////////////////////////////////////////////////
  //
  // END OF ABUGIDA CURRENT PUA CODE POINT ASSIGNMENTS
  //
  ///////////////////////////////////////////////////////
};

/////////////////////
//
// nab abugida maps
//
/////////////////////
nab.map={
  atomicVowelToVowelSign:{
    'a':nab.vowelSignA,
    'e':nab.vowelSignE,
    'i':nab.vowelSignI,
    'o':nab.vowelSignO,
    // FOREIGN VOWEL:
    'u':nab.vowelSignU,
    // LONG VOWELS: āēīōū
    'ā':nab.vowelSignA + nab.longVowelSign,
    'ē':nab.vowelSignE + nab.longVowelSign,
    'ī':nab.vowelSignI + nab.longVowelSign,
    'ō':nab.vowelSignO + nab.longVowelSign,
    'ū':nab.vowelSignU + nab.longVowelSign
  },
  atomicVowelPairsToCompoundVowelSign:{
    'ia':nab.vowelSignIA,
    'ai':nab.vowelSignAI,
    'oa':nab.vowelSignOA,
    'eo':nab.vowelSignEO,
    'ei':nab.vowelSignEI,
    'io':nab.vowelSignIO,
    'ao':nab.vowelSignAO
  },
  /////////////////////////////////////////////////////////////////////////////////
  //
  // Zero width "tags" to explicitly indicate proper names and immutability.
  // 
  // These "tags" can be embedded directly in "plain text" to indicate a proper
  // name and whether the spelling of that proper name is "immutable".
  // 
  // There are 2 use cases for these tags:
  // 
  // (1) In a Nahuatl text written in a Latin-based orthography, we can mark
  //     proper names like "Santiago" or place names like "San Luis Potosi" as 
  //     "immutable" in order to prevent re-spelling rules when converting across
  //     orthographies. Thus, in the ACK orthography, we can prevent respellings
  //     like "Zantiago" and "Zan Luiz Potozi".
  //     
  // (2) For the Trager orthography, which does not distinguish between lower-case
  //     and upper-case, special prefixes are used to indicate proper names, place
  //     names, and deity names. These tags can be used to tell the conversion
  //     engine about such names.
  //     
  /////////////////////////////////////////////////////////////////////////////////
  zeroWidthTag:{
    properName:'\u200B', // using UNICODE ZWS  as the proper name    tag
    placeName:'\u200C',  // using UNICODE ZWNJ as the place name     tag
    deityName:'\u200D',  // using UNICODE ZWJ  as the deity name     tag
    isImmutable:'\u200E' // using UNICODE LRM  as the "is immutable" tag
  } 
};
/////////////////////////////////////
//
// END OF nab definitions section
//
/////////////////////////////////////

//////////////////////////////////////
//
// ALLOPHONE AND OTHER RULES 
// AND EXCEPTIONS SECTION: alo
//
// NOTA BENE: BE SURE TO USE ONLY 
// THE ATOMIC ORTHOGRAPHY FOR ALLOPHONE
// AND OTHER RULES:
//
//////////////////////////////////////
const alo={
  // /n/ to [h]:
  n2h:{
    // These are the words that preserve terminal /n/ as [n]
    // of which we are aware. According Andres Ehecatl Aguilar,
    // a lot of these are actually pronounced with the final
    // vowel nasalized, e.g., /aʃt͡ɬen/ is realized as [aʃˈt͡ɬɛ̃].
    // Since this is definitely *not* an aspiration like [h], it
    // is often written in the fonetic 'F' class of orthographies
    // using an "n" ... but perhaps not always. In anycase, in
    // NOCE and Yoltok, we will preserve the phonemic spelling
    // and keep the terminal 'n' on these words:
    exclude:{
      'in':1,
      'wan':1,
      'iwan':1,
      'ken':1,
      'pan':1,
      'ipan':1,
      'λen':1,
      'axλen':1,
      'λan':1,
      'san':1,
      'xillan':1
    }
  },
  w2h:{
    // No exceptions/exclusions
  },
  kw2k:{
    // No exceptions/exclusions
  },
  //
  // NOTA BENE: THIS IS NOT SUFFICIENT:
  // THIS NEEDS TO BE A REGEXP-BASED FUNCTION OR
  // SOMETHING:
  //
  ll2hl:{
    // Words like "illia' and 
    // 'illamiki' are pronounced as
    // 'ihlia' and 'ihlamiki', respectively,
    // because of allophony. The allophony
    // might depend on vowel length, but vowel
    // length is not marked (usually).
    //
    // Other words, like 'milli' have the '*ill*'
    // pattern, but are not pronounced with an /h/
    // preceding the /l/.
    //
    // The following are the words that are known
    // to preserve /ill/ as [il] in ChN
    // and do not convert to [ihl]:
    // NOTA BENE: THIS IS AN ARRAY OF WORDS
    // TO BE USED IN A REGEX:
    exclude:[
      'millah',
      'milli',
      'pilli',
      'xillan',
      'xilli',
      'ςilli',
      'λilli'
    ]
  },
  //////////////////////////////////////////////
  //
  // NOTA BENE: The following may apply when the
  // source orthography is an "F" (phonetic) orthography
  // 
  // NOTA BENE: The following is not an allophone
  // rule, but rather a morphophonemic rule. However
  // we don't have anywhere else to put it at the 
  // moment, so it is going here:
  //
  // When words end in '[v]l[v]$', should we
  // geminate the 'l'? In general, the answer
  // is yes, we should ... except for the 
  // following words or word patterns that,
  // according to IDIEZ' Tlahtolxitlauhcayotl
  // do not geminate. This is therefore an
  // exclusion list:
  //
  //////////////////////////////////////////////
  l2ll:{
    exclude:[
      'piyali',
      '.*weli',
      'eeli',
      'λaeli',
      'λaλaeli',
      '.*kokoyoli',
      'λaxiwiyoli',
      'λayolli',
      'yolli',
      'yoyoli',
      'κamahmanili',
      'weweyakilwili',
      'λaκalλalili'
    ]
  },
  //////////////////////////////////////////////////////
  //
  // Here again ita2itta is really just a gemination
  // rule to use when converting 'F' => 'M'
  // orthography. The words in the exclusion list
  // are the only ones in the IDIEZ dictionary 
  // that are spelled 'ita' in the 'M' orthography
  // so anything else with 'ita' should be converted
  // back to geminated 'itta':
  //
  //////////////////////////////////////////////////////
  ita2itta:{
    exclude:[
      'gwitaρah', // <= This is how 'guitarah' is spelled in atomic (because the engine doesn't understand spanish rules)
      'witakaς',
      'ikxitatapal',
      //'nitah', <= Need to treat separately: see code in noce.js
      'palomitas',
      'weitatah',
      'weyitatah'
    ]
  },
  //////////////////////////////////////////////////////////////
  //
  // NOTA BENE: The following may apply when the
  // source orthography is an "F" (phonetic) orthography.
  // 
  // In "F" orthographies, we may see 'pehki', 'pehkeh',
  // 'kohki' or 'kohkeh'. These are preterit verb forms
  // where, the first syllable coda /w/ has been delabialized
  // to [h] because of allophony. This rule is used
  // to restore the /w/ spelling, e.g. 'peuhqui' etc.
  // 
  // However, there are a very few words that we don't want
  // to convert, and those are shown here in the exclusion
  // list:
  //
  //////////////////////////////////////////////////////////////
  hk2wk:{
    exclude:[
      'awahkeh',
      'aahki',
      'ahki'
    ]
  }
};


////////////////////////////////////////////
//
// BEGIN nwt (nawatl) definitions section
//
////////////////////////////////////////////
const nwt={
  /////////////////////////////////////////////////////////////////////////////
  // 
  // NOTA BENE:
  // 
  // (1) Here we employ the internal
  // code-use-only "computational" ATOMIC orthography
  // described in detail in the INTRODUCTION.
  //
  // (2) Mapping from ATOMIC to SEP or HASLER MODERN in the
  // pre-allophone stage is straightforward.
  // However, mapping to ACK and to the TRAGER abugida require 
  // additional processing in a more nuanced manner. Nevertheless
  // the first step is still the same: map to ATOMIC.
  // 
  // (3) HMOD is our version of Hasler Modern 
  // using 'w' for [w] and 'h' for [ʔ]/[h]
  // 
  // (4) ACK  is Andrews-Campbell-Kartunnen 
  // "ACK" appears to have been coined by Sullivan & Olko
  //
  // (5) SEP is SEP using 'u' for [w] and 'j' for [ʔ]/[h]
  //
  // (6) INTR: (internet/intuitive) is like #3 but using sh for [ʃ]
  //     As Hasler Modern seems sufficient, we don't have a writer
  //     for INTR, although we still try to handle it on the input
  //     (reading) side of things.
  //
  // (7) The general reader, toAtomic() which uses the general_to_atomic
  //     map  seems to function well. There does not seem to be a 
  //     compelling need for individual readers for SEP, ACK, etc.
  //     One could always add additional specific readers to handle 
  //     some other orthography that the general reader cannot handle.
  //
  // (8) For completeness, we now include a trager_to_atomic
  //     so that text written in Trager orthography can now serve as
  //     a source.
  // 
  /////////////////////////////////////////////////////////////////////////////
  // 
  // STT MAP SECTION
  //
  map:{
    // STT ATOMIC mapping:
    atomic:{
      // NATIVE VOWELS:
      'a':{hmod:'a',ack:'a',sep:'a',intr:'a',nab:nab.vowelA,ipa:'a'},
      'e':{hmod:'e',ack:'e',sep:'e',intr:'e',nab:nab.vowelE,ipa:'e'},
      'i':{hmod:'i',ack:'i',sep:'i',intr:'i',nab:nab.vowelI,ipa:'i'},
      'o':{hmod:'o',ack:'o',sep:'o',intr:'o',nab:nab.vowelO,ipa:'o'},
      // FOREIGN (SPANISH) VOWEL:
      'u':{hmod:'u',ack:'u',sep:'u',intr:'u',nab:nab.vowelU,ipa:'u'},
      // LONG VOWEL MAPPING: āēīōū
      'ā':{hmod:'ā',ack:'ā',sep:'ā',intr:'ā',nab:nab.vowelA + nab.longVowelSign,ipa:'aː'},
      'ē':{hmod:'ē',ack:'ē',sep:'ē',intr:'ē',nab:nab.vowelE + nab.longVowelSign,ipa:'eː'},
      'ī':{hmod:'ī',ack:'ī',sep:'ī',intr:'ī',nab:nab.vowelI + nab.longVowelSign,ipa:'iː'},
      'ō':{hmod:'ō',ack:'ō',sep:'ō',intr:'ō',nab:nab.vowelO + nab.longVowelSign,ipa:'oː'},
      'ū':{hmod:'ū',ack:'ū',sep:'ū',intr:'ū',nab:nab.vowelU + nab.longVowelSign,ipa:'uː'},
      // NATIVE CONSONANTS:
      'm':{hmod:'m',ack:'m',sep:'m',intr:'m',nab:nab.consonantMA,ipa:'m'},
      'n':{hmod:'n',ack:'n',sep:'n',intr:'n',nab:nab.consonantNA,ipa:'n'},
      'p':{hmod:'p',ack:'p',sep:'p',intr:'p',nab:nab.consonantPA,ipa:'p'},
      't':{hmod:'t',ack:'t',sep:'t',intr:'t',nab:nab.consonantTA,ipa:'t'},
      'k':{hmod:'k',ack:'c',sep:'k',intr:'k',nab:nab.consonantCA,ipa:'k'},
      'κ':{hmod:'ku',ack:'cu',sep:'ku',intr:'ku',nab:nab.consonantCUA,ipa:'kʷ'}, // greek kappa          for [kʷ]
      'ʔ':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA,ipa:'ʔ'},      // [ʔ]
      'τ':{hmod:'tz',ack:'tz',sep:'ts',intr:'tz',nab:nab.consonantTZA,ipa:'t͡s'}, // greek tau            for [t͡s]
      'λ':{hmod:'tl',ack:'tl',sep:'tl',intr:'tl',nab:nab.consonantTLA,ipa:'t͡ɬ'}, // greek lambda         for [t͡ɬ]
      'ς':{hmod:'ch',ack:'ch',sep:'ch',intr:'ch',nab:nab.consonantCHA,ipa:'t͡ʃ'}, // terminal greek sigma for [t͡ʃ]
      's':{hmod:'s',ack:'z',sep:'s',intr:'s',nab:nab.consonantSA,ipa:'s'},
      'l':{hmod:'l',ack:'l',sep:'l',intr:'l',nab:nab.consonantLA,ipa:'l'},
      'x':{hmod:'x',ack:'x',sep:'x',intr:'sh',nab:nab.consonantXA,ipa:'ʃ'},     // [ʃ]
      'h':{hmod:'h',ack:'h',sep:'j',intr:'h',nab:nab.consonantHA,ipa:'h'},      // [h]
      'y':{hmod:'y',ack:'y',sep:'y',intr:'y',nab:nab.consonantYA,ipa:'j'},      // [j]
      'w':{hmod:'w',ack:'hu',sep:'u',intr:'w',nab:nab.consonantWA,ipa:'w'},     // [w]
      // FOREIGN (SPANISH) CONSONANTS:
      'ñ':{hmod:'ñ',ack:'ñ',sep:'ñ',intr:'ñ',nab:nab.consonantNYA,ipa:'ɲ'},
      'β':{hmod:'b',ack:'b',sep:'b',intr:'b',nab:nab.consonantBVA,ipa:'β'},
      'b':{hmod:'b',ack:'b',sep:'b',intr:'b',nab:nab.consonantBVA,ipa:'b'}, // NOTA BENE!
      'v':{hmod:'v',ack:'v',sep:'v',intr:'v',nab:nab.consonantBVA,ipa:'v'}, // NOTA BENE!
      'd':{hmod:'d',ack:'d',sep:'d',intr:'d',nab:nab.consonantDA,ipa:'d'},
      'g':{hmod:'g',ack:'g',sep:'g',intr:'g',nab:nab.consonantGA,ipa:'g'},
      'f':{hmod:'f',ack:'f',sep:'f',intr:'f',nab:nab.consonantFA,ipa:'f'},
      'r':{hmod:'r',ack:'r',sep:'r',intr:'r',nab:nab.consonantRA,ipa:'ɾ'}, // 'r'
      'ρ':{hmod:'rr',ack:'rr',sep:'rr',intr:'rr',nab:nab.consonantRRA,ipa:'r'} // 'rr'
    },
    // END ATOMIC SECTION

    //////////////////////////////////////////////////////
    //
    // STT GENERAL SECTION
    //
    // This is used as a general map to convert
    // "any" Latin-based incoming orthography to the atomic
    //
    // k: The key in the incoming orthography. 
    //    Keys can be of any length. LONGEST
    //    KEYS FIRST. Additional rules on key order
    //    may also apply: there may exist good reasons
    //    to process certain keys before others even when
    //    key length is not different.
    //
    // v: The value in the internal atomic orthography
    //
    //////////////////////////////////////////////////////
    general_to_atomic:[
      // SOME ARCHAIC CONVENTIONS:
      {k:'cuh',v:'κ'},   // /kʷ/ consonant in some classical variants
      // 2019.12.05.ET addenda: Possibly rare case in colonial era documents 
      // of a "v" representing /w/ e.g., "çivatl" for "cihuatl". 
      // Presumably this variant spelling only occurs
      // when "v" is nested between vowels. There are 4 vowels, so 4x4=16 cases:
      {k:'ava',v:'awa'},
      {k:'ave',v:'awe'},
      {k:'avi',v:'awi'},
      {k:'avo',v:'awo'},
      {k:'eva',v:'ewa'},
      {k:'eve',v:'ewe'},
      {k:'evi',v:'ewi'},
      {k:'evo',v:'ewo'},
      {k:'iva',v:'iwa'},
      {k:'ive',v:'iwe'},
      {k:'ivi',v:'iwi'},
      {k:'ivo',v:'iwo'},
      {k:'ova',v:'owa'},
      {k:'ove',v:'owe'},
      {k:'ovi',v:'owi'},
      {k:'ovo',v:'owo'},
      // 2019.12.05.ET addenda: Anytime a "y" is followed by a consonant,
      // treat the "y" as vowel /i/, e.g. ymach=>imach, ytoca=>itoca, yn=>in, yhuan=>ihuan, etc.
      // This thus covers one of the common colonial variant practices:
      {k:'ym',v:'im'}, //
      {k:'yn',v:'in'}, //
      {k:'yp',v:'ip'}, //
      {k:'yt',v:'it'}, //
      {k:'yc',v:'ic'}, // covers colonial era /ik/ and /ikʷ/ and /it͡ʃ/
      {k:'yq',v:'iq'}, // covers colonial era /iki/ and /ike/
      {k:'yh',v:'ih'}, // covers colonial era /ih/ and /iw/
      {k:'yt',v:'it'}, // covers colonial era /it/, /it͡s/ and /it͡ɬ/
      {k:'ys',v:'is'}, //
      {k:'yl',v:'il'}, //
      {k:'yx',v:'ix'}, //
      {k:'yw',v:'iw'}, // hmmm ... no idea if this one really occurs
      // n BEFORE p GENERALLY NOW SPELLED WITH m
      // (ex: panpa -> pampa, cenpoalli -> cempoalli, etc.).
      {k:'np',v:'mp'}, // experimental inclusion
      // STANDARD DIGRAPHS:
      // DIGRAPHS FROM CLASSICAL ORTHOGRAPHIC VARIANTS:
      {k:'hu',v:'w'}, // [w] initial
      {k:'uh',v:'w'}, // [w] final
      {k:'qu',v:'k'},
      {k:'cu',v:'κ'}, // [kʷ] consonant initial
      {k:'uc',v:'κ'}, // [kʷ] consonant final
      {k:'tz',v:'τ'}, // /t͡s/ consonant
      {k:'ts',v:'τ'}, // /t͡s/ consonant modern orthography
      {k:'tl',v:'λ'}, // /t͡ɬ/ consonant
      {k:'ch',v:'ς'}, // /t͡ʃ/ consonant
      // DISAMBIGUATION OF [k] and [s] phonemes:
      {k:'ca',v:'ka'},
      {k:'co',v:'ko'},
      {k:'ce',v:'se'},
      {k:'ci',v:'si'},
      {k:'cā',v:'kā'},
      {k:'cō',v:'kō'},
      {k:'cē',v:'sē'},
      {k:'cī',v:'sī'},
      // DIGRAPHS IN MODERN VARIANTS:
      {k:'ku',v:'κ'}, // /kʷ/ consonant modern orthography
      {k:'kw',v:'κ'}, // /kʷ/ consonant modern variant orthography
      {k:'sh',v:'x'}, // modern internet/inuitive addition
      // FOREIGN CONSONANTS:
      {k:'rr',v:'ρ'},
      //
      // SINGLE CHARACTER SUBSTITUTIONS:
      //
      {k:'c',v:'k'},
      // ALTERNATIVE SPELLINGS:
      {k:'ç',v:'s'},
      {k:'z',v:'s'},
      // SINGLE GRAPH CONVERSIONS:
      {k:'u',v:'w'},  // SEP 
      {k:'j',v:'h'}   // SEP /h/ and glottal stop
    ],
    ///////////////////////////////////////////
    //
    // TRAGER TO ATOMIC:
    //
    // => PUT LONGEST KEYS FIRST
    //
    ///////////////////////////////////////////
    trager_to_atomic:[

      ////////////////////////////
      //
      // VOWEL SIGN IA
      //
      ////////////////////////////
      {k:nab.consonantMA  + nab.vowelSignIA , v:'mia'},
      {k:nab.consonantNA  + nab.vowelSignIA , v:'nia'},
      {k:nab.consonantPA  + nab.vowelSignIA , v:'pia'},
      {k:nab.consonantTA  + nab.vowelSignIA , v:'tia'},
      {k:nab.consonantCA  + nab.vowelSignIA , v:'kia'},
      {k:nab.consonantCUA + nab.vowelSignIA , v:'κia'},
      {k:nab.consonantTZA + nab.vowelSignIA , v:'τia'},
      {k:nab.consonantTLA + nab.vowelSignIA , v:'λia'},
      {k:nab.consonantCHA + nab.vowelSignIA , v:'ςia'},
      {k:nab.consonantSA  + nab.vowelSignIA , v:'sia'},
      {k:nab.consonantLA  + nab.vowelSignIA , v:'lia'},
      {k:nab.consonantXA  + nab.vowelSignIA , v:'xia'},
      {k:nab.consonantHA  + nab.vowelSignIA , v:'hia'},
      {k:nab.consonantYA  + nab.vowelSignIA , v:'yia'},
      {k:nab.consonantWA  + nab.vowelSignIA , v:'wia'},
      {k:nab.consonantNYA + nab.vowelSignIA , v:'ñia'},
      {k:nab.consonantBVA + nab.vowelSignIA , v:'βia'},
      {k:nab.consonantDA  + nab.vowelSignIA , v:'dia'},
      {k:nab.consonantGA  + nab.vowelSignIA , v:'gia'},
      {k:nab.consonantFA  + nab.vowelSignIA , v:'fia'},
      {k:nab.consonantRA  + nab.vowelSignIA , v:'ria'},
      {k:nab.consonantRRA + nab.vowelSignIA , v:'ρia'},
      ////////////////////////////
      //
      // VOWEL SIGN AI
      //
      ////////////////////////////
      {k:nab.consonantMA  + nab.vowelSignAI , v:'mai'},
      {k:nab.consonantNA  + nab.vowelSignAI , v:'nai'},
      {k:nab.consonantPA  + nab.vowelSignAI , v:'pai'},
      {k:nab.consonantTA  + nab.vowelSignAI , v:'tai'},
      {k:nab.consonantCA  + nab.vowelSignAI , v:'kai'},
      {k:nab.consonantCUA + nab.vowelSignAI , v:'κai'},
      {k:nab.consonantTZA + nab.vowelSignAI , v:'τai'},
      {k:nab.consonantTLA + nab.vowelSignAI , v:'λai'},
      {k:nab.consonantCHA + nab.vowelSignAI , v:'ςai'},
      {k:nab.consonantSA  + nab.vowelSignAI , v:'sai'},
      {k:nab.consonantLA  + nab.vowelSignAI , v:'lai'},
      {k:nab.consonantXA  + nab.vowelSignAI , v:'xai'},
      {k:nab.consonantHA  + nab.vowelSignAI , v:'hai'},
      {k:nab.consonantYA  + nab.vowelSignAI , v:'yai'},
      {k:nab.consonantWA  + nab.vowelSignAI , v:'wai'},
      {k:nab.consonantNYA + nab.vowelSignAI , v:'ñai'},
      {k:nab.consonantBVA + nab.vowelSignAI , v:'βai'},
      {k:nab.consonantDA  + nab.vowelSignAI , v:'dai'},
      {k:nab.consonantGA  + nab.vowelSignAI , v:'gai'},
      {k:nab.consonantFA  + nab.vowelSignAI , v:'fai'},
      {k:nab.consonantRA  + nab.vowelSignAI , v:'rai'},
      {k:nab.consonantRRA + nab.vowelSignAI , v:'ρai'},
      ////////////////////////////
      //
      // VOWEL SIGN OA
      //
      ////////////////////////////
      {k:nab.consonantMA  + nab.vowelSignOA , v:'moa'},
      {k:nab.consonantNA  + nab.vowelSignOA , v:'noa'},
      {k:nab.consonantPA  + nab.vowelSignOA , v:'poa'},
      {k:nab.consonantTA  + nab.vowelSignOA , v:'toa'},
      {k:nab.consonantCA  + nab.vowelSignOA , v:'koa'},
      {k:nab.consonantCUA + nab.vowelSignOA , v:'κoa'},
      {k:nab.consonantTZA + nab.vowelSignOA , v:'τoa'},
      {k:nab.consonantTLA + nab.vowelSignOA , v:'λoa'},
      {k:nab.consonantCHA + nab.vowelSignOA , v:'ςoa'},
      {k:nab.consonantSA  + nab.vowelSignOA , v:'soa'},
      {k:nab.consonantLA  + nab.vowelSignOA , v:'loa'},
      {k:nab.consonantXA  + nab.vowelSignOA , v:'xoa'},
      {k:nab.consonantHA  + nab.vowelSignOA , v:'hoa'},
      {k:nab.consonantYA  + nab.vowelSignOA , v:'yoa'},
      {k:nab.consonantWA  + nab.vowelSignOA , v:'woa'},
      {k:nab.consonantNYA + nab.vowelSignOA , v:'ñoa'},
      {k:nab.consonantBVA + nab.vowelSignOA , v:'βoa'},
      {k:nab.consonantDA  + nab.vowelSignOA , v:'doa'},
      {k:nab.consonantGA  + nab.vowelSignOA , v:'goa'},
      {k:nab.consonantFA  + nab.vowelSignOA , v:'foa'},
      {k:nab.consonantRA  + nab.vowelSignOA , v:'roa'},
      {k:nab.consonantRRA + nab.vowelSignOA , v:'ρoa'},
      ////////////////////////////
      //
      // VOWEL SIGN EO
      //
      ////////////////////////////
      {k:nab.consonantMA  + nab.vowelSignEO , v:'meo'},
      {k:nab.consonantNA  + nab.vowelSignEO , v:'neo'},
      {k:nab.consonantPA  + nab.vowelSignEO , v:'peo'},
      {k:nab.consonantTA  + nab.vowelSignEO , v:'teo'},
      {k:nab.consonantCA  + nab.vowelSignEO , v:'keo'},
      {k:nab.consonantCUA + nab.vowelSignEO , v:'κeo'},
      {k:nab.consonantTZA + nab.vowelSignEO , v:'τeo'},
      {k:nab.consonantTLA + nab.vowelSignEO , v:'λeo'},
      {k:nab.consonantCHA + nab.vowelSignEO , v:'ςeo'},
      {k:nab.consonantSA  + nab.vowelSignEO , v:'seo'},
      {k:nab.consonantLA  + nab.vowelSignEO , v:'leo'},
      {k:nab.consonantXA  + nab.vowelSignEO , v:'xeo'},
      {k:nab.consonantHA  + nab.vowelSignEO , v:'heo'},
      {k:nab.consonantYA  + nab.vowelSignEO , v:'yeo'},
      {k:nab.consonantWA  + nab.vowelSignEO , v:'weo'},
      {k:nab.consonantNYA + nab.vowelSignEO , v:'ñeo'},
      {k:nab.consonantBVA + nab.vowelSignEO , v:'βeo'},
      {k:nab.consonantDA  + nab.vowelSignEO , v:'deo'},
      {k:nab.consonantGA  + nab.vowelSignEO , v:'geo'},
      {k:nab.consonantFA  + nab.vowelSignEO , v:'feo'},
      {k:nab.consonantRA  + nab.vowelSignEO , v:'reo'},
      {k:nab.consonantRRA + nab.vowelSignEO , v:'ρeo'},
      ////////////////////////////
      //
      // VOWEL SIGN EI
      //
      ////////////////////////////
      {k:nab.consonantMA  + nab.vowelSignEI , v:'mei'},
      {k:nab.consonantNA  + nab.vowelSignEI , v:'nei'},
      {k:nab.consonantPA  + nab.vowelSignEI , v:'pei'},
      {k:nab.consonantTA  + nab.vowelSignEI , v:'tei'},
      {k:nab.consonantCA  + nab.vowelSignEI , v:'kei'},
      {k:nab.consonantCUA + nab.vowelSignEI , v:'κei'},
      {k:nab.consonantTZA + nab.vowelSignEI , v:'τei'},
      {k:nab.consonantTLA + nab.vowelSignEI , v:'λei'},
      {k:nab.consonantCHA + nab.vowelSignEI , v:'ςei'},
      {k:nab.consonantSA  + nab.vowelSignEI , v:'sei'},
      {k:nab.consonantLA  + nab.vowelSignEI , v:'lei'},
      {k:nab.consonantXA  + nab.vowelSignEI , v:'xei'},
      {k:nab.consonantHA  + nab.vowelSignEI , v:'hei'},
      {k:nab.consonantYA  + nab.vowelSignEI , v:'yei'},
      {k:nab.consonantWA  + nab.vowelSignEI , v:'wei'},
      {k:nab.consonantNYA + nab.vowelSignEI , v:'ñei'},
      {k:nab.consonantBVA + nab.vowelSignEI , v:'βei'},
      {k:nab.consonantDA  + nab.vowelSignEI , v:'dei'},
      {k:nab.consonantGA  + nab.vowelSignEI , v:'gei'},
      {k:nab.consonantFA  + nab.vowelSignEI , v:'fei'},
      {k:nab.consonantRA  + nab.vowelSignEI , v:'rei'},
      {k:nab.consonantRRA + nab.vowelSignEI , v:'ρei'},
      ////////////////////////////
      //
      // VOWEL SIGN IO
      //
      ////////////////////////////
      {k:nab.consonantMA  + nab.vowelSignIO , v:'mio'},
      {k:nab.consonantNA  + nab.vowelSignIO , v:'nio'},
      {k:nab.consonantPA  + nab.vowelSignIO , v:'pio'},
      {k:nab.consonantTA  + nab.vowelSignIO , v:'tio'},
      {k:nab.consonantCA  + nab.vowelSignIO , v:'kio'},
      {k:nab.consonantCUA + nab.vowelSignIO , v:'κio'},
      {k:nab.consonantTZA + nab.vowelSignIO , v:'τio'},
      {k:nab.consonantTLA + nab.vowelSignIO , v:'λio'},
      {k:nab.consonantCHA + nab.vowelSignIO , v:'ςio'},
      {k:nab.consonantSA  + nab.vowelSignIO , v:'sio'},
      {k:nab.consonantLA  + nab.vowelSignIO , v:'lio'},
      {k:nab.consonantXA  + nab.vowelSignIO , v:'xio'},
      {k:nab.consonantHA  + nab.vowelSignIO , v:'hio'},
      {k:nab.consonantYA  + nab.vowelSignIO , v:'yio'},
      {k:nab.consonantWA  + nab.vowelSignIO , v:'wio'},
      {k:nab.consonantNYA + nab.vowelSignIO , v:'ñio'},
      {k:nab.consonantBVA + nab.vowelSignIO , v:'βio'},
      {k:nab.consonantDA  + nab.vowelSignIO , v:'dio'},
      {k:nab.consonantGA  + nab.vowelSignIO , v:'gio'},
      {k:nab.consonantFA  + nab.vowelSignIO , v:'fio'},
      {k:nab.consonantRA  + nab.vowelSignIO , v:'rio'},
      {k:nab.consonantRRA + nab.vowelSignIO , v:'ρio'},
      ////////////////////////////
      //
      // VOWEL SIGN AO
      //
      ////////////////////////////
      {k:nab.consonantMA  + nab.vowelSignAO , v:'mao'},
      {k:nab.consonantNA  + nab.vowelSignAO , v:'nao'},
      {k:nab.consonantPA  + nab.vowelSignAO , v:'pao'},
      {k:nab.consonantTA  + nab.vowelSignAO , v:'tao'},
      {k:nab.consonantCA  + nab.vowelSignAO , v:'kao'},
      {k:nab.consonantCUA + nab.vowelSignAO , v:'κao'},
      {k:nab.consonantTZA + nab.vowelSignAO , v:'τao'},
      {k:nab.consonantTLA + nab.vowelSignAO , v:'λao'},
      {k:nab.consonantCHA + nab.vowelSignAO , v:'ςao'},
      {k:nab.consonantSA  + nab.vowelSignAO , v:'sao'},
      {k:nab.consonantLA  + nab.vowelSignAO , v:'lao'},
      {k:nab.consonantXA  + nab.vowelSignAO , v:'xao'},
      {k:nab.consonantHA  + nab.vowelSignAO , v:'hao'},
      {k:nab.consonantYA  + nab.vowelSignAO , v:'yao'},
      {k:nab.consonantWA  + nab.vowelSignAO , v:'wao'},
      {k:nab.consonantNYA + nab.vowelSignAO , v:'ñao'},
      {k:nab.consonantBVA + nab.vowelSignAO , v:'βao'},
      {k:nab.consonantDA  + nab.vowelSignAO , v:'dao'},
      {k:nab.consonantGA  + nab.vowelSignAO , v:'gao'},
      {k:nab.consonantFA  + nab.vowelSignAO , v:'fao'},
      {k:nab.consonantRA  + nab.vowelSignAO , v:'rao'},
      {k:nab.consonantRRA + nab.vowelSignAO , v:'ρao'},

      // E
      // NATIVE CONSONANTS FOLLOWED BY VOWEL SIGN E:
      {k:nab.consonantMA  + nab.vowelSignE , v:'me'},
      {k:nab.consonantNA  + nab.vowelSignE , v:'ne'},
      {k:nab.consonantPA  + nab.vowelSignE , v:'pe'},
      {k:nab.consonantTA  + nab.vowelSignE , v:'te'},
      {k:nab.consonantCA  + nab.vowelSignE , v:'ke'},
      {k:nab.consonantCUA + nab.vowelSignE , v:'κe'},
      {k:nab.consonantTZA + nab.vowelSignE , v:'τe'},
      {k:nab.consonantTLA + nab.vowelSignE , v:'λe'},
      {k:nab.consonantCHA + nab.vowelSignE , v:'ςe'},
      {k:nab.consonantSA  + nab.vowelSignE , v:'se'},
      {k:nab.consonantLA  + nab.vowelSignE , v:'le'},
      {k:nab.consonantXA  + nab.vowelSignE , v:'xe'}, // [ʃ]
      {k:nab.consonantHA  + nab.vowelSignE , v:'he'}, // [h]
      {k:nab.consonantYA  + nab.vowelSignE , v:'ye'}, // [j]
      {k:nab.consonantWA  + nab.vowelSignE , v:'we'}, // [w]
      // FOREIGN (SPANISH) CONSONANTS FOLLOWED BY VOWEL SIGN E:
      {k:nab.consonantNYA + nab.vowelSignE , v:'ñe'},
      {k:nab.consonantBVA + nab.vowelSignE , v:'βe'}, // NOTA BENE: b and v will not be disambiguated
      {k:nab.consonantDA  + nab.vowelSignE , v:'de'},
      {k:nab.consonantGA  + nab.vowelSignE , v:'ge'},
      {k:nab.consonantFA  + nab.vowelSignE , v:'fe'},
      {k:nab.consonantRA  + nab.vowelSignE , v:'re'}, // 'r'
      {k:nab.consonantRRA + nab.vowelSignE , v:'ρe'},
      // I
      // NATIVE CONSONANTS FOLLOWED BY VOWEL SIGN I:
      {k:nab.consonantMA  + nab.vowelSignI , v:'mi'},
      {k:nab.consonantNA  + nab.vowelSignI , v:'ni'},
      {k:nab.consonantPA  + nab.vowelSignI , v:'pi'},
      {k:nab.consonantTA  + nab.vowelSignI , v:'ti'},
      {k:nab.consonantCA  + nab.vowelSignI , v:'ki'},
      {k:nab.consonantCUA + nab.vowelSignI , v:'κi'},
      {k:nab.consonantTZA + nab.vowelSignI , v:'τi'},
      {k:nab.consonantTLA + nab.vowelSignI , v:'λi'},
      {k:nab.consonantCHA + nab.vowelSignI , v:'ςi'},
      {k:nab.consonantSA  + nab.vowelSignI , v:'si'},
      {k:nab.consonantLA  + nab.vowelSignI , v:'li'},
      {k:nab.consonantXA  + nab.vowelSignI , v:'xi'}, // [ʃ]
      {k:nab.consonantHA  + nab.vowelSignI , v:'hi'}, // [h]
      {k:nab.consonantYA  + nab.vowelSignI , v:'yi'}, // [j]
      {k:nab.consonantWA  + nab.vowelSignI , v:'wi'}, // [w]
      // FOREIGN (SPANISH) CONSONANTS FOLLOWED BY VOWEL SIGN I:
      {k:nab.consonantNYA + nab.vowelSignI , v:'ñi'},
      {k:nab.consonantBVA + nab.vowelSignI , v:'βi'}, // NOTA BENE: b and v will not be disambiguated
      {k:nab.consonantDA  + nab.vowelSignI , v:'di'},
      {k:nab.consonantGA  + nab.vowelSignI , v:'gi'},
      {k:nab.consonantFA  + nab.vowelSignI , v:'fi'},
      {k:nab.consonantRA  + nab.vowelSignI , v:'ri'}, // 'r'
      {k:nab.consonantRRA + nab.vowelSignI , v:'ρi'},
      // O
      // NATIVE CONSONANTS FOLLOWED BY VOWEL SIGN O:
      {k:nab.consonantMA  + nab.vowelSignO , v:'mo'},
      {k:nab.consonantNA  + nab.vowelSignO , v:'no'},
      {k:nab.consonantPA  + nab.vowelSignO , v:'po'},
      {k:nab.consonantTA  + nab.vowelSignO , v:'to'},
      {k:nab.consonantCA  + nab.vowelSignO , v:'ko'},
      {k:nab.consonantCUA + nab.vowelSignO , v:'κo'},
      {k:nab.consonantTZA + nab.vowelSignO , v:'τo'},
      {k:nab.consonantTLA + nab.vowelSignO , v:'λo'},
      {k:nab.consonantCHA + nab.vowelSignO , v:'ςo'},
      {k:nab.consonantSA  + nab.vowelSignO , v:'so'},
      {k:nab.consonantLA  + nab.vowelSignO , v:'lo'},
      {k:nab.consonantXA  + nab.vowelSignO , v:'xo'}, // [ʃ]
      {k:nab.consonantHA  + nab.vowelSignO , v:'ho'}, // [h]
      {k:nab.consonantYA  + nab.vowelSignO , v:'yo'}, // [j]
      {k:nab.consonantWA  + nab.vowelSignO , v:'wo'}, // [w]
      // FOREIGN (SPANISH) CONSONANTS FOLLOWED BY VOWEL SIGN O:
      {k:nab.consonantNYA + nab.vowelSignO , v:'ño'},
      {k:nab.consonantBVA + nab.vowelSignO , v:'βo'}, // NOTA BENE: b and v will not be disambiguated
      {k:nab.consonantDA  + nab.vowelSignO , v:'do'},
      {k:nab.consonantGA  + nab.vowelSignO , v:'go'},
      {k:nab.consonantFA  + nab.vowelSignO , v:'fo'},
      {k:nab.consonantRA  + nab.vowelSignO , v:'ro'}, // 'r'
      {k:nab.consonantRRA + nab.vowelSignO , v:'ρo'},
      // U
      // NATIVE CONSONANTS FOLLOWED BY VOWEL SIGN U:
      {k:nab.consonantMA  + nab.vowelSignU , v:'mu'},
      {k:nab.consonantNA  + nab.vowelSignU , v:'nu'},
      {k:nab.consonantPA  + nab.vowelSignU , v:'pu'},
      {k:nab.consonantTA  + nab.vowelSignU , v:'tu'},
      {k:nab.consonantCA  + nab.vowelSignU , v:'ku'},
      {k:nab.consonantCUA + nab.vowelSignU , v:'κu'},
      {k:nab.consonantTZA + nab.vowelSignU , v:'τu'},
      {k:nab.consonantTLA + nab.vowelSignU , v:'λu'},
      {k:nab.consonantCHA + nab.vowelSignU , v:'ςu'},
      {k:nab.consonantSA  + nab.vowelSignU , v:'su'},
      {k:nab.consonantLA  + nab.vowelSignU , v:'lu'},
      {k:nab.consonantXA  + nab.vowelSignU , v:'xu'}, // [ʃ]
      {k:nab.consonantHA  + nab.vowelSignU , v:'hu'}, // [h]
      {k:nab.consonantYA  + nab.vowelSignU , v:'yu'}, // [j]
      {k:nab.consonantWA  + nab.vowelSignU , v:'wu'}, // [w]
      // FOREIGN (SPANISH) CONSONANTS FOLLOWED BY VOWEL SIGN U:
      {k:nab.consonantNYA + nab.vowelSignU , v:'ñu'},
      {k:nab.consonantBVA + nab.vowelSignU , v:'βu'}, // NOTA BENE: b and v will not be disambiguated
      {k:nab.consonantDA  + nab.vowelSignU , v:'du'},
      {k:nab.consonantGA  + nab.vowelSignU , v:'gu'},
      {k:nab.consonantFA  + nab.vowelSignU , v:'fu'},
      {k:nab.consonantRA  + nab.vowelSignU , v:'ru'}, // 'r'
      {k:nab.consonantRRA + nab.vowelSignU , v:'ρu'},
      
      // END VOWEL TREATMENT
      
      // SUBJOINED NATIVE CONSONANTS:
      {k:nab.subjoinerSign + nab.consonantMA  , v:'m'},
      {k:nab.subjoinerSign + nab.consonantNA  , v:'n'},
      {k:nab.subjoinerSign + nab.consonantPA  , v:'p'},
      {k:nab.subjoinerSign + nab.consonantTA  , v:'t'},
      {k:nab.subjoinerSign + nab.consonantCA  , v:'k'},
      {k:nab.subjoinerSign + nab.consonantCUA , v:'κ'},
      {k:nab.subjoinerSign + nab.consonantTZA , v:'τ'},
      {k:nab.subjoinerSign + nab.consonantTLA , v:'λ'},
      {k:nab.subjoinerSign + nab.consonantCHA , v:'ς'},
      {k:nab.subjoinerSign + nab.consonantSA  , v:'s'},
      {k:nab.subjoinerSign + nab.consonantLA  , v:'l'},
      {k:nab.subjoinerSign + nab.consonantXA  , v:'x'}, // [ʃ]
      {k:nab.subjoinerSign + nab.consonantHA  , v:'h'}, // [h]
      {k:nab.subjoinerSign + nab.consonantYA  , v:'y'}, // [j]
      {k:nab.subjoinerSign + nab.consonantWA  , v:'w'}, // [w]
      // FOREIGN (SPANISH) CONSONANTS:
      {k:nab.subjoinerSign + nab.consonantNYA , v:'ñ'},
      {k:nab.subjoinerSign + nab.consonantBVA , v:'β'}, // NOTA BENE: b and v will not be disambiguated
      {k:nab.subjoinerSign + nab.consonantDA  , v:'d'},
      {k:nab.subjoinerSign + nab.consonantGA  , v:'g'},
      {k:nab.subjoinerSign + nab.consonantFA  , v:'f'},
      {k:nab.subjoinerSign + nab.consonantRA  , v:'r'}, // 'r'
      {k:nab.subjoinerSign + nab.consonantRRA , v:'ρ'},
      // LONG VOWEL MAPPING: āēīōū
      // (UNICODE NFC FORM):
      {k:nab.vowelA + nab.longVowelSign , v:'ā'},
      {k:nab.vowelE + nab.longVowelSign , v:'ē'},
      {k:nab.vowelI + nab.longVowelSign , v:'ī'},
      {k:nab.vowelO + nab.longVowelSign , v:'ō'},
      {k:nab.vowelU + nab.longVowelSign , v:'ū'},
      // VOWEL SIGNS:
      {k:nab.vowelSignA + nab.longVowelSign , v:'ā'},
      {k:nab.vowelSignE + nab.longVowelSign , v:'ē'},
      {k:nab.vowelSignI + nab.longVowelSign , v:'ī'},
      {k:nab.vowelSignO + nab.longVowelSign , v:'ō'},
      {k:nab.vowelSignU + nab.longVowelSign , v:'ū'},
      // SHORT OR UNMARKED VOWELS:
      {k:nab.vowelA , v:'a'},
      {k:nab.vowelE , v:'e'},
      {k:nab.vowelI , v:'i'},
      {k:nab.vowelO , v:'o'},
      {k:nab.vowelU , v:'u'},
      // SHORT OR UNMARKED VOWEL SIGNS:
      {k:nab.vowelSignA , v:'a'},
      {k:nab.vowelSignE , v:'e'},
      {k:nab.vowelSignI , v:'i'},
      {k:nab.vowelSignO , v:'o'},
      {k:nab.vowelSignU , v:'u'},
      // Compound (Dipthong) Vowel Signs:
      {k:nab.vowelSignIA , v:'ia'},
      {k:nab.vowelSignAI , v:'ai'},
      {k:nab.vowelSignOA , v:'oa'},
      {k:nab.vowelSignEO , v:'eo'},
      {k:nab.vowelSignEI , v:'ei'},
      {k:nab.vowelSignIO , v:'io'},
      {k:nab.vowelSignAO , v:'ao'},
      // NATIVE CONSONANTS WITH INTRINSIC VOWEL A:
      {k:nab.consonantMA  , v:'ma'},
      {k:nab.consonantNA  , v:'na'},
      {k:nab.consonantPA  , v:'pa'},
      {k:nab.consonantTA  , v:'ta'},
      {k:nab.consonantCA  , v:'ka'},
      {k:nab.consonantCUA , v:'κa'},
      {k:nab.consonantTZA , v:'τa'},
      {k:nab.consonantTLA , v:'λa'},
      {k:nab.consonantCHA , v:'ςa'},
      {k:nab.consonantSA  , v:'sa'},
      {k:nab.consonantLA  , v:'la'},
      {k:nab.consonantXA  , v:'xa'}, // [ʃ]
      {k:nab.consonantHA  , v:'ha'}, // [h]
      {k:nab.consonantYA  , v:'ya'}, // [j]
      {k:nab.consonantWA  , v:'wa'}, // [w]
      // FOREIGN (SPANISH) CONSONANTS:
      {k:nab.consonantNYA , v:'ña'},
      {k:nab.consonantBVA , v:'βa'}, // NOTA BENE: b and v will not be disambiguated
      {k:nab.consonantDA  , v:'da'},
      {k:nab.consonantGA  , v:'ga'},
      {k:nab.consonantFA  , v:'fa'},
      {k:nab.consonantRA  , v:'ra'}, // 'r'
      {k:nab.consonantRRA , v:'ρa'},
      // Subjoiner sign:
      {k:nab.subjoinerSign , v:''},
      // Special Prefix signs:
      {k:nab.prefixPlace   , v:''},
      {k:nab.prefixName    , v:''},
      {k:nab.prefixDeity   , v:''},
    ],
    //////////////////////////////////////////
    //
    // deities: map of Nahuatl deity names
    // (in ATOMIC orthography)
    //
    // NOTA BENE: This list was originally based on 
    // https://en.wikipedia.org/wiki/List_of_Aztec_gods_and_supernatural_beings
    //
    //////////////////////////////////////////
    deities:{
      'awiateteo':1,'amapan':1,'aλakoya':1,'aλawa':1,'aλatoman':1,'kamaxλi':1,'senτonwiτnawa':1,'senτonmimixkoa':1,'senτontotoςtin':1,'ςalςiwλiκe':1,'ςalςiwtotolin':1,'ςalmekkasiwaλ':1,'ςantiko':1,'ςikomekoaλ':1,'ςikomexoςiλ':1,'ςimalma':1,'siwakoaλ':1,'siwateteo':1,'sinteoλ':1,'sinteoλ':1,'sinteteo':1,'sipaktonal':1,'siλalatonak':1,'siλaliκe':1,'koasiwaλ':1,'koaλiκe':1,'koaλiκe':1,'kolwaτinkaλ':1,'koyolxawki':1,'kosawkasinteoλ':1,'ehekaλ':1,'wewekoyoλ':1,'wewekoyoλ':1,'weweteoλ':1,'wiτilopoςλi':1,'wiτilopoςλi':1,'wixtosiwaλ':1,'iixposteke':1,'ilamateκthli':1,'iτkake':1,'iτpapaloλ':1,'iτpapaloλ':1,'iτpapaloλsiwaλ':1,'iτpapaloλtotek':1,'iτλakoliwki':1,'iτλi':1,'ixkimilli':1,'ixkitekaλ':1,'ixλilton':1,'istaκkasinteoλ':1,'maκilkoskaκawλi':1,'maκilκeτpalin':1,'maκilmalinalli':1,'maκiltoςλi':1,'maκiltoςλi':1,'maκiltotek':1,'maκilxoςiλ':1,'malinalxoςiλ':1,'mayawel':1,'meτλi':1,'mikapeλakalli':1,'miktekasiwaλ':1,'mikλanteκλi':1,'mixkoaλ':1,'mixkoaλ':1,'nanawaτin':1,'nappateκλi':1,'nesoxoςi':1,'nextepewa':1,'omakaλ':1,'omesiwaλ':1,'ometeκλi':1,'ometeoλ':1,'ometoςλi':1,'opoςλi':1,'oxomo':1,'painal':1,'patekaλ':1,'pilτinteκλi':1,'kawsiwaλ':1,'keτalkoaλ':1,'kilasli':1,'teksistekaλ':1,'teςloλ':1,'temaskaltesi':1,'tepeyolloλ':1,'tepostekaλ':1,'texkaτonaλ':1,'teskaλipoka':1,'teskaτonkaλ':1,'λakawepan':1,'λakoτonλi':1,'λawiskalpanteκλi':1,'λalsiwaλ':1,'λalok':1,'λalok':1,'λaloke':1,'λaltekayoa':1,'λalteκλi':1,'λaλawkasinteoλ':1,'λasolteoλ':1,'λasolteoλ':1,'λilwa':1,'tosi':1,'toltekaλ':1,'tonakasiwaλ':1,'tonakateκλi':1,'tonatiw':1,'tonatiw.':1,'τiτimimeh':1,'τiτiminsiwaλ':1,'τiτimiλ':1,'τontemok':1,'xilonen':1,'xipetotek':1,'xipetotek':1,'xipetotek':1,'xippilli':1,'xiwkosawki':1,'xiwistaκki':1,'xiwteκλi':1,'xiwteκλi':1,'xiwλaλawki':1,'xiwtotonλi':1,'xiwxoxoawki':1,'xoςipilli':1,'xoςikeτal':1,'xoςiλiκe':1,'xoςiλiκe':1,'xoloλ':1,'xoloλ':1,'yakateκλi':1,'yakateκλi':1,'yaosiwaλ':1,'yayawkasinteoλ':1,'sakaτonλi':1,'sakaτonλi':1,'dios':1
    },
    // END OF deities list
  },
  // END MAP SECTION

  //////////////////////////
  //
  // isAtomicLetter
  //
  //////////////////////////
  isAtomicLetter:function(c){
    return ato.all.indexOf(c) != -1;
  },
  //////////////////////////
  //
  // isAtomicVowel
  //
  //////////////////////////
  isAtomicVowel:function(c){
    return ato.vowels.all.indexOf(c) != -1;
  },
  //////////////////////////
  //
  // isAtomicConsonant
  //
  //////////////////////////
  isAtomicConsonant:function(c){
    return ato.consonants.all.indexOf(c) != -1;
  },
  ///////////////////////////
  //
  // isForeignConsonant
  //
  ///////////////////////////
  isForeignConsonant:function(c){
    return ato.consonants.foreign.indexOf(c) != -1;
  },
  // toUnmarkedVowel: removes long vowel marker:
  toUnmarkedVowel:function(v){
    return v==='ā'?'a':v==='ē'?'e':v==='ī'?'i':v==='ō'?'o':v==='ū'?'u':v;
  },
  /////////////////////////////////////////////////////
  //
  // toAtomic: converts input in any format to Atomic
  //
  /////////////////////////////////////////////////////
  toAtomic:function(input){
    if(!input) return '';
    let atomic=input;
    for(let entry of nwt.map.general_to_atomic){
      const regex = new RegExp(entry.k,'g');
      atomic = atomic.replace(regex,entry.v);
    }
    // Also run tragerToAtomic:
    atomic = nwt.tragerToAtomic(atomic);
    return atomic;
  },
  tragerToAtomic:function(input){
    if(!input) return '';
    let atomic=input;
    for(let entry of nwt.map.trager_to_atomic){
      const regex = new RegExp(entry.k,'g');
      atomic = atomic.replace(regex,entry.v);
    }
    return atomic;
  },
  /////////////////////////////////////////
  //
  // atomicToSEP:
  //
  /////////////////////////////////////////
  atomicToSEP:function(atomic){
    let sep = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicLetter(current)){
        sep += nwt.map.atomic[current].sep;
      }else{
        sep += current;
      }
    }
    return sep;
  },
  /////////////////////////////////////////
  //
  // atomicToHaslerModern:
  //
  /////////////////////////////////////////
  atomicToHaslerModern:function(atomic){
    let hmod = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicLetter(current)){
        hmod += nwt.map.atomic[current].hmod;
      }else{
        hmod += current;
      }
    }
    return hmod;
  },
  /////////////////////////////////////////
  //
  // atomicToIPA:
  //
  // => This is the first-stage
  //    /fənimɪk/ version
  //
  /////////////////////////////////////////
  atomicToIPA:function(atomic){
    let ipa = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicLetter(current)){
        ipa += nwt.map.atomic[current].ipa;
      }else{
        ipa += current;
      }
    }
    return ipa;
  },
  // 
  // atomicL2LLGeminator: Restore gemination
  // on words sourced from an "F" orthography:
  //
  atomicL2LLGeminator:function(atomic){
    const regex = /([aeio])li$/ ;
    return atomic.replace(regex,function(match,p1){
      return p1 + 'lli';
    });
  },
  // 
  // atomicT2TTGeminator: Restore gemination
  // on words sourced from an "F" orthography:
  // This is really restricted for use on the
  // verb form, 'ita'=>'itta':
  //
  atomicT2TTGeminator:function(atomic){
    return atomic.replace(/ita/,'itta');
  },
  //
  // atomicHK2WKLabializor: Restore the /w/
  // coda on preterit verb forms sourced from an "F"
  // orthography, e.g. 'pehki' => 'pewki' (peuhqui);
  // 'kohki' => 'kowki' (couhqui), etc.
  //
  atomicHK2WKLabializor:function(atomic){
    // Originally we had just this: const regex = /([aeio])hk(i|eh)$/ ;
    // ... but that approach turned out to be overly zealous. Here
    // we attempt to limit the back-conversion to known "-hua" verbs like "pewa"
    // "kowa", etc.:
    const regex = /(ala|kana|ka|se|ςipa|ςi|ςo|sia|si|ko|κahκa|κite|e|wapa|itonalpote|li|lo|ma|maxihxiλa|mela|me|mole|ne|ni|paλa|pe|pina|piτa|pohye|poke|po|ki|tila|λaxλa|λiκeti|τa|τi|xa|xiλa|xi|ya|yo|sa|soλa|so)hk(i|eh)$/ ;
    return atomic.replace(regex,function(match,p1,p2){
      return p1 + 'wk' + p2;
    });
  },
  /////////////////////////////////////////
  //
  // atomicToDegeminate: Removes geminated
  // consonants from an atomic word string
  //
  /////////////////////////////////////////
  atomicToDegeminate:function(atomic){
    let degem = '';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      // Check for gemination and keep only the first consonant:
      if(nwt.isAtomicConsonant(current) && i<atomic.length && atomic[i+1]===current){
        degem += current;
        // Force skipping of second consonant:
        ++i;
      }else{
        degem += current;
      }
    }
    return degem;
  },
  ////////////////////////////////////////////
  //
  // atomicAllophoneN2H:
  // 
  // (1) Used only when converting from an "M"
  //     to an "F" orthography.
  //
  // -> Convert things like "tzin" to "tzih"
  // -> MUST BE USED IN CONJUNCTION WITH 
  //    APPROPRIATE WORD-LEVEL EXCLUSION LIST
  //
  ////////////////////////////////////////////
  atomicAllophoneN2H:function(atomic){
    //
    // This performs an *UNFILTERED*
    // replacement of terminal /n/ to [h].
    // 
    // NOTA BENE 1: THIS CAN ONLY BE USED
    // IN A USEFUL MANNER WITH A WORD-LEVEL
    // EXCLUSION LIST. SO ONLY USE THIS IN
    // THE WORD-BASED CONVERSION PIPELINE.
    // 
    // NOTA BENE 2: Javascript's RegExp '\b' IS
    // *BROKEN* FOR UNICODE, SO WE HAVE THE 
    // FOLLOWING:
    //
    // This should handle most of the cases:
    atomic = atomic.replace(/n([ \t\.!?"᾽»’„”])/g,(match,p1)=>{
      //console.log(`MATCH: ${match}`);
      return `h${p1}`;
    });
    // End-of-string case (this is in fact
    // the case that will always appear when
    // using a word-based conversion pipeline):
    atomic = atomic.replace(/n$/,'h');
    return atomic;
  },
  ////////////////////////////////////////////
  //
  // atomicAllophoneW2H
  //
  // -> Convert /w/ in coda position to [h]
  //    for "F" phonetic orthographies.
  //
  ////////////////////////////////////////////
  atomicAllophoneW2H:function(atomic){
    // Theoretically a foreign consonant could very rarely occur in 
    // a compound neologism, so we include the foreign consonants.
    // Also we include a space to mark the end of a word:
    atomic = atomic.replace(/([aeio])w([mnptkκτλςsxhlwyñβdgfrρbv ])/g,(match,p1,p2)=>{
      return `${p1}h${p2}`;
    });
    // Single word at end of a string:
    atomic = atomic.replace(/([aeio])w$/,(match,p1)=>{
      return `${p1}h`;
    });
    return atomic;
  },
  ////////////////////////////////////////////
  //
  // atomicAllophoneKw2KorH
  //
  // -> Convert /kʷ/ in coda position to [h] 
  //    or [k] for "F" phonetic orthographies.
  // 
  ////////////////////////////////////////////
  atomicAllophoneKw2KorH:function(atomic){
    //
    // FIRST CASE: /kʷ/ -> [h] when followed by /k/
    //
    // The only cases I know of for κ -> h are:
    // 1) in the preterit of tzacua, e.g., tzaucqui
    // 2) words with root "teuc" such as toteucco 
    // Andres Ehecatl Aguilar says in his master's thesis (around p. 28-29) 
    // that the following consonant need only be a velar consonant, but it 
    // is not clear to me what other velar consonants one would see after /kʷ/ 
    // besides the common /k/. So, for now we have:
    atomic = atomic.replace(/([aeio])κ(k)/g,(match,p1,p2)=>{
      return `${p1}h${p2}`;
    });
    //
    // SECOND CASE WHERE /kʷ/ DELABIALIZES TO [k]:
    //
    // Theoretically a foreign consonant could very rarely occur in 
    // a compound neologism, so we include the foreign consonants.
    // Also we include a space to mark the end of a word:
    atomic = atomic.replace(/([aeio])κ([mnptκτλςsxhlwyñβdgfrρbv ])/g,(match,p1,p2)=>{
      return `${p1}k${p2}`;
    });
    // CASE OF A WORD TERMINATING IN /kʷ/ ALSO PRESUMABLY DELABIALIZING to /k/:
    atomic = atomic.replace(/([aeio])κ$/,(match,p1)=>{
      return `${p1}k`;
    });
    return atomic;
  },
  ////////////////////////////////////////////
  //
  // atomicAllophoneLL2LH
  //
  // -> Convert /L/ in coda position to [H]
  //    when followed by an /L/:
  // -> Be sure to check exclusion list before
  //    applying this function
  ////////////////////////////////////////////
  atomicAllophoneLL2HL:function(atomic){
    atomic = atomic.replace(/([i])l(l[ai])/g,(match,p1,p2)=>{
      return `${p1}h${p2}`;
    });
    return atomic;
  },
  ///////////////////////////////////////////////
  //
  // atomicAllophoneKCons2HCons
  // 
  // Convert /k/ in coda position to [h]
  // when followed by a consonant at the beginning
  // of the following syllable.
  //
  ///////////////////////////////////////////////
  atomicAllophoneKCons2HCons:function(atomic){
    // Seems kind of unlikely that this would happen with foreign
    // consonants, but we have them in here for now anyway:
    atomic = atomic.replace(/([aeio])k([mnptkκτλςsxhlwyñβdgfrρbv])([aeio])/g,(match,p1,p2,p3)=>{
      return `${p1}h${p2}${p3}`;
    });
    return atomic;
  },
  ///////////////////////////////////////////////
  //
  // atomicAllophoneHCons2KCons
  // 
  // This is the a partial solution for the 
  // reverse of the above. Here, we convert
  // a realized [h] back to a /k/ based on
  // verb morphology patterns:
  //
  ///////////////////////////////////////////////
  atomicAllophoneHCons2KCons:function(atomic){
    // Seems kind of unlikely that this would happen with foreign
    // consonants, but we have them in here for now anyway:
    atomic = atomic.replace(/\b([nt]i)h([mnptkκτλςsxhlwyñβdgfrρbv])([aeio])/g,(match,p1,p2,p3)=>{
      return `${p1}k${p2}${p3}`;
    });
    return atomic;
  },
  /////////////////////////////////////////////////////
  //
  // atomicAllophoneH2W: Convert words ending in [h]
  // back to words ending in /w/:
  //
  // This is an "F" => "M" rule.
  //
  // This handles the very common word 'tonatih'=>'tonatiw'
  // and a small set of other words that end in /w/ which
  // are often written in "F" orthographies with just [h]:
  //
  /////////////////////////////////////////////////////
  atomicAllophoneH2W:function(atomic){
    if(atomic.match(/(peτikih|tonatih|koneh)\b/)){
      atomic = atomic.replace(/h\b/,'w');
    }
    return atomic;
  },
  /////////////////////////////////////////////////////
  //
  // atomicAllophoneH2N: Convert words ending in [h]
  // back to words ending in /n/
  // 
  // This is an "F" => "M" rule.
  //
  /////////////////////////////////////////////////////
  atomicAllophoneH2N:function(atomic){
    // Conversion in this direction will be
    // much harder to get right:
    // 1. TZIH => TZIN : conetzin, etc.
    atomic = atomic.replace(/τih?$/,'τin');
    // 2. CHIH => CHIN: michin, kuatochin, etc.
    // There are only 2 words in IDIEZ Tlahtolxitlauhcayotl that
    // actually end in 'chih': lechih (prestado de español 'leche', milk) and 'Pechih'
    // (tokayotl tlen Pedro). So we don't convert those two words:
    if(!atomic.match(/[lp]eςih$/)){
      atomic = atomic.replace(/ςih$/,'ςin');
    }
    // 3. LIH => LIN: totolin, etc.
    // There are only 2 words in IDIEZ TXC that end in 'kikilih'
    // which we avoid converting:
    if(!atomic.match(/kikilih$/)){
      atomic = atomic.replace(/lih$/,'lin');
    }
    // 4. TIH => TIN: inihwantin, inmowantin, tohwantin
    // Since plural verb forms like 'titekitih' end in 'tih',
    // It is better to specify exactly the set of words we can safely 
    // convert. The following limited set may expand in the future:
    if(atomic.match(/(inihwantih|inmowantih|tohwantih)$/)){
      atomic = atomic.replace(/tih$/,'tin');
    }
    return atomic;
  },
  /////////////////////////////////////////
  //
  // atomicToPhoneticSyllabified: Syllabifies
  // an atomic word string by adding dots
  // '.' between syllables
  // 
  // NOTA BENE: Syllabification here is
  // for the PHONETIC LEVEL "GREEDY ONSET"
  // syllabification. The PHONEMIC level
  // could be different.
  //
  //////////////////////////////////////////
  atomicToPhoneticSyllabified:function(atomic){
    let sylab = '';
    const syllableSeparator='·';
    for(let i=0;i<atomic.length;i++){
      const current = atomic[i];
      if(nwt.isAtomicVowel(current) 
        && i<atomic.length-1 
        && nwt.isAtomicConsonant(atomic[i+1])
        && nwt.isAtomicVowel(atomic[i+2]) ){
        // VCV pattern => V.CV
        sylab += current;
        sylab += syllableSeparator;
      }else if(nwt.isAtomicConsonant(current) 
        && i<atomic.length 
        && nwt.isAtomicConsonant(atomic[i+1])){
        // CC pattern => C.C
        sylab += current;
        sylab += syllableSeparator;
      }else if(nwt.isAtomicVowel(current)
        && i< atomic.length
        && nwt.isAtomicVowel(atomic[i+1])){
        // VV pattern => V.V
        sylab += current;
        sylab += syllableSeparator;
      }else{
        // pass through:
        sylab += current;
      }
    }
    return sylab;
  },
  /////////////////////////////////////////
  //
  // markPenultimateStress: Mark stress on the 
  // penultimate syllable of a syllabified
  // atomic word string, s
  //
  // => There are exceptions to penultimate
  //    stress. These can be handled on a
  //    case-by-case basis outside of this
  //    function.
  //
  /////////////////////////////////////////
  markPenultimateStress:function(s){
    // Work from end of string moving
    // toward the beginning:
    const marker = 'ˈ';
    let syllableCount = 0;
    let letterSeen = false;
    for(let i = s.length-1;i>=0;i--){
      if(nwt.isAtomicLetter(s[i])){
        letterSeen=true;
        if(i===0 && syllableCount===1){
          s = [marker,s].join('');
          return s;
        }
      }else if(letterSeen && ( s[i]==='.' || s[i]==='·')){
        syllableCount++;
        if(syllableCount===2){
          // Mark penultimate syllable 
          // with stress marker:
          s = [s.slice(0, i ),marker,s.slice( i+1 )].join('');
        }
      }else if(s[i]===' '){
        if(letterSeen && syllableCount===1){
          // So we have already seen one syllable marked with '.'
          // Mark penultimate syllable 
          // with stress marker:
          s = [s.slice(0, i+1 ),marker,s.slice( i+1 )].join('');
        }
        // White space resets the counter:
        syllableCount = 0;
        letterSeen    = false;
      }
    }
    return s;
  },
  /////////////////////////////////////////
  //
  // atomicToIPAPhonetic:
  //
  // => This is the second stage [fəˈnɛ.tɪk]
  //    version
  //
  /////////////////////////////////////////
  atomicToIPAPhonetic:function(atomic){
    // Degeminate the word string:
    const degem = nwt.atomicToDegeminate(atomic);
    // syllabify at the PHONETIC level:
    const sylab = nwt.atomicToPhoneticSyllabified(degem);
    // Add stress marker:
    const stres = nwt.markPenultimateStress(sylab);
    // Convert to IPA:
    let iph = nwt.atomicToIPA(stres);
    iph = nwt.IPHFixStressExceptions(iph);
    return iph;
  },
  /////////////////////////////////////////
  //
  // atomicToACK: Convert Atomic to ACK:
  //
  /////////////////////////////////////////
  atomicToACK:function(atomic){
    let result='';
    for(let i=0;i<atomic.length;i++){
      
      const current  = atomic[ i ];
      const previous = i>0               ? atomic[i-1] : ' ' ;
      const next     = i<atomic.length-1 ? atomic[i+1] : ' ' ;
    
      // If the current consonant is a syllable-
      // terminating /w/ or /kʷ/ , then use 
      // 'uh' in place of 'hu' or 'uc' in place 
      // of 'cu', respectively:
      if( (current==='w' || current==='κ') && nwt.isAtomicVowel(previous) && !nwt.isAtomicVowel(next) ){
        // w maps to 'uh'
        // κ maps to 'uc'
        result += current==='w' ? 'uh' : 'uc' ;
      }else if( (current==='k' || current==='s') && nwt.isAtomicVowel(next) ){
        if(next==='e' || next==='i' || next==='ē' || next==='ī'){
          // vowels e and i:
          // k maps to: que , qui
          // s maps to: ce  , ci
          result += current==='k' ? 'qu' : 'c'; 
        }else{
          // vowels a and o:
          // k maps to: ca , co
          // s maps to: za , zo
          result += current==='k' ? 'c' : 'z'; 
        }
      }else if(nwt.isAtomicLetter(current)){
        result += nwt.map.atomic[current].ack;
      }else{
        result += current;
      }
    }
    return result;
  },
  ////////////////////////////////////////////
  //
  // atomicToTragerModern
  //
  ////////////////////////////////////////////
  atomicToTragerModern:function(atomic){
    let result='';
    for(let i=0;i<atomic.length;i++){
      
      const current  = atomic[ i ];
      const previous = i>0               ? atomic[i-1] : ' ' ;
      const next     = i<atomic.length-1 ? atomic[i+1] : ' ' ;
      
      if(nwt.isAtomicVowel(current) && nwt.isAtomicConsonant(previous) && previous!=='h' ){
        // Convert atomic vowels following consonants immediately 
        // to above-base vowel signs *EXCEPT* in the case of 'h' which can only be a terminal:
        if(current==='a'){
          // Don't push anything because the vowel /a/ sign is intrinsic 
          // and not normally written over the abugida base consonant
        }else if(current==='ā'){
          // In this case, only add the longVowelSign marker, but not the intrinic /a/ vowelSign symbol:
          result += nab.longVowelSign;
        }else{
          result += nab.map.atomicVowelToVowelSign[current];
        }
      }else if(nwt.isAtomicVowel(current) && previous==='h' && (i===1 || !nwt.isAtomicLetter(atomic[i-2])) ){
        // This is the special case where atomic 'h' starts a word (which therefore means it is actually
        // a borrow word, not a native Nahuatl word) and now we have a vowel, so in this case the vowel
        // become a vowel sign over the 'h' consonant. Although this case could be folded into the previous
        // "if" section, it is kept apart here for clarity: 
        if(current==='a'){
          // Don't push anything because the vowel /a/ sign is intrinsic 
          // and not normally written over the abugida base consonant
        }else if(current==='ā'){
          // In this case, only add the longVowelSign marker, but not the intrinic /a/ vowelSign symbol:
          result += nab.longVowelSign;
        }else{
          result += nab.map.atomicVowelToVowelSign[current];
        }
      }else if( current==='h' && nwt.isAtomicVowel(previous) ){
        // Special case where we only allow atomic 'h' to be a *terminal* consonant on syllabic clusters
        // and never at the beginning of cluster *unless* it is the first consonant in a foreign borrow word
        // (so this clause *must* precede the following clause which treats all the other consonants in 
        // a general fashion):
        result += nab.subjoinerSign;
        result += nwt.map.atomic[current].nab;   // Push consonant
      }else if(nwt.isAtomicConsonant(current) && nwt.isAtomicVowel(previous) && !nwt.isAtomicVowel(next) ){
        // If the previous letter is a vowel and this is a consonant, then we have to think about making
        // consonant a subjoined consonant. However, if the *next* letter is a vowel, then this consonant
        // is actually the base for the next syllabic cluster. But if the *next* letter is *not* a vowel,
        // then indeed this consonant is a final consonant on the current syllabic cluster. So we have:
        result += nab.subjoinerSign;             // Push subjoiner
        result += nwt.map.atomic[current].nab;   // Push consonant
      }else if(nwt.isAtomicVowel(current) && nwt.isAtomicVowel(previous) && !(i===1 || !nwt.isAtomicLetter(atomic[i-2])) ){
        // 2020.12.24.ET: Added new constraint in the if clause: don't use compound signs if word starts with a vowel
        // Opportunity for combined vowel sign:
        // 2020.12.24.ET ADDENDA: As there does not appear to be a 
        // reasonable way to include vowel length indicators on compound 
        // vowel signs, the decision here is to ignore the vowel length
        // by folding the short and long vowels together:
        const prevVowel = nwt.toUnmarkedVowel(previous);
        const vowelPair = prevVowel + nwt.toUnmarkedVowel(current);
        const compoundSign = nab.map.atomicVowelPairsToCompoundVowelSign[vowelPair];
        if(compoundSign){
          // The vowel combination has a special combined symbol, so replace
          // the current singleton vowel sign with the compound vowel sign.
          //
          // However, in the case of a previous 'a', then there is no visible sign
          // so in that case, just add the combined symbol at the end, as there is
          // nothing to replace:
          if(previous==='a'){
            result += compoundSign;
          }else if(previous==='ā'){
            // Remove the nab.longVowelSign marker only, then add the compound sign:
            result = result.slice(0, -1 ) + compoundSign;
          }else{
            // if prevVowel != previous, this means "previous" is actually
            // a *long vowel* which means that result will already have both the
            // vowel sign *AND* the long vowel indicator, so in that case we
            // must remove both:
            result = result.slice(0, prevVowel===previous ? -1 : -2 ) + compoundSign;
          }
        }else{
        // Otherwise do nothing if no special combined vowel sign exists ...
          result += nwt.map.atomic[current].nab;
        }
      }else if(nwt.isAtomicLetter(current)){
        result += nwt.map.atomic[current].nab;
      }else{
        result += current;
      }
    }
    return result;
  },
  // END atomicToTragerModern

  ////////////////////////////////////////////////////////////
  //
  // hasLocativeSuffix
  //
  // NOTA BENE: This works on a word in ATOMIC orthography
  //
  ////////////////////////////////////////////////////////////
  hasLocativeSuffix(s){
    const matches = s.match(/(ko|λan|tepek|τinco|singo|apa|apan|kan)\b/);
    if(matches && matches[1]){
      //
      // This is a strong indication of a locative suffix on a nahuatl
      // word. 
      // 
      // BUT if the beginning of the word contains foreign consonants,
      // then it is very likely *NOT* a Nahuatl word. A good example is the
      // name "Francisco" which looks to have "co" at the end, but is
      // clearly not nahuatl.
      //
      // So here we add this refinement to insure that we return false 
      // for words like "Fransisco" but true for words like "Telpancingo" ...
      //
      const firstPart = s.substring(0,matches.index);
      for(let i=0;i<firstPart.length;i++){
        if(nwt.isForeignConsonant(firstPart[i])){
          return false;
        }
      }
      // Get here if no foreign consonants, so:
      return true;
    }else{
      return false;
    }
  },
  punctuation:{
    all:'.,—–‒/#!¡$%^&*;:=-_`~@+?¿(){}<>[]+"“”«»‘’‛‹›…\'',
    // 2021.11.19.ET: the new zeroWidthTags must be in the prefixSet:
    prefixSet: nab.map.zeroWidthTag.properName  +
               nab.map.zeroWidthTag.placeName   +
               nab.map.zeroWidthTag.deityName   +
               nab.map.zeroWidthTag.isImmutable +
               '\n\r.,—–‒/#!¡$%^&*;:=-_`~@+?¿(){}<>[]+"“”«»‘’‛‹›…\'',
    postfixSet:'\n\r.,—–‒/#!¡$%^&*;:=-_`~@+?¿(){}<>[]+"“”«»‘’‛‹›…\''
  },

  /////////////////////////////////
  //
  // segregatePunctuation:
  //
  // Given a string representing a
  // MetaWord as input, this function
  // returns an array containing:
  //
  // 1. All prefixed "punctation" symbols
  //    as the first element in the returned array
  // 
  // 2. The text of the word in the 2nd element
  // 
  // 3. All suffixed "punctuation" symbols in the
  //    3rd element.
  //
  // Note that "punctuation" may be broadly defined
  // for the purposes of this function. Look at the
  // regular expression to see what exactly is 
  // included.
  //
  /////////////////////////////////
  segregatePunctuation:function(s){

    // As ECMAScript/Javascript regexs are not Unicode friendly
    // and do not support Unicode character classes, here we 
    // punt and just do it without using regexps for now:
    
    const r={ prefix:'' , word:'' , postfix:'' };
    
    let i=0;
    // Grab prefixes only:
    for(;i<s.length && nwt.punctuation.prefixSet.includes(s[i]); i++){
      r.prefix += s[i];
    }
    // Continue and grab the word part:
    for(;i<s.length && !nwt.punctuation.postfixSet.includes(s[i]);i++){
      r.word += s[i];
    }
    // Anything left over is supposedly in the punctuation.postfixSet:
    for(;i<s.length;i++){
      r.postfix += s[i];
    }
    // RETURN THE RESULT OBJECT:
    return [ r.prefix , r.word, r.postfix ];
  },
  ////////////////////////////////////////////////////////////
  //
  // isDeity: true if the name is in the list of deities
  //
  // NOTA BENE: This works on a name in ATOMIC orthography
  //
  ////////////////////////////////////////////////////////////
  isDeity:function(name){
    return !nwt.map.deities[name] === undefined ;
  },
  /////////////////////////////////////////
  //
  // splitToMetaWords
  //
  /////////////////////////////////////////
  splitToMetaWords:function(input){
    //const words = input.split(/[\.\,\!\?]| +/);
    //const words = input.split(/ +/);
    
    const words = input.split(/ +/);

    const metaWords=[];
    for(let word of words){
      const mw = {}; // meta-word object
      mw.original       = word;
      
      // Prophylactically insure that these properties 
      // are present and are initially false:
      mw.isImmutable = mw.isProperName = mw.isPlaceName = mw.isDeityName = false;
      
      /////////////////////////////////////////////////////////////////////////////
      //
      // 1. Segregate prefixed and/or postfixed "punctuation" from the word itself:
      //
      //    NOTA BENE: mw.prefixed now *MAY* contain nab.map.zeroWidthTags
      //
      /////////////////////////////////////////////////////////////////////////////
      [ mw.prefixed, mw.word, mw.postfixed ] = nwt.segregatePunctuation(mw.original);
      // DEBUG:
      // console.log(`=====\npre:${mw.prefixed} * word:${mw.word} * post:${mw.postfixed}`);

      //////////////////////////////////////////////////////////////
      //
      // CONVERT EACH WORD TO ITS INITIAL ATOMIC REPRESENTATION:
      //
      // NOTA BENE: At this point, any allophonic spellings are still
      //            reflected in the atomic spelling as well.
      //
      //////////////////////////////////////////////////////////////
      mw.atomic         = nwt.toAtomic( mw.word.toLowerCase() );
      const firstLetter = mw.word[0];
      // flic = first letter is capital
      // 2021.10.12.ET Addendum: Check that firstLetter is a Latin letter, not a Trager Orthography letter:
      if(firstLetter && firstLetter < nab.vowelA){
        mw.flic = firstLetter===firstLetter.toUpperCase();
      }else{
        // Get here when firstLetter is in the Trager orthography set:
        mw.flic = false;
      }
      /////////////////////////////////////////////////
      //
      // 2. See if there are any zeroWidthTags:
      //
      /////////////////////////////////////////////////
      
      //
      // 2.1. IS IMMUTABLE TAG:
      //
      mw.isImmutable = false;
      if(mw.prefixed.match( nab.map.zeroWidthTag.isImmutable )){
        // Set the state flag for the immutable name:
        mw.isImmutable = true;
        // Strip the isImmutable tag from both (1) the original
        // and also from (2) mw.prefixed because in some contexts 
        // (such as some terminal environments) these "zero width"
        // symbols actually do show up as a space character, which
        // is highly confusing:
        const isImmutableTagRegex = new RegExp( nab.map.zeroWidthTag.isImmutable, 'g' );
        mw.original = mw.original.replace( isImmutableTagRegex , '' );
        mw.prefixed = mw.prefixed.replace( isImmutableTagRegex , '' );
      }
      //
      // 2.2. PROPER NAME TAG, PLACE NAME TAG, DEITY NAME TAG:
      //      => When present, we expect only one of these:
      //
      if(mw.prefixed.match( nab.map.zeroWidthTag.properName )){
        mw.isProperName = true;
        // Strip out tags:
        const properNameTagRegex = new RegExp( nab.map.zeroWidthTag.properName, 'g' );
        mw.original = mw.original.replace( properNameTagRegex , '' );
        mw.prefixed = mw.prefixed.replace( properNameTagRegex , '' );
      }else if(mw.prefixed.match( nab.map.zeroWidthTag.placeName )){
        mw.isPlaceName = true;
        // Strip out tags:
        const placeNameTagRegex = new RegExp( nab.map.zeroWidthTag.placeName, 'g' );
        mw.original = mw.original.replace( placeNameTagRegex , '' );
        mw.prefixed = mw.prefixed.replace( placeNameTagRegex , '' );
      }else if(mw.prefixed.match( nab.map.zeroWidthTag.deityName )){
        mw.isDeityName = true;
        const deityNameTagRegex = new RegExp( nab.map.zeroWidthTag.deityName, 'g' );
        mw.original = mw.original.replace( deityNameTagRegex , '' );
        mw.prefixed = mw.prefixed.replace( deityNameTagRegex , '' );
      }else{
        //
        // When names are not explicitly marked with tags, then
        // it is more difficult to know if something is really a proper 
        // name or not ... we try anyway:
        
        // This is based on crude heuristics:
        mw.isPlaceName = nwt.hasLocativeSuffix( mw.atomic );
        mw.isDeityName = nwt.isDeity( mw.atomic );
        // Now using the much more comprehensive names.js module:
        mw.isProperName = nms.isName( mw.word );
      }
      metaWords.push( mw );
    }
    //console.log('=== STT DEBUG METAWORDS ===');
    //console.log(metaWords);
    //console.log('=== END DEBUG METAWORDS ===');
    
    return metaWords; 
  },
  /////////////////////////////////////////
  //
  // capitalize:
  //
  /////////////////////////////////////////
  capitalize:function(s){
    return s[0].toUpperCase() + s.slice(1);
  },
  /////////////////////////////////////////
  //
  // arrayToOptionString:
  //
  // => returns a list of the array words
  //    delimited by '|' vertical bar
  //    representing OR in REGEXPs
  //
  /////////////////////////////////////////
  arrayToOptionString:function(arr){
    let os = '';
    for(let i=0; i< arr.length ; i++){
      os += arr[i];
      if(i<arr.length-1){
        os += '|';
      }
    }
    return os;
  },
  /////////////////////////////////////////
  //
  // IPHFixStressExceptions
  //
  // Stress is usually on the penultimate
  // syllable ... but of course there are
  // exceptions, so we handle those here.
  // 
  // NB#1: The list of exception words may be
  // incomplete. We can always add more later.
  //
  // NB#2: This function works on the IPH string
  // directly.
  //
  // This is a bit of a crude approach, but
  // it works ...
  //
  /////////////////////////////////////////
  IPHFixStressExceptions:function(iph){
    iph = iph.replace(/ˈaʃ·t͡ɬen/,'aʃˈt͡ɬen');
    iph = iph.replace(/ˈjon.se/,'jonˈse');
    return iph;
  }
};

// ES6 export:
export { nab , nwt, alo };
// END OF CODE 

