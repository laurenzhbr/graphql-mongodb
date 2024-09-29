import os
import json
import numpy as np
import matplotlib.pyplot as plt
import re

# Funktion zum Lesen der JSON-Dateien
def read_averages(folder, prefix):
    data = {}
    for filename in os.listdir(folder):
        if filename.startswith(prefix) and filename.endswith("_averages.json"):
            filepath = os.path.join(folder, filename)
            with open(filepath, 'r') as f:
                data[filename.split('_')[0]] = json.load(f)  # Beispiel: 'rest1' als Schlüssel
    return data

# Funktion zum Sortieren der Use-Cases basierend auf den Nummern (z.B. 'rest1', 'rest10', 'rest2')
def sort_use_cases(use_cases):
    # Extrahiere die Zahl am Ende des Use-Case-Namens und sortiere nach dieser Zahl
    return sorted(use_cases, key=lambda x: int(re.search(r'\d+', x).group()))

def create_comparison_bargraph_for_sum_response_time(metric, use_cases, bar_width, rest_values, gql_values, rest_opt_values, output_dir):
    # Create bar graph with broken y-axis with a break at 200ms

    # Create the plot with two y-axis scales
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(8,6), gridspec_kw={'height_ratios': [1, 3]})

    # Bars for REST API
    bars_rest1 = ax1.bar(use_cases - bar_width, rest_values, bar_width, label='REST', color='steelblue')
    bars_graphql1 = ax1.bar(use_cases, gql_values, bar_width, label='GraphQL', color='violet')
    bars_rest_opt1 = ax1.bar(use_cases + bar_width, rest_opt_values, bar_width, label='REST optimized', color='green')

    bars_rest2 = ax2.bar(use_cases - bar_width, rest_values, bar_width, label='REST', color='steelblue')
    bars_graphql2 = ax2.bar(use_cases, gql_values, bar_width, label='GraphQL', color='violet')
    bars_rest_opt2 = ax2.bar(use_cases + bar_width, rest_opt_values, bar_width, label='REST optimized', color='green')


    # Set the y-axis limits to "break" the axis
    ax1.set_ylim(300, 3500)  # Top part of the y-axis (for larger values)
    ax2.set_ylim(0, 150)      # Bottom part of the y-axis (for smaller values)

    # Hide the spines between the two axes
    ax1.spines['bottom'].set_visible(False)
    ax2.spines['top'].set_visible(False)
    ax1.tick_params(labeltop=False)  # Don't put tick labels at the top
    ax2.xaxis.tick_bottom()

    # Add diagonal lines to indicate the break in the axis
    d = .015  # size of diagonal lines
    kwargs = dict(transform=ax1.transAxes, color='k', clip_on=False)
    ax1.plot((-d, +d), (-d, +d), **kwargs)        # top-left diagonal
    ax1.plot((1 - d, 1 + d), (-d, +d), **kwargs)  # top-right diagonal

    kwargs.update(transform=ax2.transAxes)  # Switch to the bottom axis
    ax2.plot((-d, +d), (1 - d, 1 + d), **kwargs)  # bottom-left diagonal
    ax2.plot((1 - d, 1 + d), (1 - d, 1 + d), **kwargs)  # bottom-right diagonal

    ax1.grid(True, which='both', axis='y', alpha=0.3)  # Apply to y-axis in top axis
    ax2.grid(True, which='both', axis='y', alpha=0.3)  # Apply to y-axis in bottom axis

    # Labels and title
    ax2.set_ylabel('Average Duration (ms)')
    ax1.set_title('Comparison of accumulated Response Times between REST and GraphQL')
    ax2.set_xticks(use_cases)
    ax2.set_xticklabels([f'Use Case {i+1}' for i in use_cases], rotation=45, ha='right')

    # Add legend
    ax1.legend()

    # Speichern des Diagramms
    plt.tight_layout()
    output_filepath = os.path.join(output_dir, f'{metric}_comparison.png')
    plt.savefig(output_filepath)
    plt.close()

    print(f"Chart for {metric} saved at {output_filepath}")

def create_comparison_bargraph_for_api_call_count(metric, use_cases, bar_width, rest_values, gql_values, rest_opt_values, output_dir):
    # Create bar graph with broken y-axis with a break at 15 calls

    # Create the plot with two y-axis scales
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(8,6), gridspec_kw={'height_ratios': [1, 3]})

    # Bars for REST API
    bars_rest1 = ax1.bar(use_cases - bar_width, rest_values, bar_width, label='REST', color='steelblue')
    bars_graphql1 = ax1.bar(use_cases, gql_values, bar_width, label='GraphQL', color='violet')

    bars_rest2 = ax2.bar(use_cases - bar_width, rest_values, bar_width, label='REST', color='steelblue')
    bars_graphql2 = ax2.bar(use_cases, gql_values, bar_width, label='GraphQL', color='violet')


    # Set the y-axis limits to "break" the axis
    ax1.set_ylim(50, 1000)  # Top part of the y-axis (for larger values)
    ax2.set_ylim(0, 12)      # Bottom part of the y-axis (for smaller values)

    ax2.yaxis.set_ticks(np.arange(0, 12, 1))

    # Hide the spines between the two axes
    ax1.spines['bottom'].set_visible(False)
    ax2.spines['top'].set_visible(False)
    ax1.tick_params(labeltop=False)  # Don't put tick labels at the top
    ax2.xaxis.tick_bottom()

    # Add diagonal lines to indicate the break in the axis
    d = .015  # size of diagonal lines
    kwargs = dict(transform=ax1.transAxes, color='k', clip_on=False)
    ax1.plot((-d, +d), (-d, +d), **kwargs)        # top-left diagonal
    ax1.plot((1 - d, 1 + d), (-d, +d), **kwargs)  # top-right diagonal

    kwargs.update(transform=ax2.transAxes)  # Switch to the bottom axis
    ax2.plot((-d, +d), (1 - d, 1 + d), **kwargs)  # bottom-left diagonal
    ax2.plot((1 - d, 1 + d), (1 - d, 1 + d), **kwargs)  # bottom-right diagonal

    ax1.grid(True, which='both', axis='y', alpha=0.3)  # Apply to y-axis in top axis
    ax2.grid(True, which='both', axis='y', alpha=0.3)  # Apply to y-axis in bottom axis

    # Labels and title
    ax2.set_ylabel('Average amount of API calls total')
    ax1.set_title('Comparison of amount of API Calls between REST and GraphQL')
    ax2.set_xticks(use_cases)
    ax2.set_xticklabels([f'Use Case {i+1}' for i in use_cases], rotation=45, ha='right')

    # Add legend
    ax1.legend()

    # Speichern des Diagramms
    plt.tight_layout()
    output_filepath = os.path.join(output_dir, f'{metric}_comparison.png')
    plt.savefig(output_filepath)
    plt.close()

    print(f"Chart for {metric} saved at {output_filepath}")

def create_comparison_bargraph_for_data_transmitted(metric, use_cases, bar_width, rest_values, gql_values, rest_opt_values, output_dir):
    
    # Convert bytes to kilobytes (KB)
    rest_data_kb = [x / 1024 for x in rest_values]
    graphql_data_kb = [x / 1024 for x in gql_values]
    rest_opt_data_kb = [x / 1024 for x in rest_opt_values]
    print(rest_data_kb)
    print(graphql_data_kb)

    # Create the plot with two y-axis scales
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(8,6), gridspec_kw={'height_ratios': [1, 3]})

    # Bars for REST API
    bars_rest1 = ax1.bar(use_cases - bar_width, rest_data_kb, bar_width, label='REST', color='steelblue')
    bars_graphql1 = ax1.bar(use_cases, graphql_data_kb, bar_width, label='GraphQL', color='violet')
    bars_rest_opt1 = ax1.bar(use_cases + bar_width, rest_opt_data_kb, bar_width, label='REST optimized', color='green')

    bars_rest2 = ax2.bar(use_cases - bar_width, rest_data_kb, bar_width, label='REST', color='steelblue')
    bars_graphql2 = ax2.bar(use_cases, graphql_data_kb, bar_width, label='GraphQL', color='violet')
    bars_rest_opt2 = ax2.bar(use_cases + bar_width, rest_opt_data_kb, bar_width, label='REST optimized', color='green')

    # Set the y-axis limits to "break" the axis
    ax1.set_ylim(1000, 1600)  # Top part of the y-axis (for larger values)
    ax2.set_ylim(0, 150)      # Bottom part of the y-axis (for smaller values)

    ax2.yaxis.set_ticks(np.arange(0, 151, 25))

    # Hide the spines between the two axes
    ax1.spines['bottom'].set_visible(False)
    ax2.spines['top'].set_visible(False)
    ax1.tick_params(labeltop=False)  # Don't put tick labels at the top
    ax2.xaxis.tick_bottom()

    # Add diagonal lines to indicate the break in the axis
    d = .015  # size of diagonal lines
    kwargs = dict(transform=ax1.transAxes, color='k', clip_on=False)
    ax1.plot((-d, +d), (-d, +d), **kwargs)        # top-left diagonal
    ax1.plot((1 - d, 1 + d), (-d, +d), **kwargs)  # top-right diagonal

    kwargs.update(transform=ax2.transAxes)  # Switch to the bottom axis
    ax2.plot((-d, +d), (1 - d, 1 + d), **kwargs)  # bottom-left diagonal
    ax2.plot((1 - d, 1 + d), (1 - d, 1 + d), **kwargs)  # bottom-right diagonal

    ax1.grid(True, which='both', axis='y', alpha=0.3)  # Apply to y-axis in top axis
    ax2.grid(True, which='both', axis='y', alpha=0.3)  # Apply to y-axis in bottom axis

    # Labels and title
    ax2.set_ylabel('Total Data Transferred (KB)')
    ax1.set_title('Comparison of Total Data Transferred between REST and GraphQL (KB)')
    ax2.set_xticks(use_cases)
    ax2.set_xticklabels([f'Use Case {i+1}' for i in use_cases], rotation=45, ha='right')

    # Add legend
    ax1.legend()

    # Speichern des Diagramms
    plt.tight_layout()
    output_filepath = os.path.join(output_dir, f'{metric}_comparison.png')
    plt.savefig(output_filepath)
    plt.close()

    print(f"Chart for {metric} saved at {output_filepath}")

import json

# Funktion zum Erstellen einer JSON-Datei mit den Average-Werten
def create_json_of_averages(rest_data, gql_data, rest_opt_data, output_dir):
    # Liste der Testcases
    use_cases = sort_use_cases(rest_data.keys())
    
    # Liste der Metriken
    metrics = ["sum_response_time", "total_data_transferred", "api_call_count"]
    
    # Dictionary zum Speichern der Daten
    averages_data = {}

    # Durchschnittswerte pro Metrik und Testcase
    for uc in use_cases:
        averages_data[uc] = {}
        for metric in metrics:
            rest_value = rest_data[uc].get(metric, "N/A")
            gql_value = gql_data[uc.replace("rest", "gql")].get(metric, "N/A")
            rest_opt_value = rest_opt_data.get(uc, {}).get(metric, "N/A") if uc in ['rest3', 'rest4', 'rest6'] else "N/A"
            
            # Werte für die Metrik im aktuellen Testcase speichern
            averages_data[uc][metric] = {
                "REST": rest_value,
                "GraphQL": gql_value,
                "REST optimized": rest_opt_value
            }
    
    # JSON-Datei schreiben
    json_file_path = os.path.join(output_dir, "average_values_comparison.json")
    
    with open(json_file_path, 'w') as json_file:
        json.dump(averages_data, json_file, indent=4)
    
    print(f"JSON file of averages saved at {json_file_path}")


# Funktion zum Erstellen von Balkendiagrammen für jede Metrik
def create_bar_chart_for_metric(rest_data, gql_data, rest_opt_data, metric, output_dir):
    use_cases = sort_use_cases(rest_data.keys())  # Liste der Use-Cases (z.B. rest1, gql1, etc.)
    rest_values = [rest_data[uc][metric] for uc in use_cases]
    gql_values = [gql_data[uc.replace("rest", "gql")][metric] for uc in use_cases]
    print(rest_values)
    print(gql_values)

    # REST optimized nur für Testcases 3, 4 und 6 hinzufügen
    rest_opt_values = []
    for uc in use_cases:
        if uc in ['rest3', 'rest4', 'rest6']:
            rest_opt_values.append(rest_opt_data.get(uc, {}).get(metric, 0))  # Hinzufügen von REST optimized-Werten
        else:
            rest_opt_values.append(0)  # Keine REST optimized-Werte für andere Use Cases

    
    # Erstelle die X-Achse-Labels (Use-Case Nummer)
    labels = [uc.replace("rest", "Use Case ") for uc in use_cases]

    x = np.arange(len(labels))  # Position der Balken
    width = 0.20  # Breite der Balken
    
    if metric == "sum_response_time":
        create_comparison_bargraph_for_sum_response_time(metric, x, width, rest_values, gql_values, rest_opt_values, output_dir)
    
    if metric == "total_data_transferred":
        create_comparison_bargraph_for_data_transmitted(metric, x, width, rest_values, gql_values, rest_opt_values, output_dir)

    if metric == "api_call_count":
        create_comparison_bargraph_for_api_call_count(metric, x, width, rest_values, gql_values, rest_opt_values, output_dir)

def read_rest_opt_averages(folder):
    data = {}
    for filename in os.listdir(folder):
        if filename.startswith("rest") and filename.endswith("_averages.json"):
            filepath = os.path.join(folder, filename)
            with open(filepath, 'r') as f:
                data[filename.split('_')[0]] = json.load(f)  # Beispiel: 'rest3' als Schlüssel
    return data


# Funktion zum Erstellen aller Diagramme
def create_all_charts(rest_folder, gql_folder, rest_opt_folder, output_folder):
    # Lese die JSON-Daten für REST und GraphQL
    rest_data = read_averages(rest_folder, "rest")
    gql_data = read_averages(gql_folder, "gql")
    rest_opt_data = read_rest_opt_averages(rest_opt_folder)

    # Liste der Metriken, die visualisiert werden sollen
    metrics = ["sum_response_time", "total_data_transferred", "api_call_count"]

    # Erstelle das Ausgabeverzeichnis, falls es nicht existiert
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Erstelle Diagramme für jede Metrik
    for metric in metrics:
        create_bar_chart_for_metric(rest_data, gql_data, rest_opt_data, metric, output_folder)
    
    # Erstelle eine JSON-Datei mit den Durchschnittswerten
    create_json_of_averages(rest_data, gql_data, rest_opt_data, output_folder)

if __name__ == "__main__":
    # Verzeichnisse für die JSON-Dateien mit den Averages
    rest_averages_folder = "results/REST/averages"
    gql_averages_folder = "results/GraphQL/averages"
    rest_opt_folder = "results/REST_opt/averages"
    output_folder = "results/comparison_charts_test"  # Ordner für die Diagramme

    # Erstelle die Diagramme
    create_all_charts(rest_averages_folder, gql_averages_folder, rest_opt_folder, output_folder)
