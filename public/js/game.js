$(document).ready(function() {

  var socket = window.io.connect({
    transports: ['websocket']
  });

  var playerColor = localStorage.getItem('_chosenColor');
  var username = localStorage.getItem('_username');

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

  var board,
    game = new Chess(),
    statusEl = $('#status');

  var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
  };

  var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
      background = '#696969';
    }

    squareEl.css('background', background);
  };

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
    removeGreySquares();
    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    socket.emit('move', move);

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

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  };

  var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
  };

  socket.on('move', function(mov) {
    game.move(mov);
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
    onMouseoutSquare: onMouseoutSquare,
    onSnapEnd: onSnapEnd
  };
  board = ChessBoard('board', cfg);

  updateStatus();

  $('#enableHighlightBtn').click(function() {
    cfg.onMouseoverSquare = onMouseoverSquare;
    $("#disableHighlightBtn").removeClass("active");
    $(this).addClass("active");
  });

  $('#disableHighlightBtn').click(function() {
    delete cfg.onMouseoverSquare;
    $("#enableHighlightBtn").removeClass("active");
    $(this).addClass("active");
  });

});