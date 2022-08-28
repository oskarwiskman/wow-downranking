# World of Warcraft - Downranking tips
Downranking tool for World of Warcraft that will help you decide which spell rank has the highest heal per mana based on your gear and talents. The metrics used are Healing per Mana Efficiency (HpME), Healing per Second (HpS) and a merged metric we've named Healing Efficiency Score (HES), which considers both HpME and HpS. HES is used when recommending ranks, since looking at only HpME or HpS is very one dimensional and does not always provide the best results.

The website is hosted by [Glitch](https://glitch.com/) (was Heroku up until August 2022) and can be found here https://www.wowdownrank.com/, https://www.wowdownrank.com/tbc for the Burning Crusade version or https://www.wowdownrank.com/wotlk for Wrath of the Lich King.

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

#### 2022-08-27
* Added page for Wrath of the Lich King.
* Click the tips to see a new one!
* Improved some footer styling.

#### 2022-01-13
* Center allignment of tooltips while browsing on mobile devices for smoother user experience.
* Fix typo in tooltip for Shaman Ten Storms 3p buff.

#### 2021-12-11
* Paladin talent Illumination changed to only refund 60% of mana (previously 100%) in TBC as of patch 2.1.0. Thanks Hulio225 for pointing this out!


#### For older entries see full log here: [Complete update log](update_log.md)

# Sources
All the spell data used in the project has been gathered from Classic WoW Beta Servers, [ClassicWowHead](https://classic.wowhead.com/), TBC Beta Servers as well as [TBCWowHead](https://tbc.wowhead.com/). Calculation formulas from have been derived from several sources and verified in the Beta versions of both expansions.

# Contributions
As stated above I am happy to receive constructive feedback, in order to make this tool better.

Feel free to post bug reports on this repo, or create a Pull Request, but bare in mind that unless you provide a reasonable source to your claims they will be disregarded.

If you're not a developer, or simply don't care for GitHub you can also message me on Reddit [u/Ozgar91](https://www.reddit.com/user/Ozgar91).

## Getting started
1. Make sure that you have node.js installed [download link](https://nodejs.org/en/download/)
2. Clone the project through git, or download as a zip.
3. Navigate to project directory and run ```npm install```.
4. Start the app localy with ```npm start```.
5. Good luck!

