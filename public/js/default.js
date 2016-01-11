$(document).ready(function() {
	var chosenColor;
	$('.color-btn').click(function() {
		chosenColor = $(this).attr("value");
		localStorage.setItem('_chosenColor', chosenColor);
	});
	
	$(".color-picker-group button").on("click", function() {
		$(".color-btn").removeClass("active");
		$(this).addClass("active");
		if ($(this).hasClass('active') == true) {
			$('#playBtn').attr("href", "game.html").css('color','black');
		}
	});
	
	$('#playBtn').removeAttr('href').css('color','grey');
});