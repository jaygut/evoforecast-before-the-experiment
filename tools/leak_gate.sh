#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"

fail() { printf '%s\n' "LEAK GATE FAILED: $1" >&2; exit 1; }

# Ban remote RUNTIME RESOURCES (src=, url()) which would break offline. Outbound
# navigation links (href=https, mailto) are allowed: they never fetch at load.
if rg -n "src=[\"']https?://|url\\([\"']?https?://" index.html technical-note.html styles.css config.js main.js lib scenes; then
  fail "remote runtime resource"
fi
# No external-funder or named-individual references anywhere reader-reachable.
# Case-sensitive \bARIA\b avoids matching aria- attributes, "Arial", and "variation".
if rg -n --case-sensitive '\bARIA\b|\bYannick\b|\bWurm\b' index.html technical-note.html config.js main.js scenes README.md STRATEGY.md data/facts_digest.json audit/claim_registry.tsv audit/final_audit.md; then
  fail "external-funder or named-individual reference (ARIA/Yannick/Wurm)"
fi
if rg -n 'Math\.random' config.js main.js lib scenes; then fail "unseeded randomness"; fi
if rg -n '/Users/|file:///' --glob '!tools/leak_gate.sh' .; then fail "absolute personal path or absolute file URL"; fi
if rg -n -i "(api[_-]?key|access[_-]?token|client[_-]?secret|private[_-]?key)[[:space:]]*[:=][[:space:]]*[\"'][^\"']{8,}" --glob '!audit/reference_captures/*.txt' .; then fail "credential-like assignment"; fi
if rg -n -i '(biologically validated|real Daphnia forecast|world first|genomes predict Daphnia evolution)' index.html technical-note.html config.js main.js scenes README.md STRATEGY.md; then fail "forbidden public wording"; fi
if find . -type f -size +25M -not -path './qa/screenshots/*' -not -path './evidence/*' -print | grep .; then fail "unexpected large file"; fi

python3 - <<'PY'
from pathlib import Path
import json,re,sys
root=Path('.')
digest=json.loads((root/'data/facts_digest.json').read_text())
ids={c['claim_id'] for c in digest['claims']}
html=(root/'index.html').read_text()
for section in re.findall(r'<section class="story-scene[\s\S]*?</section>',html):
    if not re.search(r'EF-\d{3}',section):
        raise SystemExit('LEAK GATE FAILED: scene without registered claim ID')
    if 'source-pill' not in section or 'provenance' not in section or 'caveat' not in section:
        raise SystemExit('LEAK GATE FAILED: scene missing honesty layer')
for claim_id in set(re.findall(r'EF-\d{3}',html)):
    if claim_id not in ids:
        raise SystemExit('LEAK GATE FAILED: unknown claim '+claim_id)
print('exact-key allowlist passed')
PY

# Offline-first data path: window.EVO_DATA must exist, load before main.js, and be
# preferred by main.js so a file:// double-click keeps the interactive layer alive.
# (fetch is retained in main.js only as an online fallback, so it is not banned.)
[ -f data/bundle-data.js ] || fail "missing data/bundle-data.js (offline data bundle)"
rg -q "EVO_DATA" main.js || fail "main.js does not reference window.EVO_DATA (offline-first path)"
python3 - <<'PY'
html = open('index.html').read()
b = html.find('data/bundle-data.js')
m = html.find('src="main.js"')
if b < 0:
    raise SystemExit('LEAK GATE FAILED: index.html does not load data/bundle-data.js')
if m < 0 or b > m:
    raise SystemExit('LEAK GATE FAILED: data/bundle-data.js must load before main.js')
print('offline-first bundle order ok')
PY
python3 tools/build_data_bundle.py --check

printf '%s\n' "leak gate passed"
