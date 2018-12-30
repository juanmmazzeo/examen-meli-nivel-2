let chai = require('chai')
let chaiHttp = require('chai-http');
let expect = require('chai').expect;
import db from '../db/db';
import app from '../app';
import sequelize from 'sequelize';

chai.use(chaiHttp);
chai.should();

//Database connections test
describe('db/db.js', function(){
    after(function (){
        db.connection.close();
    });

    it('db connection with right credentials authenticate', (done) => {
        db.authenticate().then((res) => {
            expect(res).to.equal(true);
            done();
        }).catch(done);
     });

    it('db connection with wrong credentials authenticate', (done) => {
        let instanceDb = db;
        instanceDb.connection = new sequelize('', '', '', {
            host: 'localhost',
            dialect: 'mysql'
          });

        instanceDb.authenticate().then((res) => {
            expect(res).to.equal(false);//SequelizeAccessDeniedError
            done();
        }).catch(done);
     });
});

//Api calls tests
describe('routes/mutant.js', function(){
    it('post a dna should have status 200', (done) => {
        chai.request(app)
            .post('/api/mutant')
            .send({dna: ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]})
            .end((err,res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('post a dna should have status 403', (done) => {
        chai.request(app)
            .post('/api/mutant')
            .send({dna:["ATGCGA","CAGTGC","TTATGT","AGAGGG","CACCTA","TCACTG"]})
            .end(function(err,res){
                res.should.have.status(403);
                done();
            });
    });
    it('post a dna should have success and sequence right', (done) => {
        chai.request(app)
            .post('/api/mutant')
            .send({dna: ["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]})
            .end(function(err,res){
                res.body.dnaSaved.should.have.property('success', true);
                res.body.dnaSaved.should.have.property('sequence','ATGCGA,CAGTGC,TTATGT,AGAAGG,CCCCTA,TCACTG');
                done();
            });
    });

    it('post a dna should not have success and sequence right', (done) => {
        chai.request(app)
            .post('/api/mutant')
            .send({dna: ["ATGCGA","CAGTGC","TTAFGT","AGAA","CCCCTA","TCACTG"]})
            .end(function(err,res){
                res.body.should.have.property('success', false);
                done();
            });
    });

    it('post a dna should have success false without passing data', (done) => {
        chai.request(app)
            .post('/api/mutant')
            .end(function(err,res){
                res.body.should.have.property('success', false);
                done();
            });
    });

    it('get stats should return propertys', (done) => {
        chai.request(app)
            .get('/api/stats')
            .end(function(err,res){
                res.body.should.have.property('count_mutant_dna');
                res.body.should.have.property('count_human_dna');
                res.body.should.have.property('ratio');
                done();
            });
    });

    after(() => {
        db.connection.close();
    });
});
