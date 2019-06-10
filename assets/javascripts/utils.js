function refreshTooltip(){
	let className = getSelectedClassName();
	let spellName = getSelectedSpellName();
	if(className && spellName){
		loadSpellData(className, spellName, updateTooltip);
		loadSpellData(className, spellName, buildBreakpointsTable);
	}
}

function updateTooltip(spellData){
	$('#tooltip').html(buildTooltipHtmlForSpell(spellData, calculateMostEfficientRank(getCharacterLevel(), getHealingPower(), spellData)));
	showResult();
}

function showSpellSelectionFor(className){
	let container = $('#spell-selection').find('.navbar');
	if(!className) {
		$('#spell-selection').addClass('hidden');
	} else {
		buildSpellHtmlForClass(className, container);
		$('#spell-selection').removeClass('hidden');
	}
}

function setRandomBackground() {
	let backgrounds = ["Kalimdor.png", "EasternKingdoms.png"];
	$('body').css('background', `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url("../images/${backgrounds[Math.floor(Math.random() * backgrounds.length)]}"`);
}

function hideTip(){
	$('#tip-container').hide();
}

function newRandomTip(){
	$('#tip-container').show();
	loadJSON('/data/tips.json', updateTip);
}

function updateTip(tipData){
	$('#tip').html(tipData.tips[Math.floor(Math.random() * tipData.tips.length)]);
}

function hideResult(){
	$('#result').addClass("hidden");
}

function showResult(){
	$('#result').removeClass("hidden");
}

function hideCritChance(){
	$('#crit-chance-container').addClass("hidden");
}

function showCritChance(){
	$('#crit-chance-container').removeClass("hidden");
}

function getSelectedClassName(){
	return $('.wow-spell.active').data('class-name');
}

function getSelectedSpellName(){
	return $('.wow-spell.active').data('spell-name');
}

function getCharacterLevel(){
	let characterLevel = $('#level').val();
	if(!characterLevel || characterLevel < 1) characterLevel = 1;
	if(characterLevel > 60) characterLevel = 60;
	return characterLevel;
}

function getHealingPower(){
	let healingPower = $('#healing').val();
	if(!healingPower || healingPower < 0) healingPower = 0;
	if(healingPower > 5000) healingPower = 5000;
	return healingPower;
}

function getCritChance(){
	let critChance = $('#crit-chance').val();
	if(!critChance || critChance < 0) critChance = 0;
	if(critChance > 100) critChance = 100;
	return critChance;
}

function toTitleCase(str) {
	let split = str.split('_');
	for(let i = 0; i < split.length; i++){
		split[i] = split[i].charAt(0).toUpperCase() + split[i].substr(1);
	}
	return split.join(' ');
}

function loadSpellData(className, spellName, callback){
	let spellPath = `/spelldata/${className}/${spellName}.json`;
	return loadJSON(spellPath, callback);
}

function loadJSON(path, callback) {
	return (function () {
	    var json = null;
	    $.ajax({
	        'async': !!callback,
	        'global': false,
	        'url': path,
	        'dataType': "json",
	        'success': !!callback ? callback : function (data) {
	            json = data;
	        }
	    });
	    return json;
	})();
}

function sortNumberAsc(a, b) {
  return b - a;
}