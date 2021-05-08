let expansion = "";

$(document).ready(function(){
    initRangeSliders();
    newRandomTip();
    expansion = window.location.href.indexOf("tbc") > -1 ? "tbc" : "classic";
});

function onClassClicked(elem){
	let target = $(elem);
	let navbar = target.closest('.navbar');
	hideResult();
	newRandomTip();
	if(target.hasClass('active')){
		target.removeClass('active');
		$('#spell-selection').addClass('hidden');
		$('#buff-selection').addClass('hidden');
		showSpellAffectingTalentsFor();
		hideSpirit();

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		let className = target.attr('id');
		if(className === "priest" || className === "druid"){
			showSpirit();
		} else {
			hideSpirit();
		}
		showSpellAffectingTalentsFor(className);
		showSpellSelectionFor(className, 'onSpellClicked(this)', $('#spell-selection'));
		showBuffSelectionFor(className);
	}
}

function onSpellClicked(elem){
	let target = $(elem);
	let navbar = target.closest('.navbar');

	if(target.hasClass('active')){
		newRandomTip();
		target.removeClass('active');
		hideResult();

	} else {
		hideTip();
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		refreshTooltip();
	}
}

function onClassCompareClicked(elem) {
	let target = $(elem);
	let navbar = target.closest('.navbar');
	let column = target.closest('.column');
	let container = column.find('.compare-spell-select');
	column.find('.compare-result').addClass('hidden');
	if(target.hasClass('active')){
		target.removeClass('active');
		container.addClass("hidden");
		column.find('.compare-rank-select').addClass("hidden");

	} else {
		navbar.find('.active').each(function(){ 
			$(this).removeClass("active");
		});
		target.addClass('active');
		let className = target.data('class-name');
		showSpellSelectionFor(className, 'onSpellCompareClicked(this)', container);
		column.find('.compare-rank-select').removeClass("hidden");
	}
	refreshRadarChart();
}

function onSpellRankChanged(elem) {
	let target = $(elem);
	let column = target.closest('.column');
	let spell = column.find('.wow-spell.active');
	let resultContainer= column.find('.compare-result');
	let className = spell.data('class-name');
	let spellName = spell.data('spell-name');
	let spellRank = $(elem).val();
	params = {
		target: `#${resultContainer.attr('id')}`,
		rank: spellRank,
		class: "small",
		result_container: `#${resultContainer.attr('id')}`,
	}
	loadSpellData(className, spellName, updateTooltip, params);
	refreshRadarChart();
}

function onSpellCompareClicked(elem) {
	let target = $(elem);
	let navbar = target.closest('.navbar');
	let column = target.closest('.column');
	let resultContainer= column.find('.compare-result');
	let className = target.data('class-name');
	let spellName = target.data('spell-name');
	let spellRank = column.find('.compare-rank-select input[type="number"]').val();

	if(target.hasClass('active')){
		target.removeClass('active');
		resultContainer.addClass('hidden');
		column.find('.compare-rank-select').addClass("hidden");
		

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		params = {
			target: `#${resultContainer.attr('id')}`,
			rank: spellRank,
			class: "small",
			result_container: `#${resultContainer.attr('id')}`,
		}
		column.find('.compare-rank-select').removeClass("hidden");
		loadSpellData(className, spellName, updateTooltip, params);
	}
	refreshRadarChart();
}

function initRangeSliders(){
	$('input[type="range"]').rangeslider({

    // Feature detection the default is `true`.
    // Set this to `false` if you want to use
    // the polyfill also in Browsers which support
    // the native <input type="range"> element.
    polyfill: false,

    // Default CSS classes
    rangeClass: 'rangeslider',
    disabledClass: 'rangeslider--disabled',
    horizontalClass: 'rangeslider--horizontal',
    verticalClass: 'rangeslider--vertical',
    fillClass: 'rangeslider__fill',
    handleClass: 'rangeslider__handle',

    // Callback function
    onInit: function() {},

    // Callback function
    onSlide: function(position, value) {
		refreshDetailsModal();
    },

    // Callback function
    onSlideEnd: function(position, value) {}
});
}