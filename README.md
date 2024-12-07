# World of Warcraft - Downranking tips
Downranking tool for World of Warcraft that will help you decide which spell rank has the highest heal per mana based on your gear and talents. The metrics used are Healing per Mana Efficiency (HpME), Healing per Second (HpS) and a merged metric we've named Healing Efficiency Score (HES), which considers both HpME and HpS. HES is used when recommending ranks, since looking at only HpME or HpS is very one dimensional and does not always provide the best results.

The website is hosted on [GitHub Pages](https://pages.github.com/) and can be found here https://wowdownrank.ozgar.se

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

#### Update log

#### 2024-12-05
* Rewrote site to be static and hostable by GitHub Pages (only Classic version available now, tbc and wotlk are not)

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
All the spell data used in the project has been gathered from Classic WoW Beta Servers, [ClassicWowHead](https://classic.wowhead.com/), TBC Beta Servers as well as [TBCWowHead](https://tbc.wowhead.com/). Calculation formulas from have been derived from several sources and verified in the Beta versions of both expansions. They were also later confirmed on the official realms.

# Contributions
As stated above I am happy to receive constructive feedback, in order to make this tool better.

Feel free to post bug reports on this repo, or create a Pull Request, but bare in mind that unless you provide a reasonable source to your claims they will be disregarded.

If you're not a developer, or simply don't care for GitHub you can also message me on Reddit [u/Ozgar91](https://www.reddit.com/user/Ozgar91).

## Getting started
The way the page is setup with GitHub pages relies on the asset files being available over an internet connection. This makes local development less straight forward, since network requests to find assets are used. Unless you want to spend time setting up a local server with routes to serve all the data assets there are two easier ways to validate that your change is working.

### Test directly on my site
All logic is ran directly on your client, there is no backend so everything can be modified or overridden directly in your browser. If you see an issue with the code, you can override it in the browser to test that it behaves as intended before making a PullRequest.


### Fork and publish own GitHub Pages
If you intend to make larger changes, I would suggest forking the repository and setting up your own GitHub Pages to allow proper testing before creating a PR.

1. Create a fork of the repository
2. Setup a GitHub pages site for your new repo https://docs.github.com/en/pages/quickstart using the branch you develop on as source branch. Make sure to select `root` as folder to ensure access to assets.
3. Unless you have a custom domain to use, you will also have to run a search and replace on `assets/` and replace with `your-repo-name/assets/`. This is due to the way GitHub serves files related to a repository.
5. Good luck!

