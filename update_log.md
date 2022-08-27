#### Update log

#### 2022-08 27
* Added page for Wrath of the Lich King.

#### 2022-01-13
* Center allignment of tooltips while browsing on mobile devices for smoother user experience.
* Fix typo in tooltip for Shaman Ten Storms 3p buff.

#### 2021-12-11
* Paladin talent Illumination changed to only refund 60% of mana (previously 100%) in TBC as of patch 2.1.0. Thanks u/Hulio225 for pointing this out!

#### 2021-09-06
* Fixed a bug that would cause reduce the x-axis of HES chart by 100 units each time the slider was used.
* Improved handling of updates to line charts, now follows the proper patterns provided in documentation.

#### 2021-09-01
* Fixed bug with Druid talent Improved Healing Touch which was broken when TBC talent Naturalist was added. Classic version of the talent should now behave correctly again.
* Fixed bug caused by rounding to zero decimal points when calculating cast time.
* Correct path to external resource which was causing some failures.

#### 2021-08-25
* Added Shaman buffs for Tier 2, 3 piece bonus and tier 2.5, 5 piece (Only for Classic).
* Added cast time to the detailed description table.
* Chain Heal now displays 3 rows per rank, representing 0, 1 and 2 jumps.
* Small optimization of some of the calculations by reducing the amount of calls to heavier methods.
* Prevent YouTube from loading unless cookies are accepted.
* Host needed .js files.

#### 2021-08-23
* Improved user experience when using the HpME vs HpS Slider in the details view. Re-calculation is now performed after the slider has been released, and will also trigger a loader whilst processing.

#### 2021-08-21
* Improved layout for mobile and tablet users.

#### 2021-06-21
* Added handling of Priest talent Empowered Healing, since this had been missing before. The talent now correctly adds bonus healing to Greater Heal, Flash Heal, and Bindning Heal.

#### 2021-05-18
* Changed formula for Downranking penalty to be ([Level of next spell] - 1 + 5) / [Character Level] since this proved more accurate on the TBC Beta.
* Added Shaman spell Earth Shield. 
* Fix text issue with Paladin buff Light's Grace.

#### 2021-05-10
* Fix issue that the line Graphs in the Spell details modal would only load on the very first open on mobile.

#### 2021-05-08
* Priest talent Mental Agility now correctly gives 2% mana reduction per talent point instead of 1% thanks to [ZergRael](https://github.com/ZergRael).

#### 2020-06-29
* Druid talents Tranquil Spirit and Moonglow now stack additively as in game, instead of multiplicatively. So having both talents will reduce mana cost of Healing Touch by 19%. Thanks to u/Vogster for spotting this error.

#### 2020-01-24
* Added buff: Healing Way (3 stacks applied) for Shamans. Adds a 18% extra healing done to the target, this is applied after all other considerations. In other words, a cast that would normally heal the target for 1000 health, will heal 1180 with Healing Wave toggled.

#### 2020-01-22
* Add support for active buffs. The buff selection will appear if the class has any available buffs and buffs may be toggled on or off by clicking them. Hovering a buff will display a tooltip of the buff which is applied.
* Added buff: Blessing of Light (Rank 3) for Paladins. Adds a 400 healing power bonus to Holy Light and 115 to Flash of Light. These are applied as extra healing power for these spells after caluclating the cast time penalties, but before applying the sub level 20 penalty. This means that all ranks trainable at level 20 or above will receive a flat bonus according to the tooltip, and sub level 20 spells will be penalized in accordance with that formula.

#### 2019-10-08
* Druid talent Nature's Graces added. Will apply an average cast time reduction to spells based on the spell's crit chance. As an example: If you have 30% base crit, and 5 points in Improved Regrowth, landing Regrowth at a total of 80% chance to land critically, Regrowth will have it's cast time reduced by 0.8 * 0.5 = 0.4 seconds.

#### 2019-08-19
* Druid talent Moonglow now increments by the correct 3% per rank, instead of 1%.
* Calculation now applies any extra Healing Power from talents to the base healing amount, instead of the effective amount.

#### 2019-07-15 Expert's notes
* Add "Expert's Notes" for all spells, which gives a short description of how experienced players use each spell and what ranks they predominantly stick to.

#### 2019-07-02 Crit for all classes, and more talents for Priest and Shaman
* All classes can now input a critical effect chance, which will impact the calculations.
* Added Priest talents Improved Renew, Holy Specialization and Mental Agility.
* Added Shaman talent Tidal Mastery.

#### 2019-07-01 More talents for Druid and Paladin. 
* Added Druid talents Improved Rejuvenation and Improved Regrowth, and Paladin talent Holy Power.
* Updated some link texts, and minor improvements to descriptive texts.
* Updated spacing for class and spell icons in the compare menu, to make room for the wider scrollbar on Windows.

#### 2019-06-30 YouTube link and Gift of Nature
* Added embedded YouTube video in the "How it works!" modal, where Defcamp & Melderon explain downranking and show case the tool. Watch it here [Classic WoW Downranking Guide & Tool](https://www.youtube.com/watch?v=HBDfRiB1Zlk)
* Added Druid talent Gift of Nature (Don't know how I forgot about that)

#### 2019-06-29 Compare spells and styling upgrade
* Added title art (World of Warcraft: Classic). And other minor improvements to site styling.
* Changed Spell details link in the spell tooltip to a button.
* Added button in the spell tooltip to pit spells against eachother for comparison.

#### 2019-06-26 Spell details with graphs
* Added a spell details modal, opened by clicking on the details link within a spell tooltip. Spell details present graphs for the selected spell, showing how HES, HpME and HpS increase with +Healing.
* HES slider and breakpoints can now be found in the Spell details modal.
* Added Holy Shock for Paladins.

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
