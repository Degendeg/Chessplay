$(document).ready(function() {
	$("#playBtn").click(function() {
		window.location.replace("/game.html");
	});
	
	$(".color-picker-group button").on("click", function() {
		$(".color-btn").removeClass("active");
		$(this).addClass("active");
	});
});