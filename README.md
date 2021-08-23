# World of Warcraft - Downranking tips
Downranking tool for World of Warcraft: Classic and World of Warcraft - The Burning Crusade: Classic, that will help you decide which spell rank has the highest heal per mana based on your gear and talents. The metrics used are Healing per Mana Efficiency (HpME), Healing per Second (HpS) and a merged metric we've named Healing Efficiency Score (HES), which considers both HpME and HpS. HES is used when recommending ranks, since looking at only HpME or HpS is very one dimensional and does not always provide the best results.

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

#### 2021-08-23
* Improved user experience when using the HpME vs HpS Slider in the details view. Re-calculation is now performed after the slider has been released, and will also trigger a loader whilst processing.

#### 2021-08-21
* Improved layout for mobile and tablet users.

#### 2021-06-21
* Added handling of Priest talent Empowered Healing, since this had been missing before. The talent now correctly adds bonus healing to Greater Heal, Flash Heal, and Bindning Heal.

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

