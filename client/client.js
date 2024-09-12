const axios = require('axios');
const ProgressBar = require('./utils/progress-cli-ui');
const fs = require('fs');
const path = require('path');
const {warmUpServer} = require('./utils/warmup-routine');

// Import GraphQL-Query for Use-Case
const { gql_use_case_1 } = require('./queries/GQL/gql1');
const { gql_use_case_2 } = require('./queries/GQL/gql2');
const { gql_use_case_3 } = require('./queries/GQL/gql3');
const { gql_use_case_4 } = require('./queries/GQL/gql4');
const { gql_use_case_5 } = require('./queries/GQL/gql5');
const { gql_use_case_6 } = require('./queries/GQL/gql6');
const { gql_use_case_7 } = require('./queries/GQL/gql7');
const { gql_use_case_8 } = require('./queries/GQL/gql8');
const { gql_use_case_9 } = require('./queries/GQL/gql9');
const { gql_use_case_10 } = require('./queries/GQL/gql10');

// Import REST-Request for Use-Case
const {rest_use_case_1} = require('./queries/REST/rest1');
const {rest_use_case_2} = require('./queries/REST/rest2');
const {rest_use_case_3} = require('./queries/REST/rest3');
const {rest_use_case_4} = require('./queries/REST/rest4');
const {rest_use_case_5} = require('./queries/REST/rest5');
const {rest_use_case_6} = require('./queries/REST/rest6');
const {rest_use_case_7} = require('./queries/REST/rest7');
const {rest_use_case_8} = require('./queries/REST/rest8');
const {rest_use_case_9} = require('./queries/REST/rest9');
const {rest_use_case_10} = require('./queries/REST/rest10');


const gql_queries = [
    gql_use_case_1,
    gql_use_case_2,
    gql_use_case_3,
    gql_use_case_4,
    gql_use_case_5,
    gql_use_case_6,
    gql_use_case_7,
    gql_use_case_8,
    gql_use_case_9,
    gql_use_case_10,
]

const rest_requests = [
    rest_use_case_1,
    rest_use_case_2,
    rest_use_case_3,
    rest_use_case_4,
    rest_use_case_5,
    rest_use_case_6,
    rest_use_case_7,
    rest_use_case_8,
    rest_use_case_9,
    rest_use_case_10,
]

const iteration_count = [
    50,
    50,
    50,
    50,
    50,
    50,
    50,
    50,
    50,
    5,
]

async function runTestSuite(){

    // Conduct all REST testcases
    for (let i = 5; i < 8; i++){
        await runSingleTestProcedure(rest_requests[i], "REST", `rest${i+1}`, iteration_count[i]);
    }

    // Conduct all GraphQL testcases
    for (let i = 0; i < 8; i++){
        await runSingleTestProcedure(gql_queries[i], "GraphQL", `gql${i+1}`, iteration_count[i]);
    }
}

const runSingleTestProcedure = async (method, api, use_case, iterationCount) => {
    console.log(`=================== Warm-up for ${api} - ${use_case} ==================`);
    await warmUpServer(api); // Schalter für REST oder GraphQL basierend auf dem API-Parameter
  

    console.log("")
    console.log(`=================== Test Suite for ${api} ==================`)
    console.log("===================================================")
    console.log(`============ Running Tests for ${use_case} through ${api} ============`)
    console.log("")

    const progressBar = new ProgressBar(iterationCount)

    progressBar.start()
    
    // Array to store batch of results and index of file to write.
    let duration_of_all_calls = []
    let total_transaction_time = []
    let cpu_used_by_server= []
    let memory_used_by_server= []
    let total_data_transferred= []
    let api_call_count = 0;


    // Run test a specified amount of times.
    for (let index = 0; index < iterationCount; index++) {
        // Run test and expect array of results back.
        const test_case_result = await method()
        if (index === 0) {
            await saveResults(test_case_result.data, "response_data", api, use_case) // save response data from every test case
            api_call_count = test_case_result.api_call_count;
        }
         
        // Add result to array.
        duration_of_all_calls.push(test_case_result.duration_of_all_calls);
        total_transaction_time.push(test_case_result.total_transaction_time);
        total_data_transferred.push(test_case_result.total_data_transferred);
        cpu_used_by_server.push(test_case_result.cpu_used_by_server);
        memory_used_by_server.push(test_case_result.memory_used_by_server);

        // Update progress bar.
        progressBar.update(index + 1);
    }

    // Stop progress bar.
    progressBar.stop()
    const results = {'duration_of_all_calls': duration_of_all_calls,
        'total_transaction_time': total_transaction_time,
        'api_call_count': api_call_count,
        'cpu_used_by_server': cpu_used_by_server,
        'memory_used_by_server': memory_used_by_server,
        'total_data_transferred': total_data_transferred
    };

    // Save the remaining reults.
    await saveResults(results, "results", api, use_case)
}

const saveResults = async (data, directory, api, use_case) => {

    const dir = `./${directory}/${api}`;
    const filePath = path.join(dir, `${use_case}.json`);

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Results saved to ${filePath}`);
  }

async function main() {
    for (let i = 0; i < 1; i++){
        await runTestSuite(i+1)
    }
}

main();