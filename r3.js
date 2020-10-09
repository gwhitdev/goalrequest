const axios = require('axios');
const fs = require('fs');
const { rawListeners } = require('process');
const readline = require('readline');

/* Create a new async request that gets all the matches that have team1 or team2 named as the param 'team'. 
Then, add up all the team1 and team2 goals as appropriate and add them, respectively, to individual variables.*/

const team = 'Barcelona';
const year = '2011';
const MAIN_URL = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&team1=${team}`
const SECOND_MAIN_URL = `https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&team2=${team}`

const getPages =  async (team, year) => {
    const mainResponse = await axios.get(MAIN_URL);
    const secondMainResponse = await axios.get(SECOND_MAIN_URL);
    return {mainResponse, secondMainResponse};
}

const getGoals = async(result) => {
    mainResponse = result.mainResponse;
    secondMainResponse = result.secondMainResponse;
    //console.log(mainResponse);
    //console.log(secondMainResponse);

    let firstNumberOfPages = mainResponse.data.total_pages;
    let secondNumberOfPages = secondMainResponse.data.total_pages; 

    let teamOneMatches = mainResponse.data.total;
    let teamTwoMatches = secondMainResponse.data.total;

    //console.log('Num of pages 1: ', firstNumberOfPages);
    //console.log('Num of pages 2: ', secondNumberOfPages);

    let numberOfGoals = 0;

    console.log('Getting team 1 goals...')

    let firstResponse = {};
    for (let i = 0 ; i < firstNumberOfPages; i++) {
        let response = await axios.get(`https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&team1=${team}&page=${i}`)
        for (let i = 0; i < teamOneMatches; i++) {
            numberOfGoals += Number(response.data.data[i].team1goals);
            //console.log('Iterate team1 number of goals: ', numberOfGoals);
        }
        firstResponse = response.data.data;
    }
    let secondResponse = {};
    console.log('Getting team 2 goals...')
    for (let i = 0 ; i < secondNumberOfPages; i++) {
        let response = await axios.get(`https://jsonmock.hackerrank.com/api/football_matches?competition=UEFA%20Champions%20League&year=${year}&team2=${team}&page=${i}`)
        
        for (let i = 0; i < teamTwoMatches; i++) {
            numberOfGoals += Number(response.data.data[i].team2goals);
            //console.log('Iterate team2 number of goals: ', numberOfGoals);
        }
        secondResponse = response.data.data;
    }

    return {firstResponse, secondResponse, numberOfGoals};
}

const createFinalResult = (result) => {
    let firstResponse = result.firstResponse;
    let secondResponse = result.secondResponse;
    let numberOfGoals = result.numberOfGoals;

    let r1 = JSON.stringify(firstResponse);
    let r2 = JSON.stringify(secondResponse);

    console.log('Creating result object...')

    let response = {
        r1: r1,
        r2: r2,
        r3: numberOfGoals
    }

    console.log('Result object created.')
    console.log('Piping final response object.')
    return response;
}

const writeToFile = async (result) => {
    //console.log(result);
    
    
    console.log('Writing to file one...')
    await fs.writeFile('result1.json', result.r1, (err) => err);
    console.log('Writing to file two...')
    await fs.writeFile('result2.json', result.r2, (err) => err);
}

getPages(team, year)
    .then(result => getGoals(result))
    .then(result => createFinalResult(result))
    .then(result => writeToFile(result))
    .catch(e => console.log(e))
    .then(async function(){ await console.log('Completed task')});

    