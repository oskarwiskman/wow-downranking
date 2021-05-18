# World of Warcraft - Downranking tips
Downranking tool for World of Warcraft: Classic and World of Warcraft - The Burning Crusade: Classic, will help you decide which spell rank has the highest heal per mana based on your +Healing and level. The metrics used are Healing per Mana Efficiency (HpME), Healing per Second (HpS) and a merged metric we've named Healing Efficiency Score (HES), which considers both HpME and HpS. HES is used when recommending ranks, since looking at only HpME or HpS wouldn't give accurate results.

The website is hosted by Heroku and can be found here https://www.wowdownrank.com/ or https://www.wowdownrank.com/tbc for the Burning Crusade version.

Currently supported spells:

#### Classic

* Druid:
 * Rejuvenation
 * Regrowth
 * Healing Touch

* Paladin:
 * Flash of Light
 * Holy Light
 * Holy Shock

* Priest:
 * Flash Heal
 * Greater Heal
 * Heal
 * Renew

* Shaman:
 * Chain Heal
 * Healing Wave
 * Lesser Healing Wave

#### The Burning Crusade

* Druid:
 * Rejuvenation
 * Regrowth
 * Healing Touch
 * Lifebloom

* Paladin:
 * Flash of Light
 * Holy Light
 * Holy Shock

* Priest:
 * Flash Heal
 * Greater Heal
 * Heal
 * Renew
 * Binding Heal
 * Circle of Healing
 * Prayer of Healing

* Shaman:
 * Chain Heal
 * Healing Wave
 * Lesser Healing Wave
 * Earth Shield

#### Update log

#### 2021-05-18
* Changed formula for Downranking penalty to be ([Level of next spell] - 1 + 5) / [Character Level] since this proved more accurate on the TBC Beta.
* Added Shaman spell Earth Shock. 
* Fix text issue with Paladin buff Light's Grace.

#### 2021-05-10
* Fix issue that the line Graphs in the Spell details modal would only load on the very first open on mobile.

#### 2021-05-08
* Priest talent Mental Agility now correctly gives 2% mana reduction per talent point instead of 1% thanks to [ZergRael](https://github.com/ZergRael).

#### For older entries see full log here: [Complete update log](update_log.md)

# Sources
All the spell data used in the project has been gathered from Classic WoW Beta Servers, [ClassicWowHead](https://classic.wowhead.com/), TBC Beta Servers as well as [TBCWowHead](https://tbc.wowhead.com/). Calculation formulas from have been derived from several sources and verified in the Beta versions of both expansions.

# Contributions
As stated above I am happy to receive constructive feedback, in order to make this tool better.

Feel free to post bug reports on this repo, or create a Pull Request, but bare in mind that unless you provide a reasonable source to your claims they will be disregarded.

If you're not a developer, or simply don't care for GitHub you can also message me on Reddit [u/Oggzor](https://www.reddit.com/user/Oggzor).

## Getting started
1. Make sure that you have node.js installed [download link](https://nodejs.org/en/download/)
2. Clone the project through git, or download as a zip.
3. Navigate to project directory and run ```npm install```.
4. Start the app localy with ```npm start```.
5. Good luck!

