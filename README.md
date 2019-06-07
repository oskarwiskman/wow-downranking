## World of Warcraft - Downranking tips
Downranking tool for classic World of Warcraft, will help you decide which spell rank has the highest heal/mana based on your +Healing and level.

## Spell Coefficient
The Spell Coefficient (SP) is the factor that the +Healing or Spell damage is multiplied with in order to determine the final power of the spell. The way the SP is calculated depends on the spell mechanics, there are some general rules for how to calculate the SP, in addition to this a few spells have unique SPs due to balance.

The sections below will describe how this tool calculates Spell Coeficients, should you encounter any errors your are welcome to report a bug, or create a pull request. However, unless a reliable source is provided the requests will be rejected.

# Direct spells and Over-Time spells
These two are the most straigt forward, since they are comprised of a single dividing factor.

Direct spells are spells that only have a direct impact such as Smite, Shadowbolt, Flash Heal or Healing Touch. The coeficient is calculated by:
Direct spell coeficient = [Cast Time of Spell] / 3.5

Over-Time spells includes both Damage over time (DoTs) and Healing over Time (HoTs), such as Rejuvenation or Curse of Agony. The added damage or healing is divided equally among each tick of the spell and the standard formula is:
Over-Time spell coeficient = [Duration of Spell] / 15

Hybrid spells is a little bit more complicated, these are spells with both a direct effect and a Over-Time portion, such as Regrowth, or Fire Ball. The standard formula for hybrid spells is:
[Over-Time part] = ([Duration] / 15) / (([Duration] / 15) + ([Cast Time] / 3.5))
[Direct part] = 1 - [Over-Time portion]

This category includes damage and healing spells with both a direct portion as well as an "Over-Time" portion. The standard formula for these spells is as follows:
     Over-Time portion: ([Duration] / 15) / (([Duration] / 15) + ([Cast Time] / 3.5)) = [Over-Time portion]
     Direct portion: 1 - [Over-Time portion] = [Direct portion]

The duration and cast time limitations are then applied:
      Over-Time portion: ([Duration] / 15) * [Over-Time portion] = [Over-Time coefficient]
      Direct portion: ([Cast Time / 3.5) * [Direct portion] = [Direct coefficient]

For the Over-Time portion, the added damage or healing is applied equally across each tick of the spell.

Channeled spells
This category includes spells that require channeling to continue the spell cast. The general formula for these spells is:
     [Cast Time] / 3.5 = [Coefficient]

Channeled spells gain the added damage or healing over the duration of the spell, divided equally among each tick.

Area of Effect spells
This category includes spells that deal damage or heal more than a single target. The general formula for these spells is:
     ([Cast Time] / 3.5) / 2 = [Coefficient]

AoE spells also have been given diminishing returns based on the number of targets hit with the spell. This formula is still unknown.

Paladin Specials
Some Paladin spells do not fall under any of the categories above, these spells have their own formulas for calculating the added damage.

Holy Shield/Retribution Aura
Reflects damage back to the attacker:
     5% of [bonus spell damage] = [amount of damage per charge]

Note: this is a special case for these two paladin spells only, reflected damage from other spells (i.e. Thorns) do not gain any benefit from bonus damage.

Seal of Righteousness
Deals additional holy damage to the target.
One Handed weapons
     9.2% * [Weapon Speed (in seconds)] = [Amount of Damage]

Two Handed weapons
     10.8% * [Weapon Speed (in seconds)] = [Amount of Damage]

Pentalties
Certain spells will also have various coefficient penalties associated with them.

Spells below level 20
Casting a spell that is below level 20 incurs a significant penalty to the coefficient of the spell. The formula for this is:
     (20 - [Spell Level]) * .0375 = [Penalty]

Downranking
Downranking also has significant effects on the spell's coefficient. The forumla for this is:
     ([Level of next rank - 1] + 5) / [Character Level] = [Downranking Coefficient]

What the "Level of next rank - 1" means is the level right before the caster would get the next rank of the spell. For example, Greater Heal (Rank 3) would be considered a level 57 spell for this calculation, since Greater Heal (Rank 4) is a level 58 spell.

Additional Effects
Some spells have additional effects, such as Frostbolt or Blizzard. The formulas for single target and AoE spells are slightly different. Since patch 2.1, not all spells with additional effects will follow this calculation as several have been given their own specific modifier (Blast Wave, Dragon's Breath, and Frost Nova for examples).

Single Target
Single target spells incur a 5% penalty to the coefficient:
     ([Cast Time] / 3.5) * 0.95 = [Coefficient]
AoE
AoE spells incur the same 5% penalty, as well as an additional penalty:
     (([Cast Time] / 3.5) * 0.95) / 3 = [Coefficient]
Note the change from dividing by 2 to dividing by 3 for the AoE spells.

Damage and Healing spells
Some spells do both damage to the target as well as healing to the caster. These types of spells receive a flat 50% penalty to the coefficient they would normally receive. They also only benefit from bonus damage effects and gain not benefit from bonus healing effects, however, the amount of bonus damage they receive applies equally to both the damage portion as well as the healing portion of the spell.

Putting it all together
Will all those numbers above, it can seem difficult to grasp how a particular spell's coefficient is determined. The basics of this process is as follows:
     [Basic Coefficient] * [Downranking Penalty] * [Sub Level 20 Penalty] = [Effective Coefficient]

A few notes on this process:

All cast times are considered before any spell haste or casting time talents are applied.
All talents or buffs that increase the damage or healing from spells are applied after the coefficient calculations.
All DoT/HoT durations are considered before any duration buffs or talents are applied. Keep in mind that these talents simply add extra ticks of damage or healing for the same amount that the spell would do otherwise.

