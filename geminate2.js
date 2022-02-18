//
// geminate2.js
//
// => Back convert ungeminated forms to geminated forms
// => Must be in ATOMIC orthography
//
// 2022.02.17.ET
//
const gem={ 
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
  // TZ:
  {u:'neκa' , g:'neκκa'},
  // TL: Never occurs geminated
  // CH: The rule here is terminal "ch" + "y" => "chch"
  //     But I'm not sure if anybody other than IDIEZ writes
  //     words with "chch" geminated ...
  // S: "ezzo": Here we limit to words that begin with this
  //    which is an incomplete treatment, but good enough for now:
  {u:'\\beso' , g:'esso'},
  // X: There are a number here: "x" + "y"  => "xx"
  //    ... Skipping for now
  // L: At a minimum, we fix 'mila' and 'mili'
  {u:'\\bmilah?\\b' , g:'millah'},
  {u:'\\bmili\\b'   , g:'milli'},  
  // W: A few, skip for now ...
  // Y: No occurrences, skip ...
  ],
  geminate:function(s){
    gem.map.forEach(rule=>{
      const regex = new RegExp(rule.u,'g');
      if(rule.e){
        const exclude = new RegExp(rule.e);
        if(s.match(exclude)){
          return;
        }else{
          s=s.replace(regex,rule.g);
        }
      }else{
        s=s.replace(regex,rule.g);
      }
    });
    return s;
  }
};

// ES6 export:$
export { gem };

