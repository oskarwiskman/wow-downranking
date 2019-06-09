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

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		let className = target.attr('id'); 
		showSpellSelectionFor(className);
	}
}

function onSpellClicked(elem){
	let target = $(elem);
	let navbar = target.closest('.navbar');

	if(target.hasClass('active')){
		target.removeClass('active');
		hideResult();
		newRandomTip();

	} else {
		navbar.find('.active').each(function(){ $(this).removeClass("active");});
		target.addClass('active');
		hideTip();
		refreshTooltip();
	}
}