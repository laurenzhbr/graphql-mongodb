#!/bin/bash

# Überprüfen, ob ein Datenbankname als Argument übergeben wurde
if [ -z "$1" ]; then
  echo "Bitte den Datenbanknamen als Parameter angeben."
  exit 1
fi

DB_NAME=$1

# Log-Ordner definieren und erstellen, falls er nicht existiert
LOG_DIR="./logs/logs_setup"
mkdir -p "$LOG_DIR"

# Log-Datei definieren (mit Zeitstempel für eindeutige Namen)
LOG_FILE="$LOG_DIR/setup-data-$(date +%Y%m%d-%H%M%S).log"

# Alles in die Log-Datei umleiten
exec > >(tee -a "$LOG_FILE") 2>&1

echo "Starte Setup-Prozess, logge alles in $LOG_FILE..."

# 1. Ausführen der Datei "server/utils/generateGeoAdressData.js"
#echo "Running GeoAddress Data generation..."
#DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/generateGeoAdressData.js
#if [ $? -ne 0 ]; then
#    echo "Error while running generateGeoAdressData.js"
#    exit 1
#fi

# 2. Ausführen der Datei "server/utils/generateOrganization.js"
#echo "Running Organization Data generation..."
#DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/generateOrganization.js
#if [ $? -ne 0 ]; then
#    echo "Error while running generateOrganization.js"
#    exit 1
#fi

# 3. Ausführen der Datei "server/utils/generateCentralOffice.js"
echo "Running Central Office Data generation..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/generateCentralOffice.js
if [ $? -ne 0 ]; then
    echo "Error while running generateCentralOffice.js"
    exit 1
fi

# 4. Ausführen der Datei "server/utils/generateStreetCabinets.js"
echo "Running Street Cabinets Data generation..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/generateStreetCabinets.js
if [ $? -ne 0 ]; then
    echo "Error while running generateStreetCabinets.js"
    exit 1
fi

# 5. Ausführen der Datei "server/utils/generateModems.js"
echo "Running Modems Data generation..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/generateModem.js
if [ $? -ne 0 ]; then
    echo "Error while running generateModem.js"
    exit 1
fi

# 6. Ausführen der Datei "server/utils/generateRouters.js"
echo "Running Routers Data generation..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/generateRouter.js
if [ $? -ne 0 ]; then
    echo "Error while running generateRouter.js"
    exit 1
fi

# 7. Ausführen der Datei "server/utils/generateDigitalIdentity.js"
echo "Running Digital Identity Data generation..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/generateDigitalIdentity.js
if [ $? -ne 0 ]; then
    echo "Error while running generateDigitalIdentity.js"
    exit 1
fi

# 8. Ausführen der Datei "server/utils/linkCoToSc.js"
echo "Linking Central Office to Street Cabinets..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/linkCoToSc.js
if [ $? -ne 0 ]; then
    echo "Error while running linkCoToSc.js"
    exit 1
fi

# 9. Ausführen der Datei "server/utils/linkScToModem.js"
echo "Linking Street Cabinets to Modems..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/linkScToModem.js
if [ $? -ne 0 ]; then
    echo "Error while running linkScToModem.js"
    exit 1
fi

# 10. Ausführen der Datei "server/utils/linkModemToRouter.js"
echo "Linking Modems to Routers..."
DB_NAME=$DB_NAME node --max-old-space-size=16384 server/utils/linkModemToRouter.js
if [ $? -ne 0 ]; then
    echo "Error while running linkModemToRouter.js"
    exit 1
fi

echo "Test environment setup completed successfully."

