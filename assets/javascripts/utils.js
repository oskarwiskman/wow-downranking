const cache = {};

function isMobile() {
	  let check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	  return check;
	};

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

function mobileAlignTooltipCenter(selector) {
	if($("body").hasClass("mobile")) {
		$(selector).each(function() {
	    this.style.left=0;
	    let tooltipRect = this.getBoundingClientRect();
	    let left =  vw/2 - (tooltipRect.left+(tooltipRect.width/2));
	    this.style.left = left + "px";
		});
	}
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
		$('#talent-selection').addClass('hidden');
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

function getCritChance(){
	let critChance = Math.max(0, Math.min(100, $('#crit-chance').val()));
	return parseInt(critChance);
}

function getHasteCoefficient(){
	return expansion === 'tbc' ? 1-roundNumber(Math.max(0, Math.min(3000, $('#haste-rating').val()) / 15.8), 1)/100 : 1;
}

function hideSpirit(){
	$('#spirit-container').addClass("hidden");
}

function showSpirit(){
	$('#spirit-container').removeClass("hidden");
}

function getSpirit(){
	return Math.min(Math.max(0, $('#spirit').val()), 5000);
}

function getSelectedClassName(){
	return $('.wow-spell.active').data('class-name');
}

function getSelectedSpellName(){
	return $('.wow-spell.active').data('spell-name');
}

function getCharacterLevel(){
	return expansion === 'tbc' ? 70 : 60;
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

function selectCompareModalClass() {
	return new Promise(function(resolve, reject) {
		let className = getSelectedClassName();
		let classElem = document.getElementById(`${className}1`);
		eventFire(classElem, 'click');
	});
}

function loadDetailsModalContent(){
	let className = getSelectedClassName();
	let spellName = getSelectedSpellName();
	if(className && spellName){
		loadSpellData(className, spellName, buildSpellDetailsContent, getHealingPower());
	}
}

function buildSpellDetailsContent(spellData, healingPower){
	$('#details-modal').find('.content').hide();
	$('#details-modal').find('.background').find('.loader').removeClass('hidden');
	setTimeout(function() {
		$(`#details-modal`).find('.content-title').find('.name').html(toTitleCase(spellData.name));
		$(`#details-modal`).find('.content-title').find('.text').html(` details at level ${expansion == 'tbc' ? '70' : '60'}`);
		$(`#details-modal`).find('.experts-notes h3').html(spellData.notes[0].note ? "Veteran's notes" : '');
		$(`#details-modal`).find('.experts-notes .note').html(spellData.notes[0].note);
		if(!spellData.notes[0].author.name) {
			$(`#details-modal`).find('.experts-notes .author').hide();
		} else {
			$(`#details-modal`).find('.experts-notes .author').show();
		}
		$(`#details-modal`).find('.experts-notes .author .name').html(spellData.notes[0].author.name);
		$(`#details-modal`).find('.experts-notes .author .desc').html(spellData.notes[0].author.description);
		buildSpellTable(spellData, healingPower);
		buildBreakpointsTable(spellData);
		buildSpellCharts(spellData);
		$('#details-modal').find('.background').find('.loader').addClass('hidden');
		$('#details-modal').find('.content').show();
	}, 10);
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

function toTitleCase(str) {
	let split = str.split('_');
	for(let i = 0; i < split.length; i++){
		split[i] = split[i].charAt(0).toUpperCase() + split[i].substr(1);
	}
	return split.join(' ').replace("-", "'");
}

function refreshDetailsModal(){
	$('#details-modal').find('.content').hide();
	$('#details-modal').find('.background').find('.loader').removeClass('hidden');
	setTimeout(function() {
		let className = getSelectedClassName();
		let spellName = getSelectedSpellName();
		if(className && spellName) {
			loadSpellData(className, spellName, buildBreakpointsTable);
			loadSpellData(className, spellName, buildHESChart);
		}
		$('#details-modal').find('.background').find('.loader').addClass('hidden');
		$('#details-modal').find('.content').show();
	}, 10);
}

function addSpellDataToDOM(spellData, id) {
	$(`#${id}`).data("spell-data", spellData);
}

function getCachedSpellData(className, spellName) {
	return cache[`/spelldata/${expansion}/${className}/${spellName}.json`];
}

function loadSpellData(className, spellName, callback, param){
	let spellPath = `/spelldata/${expansion}/${className}/${spellName}.json`;
	loadJSON(spellPath, callback, param);
}

function loadTalentData(className, callback){
	let talentPath = `/talents/${expansion}/${className}.json`
	loadJSON(talentPath, callback);
}

function loadBuffData(className, callback){
	let spellPath = `/buffs/${expansion}/${className}.json`;
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
	        'url': `/assets${path}`,
	        'dataType': "json",
	        'success': !!callback ? 
	        	function(data) {
        			cache[path] = data;
        			callback(data, param);
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

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}