$(document).ready(function(){
	$(".wow-class").on('click', function(){
		onClassClicked(this);
		newRandomTip();
	});
	$("#healing").change(function(){
		refreshTooltip();
	});
	$("#level").change(function(){
		refreshTooltip();
	});
});

function onClassClicked(elem){
	let target = $(elem);
	let navbar = target.closest('.navbar');
	$('#result').hide();
	if(target.hasClass('active')){
		target.removeClass('active');
		spellSelection("");

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		let className = target.attr('id'); 
		spellSelection(className);
	}
}

function onSpellClicked(elem){
	let target = $(elem);
	let navbar = target.closest('.navbar');

	if(target.hasClass('active')){
		target.removeClass('active');
		$('#result').hide();
		newRandomTip();

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		hideTip();
		refreshTooltip();
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

function refreshTooltip(){
	let className = $('.wow-spell.active').data('class-name');
	let spellName = $('.wow-spell.active').data('spell-name');
	if(className && spellName){
		loadSpellData(className, spellName, updateTooltip);
		loadSpellData(className, spellName, buildBreakpointsTable);
	}
}

function updateTooltip(spellData){
	let characterLevel = $('#level').val();
	if(!characterLevel || characterLevel < 0) characterLevel = 0;
	if(characterLevel > 60) characterLevel = 60;

	let healingPower = $('#healing').val();
	if(!healingPower || healingPower < 0) healingPower = 0;
	if(healingPower > 5000) healingPower = 5000;

	$('#tooltip').html(buildTooltipHtmlForSpell(spellData, calculateMostEfficientRank(characterLevel, healingPower, spellData)));
	$('#result').show();
}

function spellSelection(className){
	let container = $('#spell-selection').find('.navbar');
	if(className === "") {
		$('#spell-selection').addClass('hidden');
	} else {
		buildSpellHtmlForClass(className, container);
		$('#spell-selection').removeClass('hidden');
	}
}

function buildSpellHtmlForClass(className, container){
	var path = `/spelldata/${className}/`
	$.get(path, function(response){
		var html = "";
		$(response).each(function(){
			let spellName = this.split('.json')[0];
			html += `<a class="wow-spell icon-medium" data-class-name="${className}" data-spell-name="${spellName}" title="${toTitleCase(spellName)}" style="background-image: url(/images/${spellName}.jpg)" onClick="onSpellClicked(this)"></a>\n`
		})
		container.html(html);
	});
}

function loadSpellData(className, spellName, callback){
	let spellPath = `/spelldata/${className}/${spellName}.json`;
	return loadJSON(spellPath, callback);
}

function buildTooltipHtmlForSpell(spell, rank){
	rank = rank - 1;
	let name = spell.name;
	let cost = spell.ranks[rank].cost;
	let range = spell.ranks[rank].range;
	let baseCastSpeed = spell.ranks[rank].baseCastSpeed === 0 ? 'Instant' : spell.ranks[rank].baseCastSpeed + " sec cast";
	let power = spell.ranks[rank].power;
	let tickInterval = spell.ranks[rank].tickInterval;
	let tickDuration = spell.ranks[rank].tickDuration;
	let tickPower = spell.ranks[rank].tickPower;
	let description = buildDescription(spell, rank);

	return 	`<div class="spell-tooltip">\n` +
				`<div class="header">` +
					`<span class="name">${name}</span>` + 
					`<span class="rank">${rank+1}</span>` +
				`</div>` +
				`<div class="requirements">` +
					`<span class="cost">${cost} Mana</span>` +
					`<span class="range">${range} yd. range</span>` +
				`</div>` +
				`<div class="cast-time">${baseCastSpeed}</div>` +
				`<p class="description">` +
					`${description}` +
				`</p>` +
			`</div>`

}

function buildBreakpointsTable(spellData){
	let bpMapFrom = {};
	let bpMapTo = {};
	let currentRank = 0;
	let rows = "";
	let characterLevel = $('#level').val();
	let lastRank = undefined;
	if(!characterLevel || characterLevel < 0) characterLevel = 0;
	if(characterLevel > 60) characterLevel = 60;

	for(let i = 0; i < 5000; i++){
		currentRank = calculateMostEfficientRank(characterLevel, i, spellData);
		if(bpMapFrom[currentRank] === undefined) {
			bpMapFrom[currentRank] = i;
			if(lastRank){
				bpMapTo[lastRank] = i - 1;
			}
			lastRank = currentRank;
		}
	}

	Object.keys(bpMapFrom).sort(sortNumberAsc).forEach(function(key){
		rows += buildBreakpointRow(bpMapFrom[key], bpMapTo[key], key);
	});

	let table = 
	'<table>\n' +
		`<caption>Breakpoints at level ${characterLevel}</caption>\n` +
			'<tr>\n' +
				'<th>Spell power</th>\n' +
				'<th>Rank</th>\n' +
			'</tr>\n'
	table += rows;

	table += '</table>\n'

	$('#breakpoints').html(table);
}

function buildBreakpointRow(spellpowerFrom, spellpowerTo, rank){
	if(!spellpowerTo){
		spellpowerTo = "+";
	} else{
		spellpowerTo = ` - ${spellpowerTo}`;
	}
	return `<tr>\n\t<td>${spellpowerFrom}${spellpowerTo}</td>\n\t<td>${rank}</td>\n</tr>\n`
}

function toTitleCase(str) {
	let split = str.split('_');
	for(let i = 0; i < split.length; i++){
		split[i] = split[i].charAt(0).toUpperCase() + split[i].substr(1);
	}
	return split.join(' ');
}

function buildDescription(spell, rank) {
	var description = spell.description;
	let regExp = /\${([^}]+)}/g;
	let matches = description.match(regExp);
	if(matches){
		for(let i = 0; i < matches.length; i++){
			let match = matches[i];
			let attribute = match.substring(2, matches[i].length -1);
			description = description.replace(match, spell.ranks[rank][attribute]);
		}
	}
	return description;
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