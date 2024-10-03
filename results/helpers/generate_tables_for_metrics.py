import json
import pandas as pd

# Load the JSON data from the specified file
file_path = "results/comparison_charts/average_values_comparison.json"

with open(file_path, 'r') as f:
    data = json.load(f)

# Prepare the data for Excel
metrics = ["sum_response_time", "total_data_transferred", "api_call_count"]

# Create tables for each metric
tables = {}

for metric in metrics:
    rows = []
    for use_case, details in data.items():
        row = {
            "Use Case ID": use_case,
            "REST": details[metric]["REST"] if metric != "total_data_transferred" else details[metric]["REST"] / 1024,
            "GraphQL": details[metric]["GraphQL"] if metric != "total_data_transferred" else details[metric]["GraphQL"] / 1024,
        }
        rows.append(row)
    tables[metric] = pd.DataFrame(rows)

# Save each table to Excel
with pd.ExcelWriter("./metrics_comparison.xlsx") as writer:
    for metric, df in tables.items():
        df.to_excel(writer, sheet_name=metric, index=False)