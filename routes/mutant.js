var express = require('express');
var routerMutants = express.Router();

routerMutants.post('/mutant', function(req, res, next){
    var mutant = isMutant(req.body.dna);
    res.json({success: mutant});
});

function isMutant(dna){
    if(!checkValid(dna))
        return false;

    let elements = [];
    dna.forEach(r => {
        elements.push(Array.from(r));
    });

    //checkData 'mode' parameter:
    //0 : Horizontally
    //1 : Vertically
    //2 : Diagonal

    let countHorizontally = checkData(elements, 4, 0);
    let countVertically = checkData(elements, 4, 1);
    let countDiagonal = checkData(elements, 4, 2);

    let total = countHorizontally + countVertically + countDiagonal;
    
    return total > 1 ? true : false;
}

function checkData(array, checkLength, mode){
    let countMatches = 0;
    let lastEvaluated = '';

    if(mode === 2)
        array = getDiagonal(array, checkLength).concat(getDiagonal(array, checkLength, true));

    for(let i = 0; i < array.length; i++){
        lastEvaluated = '';
        let dataToEvaluate = [];

        switch(mode){
            case 0:
            case 2:
                dataToEvaluate = array[i];
                break;
            case 1:
                dataToEvaluate = getCol(array, i);
                break;
            default:
                break;
        }
        
        for(let j = 0; j < dataToEvaluate.length; j++){
            let evalArray = dataToEvaluate.slice(j, j + checkLength);
            let lastEvaluatedEqual = (lastEvaluated == evalArray[checkLength-1]);
            if(evalArray.length == checkLength && allEqual(evalArray) && !lastEvaluatedEqual){
                lastEvaluated = evalArray[0];
                countMatches++;
            }
            
            if(lastEvaluatedEqual && countMatches > 0){
                // If lenght coincidences is major than checkLenght no match bussines rule
                lastEvaluated = '';
                countMatches--;
            }
        }
    }
    return countMatches;
}

const allEqual = arr => arr.every( v => v === arr[0] )

function getCol(matrix, col){
    let column = [];
    for(let i=0; i< matrix.length; i++){
       column.push(matrix[i][col]);
    }
    return column;
 }

 function getDiagonal(array, lengthDiagonal, bottomToTop ) {
    let Ylength = array.length;
    let Xlength = array[0].length;
    let maxLength = Math.max(Xlength, Ylength);
    let diagonalRow;
    let diagonalArray = [];
    for (var k = 0; k <= 2 * (maxLength - 1); ++k) {
        diagonalRow = [];
        for (let y = Ylength - 1; y >= 0; --y) {
            let x = k - (bottomToTop ? Ylength - y : y);
            if (x >= 0 && x < Xlength) {
                diagonalRow.push(array[y][x]);
            }
        }
        if(diagonalRow.length >= lengthDiagonal) {
            diagonalArray.push(diagonalRow);
        }
    }
    return diagonalArray;
}

function checkValid(matrix){
    for (let i = 0; i < matrix.length; i++) {
        //First condition check if is a matrix of NxN dimentions
        //Second condition check if contains only valid characters
        if((matrix.length !== matrix[i].length) || !checkValidCharacter(matrix[i])){
            return false;
        }
    }
    return true;
}

function checkValidCharacter(row){
    let hasCoincidence = new RegExp("^[ATCG]+$").test(row);
    return hasCoincidence ? true : false;
}

export default routerMutants;