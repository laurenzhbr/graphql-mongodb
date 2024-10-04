import os
import json
import numpy as np
import matplotlib.pyplot as plt
import re
import matplotlib.ticker as ticker

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

def create_comparison_bargraph_for_sum_response_time(metric, use_cases, bar_width, rest_values, gql_values, output_dir):
    # Create bar graph with broken y-axis with a break at 200ms
    x_pos_rest = use_cases - bar_width / 2 - 0.02  # Add a little space
    x_pos_gql = use_cases + bar_width / 2 + 0.02  # Add a little space

    # Create the plot with two y-axis scales
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(8,5), gridspec_kw={'height_ratios': [1, 3]})

    # Bars for REST API
    bars_rest1 = ax1.bar(x_pos_rest, rest_values, bar_width, label='REST', color='steelblue')
    bars_graphql1 = ax1.bar(x_pos_gql, gql_values, bar_width, label='GraphQL', color='violet')

    bars_rest2 = ax2.bar(x_pos_rest, rest_values, bar_width, label='REST', color='steelblue')
    bars_graphql2 = ax2.bar(x_pos_gql, gql_values, bar_width, label='GraphQL', color='violet')


    # Set the y-axis limits to "break" the axis
    ax1.set_ylim(100, 800)  # Top part of the y-axis (for larger values)
    ax2.set_ylim(0, 55)      # Bottom part of the y-axis (for smaller values)

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

    # Add ms to the Y-axis tick labels
    formatter = ticker.FuncFormatter(lambda x, pos: f'{int(x)} ms')
    ax1.yaxis.set_major_formatter(formatter)
    ax2.yaxis.set_major_formatter(formatter)

    # Labels and title
    ax1.set_title('accumulated Response Times')
    # Set xticks in the middle of each bar pair
    # Set xticklabels without xticks (hide the actual ticks)
    ax2.set_xticks(use_cases)
    ax2.set_xticklabels([f'UC{i+1}' for i in use_cases], ha='center')
    ax2.tick_params(axis='x', length=0)  # Dies blendet die Ticks aus, aber lässt die Labels sichtbar


    # Add legend
    ax1.legend()

    # Speichern des Diagramms
    plt.tight_layout()
    output_filepath = os.path.join(output_dir, f'{metric}_comparison.png')
    plt.savefig(output_filepath)
    plt.close()

    print(f"Chart for {metric} saved at {output_filepath}")

def create_comparison_bargraph_for_api_call_count(metric, use_cases, bar_width, rest_values, gql_values, output_dir):
    x_pos_rest = use_cases - bar_width / 2 - 0.02  # Add a little space
    x_pos_gql = use_cases + bar_width / 2 + 0.02  # Add a little space
    
    # Create a bar graph without a broken Y-axis
    fig, ax = plt.subplots(figsize=(8, 5))

    # Bars for REST API, GraphQL, and REST Optimized
    bars_rest = ax.bar(x_pos_rest, rest_values, bar_width, label='REST', color='steelblue')
    bars_graphql = ax.bar(x_pos_gql, gql_values, bar_width, label='GraphQL', color='violet')

    # Set the Y-axis limits for the full range
    ax.set_ylim(0, 12)
    ax.yaxis.set_ticks(np.arange(0, 13, 1))

    # Apply grid to the Y-axis
    ax.grid(True, which='both', axis='y', alpha=0.3)

    # Labels and title
    ax.set_title('amount of API Calls')
    ax.set_xticks(use_cases)
    ax.set_xticklabels([f'UC{i+1}' for i in use_cases], ha='center')
    ax.tick_params(axis='x', length=0)

    # Add legend
    ax.legend()

    # Save the chart
    plt.tight_layout()
    output_filepath = os.path.join(output_dir, f'{metric}_comparison.png')
    plt.savefig(output_filepath)
    plt.close()

    print(f"Chart for {metric} saved at {output_filepath}")


def create_comparison_bargraph_for_data_transmitted(metric, use_cases, bar_width, rest_values, gql_values, output_dir):
    x_pos_rest = use_cases - bar_width / 2 - 0.02  # Add a little space
    x_pos_gql = use_cases + bar_width / 2 + 0.02  # Add a little space

    # Convert bytes to kilobytes (KB)
    rest_data_kb = [x / 1024 for x in rest_values]
    graphql_data_kb = [x / 1024 for x in gql_values]
    print(rest_data_kb)
    print(graphql_data_kb)

    # Create the plot with two y-axis scales
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(8,5), gridspec_kw={'height_ratios': [1, 3]})

    # Bars for REST API
    bars_rest1 = ax1.bar(x_pos_rest, rest_data_kb, bar_width, label='REST', color='steelblue')
    bars_graphql1 = ax1.bar(x_pos_gql, graphql_data_kb, bar_width, label='GraphQL', color='violet')

    bars_rest2 = ax2.bar(x_pos_rest, rest_data_kb, bar_width, label='REST', color='steelblue')
    bars_graphql2 = ax2.bar(x_pos_gql, graphql_data_kb, bar_width, label='GraphQL', color='violet')

    # Set the y-axis limits to "break" the axis
    ax1.set_ylim(100, 1600)  # Top part of the y-axis (for larger values)
    ax2.set_ylim(0, 30)      # Bottom part of the y-axis (for smaller values)

    ax2.yaxis.set_ticks(np.arange(0, 30, 5))

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

    # Add KB to the Y-axis tick labels
    formatter = ticker.FuncFormatter(lambda x, pos: f'{int(x)} KB')
    ax1.yaxis.set_major_formatter(formatter)
    ax2.yaxis.set_major_formatter(formatter)

    # Labels and title
    ax1.set_title('accumulated Payload Size')
    ax2.set_xticks(use_cases)
    ax2.set_xticklabels([f'UC{i+1}' for i in use_cases], ha='center')
    ax2.tick_params(axis='x', length=0)


    # Add legend
    ax1.legend()

    # Speichern des Diagramms
    plt.tight_layout()
    output_filepath = os.path.join(output_dir, f'{metric}_comparison.png')
    plt.savefig(output_filepath)
    plt.close()

    print(f"Chart for {metric} saved at {output_filepath}")


# Funktion zum Erstellen einer JSON-Datei mit den Average-Werten
def create_json_of_averages(rest_data, gql_data, output_dir):
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
            
            # Werte für die Metrik im aktuellen Testcase speichern
            averages_data[uc][metric] = {
                "REST": rest_value,
                "GraphQL": gql_value,
            }
    
    # JSON-Datei schreiben
    json_file_path = os.path.join(output_dir, "average_values_comparison.json")
    
    with open(json_file_path, 'w') as json_file:
        json.dump(averages_data, json_file, indent=4)
    
    print(f"JSON file of averages saved at {json_file_path}")


# Funktion zum Erstellen von Balkendiagrammen für jede Metrik
def create_bar_chart_for_metric(rest_data, gql_data, metric, output_dir):
    use_cases = sort_use_cases(rest_data.keys())  # Liste der Use-Cases (z.B. rest1, gql1, etc.)
    rest_values = [rest_data[uc][metric] for uc in use_cases]
    gql_values = [gql_data[uc.replace("rest", "gql")][metric] for uc in use_cases]
    print(rest_values)
    print(gql_values)

    
    # Erstelle die X-Achse-Labels (Use-Case Nummer)
    labels = [uc.replace("rest", "Use Case ") for uc in use_cases]

    x = np.arange(len(labels))  # Position der Balken
    width = 0.27  # Breite der Balken
    
    if metric == "sum_response_time":
        create_comparison_bargraph_for_sum_response_time(metric, x, width, rest_values, gql_values, output_dir)
    
    if metric == "total_data_transferred":
        create_comparison_bargraph_for_data_transmitted(metric, x, width, rest_values, gql_values, output_dir)

    if metric == "api_call_count":
        create_comparison_bargraph_for_api_call_count(metric, x, width, rest_values, gql_values, output_dir)


# Funktion zum Erstellen aller Diagramme
def create_all_charts(rest_folder, gql_folder, output_folder):
    # Lese die JSON-Daten für REST und GraphQL
    rest_data = read_averages(rest_folder, "rest")
    gql_data = read_averages(gql_folder, "gql")

    # Liste der Metriken, die visualisiert werden sollen
    metrics = ["sum_response_time", "total_data_transferred", "api_call_count"]

    # Erstelle das Ausgabeverzeichnis, falls es nicht existiert
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Erstelle Diagramme für jede Metrik
    for metric in metrics:
        create_bar_chart_for_metric(rest_data, gql_data, metric, output_folder)
    
    # Erstelle eine JSON-Datei mit den Durchschnittswerten
    create_json_of_averages(rest_data, gql_data, output_folder)

if __name__ == "__main__":
    # Verzeichnisse für die JSON-Dateien mit den Averages
    rest_averages_folder = "results/REST/averages"
    gql_averages_folder = "results/GraphQL/averages"
    output_folder = "results/comparison_charts"  # Ordner für die Diagramme

    # Erstelle die Diagramme
    create_all_charts(rest_averages_folder, gql_averages_folder, output_folder)
