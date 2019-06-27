# World of Warcraft - Downranking tips
Downranking tool for classic World of Warcraft, will help you decide which spell rank has the highest heal per mana based on your +Healing and level. The metrics used are Healing per Mana Efficiency (HpME), Healing per Second (HpS) and a merged metric we've named Healing Efficiency Score (HES), which considers both HpME and HpS. HES is used when recommending ranks, since looking at only HpME or HpS wouldn't give accurate results.

The website is hosted by Heroku and can be found here http://www.wowdownrank.com/

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

### Update log

#### 2019-06-26 Spell details with graphs
* Added a spell details modal, opened by clicking on the details link within a spell tooltip. Spell details present graphs for the selected spell, showing how HES, HpME and HpS increase with +Healing.
* HES slider and breakpoints can now be found in the Spell details modal.

#### 2019-06-24 Talents, Slider and HES
* Added all talents that affect either healing power or spell cost.
* Added Spiritual Guidance talent for Priests, along with an input field for spirit.
* Added a slider for adjusting the importance of either HpME or HpS. The resulting value is reffered to as Healing Efficiency Score (HES) and is calculated as ```[HpME]^X * [HpS]^Y```, default is ```X = Y = 1```, but the values may be changed by moving the slider. 

#### 2019-06-12 Talents and formula
* Talents for Paladin (*Illumination* and *Healing Light*) and *Moonglow* for Druid are now used in calculations.
* Updated formula for calculating the best rank to take the HpS in to consideration, formula is ```[HpME] * log([HpS])```

#### 2019-06-12 Talents and formula
* Noticed error in the how the ```[Sub Level 20 Penalty]``` was applied and this has now been fixed.
* Added talent selection for talents that affect the breakpoints. (Currenlty not used in calculation)
* Temporarily removed the ```[Downranking Penalty]```, due to different sources having conflicts in how it is applied.

## Spell Coefficient
The Spell Coefficient (SC) is the factor that the +Healing or Spell damage is multiplied with in order to determine the final power of the spell. The way the SC is calculated depends on the spell mechanics, there are some general rules for how to calculate the SC, in addition to this a few spells have unique SCs due to balance.

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

### Spells below level 20
Casting a spell that is below level 20 incurs a significant penalty to the coefficient of the spell. The formula for this is:

```(20 - [Spell Level]) * .0375 = [Penalty]```

### Putting it all together
Now when we have all the parts we can calculate the final effective coefficient for the spell which is defined by:

```[Effective Coefficient] = [Basic Coefficient] * (1 - [Sub Level 20 Penalty]```

Thus the final power of the spell is ```[Base power] + [+Power] * [Effective Coefficient]```

The result of the function above is what is used when calculating HpME, HpS and finally HEM.

A few notes on this process:

* All cast times are considered before any spell haste or casting time talents are applied.
* All talents or buffs that increase the damage or healing from spells are applied after the coefficient calculations.
* All DoT/HoT durations are considered before any duration buffs or talents are applied. Keep in mind that these talents simply add extra ticks of damage or healing for the same amount that the spell would do otherwise.

# Sources
All the spell data used in the project has been gathered from Classic WoW Beta Servers and [ClassicWowHead](https://classic.wowhead.com/). Calculation formulas from have been derived from several sources and verified in the Classic WoW Beta.

# Contributions
As stated above I am happy to receive constructive feedback, in order to make this tool better.

Feel free to post bug reports on this repo, or create a Pull Request, but bare in mind that unless you provide a reasonable source to your claims they will be disregarded.

If you're not a developer, or simply don't care for GitHUb you can also message me on Reddit [u/Oggzor](https://www.reddit.com/user/Oggzor).

## Getting started
1. Make sure that you have node.js installed [download link](https://nodejs.org/en/download/)
2. Clone the project through git, or download as a zip.
3. Navigate to project directory and run ```npm install```.
4. Start the app localy with ```npm start```.
5. Good luck!

