function buildBreakpointsTable(spellData){
	let bpMapFrom = {};
	let bpMapTo = {};
	let currentRank = 0;
	let rows = "";
	let lastRank = undefined;

	for(let i = 0; i < 2000; i++){
		currentRank = calculateMostEfficientRank(i, spellData);
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

	if(rows === ""){
		rows = `<tr>
					<td>0+</td>
					<td>No data found</td>
				</tr>`
	}

	let table = 
	`<table>
		<caption>HES Breakpoints</caption>
			<thead>
				<tr>
					<th>Spell power</th>
					<th>Rank</th>
				</tr>
			</thead>
			<tbody>
				${rows}
			</tbody>
	</table>`

	$('#breakpoints').html(table);
}

function buildBreakpointRow(spellpowerFrom, spellpowerTo, rank){
	if(!spellpowerTo){
		spellpowerTo = "  and more";
	} else{
		spellpowerTo = `  to  ${spellpowerTo}`;
	}
	return `<tr>
				<td>${spellpowerFrom}${spellpowerTo}</td>
				<td>${rank}</td>
			</tr>`
}

function buildSpellTable(spellData, healingPower) {

	let rows = "";

	for(let r = 0; r < spellData.ranks.length; r++){
		rows += buildSpellTableRow(healingPower, spellData, r+1);
	}

	if(rows === ""){
		rows = `<tr>
					<td>0+</td>
					<td>No data found</td>
				</tr>`
	}

	let table = `<table class="sortable">
					<caption>Stats at <b class="blue">${healingPower}</b> Healing Power</caption>
					<thead>
						<tr>
							<th data-sort-mode="no">Rank</th>
							<th>Healing</th>
							<th data-sort-mode="asc">Mana cost</th>
							<th>HpME</th>
							<th>HpS</th>
							<th>HES</th>
						</tr>
					</thead>
					<tbody>
						${rows}
					</tbody>
				</table>`

	$('#spell-table').html(table);
    $('#spell-table table.sortable').tablesort();
	highlightMaxValue('spell-table');
}

function buildSpellTableRow(healingPower, spellData, rank) {
	let HpME = calculatePowerPerMana(healingPower, spellData, rank);
	let HpS = calculatePowerPerSecond(healingPower, spellData, rank);
	let HES = calculateHES(HpME, HpS);

	return `<tr>
				<td data-sort-value="${rank}">${rank}</td>
				<td data-sort-value="${roundNumber(calculatePower(healingPower, spellData, rank), 1)}">${roundNumber(calculatePower(healingPower, spellData, rank), 1)}</td>
				<td data-sort-value="${roundNumber(calculateCost(healingPower, spellData, rank), 1)}">${roundNumber(calculateCost(healingPower, spellData, rank), 1)}</td>
				<td data-sort-value="${roundNumber(HpME, 1)}">${roundNumber(HpME, 1)}</td>
				<td data-sort-value="${roundNumber(HpS, 1)}">${roundNumber(HpS, 1)}</td>
				<td data-sort-value="${roundNumber(HES, 1)}">${roundNumber(HES, 1)}</td>
			</tr>`
}


function buildSpellDescription(spell, rank) {
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

function buildTalentTooltip(talent, rank) {

	var description = talent.description;
	let regExp = /\${([^}]+)}/g;
	let matches = description.match(regExp);
	let state = "";
	let footer = "";
	if(matches){
		for(let i = 0; i < matches.length; i++){
			let match = matches[i];
			let attribute = match.substring(2, matches[i].length -1);
			if(rank === 0){
				description = description.replace(match, roundNumber(talent[attribute] * (rank + 1), 1));
				footer = "Click to learn";
				state = "first";
			} else if (rank === talent.maxRank){
				description = description.replace(match, roundNumber(talent[attribute] * rank, 1));
				footer = "Click to unlearn"
				state = "last";
			} else {
				description = description.replace(match, roundNumber(talent[attribute] * rank, 1));
				footer = `</br>Next rank:</br><span class="next-rank">${talent.description.replace(match, roundNumber(talent[attribute] * (rank + 1), 1))}</span>`
			}
		}
	}
	return `<div class="header">${toTitleCase(talent.name)}</div>
			<div class="rank">Rank ${rank}/${talent.maxRank}</div>
			<div class="description">${description}</div>
			<div class="footer ${state}">${footer}</div>`
}

function buildTooltipHtmlForSpell(spell, rank){
	rank = rank - 1;
	let name = spell.name;
	let cost = spell.ranks[rank].cost;
	let range = spell.ranks[rank].range;
	let baseCastTime = spell.ranks[rank].baseCastTime === 0 ? 'Instant' : spell.ranks[rank].baseCastTime + " sec cast";
	let power = spell.ranks[rank].power;
	let tickInterval = spell.ranks[rank].tickInterval;
	let tickDuration = spell.ranks[rank].tickDuration;
	let tickPower = spell.ranks[rank].tickPower;
	let description = buildSpellDescription(spell, rank);

	return 	`<div class="spell-tooltip">
				<div class="header">
					<span class="name">${name}</span> 
					<span class="rank">${rank+1}</span>
				</div>
				<div class="requirements">
					<span class="cost">${cost} Mana</span>
					<span class="range">${range} yd. range</span>
				</div>
				<div class="cast-time">${baseCastTime}</div>
				<p class="description">
					${description}
				</p>
				<span class="btn">
					<a href="#" onClick="openModal('details-modal')">Spell details</a>
				</span>
				<span class="btn pull-right">
					<a href="#" onClick="openModal('compare-modal')">Compare</a>
				</span>
			</div>`
}

function buildSpellHtmlForClass(className, container){
	var path = `/spelldata/${className}/`
	$.get(path, function(response){
		var html = "";
		$(response).each(function(){
			let spellName = this.split('.json')[0];
			html += `<a class="wow-spell icon-medium" data-class-name="${className}" data-spell-name="${spellName}" title="${toTitleCase(spellName)}" alt="${toTitleCase(spellName)}" style="background-image: url(/images/${spellName}.jpg)" onClick="onSpellClicked(this)"></a>`
		})
		container.html(html);
	});
}

function buildTalentHtmlForClass(talentData){
	target = $("#talent-selection");
	container = target.find(".navbar");
	if(talentData.talents.length){
		let html = "";
		target.removeClass("hidden");
		for(let i = 0; i < talentData.talents.length; i++){
			html += buildTalentIcon(talentData.class, talentData.talents[i], 0);
		}
		container.html(html);
	} 
	else {
		target.addClass("hidden");
	}
}

function buildTalentIcon(className, talentData, rank){
	return `<div id="talent-${talentData.name}" class="talent-icon" data-class-name="${className}" data-talent='${JSON.stringify(talentData)}' data-current-rank="${rank}" data-direction="up">
				<span class="talent-tooltip">${buildTalentTooltip(talentData, rank)}</span>
				<img style="background-image: url(/images/${talentData.image})"></img>
				<del></del>
				<a onClick="updateTalent(this)"></a>
				<div class="icon-border ${rank === talentData.maxPoints ? "maxed" : ""}"></div>
				<div class="icon-bubble ${rank === talentData.maxPoints ? "maxed" : ""}">${rank}</div>
			</div>`
}




