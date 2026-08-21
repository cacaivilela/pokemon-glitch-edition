#!/usr/bin/env bash
# Sobe o dev server com live update. Uso: ./run.sh [porta]
cd "$(dirname "$0")" || exit 1
exec python3 dev_server.py -p "${1:-5173}"
