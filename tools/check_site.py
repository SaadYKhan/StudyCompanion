"""Open the built site in a real browser and make sure it works before it is pushed.

Usage: python3 tools/check_site.py [site folder] [--shots <folder>]

Serves the folder on a local port, loads the page on three different "today" dates, visits every tab,
fills in each form once, and fails (exit 1) when
  - the page throws or logs an error, or a file it asks for is missing,
  - any tab shows "undefined", "NaN", "Invalid" or "[object Object]",
  - a form entry does not show up where it should.
Exit 3 means the browser could not be started, so nothing was tested.
"""
import functools, http.server, os, socketserver, sys, threading

args = sys.argv[1:]
shots = None
if '--shots' in args:
    i = args.index('--shots'); shots = args[i + 1]; del args[i:i + 2]
site = os.path.abspath(args[0] if args else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'site'))

try:
    from playwright.sync_api import sync_playwright
except Exception as e:
    print('page test not run: no browser library available:', e); sys.exit(3)


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


httpd = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=site))
port = httpd.server_address[1]
threading.Thread(target=httpd.serve_forever, daemon=True).start()
TABS = ['overview', 'dates', 'alevel', 'sat', 'maths', 'log', 'sources']
BAD = ('undefined', 'NaN', '[object Object]', 'Invalid Date')
fails = []

try:
    with sync_playwright() as p:
        try:
            br = p.chromium.launch()
        except Exception:
            try:
                br = p.chromium.launch(executable_path='/usr/bin/google-chrome')
            except Exception as e:
                print('page test not run: browser would not start:', e); sys.exit(3)
        for today, width in (('2026-11-16', 1360), ('2027-05-08', 390), ('2027-09-20', 1024)):
            ctx = br.new_context(viewport={'width': width, 'height': 900})
            pg = ctx.new_page()
            errs = []
            pg.on('pageerror', lambda e: errs.append('page error: ' + str(e)))
            pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
            pg.on('response', lambda r: errs.append(f'{r.status} {r.url}') if r.status >= 400 else None)
            pg.goto(f'http://127.0.0.1:{port}/?today={today}', wait_until='networkidle')
            for t in TABS:
                pg.click(f'[data-tab="{t}"]')
                pg.wait_for_timeout(120)
                txt = pg.inner_text(f'#t-{t}')
                if len(txt.strip()) < 40:
                    fails.append(f'{today}: tab {t} is nearly empty')
                for b in BAD:
                    if b in txt:
                        fails.append(f'{today}: tab {t} shows {b!r}')
                if shots:
                    os.makedirs(shots, exist_ok=True)
                    pg.screenshot(path=os.path.join(shots, f'{today}-{width}-{t}.png'), full_page=True)
            if today == '2026-11-16':
                # forms and toggles
                pg.click('[data-tab="sat"]'); pg.wait_for_timeout(400)
                pg.fill('form[data-form="sat"] [name="rw"]', '640'); pg.fill('form[data-form="sat"] [name="m"]', '700')
                pg.click('form[data-form="sat"] button[type="submit"]'); pg.wait_for_timeout(400)
                pg.fill('form[data-form="sat"] [name="date"]', '2026-12-20')
                pg.fill('form[data-form="sat"] [name="rw"]', '680'); pg.fill('form[data-form="sat"] [name="m"]', '740')
                pg.click('form[data-form="sat"] button[type="submit"]')
                if '1420' not in pg.inner_text('#t-sat') or pg.locator('#satChart circle').count() != 2:
                    fails.append('SAT score did not appear in table and chart: circles=%d has1420=%s' % (pg.locator('#satChart circle').count(), '1420' in pg.inner_text('#t-sat')))
                pg.click('[data-tab="alevel"]'); pg.wait_for_timeout(400)
                pg.click('[data-act="topic"][data-k="WPH11:0"][data-v="2"]')
                pg.click('[data-act="topic"][data-k="WPH11:1"][data-v="1"]')
                pg.fill('form[data-form="paper"] [name="paper"]', 'Jan 2024'); pg.fill('form[data-form="paper"] [name="pct"]', '72')
                pg.click('form[data-form="paper"] button[type="submit"]')
                if 'Jan 2024' not in pg.inner_text('#t-alevel'):
                    fails.append('past paper did not appear')
                pg.click('[data-act="route"][data-v="S1"]')
                if 'Statistics 1' not in pg.inner_text('#t-alevel'):
                    fails.append('S1 route did not switch the timetable')
                pg.click('[data-act="route"][data-v="M1"]')
                pg.click('[data-tab="maths"]'); pg.wait_for_timeout(400)
                pg.fill('form[data-form="bprac"] [name="label"]', 'AMC 8 2024'); pg.fill('form[data-form="bprac"] [name="score"]', '17')
                pg.click('form[data-form="bprac"] button[type="submit"]')
                pg.check('[data-act="road"][data-k="0:0"]')
                if '17 / 25' not in pg.inner_text('#t-maths'):
                    fails.append('practice paper did not appear')
                pg.click('[data-tab="log"]'); pg.wait_for_timeout(400)
                pg.fill('form[data-form="log"] [name="note"]', 'Projectiles, 12 questions')
                pg.click('form[data-form="log"] button[type="submit"]')
                pg.click('[data-act="logwho"][data-v="b"]'); pg.click('[data-act="logwho"][data-v="a"]')
                if 'Projectiles' not in pg.inner_text('#t-log'):
                    fails.append('study session did not appear')
                pg.click('[data-tab="dates"]'); pg.wait_for_timeout(400)
                pg.click('[data-act="dwho"][data-v="b"]')
                if 'AMC 8' not in pg.inner_text('#t-dates') or 'SAT: first sitting' in pg.inner_text('#t-dates'):
                    fails.append('date filter by student failed')
                pg.click('[data-act="dwho"][data-v="all"]')
                pg.reload(wait_until='networkidle')
                pg.click('[data-tab="overview"]')
                ov = pg.inner_text('#t-overview')
                if '1 / ' not in ov and '1420' not in ov:
                    fails.append('saved progress did not survive a reload')
                if shots:
                    for t in TABS:
                        pg.click(f'[data-tab="{t}"]'); pg.wait_for_timeout(120)
                        pg.screenshot(path=os.path.join(shots, f'filled-{t}.png'), full_page=True)
            fails.extend(f'{today}: {e}' for e in errs)
            ctx.close()
        br.close()
finally:
    httpd.shutdown()

if fails:
    print('PAGE TEST FAILED'); [print(' -', f) for f in fails]; sys.exit(1)
print('page test passed: every tab on three dates, all forms, reload persistence')
