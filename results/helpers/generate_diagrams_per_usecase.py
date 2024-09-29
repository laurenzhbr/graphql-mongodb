import argparse
import json
import os
import re
import matplotlib.pyplot as plt
import numpy as np

# Funktion zum Erstellen des Verzeichnisses für Diagramme
def create_output_directory(test_case_id):
    output_dir = f"../{test_case_id}"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    return output_dir

# 1. Liniendiagramm für die Dauer der API-Aufrufe
def create_line_chart(rest_data, graphql_data, test_case, output_dir):
    plt.figure(figsize=(10, 6))
    plt.plot(rest_data['sum_response_time'], label='REST', marker='o')
    plt.plot(graphql_data['sum_response_time'], label='GraphQL', marker='o')
    plt.title(f'Response Time Over Requests for {test_case}')
    plt.xlabel('Request Number')
    plt.ylabel('Response Time (ms)')
    plt.legend()
    plt.grid(True)
    plt.savefig(f"{output_dir}/{test_case}_line_chart_duration.png")
    plt.close()

# 2. Flächendiagramm für die CPU-Nutzung
def create_area_chart_cpu_usage(rest_data, graphql_data, test_case, output_dir):
    plt.figure(figsize=(10, 6))
    plt.fill_between(range(len(rest_data['cpu_used_by_server'])), rest_data['cpu_used_by_server'], alpha=0.5, label='REST', color='skyblue')
    plt.fill_between(range(len(graphql_data['cpu_used_by_server'])), graphql_data['cpu_used_by_server'], alpha=0.5, label='GraphQL', color='orange')
    plt.title(f'CPU Usage Over Requests for {test_case}')
    plt.xlabel('Request Number')
    plt.ylabel('CPU Usage (ms)')
    plt.legend()
    plt.grid(True)
    plt.savefig(f"{output_dir}/{test_case}_area_chart_cpu.png")
    plt.close()

# 3. Flächendiagramm für die Speichernutzung
def create_area_chart_memory_usage(rest_data, graphql_data, test_case, output_dir):
    plt.figure(figsize=(10, 6))
    plt.fill_between(range(len(rest_data['memory_used_by_server'])), rest_data['memory_used_by_server'], alpha=0.5, label='REST', color='lightgreen')
    plt.fill_between(range(len(graphql_data['memory_used_by_server'])), graphql_data['memory_used_by_server'], alpha=0.5, label='GraphQL', color='lightcoral')
    plt.title(f'Memory Usage Over Requests for {test_case}')
    plt.xlabel('Request Number')
    plt.ylabel('Memory Usage (MB)')
    plt.legend()
    plt.grid(True)
    plt.savefig(f"{output_dir}/{test_case}_area_chart_memory.png")
    plt.close()

# 4. Balkendiagramm für das gesendete/empfangene Datenvolumen
def create_bar_chart_data_transferred(rest_data, graphql_data, test_case, output_dir):
    x = np.arange(len(rest_data['total_data_transferred']))
    width = 0.35

    plt.figure(figsize=(10, 6))
    plt.bar(x - width/2, rest_data['total_data_transferred'], width, label='REST')
    plt.bar(x + width/2, graphql_data['total_data_transferred'], width, label='GraphQL')

    plt.title(f'Data Transferred (Sent/Received) for {test_case}')
    plt.xlabel('Request Number')
    plt.ylabel('Data Transferred (Bytes)')
    plt.legend()
    plt.grid(True)
    plt.savefig(f"{output_dir}/{test_case}_bar_chart_data_transferred.png")
    plt.close()

# 5. Optional: Boxplot für Gesamtübersicht (Response Time)
def create_combined_boxplot_response_time(rest_data, graphql_data, test_case, output_dir):
    plt.figure(figsize=(10, 6))
    plt.boxplot([rest_data['sum_response_time'], graphql_data['sum_response_time']],
                tick_labels=['REST', 'GraphQL'])
    plt.title(f'Response Time Distribution for {test_case}')
    plt.ylabel('Response Time (ms)')
    plt.grid(True)
    plt.savefig(f"{output_dir}/{test_case}_boxplot_response_time.png")
    plt.close()

# 6. Boxplot für Gesamtübersicht aller Metriken
def create_boxplot_for_all_metrics(rest_data, graphql_data, test_case, output_dir):
    plt.figure(figsize=(10, 6))

    metrics_data = [
        rest_data['sum_response_time'],
        graphql_data['sum_response_time'],
        rest_data['cpu_used_by_server'],
        graphql_data['cpu_used_by_server'],
        rest_data['memory_used_by_server'],
        graphql_data['memory_used_by_server']
    ]
    
    labels = [
        'REST Response Time',
        'GraphQL Response Time',
        'REST CPU Usage',
        'GraphQL CPU Usage',
        'REST Memory Usage',
        'GraphQL Memory Usage'
    ]

    plt.boxplot(metrics_data, tick_labels=labels)
    plt.title(f'Metrics Overview for {test_case}')
    plt.ylabel('Values (ms or MB)')
    plt.xticks(rotation=45, ha='right')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(f"{output_dir}/{test_case}_boxplot_all_metrics.png")
    plt.close()

def create_output_directory(test_case):
    """
    Erstelle ein Verzeichnis für die Ausgabe, falls es nicht existiert.
    """
    output_dir = os.path.join(os.path.dirname(__file__), f"../graphs/{test_case}")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    return output_dir

# Die Diagramm-Funktionen müssen definiert sein, z.B.:
# def create_line_chart(...), def create_area_chart_cpu_usage(...), etc.

def process_test_case(rest_file_path, graphql_file_path, test_case):
    """
    Verarbeite einen Testfall und erstelle die entsprechenden Diagramme.
    """
    # Lese die REST-Daten
    with open(rest_file_path, 'r') as rest_file:
        rest_data = json.load(rest_file)

    # Lese die GraphQL-Daten
    with open(graphql_file_path, 'r') as graphql_file:
        graphql_data = json.load(graphql_file)

    # Erstelle das Ausgabeverzeichnis für den Testfall
    output_dir = create_output_directory(test_case)

    # Erstelle die Diagramme und speichere sie im entsprechenden Ordner
    create_line_chart(rest_data, graphql_data, test_case, output_dir)  # 1. Liniendiagramm für die Dauer der API-Aufrufe
    create_area_chart_cpu_usage(rest_data, graphql_data, test_case, output_dir)  # 2. Flächendiagramm für die CPU-Nutzung
    create_area_chart_memory_usage(rest_data, graphql_data, test_case, output_dir)  # 3. Flächendiagramm für die Speichernutzung
    create_bar_chart_data_transferred(rest_data, graphql_data, test_case, output_dir)  # 4. Balkendiagramm für das Datenvolumen
    create_combined_boxplot_response_time(rest_data, graphql_data, test_case, output_dir)  # 5. Boxplot für Response Time
    create_boxplot_for_all_metrics(rest_data, graphql_data, test_case, output_dir)  # 6. Boxplot für Gesamtübersicht aller Metriken

    print(f"Charts for {test_case} have been created and saved in {output_dir}.")

def find_matching_files(rest_folder, graphql_folder):
    """
    Findet passende REST- und GraphQL-Dateien in den Ordnern.
    """
    rest_files = [f for f in os.listdir(rest_folder) if f.endswith('.json')]
    graphql_files = [f for f in os.listdir(graphql_folder) if f.endswith('.json')]

    test_cases = {}
    rest_pattern = re.compile(r'rest(\d+)\.json')
    graphql_pattern = re.compile(r'gql(\d+)\.json')

    for rest_file in rest_files:
        rest_match = rest_pattern.match(rest_file)
        if rest_match:
            test_case_id = rest_match.group(1)
            graphql_file = f"gql{test_case_id}.json"
            if graphql_file in graphql_files:
                test_cases[test_case_id] = (os.path.join(rest_folder, rest_file), os.path.join(graphql_folder, graphql_file))

    return test_cases

if __name__ == "__main__":
    # Argumente parsen
    parser = argparse.ArgumentParser(description="Automatically create charts for REST and GraphQL performance comparison.")
    parser.add_argument('rest_folder', type=str, help="The folder containing REST JSON files.")
    parser.add_argument('graphql_folder', type=str, help="The folder containing GraphQL JSON files.")
    args = parser.parse_args()

    # Pfade zu den Ordnern
    rest_folder_path = os.path.abspath(args.rest_folder)
    graphql_folder_path = os.path.abspath(args.graphql_folder)

    # Finde die passenden Dateien
    test_cases = find_matching_files(rest_folder_path, graphql_folder_path)

    # Verarbeite jeden Testfall
    for test_case_id, (rest_file, graphql_file) in test_cases.items():
        print(f"Processing test case {test_case_id}...")
        process_test_case(rest_file, graphql_file, test_case_id)

