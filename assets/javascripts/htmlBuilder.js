function buildBreakpointsTable(spellData){
	let bpMapFrom = {};
	let bpMapTo = {};
	let currentRank = 0;
	let rows = "";
	let lastRank = undefined;

	for(let i = 0; i < 1500; i++){
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
							<th data-sort-mode="no">Cast time</th>
							<th>HpME</th>
							<th>HpS</th>
							<th>HES</th>`;
	if (getSpellType(spellData.ranks[0]) === 'hybrid') {
		table +=		   `<th>Direct coefficient</th>
							<th>Over time coefficient</th>
							<th>Base Direct Coefficient</th>
							<th>Base Over time Coefficient</th>
							<th>Level Coefficient</th>
							<th>Talent&Buff Coefficient</th>
							<th>Bonus Healing Coefficient</th>`;
	} else {
		table +=		   `<th>Coefficient</th>
							<th>Base Coefficient</th>
							<th>Level Coefficient</th>
							<th>Talent&Buff Coefficient</th>
							<th>Bonus Healing Coefficient</th>`;
	} 
	table +=			`</tr>
					</thead>
					<tbody>
						${rows}
					</tbody>
				</table>`;

	$('#spell-table').html(table);
    $('#spell-table table.sortable').tablesort();
	highlightMaxValue('spell-table');
}

function buildSpellTableRow(healingPower, spellData, rank) {
	let power = calculatePower(healingPower, spellData, rank);
	let cost = calculateCost(spellData, rank);
	let castTime = calculateCastTime(spellData, rank);
	let HpME = power/cost;
	let HpS = power/castTime;
	let HES = calculateHES(HpME, HpS);
	let directBaseCoefficient = getDirectSpellCoeficient(spellData, rank);
	let overTimeBaseCoefficient = getOverTimeCoeficient(spellData, rank);
	let levelPenaltyCoefficient = getSubLevel20Penalty(spellData.ranks[rank-1].level)*(expansion === 'tbc' ? getDownrankPenalty(spellData, rank) : 1);
	let talentAndBuffCoefficient = getTalentPowerCoefficient(spellData.class, spellData.name, spellData.type) * getBuffPowerCoefficient(spellData.class, spellData.name, spellData.type);
	let bonusHealingCoefficient = getTalentExtraPowerCoefficient(spellData.class, spellData.name, spellData.type);
	let directCoefficient = directBaseCoefficient * levelPenaltyCoefficient * talentAndBuffCoefficient;
	let overTimeCoefficient =  overTimeBaseCoefficient * levelPenaltyCoefficient * talentAndBuffCoefficient;
	let isChainHeal = spellData.name === 'Chain Heal';
	let row =`<tr>
				<td data-sort-value="${rank}">${rank}${isChainHeal ? ' (1 target)' : ''}</td>
				<td data-sort-value="${roundNumber(power, 0)}">${roundNumber(power, 0)}</td>
				<td data-sort-value="${roundNumber(cost, 0)}">${roundNumber(cost, 0)}</td>
				<td data-sort-value="${roundNumber(castTime, 1)}" style="white-space: nowrap;">${roundNumber(castTime, 1)} sec</td>
				<td data-sort-value="${roundNumber(HpME, 1)}">${roundNumber(HpME, 1)}</td>
				<td data-sort-value="${roundNumber(HpS, 1)}">${roundNumber(HpS, 1)}</td>
				<td data-sort-value="${roundNumber(HES, 1)}">${roundNumber(HES, 1)}</td>`;
	if (directCoefficient > 0 && overTimeCoefficient > 0) {
		row +=	`<td data-sort-value="${roundNumber(directCoefficient * 100, 1)}">${roundNumber(directCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(overTimeCoefficient * 100, 1)}">${roundNumber(overTimeCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(directBaseCoefficient * 100, 1)}">${roundNumber(directBaseCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(overTimeBaseCoefficient * 100, 1)}">${roundNumber(overTimeBaseCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(levelPenaltyCoefficient * 100, 1)}">${roundNumber(levelPenaltyCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(talentAndBuffCoefficient * 100, 1)}">${roundNumber(talentAndBuffCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(bonusHealingCoefficient * 100, 1)}">${roundNumber(bonusHealingCoefficient * 100, 1)}%</td>
				`;
	} else {
		let coefficent = directCoefficient;
		let baseCoefficent = directBaseCoefficient;
		if (directCoefficient === 0) {
			coefficent = overTimeCoefficient;
			baseCoefficent = overTimeBaseCoefficient;
		}
		row +=	`<td data-sort-value="${roundNumber(coefficent * 100, 1)}">${roundNumber(coefficent * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(baseCoefficent * 100, 1)}">${roundNumber(baseCoefficent * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(levelPenaltyCoefficient * 100, 1)}">${roundNumber(levelPenaltyCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(talentAndBuffCoefficient * 100, 1)}">${roundNumber(talentAndBuffCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(bonusHealingCoefficient * 100, 1)}">${roundNumber(bonusHealingCoefficient * 100, 1)}%</td>
				`;
	}
	row +=	 `</tr>`;
	if (isChainHeal) {
		row += buildChainHealRow(2, rank, power, cost, castTime, directCoefficient, directBaseCoefficient, levelPenaltyCoefficient, talentAndBuffCoefficient, bonusHealingCoefficient);
		row += buildChainHealRow(3, rank, power, cost, castTime, directCoefficient, directBaseCoefficient, levelPenaltyCoefficient, talentAndBuffCoefficient, bonusHealingCoefficient);
	}
	return row;
}

function buildChainHealRow(targetNr, rank, power, cost, castTime, coefficent, baseCoefficent, levelPenaltyCoefficient, talentAndBuffCoefficient, bonusHealingCoefficient) {
	let buff = getBuffByName('improved_chain_heal');
	let target2active = targetNr > 1 ? 1 : 0;
	let target3active = targetNr > 2 ? 1 : 0;
	let chFactor = 1;
	if(buff.length > 0 && buff.hasClass('active')){
		data = buff.data('buff');
		if (targetNr > 1) {
			chFactor += data.ranks[0].effect/100;
		}
	}
	power = power + target2active * power * 0.5 * chFactor + target3active * power * 0.25 * chFactor;
	HpME = power/cost;
	HpS = power/castTime;
	HES = calculateHES(HpME, HpS);
	return `<tr>
				<td data-sort-value="${rank}" style="white-space: nowrap;">${rank}${' ('+targetNr+' targets)'}</td>
				<td data-sort-value="${roundNumber(power, 0)}">${roundNumber(power, 0)}</td>
				<td data-sort-value="${roundNumber(cost, 0)}">${roundNumber(cost, 0)}</td>
				<td data-sort-value="${roundNumber(castTime, 1)}" style="white-space: nowrap;">${roundNumber(castTime, 1)} sec</td>
				<td data-sort-value="${roundNumber(HpME, 1)}">${roundNumber(HpME, 1)}</td>
				<td data-sort-value="${roundNumber(HpS, 1)}">${roundNumber(HpS, 1)}</td>
				<td data-sort-value="${roundNumber(HES, 1)}">${roundNumber(HES, 1)}</td>
				<td data-sort-value="${roundNumber(coefficent * 100, 1)}">${roundNumber(coefficent * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(baseCoefficent * 100, 1)}">${roundNumber(baseCoefficent * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(levelPenaltyCoefficient * 100, 1)}">${roundNumber(levelPenaltyCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(talentAndBuffCoefficient * 100, 1)}">${roundNumber(talentAndBuffCoefficient * 100, 1)}%</td>
				<td data-sort-value="${roundNumber(bonusHealingCoefficient * 100, 1)}">${roundNumber(bonusHealingCoefficient * 100, 1)}%</td>
			</tr>`;
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
	let footer = talent.description;
	if(matches){
		for(let i = 0; i < matches.length; i++){
			let match = matches[i];
			let attribute = match.substring(2, matches[i].length -1);
			if(rank === 0){
				description = description.replace(match, roundNumber(talent[attribute] * (rank + 1), 0));
				footer = "Click to learn";
				state = "first";
			} else if (rank === talent.maxRank){
				description = description.replace(match, roundNumber(talent[attribute] * rank, 0));
				footer = "Click to unlearn"
				state = "last";
			} else {
				description = description.replace(match, roundNumber(talent[attribute] * rank, 0));
				footer = `</br>Next rank:</br><span class="next-rank">${footer.replace(match, roundNumber(talent[attribute] * (rank + 1), 0))}</span>`
			}
		}
	}
	return `<div class="header">${toTitleCase(talent.name)}</div>
			<div class="rank">Rank ${rank}/${talent.maxRank}</div>
			<div class="description">${description}</div>
			<div class="footer ${state}">${footer}</div>`
}

function buildTooltipHtmlForSpell(spell, rank, cssClass="", footer=""){
	rank = Math.min(Math.max(rank - 1, 0), spell.ranks.length-1);
	let baseCastTime = spell.ranks[rank].baseCastTime === 0 ? 'Instant' : spell.ranks[rank].baseCastTime + " sec cast";

	return 	`<div class="spell-tooltip ${cssClass}">
				<div class="header">
					<span class="name">${spell.name}</span> 
					<span class="rank">Rank ${rank+1}</span>
				</div>
				<div class="requirements">
					<span class="cost">${spell.ranks[rank].cost} Mana</span>
					<span class="range">${spell.ranks[rank].range} yd. range</span>
				</div>
				<div class="cast-time">${baseCastTime}</div>
				<div class="level">Requires Level ${spell.ranks[rank].level}</div>
				<p class="description">
					${buildSpellDescription(spell, rank)}
				</p>
				${footer}
			</div>`
}

function buildSpellHtmlForClass(className, onClick, container){
	var path = `/spelldata/${expansion}/${className}/`
	$.get(path, function(response){
		var html = "";
		$(response).each(function(){
			let spellName = this.split('.json')[0];
			loadSpellData(className, spellName);
			html += `<a class="wow-spell icon-medium" data-class-name="${className}" data-spell-name="${spellName}" title="${toTitleCase(spellName)}" alt="${toTitleCase(spellName)}" style="background-image: url(/images/${spellName}.jpg)" onClick="${onClick}"></a>`
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

function buildBuffHtmlForClass(buffData){
	target = $("#buff-selection");
	container = target.find(".navbar");
	if(buffData.buffs.length){
		let html = "";
		target.removeClass("hidden");
		for(let i = 0; i < buffData.buffs.length; i++){
			html += buildBuffIcon(buffData.class, buffData.buffs[i]);
		}
		container.html(html);
	} 
	else {
		target.addClass("hidden");
	}
}

function buildBuffIcon(className, buff){
	return `<div id="buff-${buff.key}" class="icon-medium buff-icon" data-buff='${JSON.stringify(buff)}' data-class-name="${className}" data-spell-name="${buff.key}" title="${buff.name}" alt="${buff.name}" style="background-image: url(/images/${buff.image})" onClick="toggleBuff(this)">
				${buildBuffTooltip(buff)}
			</div>`
}

function buildBuffTooltip(buff){
	let rank = buff.ranks.length - 1;
	let baseCastTime = buff.ranks[rank].baseCastTime === 0 ? 'Instant' : buff.ranks[rank].baseCastTime + " sec cast";
	let cost = buff.ranks[rank].cost;
	let range = buff.ranks[rank].range;
	return 	`<span class="spell-tooltip buff-tooltip">
				<div class="header">
					<span class="name">${toTitleCase(buff.name)}</span> 
					<span class="rank">Rank ${rank + 1}</span>
				</div>
				<div class="requirements">` + 
					(cost > -1 ? `<span class="cost">${cost} Mana</span>` : ``) + 
					(range > -1 ? `<span class="range">${range} yd. range</span>` : ``) + 
				`</div>
				<div class="cast-time">${baseCastTime}</div>
				<div class="level">Requires Level ${buff.ranks[rank].level}</div>
				<p class="description">
					${buildSpellDescription(buff, rank)}
				</p>
				<div class="footer">Click to add buff</div>
			</span>`
}




