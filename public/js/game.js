$(document).ready(function() {

  var socket = window.io.connect({
    transports: ['websocket']
  });

  // chat code
  $('form').submit(function() {
    socket.emit('chat message', $('#msgInput').val());
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
    $('#messages').append($('<li>').text(msg));
  });

  var board,
    game = new Chess(),
    statusEl = $('#status');

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  var onDragStart = function(source, piece, position, orientation) {
    if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
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

    // illegal move
    if (move === null) return 'snapback';

    updateStatus();
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
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  };
  board = ChessBoard('board', cfg);

  updateStatus();

  $('#flipOrientationBtn').on('click', board.flip);

});