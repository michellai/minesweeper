$(function() {
	window.mines = 10;
	window.clearedSquares = 0;
	window.gameInPlay = true;
	window.flags = new Array();
	window.bombHtml = '<i class="fa fa-dot-circle-o"></i>';
	
	$('body').disableTextSelect();
	createGameboard();
	placeBombs();
	for(var cnt=0; cnt < window.locations.length; cnt++) {
		countNeighborMines(window.locations[cnt][0], window.locations[cnt][1]);
	}

	$('.square').dblclick( function (event) {
		row = $(this).parent().index();
	    col = $(this).index();
	    if (window.minefield[row][col].isClicked &&
	    	window.minefield[row][col].neighborMines == window.minefield[row][col].neighborFlags) {
	    	
			for (var offsetRow = -1; offsetRow < 2; offsetRow++) {
				for (var offsetCol = -1; offsetCol < 2; offsetCol++) {
					if (inBounds(row, offsetRow, col, offsetCol) &&
						!window.minefield[row+offsetRow][col+offsetCol].isClicked &&
						!window.minefield[row+offsetRow][col+offsetCol].isFlag) {
							console.log('row: '+(row+offsetRow)+' col: '+(col+offsetRow));
							clickSquare(row+offsetRow, col+offsetCol);
					}
				}
			}
		}
	});
	$(document).bind("contextmenu",function(e){
		if (window.gameInPlay) {
	        e.preventDefault();
	        
	        //check stuff
	        row = $(e.target).parent().index();
	    	col = $(e.target).index();
	    	if ($(e.target).html() == window.bombHtml) {
	    		$(e.target).html('');
	    		window.minefield[row][col].isFlag = false;
	    		window.clearedSquares--;
    			console.log('clearedSquares: '+window.clearedSquares+'minesMarked: ');
    			updateNeighborFlags(row, col, -1);
	    		window.mines++;
	        	updateMines();

	    	} else if (!window.minefield[row][col].isClicked) {
	        	$(e.target).html(window.bombHtml);
	        	window.minefield[row][col].isFlag = true;
	        	window.flags.push([row, col]);
	        	window.clearedSquares++;
        		console.log('clearedSquares: '+window.clearedSquares+'minesMarked: ');
        		updateNeighborFlags(row, col, 1);
	        	window.mines--;
	        	updateMines();
	        	if (window.clearedSquares == (window.boardX*window.boardY) ) {
					alert('you win!');
				}
	        }
		}
    });
	$('.square').click( function (event) {
		if (window.gameInPlay) {
	    	clickSquare($(this).parent().index(), $(this).index());
	    }
	});
	
});

function updateNeighborFlags(row, col, amount) {
	for (var offsetRow = -1; offsetRow < 2; offsetRow++) {
		for (var offsetCol = -1; offsetCol < 2; offsetCol++) {
			if (inBounds(row, offsetRow, col, offsetCol)) {
				var square = window.minefield[row+offsetRow][col+offsetCol]
				if (square.neighborFlags == -1) {
					window.minefield[row+offsetRow][col+offsetCol].neighborFlags = 1;
				} else if(square.neighborFlags == 1 &&
						  amount < 0 ) {
					window.minefield[row+offsetRow][col+offsetCol].neighborFlags = -1;
				} else
				{
					window.minefield[row+offsetRow][col+offsetCol].neighborFlags+=amount;
				}
			}
		}
	}
}

function countNeighborMines(row, col) {
	
	for (var offsetRow = -1; offsetRow < 2; offsetRow++) {
		for (var offsetCol = -1; offsetCol < 2; offsetCol++) {
			if (inBounds(row, offsetRow, col, offsetCol) &&
				window.minefield[row+offsetRow][col+offsetCol].hasMine) {
					window.minefield[row+offsetRow][col+offsetCol].neighborMines++;
			}
			
		}
	}
}
function Square() {
	this.hasMine = false;
	this.isClicked = false;
	this.isFlag = false;
	this.neighborFlags = -1;
	this.neighborMines;
}

function clickSquare(row, col) {
	
	//invalid row/col [0-7]
	if (row < 0 || row > window.boardY-1 || col < 0 || col > window.boardX-1) { return; }

	//nothing to do for square already clicked
	if (window.minefield[row][col].isClicked) { return; } 

	//if space is marked as flag, unmark as flag
	if (window.minefield[row][col].isFlag) {
			window.minefield[row][col].isFlag = false;
    		window.mines++;
        	updateMines();
	}

	//hit a bomb
	if (window.minefield[row][col].hasMine) {
		reveal();
		window.gameInPlay = false;
		$('#reset').html('<i class="fa fa-frown-o fa-2x"></i>');
		return;
	} 
	window.clearedSquares++;
	console.log('clearedSquares: '+window.clearedSquares+'minesMarked: ');
	if (window.clearedSquares == (window.boardX*window.boardY) ) {
		alert('you win!');
	} else {
		$('#gameboard tr:nth-child('+(row+1)+') td:nth-child('+(col+1)+')').css('background-color', 'red')
		
		window.minefield[row][col].isClicked = true;
		bombsNear = 0;
		console.log("row: "+row+", col: "+col)
		//count bombs in row above
		for (var offsetRow = -1; offsetRow < 2; offsetRow++) {
			for (var offsetCol = -1; offsetCol < 2; offsetCol++) {
				if (inBounds(row, offsetRow, col, offsetCol)) {
					console.log('row: '+(row+offsetRow)+' col: '+ (col+offsetCol));
					if (window.minefield[row+offsetRow][col+offsetCol].hasMine) {
						bombsNear++;
					}
				}

			}
		}
				
		if (bombsNear == 0) {
			$('#gameboard tr:nth-child('+(row+1)+') td:nth-child('+(col+1)+')').css('background-color', 'black');
			for (var offsetRow = -1; offsetRow < 2; offsetRow++) {
				for (var offsetCol = -1; offsetCol < 2; offsetCol++) {
					clickSquare(row+offsetRow, col+offsetCol);
				}
			}
		} else {
			$('#gameboard tr:nth-child('+(row+1)+') td:nth-child('+(col+1)+')').html(bombsNear);
			window.minefield[row][col].neighborMines = bombsNear;
		}
    }
}
function inBounds(row, offsetRow, col, offsetCol) {
	if (row+offsetRow >= 0 && row+offsetRow < window.boardY &&
		col+offsetCol >= 0 && col+offsetCol < window.boardX) {
		return true;
	}
	return false;
}

function updateMines() {
	$($('#numMines')).html(window.mines.toString());
}

function placeBombs(minefield) {
	bombsLeft = window.mines;
	window.locations = new Array(bombsLeft);
	console.log('placing '+bombsLeft+' Bombs');
	while ( bombsLeft ) {
		x = Math.floor((Math.random()*window.boardX));
		y = Math.floor((Math.random()*window.boardY));

		if (window.minefield[x][y].hasMine != true) {
			window.locations[window.mines - bombsLeft] = [x,y];
			window.minefield[x][y].hasMine = true;
			bombsLeft--;
		}
	}
	for (var l=0; l <locations.length; l++) {	
		console.log('placed bombs here: '+window.locations[l]);
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

function reveal() {
	for (var cnt=0; cnt < window.locations.length; cnt++) {
		console.log("revealing: ", window.locations[cnt]);
		$('tr:nth-child('+(window.locations[cnt][0]+1)+') td:nth-child('+(window.locations[cnt][1]+1)+')').html(window.bombHtml);
	}
	for (var cnt=0; cnt < window.flags.length; cnt++) {
		if (window.locations.indexOf(window.flags[cnt]) == -1) {
			$('#gameboard tr:nth-child('+(window.flags[cnt][0]+1)+') td:nth-child('+(window.flags[cnt][1]+1)+')').css('font-color', 'red');

		}
	}
}

jQuery.fn.disableTextSelect = function() {
	return this.each(function() {
		$(this).css({
			'MozUserSelect':'none',
			'webkitUserSelect':'none'
		}).attr('unselectable','on').bind('selectstart', function() {
			return false;
		});
	});
};