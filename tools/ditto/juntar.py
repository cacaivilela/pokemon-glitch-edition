"""Junta as marcas dos pedaços (tools/ditto/marcas/*.json) com as do CAIO
(dev/captures/cara_ditto.log, que ganham sempre) em src/data/cara-ditto.json."""
import json, glob, os
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
M = {}
for f in sorted(glob.glob(f"{R}/tools/ditto/marcas/*.json")):
    try: M.update(json.load(open(f)))
    except Exception as e: print("pulei", f, e)
dele = {}
try: dele = json.load(open(f"{R}/dev/captures/cara_ditto.log"))
except Exception: pass
M.update(dele)
json.dump(M, open(f"{R}/src/data/cara-ditto.json", "w"))
print("marcas", len(M), "do CAIO", len(dele))
