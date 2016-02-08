$(document).ready(function() {

    // Global variables
    var theme = localStorage.getItem('_theme');
	var chosenColor;
	var $username = $('#username').focus();
	var username;
	var textArray = 
	[
	'"When you see a good move, look for a better one." (Emanuel Lasker)',
	'"Nothing excites jaded Grandmasters more than a theoretical novelty." (Dominic Lawson)',
	'"The Pin is mightier than the sword." (Fred Reinfeld)',
	'"We cannot resist the fascination of sacrifice, since a passion for sacrifices is part of a Chessplayer’s nature." (Rudolf Spielman) ',
	'"All I want to do, ever, is just play Chess." (Bobby Fischer)',
	'"A win by an unsound combination, however showy, fills me with artistic horror." (Wilhelm Steinitz)',
	'"The chessboard is the world, the pieces are the phenomena of the Universe, the rules of the game are what we call the laws of Nature and the player on the other side is hidden from us." (Thomas Huxley)',
	'"Strategy requires thought, tactics require observation." (Max Euwe)', 
	'"I don’t believe in psychology. I believe in good moves." (Bobby Fischer)',
	'"A passed Pawn increases in strength as the number of pieces on the board diminishes." (Capablanca)',
	'"Even the laziest King flees wildly in the face of a double check!" (Aaron Nimzowitsch)', 
	'"Chess is a fairy tale of 1001 blunders." (Savielly Tartakower)',
	'"Chess is no whit inferior to the violin, and we have a large number of professional violinists." (Mikhail Botvinnik)',
	'"Only the player with the initiative has the right to attack." (Wilhelm Steinitz)', 
	'"The winner of the game is the player who makes the next-to-last mistake." (Savielly Tartakover)',
	'"Your body has to be in top condition. Your Chess deteriorates as your body does. You can’t separate body from mind." (Bobby Fischer)',
	'"Of Chess it has been said that life is not long enough for it, but that is the fault of life, not Chess." (William Ewart Napier)',
	'"I have added these principles to the law: get the Knights into action before both Bishops are developed." (Emanuel Lasker)', 
	'"Chess is as much a mystery as women." (Purdy)',
    '"There are two types of sacrifices: correct ones and mine." (Mikhail Tal)'
	];
    
    //generate a quote from the start
    generateQuote();
    
    //select a random string from the array, but empty it first
    function generateQuote() {
        $("#randomQuote").children().empty();
        $("#randomQuote").children().append(textArray[Math.floor(Math.random() * textArray.length)]);
    }
    
    //do this every 10 secs
    window.setInterval(generateQuote, 10000);
	
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
	
    // Settings
    
  // If localStorage theme is dark, set the theme
  if (theme == "dark") {
		$('link[href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"]').attr('href','https://bootswatch.com/darkly/bootstrap.min.css');
		$('body').css('background', '#464545');
		$('.color-btn').css('border', '1px solid white');
		$('.jumbotron').css('background', '#817e7e');
		$('#username').css('background', '#817e7e');
  }
    
  // If localStorage theme is default, set the theme
  if (theme == "default") {
		$('link[href="https://bootswatch.com/darkly/bootstrap.min.css"]').attr('href','https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
		$('body').css('background', '#f2f2f2');
		$('.color-btn').css('border', '');
		$('.jumbotron').css('background', '#d9d9d9');
		$('#username').css('background', '#fff');
  }
    
    // Set default theme
    $('#defaultThemeBtn').click(function() {
        $('link[href="https://bootswatch.com/darkly/bootstrap.min.css"]').attr('href','https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
        $('body').css('background', '#f2f2f2');
        $('.color-btn').css('border', '');
        $('.jumbotron').css('background', '#d9d9d9');
        $('#username').css('background', '#fff');
        localStorage.setItem('_theme', 'default');
    });
	
    // Set dark theme
    $('#darkThemeBtn').click(function() {
        $('link[href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"]').attr('href','https://bootswatch.com/darkly/bootstrap.min.css');
        $('body').css('background', '#464545');
        $('.color-btn').css('border', '1px solid white');
        $('.jumbotron').css('background', '#817e7e');
        $('#username').css('background', '#817e7e');
        localStorage.setItem('_theme', 'dark');
    });
	
});