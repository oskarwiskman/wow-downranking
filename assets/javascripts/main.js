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

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		let className = target.attr('id');
		if(className === "paladin"){
			showCritChance();
		} else {
			hideCritChance();
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