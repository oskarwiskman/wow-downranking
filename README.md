# World of Warcraft - Downranking tips
Downranking tool for classic World of Warcraft, will help you decide which spell rank has the highest heal per mana based on your +Healing and level.

Currently supported spells:

Druid:
* Rejuvenation
* Regrowth
* Healing Touch

Paladin:
* Flash of Light
* Holy Light

Priest:
* Flash Heal
* Greater Heal
* Heal
* Renew

Shaman:
* Chain Heal
* Healing Wave
* Lesser Healing Wave

## Spell Coefficient
The Spell Coefficient (SP) is the factor that the +Healing or Spell damage is multiplied with in order to determine the final power of the spell. The way the SP is calculated depends on the spell mechanics, there are some general rules for how to calculate the SP, in addition to this a few spells have unique SPs due to balance.

The sections below will describe how this tool calculates Spell Coefficients, should you encounter any errors your are welcome to report a bug, or create a pull request. However, unless a reliable source is provided the requests will be rejected.

[DISCLAIMER]: Due to being a healer myself, I have focused on healing spells to start with. In addition to this, since not all spells make any sense to downrank these have not been included, but might be added later if there is an interest.

### Direct spells and Over-Time spells
These two are the most straigt forward, since they are comprised of a single dividing factor.

Direct spells are spells that only have a direct impact such as Smite, Shadowbolt, Flash Heal or Healing Touch. The coefficient is calculated by:

```[Direct spell coefficient] = [Cast Time of Spell] / 3.5```

Over-Time spells includes both Damage over time (DoTs) and Healing over Time (HoTs), such as Rejuvenation or Curse of Agony. The added damage or healing is divided equally among each tick of the spell and the standard formula is:

```[Over-Time spell coefficient] = [Duration of Spell] / 15```


### Hybrid spells
Hybrid spells is a little bit more complicated, these are spells with both a direct effect and a Over-Time portion, such as Regrowth, or Fire Ball. The standard formula for hybrid spells is:

```[Over-Time part] = ([Duration] / 15) / (([Duration] / 15) + ([Cast Time] / 3.5))```

```[Direct part] = 1 - [Over-Time portion]```

The duration and cast time limitations are then applied:

```[Over-Time coefficient] = ([Duration] / 15) * [Over-Time part]```

```[Direct coefficient] = ([Cast Time / 3.5) * [Direct part]```

### Pentalties
Certain spells will also have various coefficient penalties associated with them.

#### Spells below level 20
Casting a spell that is below level 20 incurs a significant penalty to the coefficient of the spell. The formula for this is:

```(20 - [Spell Level]) * .0375 = [Penalty]```

#### Downranking
Downranking also has significant effects on the spell's coefficient. The forumla for this is: ([Level of next rank - 1] + 5) / 

```[Character Level] = [Downranking Coefficient]```

What the "Level of next rank - 1" means is the level right before the caster would get the next rank of the spell. For example, Greater Heal (Rank 3) would be considered a level 57 spell for this calculation, since Greater Heal (Rank 4) is a level 58 spell.

### Putting it all together
Now when we have all the parts we can calculate the final effective coefficient for the spell which is defined by:

```[Effective Coefficient] = [Basic Coefficient] * [Downranking Penalty] * [Sub Level 20 Penalty]```

A few notes on this process:

All cast times are considered before any spell haste or casting time talents are applied.
All talents or buffs that increase the damage or healing from spells are applied after the coefficient calculations.
All DoT/HoT durations are considered before any duration buffs or talents are applied. Keep in mind that these talents simply add extra ticks of damage or healing for the same amount that the spell would do otherwise.


Sources: 
http://wow.allakhazam.com/wiki/spell_coefficient_(wow)
https://classicdb.ch/

