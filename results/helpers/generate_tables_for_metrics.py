import json
import pandas as pd



# Prepare the data for Excel
metrics = ["sum_response_time", "total_data_transferred", "api_call_count"]

# Create tables for each metric
tables = {}

for metric in metrics:
    rows = []
    for use_case, details in data.items():
        row = {
            "Use Case ID": use_case,
            "REST": details[metric]["REST"],
            "GraphQL": details[metric]["GraphQL"],
        }
        rows.append(row)
    tables[metric] = pd.DataFrame(rows)

# Save each table to Excel
with pd.ExcelWriter("./metrics_comparison.xlsx") as writer:
    for metric, df in tables.items():
        df.to_excel(writer, sheet_name=metric, index=False)

import ace_tools as tools; tools.display_dataframe_to_user(name="Sum Response Time", dataframe=tables["sum_response_time"])