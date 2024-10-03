import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import json
import os
import pandas as pd

# Funktion zum Laden der JSON-Daten
def load_data(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def check_normality(data, alpha=0.05):
    mu, std = np.mean(data), np.std(data)
    shapiro_stat, shapiro_p = stats.shapiro(data)
    shapiro_result = "normalverteilt" if shapiro_p > alpha else "nicht normalverteilt"
    return {
        "mean": mu,
        "std_dev": std,
        "shapiro_stat": shapiro_stat,
        "shapiro_p": shapiro_p,
        "shapiro_result": shapiro_result,
    }

def plot_normality(data, output_dir, title="Normalverteilung"):
    stats_results = check_normality(data)
    
    plt.figure(figsize=(12, 6))

    # Subplot 1: Histogramm
    plt.subplot(1, 2, 1)
    plt.hist(data, bins=30, density=True, alpha=0.6, color='g')
    mu, std = stats_results["mean"], stats_results["std_dev"]
    xmin, xmax = plt.xlim()
    x = np.linspace(xmin, xmax, 100)
    p = stats.norm.pdf(x, mu, std)
    plt.plot(x, p, 'k', linewidth=2)
    plt.title(f"Histogram: μ={mu:.2f}, σ={std:.2f}")
    plt.xlabel('Werte')
    plt.ylabel('Dichte')

    # Subplot 2: Q-Q-Plot
    plt.subplot(1, 2, 2)
    stats.probplot(data, dist="norm", plot=plt)
    plt.title("Q-Q-Plot")

    plt.tight_layout(rect=[0, 0, 1, 0.95])
    plt.savefig(os.path.join(output_dir, f"{title}.png"))
    plt.close()

    return stats_results

def test_normality(data):
    stat, p = stats.shapiro(data)
    return p > 0.05

def perform_stat_test(rest_data, gql_data, metric):
    rest_values = rest_data[metric]
    gql_values = gql_data[metric]

    rest_normal = test_normality(rest_values)
    gql_normal = test_normality(gql_values)

    if rest_normal and gql_normal:
        stat, p = stats.ttest_ind(rest_values, gql_values)
        test_type = 't-test'
    else:
        stat, p = stats.mannwhitneyu(rest_values, gql_values)
        test_type = 'Mann-Whitney-U-Test'

    return test_type, p

if __name__ == "__main__":
    rest_dir = 'results/REST'
    gql_dir = 'results/GraphQL'
    graph_dir = 'results/graphs'
    
    # Mehrere Metriken
    metrics = ["sum_response_time", "total_data_transferred"]

    # Excel Writer für die Ergebnisse
    with pd.ExcelWriter('results/statistical_results.xlsx', engine='xlsxwriter') as writer:
        for metric in metrics:
            result_data = []  # Ergebnisse für jede Metrik
            for rest_file in sorted(os.listdir(rest_dir)):
                if rest_file.startswith("rest") and rest_file.endswith(".json"):
                    use_case_id = rest_file.replace('rest', '').replace('.json', '')  # Extrahiere die Use-Case-ID

                    rest_data = load_data(os.path.join(rest_dir, rest_file))
                    gql_file = f"gql{use_case_id}.json"
                    gql_data = load_data(os.path.join(gql_dir, gql_file))

                    # Erstellen der Verzeichnisse für die Graphen
                    rest_graph_dir = os.path.join(graph_dir, use_case_id, 'REST')
                    gql_graph_dir = os.path.join(graph_dir, use_case_id, 'GraphQL')
                    os.makedirs(rest_graph_dir, exist_ok=True)
                    os.makedirs(gql_graph_dir, exist_ok=True)

                    # Plots für REST
                    rest_stats = plot_normality(rest_data[metric], rest_graph_dir, title=f"REST {metric}")

                    # Plots für GraphQL
                    gql_stats = plot_normality(gql_data[metric], gql_graph_dir, title=f"GraphQL {metric}")

                    # Statistischer Test
                    test_type, p_value = perform_stat_test(rest_data, gql_data, metric)

                    # Ergebnisse für diesen Use-Case und diese Metrik sammeln
                    result_data.append({
                        'Use Case': use_case_id,
                        'Metric': metric,
                        'REST Mean': rest_stats['mean'],
                        'REST Std Dev': rest_stats['std_dev'],
                        'GraphQL Mean': gql_stats['mean'],
                        'GraphQL Std Dev': gql_stats['std_dev'],
                        'Shapiro REST p-value': rest_stats['shapiro_p'],
                        'Shapiro GraphQL p-value': gql_stats['shapiro_p'],
                        'Significant Difference': 'Yes' if p_value < 0.05 else 'No',
                        'Test Type': test_type,
                        'p-value': p_value
                    })

            # Ergebnisse der Metrik in ein separates Blatt schreiben
            df = pd.DataFrame(result_data)
            df.to_excel(writer, index=False, sheet_name=f'{metric}_Results')

    print("Statistical analysis and graph generation complete.")
