$(document).ready(function() {

  // Global variables
  var socket = window.io.connect({
    transports: ['websocket']
  });
  var playerColor = localStorage.getItem('_chosenColor');
  var username = localStorage.getItem('_username');
  var theme = localStorage.getItem('_theme');

  // Color picker
  $("#whSq").spectrum({
    color: "#e6e6e6"
  });

  // Color picker
  $("#blSq").spectrum({
    color: "#706161"
  });
  
  //Get current year
  $('.thisYear').text((new Date()).getFullYear());

  // Load the colors for the chessboard
  $(window).bind("load", function() {
    $('#board .white-1e1d7').css('background-color', localStorage.getItem('_whiteSquares'));
    $('#board .black-3c85d').css('background-color', localStorage.getItem('_blackSquares'));
  });

  // Save the color and set it for chessboard
  $('#saveColorsBtn').click(function() {
    localStorage.removeItem("_whiteSquares");
    localStorage.removeItem("_blackSquares");
    localStorage.setItem('_whiteSquares', $("#whSq").spectrum('get').toHexString());
    localStorage.setItem('_blackSquares', $("#blSq").spectrum('get').toHexString());
    $('#board .white-1e1d7').css('background-color', localStorage.getItem('_whiteSquares'));
    $('#board .black-3c85d').css('background-color', localStorage.getItem('_blackSquares'));
  });

  // Reset chessboard color to default
  $('#resetColorsBtn').click(function() {
    localStorage.removeItem("_whiteSquares");
    localStorage.removeItem("_blackSquares");
    $('#board .white-1e1d7').css('background-color', '#f0d9b5');
    $('#board .black-3c85d').css('background-color', '#b58863');
  });

  // If localStorage theme is dark, set the theme
  if (theme == "dark") {
    $('link[href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"]').attr('href', 'https://maxcdn.bootstrapcdn.com/bootswatch/4.0.0-beta.2/slate/bootstrap.min.css');
    $('body').css('background', '#464545');
    $('button').css('border', '1px solid white');
    $('#msgInput').css('background', '#817e7e');
  }

  // If localStorage theme is default, set the theme
  if (theme == "default") {
    $('link[href="https://bootswatch.com/darkly/bootstrap.min.css"]').attr('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
    $('body').css('background', '#f2f2f2');
	$('button').css('border', '');
    $('#msgInput').css('background', '#fff');
  }

  // Set default theme
  $('#defaultThemeBtn').click(function() {
    $('link[href="https://bootswatch.com/darkly/bootstrap.min.css"]').attr('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
    $('body').css('background', '#f2f2f2');
	$('button').css('border', '');
    $('#msgInput').css('background', '#fff');
    localStorage.setItem('_theme', 'default');
  });

  // Set dark theme
  $('#darkThemeBtn').click(function() {
    $('link[href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"]').attr('href', 'https://maxcdn.bootstrapcdn.com/bootswatch/4.0.0-beta.2/slate/bootstrap.min.css');
    $('body').css('background', '#464545');
	$('button').css('border', '1px solid white');
    $('#msgInput').css('background', '#817e7e');
    localStorage.setItem('_theme', 'dark');
  });

  // Prevent user from leaving directly
  $(window).bind('beforeunload', function() {
    return 'There is a game in progress! Are you sure?';
  });

  // chat code
  $('form').submit(function() {
    socket.emit('chat message', $('#msgInput').val(), username);
    $('#msgInput').val('');
    return false;
  });
  // disable chatBtn if empty input
  $('.chatBtn').prop('disabled', true);
  $('#msgInput').keyup(function() {
    $('.chatBtn').prop('disabled', this.value == "" ? true : false);
  });
  // send messages by appending new li working as message
  socket.on('chat message', function(msg) {
    $('#messages').prepend($('<li class="chat-li">').text(msg.username).append($('<li>').text(msg.message)));
  });

  // Whenever the server emits 'player joined', show it to the other player
  socket.on('player joined', function(data) {
    $('#playerJoin').show().delay(2000).fadeOut();
  });
  
  // Whenever the server emits 'player disconnected', show it to the other player
  socket.on('player disconnected', function(data) {
    $('#playerDisc').show().delay(3000).fadeOut();
  });

  var board,
    game = new Chess(),
    statusEl = $('#status');

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  // only allow white to move white(s) and vice versa
  var onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
      (game.turn() !== playerColor[0])) {
      return false;
    }
  };

  var onDrop = function(source, target) {
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    socket.emit('move', move);
	$('#takeBackBtn').prop('disabled', false);

    // illegal move
    if (move === null) return 'snapback';

    updateStatus();
  };

  var onMouseoverSquare = function(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;
  };

  socket.on('move', function(mov) {
    game.move(mov);
    board.position(game.fen());
    updateStatus();
  });
  
	var und = game.undo();
	var res = game.reset();
	
	$('#takeBackBtn').click(function() {
	socket.emit('undo', und);
	// $(this).prop('disabled', true);
	});
	
	$('#resetBtn').click(function() {
	socket.emit('reset', res);
	});
  
  socket.on('undo', function() {
	game.undo();
	board.position(game.fen());
	updateStatus();
  });
  
  socket.on('reset', function() {
	game.reset();
	board.position(game.fen());
	updateStatus();
  });
  
  // update the board position after the piece snap 
  // for castling, en passant, pawn promotion
  var onSnapEnd = function() {
    board.position(game.fen());
  };

  var updateStatus = function() {
    var status = '';

    var moveColor = 'White';
    if (game.turn() === 'b') {
      moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate() === true) {
      status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (game.in_draw() === true) {
      status = 'Game over, drawn position';
    }

    // game still on
    else {
      status = moveColor + ' to move';

      // check?
      if (game.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
        $('#checkAlert').text('Check on ' + moveColor.toLowerCase() + ' king!').show();
      }
      // no check?
      else {
        $('#checkAlert').fadeOut();
      }
    }

    statusEl.html(status);
  };

  var cfg = {
    draggable: true,
    position: 'start',
    orientation: playerColor,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };
  board = ChessBoard('board', cfg);

  updateStatus();

});