import numpy as np
from scipy import stats
import json
import os

# Funktion zum Laden der JSON-Daten
def load_data(filename):
    with open(filename, 'r') as f:
        return json.load(f)

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
    rest_file = 'results/REST/averages/rest1_averages.json'
    gql_file = 'results/GraphQL/averages/gql1_averages.json'

    rest_data = load_data(rest_file)
    gql_data = load_data(gql_file)

    # Liste der Metriken, die getestet werden sollen
    metrics = ["duration_of_all_calls", "cpu_used_by_server", "memory_used_by_server", "total_data_transferred"]

    # Teste jede Metrik
    for metric in metrics:
        test_type, p_value = perform_stat_test(rest_data, gql_data, metric)
        print(f"{metric}: {test_type} p-value = {p_value}")

        # Überprüfe, ob der Unterschied signifikant ist (p < 0.05)
        if p_value < 0.05:
            print(f"Der Unterschied in {metric} ist signifikant.")
        else:
            print(f"Der Unterschied in {metric} ist nicht signifikant.")
