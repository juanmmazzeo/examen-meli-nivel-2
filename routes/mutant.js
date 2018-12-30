var express = require('express');
var routerMutants = express.Router();
import mutantUtils from '../business/mutant'
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
    if(!mutantUtils.checkValid(dnaReq))
        return res.json({
            success: false, 
            error: 'The dna sequence can only be composed of A,T,C and G characters, and NxN dimentions.'
        });
    
    // Check if it´s mutant or not
    var mutantSuccess = mutantUtils.isMutant(dnaReq);
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
        })
    } catch (error) {
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
        res.status(500);
    });
});

export default routerMutants;