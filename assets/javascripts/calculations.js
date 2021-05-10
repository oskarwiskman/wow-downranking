
/**
* [Basic Coefficient] * [Downranking Coefficient] * [Sub Level 20 Penalty] = [Effective Coefficient]
*/
function calculateMostEfficientRank(healingPower, spellData){

	let bestRank = 1;
	let bestHES = 0;

	for(let rank = 1; rank <= spellData.ranks.length; rank++){
		if(!getAqReleased() && spellData.ranks[rank-1].tablet) continue;
		let PpM = calculatePowerPerMana(healingPower, spellData, rank);
		let PpS = calculatePowerPerSecond(healingPower, spellData, rank);
		let HES = calculateHES(PpM, PpS);
		if(HES > bestHES || (HES === bestHES && rank > bestRank)){
			bestHES = HES;
			bestRank = rank;
		}
	}
	return bestRank;
}

function calculateHES(PpM, PpS){
	let powerValues = getSliderValues();
	return Math.pow(PpM, powerValues[0]) * Math.pow(Math.log(PpS), powerValues[1]);
}

function calculatePower(healingPower, spellData, rank){
	return expansion === 'tbc' ? calculatePowerTbc(healingPower, spellData, rank) : calculatePowerClassic(healingPower, spellData, rank);
}

function calculatePowerClassic(healingPower, spellData, rank){
	let rankIndex = Math.min(Math.max(rank - 1, 0), spellData.ranks.length-1);
	let rankData = spellData.ranks[rankIndex];
	let nextRankLevel = rankIndex < spellData.ranks.length - 1 ? spellData.ranks[rankIndex+1].level : undefined;
	let directPower = 0;
	let overTimePower = 0;
	let directExtraPower = 0;
	let overTimeExtraPower = 0;
	switch(getSpellType(rankData)){
		case "direct":
			directPower = (rankData.powerMax + rankData.powerMin) / 2;
			directExtraPower = healingPower * getDirectSpellCoeficient(spellData, rank);
			break;
	  	case "overTime":
	  		overTimePower = rankData.tickPower;
	  		overTimeExtraPower = healingPower * getOverTimeCoeficient(spellData, rank);
	    	break;
	  	case "hybrid":
	  		directPower = (rankData.powerMax + rankData.powerMin) / 2;
  			overTimePower = rankData.tickPower;
			let coefficient = getHybridCoeficients(spellData, rank);
	  		directExtraPower = healingPower * coefficient["direct"];
	  		overTimeExtraPower = healingPower * coefficient["overTime"];
	    	break;
	}
	directExtraPower += getBuffExtraPower(spellData.class, spellData.name, spellData.type)
	directExtraPower *= getSubLevel20Penalty(rankData.level);
	overTimeExtraPower *= getSubLevel20Penalty(rankData.level);

	directPower *= getTalentPowerCoefficient(spellData.class, spellData.name, spellData.type);
	let totalDirectPower = (directPower + directExtraPower) * getCritChanceCoefficient(getEffectiveCritChance(spellData.class, spellData.name, spellData.type));
	totalDirectPower *= getBuffPowerCoefficient(spellData.class, spellData.name, spellData.type);

	overTimePower *= getTalentPowerCoefficient(spellData.class, spellData.name, spellData.type);
	let totalOverTimePower = overTimePower + overTimeExtraPower;
	totalOverTimePower *= getBuffPowerCoefficient(spellData.class, spellData.name, spellData.type);

	return totalDirectPower + totalOverTimePower;
}

function calculatePowerTbc(healingPower, spellData, rank){
	let rankIndex = Math.min(Math.max(rank - 1, 0), spellData.ranks.length-1);
	let rankData = spellData.ranks[rankIndex];
	let nextRankLevel = rankIndex < spellData.ranks.length - 1 ? spellData.ranks[rankIndex+1].level : undefined;
	let directPower = 0;
	let overTimePower = 0;
	let directExtraPower = 0;
	let overTimeExtraPower = 0;
	switch(getSpellType(rankData)){
		case "direct":
			directPower = (rankData.powerMax + rankData.powerMin) / 2;
			directExtraPower = healingPower * getDirectSpellCoeficient(spellData, rank);
			break;
	  	case "overTime":
	  		overTimePower = rankData.tickPower;
	  		overTimeExtraPower = healingPower * getOverTimeCoeficient(spellData, rank);
	    	break;
	  	case "hybrid":
	  		directPower = (rankData.powerMax + rankData.powerMin) / 2;
  			overTimePower = rankData.tickPower;
			let coefficient = getHybridCoeficients(spellData, rank);
	  		directExtraPower = healingPower * coefficient["direct"];
	  		overTimeExtraPower = healingPower * coefficient["overTime"];
	    	break;
	}
	directExtraPower += getBuffExtraPower(spellData.class, spellData.name, spellData.type)
	directExtraPower *= getTalentExtraPowerCoefficient(spellData.class, spellData.name, spellData.type);
	directExtraPower *= getSubLevel20Penalty(rankData.level);
	directExtraPower *= getDownrankPenalty(rankData.level);
	overTimeExtraPower *= getTalentExtraPowerCoefficient(spellData.class, spellData.name, spellData.type);
	overTimeExtraPower *= getSubLevel20Penalty(rankData.level);
	overTimeExtraPower *= getDownrankPenalty(rankData.level);

	let totalDirectPower = directPower + directExtraPower;
	totalDirectPower *= getTalentPowerCoefficient(spellData.class, spellData.name, spellData.type);
	totalDirectPower *= getCritChanceCoefficient(getEffectiveCritChance(spellData.class, spellData.name, spellData.type));
	totalDirectPower *= getBuffPowerCoefficient(spellData.class, spellData.name, spellData.type);

	let totalOverTimePower = overTimePower + overTimeExtraPower;
	totalOverTimePower *= getTalentPowerCoefficient(spellData.class, spellData.name, spellData.type);
	totalOverTimePower *= getBuffPowerCoefficient(spellData.class, spellData.name, spellData.type);

	return totalDirectPower + totalOverTimePower;
}

function calculatePowerPerSecond(healingPower, spellData, rank){
	let rankIndex = Math.min(Math.max(rank - 1, 0), spellData.ranks.length-1);
	let power = calculatePower(healingPower, spellData, rank);
	let rankData = spellData.ranks[rankIndex];
	let divider;
	switch(getSpellType(rankData)){
		case "direct":
			divider = rankData.baseCastTime;
			break;
	  	case "overTime":
	  		divider = rankData.tickDuration;
	    	break;
	  	case "hybrid":
	  		divider = rankData.baseCastTime;
	  		break;
	}
	divider -= getTalentCastTimeReduction(spellData.class, spellData.name, spellData.type);
	return power / Math.max(1.5, divider); // Assuming 1.5 global cooldown.
}

function calculateCost(healingPower, spellData, rank){
	let rankIndex = Math.min(Math.max(rank - 1, 0), spellData.ranks.length-1);
	let cost = spellData.ranks[rankIndex].cost;
	cost *= getTalentCostCoefficient(spellData.class, spellData.name, spellData.type);
	cost *= getBuffCostCoefficient(spellData.class, spellData.name, spellData.type);
	return cost;
}

function calculatePowerPerMana(healingPower, spellData, rank){
	let power = calculatePower(healingPower, spellData, rank);
	let cost = calculateCost(healingPower, spellData, rank);
	return cost === 0 ? power * 1000 : power / cost; //Edge case of a Paladin with 100% crit will have 0 cost.
}

function getTalentPowerCoefficient(className, spellName, spellType){
	let talent;
	let data;
	let rank;
	let powerCoef = 1;
	switch(className) {
		case "druid":
			talent = getTalentByName('gift_of_nature');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					powerCoef *=  (1 + ((data.rankIncrement * rank) / 100));
				}
			}
			talent = getTalentByName('improved_rejuvenation');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					powerCoef *=  (1 + ((data.rankIncrement * rank) / 100));
				}
			}
			return powerCoef;
		case "paladin":
			talent = getTalentByName('healing_light');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					powerCoef *= (1 + ((data.rankIncrement * rank) / 100));
				}
			}	
			return powerCoef;
		case "priest":
			talent = getTalentByName('spiritual_healing');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					powerCoef *= (1 + ((data.rankIncrement * rank) / 100));
				}
			}
			talent = getTalentByName('improved_renew');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					powerCoef *=  (1 + ((data.rankIncrement * rank) / 100));
				}
			}
			return powerCoef;
		case "shaman":
			talent = getTalentByName('purification');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return 1 + ((data.rankIncrement * rank) / 100);
				}
			}
			return 1;
		default:
			return 1;
	}
	return 1;
}

function getTalentExtraPowerCoefficient(className, spellName, spellType){
	let talent;
	let data;
	let rank;
	let powerCoef = 1;
	switch(className) {
		case "druid":
			talent = getTalentByName('empowered_touch');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					powerCoef *=  (1 + ((data.rankIncrement * rank) / 100));
				}
			}
			talent = getTalentByName('empowered_rejuvination');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)) {
					rank = talent.data("current-rank");
					powerCoef *=  (1 + ((data.rankIncrement * rank) / 100));
				}
			}
			return powerCoef;
		case "paladin":
			return 1;
		case "priest":
			return 1;
		case "shaman":
			return 1;
		default:
			return 1;
	}
	return 1;
}

function getTalentCostCoefficient(className, spellName, spellType){
	let talent;
	let data;
	let rank;
	let costCoeff = 1;
	switch(className) {
		case "druid":
			talent = getTalentByName('tranquil_spirit');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					costCoeff -= (data.rankIncrement * rank) / 100;
				}
			}
			talent = getTalentByName('moonglow');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					costCoeff -= (data.rankIncrement * rank) / 100;
				}
			}
			return costCoeff;
		case "paladin":
			let critChance = getEffectiveCritChance(className, spellName, spellType);
			talent = getTalentByName('illumination');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return 1 - ((critChance/100) * ((data.rankIncrement * rank) / 100));
				}
			}
			return 1;
		case "priest":
			talent = getTalentByName('mental_agility');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					costCoeff -=  (data.rankIncrement * rank) / 100;
				}
			}
			talent = getTalentByName('improved_healing');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					costCoeff -=  (data.rankIncrement * rank) / 100;
				}
			}
			return costCoeff;
		case "shaman":
			talent = getTalentByName('tidal_focus');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return 1 - ((data.rankIncrement * rank) / 100);
				}
			}
			return 1;
		default:
			return 1;
	}
}

function getTalentCastTimeReduction(className, spellName, spellType){
	let talent;
	let data;
	let rank;
	switch(className) {
		case "druid":
			talent = getTalentByName('naturalist');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return data.castReduction * rank;
				}
			}
			talent = getTalentByName('nature-s_grace');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return data.rankIncrement * rank * getEffectiveCritChance(className, spellName, spellType)/100;
				}
			}
			return 0;
		case "paladin":
			talent = getTalentByName('light-s_grace');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return (roundNumber(data.rankIncrement * 3, 0))*0.5/100;
				}
			}
			return 0;
		case "priest":
			talent = getTalentByName('divine_fury');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return data.rankIncrement * rank;
				}
			}
			return 0;
		case "shaman":
			talent = getTalentByName('improved_healing_wave');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return data.rankIncrement * rank;
				}
			}
			return 0;
		default:
			return 0;
	}
}

function getBuffPowerCoefficient(className, spellName, spellType){
	let buff;
	switch(className) {
		case "shaman":
			buff = getBuffByName('healing_way');
			if(buff.length > 0 && buff.hasClass('active')){
				let data = buff.data('buff');
				if(spellName === 'Healing Wave'){
					return 1 + data.ranks[2].effect * 3/100;
				}
			}
			return 1;
		default:
			return 1;
		
	}
}

function getBuffExtraPower(className, spellName, spellType){
	let buff;
	let data;
	switch(className) {
		case "druid":
			buff = getBuffByName('tree_of_life');
			if(buff.length > 0 && buff.hasClass('active')){
				data = buff.data('buff');
				return data.ranks[0].bonusFromSpirit / 100 * getSpirit();
			}
		case "paladin":
			buff = getBuffByName('blessing_of_light');
			if(buff.length > 0 && buff.hasClass('active')){
				data = buff.data('buff');
				if(spellName === 'Holy Light'){
					return data.ranks[2].holyLight;
				}
				if(spellName === 'Flash of Light'){
					return data.ranks[2].flashOfLight;
				}
			}
			return 0;
		default:
			return 0;
	}

}


function getBuffCostCoefficient(className, spellName, spellType){
	let buff;
	let data;
	switch(className) {
		case "druid":
			buff = getBuffByName('tree_of_life');
			if(buff.length > 0 && buff.hasClass('active')){
				data = buff.data('buff');
				return (data.spellsAffectedByManaReduction.includes(spellName)) ? 1 - (data.ranks[0].costCoefficient / 100) : 1;
			}
		default:
			return 1;
	}

}

function getEffectiveCritChance(className, spellName, spellType){
	let critChance = getCritChance();
	let talents = ['improved_regrowth', 'natural_perfection', 'holy_specialization', 'holy_power', 'sanctified_light', 'tidal_mastery']
	let rank;
	for(let i = 0; i < talents.length; i++){
		talent = getTalentByName(talents[i]);
		if(talent.length > 0) {
			data = talent.data("talent");
			if(className === talent.data("class-name") && isAffected(spellName, spellType, data)){
				rank = talent.data("current-rank");
				critChance += data.rankIncrement * rank;
			}
		}
	}
	return Math.min(100, critChance);
}

function getCritChanceCoefficient(critChance) {
	critCoeff = (1 + (1 + critChance/100)) / 2;
	return critCoeff;
}

function isAffected(spellName, spellType, data){
	return (data.affectedSpells.includes(spellType) || data.affectedSpells.includes(spellName));
}

function getSpellType(spell){
	if(spell.powerMax > 0 && spell.tickPower > 0){
		return "hybrid";
	}
	if(spell.powerMax > 0){
		return "direct";
	}
	if(spell.tickPower > 0){
		return "overTime";
	}
}


/**
 * The coeficients for direct spells are affected by the cast time.
 * The formula for this is: [Cast Time of Spell] / 3.5 = [Coefficient]
 * 
 * @param 	{Object}	spellData      	Data for the spell.
 * @param 	{int}		rank      		Spell rank.
 *
 * @return 	{double} 	directCoeff		Returns the penalty calculated by the formula above, unless custom direct coefficient is specified in the data 
 *										by adding the attribute directCoeff. If castTime larger than 7 returns 2.
 */
function getDirectSpellCoeficient(spellData, rank){
	if (spellData.directCoeff) return spellData.directCoeff;
	if (spellData.ranks[rank-1].powerMax === 0) return 0;
	castTime = spellData.ranks[rank-1].baseCastTime;
	if(castTime > 7) castTime = 7;
	if(castTime < 1.5) castTime = 1.5;
	return castTime/3.5;
}

/**
 * The coeficients for over time spells are affected by the duration.
 * The formula for this is: [Duration of Spell] / 15 = [Coefficient]
 * 
 * @param 	{Object}	spellData      	Data for the spell.
 * @param 	{int}		rank      		Spell rank.
 *
 * @return 	{double} 	overTimeCoef	Returns the penalty calculated by the formula above unless custom over time coefficient is specified in the data 
 *										by adding the attribute overTimeCoef. If duration larger than 15 returns 1.
 */
function getOverTimeCoeficient(spellData, rank){
	if (spellData.overTimeCoeff) return spellData.overTimeCoeff;
	if (spellData.ranks[rank-1].tickPower === 0) return 0;
	duration = spellData.ranks[rank-1].tickDuration;
	if(duration > 15) return 1;
	return duration/15;
}

/**
 * Hybrid spells have a special formula for calculating the coeficients for the direct and over time portion.
 * The formula for this is:
 *   [Over-Time portion]	= ([Duration] / 15) / (([Duration] / 15) + ([Cast Time] / 3.5))
 *   [Direct portion] 		= 1 - [Over-Time portion]
 *
 * The duration and cast time limitations are then applied:
 *  [Over-Time coefficient]	=	([Duration] / 15) * [Over-Time portion]
 *  [Direct coefficient]	=	([Cast Time / 3.5) * [Direct portion]
 * 
 * @param 	{Object}	spellData      	Data for the spell.
 * @param 	{int}		rank      		Spell rank.
 *
 * @return 	{Object[2]} hybridCoeficients 	Object containing the respective coeficients calculated using the formula above, unless custom 
 *											coefficients are specified in the data by adding the attribute directCoef and or overTimeCoef.
 *											Attributes can be accessed as direct and overTime.
 */
function getHybridCoeficients(spellData, rank){
	let castTime = spellData.ranks[rank-1].baseCastTime;
	let duration = spellData.ranks[rank-1].tickDuration;
	if(castTime > 7){
		castTime = 7;
	}
	if(castTime < 1.5){
		castTime = 1.5;
	}
	if(duration > 15){
		duration = 15;
	}

	let overTimePortion = (duration / 15) / ((duration / 15) + (castTime / 3.5));
	let overTimeCoeff = (duration / 15) * overTimePortion;
	
	let directPortion =  1 - overTimePortion;
	let directCoeff = (castTime / 3.5) * directPortion;

	return {
		"direct": (spellData.directCoeff ? spellData.directCoeff : directCoeff), 
		"overTime": (spellData.overTimeCoeff ? spellData.overTimeCoeff : overTimeCoeff)
	};
}

/**
 * Casting a spell that is below level 20 incurs a significant penalty to the coefficient of the spell. 
 * The formula for this is: (20 - [Spell Level]) * .0375 = [Penalty]
 * 
 * @param 	{integer}	spellLevel      The character level required to learn the spell.
 *
 * @return 	{double} 	sub20Penalty 	Returns the penalty calculated by the formula above. If spellLevel is over 20 returns 1.
 */
function getSubLevel20Penalty(spellLevel){
	if(spellLevel < 20){
		return 1 - ((20 - spellLevel) * .0375);
	} else {
		return 1;
	}
}

/**
 * Casting a spell that is lower than the maximum rank available at the current character level incurs a penalty to the coefficient of the spell. 
 * The formula for this is: ([Spell Level] + 11) / [Character level] = [Penalty]
 * 
 * @param 	{integer}	spellLevel      	The character level required to learn the spell.
 *
 * @return 	{double} 	downrankPenalty 	Returns the penalty calculated by the formula above. If the result is above 1, it returns 1.
 */
function getDownrankPenalty(spellLevel){
	return Math.min((spellLevel + 11) / 70, 1);
}