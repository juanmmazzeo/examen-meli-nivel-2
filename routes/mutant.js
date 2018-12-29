var express = require('express');
var routerMutants = express.Router();
import dna from '../models/dna';

// Service mutant
routerMutants.post('/mutant', function(req, res, next){
    // If request haven't paramenter 'dna', get out
    if(!(req.body.dna))
        return res.json({
            success: false, 
            error: 'The dna sequence is required.'
        });

    let dnaReq = req.body.dna;
    
    // If dna haven´t valid characters and dimentions, get out
    if(!checkValid(dnaReq))
        return res.json({
            success: false, 
            error: 'The dna sequence can only be composed of A,T,C and G characters, and NxN dimentions.'
        });
    
    // Check if it´s mutant or not
    var mutantSuccess = isMutant(dnaReq);
    try {
        // Save dna in database
        dna.create({
            sequence: dnaReq.join(),
            success: mutantSuccess
        }).then(function(dnaCreated){
            // If is mutant http status 200, if isn't, http status 403
            if(mutantSuccess)
                res.status(200);
            else
                res.status(403);

            res.json({dnaSaved: dnaCreated});
        }).error(e => console.log(e));
    } catch (error) {
        console.log('Error: ${error}')
        res.status(500);
    };
});

// Service stats
routerMutants.get('/stats', function(req, res, next){
    dna.count({
        where: {success: true}
    }).then(function(mutantsCount){
        dna.count().then(function(all){
            // Calculate values
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

// Fuction determinates if it's mutant or not
function isMutant(dna){
    let elements = [];
    dna.forEach(r => {
        elements.push(Array.from(r));
    });

    // CheckData 'mode' parameter nomenclature:
    //0 : Horizontally
    //1 : Vertically
    //2 : Diagonal

    let total = checkData(elements, 4, 0) + checkData(elements, 4, 1) + checkData(elements, 4, 2);
    
    return total > 1 ? true : false;
}

// Count coincidences of matrix in function of quantity characters determinates by checkLenght 
// and for mode in particular
function checkData(matrix, checkLength, mode){
    let countMatches = 0;
    let lastEvaluated = '';

    if(mode === 2)
    matrix = getDiagonal(matrix, checkLength).concat(getDiagonal(matrix, checkLength, true));

    for(let i = 0; i < matrix.length; i++){
        lastEvaluated = '';
        let dataToEvaluate = [];

        switch(mode){
            case 0:
            case 2:
                dataToEvaluate = matrix[i];
                break;
            case 1:
                dataToEvaluate = getCol(matrix, i);
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
            
            // Check if sequence of characters isn't major to checkLength
            if(lastEvaluatedEqual && countMatches > 0){
                lastEvaluated = '';
                countMatches--;
            }
        }
    }
    return countMatches;
}

// Determines if sequence have every elements equals
const allEqual = arr => arr.every( v => v === arr[0] )

// Get column of matrix by index col
function getCol(matrix, col){
    let column = [];
    for(let i=0; i< matrix.length; i++){
       column.push(matrix[i][col]);
    }
    return column;
 }

 // Get array of sequences diagonals with longitude minLength from matrix
 // bottomToTop is required for reverse direction
 function getDiagonal(matrix, minLength, bottomToTop ) {
    let Ylength = matrix.length;
    let Xlength = matrix[0].length;
    let maxLength = Math.max(Xlength, Ylength);
    let diagonalRow;
    let diagonalArray = [];
    for (let k = 0; k <= 2 * (maxLength - 1); ++k) {
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

// Validations over matrix
function checkValid(matrix){
    for (let i = 0; i < matrix.length; i++) {
        // Check if is a matrix of NxN dimentions and if contains only valid characters
        if((matrix.length !== matrix[i].length) || !checkValidCharacter(matrix[i])){
            return false;
        }
    }
    return true;
}

function checkValidCharacter(row){
    return new RegExp("^[ATCG]+$").test(row);
}

export default routerMutants;