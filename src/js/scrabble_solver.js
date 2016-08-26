import { Directions, Status } from "./constants"
import dictionary from "an-array-of-english-words";

const cache = (function() {
    const items = {};
    
    return {
        get(key) {
            if (typeof items[key] === "undefined") {
                return undefined;
            }
            return items[key];
        },
        add(key, value) {
            if (typeof items[key] === "undefined") {
                items[key] = value;
            }   
        }
    };
})();

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
            return Status.NONEXISTENT;
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
        case Directions.UP:
            oppositeDirection = Directions.DOWN;
            break;
        case Directions.DOWN:
            oppositeDirection = Directions.UP;
            break;
        case Directions.LEFT: 
            oppositeDirection = Directions.RIGHT;
            break;
        case Directions.RIGHT:
            oppositeDirection = Directions.LEFT;
            break;
        default: throw new Error("Illegal direction value");
    }
    return oppositeDirection;
}

function getDeltas(direction) {
    let rowDelta;
    let colDelta;
    
    switch(direction) {
        case Directions.UP:
            rowDelta = -1;
            colDelta = 0;
            break;
        case Directions.DOWN:
            rowDelta = 1;
            colDelta = 0;
            break;
        case Directions.LEFT:
            rowDelta = 0;
            colDelta = -1;
            break;
        case Directions.RIGHT:
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
        if (adjacentCells[direction] !== Status.NONEXISTENT) {
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
    let words;
    
    if (!cache.get(fixedLetter)) {
        const wordsStartingWithLetter = dictionary.filter((word) => {
            return word.charAt(0).toLowerCase() === fixedLetter.toLowerCase();
        });
        const wordsEndingWithLetter = dictionary.filter((word) => {
            return word.charAt(word.length - 1).toLowerCase() === fixedLetter.toLowerCase();
        });
        cache.add(fixedLetter, {
           wordsStartingWithKey: wordsStartingWithLetter,
           wordsEndingWithKey: wordsEndingWithLetter
        });
    }
    words = cache.get(fixedLetter).wordsStartingWithKey;
    
    return words.filter((w) => {
        return w.match(regex) && w.length <= maxWordLength;
    });     
}

function getWordsEndingWithLetter(fixedLetter, optionalLetters, maxWordLength) {
    const regex = new RegExp(`^[${optionalLetters}]+${fixedLetter}$`, 'g');
    let words;
    
    if (!cache.get(fixedLetter)) {
        const wordsStartingWithLetter = dictionary.filter((word) => {
            return word.charAt(0).toLowerCase() === fixedLetter.toLowerCase();
        });
        const wordsEndingWithLetter = dictionary.filter((word) => {
            return word.charAt(word.length - 1).toLowerCase() === fixedLetter.toLowerCase();
        });
        cache.add(fixedLetter, {
           wordsStartingWithKey: wordsStartingWithLetter,
           wordsEndingWithKey: wordsEndingWithLetter
        });
    }
    words = cache.get(fixedLetter).wordsEndingWithKey;
    
    return words.filter((w) => {
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

function findFreeSpaceCount(indices, boardCells) {
    let freeSpaces = 0;
        for (let i = 0; i < indices.length; i++) {
            const location = indices[i];
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
    return freeSpaces;
}

function findWordsPossibleToMakeIfOnlyTileNamesAreConsidered(params) {
    const { direction, initialCellContents, letters, openSpaces } = params;
    let words;
    
    if (direction === Directions.DOWN ||
    direction === Directions.RIGHT) {
        words = getWordsStartingWithLetter(initialCellContents, letters, openSpaces );
    }
    else if (direction === Directions.UP ||
    direction === Directions.LEFT) {
        words = getWordsEndingWithLetter(initialCellContents, letters, openSpaces );    
    }
    return words;
}

function findBoardSolution(boardCells, tiles) {
    for (let rowIndex = 0; rowIndex < boardCells.length; rowIndex++) {
        for (let colIndex = 0; colIndex < boardCells[rowIndex].length; colIndex++) {
            if (boardCells[rowIndex][colIndex].length) {
                for (const direction in Directions) {
                    const currentDirection = Directions[direction];
                    const { rowDelta, colDelta } = getDeltas(currentDirection);
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
                    
                    const oppositeDirection = getOppositeDirection(currentDirection);
                    const cellsAdjacentToInitialPosition = getAdjacentCells(rowIndex, colIndex, boardCells);
                    
                    if (cellsAdjacentToInitialPosition[oppositeDirection] !== Status.NONEXISTENT) {
                        if (cellsAdjacentToInitialPosition[oppositeDirection].length) {
                            continue;
                        }
                    }
                    listOfIndicesOfTilesInDirection.shift();
                    if (listOfIndicesOfTilesInDirection.length === 0) {
                        continue;
                    }
                    
                    
                    const freeSpaces = findFreeSpaceCount(listOfIndicesOfTilesInDirection, boardCells);
                    const lettersFromHand = tiles.map((tile) => {
                        if (tile.name.includes("blank")) {
                            return "";
                        }
                        return tile.name.toLowerCase();
                    }).join("");
                    const params = {
                        direction: currentDirection,
                        initialCellContents: boardCells[rowIndex][colIndex],
                        letters: lettersFromHand,
                        openSpaces: freeSpaces + 1
                    };
                    let wordListWhenIgnoringTileQuantities = findWordsPossibleToMakeIfOnlyTileNamesAreConsidered(params);
                    
                    if (wordListWhenIgnoringTileQuantities.length) {
                        const makeableWords = wordListWhenIgnoringTileQuantities
                                              .filter((w) => canWordBeCreatedUsingAvailableLetters(w, lettersFromHand + boardCells[rowIndex][colIndex]));
                        if (makeableWords.length) {
                            const word = makeableWords[Math.floor(Math.random() * makeableWords.length)];
                            const indices = getIndicesWhereTilesWillBePlaced(listOfIndicesOfTilesInDirection, word.length);
                            
                            if (currentDirection === Directions.DOWN ||
                            currentDirection === Directions.RIGHT) {
                                addTileNameToIndicesWhenDirectionIsDownOrRight(indices, word);
                            }
                            else if (currentDirection === Directions.UP ||
                            currentDirection === Directions.LEFT) {
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
    if (isBoardEmpty(boardCells)) {
        const lettersFromHand = tiles.map((tile) => {
            if (tile.name.includes("blank")) {
                return "";
            }
            return tile.name.toLowerCase();
        }).join("");
        const words = getWordsContainingOnlyLettersAvailableToPlayer(lettersFromHand, tiles.length);
        const makeableWords = words.filter((w) => canWordBeCreatedUsingAvailableLetters(w, lettersFromHand));
        const randomlySelectedWord = makeableWords[Math.floor(Math.random() * makeableWords.length)];
        const freespaceRowNumber = Math.floor(boardCells.length / 2);
        const freespaceColumnNumber = Math.floor(boardCells[0].length / 2);
        const firstColumnNumber = freespaceColumnNumber - (randomlySelectedWord.length - 1);
        let indices = [];
        for (let i = firstColumnNumber; i <= freespaceColumnNumber; i++) {
            indices.push({row: freespaceRowNumber, col: i});
        }
        indices = indices.map((curr, i) => {
            curr.name = randomlySelectedWord.charAt(i);
            return curr;
        });
        addTileIdsToIndices(indices, tiles);
        return indices;
    }
    else {
        return null;
    }
}

function getWordsContainingOnlyLettersAvailableToPlayer(optionalLetters, maxWordLength) {
    const regex = new RegExp(`^[${optionalLetters}]+$`, 'g');
    return dictionary.filter((w) => {
        return w.match(regex) && w.length <= maxWordLength;
    });
}

function isBoardEmpty(boardCells) {
    const isNotEmpty = boardCells.some((cellRow) => {
        return cellRow.some((cell) => {
            return cell.length;
        });
    });
    return !isNotEmpty;
}

export default findBoardSolution;
