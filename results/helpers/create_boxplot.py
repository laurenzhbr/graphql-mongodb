import json
import os
import argparse
import matplotlib.pyplot as plt

def create_boxplot(data, api, use_case):
    # Erstelle einen Boxplot
    plt.figure(figsize=(10, 6))
    plt.boxplot(data)
    plt.title(f'Boxplot for {use_case}')
    plt.ylabel('Response Time (ms)')
    plt.xlabel(use_case)

    # Speicherort für den Boxplot
    output_dir = os.path.join(os.path.dirname(__file__), f'../result_data/{api}')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    file_path = os.path.join(output_dir, f'{use_case}_boxplot.png')
    plt.savefig(file_path)
    plt.close()
    print(f'Boxplot saved to {file_path}')

if __name__ == "__main__":
    # Lese die gesammelten Responsezeiten ein
    # Argumente parsen
    parser = argparse.ArgumentParser(description="Create a boxplot from JSON response times.")
    parser.add_argument('api', type=str, help="The API for which the boxplot is for.")
    parser.add_argument('use_case', type=str, help="The use case name for labeling the plot.")
    parser.add_argument('filename', type=str, help="The JSON file containing response times.")
 
    args = parser.parse_args()

    file_path = os.path.join(os.path.dirname(__file__), f"../../client/results/{args.api}/{args.use_case}", f'{args.filename}.json')
    with open(file_path, 'r') as file:
        data = json.load(file)

    create_boxplot(data, args.api, args.use_case)