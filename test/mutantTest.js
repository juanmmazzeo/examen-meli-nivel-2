import { assert as Assert } from 'chai';
import mutantUtils from '../business/mutant';

//Test logic business and whole methods that manipulates data
describe('Mutant tests', function(){
    describe('business/mutant.js', function(){
        describe('isMutant', function(){
            it('isMuntant should have return true', function (){
                Assert.equal(mutantUtils.isMutant(["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]), true);
            });
        
            it('isMuntant should have return false', function (){
                Assert.equal(mutantUtils.isMutant(["ATGCGA","CAGTGC","TTATGT","AGAGGG","CTCCTA","TCACTG"]), false);
            });
        });
        
        describe('checkData', function(){
            it('checkData horizontal should have return 2', function (){
                let matrixData = [
                    ["A","T","G","C","G","A"],
                    ["C","A","G","T","G","C"],
                    ["T","T","A","T","G","T"],
                    ["A","G","A","A","G","G"],
                    ["C","C","C","C","T","A"],
                    ["T","T","T","T","A","G"]];
                Assert.equal(mutantUtils.checkData(matrixData, 4, 0), 2);
            });
        
            it('checkData vertical should have return 3', function (){
                let matrixData = [
                    ["A","T","G","C","G","A"],
                    ["C","A","G","T","G","C"],
                    ["T","T","A","T","G","G"],
                    ["A","G","A","G","G","G"],
                    ["C","T","A","C","T","G"],
                    ["T","C","A","C","A","G"]];
                Assert.equal(mutantUtils.checkData(matrixData, 4, 1), 3);
            });
        
            it('checkData diagonal should have return 3', function (){
                let matrixData = [
                    ["A","T","G","C","G","A"],
                    ["C","A","G","G","G","C"],
                    ["T","T","A","T","G","T"],
                    ["A","G","A","A","T","G"],
                    ["C","C","C","T","T","A"],
                    ["T","C","T","C","A","G"]];
                Assert.equal(mutantUtils.checkData(matrixData, 4, 2), 3);
            });

            it('checkData horizontal should have return 1', function (){
                let matrixData = [
                    ["A","T","G","C","G","A"],
                    ["C","A","G","T","G","C"],
                    ["T","T","A","T","G","T"],
                    ["A","G","A","A","G","G"],
                    ["C","C","C","C","C","A"],
                    ["T","T","T","T","A","G"]];
                Assert.equal(mutantUtils.checkData(matrixData, 4, 0), 1);
            });
        });
        
        describe('allEqual', function(){
            it('allEqual should have return true', function(){
                Assert.equal(mutantUtils.allEqual(["A", "A", "A", "A"]), true);
            });
        
            it('allEqual should have return false', function(){
                Assert.equal(mutantUtils.allEqual(["A", "T", "A", "A"]), false);
            });
        });
        
        describe('getCol', function(){
            let matrixData = [
                ["A","T","G","C","G","A"],
                ["C","A","G","G","G","C"],
                ["T","T","A","T","G","T"],
                ["A","G","A","A","T","G"],
                ["C","C","C","T","T","A"],
                ["T","C","T","C","A","G"]];
            it('getCol should have return ["A","C","T","A","C","T"]', function(){
                Assert.equal(mutantUtils.getCol(matrixData, 0).join(","), ["A,C,T,A,C,T"]);
            });
        
            it('getCol should have return ["G","G","G","T","T","A"]', function(){
                Assert.equal(mutantUtils.getCol(matrixData, 4).join(","), ["G,G,G,T,T,A"]);
            });
        });
        
        describe('getDiagonal', function(){
            let matrixData = [
                ["A","T","G","C","G","A"],
                ["C","A","G","G","G","C"],
                ["T","T","A","T","G","T"],
                ["A","G","A","A","T","G"],
                ["C","C","C","T","T","A"],
                ["T","C","T","C","A","G"]];
            it('getDiagonal should have return ["T,C,A,T,G,A"]', function(){
                Assert.equal(mutantUtils.getDiagonal(matrixData, 4)[2].join(","), ["T,C,A,T,G,A"]);
            });
        
            it('getDiagonal should have return ["A,T,G,C"]', function(){
                Assert.equal(mutantUtils.getDiagonal(matrixData, 4)[0].join(","), ["A,T,G,C"]);
            });
        
            it('getDiagonal should have return ["G,G,G,G"]', function(){
                Assert.equal(mutantUtils.getDiagonal(matrixData, 4, true)[4].join(","), ["G,G,G,G"]);
            });
        
            it('getDiagonal should have return ["G,T,A,A,A,A"]', function(){
                Assert.equal(mutantUtils.getDiagonal(matrixData, 4, true)[2].join(","), ["G,T,A,A,A,A"]);
            });
        });
        
        describe('checkValid', function(){
            let matrixData = ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"];
            let matrixDataWrong = ["ATGCG","CAGGGC","TTATGT","AGAAT","CCC","TCTCAG"];
            it('checkValid should have return true', function(){
                Assert.equal(mutantUtils.checkValid(matrixData), true);
            });
        
            it('checkValid should have return false', function(){
                Assert.equal(mutantUtils.checkValid(matrixDataWrong), false);
            });
        
            it('checkValid should have return false', function(){
                matrixData[0] = "ATFCGA";
                Assert.equal(mutantUtils.checkValid(matrixData), false);
            });
        });
        
        describe('checkValidCharacter', function(){
            it('checkValidCharacter should have return true', function(){
                Assert.equal(mutantUtils.checkValidCharacter("ATGCGA"), true);
            });
        
            it('checkValidCharacter should have return false', function(){
                Assert.equal(mutantUtils.checkValidCharacter("APGJGA"), false);
            });
        
            it('checkValidCharacter should have return false', function(){
                Assert.equal(mutantUtils.checkValidCharacter("AAAATU"), false);
            });
        });
    });

    
});



