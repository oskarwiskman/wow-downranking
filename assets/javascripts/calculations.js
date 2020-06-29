
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
		if(HES > bestHES){
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
	let index = Math.min(Math.max(rank - 1, 0), spellData.ranks.length-1);
	let rankData = spellData.ranks[index];
	let nextRankLevel = index < spellData.ranks.length - 1 ? spellData.ranks[index+1].level : undefined;
	let directPower = 0;
	let overTimePower = 0;
	let directExtraPower = 0;
	let overTimeExtraPower = 0;
	let coefficient;
	healingPower += getTalentExtraPower(spellData.class, spellData.name, spellData.type);
	switch(getSpellType(rankData)){
		case "direct":
			directPower = (rankData.powerMax + rankData.powerMin) / 2;
			directExtraPower = healingPower * getDirectSpellCoeficient(rankData.baseCastTime);
			break;
	  	case "overTime":
	  		overTimePower = rankData.tickPower;
	  		overTimeExtraPower = healingPower * getOverTimeCoeficient(rankData.tickDuration);
	    	break;
	  	case "hybrid":
	  		directPower = (rankData.powerMax + rankData.powerMin) / 2;
  			overTimePower = rankData.tickPower;
	  		directExtraPower = healingPower * spellData.directCoeff;
	  		overTimeExtraPower = healingPower * spellData.overTimeCoeff;
	    	break;
	}
	directExtraPower += getBuffExtraPower(spellData.class, spellData.name, spellData.type)
	directExtraPower *= getSubLevel20Penalty(rankData.level);
	overTimeExtraPower *= getSubLevel20Penalty(rankData.level);

	directPower *= getTalentPowerCoefficient(spellData.class, spellData.name, spellData.type);
	let totalDirectPower = (directPower + directExtraPower) * getCritChanceCoefficient(getEffectiveCritChance(spellData.class, spellData.name, spellData.type));
	totalDirectPower *= getBuffExtraPowerFactor(spellData.class, spellData.name, spellData.type);

	overTimePower *= getTalentPowerCoefficient(spellData.class, spellData.name, spellData.type);
	let totalOverTimePower = overTimePower + overTimeExtraPower;
	totalOverTimePower *= getBuffExtraPowerFactor(spellData.class, spellData.name, spellData.type);

	return totalDirectPower + totalOverTimePower;
}

function calculatePowerPerSecond(healingPower, spellData, rank){
	let index = Math.min(Math.max(rank - 1, 0), spellData.ranks.length-1);
	let power = calculatePower(healingPower, spellData, rank);
	let rankData = spellData.ranks[index];
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
	let index = Math.min(Math.max(rank - 1, 0), spellData.ranks.length-1);
	let cost = spellData.ranks[index].cost;
	cost *= getTalentCostCoefficient(spellData.class, spellData.name, spellData.type);
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
			talent = getTalentByName('improved_healing_touch');
			if(talent.length > 0) {
				data = talent.data("talent");
				if(isAffected(spellName, spellType, data)){
					rank = talent.data("current-rank");
					return data.rankIncrement * rank;
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


function getTalentExtraPower(className, spellName, spellType){
	if(className === "priest"){
		let talent = getTalentByName('spiritual_guidance');
		if(talent.length > 0) {
			let data = talent.data("talent");
			let rank = talent.data("current-rank");
			return (getSpirit() * ((data.rankIncrement * rank)/100))|0;
		}
	}
	return 0;
}

function getBuffExtraPowerFactor(className, spellName, spellType){
	if(className === "shaman"){
		let buff = getBuffByName('healing_way');
		if(buff.length > 0 && buff.hasClass('active')){
			let data = buff.data('buff');
			if(spellName === 'Healing Wave'){
				return 1 + data.ranks[2].effect * 3/100;
			}
		}
	}
	return 1;
}

function getBuffExtraPower(className, spellName, spellType){
	if(className === "paladin"){
		let buff = getBuffByName('blessing_of_light');
		if(buff.length > 0 && buff.hasClass('active')){
			let data = buff.data('buff');
			if(spellName === 'Holy Light'){
				return data.ranks[2].holyLight;
			}
			if(spellName === 'Flash of Light'){
				return data.ranks[2].flashOfLight;
			}
		}
	}
	return 0;
}

function getEffectiveCritChance(className, spellName, spellType){
	let critChance = parseInt(getCritChance());
	let talents = ['improved_regrowth', 'holy_specialization', 'holy_power', 'tidal_mastery']
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
	return critChance;
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
 * @param 	{double}	castTime      	Spell cast time in seconds.
 *
 * @return 	{double} 	directCoef		Returns the penalty calculated by the formula above. If castTime larger than 7 returns 2.
 */
function getDirectSpellCoeficient(castTime){
	if(castTime > 7) castTime = 7;
	if(castTime < 1.5) castTime = 1.5;
	return castTime/3.5;
}

/**
 * The coeficients for over time spells are affected by the duration.
 * The formula for this is: [Duration of Spell] / 15 = [Coefficient]
 * 
 * @param 	{int}		duration      	Spell duration in seconds.
 *
 * @return 	{double} 	overTimeCoef	Returns the penalty calculated by the formula above. If duration larger than 15 returns 1.
 */
function getOverTimeCoeficient(duration){
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
 * @param 	{double}	castTime    		Spell cast time in seconds.
 * @param 	{double}	duration 			Spell duration in seconds.
 *
 * @return 	{Array[2]} 	hybridCoeficients 	Array containing the respective coeficients, index 0 holds direct coeficient and 1 holds over time coeficient.
 */
function getHybridCoeficients(castTime, duration){
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
	let overTimeCoef = (duration / 15) * overTimePortion;
	
	let directPortion =  1 - overTimePortion;
	let directCoef = (castTime / 3.5) * directPortion;

	return {
		"direct": directCoef, 
		"overTime": overTimeCoef
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