$(function() {
	window.mines = 10;
	window.clearedSquares = 0;
	showMinesLeft();
	createGameboard();
	placeBombs();
	$('.square').click( function () {
    	row = $(this).attr("id").split("_")[0].replace('row','');
    	col = $(this).attr("id").split("_")[1].replace('col','');
    	console.log('row: '+row+' col:'+col);
    	console.log(window.minefield[row][col].hasMine);
    	checkForMine(parseInt(row), parseInt(col));
    	updateStats();
	});
});

function checkForMine(row, col) {
	if (row < 0 || row >= window.boardY || col < 0 || col >= window.boardX) {
		//invalid row/col
		return;
	} 
	//hit a bomb
	if (window.minefield[row][col].hasMine) {
		$('#row'+row.toString()+'_col'+col.toString()).html('X');	
		return;
	} else {
		$('#row'+row.toString()+'_col'+col.toString()).css('background-color', 'red')
		window.clearedSquares++;
		minefield[row][col].isClicked = true;
		console.log("checking "+row+" "+col);
	}

	 else if (window.clearedSquares == (window.boardX*window.boardY) ) {
		alert('you win!');
	} else {
	 else 	
		bombsNear = 0;
		console.log("row: "+row+", col: "+col)
		//count bombs in row above
		if (row > 0 && col > 0 && window.minefield[row-1][col-1].hasMine) { bombsNear++; }
		if (row > 0 && window.minefield[row-1][col].hasMine) { bombsNear++; }
		if (row > 0 && col < window.boardX &&  window.minefield[row-1][col+1].hasMine) { bombsNear++; }

		if (col > 0 && window.minefield[row][col-1].hasMine) { bombsNear++; }
		if (col < window.boardX && window.minefield[row][col+1].hasMine) { bombsNear++; }

		if (row < window.boardY && col > 0 && window.minefield[row+1][col-1].hasMine) { bombsNear++; }
		if (row < window.boardY && window.minefield[row+1][col].hasMine) { bombsNear++; }
		if (row < window.boardY && col < window.boardX && window.minefield[row+1][col+1].hasMine) { bombsNear++; }
		
		if (bombsNear == 0) {
			$('#row'+row.toString()+'_col'+col.toString()).css('background-color', 'black')
			checkForMine(row-1, col-1);
			checkForMine(row-1, col);
			checkForMine(row-1, col+1);

			checkForMine(row, col-1);
			checkForMine(row, col+1);

			checkForMine(row+1, col-1);
			checkForMine(row+1, col);
			checkForMine(row+1, col+1);

		} else {
			$('#row'+row.toString()+'_col'+col.toString()).html(bombsNear);	
		}
    }
}
function updateMines() {
	$($('#numMines')).html(window.mines.toString());
}
function updateStats() {
	$($('#stats')).html(window.mines.toString());
}
function showMinesLeft() {
	$('#gameboard').append('<div class="mines"><p>Mines Left:<span id="numMines">'+window.mines.toString()+'</span></p>');
}

function Square() {
	this.hasMine = false;
	this.isClicked = false;
}

function placeBombs(minefield) {
	bombsLeft = window.mines;
	locations = new Array(bombsLeft);
	console.log('placing '+bombsLeft+' Bombs');
	while ( bombsLeft ) {
		x = Math.floor((Math.random()*window.boardX));
		y = Math.floor((Math.random()*window.boardY));

		if (window.minefield[x][y].hasMine != true) {
			locations[window.mines - bombsLeft] = [x,y];
			window.minefield[x][y].hasMine = true;
			bombsLeft--;
		}
	}
	for (var l=0; l <locations.length; l++) {	
		console.log('placed bombs here: '+locations[l]);
	}
}
function createGameboard() {
	//create 8x8 array each holding square object
	window.boardX=8;
	window.boardY=8;

	window.minefield = new Array(window.boardY);
	for (var cnt=0; cnt < window.boardY; cnt++) {
		$('#gameboard').append('<tr></tr>');
		minefield[cnt] = new Array(window.boardX);
		for (var hcnt=0;hcnt < window.boardX; hcnt++) {
			$('#gameboard tr:nth-child('+(cnt+1)+')').append('<td id="row'+cnt.toString()+'_col'+hcnt.toString()+'" class="square"></td>');
			window.minefield[cnt][hcnt] = new Square();
		}
	}
}
function validateBoard() {
	if (window.clearedSquares+window.mines != window.boardX*window.boardY) {
		alert('keep going....');
		return;
	}
	for (var cnt=0; cnt <window.boardY; cnt++) {
		for (var hcnt=0;hcnt < window.boardX; hcnt++) {
			if (window.minefield[cnt][hnt].isClicked == false) {
				if (window.minefield[cnt][hcnt].hasMine == false) {
					reveal();
					showLoss();
				}

			}
		}
	}
	showWin();
}
function reveal() {
	for (var cnt=0; cnt <window.boardY; cnt++) {
		for (var hcnt=0;hcnt < window.boardX; hcnt++) {
			if (window.minefield[cnt][hcnt].hasMine) {

			}
		}
	}
}
function showLoss() {
	$( "#dialog-youlose" ).dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Yes!": function() {
          location.reload();
        },
        "No thanks.": function() {
          $( this ).dialog( "close" );
        }
      }
    });
}
function showWin() {
	$( "#dialog-youwin" ).dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Yes!": function() {
          location.reload();
        },
        "No thanks.": function() {
          $( this ).dialog( "close" );
        }
      }
    });
}
//var sq = new square();
/*
fruits
["apple", "orange", "banana"]
fruits[1];
"orange"
fruits[1] = ["clementine", "florida", "navel"];
["clementine", "florida", "navel"]
fruits
["apple", 
Array[3]
, "banana"]
fruits[1][1]
"florida"
*/