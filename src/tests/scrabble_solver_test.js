import { assert } from "chai";
import findSolution from "../js/scrabble_solver";
import validWords from "an-array-of-english-words";

describe("findBoardSolution()", () => {
    const tiles = [{name: "a", id: 1}, {name: "c", id: 2}, {name: "t", id: 3},
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
    
    function findHorizontalWordsContainingTile(tileRow, tileCol, board) {
        const ROWMAXIMUM = board.length - 1;
        const COLUMNMAXIMUM = board[0].length - 1; 
        let row = tileRow;
        let col = tileCol;
        
        while(col - 1 >= 0 && row >= 0 && row <= ROWMAXIMUM && ((col - 1) <= COLUMNMAXIMUM)) {
            if (!board[row][col - 1]) {
                break;
            }
            col -= 1;
        }
    
        const horizontalWordStartLocation = {row: row, col: col};
        let word = "";
        let horizontalWordCharacterLocation = {row: horizontalWordStartLocation.row, col: horizontalWordStartLocation.col};
        
        while(horizontalWordCharacterLocation.row >= 0 && horizontalWordCharacterLocation.row <= ROWMAXIMUM && 
        horizontalWordCharacterLocation.col >= 0 && horizontalWordCharacterLocation.col <= COLUMNMAXIMUM && 
        board[horizontalWordCharacterLocation.row][horizontalWordCharacterLocation.col]) {
            word += board[horizontalWordCharacterLocation.row][horizontalWordCharacterLocation.col];
            horizontalWordCharacterLocation.col += 1;
        }
    
        return word;  
    }

    function findVerticalWordsContainingTile(tileRow, tileCol, board) {
        const ROWMAXIMUM = board.length - 1;
        const COLUMNMAXIMUM = board[0].length - 1; 
        let row = tileRow;
        let col = tileCol;
        
        while(col >= 0 && row - 1 >= 0 && (row - 1) <= ROWMAXIMUM && col <= COLUMNMAXIMUM) {//row <= ROWMAXIMUM && ((col - 1) <= COLUMNMAXIMUM)) {
            if (!board[row - 1][col]) {
                break;
            }
            row -= 1;
        }
    
        const verticalWordStartLocation = {row: row, col: col};
        let word = "";
        let verticalWordCharacterLocation = {row: verticalWordStartLocation.row, col: verticalWordStartLocation.col};
        
        while(verticalWordCharacterLocation.row >= 0 && verticalWordCharacterLocation.row <= ROWMAXIMUM && 
        verticalWordCharacterLocation.col >= 0 && verticalWordCharacterLocation.col <= COLUMNMAXIMUM && 
        board[verticalWordCharacterLocation.row][verticalWordCharacterLocation.col]) {
            word += board[verticalWordCharacterLocation.row][verticalWordCharacterLocation.col];
            verticalWordCharacterLocation.row += 1;
        }
    
        return word;  
    }
    
    function findFrequency(targetWord, list) {
        let frequency = 0;
        for (let word of list) {
            if (word === targetWord) {
                frequency += 1;
            }
        }
        return frequency;
    }
    
    function ascendingOrderSort(a, b) {
            if (a > b) {
                return 1;
            }
            else if (a < b) {
                return -1;
            }
            return 0;
        }
    
    it("finds solution to given position", function() {
        const tileDestinations = findSolution(cells, tiles);
        const destinationRows = tileDestinations.map(function(dest) {
            return dest.row;
        });
        const destinationColumns = tileDestinations.map(function(dest) {
            return dest.col;
        });
        const areAllDestinationsInSameRow = destinationRows.every(function(rowNumber, i, arr) {
            return rowNumber === arr[0];
        });
        const areAllDestinationsInSameColumn = destinationColumns.every(function(columnNumber, i, arr) {
            return columnNumber === arr[0];
        });
        assert.isTrue(areAllDestinationsInSameColumn || areAllDestinationsInSameRow);
        
        const boardAfterSolutionTilesArePlaced = cells.map((currRow, rowIndex, arr) => {
            return currRow.map((currCell, colIndex, rowArr) => {
                const solutionTilesAtThisCellLocation = tileDestinations.filter((solutionCell) => solutionCell.row === rowIndex && 
                                       solutionCell.col === colIndex);
                if (!solutionTilesAtThisCellLocation.length) {
                    return currCell;
                }
                return solutionTilesAtThisCellLocation[0].name;
            });
        });
        const wordsFormedByNewTiles = tileDestinations.reduce((prev, curr) => {
            const horizontalWord = findHorizontalWordsContainingTile(curr.row, curr.col, boardAfterSolutionTilesArePlaced);
            const verticalWord = findVerticalWordsContainingTile(curr.row, curr.col, boardAfterSolutionTilesArePlaced);
            prev.push(horizontalWord, verticalWord);
            return prev;
        }, []).filter((word) => word.length >= 2);
        const allFormedWordsAreLegal = wordsFormedByNewTiles.every((word) => {
            return validWords.indexOf(word.toLowerCase()) >= 0;
        });
        assert.isTrue(allFormedWordsAreLegal);
        
        const wordFrequencies = wordsFormedByNewTiles.reduce((prev, word, i, arr) => {
            if (word in prev) {
                return prev;
            }
            prev[word] = findFrequency(word, arr);
            return prev;
        }, {});
        let wordsWhichAppearAsManyTimesAsThereAreNewTiles = [];
        
        for (const property in wordFrequencies) {
            if (wordFrequencies[property] === tileDestinations.length) {
                wordsWhichAppearAsManyTimesAsThereAreNewTiles.push(property);
            }
        }
        
        const sortedLettersPlacedOnBoard = tileDestinations.map((dest) => dest.name).
                                           sort(ascendingOrderSort).join("");
        const atLeastOneWordContainsAllTilesFromSolution = wordsWhichAppearAsManyTimesAsThereAreNewTiles.some((word) => {
            const sortedLettersOfWord = word.split("").sort(ascendingOrderSort).join("");
            const wordsHaveMatchingLetterFrequencies = sortedLettersPlacedOnBoard.split("").every((letter) => {
                return findFrequency(letter, sortedLettersPlacedOnBoard.split("")) === 
                findFrequency(letter, sortedLettersOfWord);
            });
            return wordsHaveMatchingLetterFrequencies;
        });
        assert.isTrue(atLeastOneWordContainsAllTilesFromSolution);
    });
    
});
