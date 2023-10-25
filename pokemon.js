// Erstellung der readline-Schnittstelle für Benutzereingaben
const readline = require('readline');
const chalk = require('chalk');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

// Klasse für Angriffsattacken
class AttackSkill {
constructor(name, type, damage) {
this.name = name;
this.type = type;
this.damage = damage;
}
}

// Klasse für Status-Attacken
class StatusAttackSkill {
constructor(name, type, effect) {
this.name = name;
this.type = type;
this.effect = effect;
}
}

// Klasse für Pokémon
class Pokemon {
constructor(name, type, health) {
this.name = name;
this.type = type;
this.health = health;
this.initialHealth = health;
this.skills = [];
this.statusEffects = [];
this.color = null;
}

// Funktion zum Erlernen einer Angriffsattacke
learnAttackSkill(attack) {
this.skills.push(attack);
}

// Funktion zum Erlernen einer Status-Attacke
learnStatusAttack(statusAttack) {
this.skills.push(statusAttack);
}

// Funktion zum Anzeigen des Status des Pokémon
showStatus() {
console.log(chalk.white(`${this.name} (${this.type}) Status`));
const maxHealth = this.initialHealth;
const currentHealth = Math.max(this.health, 0); // Mindestgesundheit auf 0 setzen
const healthBarLength = Math.round((currentHealth / maxHealth) * 20);

const healthBar = Array(healthBarLength + 1).join('█');
const emptyBar = Array(20 - healthBarLength + 1).join(' ');

console.log(chalk.red(`KP: [${chalk.red(healthBar)}${chalk.grey(emptyBar)}] ${currentHealth}/${maxHealth}`));

if (this.statusEffects.length > 0) {
console.log(chalk.yellow(`Status-Effekte: ${this.statusEffects.join(', ')}`));
}
}

// Funktion für den Angriff
attack(skillIndex, target) {
const skill = this.skills[skillIndex];
if (!skill) {
console.log(chalk.red(`${this.name} kann diese Attacke nicht ausführen!`));
return;
}

if (skill instanceof AttackSkill) {
console.log(chalk.green(`${this.name} (${this.type}) führt die Attacke '${skill.name}' erfolgreich aus!`));
target.health -= skill.damage;
console.log(chalk.green(`${target.name} hat ${skill.damage} Schaden erlitten`));
} else if (skill instanceof StatusAttackSkill) {
console.log(chalk.green(`${this.name} (${this.type}) führt die Status-Attacke '${skill.name}' erfolgreich aus!`));
target.applyStatusEffect(skill.effect);
}
target.showStatus();
}

// Funktion zur Anwendung eines Status-Effekts
applyStatusEffect(effect) {
if (!this.statusEffects.includes(effect)) {
this.statusEffects.push(effect);
}
}

// Funktion zum Entfernen eines Status-Effekts
removeStatusEffect(effect) {
const index = this.statusEffects.indexOf(effect);
if (index !== -1) {
this.statusEffects.splice(index, 1);
}
}
}

// Erstellen von Angriffsattacken
const donnerblitz = new AttackSkill("Donnerblitz", "Elektro", 45);
const rankenhieb = new AttackSkill("Rankenhieb", "Pflanze", 30);
const wasserkanone = new AttackSkill("Wasserkanone", "Wasser", 50);
const tackle = new AttackSkill("Tackle", "Normal", 35);
const flammenwurf = new AttackSkill("Flammenwurf", "Feuer", 60);
const psystrahl = new AttackSkill("Psystrahl", "Psycho", 55);
const aquaknarre = new AttackSkill("Aquaknarre", "Wasser", 55);
const drachenklaue = new AttackSkill("Drachenklaue", "Drache", 60);
const fliegen = new AttackSkill("Fliegen", "Flug", 50);
const turbotackle = new AttackSkill("Turbotackle", "Normal", 55);

// Erstellen von Status-Attacken
const paralyseAttack = new StatusAttackSkill("Paralyse", "Status", "Paralyse");
const sleepAttack = new StatusAttackSkill("Schlaf", "Status", "Schlaf");

// Farben für die Konsolenausgabe
const colors = [chalk.red, chalk.yellow, chalk.green, chalk.blue, chalk.magenta, chalk.cyan];

// Pokémon-Daten
const pokemonData = [
{ name: "Pikachu", type: "Elektro", health: 120, skills: [donnerblitz, tackle] },
{ name: "Glurak", type: "Feuer", health: 140, skills: [flammenwurf, turbotackle] },
{ name: "Mewtu", type: "Psycho", health: 160, skills: [psystrahl, donnerblitz] },
{ name: "Mew", type: "Psycho", health: 150, skills: [psystrahl, donnerblitz] },
{ name: "Lavados", type: "Feuer", health: 150, skills: [flammenwurf, fliegen] },
{ name: "Dragoran", type: "Drache", health: 160, skills: [drachenklaue, fliegen] },
{ name: "Bisaflor", type: "Pflanze", health: 160, skills: [rankenhieb, wasserkanone] },
{ name: "Turtok", type: "Wasser", health: 160, skills: [aquaknarre, turbotackle] }
];

// Erstellen von Pokémon-Objekten
const pokemonList = pokemonData.map((data, index) => {
const pokemon = new Pokemon(data.name, data.type, data.health);
pokemon.color = colors[index % colors.length];
data.skills.forEach(skill => {
if (skill.type === "Status") {
pokemon.learnStatusAttack(skill);
} else {
pokemon.learnAttackSkill(skill);
}
});
return pokemon;
});

let playerPokemon;
let computerOpponent;
let isPlayerTurn = true;

// Funktion zur Anzeige der verfügbaren Pokémon
function showPokemonList() {
console.log(chalk.bold("Wähle ein Pokémon:"));
pokemonList.forEach((pokemon, index) => {
console.log(`${index + 1}: ${pokemon.color(pokemon.name)} (${pokemon.type}) - KP: ${pokemon.health}`);
});
}

// Funktion zum Auswahl des Spieler-Pokémon
function choosePokemon() {
showPokemonList();
rl.question("Wähle die Nummer deines Pokémon: ", (selected) => {
const playerIndex = parseInt(selected) - 1;
if (playerIndex >= 0 && playerIndex < pokemonList.length) {
playerPokemon = pokemonList[playerIndex];
console.log(chalk.green(`Du spielst mit ${playerPokemon.color(playerPokemon.name)} (${playerPokemon.type})`));
chooseComputerOpponent();
} else {
console.log(chalk.red("Ungültige Auswahl."));
choosePokemon();
}
});
}

// Funktion zur Auswahl des Computer-Gegners
function chooseComputerOpponent() {
const opponentIndex = Math.floor(Math.random() * pokemonList.length);
computerOpponent = pokemonList[opponentIndex];
console.log(chalk.red(`Der Computer ist ${computerOpponent.color(computerOpponent.name)} (${computerOpponent.type})`));
startBattle();
}

// Funktion zum Starten des Pokémon-Kampfes
function startBattle() {
console.log(chalk.bold(`${playerPokemon.color(playerPokemon.name)} (${playerPokemon.type}) vs. ${computerOpponent.color(computerOpponent.name)} (${computerOpponent.type}) - Der Kampf beginnt!`));
if (isPlayerTurn) {
playerTurn();
} else {
computerOpponentTurn();
}
}

// Funktion für den Spielerzug
function playerTurn() {
console.log(chalk.green(`${playerPokemon.color(playerPokemon.name)} (${playerPokemon.type}), du bist dran!`));
console.log(chalk.bold("Welchen Angriff möchtest du ausführen?"));
playerPokemon.skills.forEach((skill, index) => {
console.log(`${index + 1}: ${skill.name} - Typ: ${skill.type}, Schaden: ${skill.damage}`);
});

rl.question("Wähle einen Angriff (1, 2, usw.): ", (selected) => {
const attackIndex = parseInt(selected) - 1;
if (attackIndex >= 0 && attackIndex < playerPokemon.skills.length) {
playerPokemon.attack(attackIndex, computerOpponent);
checkBattleResult();
} else {
console.log(chalk.red("Ungültige Auswahl. Versuche es erneut."));
playerTurn();
}
});
}

// Funktion für den Computer-Gegnerzug
function computerOpponentTurn() {
const randomAttackIndex = Math.floor(Math.random() * computerOpponent.skills.length);
const selectedAttack = computerOpponent.skills[randomAttackIndex];
computerOpponent.attack(randomAttackIndex, playerPokemon);
playerPokemon.showStatus();
computerOpponent.showStatus();
console.log(chalk.blue(`${computerOpponent.color(computerOpponent.name)} (${computerOpponent.type}) verwendet ${selectedAttack.name}.`));
checkBattleResult();
}

// Funktion zur Überprüfung des Kampfergebnisses
function checkBattleResult() {
if (playerPokemon.health <= 0) {
endBattle(chalk.red("GAME OVER"));
} else if (computerOpponent.health <= 0) {
endBattle(`${chalk.green(playerPokemon.color(playerPokemon.name))} Win's!`);
} else {
isPlayerTurn = !isPlayerTurn;
startBattle();
}
}

// Animation der Endkampfnachricht
async function animateEndBattle(message) {
const coloredMessage = message.replace(/(\w+)\s(gewinnt)/, `${chalk.green("$1")} $2`);
let animatedMessage = '';

for (let i = 0; i < coloredMessage.length; i++) {
animatedMessage += coloredMessage[i];
process.stdout.write('\r' + chalk.bold(animatedMessage));
await sleep(125);
}

console.log('\n');

const farewellMessage = "Vielen Dank für's Spielen. Bis zum nächsten Mal!";
let animatedFarewell = '';

for (let i = 0; i < farewellMessage.length; i++) {
animatedFarewell += farewellMessage[i];
process.stdout.write('\r' + chalk.bold(animatedFarewell));
await sleep(125);
}

console.log('\n');

rl.question("Möchtest du eine weitere Runde spielen? (ja/nein): ", (answer) => {
if (answer.toLowerCase() === "ja") {
choosePokemon();
} else {
console.log(chalk.bold("Vielen Dank für's Spielen. Bis zum nächsten Mal!"));
rl.close();
}
});
}

// Funktion zum Beenden des Kampfes
function endBattle(message) {
animateEndBattle(message);
}

// Funktion zum Verzögern (zur Animation)
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

// Animation des Willkommens-Textes und Start des Spiels
async function animateWelcomeText() {
const welcomeText = "Willkommen zu Pokémon";
const colors = [chalk.red, chalk.yellow, chalk.green, chalk.blue, chalk.magenta, chalk.cyan];
let animatedText = '';
for (let i = 0; i < welcomeText.length; i++) {
const color = colors[i % colors.length];
animatedText += color(welcomeText[i]);
process.stdout.write('\r' + chalk.bold(animatedText));
await sleep(125);
}
console.log('\n');
}

// Funktion zum Starten des Spiels
function startGame() {
animateWelcomeText().then(() => {
choosePokemon();
});
}

// Starte das Spiel
startGame(); 