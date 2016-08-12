import { DIRECTIONS, STATUS } from "./constants"
import dictionary from "an-array-of-english-words";

function getAdjacentCells(row, col, boardCells) {
    const rowLimit = boardCells.length;
    const colLimit = boardCells[0].length;
    const adjacentCells = [{
        row: row - 1,
        col: col
    }, {
        row: row + 1,
        col: col
    }, {
        row: row,
        col: col - 1
    }, {
        row: row,
        col: col + 1
    }].map((cell) => {
        if (cell.row  < 0 || cell.row > rowLimit - 1 ||
        cell.col < 0 || cell.col > colLimit - 1) {
            return STATUS.NONEXISTENT;
        }
        return boardCells[cell.row][cell.col];
    });
    return {
        up: adjacentCells[0],
        down: adjacentCells[1],
        left: adjacentCells[2],
        right: adjacentCells[3]
    };
}

function getOppositeDirection(direction) {
    let oppositeDirection;
    
    switch(direction) {
        case DIRECTIONS.UP:
            oppositeDirection = DIRECTIONS.DOWN;
            break;
        case DIRECTIONS.DOWN:
            oppositeDirection = DIRECTIONS.UP;
            break;
        case DIRECTIONS.LEFT: 
            oppositeDirection = DIRECTIONS.RIGHT;
            break;
        case DIRECTIONS.RIGHT:
            oppositeDirection = DIRECTIONS.LEFT;
            break;
        default: throw new Error("Illegal direction value")
    }
    return oppositeDirection;
}

function getDeltas(direction) {
    let rowDelta;
    let colDelta;
    
    switch(direction) {
        case DIRECTIONS.UP:
            rowDelta = -1;
            colDelta = 0;
            break;
        case DIRECTIONS.DOWN:
            rowDelta = 1;
            colDelta = 0;
            break;
        case DIRECTIONS.LEFT:
            rowDelta = 0;
            colDelta = -1;
            break;
        case DIRECTIONS.RIGHT:
            rowDelta = 0;
            colDelta = 1;
            break;
        default: throw new Error("Delta can't be calculated");
    }
    
    return { rowDelta, colDelta };
}

function getListOfAdjacentOccupiedCellDirections(adjacentCells) {
    let occupiedCellDirections = [];
    for (const direction in adjacentCells) {
        if (adjacentCells[direction] !== STATUS.NONEXISTENT) {
            if (adjacentCells[direction].length) {
                occupiedCellDirections.push(direction);
            }
        }        
    }
    return occupiedCellDirections;
}

function retrieveLettersUsed(letters) {
    const presentLettersIgnoringDuplicates = letters.split("").reduce((prev, letter) => {
        if (prev.indexOf(letter) >= 0) {
            return prev;
        }
        prev += letter;
        return prev;
    }, "");
    return presentLettersIgnoringDuplicates;
}

function acquireLetterFrequencies(letters) {
    const result = new Array(15);
    for (let i = 0; i < result.length; i++) {
        result[i] = [];
    }
    const lettersUsedIgnoringDuplicates = retrieveLettersUsed(letters);
    for (const letter of lettersUsedIgnoringDuplicates) {
        let occurrences = 0;
        let index = 0;
        while (index >= 0) {
            index = (occurrences === 0 ? letters.indexOf(letter): 
            letters.indexOf(letter, index + 1)); 
            if (index >= 0) {
                occurrences++;
            }
        }
        result[occurrences].push(letter);
    }
    return result.reduce((prev, curr, i) => {
        if (!curr.length) {
            return prev;
        }
        for (const sym of curr) {
            prev.push({letter: sym, frequency: i});    
        }
        return prev;
    }, []);
}

function canWordBeCreatedUsingAvailableLetters(word, availableLetters) {
    const wordsLetterInfo = acquireLetterFrequencies(word);
    const letterPoolInfo = acquireLetterFrequencies(availableLetters);
    return wordsLetterInfo.every((infoItem) => {
        const correspondingLetterPoolItem = letterPoolInfo
                                            .filter((poolItem) => poolItem.letter === infoItem.letter);
        return infoItem.frequency <= correspondingLetterPoolItem[0].frequency;
    });
}

function getWordsStartingWithLetter(fixedLetter, optionalLetters, maxWordLength) {
    const regex = new RegExp(`^${fixedLetter}[${optionalLetters}]+$`, 'g');
    return dictionary.filter((w) => {
        return w.match(regex) && w.length <= maxWordLength;
    });     
}

function getWordsEndingWithLetter(fixedLetter, optionalLetters, maxWordLength) {
    const regex = new RegExp(`^[${optionalLetters}]+${fixedLetter}$`, 'g');
    return dictionary.filter((w) => {
        return w.match(regex) && w.length <= maxWordLength;
    });  
}

function getIndicesWhereTilesWillBePlaced(indices, wordLength) {
    return indices.slice(0, wordLength - 1);
}

function addTileNameToIndicesWhenDirectionIsUpOrLeft(indices, word) {
    const letters = word.slice(0, -1);
    indices.reverse();
    return indices.map((curr, i) => {
        curr.name = letters[i];
        return curr;   
    });
}

function addTileNameToIndicesWhenDirectionIsDownOrRight(indices, word) {
    const letters = word.slice(1);
    return indices.map((curr, i) => {
        curr.name = letters[i];
        return curr;    
    });
}

function addTileIdsToIndices(indices, tiles) {
    const usedTiles = [];
    return indices.map((currIndices) => {
        const unusedTilesWithNameMatchingIndices = tiles.filter((tile) => {
            return tile.name === currIndices.name &&
            usedTiles.indexOf(tile) < 0;     
        });
        const firstUnusedTile = unusedTilesWithNameMatchingIndices[0]; 
        currIndices.id = firstUnusedTile.id;
        usedTiles.push(firstUnusedTile);
        
        return currIndices;
    });
}

function boardSolution(boardCells, tiles) {
    for (let rowIndex = 0; rowIndex < boardCells.length; rowIndex++) {
        for (let colIndex = 0; colIndex < boardCells[rowIndex].length; colIndex++) {
            if (boardCells[rowIndex][colIndex].length) {
                for (const direction in DIRECTIONS) {
                    const { rowDelta, colDelta } = getDeltas(DIRECTIONS[direction]);
                    let row = rowIndex;
                    let col = colIndex;
                    const listOfIndicesOfTilesInDirection = [];
                    while(row >= 0 && row <= 14 && col >=0 && col <= 14) {
                        const cellContents = boardCells[row][col];
                        if (cellContents.length && !(row === rowIndex && col === colIndex)) {
                            break;
                        }
                        listOfIndicesOfTilesInDirection.push({row: row, col: col});
                        row += rowDelta;
                        col += colDelta;
                    }
                    
                    const oppositeDirection = getOppositeDirection(DIRECTIONS[direction]);
                    const cellsAdjacentToInitialPosition = getAdjacentCells(rowIndex, colIndex, boardCells);
                    
                    if (cellsAdjacentToInitialPosition[oppositeDirection] !== STATUS.NONEXISTENT) {
                        if (cellsAdjacentToInitialPosition[oppositeDirection].length) {
                            continue;
                        }
                    }
                    listOfIndicesOfTilesInDirection.shift();
                    if (listOfIndicesOfTilesInDirection.length === 0) {
                        continue;
                    }
                    
                    let freeSpaces = 0;
                    for (let i = 0; i < listOfIndicesOfTilesInDirection.length; i++) {
                        const location = listOfIndicesOfTilesInDirection[i];
                        const adjacentCells = getAdjacentCells(location.row, location.col, boardCells);
                        const occupiedAdjacentCellsCount = getListOfAdjacentOccupiedCellDirections(adjacentCells).length;
                        
                        if (i === 0) {
                            if (occupiedAdjacentCellsCount !== 1) {
                                break;
                            }
                            freeSpaces++;
                        }   
                        else if (i > 0) {
                            if (occupiedAdjacentCellsCount > 0) {
                                break;
                            }
                            freeSpaces++;
                        }
                    }
                    
                    let wordListWhenIgnoringTileQuantities;
                    const lettersFromHand = tiles.map((tile) => tile.name.toLowerCase()).join("");
                    if (DIRECTIONS[direction] === DIRECTIONS.DOWN ||
                    DIRECTIONS[direction] === DIRECTIONS.RIGHT) {
                        wordListWhenIgnoringTileQuantities = getWordsStartingWithLetter(boardCells[rowIndex][colIndex], lettersFromHand, freeSpaces + 1 );
                    }
                    else if (DIRECTIONS[direction] === DIRECTIONS.UP ||
                    DIRECTIONS[direction] === DIRECTIONS.LEFT) {
                        wordListWhenIgnoringTileQuantities = getWordsEndingWithLetter(boardCells[rowIndex][colIndex], lettersFromHand, freeSpaces + 1 );    
                    }
                    
                    if (wordListWhenIgnoringTileQuantities.length) {
                        const makeableWords = wordListWhenIgnoringTileQuantities
                                              .filter((w) => canWordBeCreatedUsingAvailableLetters(w, lettersFromHand + boardCells[rowIndex][colIndex]));
                        if (makeableWords.length) {
                            const word = makeableWords[Math.floor(Math.random() * makeableWords.length)];
                            const indices = getIndicesWhereTilesWillBePlaced(listOfIndicesOfTilesInDirection, word.length);
                            
                            if (DIRECTIONS[direction] === DIRECTIONS.DOWN ||
                            DIRECTIONS[direction] === DIRECTIONS.RIGHT) {
                                addTileNameToIndicesWhenDirectionIsDownOrRight(indices, word);
                            }
                            else if (DIRECTIONS[direction] === DIRECTIONS.UP ||
                            DIRECTIONS[direction] === DIRECTIONS.LEFT) {
                                addTileNameToIndicesWhenDirectionIsUpOrLeft(indices, word);
                            }
                            
                            const indicesWithTileIds = addTileIdsToIndices(indices, tiles);
                            return indicesWithTileIds;
                        }
                    }
                }      
            }
        }
    }
    return null;
}
const handTiles = [{name: "a", id: 1}, {name: "c", id: 2}, {name: "t", id: 3},
{name: "e", id: 4}, {name: "i", id: 5}, {name: "o", id: 6}, {name: "b", id: 7}];
const cells = [["","","","","","","","","","","","","","",""],
["","","","","","","","","","","","","m","",""],
["","","","","","","","","","","","","u","",""],
["","","","","","","","","","","","","s","",""],
["","","","","","","","","","","","","c","",""], 
["","","","","","","","","","","","","l","",""], 
["","","","","","","","","","","","","e","",""], 
["","","","","","","","","","","","","","",""], 
["","","","","","","","","","","","","","",""], 
["","","","","","","","","","","","","","",""], 
["","","","","","","","","","","","","","",""], 
["","","","","","","","","","","","","","",""], 
["","","","","","","","","","","","","","",""],
["","","","","","","","","","","","","","",""],
["","","","","","","","","","","","","","",""]];
boardSolution(cells, handTiles);
export default boardSolution;
