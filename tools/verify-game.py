"""Browser combat/asset/UI regression checks. Requires Python and playwright.

Run: python tools/verify-game.py
Optional: --base-url http://127.0.0.1:8080/Costume-Combat/ --browser PATH
The default run starts and closes its own local HTTP server.
"""
import argparse
import functools
import http.server
import json
import os
from pathlib import Path
import shutil
import sys
import threading

ROOT = Path(__file__).resolve().parent.parent
# Also recognize a workspace-only Playwright install used during development.
sys.path.insert(0, str(ROOT / '.codex-analysis' / 'python-packages'))
from playwright.sync_api import sync_playwright


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def run():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url')
    parser.add_argument('--browser')
    args = parser.parse_args()
    server = None
    if not args.base_url:
        handler = functools.partial(QuietHandler, directory=str(ROOT))
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        args.base_url = f'http://127.0.0.1:{server.server_port}/'
    candidates = [args.browser, shutil.which('google-chrome'), shutil.which('chromium'),
                  r'C:\Program Files\Google\Chrome\Application\chrome.exe',
                  r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe']
    executable = next((p for p in candidates if p and Path(p).is_file()), None)
    artifact_dir = ROOT / '.codex-analysis'
    artifact_dir.mkdir(exist_ok=True)
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(**({'executable_path': executable} if executable else {}), headless=True)
            page = browser.new_page(viewport={'width':1366,'height':900})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(args.base_url, wait_until='networkidle')
            page.click('#cpu-mode-button')
            page.screenshot(path=str(artifact_dir / 'setup.png'))
            page.click('#begin-match-button')
            page.wait_for_function('costumeCombat.phase === "active"', timeout=20000)
            results = page.evaluate((ROOT / 'tools' / 'combat-checks.js').read_text(encoding='utf-8'))
            print(json.dumps({'combatChecks':results['checks'],'combatFailures':results['failures']}),flush=True)
            checks = results['results']

            def check(name, condition, **details):
                checks.append(dict(name=name, pass_=bool(condition), **details))

            # Test audio on its live browser graph rather than just inspecting
            # score constants: music must make a signal and mute must silence it.
            page.evaluate('''() => {
              const g=costumeCombat;
              g.spearElement.classList.remove('is-active');
              g.paused=false; g.cpuNextThink=performance.now()+60000; g.cpuMoveUntil=0;
              g.sound.setEnabled(true); g.updateSoundButtons();
              const analyser=g.sound.context.createAnalyser(); analyser.fftSize=2048;
              g.sound.master.connect(analyser); window.audioProbe=analyser;
            }''')
            for scene in ['menu','setup','controller','moon-gate','ember-forge','neon-rooftop','finish','result']:
                page.evaluate('(scene) => costumeCombat.sound.setScene(scene)', scene)
                page.wait_for_timeout(240)
                signal = page.evaluate('''() => {const a=new Float32Array(audioProbe.fftSize);audioProbe.getFloatTimeDomainData(a);return Math.max(...a.map(Math.abs));}''')
                check(f'{scene} music produces audio', signal > 0.00001, peak=signal)
            page.click('#sound-button')
            page.wait_for_timeout(180)
            check('mute silences music and samples', page.evaluate('''() => {const a=new Float32Array(audioProbe.fftSize);audioProbe.getFloatTimeDomainData(a);return Math.max(...a.map(Math.abs))<0.0001 && costumeCombat.sound.activeSamples.size===0;}'''))
            page.click('#sound-button')

            page.click('#moves-button')
            paused = page.evaluate('({time:costumeCombat.roundTime, paused:costumeCombat.paused, audio:costumeCombat.sound.paused})')
            page.wait_for_timeout(180)
            check('move list pauses combat and sound', paused['paused'] and paused['audio'] and page.evaluate('costumeCombat.roundTime') == paused['time'])
            page.keyboard.press('Escape')
            page.wait_for_function('!document.querySelector("#moves-dialog").open && !costumeCombat.paused')
            check('closing move list resumes combat', page.evaluate('!costumeCombat.paused && !costumeCombat.sound.paused'))
            page.keyboard.press('Escape')
            check('Escape pauses combat', page.evaluate('costumeCombat.paused'))
            page.click('#resume-button')

            # Viewport and stage rendering, with both fighters on the same floor.
            page.evaluate('''() => { const g=costumeCombat;g.paused=true;g.player.setPosition(35);g.cpu.setPosition(65);g.player.playIdle(true);g.cpu.playIdle(true);g.spearElement.classList.remove('is-active'); }''')
            for width,height in [(960,640),(1366,900),(1920,1080)]:
                page.set_viewport_size({'width':width,'height':height})
                check(f'fighter bounds fit at {width}px', page.evaluate('''() => {const g=costumeCombat,a=g.arena.getBoundingClientRect();return [g.player,g.cpu].every(f=>{const r=f.element.getBoundingClientRect();return r.left>=a.left && r.right<=a.right && r.bottom<=a.bottom;});}'''))
            page.set_viewport_size({'width':1366,'height':900})
            for stage in ['moon-gate','ember-forge','neon-rooftop']:
                page.evaluate('(stage) => {costumeCombat.arena.className=`arena stage-${stage}`;costumeCombat.sound.setScene(stage);}', stage)
                page.screenshot(path=str(artifact_dir / f'{stage}.png'))

            page.click('#exit-button')
            check('exit returns to menu music', page.evaluate('costumeCombat.phase === "menu" && costumeCombat.sound.scene === "menu"'))
            page.click('#cpu-mode-button')
            page.click('[data-side="player"][data-fighter="drift"]')
            page.click('[data-side="cpu"][data-fighter="scorpion"]')
            page.click('[data-stage="neon-rooftop"]')
            page.click('#begin-match-button')
            page.wait_for_function('costumeCombat.phase === "active"',timeout=20000)
            check('Drift playable against Scorpion', page.evaluate('costumeCombat.player.character === "drift" && costumeCombat.cpu.character === "scorpion" && document.querySelector("#player-name").textContent === "Drift"'))
            check('stage selection changes music', page.evaluate('costumeCombat.sound.scene === "neon-rooftop"'))
            page.evaluate('costumeCombat.showResult(costumeCombat.player)')
            check('result names selected fighter and changes music', page.evaluate('document.querySelector("#result-title").textContent === "Drift Wins" && costumeCombat.sound.scene === "result"'))
            page.click('#rematch-button')
            page.wait_for_function('costumeCombat.phase === "active"',timeout=20000)
            check('rematch resets scores and health', page.evaluate('costumeCombat.player.rounds===0 && costumeCombat.cpu.rounds===0 && costumeCombat.player.health===100 && costumeCombat.cpu.health===100'))

            failures = [c for c in checks if not c.get('pass',c.get('pass_',False))]
            report = dict(checks=len(checks), failures=failures, browserErrors=errors, results=checks)
            (artifact_dir / 'verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
            print(json.dumps(dict(checks=len(checks),failures=failures,browserErrors=errors),indent=2))
            browser.close()
            return 1 if failures or errors else 0
    finally:
        if server:
            server.shutdown()
            server.server_close()


if __name__ == '__main__':
    raise SystemExit(run())
