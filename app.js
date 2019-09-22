/*jshint esversion: 6 */
let player_move = 'X';
let pc_move = 'O';
let won = 0,
	draw = 0,
	lost = 0;

let board = $('.cell');

let win = [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ], [ 0, 4, 8 ], [ 2, 4, 6 ] ];
let game = 0;
let dif = '';
startGame();

$('#restartButton').click(function() {
	game = 0;
	won = 0;
	lost = 0;
	draw = 0;
	startGame();
});
function hud() {
	$('.score').html('Win: ' + won + ' Lost: ' + lost + ' Draw: ' + draw);
}
$('#next').click(function() {
	startGame();
});

function startGame() {
	$('#next').css('display', 'none');
	hud();
	dif = $('select').val();
	for (let i = 0; i < board.length; i++) {
		board[i].innerHTML = '';
		board[i].addEventListener('click', turnClick, false);
		board[i].style.background = '';
	}
	if (game % 2 != 0) {
		board[Math.floor(Math.random() * 9)].innerHTML = pc_move;
	}
	game++;
}
$('select').click(function() {
	if (dif != $('select').val()) {
		game = 0;
		won = 0;
		lost = 0;
		draw = 0;
		startGame();
	}
});
function removeEL() {
	for (let i = 0; i < board.length; i++) {
		board[i].removeEventListener('click', turnClick);
	}
}

function turnClick(e) {
	turnPlayer(e.target.id);
}

function turnPlayer(id) {
	if ($('#' + id).html().length === 0) {
		$('#' + id).html(player_move);
		if (!checkWin()) turnPc();
	}
}

function turnPc() {
	let functocall = minimax;
	if (dif != 'minimax') functocall = normal;
	let mx = -100,
		mxi = -1;
	for (let i = 0; i < board.length; i++) {
		if (board[i].innerHTML === '') {
			board[i].innerHTML = pc_move;
			let temp = functocall(board, player_move);
			if (mx < temp) {
				mx = temp;
				mxi = i;
			}
			board[i].innerHTML = '';
		}
	}
	if (mxi >= 0) board[mxi].innerHTML = pc_move;
	checkWin();
}

function checkWin() {
	for (let i = 0; i < win.length; i++) {
		if (
			board[win[i][0]].innerHTML === board[win[i][1]].innerHTML &&
			board[win[i][0]].innerHTML === board[win[i][2]].innerHTML &&
			board[win[i][2]].innerHTML != ''
		) {
			if (board[win[i][0]].innerHTML === player_move) {
				board[win[i][0]].style.background = 'green';
				board[win[i][1]].style.background = 'green';
				board[win[i][2]].style.background = 'green';
				won++;
			} else {
				board[win[i][0]].style.background = 'red';
				board[win[i][1]].style.background = 'red';
				board[win[i][2]].style.background = 'red';
				lost++;
			}
			setTimeout(function() {
				$('#next').css('display', 'block');
			}, 700);
			removeEL();
			hud();
			return true;
		}
	}
	for (let i = 0; i < board.length; i++) {
		if (board[i].innerHTML === '') return false;
	}
	for (let i = 0; i < board.length; i++) {
		board[i].style.background = 'gray';
	}
	draw++;
	setTimeout(function() {
		$('#next').css('display', 'block');
	}, 700);
	hud();
	removeEL();
	return true;
}
function check(board) {
	for (let i = 0; i < win.length; i++) {
		if (
			board[win[i][0]].innerHTML === board[win[i][1]].innerHTML &&
			board[win[i][0]].innerHTML === board[win[i][2]].innerHTML &&
			board[win[i][2]].innerHTML != ''
		) {
			if (board[win[i][0]].innerHTML === player_move) {
				return 1;
			} else {
				return 2;
			}
		}
	}
	for (let i = 0; i < board.length; i++) {
		if (board[i].innerHTML === '') return 0;
	}
	return 3;
}

function minimax(board, player) {
	let newPlayer = '';
	if (player === player_move) newPlayer = pc_move;
	else newPlayer = player_move;
	let st = check(board);
	if (st === 1) return -10;
	else if (st === 2) return 10;
	else if (st === 3) return 0;
	let mx = -100;
	let mn = 100;
	for (let i = 0; i < board.length; i++) {
		if (board[i].innerHTML === '') {
			board[i].innerHTML = player;
			let temp = minimax(board, newPlayer);
			mx = Math.max(mx, temp);
			mn = Math.min(mn, temp);
			board[i].innerHTML = '';
			if (player === player_move && mn === -10) return -10;
			if (player === pc_move && mx === 10) return 10;
		}
	}
	if (player == player_move) return mn;
	else return mx;
}

function normal(board, player) {
	let i = Math.floor(Math.random() * 100);
	if (i < 6 && player === player_move) {
		return -10;
	}
	let newPlayer = '';
	if (player === player_move) newPlayer = pc_move;
	else newPlayer = player_move;
	let st = check(board);
	if (st === 1) return -10;
	else if (st === 2) return 10;
	else if (st === 3) return 0;
	let mx = -100;
	let mn = 100;
	for (let i = 0; i < board.length; i++) {
		if (board[i].innerHTML === '') {
			board[i].innerHTML = player;
			let temp = normal(board, newPlayer);
			mx = Math.max(mx, temp);
			mn = Math.min(mn, temp);
			board[i].innerHTML = '';
			if (player === player_move && mn === -10) return -10;
			if (player === pc_move && mx === 10) return 10;
		}
	}
	if (player == player_move) return mn;
	else return mx;
}
