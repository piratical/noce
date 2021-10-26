//
// geminate.js
// -> mp of words in atomic orthography
//    that are spelled with geminated
//    consonants according to IDIEZ data.
//
const gmn={
  map:{
"aλamaxalli":"aλammaxalli",
"axkeman":"axkemman",
"semaka":"semmaka",
"semana":"semmana",
"semani":"semmani",
"semaniwi":"semmaniwi",
"λasemaniwi":"λasemmaniwi",
"semanλi":"semmanλi",
"kehkeman":"kehkemman",
"kehkemantika":"kehkemmantika",
"kehkemanya":"kehkemmanya",
"kemaς":"kemmaς",
"keman":"kemman",
"kemanweli":"kemmanweli",
"kemaniwki":"kemmaniwki",
"kemantika":"kemmantika",
"kehkemantika":"kehkemmantika",
"kemanτin":"kemmanτin",
"kemanya":"kemmanya",
"λasemaniwi":"λasemmaniwi",
"sankemanweli":"sankemmanweli",
"sankemantika":"sankemmantika",
"sankemanτin":"sankemmanτin",
"sankemanya":"sankemmanya",
"semihyoκi":"semmihyoκi",
"semoyakti":"semmoyakti",
"semoyaktik":"semmoyaktik",
"semoyakλi":"semmoyakλi",
"semoyawa":"semmoyawa",
"semoyawi":"semmoyawi",
"semoyawa":"semmoyawa",
"semoyawilia":"semmoyawilia",
"κasemoyawa":"κasemmoyawa",
"κasemoyawi":"κasemmoyawi",
"κaτonkalsemoyawa":"κaτonkalsemmoyawa",
"κaτonkalsemoyawi":"κaτonkalsemmoyawi",
"τonkalsemoyawa":"τonkalsemmoyawa",
"τonkalsemoyawi":"τonkalsemmoyawi",
"nexkomana":"nexkommana",
"nexkomanilia":"nexkommanilia",
"panawaltia":"pannawaltia",
"panamaka":"pannamaka",
"panamakilia":"pannamakilia",
"panamakiltia":"pannamakiltia",
"λanakayoλ":"λannakayoλ",
"λanahnamiktia":"λannahnamiktia",
"panesi":"pannesi",
"panextia":"pannextia",
"λaneτκa":"λanneτκa",
"λapanextilisλawasanλi":"λapannextilisλawasanλi",
"λapanextilisλi":"λapannextilisλi",
"sanempan":"sannempan",
"paniman":"panniman",
"λaniτκa":"λanniτκa",
"saniman":"sanniman",
"kenaman":"kennaman",
"tenahnamiki":"tennahnamiki",
"tenamiktia":"tennamiktia",
"tenamiki":"tennamiki",
"tenamikilia":"tennamikilia",
"λatenamiki":"λatennamiki",
"kene":"kenne",
"keneya":"kenneya",
"tenehpanoa":"tennehpanoa",
"λateneteςolli":"λatenneteςolli",
"keni":"kenni",
"kenipa":"kennipa",
"kenipati":"kennipati",
"kenipatik":"kennipatik",
"keniya":"kenniya",
"amelteno":"ameltenno",
"ateno":"atenno",
"kakalteno":"kakaltenno",
"kalteno":"kaltenno",
"kamateno":"kamatenno",
"karreterahteno":"karreterahtenno",
"κateno":"κatenno",
"ixteno":"ixtenno",
"ixtiyolteno":"ixtiyoltenno",
"millahteno":"millahtenno",
"milteno":"miltenno",
"nelκateno":"nelκatenno",
"ohteno":"ohtenno",
"pwertahteno":"pwertahtenno",
"kenopa":"kennopa",
"kenopati":"kennopati",
"kenopatik":"kennopatik",
"kenopaya":"kennopaya",
"tehteno":"tehtenno",
"teno":"tenno",
"tehteno":"tehtenno",
"λaixpanteno":"λaixpantenno",
"λateno":"λatenno",
"λiteno":"λitenno",
"λixikteno":"λixiktenno",
"τinteno":"τintenno",
"yakaτolteno":"yakaτoltenno",
"sinamaka":"sinnamaka",
"sinamaka":"sinnamaka",
"sinamakilia":"sinnamakilia",
"sinamakiltia":"sinnamakiltia",
"τinahnawa":"τinnahnawa",
"λaτineteςolli":"λaτinneteςolli",
"τineκiliwi":"τinneκiliwi",
"τineκiloa":"τinneκiloa",
"τineκiltik":"τinneκiltik",
"τino":"τinno",
"kalτonamaka":"kalτonnamaka",
"monanλi":"monnanλi",
"yoyonamaka":"yoyonnamaka",
"yoyonamaka":"yoyonnamaka",
"yoyonamakiltia":"yoyonnamakiltia",
"λaτoneteςolli":"λaτonneteςolli",
"tenxipalli":"tenxippalli",
"xipalli":"xippalli",
"ahkoita":"ahkoitta",
"kamaihita":"kamaihitta",
"κawelita":"κawelitta",
"κawelita":"κawelitta",
"κalankaita":"κalankaitta",
"welita":"welitta",
"wiwiita":"wiwiitta",
"ikxiwelita":"ikxiwelitta",
"ihita":"ihitta",
"ihtiwelita":"ihtiwelitta",
"ita":"itta",
"ita":"itta",
"ixita":"ixitta",
"nakasihita":"nakasihitta",
"tekaita":"tekaitta",
"λahkoita":"λahkoitta",
"λamiita":"λamiitta",
"λepanita":"λepanitta",
"yakaita":"yakaitta",
"yehyekkaita":"yehyekkaitta",
"κaλakayoλ":"κaλakkayoλ",
"waka":"wakka",
"miaka":"miakka",
"tioλaka":"tioλakka",
"λaka":"λakka",
"κaλakeλ":"κaλakkeλ",
"melakeτa":"melakkeτa",
"λakakeλ":"λakakkeλ",
"λakakeτin":"λakakkeτin",
"akiya":"akkiya",
"akiyaweli":"akkiyaweli",
"tenκalakisa":"tenκalakkisa",
"tenistakisa":"tenistakkisa",
"sanakiya":"sanakkiya",
"sanakiyaweli":"sanakkiyaweli",
"istakoxtalli":"istakkoxtalli",
"sekan":"sekkan",
"sekanok":"sekkanok",
"sekanτin":"sekkanτin",
"sekanτiτin":"sekkanτiτin",
"sekanτiτin":"sekkanτiτin",
"ixtekaktik":"ixtekkaktik",
"tekakti":"tekkakti",
"tekaktik":"tekkaktik",
"tekakλi":"tekkakλi",
"λateka":"λatekka",
"λayekan":"λayekkan",
"λayekantik":"λayekkantik",
"λayekantiya":"λayekkantiya",
"yehyekaitta":"yehyekkaitta",
"yehyekamaςilia":"yehyekkamaςilia",
"κatehtekeλ":"κatehtekkeλ",
"wihτontekeτa":"wihτontekkeτa",
"mahmawitekeτa":"mahmawitekkeτa",
"mawitekeτa":"mawitekkeτa",
"mahmawitekeτa":"mahmawitekkeτa",
"mixtekeτa":"mixtekkeτa",
"λaiςtekeλ":"λaiςtekkeλ",
"seko":"sekko",
"sekoτin":"sekkoτin",
"sekoyok":"sekkoyok",
"sanseko":"sansekko",
"sansekotekiwia":"sansekkotekiwia",
"sansekoti":"sansekkoti",
"sansekotilia":"sansekkotilia",
"sansekotilia":"sansekkotilia",
"sansekoλalia":"sansekkoλalia",
"sansekoτin":"sansekkoτin",
"koςmikamiki":"koςmikkamiki",
"mikaohλi":"mikkaohλi",
"mikaλaltemilli":"mikkaλaltemilli",
"mikaτin":"mikkaτin",
"panpika":"panpikka",
"λaihyomikan":"λaihyomikkan",
"mikeλ":"mikkeλ",
"λixiko":"λixikko",
"ayokanah":"ayokkanah",
"noka":"nokka",
"pokisa":"pokkisa",
"neκa":"neκκa",
"meτalan":"meττalan",
"koκeτin":"koκeττin",
"κeκeτin":"κeκeττin",
"λaκeκeτin":"λaκeκeττin",
"κaneneτo":"κaneneττo",
"κatemeτon":"κatemeττon",
"κatemeτonti":"κatemeττonti",
"κatemeτontik":"κatemeττontik",
"ikxineneτo":"ikxineneττo",
"maneneτoti":"maneneττoti",
"maneneτotik":"maneneττotik",
"maneneτo":"maneneττo",
"neneτo":"neneττo",
"wiτoh":"wiττoh",
"λawiτoh":"λawiττoh",
"wiτoλ":"wiττoλ",
"λawiτoh":"λawiττoh",
"kohkotoτiτin":"kohkotoττiτin",
"kotoτin":"kotoττin",
"kohkotoτiτin":"kohkotoττiτin",
"κiλapilkotoτin":"κiλapilkotoττin",
"makotoτin":"makotoττin",
"λaςe":"λaςςe",
"nakaςihkiliwi":"nakaςςihkiliwi",
"nakaςihkiloa":"nakaςςihkiloa",
"nakaςihkilli":"nakaςςihkilli",
"nakaςihkiloa":"nakaςςihkiloa",
"nakaςihkilti":"nakaςςihkilti",
"nakaςihkiltik":"nakaςςihkiltik",
"paςoλ":"paςςoλ",
"λapaςoh":"λapaςςoh",
"λeςe":"λeςςe",
"ahweςoh":"ahweςςoh",
"ahweςowa":"ahweςςowa",
"κapeleςoh":"κapeleςςoh",
"κeςoλ":"κeςςoλ",
"keςolekλi":"keςςolekλi",
"λaahweςoh":"λaahweςςoh",
"λaahweςowa":"λaahweςςowa",
"κaiςiwi":"κaiςςiwi",
"okiςiςi":"okiςςiςi",
"κaiςoh":"κaiςςoh",
"κaiςowa":"κaiςςowa",
"κaiςoλ":"κaiςςoλ",
"okiςoλ":"okiςςoλ",
"λaliςoh":"λaliςςoh",
"totomoςoλ":"totomoςςoλ",
"nakasepowi":"nakassepowi",
"nakasepoya":"nakassepoya",
"mapahpasoλ":"mapahpassoλ",
"pahpasoλ":"pahpassoλ",
"κaesoh":"κaessoh",
"κaesoh":"κaessoh",
"κaesoh":"κaessoh",
"esoςiςina":"essoςiςina",
"esoh":"essoh",
"esokixtia":"essokixtia",
"esokisa":"essokisa",
"esotemo":"essotemo",
"esoti":"essoti",
"esotia":"essotia",
"esoλ":"essoλ",
"tesoλ":"tessoλ",
"λaesoh":"λaessoh",
"teposanilli":"tepossanilli",
"teposoλ":"tepossoλ",
"kakalapoa":"kakallapoa",
"kakalapoa":"kakallapoa",
"kahkalapoa":"kahkallapoa",
"kalapoa":"kallapoa",
"kahkalapoa":"kahkallapoa",
"kalapoa":"kallapoa",
"kakalapoa":"kakallapoa",
"kalapowilia":"kallapowilia",
"κaλalamiki":"κaλallamiki",
"wahwala":"wahwalla",
"wala":"walla",
"λalamiki":"λallamiki",
"λalamikilisλi":"λallamikilisλi",
"λalamikiltia":"λallamikiltia",
"aςiκali":"aςiκalli",
"aςiwali":"aςiwalli",
"awahkali":"awahkalli",
"amaxali":"amaxalli",
"amoxkali":"amoxkalli",
"anali":"analli",
"aλamaxali":"aλammaxalli",
"axali":"axalli",
"axκali":"axκalli",
"ayawali":"ayawalli",
"ayowali":"ayowalli",
"kakali":"kakalli",
"kawali":"kawalli",
"kali":"kalli",
"kali":"kalli",
"kamaςali":"kamaςalli",
"kamanali":"kamanalli",
"kamatapali":"kamatapalli",
"sempowali":"sempowalli",
"ςaςapali":"ςaςapalli",
"ςali":"ςalli",
"ςiςapali":"ςiςapalli",
"ςiςiwali":"ςiςiwalli",
"ςiwali":"ςiwalli",
"ςilλaκali":"ςilλaκalli",
"ςilλaxkali":"ςilλaxkalli",
"siwaλapiyali":"siwaλapiyalli",
"sinλaoyali":"sinλaoyalli",
"sinxahkali":"sinxahkalli",
"komali":"komalli",
"komonλali":"komonλalli",
"kopali":"kopalli",
"koxwali":"koxwalli",
"koxtali":"koxtalli",
"κahκali":"κahκalli",
"κawapali":"κawapalli",
"κali":"κalli",
"κamaxali":"κamaxalli",
"κameτkali":"κameτkalli",
"κanehpali":"κanehpalli",
"κakeτali":"κakeτalli",
"κaλamamali":"κaλamamalli",
"κaλaxkali":"κaλaxkalli",
"κatonali":"κatonalli",
"κaxali":"κaxalli",
"κaxikali":"κaxikalli",
"eloτonkali":"eloτonkalli",
"elλapali":"elλapalli",
"eλaκali":"eλaκalli",
"wahkali":"wahkalli",
"wahwalika":"wahwallika",
"wahwalikilia":"wahwallikilia",
"wawalika":"wawallika",
"walika":"wallika",
"walikilia":"wallikilia",
"walikilia":"wallikilia",
"wapali":"wapalli",
"wikali":"wikalli",
"wiτmahmaxali":"wiτmahmaxalli",
"wisali":"wisalli",
"ikpali":"ikpalli",
"ihyali":"ihyalli",
"ihyali":"ihyalli",
"ihsoλali":"ihsoλalli",
"iskali":"iskalli",
"itonali":"itonalli",
"istakkoxtali":"istakkoxtalli",
"istali":"istalli",
"masewali":"masewalli",
"maκali":"maκalli",
"maκilpowali":"maκilpowalli",
"mahmaxali":"mahmaxalli",
"maxali":"maxalli",
"mekaλaixpiyali":"mekaλaixpiyalli",
"meτkali":"meτkalli",
"milkawali":"milkawalli",
"nawali":"nawalli",
"nali":"nalli",
"nehpali":"nehpalli",
"nextamali":"nextamalli",
"ohmaxali":"ohmaxalli",
"okiςλapiyali":"okiςλapiyalli",
"otomali":"otomalli",
"pali":"palli",
"panali":"panalli",
"pansaλaκali":"pansaλaκalli",
"paτkali":"paτkalli",
"pewali":"pewalli",
"pihpilisali":"pihpilisalli",
"pihpirisali":"pihpirisalli",
"piτokali":"piτokalli",
"piyoλaκali":"piyoλaκalli",
"powali":"powalli",
"poyekλaxkali":"poyekλaxkalli",
"kimiςλaxkali":"kimiςλaxkalli",
"tamali":"tamalli",
"tapali":"tapalli",
"temali":"temalli",
"tenkawali":"tenkawalli",
"tenkamaςali":"tenkamaςalli",
"tenτokopali":"tenτokopalli",
"tenxippali":"tenxippalli",
"tepalkali":"tepalkalli",
"tepali":"tepalli",
"teposkamaςali":"teposkamaςalli",
"texwapali":"texwapalli",
"tixwapali":"tixwapalli",
"tixpali":"tixpalli",
"λaseseyali":"λaseseyalli",
"λaςihςiwali":"λaςihςiwalli",
"λaςiwali":"λaςiwalli",
"λaκahκali":"λaκahκalli",
"λaκali":"λaκalli",
"λahpali":"λahpalli",
"λahkokali":"λahkokalli",
"λahpiyali":"λahpiyalli",
"λawipanali":"λawipanalli",
"λaihτomali":"λaihτomalli",
"λaixpiyali":"λaixpiyalli",
"λali":"λalli",
"λali":"λalli",
"λamamali":"λamamalli",
"λamewali":"λamewalli",
"λanawali":"λanawalli",
"λaoyali":"λaoyalli",
"λapali":"λapalli",
"λapiτali":"λapiτalli",
"λapiyali":"λapiyalli",
"λapowali":"λapowalli",
"λakeτali":"λakeτalli",
"λatamaςiwali":"λatamaςiwalli",
"λatioςiwali":"λatioςiwalli",
"λaλamaςiwali":"λaλamaςiwalli",
"λaτinpewali":"λaτinpewalli",
"λaxkali":"λaxkalli",
"λasowali":"λasowalli",
"tokaτawali":"tokaτawalli",
"toςonkakali":"toςonkakalli",
"toςonλaκali":"toςonλaκalli",
"tonali":"tonalli",
"torohλaκali":"torohλaκalli",
"τaκali":"τaκalli",
"τawali":"τawalli",
"τinkali":"τinkalli",
"τintamali":"τintamalli",
"τokopali":"τokopalli",
"τonkali":"τonkalli",
"τonwahkali":"τonwahkalli",
"τonyowali":"τonyowalli",
"xaκali":"xaκalli",
"xahkali":"xahkalli",
"xali":"xalli",
"xaxakali":"xaxakalli",
"xikali":"xikalli",
"xippali":"xippalli",
"xiκali":"xiκalli",
"xokopali":"xokopalli",
"xokpali":"xokpalli",
"xopali":"xopalli",
"yawali":"yawalli",
"yawali":"yawalli",
"yowali":"yowalli",
"yowali":"yowalli",
"sakakali":"sakakalli",
"sakawali":"sakawalli",
"sali":"salli",
"sanκali":"sanκalli",
"sanκaliya":"sanκalliya",
"sasali":"sasalli",
"apipiyaloλ":"apipiyalloλ",
"kakaloλ":"kakalloλ",
"elλapaloh":"elλapalloh",
"wapaloλ":"wapalloλ",
"wisaloti":"wisalloti",
"wisalotik":"wisallotik",
"wisaloλ":"wisalloλ",
"itonaloh":"itonalloh",
"ixtemaloh":"ixtemalloh",
"λaixtemaloh":"λaixtemalloh",
"ixtemalowa":"ixtemallowa",
"maxaloh":"maxalloh",
"maxaloλ":"maxalloλ",
"pankakaloλ":"pankakalloλ",
"temaloh":"temalloh",
"temalowa":"temallowa",
"λaseseyaloλ":"λaseseyalloλ",
"λakowaloh":"λakowalloh",
"λaixtemaloh":"λaixtemalloh",
"λaloh":"λalloh",
"λalowa":"λallowa",
"λaloλ":"λalloλ",
"τinxaloλ":"τinxalloλ",
"τonkaloλ":"τonkalloλ",
"xaloλ":"xalloλ",
"sasaloλ":"sasalloλ",
"elan":"ellan",
"ameli":"amelli",
"aτehτeli":"aτehτelli",
"seseli":"seselli",
"seli":"selli",
"seli":"selli",
"ςekeli":"ςekelli",
"κeli":"κelli",
"eli":"elli",
"weli":"welli",
"ikneli":"iknelli",
"ihτeli":"ihτelli",
"τehτeli":"τehτelli",
"mapeli":"mapelli",
"neli":"nelli",
"neli":"nelli",
"neliya":"nelliya",
"nelneliya":"nelnelliya",
"peli":"pelli",
"kekeli":"kekelli",
"teli":"telli",
"tekeli":"tekelli",
"teteli":"tetelli",
"λaweli":"λawelli",
"τehτeli":"τehτelli",
"τikiteli":"τikitelli",
"τopeli":"τopelli",
"xeli":"xelli",
"axkaneloh":"axkanelloh",
"ixkaneloh":"ixkanelloh",
"alaxoxmilah":"alaxoxmillah",
"kaxtilan":"kaxtillan",
"iilamiki":"iillamiki",
"ilamiki":"illamiki",
"ilamikilia":"illamikilia",
"ilamikilia":"illamikilia",
"ilamikiltia":"illamikiltia",
"ixilamiki":"ixillamiki",
"milah":"millah",
"milahtenno":"millahtenno",
"tokaxilamiki":"tokaxillamiki",
"xilan":"xillan",
"ahawili":"ahawilli",
"apili":"apilli",
"awakamili":"awakamilli",
"awili":"awilli",
"axoxowili":"axoxowilli",
"axλaaxkatili":"axλaaxkatilli",
"axλamanextili":"axλamanextilli",
"senilia":"senillia",
"ςiςikili":"ςiςikilli",
"ςihςikili":"ςihςikilli",
"ςihkili":"ςihkilli",
"ςili":"ςilli",
"ςikili":"ςikilli",
"ςopili":"ςopilli",
"silςili":"silςilli",
"komonmili":"komonmilli",
"koneahawili":"koneahawilli",
"κaςiςili":"κaςiςilli",
"κahκalili":"κahκalilli",
"κalili":"κalilli",
"κaλaihilia":"κaλaihillia",
"κatopili":"κatopilli",
"κaxilomili":"κaxilomilli",
"κiκili":"κiκilli",
"κiλapili":"κiλapilli",
"ekawili":"ekawilli",
"eςiςikili":"eςiςikilli",
"eλapanili":"eλapanilli",
"wakςili":"wakςilli",
"weweyakili":"weweyakilli",
"wilili":"wililli",
"iςkayolκiλapili":"iςkayolκiλapilli",
"ikxopili":"ikxopilli",
"ihκili":"ihκilli",
"ilia":"illia",
"λaihilia":"λaihillia",
"iκsili":"iκsilli",
"ixkawili":"ixkawilli",
"ixkoilia":"ixkoillia",
"maκili":"maκilli",
"mahmaκili":"mahmaκilli",
"mahpili":"mahpilli",
"mawilili":"mawililli",
"malwili":"malwilli",
"memeλapili":"memeλapilli",
"meλapili":"meλapilli",
"mikkaλaltemili":"mikkaλaltemilli",
"mili":"milli",
"mimili":"mimilli",
"nakaςςihkili":"nakaςςihkilli",
"namakili":"namakilli",
"neκili":"neκilli",
"nemahmawtili":"nemahmawtilli",
"nenepili":"nenepilli",
"owamili":"owamilli",
"ompowili":"ompowilli",
"patili":"patilli",
"pehpeςili":"pehpeςilli",
"pisili":"pisilli",
"pili":"pilli",
"pili":"pilli",
"piτawςili":"piτawςilli",
"pixkowili":"pixkowilli",
"kexili":"kexilli",
"kimili":"kimilli",
"kikili":"kikilli",
"tenikxopili":"tenikxopilli",
"tepossanili":"tepossanilli",
"teτili":"teτilli",
"λaahxitili":"λaahxitilli",
"λaalpiςili":"λaalpiςilli",
"λaatili":"λaatilli",
"λaaxkatili":"λaaxkatilli",
"λakanawili":"λakanawilli",
"λaseselili":"λaseselilli",
"λakonetili":"λakonetilli",
"λahkomili":"λahkomilli",
"λahλanili":"λahλanilli",
"λahtolmili":"λahtolmilli",
"λawili":"λawilli",
"λaikpowili":"λaikpowilli",
"λaihilia":"λaihillia",
"λailpili":"λailpilli",
"λaixmaςyotili":"λaixmaςyotilli",
"λamaςtili":"λamaςtilli",
"λamahsiltili":"λamahsiltilli",
"λamanextili":"λamanextilli",
"λamanteilia":"λamanteillia",
"λamantiilia":"λamantiillia",
"λamili":"λamilli",
"λamimili":"λamimilli",
"λanawatili":"λanawatilli",
"λaneltokili":"λaneltokilli",
"λanexwili":"λanexwilli",
"λanextili":"λanextilli",
"λanokili":"λanokilli",
"λaompowili":"λaompowilli",
"λapahtili":"λapahtilli",
"λapanili":"λapanilli",
"λapayanili":"λapayanilli",
"λapiwilili":"λapiwililli",
"λatekpanili":"λatekpanilli",
"λateilia":"λateillia",
"λatenmoτkiltili":"λatenmoτkiltilli",
"λatenpiwilili":"λatenpiwililli",
"λatentili":"λatentilli",
"λatekiwili":"λatekiwilli",
"λatekili":"λatekilli",
"λaλamanili":"λaλamanilli",
"λatokili":"λatokilli",
"λatokili":"λatokilli",
"λatokiltili":"λatokiltilli",
"λaτakanili":"λaτakanilli",
"λaτinmoτkiltili":"λaτinmoτkiltilli",
"λaτinpiwilili":"λaτinpiwililli",
"λaτinλalwilili":"λaτinλalwililli",
"λaτonmoτkiltili":"λaτonmoτkiltilli",
"λaτonpiwilili":"λaτonpiwililli",
"λaxamanili":"λaxamanilli",
"λaxλawili":"λaxλawilli",
"λayektili":"λayektilli",
"λayowili":"λayowilli",
"λili":"λilli",
"λikeςili":"λikeςilli",
"tonalmili":"tonalmilli",
"topili":"topilli",
"τinλayowili":"τinλayowilli",
"τonκiλapili":"τonκiλapilli",
"τonekawili":"τonekawilli",
"τopelili":"τopelilli",
"xili":"xilli",
"xokςili":"xokςilli",
"xoςili":"xoςilli",
"xopili":"xopilli",
"yakaτonpili":"yakaτonpilli",
"yolilia":"yolillia",
"sakawili":"sakawilli",
"sanili":"sanilli",
"asiloh":"asilloh",
"ςiloh":"ςilloh",
"ςopiloλ":"ςopilloλ",
"siloλ":"silloλ",
"κiλapiloh":"κiλapilloh",
"ekawiloλ":"ekawilloλ",
"iκsiloλ":"iκsilloλ",
"iκsiloyoh":"iκsilloyoh",
"iκsiloyoλ":"iκsilloyoλ",
"malwiloh":"malwilloh",
"mimiloλ":"mimilloλ",
"oκiloh":"oκilloh",
"oκilowa":"oκillowa",
"λaςiloh":"λaςilloh",
"λatekiloλ":"λatekilloλ",
"λaλamaniloh":"λaλamanilloh",
"λaλamaniloλ":"λaλamanilloλ",
"λaλiloh":"λaλilloh",
"λiloh":"λilloh",
"κaςahkolamiλ":"κaςahkollamiλ",
"κaςahkolan":"κaςahkollan",
"κaςahkolanwia":"κaςahkollanwia",
"ahkoleκenia":"ahkolleκenia",
"akaκawisoli":"akaκawisolli",
"aςiλahtoli":"aςiλahtolli",
"akomoli":"akomolli",
"ahkoli":"ahkolli",
"aholyoli":"aholyolli",
"alaxoxatoli":"alaxoxatolli",
"apiloli":"apilolli",
"atoli":"atolli",
"kafenyoli":"kafenyolli",
"kahkaxtoli":"kahkaxtolli",
"kahτoatoli":"kahτoatolli",
"kamohatoli":"kamohatolli",
"kankekeτoli":"kankekeτolli",
"kaxtoli":"kaxtolli",
"kahkaxtoli":"kahkaxtolli",
"kaxtoliya":"kaxtolliya",
"ςakayoli":"ςakayolli",
"ςikoli":"ςikolli",
"ςilatoli":"ςilatolli",
"ςilmoli":"ςilmolli",
"ςilyoli":"ςilyolli",
"ςiκkoli":"ςiκkolli",
"ςoli":"ςolli",
"siwapilsosoli":"siwapilsosolli",
"sinatoli":"sinatolli",
"koli":"kolli",
"komoli":"komolli",
"kotonsosoli":"kotonsosolli",
"koyoli":"koyolli",
"κaςahkoli":"κaςahkolli",
"κawehweloli":"κawehwelolli",
"κawisoli":"κawisolli",
"κahyoli":"κahyolli",
"κalankaλahtoli":"κalankaλahtolli",
"κaτokoyoli":"κaτokoyolli",
"κahyoli":"κahyolli",
"κayoli":"κayolli",
"κeλaxkoli":"κeλaxkolli",
"κesoli":"κesolli",
"eloatoli":"eloatolli",
"eltemoli":"eltemolli",
"eyoli":"eyolli",
"wahkaλahtoli":"wahkaλahtolli",
"wapalλahκiloli":"wapalλahκilolli",
"wehpoli":"wehpolli",
"wihkoli":"wihkolli",
"iςkayoli":"iςkayolli",
"ikxikekeτoli":"ikxikekeτolli",
"ixtemoli":"ixtemolli",
"ixtiyoli":"ixtiyolli",
"makoyoli":"makoyolli",
"mahτoli":"mahτolli",
"mahτololi":"mahτololli",
"maτahatoli":"maτahatolli",
"moli":"molli",
"moτoli":"moτolli",
"nawaλahtoli":"nawaλahtolli",
"nemaihtoli":"nemaihtolli",
"nexatoli":"nexatolli",
"oli":"olli",
"ololi":"ololli",
"ompaiςkayoli":"ompaiςkayolli",
"okiςpilsosoli":"okiςpilsosolli",
"pasoli":"pasolli",
"piloli":"pilolli",
"pinoli":"pinolli",
"pipiloli":"pipilolli",
"poli":"polli",
"poli":"polli",
"poli":"polli",
"popoli":"popolli",
"kenkeτoli":"kenkeτolli",
"kekeςkeatoli":"kekeςkeatolli",
"kekeτoli":"kekeτolli",
"kekexkeatoli":"kekexkeatolli",
"tamaxokoatoli":"tamaxokoatolli",
"tapasoli":"tapasolli",
"tepoli":"tepolli",
"teposλahκiloli":"teposλahκilolli",
"teposλamawisoli":"teposλamawisolli",
"tekipaςoli":"tekipaςolli",
"λakakaτoli":"λakakaτolli",
"τokoli":"τokolli",
"λakomoli":"λakomolli",
"λaκeςoli":"λaκeςolli",
"λaκelpaςoli":"λaκelpaςolli",
"λahςinoli":"λahςinolli",
"λahκiloli":"λahκilolli",
"λahλakoli":"λahλakolli",
"λahtoli":"λahtolli",
"λawehweloli":"λawehwelolli",
"λaihλakoli":"λaihλakolli",
"λalokoτoli":"λalokoτolli",
"λamawisoli":"λamawisolli",
"λamaneloli":"λamanelolli",
"λamoli":"λamolli",
"λaneκiloli":"λaneκilolli",
"λapaςoli":"λapaςolli",
"λapasoli":"λapasolli",
"λapepeςoli":"λapepeςolli",
"λapopoli":"λapopolli",
"λatekpiςoli":"λatekpiςolli",
"λatenneteςoli":"λatenneteςolli",
"λatenpepeςoli":"λatenpepeςolli",
"λaτinneteςoli":"λaτinneteςolli",
"λaτinpepeςoli":"λaτinpepeςolli",
"λaτonneteςoli":"λaτonneteςolli",
"λaτonpepeςoli":"λaτonpepeςolli",
"λaxinehpaloli":"λaxinehpalolli",
"λaxinepaloli":"λaxinepalolli",
"λayoli":"λayolli",
"λasahsaloli":"λasahsalolli",
"λasaloli":"λasalolli",
"λasoli":"λasolli",
"λikoli":"λikolli",
"toli":"tolli",
"τokoyoli":"τokoyolli",
"τoli":"τolli",
"τoτoli":"τoτolli",
"xokoli":"xokolli",
"xokoyoli":"xokoyolli",
"xoli":"xolli",
"yakaτoli":"yakaτolli",
"yoli":"yolli",
"soli":"solli",
"soli":"solli",
"sosoli":"sosolli",
"sosoli":"sosolli",
"κayoloλ":"κayolloλ",
"ihtiyoloλ":"ihtiyolloλ",
"λaκelpaςoloh":"λaκelpaςolloh",
"λasahsaloloh":"λasahsalolloh",
"λasoloh":"λasolloh",
"λasoloλ":"λasolloλ",
"yoloλ":"yolloλ",
"λaxima":"λaxxima",
"κaκeλaxoλ":"κaκeλaxxoλ",
"κeλaxoλ":"κeλaxxoλ",
"waxoλ":"waxxoλ",
"ikxiκeλaxoλ":"ikxiκeλaxxoλ",
"ixκeλaxoλ":"ixκeλaxxoλ",
"ixtenκeλaxoλ":"ixtenκeλaxxoλ",
"maκeλaxoλ":"maκeλaxxoλ",
"mantekaxoh":"mantekaxxoh",
"panκeλaxoλ":"panκeλaxxoλ",
"τonκeλaxoλ":"τonκeλaxxoλ",
"κapelexoςiλ":"κapelexxoςiλ",
"nexoh":"nexxoh",
"λanexoh":"λanexxoh",
"ixayakaλ":"ixxayakaλ",
"ixipewa":"ixxipewa",
"ixipewi":"ixxipewi",
"ixixipeka":"ixxixipeka",
"ixixipeτa":"ixxixipeτa",
"κatixoλ":"κatixxoλ",
"κatixoλ":"κatixxoλ",
"matixoh":"matixxoh",
"mixoλ":"mixxoλ",
"tixoh":"tixxoh",
"tixoλ":"tixxoλ",
"λatixoh":"λatixxoh",
"aλawahkaλan":"aλawwahkaλan",
"κatewia":"κatewwia",
"κatewilia":"κatewwilia",
"κatewilia":"κatewwilia",
"ixκatewia":"ixκatewwia",
"mixκatewia":"mixκatewwia"
  },
  findGeminate:function(s){
    return gmn.map[s]? gmn.map[s] : s ;
  }
};

//exports.gmn = gmn;
export { gmn };
