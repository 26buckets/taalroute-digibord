#!/bin/zsh
cd -- "${0:A:h}" || exit 1
/usr/bin/python3 - "$@" <<'PY'
from pathlib import Path
import subprocess
import sys
import time
import urllib.request

folder = Path.cwd()
url = 'http://127.0.0.1:61381/Start-Praatpad.html'

def ready():
    try:
        with urllib.request.urlopen(url, timeout=1) as response:
            return b'<title>Taalroute DigiBoard' in response.read()
    except Exception:
        return False

try:
    if not (folder / 'Start-Praatpad.html').is_file():
        raise RuntimeError('Het lespakket is niet gevonden. Zet dit startbestand naast Start-Praatpad.html.')
    if not ready():
        logs = Path.home() / 'Library' / 'Logs' / 'DigiBoard'
        logs.mkdir(parents=True, exist_ok=True)
        with (logs / 'lokale-server.log').open('ab') as log:
            child = subprocess.Popen(
                [sys.executable, '-m', 'http.server', '61381', '--bind', '127.0.0.1', '--directory', str(folder)],
                stdin=subprocess.DEVNULL, stdout=log, stderr=log,
                start_new_session=True, close_fds=True)
        for _ in range(40):
            if ready():
                break
            if child.poll() is not None:
                raise RuntimeError('De lokale server kon niet starten. Mogelijk gebruikt een ander programma poort 61381.')
            time.sleep(0.1)
        else:
            raise RuntimeError('DigiBoard reageert nog niet. Probeer het startbestand opnieuw.')
    print('DigiBoard is gestart: ' + url)
    print('Je kunt dit venster sluiten; DigiBoard blijft beschikbaar.')
    if '--no-open' not in sys.argv:
        subprocess.run(['/usr/bin/open', url], check=True)
except Exception as error:
    print('\nStarten niet gelukt: ' + str(error))
    sys.exit(1)
PY
status_code=$?
if [[ $status_code -ne 0 ]]; then
  read -r '?Druk op Enter om dit venster te sluiten.'
fi
exit $status_code
