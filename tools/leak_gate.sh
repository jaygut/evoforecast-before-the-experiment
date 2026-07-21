#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT"

fail() { printf '%s\n' "LEAK GATE FAILED: $1" >&2; exit 1; }

# Assemble retired proper nouns at runtime so the public tree does not itself
# retain the names it is designed to reject. The project author is an explicit
# user-approved exception and is checked separately below. The first expression excludes
# accessibility attributes such as aria-hidden and substrings such as variation.
RETIRED_FUNDER=$(printf '\101\122\111\101')
RETIRED_GIVEN=$(printf '\131\141\156\156\151\143\153')
RETIRED_SURNAME=$(printf '\127\165\162\155')
BLOCKED_NAME_RE="(?<![A-Za-z])${RETIRED_FUNDER}(?![A-Za-z_-])|${RETIRED_FUNDER}_(predicting|v5)|${RETIRED_FUNDER}-(strategic|brief)|\\b${RETIRED_GIVEN}\\b|\\b${RETIRED_SURNAME}\\b"
POUND_SIGN=$(printf '\302\243')
EURO_SIGN=$(printf '\342\202\254')
GBP_TOKEN=$(printf '\107\102\120')
EUR_TOKEN=$(printf '\105\125\122')
POUND_WORD=$(printf '\160\157\165\156\144')
EURO_WORD=$(printf '\145\165\162\157')
BLOCKED_CURRENCY_RE="${POUND_SIGN}|${EURO_SIGN}|\\b${GBP_TOKEN}\\b|\\b${EUR_TOKEN}\\b|\\b${POUND_WORD}s?\\b|\\b${EURO_WORD}s?\\b"
NETWORK_OVERCLAIM_RE='ecological network dynamics are being '"developed|eco-?evolutionary feedback is "'represented|feedback is '"represented rather than assumed away"

# Ban remote RUNTIME RESOURCES (src=, url()) which would break offline. Outbound
# navigation links (href=https, mailto) are allowed: they never fetch at load.
if rg -n "src=[\"']https?://|url\\([\"']?https?://" index.html technical-note.html styles.css config.js main.js lib scenes; then
  fail "remote runtime resource"
fi
# Enforce the public-tree boundary in all text-like files, not only the page entry
# points. Vendor code is third-party and PDFs/DOCX are inspected as extracted text
# below. This catches stale tools, generators, audit prose, and data ledgers.
if rg -n -i --pcre2 "$BLOCKED_NAME_RE" --hidden --glob '!.git/**' --glob '!assets/vendor/**' --glob '!*.pdf' --glob '!*.docx' .; then
  fail "retired external-funder or named-individual reference"
fi
# Narrow public-author exception, explicitly confirmed by the user. Require the
# exact identity and both requested contact routes in every reader-facing companion.
for author_file in index.html technical-note.html; do
  rg -q 'Jay Gutierrez, PhD' "$author_file" || fail "missing approved author identity in $author_file"
  rg -q 'jg@graphoflife\.com' "$author_file" || fail "missing approved author email in $author_file"
  rg -q 'biome-translator\.emergent\.host' "$author_file" || fail "missing approved author site in $author_file"
done
if rg -n -i --pcre2 "$BLOCKED_CURRENCY_RE" --hidden --glob '!.git/**' --glob '!assets/vendor/**' --glob '!*.pdf' --glob '!*.docx' .; then
  fail "non-USD currency reference"
fi
if rg -n -i --pcre2 "$NETWORK_OVERCLAIM_RE" --hidden --glob '!.git/**' --glob '!assets/vendor/**' --glob '!*.pdf' --glob '!*.docx' .; then
  fail "ecological-network direction represented as an achievement"
fi
if rg -n 'Math\.random' config.js main.js lib scenes; then fail "unseeded randomness"; fi
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git grep -n -I -E '/Users/|file:///' -- . ':(exclude)tools/leak_gate.sh'; then
    fail "absolute personal path or absolute file URL in a publishable file"
  fi
elif rg -n '/Users/|file:///' --glob '!tools/leak_gate.sh' .; then
  fail "absolute personal path or absolute file URL"
fi
if rg -n -i "(api[_-]?key|access[_-]?token|client[_-]?secret|private[_-]?key)[[:space:]]*[:=][[:space:]]*[\"'][^\"']{8,}" .; then fail "credential-like assignment"; fi
if rg -n -i '(biologically validated|real Daphnia forecast|world first|genomes predict Daphnia evolution)' index.html technical-note.html config.js main.js scenes README.md STRATEGY.md; then fail "forbidden public wording"; fi
if find . -type f -size +25M -not -path './qa/screenshots/*' -not -path './evidence/*' -print | grep .; then fail "unexpected large file"; fi

# The two linked download/print companions are binary containers, so inspect their
# reader-visible text and every XML relationship part rather than trusting a raw
# byte scan. The relationship scan catches stale links that are no longer visible.
TMPDIR_GATE=$(mktemp -d "${TMPDIR:-/tmp}/evoforecast-leak-gate.XXXXXX")
trap 'rm -rf "$TMPDIR_GATE"' EXIT HUP INT TERM
command -v pdftotext >/dev/null 2>&1 || fail "pdftotext is required to audit the linked PDF"
command -v unzip >/dev/null 2>&1 || fail "unzip is required to audit the linked DOCX"
pdftotext technical-note.pdf "$TMPDIR_GATE/technical-note.txt" || fail "could not extract technical-note.pdf"
python3 - "$TMPDIR_GATE/decision-brief.txt" <<'PY'
from pathlib import Path
import sys
from zipfile import ZipFile
from xml.etree import ElementTree as ET

allowed = {"https://jaygut.github.io/evoforecast-before-the-experiment/"}
unexpected = []
with ZipFile("EvoForecast-decision-brief.docx") as package:
    document = ET.fromstring(package.read("word/document.xml"))
    visible = "\n".join(
        node.text or ""
        for node in document.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t")
    )
    Path(sys.argv[1]).write_text(visible, encoding="utf-8")
    for name in package.namelist():
        if not name.endswith(".rels"):
            continue
        root = ET.fromstring(package.read(name))
        for relationship in root:
            if relationship.get("TargetMode") == "External" and relationship.get("Target") not in allowed:
                unexpected.append((name, relationship.get("Target")))
if unexpected:
    raise SystemExit("LEAK GATE FAILED: unexpected external DOCX relationship: " + repr(unexpected))
print("DOCX external-relationship allowlist passed")
PY
for extracted in "$TMPDIR_GATE/technical-note.txt" "$TMPDIR_GATE/decision-brief.txt"; do
  if rg -n -i --pcre2 "$BLOCKED_NAME_RE|$BLOCKED_CURRENCY_RE" "$extracted"; then
    fail "retired name or non-USD currency in a linked companion"
  fi
  if rg -n -i --pcre2 "$NETWORK_OVERCLAIM_RE" "$extracted"; then
    fail "ecological-network overclaim in a linked companion"
  fi
  rg -q 'Jay Gutierrez, PhD' "$extracted" || fail "linked companion is missing approved author identity"
  rg -q 'jg@graphoflife\.com' "$extracted" || fail "linked companion is missing approved author email"
  rg -q 'biome-translator\.emergent\.host' "$extracted" || fail "linked companion is missing approved author site"
  if rg -n '[—–;]' "$extracted"; then
    fail "em dash, en dash, or semicolon in linked companion prose"
  fi
  if rg -n -i --pcre2 '\bnot only\b|\bnot just\b|\bnot [^.,;]{1,40}\bbut\b|\b(?:this|that|it|they) (?:is|are|does|do) not\b|\bdo not\b|\bdoes not\b|\bcannot\b' "$extracted"; then
    fail "stock negation pattern in linked companion prose"
  fi
done

python3 - <<'PY'
from pathlib import Path
import json,re,sys
root=Path('.')
digest=json.loads((root/'data/facts_digest.json').read_text())
trajectory=json.loads((root/'data/trajectory_case.json').read_text())
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
summary=trajectory['summary']
if summary != {
    'founder_count': 8,
    'horizon_days': 90,
    'initial_daphnia_count': 80,
    'particle_count_per_producer_species': 400,
    'present_day90': 32,
    'replicate_count': 32,
}:
    raise SystemExit('LEAK GATE FAILED: trajectory summary changed')
if trajectory['selection_rule'] != 'all passed adaptive_E07 replicates in job-manifest order':
    raise SystemExit('LEAK GATE FAILED: trajectory selection rule changed')
if [row['replicate'] for row in trajectory['replicates']] != list(range(32)):
    raise SystemExit('LEAK GATE FAILED: trajectory replicate inventory changed')
if any(len(row['days']) != 91 or row['days'][0]['daphnia_count'] != 80 or row['days'][-1]['daphnia_count'] <= 0 for row in trajectory['replicates']):
    raise SystemExit('LEAK GATE FAILED: trajectory row invariant changed')
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
