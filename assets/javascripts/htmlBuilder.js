function buildBreakpointsTable(spellData){
	let bpMapFrom = {};
	let bpMapTo = {};
	let currentRank = 0;
	let rows = "";
	let characterLevel = getCharacterLevel();
	let lastRank = undefined;

	for(let i = 0; i < 5000; i++){
		currentRank = calculateMostEfficientRank(characterLevel, i, spellData);
		if(characterLevel >= spellData.ranks[currentRank - 1].level){
			if(bpMapFrom[currentRank] === undefined) {
				bpMapFrom[currentRank] = i;
				if(lastRank){
					bpMapTo[lastRank] = i - 1;
				}
				lastRank = currentRank;
			}
		}
	}

	Object.keys(bpMapFrom).sort(sortNumberAsc).forEach(function(key){
		rows += buildBreakpointRow(bpMapFrom[key], bpMapTo[key], key);
	});

	if(rows === ""){
		rows = `<tr>\n\t<td>0+</td>\n\t<td>Level too low</td>\n</tr>\n`
	}

	let table = 
	'<table>\n' +
		`<caption>Breakpoints</br> <span class="subtitle"><span class="name">${spellData.name}</span> at level ${characterLevel}</span></caption>\n` +
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