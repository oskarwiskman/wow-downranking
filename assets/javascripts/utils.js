function refreshTooltip(){
	let className = getSelectedClassName();
	let spellName = getSelectedSpellName();
	if(className && spellName){
		loadSpellData(className, spellName, updateTooltip);
		loadSpellData(className, spellName, buildBreakpointsTable);
	}
}

function updateTalent(elem){
	let talent = $(elem).closest(".talent-icon");
	let bubble = talent.find(".icon-bubble");
	let border = talent.find(".icon-border");
	let talentTooltip = talent.find(".talent-tooltip");
	let talentData = talent.data("talent");
	let maxRank = talentData.maxRank;
	let currentRank = talent.data("current-rank");
	let direction = talent.data("direction");
	if(direction === "up" && currentRank < maxRank){
		currentRank ++;
		talent.data("current-rank", currentRank);
	}
	if(direction === "down" && currentRank > 0){
		currentRank --;
		talent.data("current-rank", currentRank);
	}
	if(currentRank === 0){
		talent.data("direction", "up");
	}
	if(currentRank === maxRank){
		border.addClass("maxed");
		bubble.addClass("maxed");
		talent.data("direction", "down");
	} else {
		border.removeClass("maxed");
		bubble.removeClass("maxed");
	}
	talentTooltip.html(buildTalentTooltip(talentData, currentRank));
	bubble.html(currentRank);
	refreshTooltip();
}

function updateTooltip(spellData){
	$('#tooltip').html(buildTooltipHtmlForSpell(spellData, calculateMostEfficientRank(getCharacterLevel(), getHealingPower(), spellData)));
	showResult();
}

function showSpellAffectingTalentsFor(className){
	if(!className) {
		$('#talent-selection').addClass('hidden');
	} else {
		loadTalentData(className, buildTalentHtmlForClass);
	}
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
	$('#tip').hide().html(tipData.tips[Math.floor(Math.random() * tipData.tips.length)]).fadeIn('slow');
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

function getCritChance(){
	return Math.max(0, Math.min(100, $('#crit-chance').val()));
}

function hideSpirit(){
	$('#spirit-container').addClass("hidden");
}

function showSpirit(){
	$('#spirit-container').removeClass("hidden");
}

function getSpirit(){
	return Math.max(0, $('#spirit').val());
}

function getSelectedClassName(){
	return $('.wow-spell.active').data('class-name');
}

function getSelectedSpellName(){
	return $('.wow-spell.active').data('spell-name');
}

function getCharacterLevel(){
	return 60;
}

function getTalentByName(talentName){
	return $(`#talent-${talentName}`);
}

function getAqReleased(){
	return $('#aq-tome:checked').length > 0;
}

function getSliderValues(){
	let slider = $('input[type="range"]');
	let maxValue = (slider.attr('max')/2)|0;
	let slidervalue = slider.val();
	let HpMEpower = slidervalue < maxValue ? (maxValue + 1) - slidervalue : 1;
	let HpSpower = slidervalue > maxValue ? (parseInt(slidervalue) + 1) - maxValue : 1;
	if(HpMEpower === maxValue + 1){
		HpSpower = 0;
	}
	if(HpSpower === maxValue + 1){
		HpMEpower = 0;
	}
	return [HpMEpower, HpSpower];
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
	loadJSON(spellPath, callback);
}

function loadTalentData(className, callback){
	let talentPath = `/talents/${className}.json`
	loadJSON(talentPath, callback);
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

function toOneDecimal(number){
	return Math.round(number * 10)/10;
}

function sortNumberAsc(a, b) {
  return b - a;
}