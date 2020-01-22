const cache = {};


function refreshTooltip(){
	let className = getSelectedClassName();
	let spellName = getSelectedSpellName();
	if(className && spellName){
		params = {
			footer:	`<span class="btn">
						<a href="#" onClick="openModal('details-modal')">Detailed Overview</a>
					</span>
					<span class="btn pull-right">
						<a href="#" onClick="openModal('compare-modal')">Compare</a>
					</span>`,
			target: '#tooltip',
			result_container: '#result'
		}
		loadSpellData(className, spellName, updateTooltip, params);
	}
}

function refreshRadarChart(){
	let spellNames = [];
	let classNames = [];
	let spellRanks = [];
	let firstSpell = $('#first-spell:visible .active');
	let secondSpell = $('#second-spell:visible .active');
	let chartContainer = $('.chart-container');
	chartContainer.hide();
	if(firstSpell.length > 0) {
		spellNames.push(firstSpell.data('spell-name'));
		classNames.push(firstSpell.data('class-name'));
		spellRanks.push($('#first-spell-rank').val());
		chartContainer.show();
	}
	if(secondSpell.length > 0) {
		spellNames.push(secondSpell.data('spell-name'));
		classNames.push(secondSpell.data('class-name'));
		spellRanks.push($('#second-spell-rank').val());
		chartContainer.show();
	}
	buildCompareRadarChart(spellNames, classNames, spellRanks);
}

function updateTalent(elem){
	let talent = $(elem).closest(".talent-icon");
	let bubble = talent.find(".icon-bubble");
	let border = talent.find(".icon-border");
	let talentTooltip = talent.find(".talent-tooltip");
	let talentData = talent.data("talent");
	let maxRank = talentData.maxRank;
	let currentRank = talent.data("current-rank");
	let direction = talent.data("direction");
	if(direction === "up" && currentRank < maxRank){
		currentRank ++;
		talent.data("current-rank", currentRank);
	}
	if(direction === "down" && currentRank > 0){
		currentRank --;
		talent.data("current-rank", currentRank);
	}
	if(currentRank === 0){
		talent.data("direction", "up");
	}
	if(currentRank === maxRank){
		border.addClass("maxed");
		bubble.addClass("maxed");
		talent.data("direction", "down");
	} else {
		border.removeClass("maxed");
		bubble.removeClass("maxed");
	}
	talentTooltip.html(buildTalentTooltip(talentData, currentRank));
	bubble.html(currentRank);
	refreshTooltip();
}

function updateTooltip(spellData, params){
	let rank = params.rank;
	if(!rank) {
		rank = calculateMostEfficientRank(getHealingPower(), spellData);
		$('#first-spell-rank').val(rank);
	}
	$(params.target).html(buildTooltipHtmlForSpell(spellData, rank, params.class, params.footer));
	showResult(params.result_container);
}

function toggleBuff(elem){
	$(elem).toggleClass('active');
	let footer = $(elem).find('.footer');
	footer.toggleClass('toggled');
	if(footer.hasClass('toggled')) {
		footer.html("Click to remove buff");
	} else {
		footer.html("Click to add buff");
	}
	refreshTooltip();
}

function showSpellAffectingTalentsFor(className){
	if(!className) {
		$('#talent-selection').addClass('hidden');
	} else {
		loadTalentData(className, buildTalentHtmlForClass);
	}
}

function showSpellSelectionFor(className, callback, target){
	let container = target.find('.navbar');
	if(!className) {
		target.addClass('hidden');
	} else {
		buildSpellHtmlForClass(className, callback, container);
		target.removeClass('hidden');
	}
}

function showBuffSelectionFor(className){
	if(!className) {
		$('#buff-selection').addClass('hidden');
	} else {
		loadBuffData(className, buildBuffHtmlForClass);
	}
}

function setRandomBackground() {
	let backgrounds = ["Kalimdor.png", "EasternKingdoms.png"];
	$('body').css('background', `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url("../images/${backgrounds[Math.floor(Math.random() * backgrounds.length)]}"`);
}

function hideTip(){
}

function newRandomTip(){
	loadJSON('/data/tips.json', updateTip);
}

function updateTip(tipData){
	$('#tip-container').hide();
	$('#tip').html(tipData.tips[Math.floor(Math.random() * tipData.tips.length)]);
	$('#tip-container').fadeIn('slow');	
}

function hideResult(){
	$('#result').addClass("hidden");
}

function showResult(id){
	$(id).removeClass("hidden");
}

function hideCritChance(){
	$('#crit-chance-container').addClass("hidden");
}

function showCritChance(){
	$('#crit-chance-container').removeClass("hidden");
}

function getCritChance(){
	return Math.max(0, Math.min(100, $('#crit-chance').val()));
}

function hideSpirit(){
	$('#spirit-container').addClass("hidden");
}

function showSpirit(){
	$('#spirit-container').removeClass("hidden");
}

function getSpirit(){
	return Math.max(0, $('#spirit').val());
}

function getSelectedClassName(){
	return $('.wow-spell.active').data('class-name');
}

function getSelectedSpellName(){
	return $('.wow-spell.active').data('spell-name');
}

function getCharacterLevel(){
	return 60;
}

function getBuffByName(buffName){
	return $(`#buff-${buffName}`);
}

function getTalentByName(talentName){
	return $(`#talent-${talentName}`);
}

function getAqReleased(){
	return $('#aq-tome:checked').length > 0;
}

function highlightMaxValue(tableid){
	let tdCount = $(`#${tableid} tr:eq(1) td`).length,
	    trCount = $(`#${tableid} tr`).length;

	for (let i = 0; i < tdCount; i++) {
	    let $td = $(`#${tableid}  tbody tr:eq(0) td:eq(${i})`),
	    	sortmode = $(`#${tableid} thead tr:eq(0) th:eq(${i})`).data('sort-mode'),
	        highest = 0,
	        lowest = 9e99;
	    if(sortmode === 'no') {
	    	continue;
	    }
	    for (let j = 2; j < trCount; j++) {
	        $td = $td.add(`#${tableid}  tr:eq(${j}) td:eq(${i})`);
	    }

	    $td.each(function(i, el){
	        let $el = $(el);
	        if (i >= 0) {
	            let val = parseFloat($el.data('sort-value'));
	            if (val > highest) {
	                highest = val;
	                if(sortmode === 'asc') {
	                	$td.removeClass('red');
	                	$el.addClass('red');
	                }
	                else {
	                	$td.removeClass('green');
	                	$el.addClass('green');
	                }
	            }
	            if (val < lowest) {
	                lowest = val;
	                if(sortmode === 'asc') {
	                	$td.removeClass('green');
	                	$el.addClass('green');
	                }
	                else {
	                	$td.removeClass('red');
	                	$el.addClass('red');
	                }
	            }
	        }
	    });
	}
}

function openModal(id){
	$(`#${id}`).modal({
		showClose: false
	});
	if(id === 'details-modal'){
		loadDetailsModalContent();
	}
	if(id === 'compare-modal'){
		setTimeout(
			function() {
				if($(`#${getSelectedClassName()}1.active`).length === 0){
					eventFire(document.getElementById(`${getSelectedClassName()}1`), 'click');
				}
			}, 250);
		setTimeout(
			function() {
				eventFire($('#first-spell').find(`[data-spell-name="${getSelectedSpellName()}"]`).get(0), 'click');
			}, 500);
		setTimeout(
			function() {
				if($('#first-spell').find(`.active[data-spell-name="${getSelectedSpellName()}"]`).length === 0){
					eventFire($('#first-spell').find(`[data-spell-name="${getSelectedSpellName()}"]`).get(0), 'click');
				}
				refreshDetailsModal();
			}, 750);
	}
}

function loadDetailsModalContent(){
	let className = getSelectedClassName();
	let spellName = getSelectedSpellName();
	if(className && spellName){
		$('#details-modal').find('.background').find('.loader').removeClass('hidden');
		$('#details-modal').find('.content').hide();
		loadSpellData(className, spellName, buildSpellDetailsContent, getHealingPower());
	}
}

function buildSpellDetailsContent(spellData, healingPower){
	$(`#details-modal`).find('.content-title').find('.name').html(toTitleCase(spellData.name));
	$(`#details-modal`).find('.experts-notes .note').html(spellData.notes[0].note);
	$(`#details-modal`).find('.experts-notes .author .name').html(spellData.notes[0].author.name);
	$(`#details-modal`).find('.experts-notes .author .desc').html(spellData.notes[0].author.description);
	buildSpellTable(spellData, healingPower);
	buildBreakpointsTable(spellData);
	buildSpellCharts(spellData);
	$('#details-modal').find('.background').find('.loader').addClass('hidden');
	$('#details-modal').find('.content').show();
}

function getSliderValues(){
	let slider = $('input[type="range"]');
	let maxValue = (slider.attr('max')/2)|0;
	let slidervalue = slider.val();
	let HpMEpower = slidervalue < maxValue ? (maxValue + 1) - slidervalue : 1;
	let HpSpower = slidervalue > maxValue ? (parseInt(slidervalue) + 1) - maxValue : 1;
	if(HpMEpower === maxValue + 1){
		HpSpower = 0;
	}
	if(HpSpower === maxValue + 1){
		HpMEpower = 0;
	}
	return [HpMEpower, HpSpower];
}

function getHealingPower(){
	let healingPower = $('#healing').val();
	if(!healingPower || healingPower < 0) healingPower = 0;
	if(healingPower > 5000) healingPower = 5000;
	return parseInt(healingPower);
}

function getCritChance(){
	let critChance = $('#crit-chance').val();
	if(!critChance || critChance < 0) critChance = 0;
	if(critChance > 100) critChance = 100;
	return parseInt(critChance);
}

function toTitleCase(str) {
	let split = str.split('_');
	for(let i = 0; i < split.length; i++){
		split[i] = split[i].charAt(0).toUpperCase() + split[i].substr(1);
	}
	return split.join(' ').replace("-", "'");
}

function refreshDetailsModal(){
	let className = getSelectedClassName();
	let spellName = getSelectedSpellName();
	if(className && spellName){
		loadSpellData(className, spellName, buildBreakpointsTable);
		loadSpellData(className, spellName, buildHESChart);
	}
}

function addSpellDataToDOM(spellData, id) {
	$(`#${id}`).data("spell-data", spellData);
}

function getCachedSpellData(className, spellName) {
	return cache[`/spelldata/${className}/${spellName}.json`];
}

function loadSpellData(className, spellName, callback, param){
	let spellPath = `/spelldata/${className}/${spellName}.json`;
	loadJSON(spellPath, callback, param);
}

function loadTalentData(className, callback){
	let talentPath = `/talents/${className}.json`
	loadJSON(talentPath, callback);
}

function loadBuffData(className, callback){
	let spellPath = `/buffs/${className}.json`;
	loadJSON(spellPath, callback);
}

function loadJSON(path, callback, param) {
	if(cache[path]) {
		if(typeof callback === 'function') {
			callback(cache[path], param);
			return;
		}
		else {
			return cache[path];
		}
	}
	return (function () {
	    var json = null;
	    $.ajax({
	        'global': false,
	        'data': param,
	        'url': path,
	        'dataType': "json",
	        'success': !!callback ? 
	        	function(data) {
	        		cache[path] = data;
	        		callback(data, param) 
	        	} : 
	        	function (data) {
	        		cache[path] = data;
	        	}
	    });
	})();
}

function eventFire(el, etype){
	if (el.fireEvent) {
		el.fireEvent('on' + etype);
	} else {
		var evObj = document.createEvent('Events');
		evObj.initEvent(etype, true, false);
		el.dispatchEvent(evObj);
	}
}

function range(min, max , step = 1) {
    let arr = [];
    let totalSteps = Math.floor((max - min)/step);
    for (let ii = 0; ii <= totalSteps; ii++ ) { arr.push(ii * step + min) }
    return arr;
}

function normalizeDatasets(datasets) {
	let allDataPoints = [];
	for(let i = 0; i < datasets.length; i++){
		allDataPoints = allDataPoints.concat(datasets[i].data);
	}
	let rMin = Math.min(...allDataPoints);
	let rMax = Math.max(...allDataPoints);
	for(let i = 0; i < datasets.length; i++){
		datasets[i].data = normalizeArray(datasets[i].data, 0, 10, rMin, rMax);
	}
	return datasets;
}

function normalizeArray(array, tMin=0, tMax=1, rMin, rMax, round=3){
	if(rMin === undefined) rMin = Math.min(...array);
	if(rMax === undefined) rMax = Math.max(...array);
	for(let i = 0; i < array.length; i ++){
		array[i] = normalizeValue(array[i], tMin, tMax, rMin, rMax, round);
	}
	return array;
}

function normalizeValue(value, tMin, tMax, rMin, rMax, round=3) {
	return roundNumber((tMax - tMin) * (value - rMin) / (rMax - rMin) + tMin, round);
}

function roundNumber(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

function sortNumberAsc(a, b) {
  return b - a;
}