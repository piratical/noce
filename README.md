# noce
Nahuatl Orthography Conversion Engine

The basis of the code in this project had existed in my Nahuatl Tools
project in various forms and iterations for quite some time. 
It has now been broken out into its own project in order to refine and 
standardize the engine.

The low-level code is in `nahuatl_tools.js`, which also includes
the very important `splitToMetaWords()` function as well as core
functionality for allophone processing, *inter alia*.

Metaword processing is in `noce.js`. Metaword processing involves 
not only the basic things like dealing with punctuation and capitalization,
but also some of the more complicated issues like deciding what to do with
proper nouns. Should the spelling of proper nouns change or not change as the
orthography changes? The approach we have taken here is that if a proper noun
is a Nahuatl name, then it can change based on the orthography. If it is not
a Nahuatl name, for example if it is a Spanish name or a name coming from some
other indigenous language, then its spelling should not change.

Finally, `ncv.js` allows you to use the noce engine as a command-line tool,
which is extremely convenient.




