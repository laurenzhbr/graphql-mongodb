#!/bin/bash

# Überprüfen, ob ein Datenbankname als Argument übergeben wurde
if [ -z "$1" ]; then
  echo "Bitte den Datenbanknamen als Parameter angeben."
  exit 1
fi

DB_NAME=$1

# Log-Ordner definieren und erstellen, falls er nicht existiert
LOG_DIR="./logs/logs_testsuite"
mkdir -p "$LOG_DIR"

# Log-Datei definieren (mit Zeitstempel für eindeutige Namen)
LOG_FILE="$LOG_DIR/run-testsuite-$(date +%Y%m%d-%H%M%S).log"

# Alles in die Log-Datei umleiten
exec > >(tee -a "$LOG_FILE") 2>&1

echo "Starte Setup-Prozess, logge alles in $LOG_FILE..."

# 1. Server starten
echo "Starting server..."
DB_NAME=$DB_NAME node server/index.js &
SERVER_PID=$!
if [ $? -ne 0 ]; then
    echo "Error while starting the server"
    exit 1
fi

# Warte auf Benutzereingabe, um Server und Client zu starten
echo "Server läuft! Press Enter um den Client zu starten..."
read -p ""

# 2. Client starten
echo "Starting client..."
node client/client.js &
CLIENT_PID=$!
if [ $? -ne 0 ]; then
    echo "Error while starting the client"
    exit 1
fi

# Warte auf die Beendigung des Servers und Clients
wait $SERVER_PID $CLIENT_PID

echo "Server and client have stopped."
