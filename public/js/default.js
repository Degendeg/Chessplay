$(document).ready(function() {

	var chosenColor;
	var $username = $('#username').focus();
	var username;
	
	$('.color-btn').click(function() {
		chosenColor = $(this).attr("value");
		localStorage.setItem('_chosenColor', chosenColor);
	});
	
	$('#playBtn').removeAttr('href').css('opacity','0.5');
	
	$(".color-picker-group button").on("click", function() {
		$(".color-btn").removeClass("active");
		$(this).addClass("active");
		if ($(this).hasClass('active') == true) {
			$('#playBtn').attr("href", "game.html").css('color','white').css('opacity','1');
		}
	});
	
	$('#playBtn').click(function() {
		username = $username.val().trim();
		localStorage.setItem('_username', username + ':');
	});
	
});