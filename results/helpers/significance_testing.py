import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import json
import os

# Funktion zum Laden der JSON-Daten
def load_data(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def check_normality(data, alpha=0.05):
    """
    Überprüft die Normalverteilung der Daten durch Tests und statistische Kennwerte.
    Gibt die Ergebnisse zurück.
    """
    # Statistische Kennwerte
    mu, std = np.mean(data), np.std(data)
    # skewness = stats.skew(data)
    # kurtosis = stats.kurtosis(data)
    
    # Shapiro-Wilk Test
    shapiro_stat, shapiro_p = stats.shapiro(data)
    
    # D'Agostino's K² Test
    dagostino_stat, dagostino_p = stats.normaltest(data)
    
    # Ergebnis des Shapiro-Wilk-Tests
    shapiro_result = "normalverteilt" if shapiro_p > alpha else "nicht normalverteilt"
    
    # Ergebnis des D'Agostino's K² Tests
    dagostino_result = "normalverteilt" if dagostino_p > alpha else "nicht normalverteilt"
    
    return {
        "mean": mu,
        "std_dev": std,
        "shapiro_stat": shapiro_stat,
        "shapiro_p": shapiro_p,
        "shapiro_result": shapiro_result,
        "dagostino_stat": dagostino_stat,
        "dagostino_p": dagostino_p,
        "dagostino_result": dagostino_result,
    }

def plot_normality(data, title="Normalverteilung"):
    # Überprüfe die Normalverteilung und erhalte statistische Ergebnisse
    stats_results = check_normality(data)
    
    """ # Erstelle das Histogramm und den Q-Q-Plot
    plt.figure(figsize=(12, 6))

    # Subplot 1: Histogramm
    plt.subplot(1, 2, 1)
    plt.hist(data, bins=30, density=True, alpha=0.6, color='g')
    mu, std = stats_results["mean"], stats_results["std_dev"]
    xmin, xmax = plt.xlim()
    x = np.linspace(xmin, xmax, 100)
    p = stats.norm.pdf(x, mu, std)
    plt.plot(x, p, 'k', linewidth=2)
    title_hist = "Histogram and Normal Distribution Fit"
    plt.title(f"{title_hist}\nμ={mu:.2f}, σ={std:.2f}")
    plt.xlabel('Werte')
    plt.ylabel('Dichte')

    # Subplot 2: Q-Q-Plot
    plt.subplot(1, 2, 2)
    stats.probplot(data, dist="norm", plot=plt)
    plt.title("Q-Q-Plot")

    # Gesamtplot anzeigen
    plt.suptitle(title)
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    plt.show() """

    # Drucke die relevanten Daten für die Normalverteilung
    print("=== Statistische Kennwerte ===")
    print(f"Mittelwert (μ): {stats_results['mean']:.2f}")
    print(f"Standardabweichung (σ): {stats_results['std_dev']:.2f}")
    print("\n=== Shapiro-Wilk Test ===")
    print(f"Teststatistik: {stats_results['shapiro_stat']:.4f}")
    print(f"p-Wert: {stats_results['shapiro_p']:.4f}")
    print(f"Ergebnis: Die Daten sind {stats_results['shapiro_result']}\n")
    # print("\n=== D'Agostino's K² Test ===")
    # print(f"Teststatistik: {stats_results['dagostino_stat']:.4f}")
    # print(f"p-Wert: {stats_results['dagostino_p']:.4f}")
    # print(f"Ergebnis: Die Daten sind {stats_results['dagostino_result']}\n")

# Shapiro-Wilk-Test zur Überprüfung der Normalverteilung
def test_normality(data):
    stat, p = stats.shapiro(data)
    if p > 0.05:
        return True  # Daten sind normalverteilt
    else:
        return False  # Daten sind nicht normalverteilt

# Durchführung eines statistischen Tests
def perform_stat_test(rest_data, gql_data, metric):
    # Daten extrahieren
    rest_values = rest_data[metric]
    gql_values = gql_data[metric]

    # Test auf Normalverteilung
    rest_normal = test_normality(rest_values)
    gql_normal = test_normality(gql_values)

    # Anzeigen des Histogramms und Q-Q-Plots für Normalverteilung
    print("#####  REST  #####")
    plot_normality(rest_values, title=f"REST {metric}")
    print("#####  GraphQL  #####")
    plot_normality(gql_values, title=f"GQL {metric}")

    # Wähle den passenden Test basierend auf der Verteilung
    if rest_normal and gql_normal:
        # t-Test für normalverteilte Daten
        stat, p = stats.ttest_ind(rest_values, gql_values)
        test_type = 't-test'
    else:
        # Mann-Whitney-U-Test für nicht normalverteilte Daten
        stat, p = stats.mannwhitneyu(rest_values, gql_values)
        test_type = 'Mann-Whitney-U-Test'

    return test_type, p

if __name__ == "__main__":
    # Lade die JSON-Daten für REST und GraphQL
    rest_file = 'results/REST/rest1.json'
    gql_file = 'results/GraphQL/gql1.json'

    rest_data = load_data(rest_file)
    gql_data = load_data(gql_file)

    # Liste der Metriken, die getestet werden sollen
    metrics = ["sum_response_time", "cpu_used_by_server", "memory_used_by_server", "api_call_count"]

    # Teste jede Metrik
    for metric in metrics:
        print(f"################## {metric} ############\n")
        test_type, p_value = perform_stat_test(rest_data, gql_data, metric)
        print(f"{metric}: {test_type} p-value = {p_value}")

        # Überprüfe, ob der Unterschied signifikant ist (p < 0.05)
        if p_value < 0.05:
            print(f"Der Unterschied in {metric} ist signifikant.\n\n")
        else:
            print(f"Der Unterschied in {metric} ist nicht signifikant.\n\n")
