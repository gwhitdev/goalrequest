const axios = require('axios');
const fs = require('fs');

/* Create a new async request that gets all the matches that have team1 or team2 named as the param 'team'. 
Then, add up all the team1 and team2 goals as aproppriate and add them, respectively, to individual variables.*/

const team = 'Barcelona';
const year = '2011';
const FIRST_URL = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&team1=${team}`;
const SECOND_URL = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&team2=${team}`;

const getPages = async (team, year) => {
    console.log('Making first connection...')
    const firstResponse = await axios.get(FIRST_URL);
    console.log('First response received.')

    console.log('Making second connection...')
    const secondResponse = await axios.get(SECOND_URL);
    console.log('Second response received.')

    let numberOfPages = firstResponse.data.total_pages;
    let secondNumOfPages = secondResponse.data.total_pages;
    let numberOfMatches = firstResponse.data.total;
    let secondNumberOfMatches = secondResponse.data.total;

    //console.log('Num of pages 1: ', numberOfPages);
    //console.log('Num of pages 2: ', secondNumOfPages);

    let numberOfGoals = 0;
    console.log('Getting team 1 goals...')
        for (let i = 0; i < numberOfMatches; i++) {
           numberOfGoals += Number(firstResponse.data.data[i].team1goals);
            //console.log('Iterate team1 number of goals: ', numberOfGoals);
        }
    console.log('Getting team 2 goals...')
        for (let i = 0; i < secondNumberOfMatches; i++) {
            numberOfGoals += Number(secondResponse.data.data[i].team2goals);
            //console.log('Iterate team2 number of goals: ', numberOfGoals);
        }
    let resOne = JSON.stringify(firstResponse.data.data);
    let resTwo = JSON.stringify(secondResponse.data.data);

    console.log('Creating result object...')

    let response = {
        r1: resOne,
        r2: resTwo,
        r3: numberOfGoals
    }
    
    console.log('Result object created.')
    console.log('Returning response.')
    return response;
}

const writeToFile = async (result) => {
    console.log('Writing to file one...')
    await fs.writeFile('result1.json', result.r1, (err) => err);
    console.log('Writing to file two...')
    await fs.writeFile('result2.json', result.r2, (err) => err);
}

getPages(team, year)
    .then(result => writeToFile(result))
    .catch(e => console.log(e))
    .then(async function(){ await console.log('Completed task')});

    