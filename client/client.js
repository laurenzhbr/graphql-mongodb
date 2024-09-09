const axios = require('axios');
const ProgressBar = require('./utils/progress-cli-ui');
const fs = require('fs');
const path = require('path');

// Import GraphQL-Query for Use-Case
const { gql_use_case_1 } = require('./queries/GQL/gql1');

// Import REST-Request for Use-Case
const {rest_use_case_1} = require('./queries/REST/rest1');
const {rest_use_case_2} = require('./queries/REST/rest2');
const {rest_use_case_3} = require('./queries/REST/rest3');
const {rest_use_case_4} = require('./queries/REST/rest4');
const {rest_use_case_6} = require('./queries/REST/rest6');


//const id = "66d5aa5fff81b5b5ab4090f1";  #ID for GraphQL Use-Case

const id = "66db7b5fbbe1351f628ed5f3";

/* gql_use_case_1(id)
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error('Error:', error);
    }); */

const gql_queries = [
    gql_use_case_1,
]

const rest_requests = [
    /* rest_use_case_1,
    rest_use_case_2,
    rest_use_case_3,
    rest_use_case_4, */
    rest_use_case_6,
]

async function runTestSuite(){

    // Conduct all REST testcases
    for (let i = 0; i < rest_requests.length; i++){
        await runSingleTestProcedure(rest_requests[i], "REST", `rest${i+1}`, 50, 1);
    }

    // Conduct all GraphQL testcases
    /* for (let i = 0; i < gql_queries.length; i++){
        await runSingleTestProcedure(gql_queries[i], "GraphQL", `gql${i+1}`, 50, 1);
    } */
}

const runSingleTestProcedure = async (method, api, use_case, iterationCount) => {
    console.log("")
    console.log(`=================== Test Suite for ${api} ==================`)
    console.log("===================================================")
    console.log(`============ Running Tests for ${use_case} through ${api} ============`)
    console.log("")

    const progressBar = new ProgressBar(iterationCount)

    progressBar.start()
    
    // Array to store batch of results and index of file to write.
    let results_request = []
    let results_transaction = []

    // Run test a specified amount of times.
    for (let index = 0; index < iterationCount; index++) {
        // Run test and expect array of results back.
        const measurements = await method()
         
        // Add result to array.
        results_request.push(measurements.request_times);
        if ('total_transaction_time' in measurements){
            results_transaction.push(measurements.total_transaction_time)
        }


        // Update progress bar.
        progressBar.update(index + 1)

        /* // Save results if batch is large.
        if (results.length >= 500) {
            // Save.
            await saveResults(results, api, use_case, fileNumber, numberOfRunThrough)

            // Reset results and increment file number.
            results = []
            fileNumber++
        } */
    }

    // Stop progress bar.
    progressBar.stop()
    const results = {'request_times': results_request};
    if (results_transaction.length > 0){
        results.total_transaction_time = results_transaction
    };

    // Save the remaining reults.
    await saveResults(results, api, use_case)

}

const saveResults = async (data, api, use_case) => {

    const dir = `./results/${api}`;
    const filePath = path.join(dir, `${use_case}.json`);

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    // Schreibe die Ergebnisse in die Datei
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Results saved to ${filePath}`);
  }

async function main() {
    for (let i = 0; i < 1; i++){
        await runTestSuite(i+1)
    }
}

main();