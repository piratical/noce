//
// geminate2.js
//
// => Back convert ungeminated forms to geminated forms
// => Must be in ATOMIC orthography
//
// 2022.02.17.ET
//
const gem={
  //
  // This map contains a list of words or roots
  // with geminated consonants. The map is not
  // complete, but we try to catch at least the
  // most common words and convert them back to
  // geminated forms if we find the ungeminated
  // form. For this to work everywhere, we of course 
  // are using the internal atomic orthography:
  //
  // u: ungeminated form
  // g: geminated form
  // e: exclusion rule. Exclusions are not always
  //    present.
  //
  map:[
  // M:
  // M.1.1: Various forms of "quemman":
  {u:'\\bkema[hn]?\\b' , g:'kemman'},
  // M.1.2: Other words like "quemmach":
  {u:'kema' , g:'kemma'},
  // M.1.3: "cemmo":
  {u:'semo' , g:'semmo'},
  // M.1.4: Other forms appear to not be unique, so skip ...
  // N:
  // N.1.1: "tenno"
  {u:'teno' , g:'tenno'},
  // N.1.2: Other forms appear to infrequently, so skip ...
  // P: not enough to warrant, so skip ...
  // T: "itta" but exclude "guitar" and "icxita..." and "palomita"
  {u:'ita'  , g:'itta' , e:'itaρ|ikxita|palomita'},
  // K:
  // K.1.1: "sekko": e.g., "zancecco" etc.:
  {u:'seko' , g:'sekko'},
  // K.1.2: Other forms seem too rare, so skip ...
  // KW:
  // KW.1.1: "neκκā" is not common but we can include here anyway:
  {u:'neκa' , g:'neκκa'},
  // TZ:
  {u:'kotoτi' , g:'kotoττi' },
  {u:'κeτi'   , g:'κeττi'   },
  {u:'neτo'   , g:'neττo'   },
  {u:'wiτo'   , g:'wiττo'   },
  {u:'temeτon', g:'temeττon'},
  // TL: Never occurs geminated
  // CH: The rule here is terminal "ch" + "y" => "chch"
  //     But I'm not sure if anybody other than IDIEZ writes
  //     words with "chch" geminated ...
  // S: "ezzo": Here we limit to words that begin with this
  //    which is an incomplete treatment, but good enough for now:
  {u:'\\beso' , g:'esso'},
  // X: There are a number here: "x" + "y"  => "xx"
  //    Skipping for now ... {u:'', g:'' , e:''}, 
  // L1.1: At a minimum, we fix 'mila' and 'mili'
  {u:'\\bmilah?\\b' , g:'millah'},
  {u:'\\bmili\\b'   , g:'milli'},
  // L1.2: Words ending in "alli": There are at least 130 such words.
  //  Exclude "piyali" only:
  {u:'ali\\b', g:'alli', e:'piyali\\b'},
  // L1.3: Words ending in "elli": Exclude words ending in "hueli"
  //       e.g: tlenhueli, campahueli. So it turns out there are
  //       only a very few words that end in "-elli" ...
  {u:'eli\\b', g:'elli', e:'weli\\b'},
  // L1.4: Words ending in "illi":
  //       The IDIEZ dictionary lists 3 words that have ungeminated "ili":
  //       κamahmanili, wēwēyakilwili and λaκalλālili, so we exclude those only:
  {u:'ili\\b', g:'illi', e:'\\b(κamahmanili|wēwēyakilwili|λaκalλālili)\\b'},
  // L1.5: Words ending in "olli":
  //       It looks like anything ending in "oli" should really be "olli", no exclusions:
  {u:'oli\\b', g:'olli' },
  // W:
  {u:'κatewi', g:'κatewwi' },
  {u:'āλawahkaλan', g:'āλawwahkaλan' },
  // Y: No occurrences, so we skip ...
  ],
  //
  // geminate: This function iterates
  // over the set above to geminate any
  // matches that it finds:
  //
  geminate:function(s){
    gem.map.forEach(rule=>{
      const regex = new RegExp(rule.u,'g');
      // Check for exclusions first:
      if(rule.e){
        const exclude = new RegExp(rule.e);
        if(s.match(exclude)){
          return;
        }else{
          // Otherwise process:
          s=s.replace(regex,rule.g);
        }
      }else{
        // Process rule where there are no exclusions:
        s=s.replace(regex,rule.g);
      }
    });
    return s;
  }
};

// ES6 export:
export { gem };

