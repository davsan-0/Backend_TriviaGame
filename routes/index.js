var express = require('express');
var router = express.Router();

const Tables = require('../database-connection');
const _ = require('lodash');
const Question = require('../models/question');
const Session = require('../models/session');
const sequelize = require('sequelize');
const uuid = require('uuid/v4');
const TcpServer = require('../tcpserver')
const randomstring = require('randomstring');

const PORT_START = 19000;
const PORT_END = 19999;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.send("Crab");
});

router.get('/initdb', function(req, res, next) {
	insertQuestionToDatabase(
		"Presidents of the United States",
		"George Washington;Washington|John Adams;Adams|Thomas Jefferson;Jefferson|James Madison;Madison|James Monroe;Monroe|John Quincy Adams;Jon Quincy Adams;Quincy Adams|Andrew Jackson;Jackson|Martin Van Buren;Van Buren|William Henry Harrison;Harrison|John Tyler;Tyler|James K. Polk;James K Polk;Polk|Zachary Taylor;Taylor|Millard Fillmore;Fillmore|Franklin Pierce;Pierce|James Buchanan;Buchanan|Abraham Lincoln;Lincoln|Andrew Johnson|Ulysses S. Grant;Ulysses S Grant;Grant|Rutherford B. Hayes;Hayes|James A. Garfield;Garfield|Chester A. Arthur;Arthur|Grover Cleveland;Cleveland|Benjamin Harrison;Harrison|William McKinley;McKinley|Theodore Roosevelt;Teddy Roosevelt;Ted Roosevelt;Roosevelt|William Howard Taft;Taft|Woodrow Wilson;Wilson|Warren G. Harding;Harding|Calvin Coolidge;Coolidge|Herbert Hoover;Hoover|Franklin D. Roosevelt;FDR|Harry S. Truman;S. Truman;S Truman;Truman|Dwight D. Eisenhower;Eisenhower|John F. Kennedy;Kennedy|Lyndon B. Johnson;Johnson|Richard Nixon;Nixon|Gerald Ford;Ford|Jimmy Carter;Carter|Ronald Reagan;Reagan|George H. W. Bush;H W Bush;H. W. Bush;George Bush|Bill Clinton;Clinton|George W. Bush;W. Bush;W Bush|Barack Obama;Obama|Donald Trump;Trump",
		"Politics"
	);
	insertQuestionToDatabase(
		"US States",
		"Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming",
		"Geography"
	);
	insertQuestionToDatabase(
		"Countries in Europe",
		"Albania|Andorra|Armenia|Austria|Azerbaijan|Belarus|Belgium|Bosnia and Herzegovina;Bosnia|Bulgaria|Croatia|Cyprus|Czech Republic;Czech|Denmark|Estonia|Finland|France|Georgia|Germany|Greece|Hungary|Iceland|Ireland|Italy|Kazakhstan|Kosovo|Latvia|Liechtenstein|Lithuania|Luxembourg|Macedonia;FYROM|Malta|Moldova|Monaco|Montenegro|Netherlands;Holland|Norway|Poland|Portugal|Romania|Russia|San Marino|Serbia|Slovakia|Slovenia|Spain|Sweden|Switzerland|Turkey|Ukraine|United Kingdom;UK|Vatican City;Holy See",
		"Geography"
	);
	insertQuestionToDatabase(
		"James Bond Movies",
		"Dr. No;Dr No|From Russia With Love|Goldfinger|Thunderball|You Only Live Twice;YOLT|On Her Majesty's Secret Service;On Her Majestys Secret Service|Diamonds Are Forever|Live and Let Die|The Man with the Golden Gun|The Spy Who Loved Me|Moonraker|For Your Eyes Only|Octopussy|A View to a Kill|The Living Daylights|Licence to Kill|GoldenEye;Golden Eye|Tomorrow Never Dies|The World Is Not Enough|Die Another Day|Casino Royale|Quantum of Solace|Skyfall|Spectre",
		"Entertainment"
	);
	insertQuestionToDatabase(
		"James Bond Actors",
		"Sean Connery;Connery|George Lazenby;Lazenby|Roger Moore;Moore|Timothy Dalton;Dalton|Pierce Brosnan;Brosnan|Daniel Craig;Craig",
		"Entertainment"
	);
	insertQuestionToDatabase(
		"Teams in the NHL (National Hockey League)",
		"Boston Bruins;Bruins|Buffalo Sabres;Sabres|Detroit Red Wings;Red Wings|Florida Panthers;Panthers|Montreal Canadiens;Canadiens|Ottawa Senators;Senators|Tampa Bay Lightning;Lightning|Toronto Maple Leafs;Maple Leafs|Carolina Hurricanes;Hurricanes|Columbus Blue Jackets;Blue Jackets|New Jersey Devils;Devils|New York Islanders;Islanders|New York Rangers;Rangers|Philadelphia Flyers;Flyers|Pittsburgh Penguins;Penguins|Washington Capitals;Capitals|Chicago Blackhawks;Blackhawks|Colorado Avalanche;Avalanche|Dallas Stars;Stars|Minnesota Wild;Wild|Nashville Predators;Predators|St. Louis Blues;St Louis Blues;Blues|Winnipeg Jets;Jets|Anaheim Ducks;Ducks|Arizona Coyotes;Coyotes|Calgary Flames;Flames|Edmonton Oilers;Oilers|Los Angeles Kings;Kings|San Jose Sharks;Sharks|Vancouver Canucks;Canucks|Vegas Golden Knights;Golden Knights",
		"Entertainment"
	);
	insertQuestionToDatabase(
		"151 Original Pokémon",
		"Bulbasaur|Ivysaur|Venusaur|Charmander|Charmeleon|Charizard|Squirtle|Wartortle|Blastoise|Caterpie|Metapod|Butterfree|Weedle|Kakuna|Beedrill|Pidgey|Pidgeotto|Pidgeot|Rattata|Raticate|Spearow|Fearow|Ekans|Arbok|Pikachu|Raichu|Sandshrew|Sandslash|Nidoran|Nidorina|Nidoqueen|Nidoran|Nidorino|Nidoking|Clefairy|Clefable|Vulpix|Ninetales|Jigglypuff|Wigglytuff|Zubat|Golbat|Oddish|Gloom|Vileplume|Paras|Parasect|Venonat|Venomoth|Diglett|Dugtrio|Meowth|Persian|Psyduck|Golduck|Mankey|Primeape|Growlithe|Arcanine|Poliwag|Poliwhirl|Poliwrath|Abra|Kadabra|Alakazam|Machop|Machoke|Machamp|Bellsprout|Weepinbell|Victreebel|Tentacool|Tentacruel|Geodude|Graveler|Golem|Ponyta|Rapidash|Slowpoke|Slowbro|Magnemite|Magneton|Farfetch'd|Doduo|Dodrio|Seel|Dewgong|Grimer|Muk|Shellder|Cloyster|Gastly|Haunter|Gengar|Onix|Drowzee|Hypno|Krabby|Kingler|Voltorb|Electrode|Exeggcute|Exeggutor|Cubone|Marowak|Hitmonlee|Hitmonchan|Lickitung|Koffing|Weezing|Rhyhorn|Rhydon|Chansey|Tangela|Kangaskhan|Horsea|Seadra|Goldeen|Seaking|Staryu|Starmie|Mr. Mime;Mr Mime|Scyther|Jynx|Electabuzz|Magmar|Pinsir|Tauros|Magikarp|Gyarados|Lapras|Ditto|Eevee|Vaporeon|Jolteon|Flareon|Porygon|Omanyte|Omastar|Kabuto|Kabutops|Aerodactyl|Snorlax|Articuno|Zapdos|Moltres|Dratini|Dragonair|Dragonite|Mewtwo|Mew",
		"Entertainment"
	);
	insertQuestionToDatabase(
		"League of Legends Champions (As of 7/2019)",
		"Aatrox|Ahri|Akali|Alistar|Amumu|Anivia|Annie|Ashe|Azir|Blitzcrank|Brand|Braum|Caitlyn|Cassiopeia|Cho'Gath|Corki|Darius|Diana|Dr. Mundo;Dr Mundo;Mundo|Draven|Elise|Evelynn|Ezreal|Fiddlesticks|Fiora|Fizz|Galio|Gangplank|Garen|Gnar|Gragas|Graves|Hecarim|Heimerdinger|Irelia|Janna|Jarvan IV|Jax|Jayce|Jinx|Kalista|Karma|Karthus|Kassadin|Katarina|Kayle|Kennen|Kha'Zix|Kog'Maw|LeBlanc|Lee Sin|Leona|Lissandra|Lucian|Lulu|Lux|Malphite|Malzahar|Maoki|Master Yi|Miss Fortune|Mordekaiser|Morgana|Nami|Nasus|Nautilus|Nidalee|Nocturne|Nunu|Olaf|Orianna|Pantheon|Poppy|Quinn|Rammus|Rek'Sai|Renekton|Rengar|Riven|Rumble|Ryze|Sejuani|Shaco|Shen|Shyvana|Singed|Sion|Sivir|Skarner|Sona|Soraka|Swain|Syndra|Talon|Taric|Teemo|Thresh|Tristana|Trundle|Tryndamere|Twisted Fate|Twitch|Udyr|Urgot|Varus|Vayne|Veigar|Vel'Koz|Vi|Viktor|Vladimir|Volibear|Warwick|Wukong|Xerath|Xin Zhao|Yasuo|Yorick|Zac|Zed|Ziggs|Zilean|Zyra|Qiyana|Yuumi|Sylas|Neeko|Pyke|Kai'Sa|Zoe|Ornn|Kayn|Rakan|Xayah|Camille|Ivern|Kled|Taliyah|Aurelion Sol|Jhin|Illaoi|Kindred|Tahm Kench|Ekko|Bard",
		"Entertainment"
	);
	insertQuestionToDatabase(
		"Super Smash Bros. Roster (Nintendo 64)",
		"Luigi|Mario|Donkey Kong;D.K;DK;D K|Link|Samus|Captain Falcon;C. Falcon;C Falcon;Falcon|Ness|Yoshi|Kirby|Fox|Pikachu|Jigglypuff",
		"Entertainment"
	);
	insertQuestionToDatabase(
		"Counties of South America",
		"Argentina|Bolivia|Brazil|Chile|Colombia|Ecuador|Guyana|Paraguay|Peru|Suriname|Uruguay|Venezuela",
		"Geography"
	);
	insertQuestionToDatabase(
		"Counties of Asia",
		"Armenia|Azerbaijan|Bahrain|Bangladesh|Bhutan|Brunei|Cambodia|China|Cyprus|Georgia|India|Indonesia|Iran|Iraq|Israel|Japan|Jordan|Kazakhstan|Kuwait|Kyrgyzstan|Laos|Lebanon|Malaysia|Maldives|Mongolia|Myanmar|Nepal|North Korea|Oman|Pakistan|Palestine|Philippines|Qatar|Russia|Saudi Arabia|Singapore|South Korea|Sri Lanka|Syria|Taiwan|Tajikistan|Thailand|Timor Leste|Turkey|Turkmenistan|United Arab Emirates;UAE|Uzbekistan|Vietnam|Yemen",
		"Geography"
	);
	insertQuestionToDatabase(
		"Counties of Africa",
		"Algeria|Angola|Benin|Botswana|Burkina Faso|Burundi|Cabo Verde|Cameroon|Central African Republic|Chad|Comoros|Democratic Republic of the Congo;DR Congo;East Congo|Republic of the Congo;Congo Republic;West Congo;Congo-Brazzaville|Ivory Coast;Cote d'Ivoire|Djibouti|Egypt|Equatorial Guinea|Eritrea|Ethiopia|Gabon|Gambia|Ghana|Guinea|Guinea Bissau|Kenya|Lesotho|Liberia|Libya|Madagascar|Malawi|Mali|Mauritania|Mauritius|Morocco|Mozambique|Namibia|Niger|Nigeria|Rwanda|São Tomé and Príncipe;Sao Tome and Principe|Senegal|Seychelles|Sierra Leone|Somalia|South Africa|South Sudan|Sudan|Swaziland|Tanzania|Togo|Tunisia|Uganda|Zambia|Zimbabwe",
		"Geography"
	);
	insertQuestionToDatabase(
		"Seinfeld characters appearing in more than 5 episodes",
		"Jerry Seinfeld;Jerry|George Costanza;George|Elaine Benes;Elaine|Cosmo Kramer;Kramer|Ruthie Cohen;Cohen|Newman|Frank Costanza;Frank|Estelle Costanza;Estelle|Susan Ross;Susan|Morty Seinfeld;Morty|Helen Seinfeld;Helen|J. Peterman;Peterman;J Peterman|George Steinbrenner;Steinbrenner|Uncle Leo;Leo|Matt Wilhelm;Matt;Wilhelm|David Puddy;David;Puddy|Mr. Lippman;Lippman;Mr Lippman|Justin Pitt;Justin;Pitt|Mickey Abbott;Mickey;Abbott|Russell Dalrymple;Dalrymple|Kenny Bania;Bania;Kenny|Crazy Joe Davola;Joe Davola;Joe;Davola|Dugan|Jackie Chiles;Chiles;Jackie|Larry|Jack Klompus;Klompus;Jack",
		"Entertainment"
	);
	insertQuestionToDatabase(
		"The Seven Deadly Sins",
		"Lust|Gluttony|Greed|Sloth|Wrath|Envy|Pride",
		"History"
	);
	insertQuestionToDatabase(
		"Plagues of Egypt",
		"Water to Blood;Blood|Frogs;Amphibians|Lice or Gnats;Lice;Gnats|Wild Animals or Flies;Flies;Wild Animals;Animals|Pestilence of Livestock;Pestilence;Disease of Livestock;Disease on Livestock|Boils|Thunderstorm of Hail and Fire;Thunderstorm;Hail;Darkness for 3 Days;Darkness|Death of Firstborn|Firstborn",
		"History"
	);
	insertQuestionToDatabase(
		"7 Wonders of the Ancient World",
		"Great Pyramid at Giza;Giza;Pyramid|Hanging Gardens of Babylon;Hanging Gardens|Statue of Zeus at Olympia|Zeus;Statue of Zeus|Temple of Artemis;Artemis|Mausoleum at Halicarnassus;Mausoleum;Halicarnassus|Colossus of Rhodes;Colossus;Rhodes|Lighthouse of Alexandria;Lighthouse;Alexandria",
		"History"
	);
	insertQuestionToDatabase(
		"Colors of the Rainbow",
		"Red|Orange|Yellow|Green|Blue|Indigo|Violet",
		""
	);
	insertQuestionToDatabase(
		"Planets of our Solar System",
		"Mercury|Venus|Earth;Tellus|Mars|Jupiter|Saturn|Uranus|Neptune",
		""
	);
	insertQuestionToDatabase(
		"Greek Olympian Gods",
		"Zeus|Hera|Poseidon|Hermes|Hestia|Athena|Ares|Demeter|Apollo|Hephaestus|Artemis|Aphrodite",
		"History"
	);
	insertQuestionToDatabase(
		"Game of Thrones Main Characters",
		"Eddard 'Ned' Stark;Ned;Eddard|Robert Baratheon;Bobby B;Robert|Jaime Lannister;Jaime;Kingslayer|Catelyn Stark;Catelyn|Cersei Lannister;Cersei|Daenerys Targaryen;Daenerys;Dany;Khaleesi|Jorah Mormont;Jorah|Viserys Targaryen;Viserys|Jon Snow;Jon;Aegon|Sansa Stark;Sansa|Arya Stark;Arya|Robb Stark;Robb|Theon Greyjoy;Theon;Reek|Bran Stark;Bran|Joffrey Baratheon;Joffrey|Sandor Clegane;The Hound;Hound;Sandor|Tyrion Lannister;Tyrion|Khal Drogo;Drogo|Petyr Baelish;Littlefinger;Petyr|Davos Seaworth;Davos|Samwell Tarly;Sam|Stannis Baratheon;Stannis|Melisandre|Jeor Mormont;Jeor|Bronn|Varys|Shae|Margaery Tyrell|Margaery|Tywin Lannister;Tywin|Talisa Maegyr;Talisa|Ygritte|Gendry|Tormund Giantsbane;Tormund|Brienne of Tarth;Brienne|Ramsay Bolton;Ramsay|Gilly|Daario Naharis;Daario|Missandei|Ellaria Sand;Ellaria|Tommen Baratheon;Tommen|Jaqen H'ghar;Jaqen|Roose Bolton;Roose|The High Sparrow;High Sparrow|Grey Worm;Torgo Nudho",
		"Entertainment"
	);		
	




	


	res.send("init");
});

router.get('/questions', function(req, res, next) {
	if (!req.query.limit)
	{
		req.query.limit = 100;
	}
	getRandomQuestions(req.query.limit, function(err, questions) {
		res.send(questions);
	});
});

router.get('/host', function(req, res, next) {
	
	Tables.Sessions.findAll({
		limit: 1,
		order: [ ['port', 'DESC'] ]
	}).then(object => {
		console.log("port = " + object[0].port);
		//var newPort = (object[0].port >= PORT_END) ? PORT_START : object[0].port + 1;
		var newPort = object[0].port + 1;
		if (newPort > PORT_END )
		{
			next(new Error('PORT OUT OF RANGE'));
			return;
		} else if (newPort < PORT_START)
		{
			newPort = PORT_START;
		}
		var code = generateCode();
		let session = new Session(code, newPort);

		Tables.Sessions.create(session).then(() => {
			TcpServer.startServer(newPort);
			res.send(JSON.stringify(session));
		});
	});
	
});

router.get('/join', function(req, res, next) {
	Tables.Sessions.findOne({ where: {code: req.query.code}, attributes: ['code', 'port'] }).then(object => {
		res.send(JSON.stringify(object));
	});
});

router.get('/insert', function(req, res, next) {
	insertQuestionToDatabase (req.query.questionText, req.query.answerList, req.query.category, function (err, question) {
		if (err)
		{
			console.log(err);
			res.send("errr");
		}
		res.send(question);
	});
});

function insertQuestionToDatabase (questionText, answerList, category, callback)
{
	let question = new Question(questionText, answerList, category);
	Tables.Questions.create(prepQuestion(question)).then(() => {
		if (callback) callback(null, question);
	});
}

function getRandomQuestions (amount, callback) {
	Tables.Questions.findAll({
		attributes: ['id', 'questionText', 'category', 'answerList'],
		limit: amount, 
		order: [[sequelize.fn('RANDOM')]] 
	}).then(questions => {
		if (callback) callback(null, questions);
	});
}

function prepQuestion (question) {
	var json = JSON.stringify(question.answerList);
	json = json.slice(1, json.length - 1); // Removes start and end quotes

	return _.assign(question, { answerList: json });
}

function debriefQuestion (question) {
	return _.assign(question, { answerList: JSON.parse(question.answerList) });
}

function debriefQuestions (questions) {
	console.log(questions.map((question) => { console.log(question)}));
	return questions.map((question) => { return debriefQuestion(question); });
}

function generateCode() {
	return randomstring.generate({
		length: 4,
		charset: 'alphabetic',
		capitalization: 'uppercase'
	});
}

module.exports = router;
