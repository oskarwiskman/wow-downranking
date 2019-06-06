 document.addEventListener('click',function(e){
    if(e.target && $(e.target).hasClass('wow-spell')){
		onSpellClicked(e.target);
     }
 });

$(document).ready(function(){
	$(".wow-class").on('click', function(){
		onClassClicked(this);
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

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		refreshTooltip();
	}
}

function refreshTooltip(){
	let className = $('.wow-spell.active').data('class-name');
	let spellName = $('.wow-spell.active').data('spell-name');
	if(className && spellName){
		loadSpellData(className, spellName, updateTooltip);
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
	$.get(`assets/spelldata/${className}`, function(response){
		var html = "";
		$(response).find("li > a").each(function(){
			let spellName = $(this).attr('href').split('.json')[0];
			html += `<a class="wow-spell icon-medium" data-class-name="${className}" data-spell-name="${spellName}" title="${spellName}" style="background-image: url(assets/images/${spellName}.jpg)"></a>\n`
		})
		container.html(html);
	});
}

function loadSpellData(className, spellName, callback){
	let spellPath = `assets/spelldata/${className}/${spellName}.json`;
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