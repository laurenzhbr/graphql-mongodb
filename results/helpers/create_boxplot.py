import os
import json
import argparse
import matplotlib.pyplot as plt

def create_combined_boxplot(rest_data, graphql_data, use_case):
    # Erstelle einen kombinierten Boxplot für REST und GraphQL
    plt.figure(figsize=(10, 6))

    # Kombiniere die Daten in einer Liste
    combined_data = [rest_data, graphql_data]

    # Erstelle den Boxplot
    plt.boxplot(combined_data, labels=['REST', 'GraphQL'])
    plt.title(f'Boxplot for Use-Case {use_case} (REST vs GraphQL)')
    plt.ylabel('Response Time (ms)')
    plt.xlabel(use_case)

    # Speicherort für den Boxplot
    output_dir = os.path.join(os.path.dirname(__file__), f'../result_data')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    file_path = os.path.join(output_dir, f'{use_case}_combined_boxplot.png')
    plt.savefig(file_path)
    plt.close()
    print(f'Combined Boxplot saved to {file_path}')

if __name__ == "__main__":
    # Argumente parsen
    parser = argparse.ArgumentParser(description="Create a combined boxplot for REST and GraphQL response times.")
    #parser.add_argument('api', type=str, help="The API for which the boxplot is for.")
    parser.add_argument('rest_filename', type=str, help="The JSON file containing REST response times.")
    parser.add_argument('graphql_filename', type=str, help="The JSON file containing GraphQL response times.")

    args = parser.parse_args()

    # Pfade zu den JSON-Dateien
    rest_file_path = os.path.join(os.path.dirname(__file__), f"../../client/results/REST/", f'{args.rest_filename}.json')
    graphql_file_path = os.path.join(os.path.dirname(__file__), f"../../client/results/GraphQL/", f'{args.graphql_filename}.json')

    # Lese die REST-Daten
    with open(rest_file_path, 'r') as rest_file:
        rest_data = json.load(rest_file)

    # Lese die GraphQL-Daten
    with open(graphql_file_path, 'r') as graphql_file:
        graphql_data = json.load(graphql_file)

    # Kombinierten Boxplot erstellen
    create_combined_boxplot(rest_data, graphql_data, args.rest_filename[4:])
