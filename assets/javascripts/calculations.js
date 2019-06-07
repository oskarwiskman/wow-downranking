
/**
* [Basic Coefficient] * [Downranking Penalty] * [Sub Level 20 Penalty] = [Effective Coefficient]
*/
function calculateMostEfficientRank(characterLevel, healingPower, spellData){

	let bestRank = 0;
	let bestPowerPerMana = 0;

	for(let i = 0; i < spellData.ranks.length; i++){
		let currentRank = spellData.ranks[i];
		if(characterLevel < currentRank.level) continue;
		let type = getSpellType(currentRank);
		let power = 0;
		let extraPower = 0;
		let nextRankLevel = i < spellData.ranks.length - 1 ? spellData.ranks[i+1].level : -1;
		switch(type) {
			case "direct":
				power = (currentRank.powerMax + currentRank.powerMin) / 2;
				extraPower = healingPower * getDirectSpellCoeficient(currentRank.baseCastSpeed);
				break;
		  	case "overTime":
		  		power = currentRank.tickPower;
				extraPower = healingPower * getOverTimeCoeficient(currentRank.tickDuration);
		    	break;
		  	case "hybrid":
		  		power = ((currentRank.powerMax + currentRank.powerMin) / 2) + currentRank.tickPower;
		  		let hybridCoeficients = getHybridCoeficients(currentRank.baseCastSpeed, currentRank.tickDuration);
		  		let directExtraPower = healingPower * hybridCoeficients[0];
		  		let overTimeExtraPower = healingPower * hybridCoeficients[1];
		  		extraPower = directExtraPower + overTimeExtraPower;
		    	break;
		  	default:
		}
		extraPower *= getDownrankingPenalty(characterLevel, nextRankLevel);
		extraPower *= getSubLevel20Penalty(currentRank.level);
		let powerPerMana = (power + extraPower) / currentRank.cost;
		if(powerPerMana > bestPowerPerMana){
			bestPowerPerMana = powerPerMana;
			bestRank = i;
		}

	}


	return bestRank + 1;
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
 * @return 	{double} 	directCoef		Returns the penalty calculated by the formula above. If castTime larger than 3.5 returns 1.
 */
function getDirectSpellCoeficient(castTime){
	if(castTime > 3.5) return 1;
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
	if(castTime > 3.5){
		castTime = 3.5;
	}
	if(duration > 15){
		duration = 15;
	}

	let overTimePortion = (duration / 15) / ((duration / 15) + (castTime / 3.5));
	let overTimeCoef = (duration / 15) * overTimePortion;
	
	let directPortion =  1 - overTimePortion;
	let directCoef = (castTime / 3.5) * directPortion;

	return [directCoef, overTimeCoef];
}

/**
 * Downranking has significant effects on the spell's coefficient.
 * The formula for this is: ([Level of next rank - 1] + 5) / [Character Level] = [Downranking Coefficient]
 * 
 * @param 	{integer}	characterLevel      The level of the character.
 * @param 	{integer}	levelOfNextRank 	The level where the next rank of the spell can be learned. If there is no higher rank this should be negative.
 *
 * @return 	{double} 	downrankPenalty 	Returns the penalty calculated by the formula above. If levelOfNextRank is negative returns 1.
 */
function getDownrankingPenalty(characterLevel, levelOfNextRank){
	if(levelOfNextRank < 1){
		return 1;
	}
	return ((levelOfNextRank - 1) + 5) / characterLevel;
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
		return (20 - spellLevel) * .0375;
	} else {
		return 1;
	}
}