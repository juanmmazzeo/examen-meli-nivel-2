## Examen meli Level 2 and 3

### Instructions to run
#### 1. Download
#### 2. Run in console: npm install --save
#### 3. Run in console: npm run start

### HTTPs request

#### /mutant/
##### Make a HTTP POST to [host]:5000/api/mutant
#####Data to send:
######body (raw/JSON) example:

{
	"dna":["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]
}

#### /stats/
##### Make a HTTP GET to [host]:5000/api/stats
#####Data to receive (example):

{
    "count_mutant_dna": 12,
    "count_human_dna": 7,
    "ratio": "1.7"
}
