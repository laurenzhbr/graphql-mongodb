import os
import json
import numpy as np
import matplotlib.pyplot as plt

# Funktion zum Lesen der JSON-Dateien
def read_averages(folder, prefix):
    data = {}
    for filename in os.listdir(folder):
        if filename.startswith(prefix) and filename.endswith("_averages.json"):
            filepath = os.path.join(folder, filename)
            with open(filepath, 'r') as f:
                data[filename.split('_')[0]] = json.load(f)  # Beispiel: 'rest1' als Schlüssel
    return data

# Funktion zum Erstellen von Balkendiagrammen für jede Metrik
def create_bar_chart_for_metric(rest_data, gql_data, metric, output_dir):
    use_cases = sorted(rest_data.keys())  # Liste der Use-Cases (z.B. rest1, gql1, etc.)
    rest_values = [rest_data[uc][metric] for uc in use_cases]
    gql_values = [gql_data[uc.replace("rest", "gql")][metric] for uc in use_cases]
    
    # Erstelle die X-Achse-Labels (Use-Case Nummer)
    labels = [uc.replace("rest", "Use Case ") for uc in use_cases]

    x = np.arange(len(labels))  # Position der Balken
    width = 0.35  # Breite der Balken

    fig, ax = plt.subplots(figsize=(12, 6))

    # Erstelle die Balken für REST und GraphQL
    bars1 = ax.bar(x - width/2, rest_values, width, label='REST')
    bars2 = ax.bar(x + width/2, gql_values, width, label='GraphQL')

    # Diagrammdetails
    ax.set_xlabel('Use Case')
    ax.set_ylabel(metric.replace("_", " ").title())
    ax.set_title(f'Average {metric.replace("_", " ").title()} for REST and GraphQL')
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=45, ha="right")
    ax.legend()

    # Speichern des Diagramms
    plt.tight_layout()
    output_filepath = os.path.join(output_dir, f'{metric}_comparison.png')
    plt.savefig(output_filepath)
    plt.close()

    print(f"Chart for {metric} saved at {output_filepath}")

# Funktion zum Erstellen aller Diagramme
def create_all_charts(rest_folder, gql_folder, output_folder):
    # Lese die JSON-Daten für REST und GraphQL
    rest_data = read_averages(rest_folder, "rest")
    gql_data = read_averages(gql_folder, "gql")

    # Liste der Metriken, die visualisiert werden sollen
    metrics = ["duration_of_all_calls", "cpu_used_by_server", "memory_used_by_server", "total_data_transferred", "api_call_count"]

    # Erstelle das Ausgabeverzeichnis, falls es nicht existiert
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Erstelle Diagramme für jede Metrik
    for metric in metrics:
        create_bar_chart_for_metric(rest_data, gql_data, metric, output_folder)

if __name__ == "__main__":
    # Verzeichnisse für die JSON-Dateien mit den Averages
    rest_averages_folder = "client/results/REST/averages"
    gql_averages_folder = "client/results/GraphQL/averages"
    output_folder = "client/results/comparison_charts"  # Ordner für die Diagramme

    # Erstelle die Diagramme
    create_all_charts(rest_averages_folder, gql_averages_folder, output_folder)
