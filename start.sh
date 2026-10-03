#!/usr/bin/env bash
echo "Starting GeoSetu-India Node.js + Express Backend..."
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR" || exit 1

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo "Starting server on http://localhost:8080 ..."
if command -v xdg-open &>/dev/null; then
    (sleep 2 && xdg-open "http://localhost:8080") &
elif command -v open &>/dev/null; then
    (sleep 2 && open "http://localhost:8080") &
fi

npm start

