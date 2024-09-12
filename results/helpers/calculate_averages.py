import argparse
import json
import os

def calculate_averages(data):
    """
    Berechnet die Durchschnittswerte der übergebenen Metriken.
    """
    averages = {}
    for key, values in data.items():
        if isinstance(values, list) and values:  # Prüfe, ob der Wert eine Liste ist
            averages[key] = sum(values) / len(values)
        else:
            averages[key] = values  # Setze None für nicht-berechenbare Daten
    return averages

def save_averages(averages, output_path):
    """
    Speichert die Durchschnittswerte als JSON.
    """
    with open(output_path, 'w') as f:
        json.dump(averages, f, indent=4)
    print(f"Averages saved to {output_path}")

def process_files_in_folder(folder_path):
    """
    Verarbeitet alle JSON-Dateien in einem angegebenen Ordner.
    """
    # Erstelle den 'averages'-Unterordner, falls er nicht existiert
    averages_folder = os.path.join(folder_path, 'averages')
    if not os.path.exists(averages_folder):
        os.makedirs(averages_folder)

    for filename in os.listdir(folder_path):
        if filename.endswith(".json"):
            input_file_path = os.path.join(folder_path, filename)
            
            # Lese die Daten aus der Datei
            with open(input_file_path, 'r') as f:
                data = json.load(f)

            # Berechne die Durchschnittswerte
            averages = calculate_averages(data)

            # Speichere die Durchschnittswerte in einer neuen Datei
            output_file_path = os.path.join(averages_folder, f"{filename.split('.')[0]}_averages.json")
            save_averages(averages, output_file_path)

if __name__ == "__main__":
    # Argumente parsen
    parser = argparse.ArgumentParser(description="Calculate averages for all JSON files in a folder.")
    parser.add_argument('folder', type=str, help="The folder containing the JSON files.")
    args = parser.parse_args()
    print(args.folder)

    # Pfad zum Ordner
    folder_path = os.path.abspath(args.folder)

    # Verarbeite alle Dateien im angegebenen Ordner
    process_files_in_folder(folder_path)
