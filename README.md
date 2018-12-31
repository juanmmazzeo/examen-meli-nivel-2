## Examen meli Level 2 and 3

### Instructions to run
#### 1. Download or clone
#### 2. Run in console: npm install --save
#### 3.1 Run in console: npm run start
#### 3.2 Run tests: npm run test


### HTTPs request

#### /mutant/
##### Make a HTTP POST to localhost:5000/api/mutant (default)
**Data to send (example)**:

body (raw/JSON):
{
    "dna":["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]
}

**Data to receive (example):**

{
    "dnaSaved": {
        "Id": 323,
        "sequence": "ATGCGA,CAGTGC,ATATTT,AGATGG,CCGCCA,TCACTG",
        "success": false
    }
}


#### /stats/
##### Make a HTTP GET to localhost:5000/api/stats (default)
**Data to receive (example):**

{
    "count_mutant_dna": 12,
    "count_human_dna": 7,
    "ratio": "1.7"
}

