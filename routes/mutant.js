var express = require('express');
var routerMutants = express.Router();
import dna from '../models/dna';

routerMutants.post('/mutant', function(req, res, next){
    let dnaReq = req.body.dna;

    if(!checkValid(dnaReq)){
        return res.json({
            success: false, 
            error: 'The dna sequence can only be composed of A,T,C and G.'
        });
    }

    var mutantSuccess = isMutant(dnaReq);
    try {
        dna.create({
            sequence: dnaReq.join(),
            success: mutantSuccess
        }).then(function(dnaCreated){
            if(mutantSuccess)
                res.status(200);
            else
                res.status(403);

            res.json({success: mutantSuccess});
        }).error(e => console.log(e));
    } catch (error) {
        res.status(500);
    };
});

routerMutants.get('/stats', function(req, res, next){
    dna.count({
        where: {success: true}
    }).then(function(mutantsCount){
        dna.count().then(function(all){
            let humanCount = Number(all) - Number(mutantsCount);
            res.json({
                count_mutant_dna: mutantsCount, 
                count_human_dna: humanCount,
                ratio: (Number(mutantsCount)/humanCount).toFixed(1)
            })

        });
    }).catch(error => {
        console.log('Error: ${error}')
        res.status(500);
    });
});

function isMutant(dna){
    let elements = [];
    dna.forEach(r => {
        elements.push(Array.from(r));
    });

    //checkData 'mode' parameter:
    //0 : Horizontally
    //1 : Vertically
    //2 : Diagonal

    let total = checkData(elements, 4, 0) + checkData(elements, 4, 1) + checkData(elements, 4, 2);
    
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

 function getDiagonal(matrix, minLength, bottomToTop ) {
    let Ylength = matrix.length;
    let Xlength = matrix[0].length;
    let maxLength = Math.max(Xlength, Ylength);
    let diagonalRow;
    let diagonalArray = [];
    for (var k = 0; k <= 2 * (maxLength - 1); ++k) {
        diagonalRow = [];
        for (let y = Ylength - 1; y >= 0; --y) {
            let x = k - (bottomToTop ? Ylength - y : y);
            if (x >= 0 && x < Xlength) {
                diagonalRow.push(matrix[y][x]);
            }
        }
        if(diagonalRow.length >= minLength) {
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