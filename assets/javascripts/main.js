$(document).ready(function(){
	$(".wow-class").on('click', function(){
		onClassClicked(this);
		newRandomTip();
	});
	$("#healing").change(function(){
		refreshTooltip();
	});
	$("#level").change(function(){
		refreshTooltip();
	});
    initRangeSlider();
    newRandomTip();
});

function onClassClicked(elem){
	let target = $(elem);
	let navbar = target.closest('.navbar');
	hideResult();
	if(target.hasClass('active')){
		target.removeClass('active');
		showSpellSelectionFor();
		showSpellAffectingTalentsFor();
		hideCritChance();
		hideSpirit();

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		let className = target.attr('id');
		if(className === "paladin"){
			showCritChance();
		} else {
			hideCritChance();
		}
		if(className === "priest"){
			showSpirit();
		} else {
			hideSpirit();
		}
		showSpellAffectingTalentsFor(className);
		showSpellSelectionFor(className);
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

function initRangeSlider(){
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