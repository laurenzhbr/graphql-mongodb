#!/bin/bash

# Step 1: Calculate averages of measurements
echo "Calculating averages for REST..."
python3 results/helpers/calculate_averages.py results/REST

echo "Calculating averages for GraphQL..."
python3 results/helpers/calculate_averages.py results/GraphQL

echo "Calculating averages for REST_opt..."
python3 results/helpers/calculate_averages.py results/REST_opt

# Step 2: Create Graphs for TestCases
echo "Creating graphs for test cases..."
python3 results/helpers/generate_diagrams_per_usecase.py results/REST results/GraphQL

# Step 3: Create comparison graphs for testsuite
echo "Creating comparison graphs for testsuite..."
python3 results/helpers/graphs_with_averages.py

# Step 4: Generate overview table for each metric
echo "Generating overview tables for metrics..."
python3 results/helpers/generate_tables_for_metrics.py

# Step 5: Significance calculation
echo "Performing significance testing..."
python3 results/helpers/significance_testing.py

echo "All tasks completed!"
