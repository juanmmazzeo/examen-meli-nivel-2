var mutantUtils = {
    // Fuction determinates if it's mutant or not
    isMutant: function(dna){
        let elements = [];
        dna.forEach(r => {
            elements.push(Array.from(r));
        });

        // CheckData 'mode' parameter nomenclature:
        //0 : Horizontally
        //1 : Vertically
        //2 : Diagonal

        let total = this.checkData(elements, 4, 0) + this.checkData(elements, 4, 1) + this.checkData(elements, 4, 2);
        
        return total > 1 ? true : false;
    },
    // Count coincidences of matrix in function of quantity characters determinates by checkLenght 
    // and for mode in particular
    checkData: function(matrix, checkLength, mode){
        let countMatches = 0;
        let lastEvaluated = '';

        if(mode === 2)
        matrix = this.getDiagonal(matrix, checkLength).concat(this.getDiagonal(matrix, checkLength, true));

        for(let i = 0; i < matrix.length; i++){
            lastEvaluated = '';
            let dataToEvaluate = [];

            switch(mode){
                case 0:
                case 2:
                    dataToEvaluate = matrix[i];
                    break;
                case 1:
                    dataToEvaluate = this.getCol(matrix, i);
                    break;
                default:
                    break;
            }
            
            for(let j = 0; j < dataToEvaluate.length; j++){
                let evalArray = dataToEvaluate.slice(j, j + checkLength);
                let lastEvaluatedEqual = (lastEvaluated == evalArray[checkLength-1]);
                if(evalArray.length == checkLength && this.allEqual(evalArray) && !lastEvaluatedEqual){
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
    },
    // Determines if sequence have every elements equals
    allEqual: arr => arr.every( v => v === arr[0] ),
    // Get column of matrix by index col
    getCol: function(matrix, col){
        let column = [];
        for(let i=0; i< matrix.length; i++){
        column.push(matrix[i][col]);
        }
        return column;
    },
    // Get array of sequences diagonals with longitude minLength from matrix
    // bottomToTop is required for reverse direction
    getDiagonal: function(matrix, minLength, bottomToTop){
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
    },
    // Validations over matrix
    checkValid: function(matrix){
        for (let i = 0; i < matrix.length; i++) {
            // Check if is a matrix of NxN dimentions and if contains only valid characters
            if((matrix.length !== matrix[i].length) || !this.checkValidCharacter(matrix[i])){
                return false;
            }
        }
        return true;
    },
    checkValidCharacter: function(row){
        return new RegExp("^[ATCG]+$").test(row);
    }
};

export default mutantUtils;