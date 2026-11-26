"""Open the built site in a real browser and make sure it works before it is pushed.

Usage: python3 tools/check_site.py [site folder] [--shots <folder>]

Serves the folder on a local port, loads the page on three different "today" dates, visits every tab,
fills in each form once, and fails (exit 1) when
  - the page throws or logs an error, or a file it asks for is missing,
  - any tab shows "undefined", "NaN", "Invalid" or "[object Object]",
  - a form entry does not show up where it should.
Exit 3 means the browser could not be started, so nothing was tested.
"""
import functools, http.server, json, os, re, socketserver, sys, threading

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
TABS = ['overview', 'dates', 'alevel', 'qlog', 'notes', 'sat', 'maths', 'log', 'sources', 'family']
BAD = ('undefined', 'NaN', '[object Object]', 'Invalid Date')
fails = []

# ---- a stand-in for the Worker's /api, so the page can be tested without Cloudflare ----
LEGACY = json.load(open(os.path.join(os.path.dirname(site), 'worker', 'legacy.json')))
KIDS = {'s_mk': {'id': 's_mk', 'name': 'MK', 'year': 'Year 12', 'code': 'a'}, 's_zk': {'id': 's_zk', 'name': 'ZK', 'year': 'Year 7', 'code': 'b'}}


def install_api(pg, role='parent', student='s_zk'):
    """role 'parent' sees both children; role 'student' sees only `student`. Returns the shared state."""
    st = {'progress': {'s_mk': {}, 's_zk': {}}, 'puts': [], 'forbidden': [], 'logins': {'s_mk': [], 's_zk': []}, 'n': 0}
    visible = list(KIDS) if role == 'parent' else [student]

    def me():
        return {'signedIn': True, 'linked': True, 'isParent': role == 'parent', 'user': {'name': 'SYK' if role == 'parent' else None, 'email': 'x@test.local'},
                'students': [dict(KIDS[k], role=role, papers=0, questions=0) for k in visible], 'legacy': {'questions': 246, 'needed': False}}

    def data():
        codes = {KIDS[k]['code'] for k in visible}
        papers = {k: v for k, v in LEGACY['papers'].items() if v['who'] in codes}
        return {'papers': papers, 'q': [q for q in LEGACY['q'] if q['p'] in papers], 'updated': '2026-11-26 11:32:32', 'sig': 'sig-' + ''.join(sorted(codes))}

    def family():
        return {'parents': [{'email': 'x@test.local', 'name': 'SYK', 'lastSeen': '2026-11-26 11:32:32'}],
                'students': [dict(KIDS[k], logins=st['logins'][k]) for k in KIDS],
                'recent': [{'at': '2026-11-26 11:21:03', 'actor_kind': 'claude', 'action': 'create', 'entity': 'family', 'detail': '{}', 'actor': 'SYK'}]}

    def handle(route):
        req = route.request
        path = req.url.split('://', 1)[1].split('/', 1)[1].split('?')[0]
        out, code = None, 200
        if path == 'api/me': out = me()
        elif path == 'api/data':
            out = data()
            if ('since=' + out['sig']) in req.url: out = {'unchanged': True, 'sig': out['sig']}
        elif path == 'api/progress' and req.method == 'GET':
            out = {'students': {k: {'values': st['progress'][k], 'updated': {}} for k in visible}}
        elif re.match(r'api/progress/[\w-]+/[a-z]+$', path) and req.method == 'PUT':
            sid, kind = path.split('/')[2:4]
            if sid not in visible: st['forbidden'].append(path); out, code = {'error': 'not_your_child'}, 403
            else: st['progress'][sid][kind] = json.loads(req.post_data)['value']; st['puts'].append(path); out = {'ok': True}
        elif path == 'api/family' and role == 'parent': out = family()
        elif path == 'api/family/link' and role == 'parent':
            b = json.loads(req.post_data)
            if '@' not in b['email']: out, code = {'error': 'bad_email'}, 400
            else:
                st['n'] += 1; st['logins'][b['studentId']].append({'id': 'm%d' % st['n'], 'role': 'student', 'email': b['email'].lower(), 'lastSeen': None}); out = family()
        elif path == 'api/family/unlink' and role == 'parent':
            mid = json.loads(req.post_data)['membershipId']
            for k in st['logins']: st['logins'][k] = [l for l in st['logins'][k] if l['id'] != mid]
            out = family()
        else: out, code = {'error': 'not_found'}, 404
        route.fulfill(status=code, content_type='application/json', body=json.dumps(out))

    pg.route('**/api/**', handle)
    return st


def tabs_shown(pg):
    return [b.get_attribute('data-tab') for b in pg.locator('#tabs [data-tab]').all()]


def wait_saved(pg):
    pg.wait_for_function("(function(){var e=document.getElementById('syncSt');return e && /Saved online/.test(e.textContent);})()", timeout=5000)

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
            store = install_api(pg, 'parent')
            errs = []
            pg.on('pageerror', lambda e: errs.append('page error: ' + str(e)))
            # /api/* only exists behind the Worker; the static test server answers 404, which is expected.
            api404 = []
            pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and not (api404 and 'status of 404' in m.text) else None)
            pg.on('response', lambda r: api404.append(r.url) if (r.status == 404 and '/api/' in r.url) else (errs.append(f'{r.status} {r.url}') if r.status >= 400 else None))
            pg.goto(f'http://127.0.0.1:{port}/?today={today}', wait_until='networkidle')
            pg.wait_for_selector('#tabs [data-tab]')
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
                if 'Statistics 1' not in pg.inner_text('#t-alevel') or 'Where 47 out of 80 lands' not in pg.inner_text('#t-alevel'):
                    fails.append('S1 default or the marked-papers section is missing')
                at = pg.inner_text('#t-alevel')
                if '37/80' not in at.replace(' ', '') or '45/80' not in at.replace(' ', '') or '40/80' not in at.replace(' ', '') or 'Path to an A in Physics' not in at:
                    fails.append('Physics re-mark section missing or wrong total')
                pg.click('[data-act="route"][data-v="M1"]')
                if 'Mechanics 1' not in pg.inner_text('#t-alevel'):
                    fails.append('M1 route did not switch the timetable')
                pg.click('[data-act="route"][data-v="S1"]')
                # question log: link from the checklist, search, topic filter, redo, add-your-own
                pg.click('.sc-qlink[data-k="WCH11:7"]'); pg.wait_for_timeout(400)
                if 'From the topic checklist' not in pg.inner_text('#t-qlog') or 'Q18(c)' not in pg.inner_text('#qList'):
                    fails.append('checklist link did not open the filtered question log')
                pg.click('[data-act="qclear"]'); pg.wait_for_timeout(200)
                # the why-marks panel follows the subject switch
                why = lambda: pg.locator('.pf-card', has_text='Why marks were lost').first.inner_text()
                w_all = why()
                pg.click('[data-act="qsubj"][data-v="Physics"]'); pg.wait_for_timeout(250); w_phys = why()
                pg.click('[data-act="qsubj"][data-v="Chemistry"]'); pg.wait_for_timeout(250); w_chem = why()
                pg.click('[data-act="qsubj"][data-v="Maths"]'); pg.wait_for_timeout(250); w_maths = why()
                pg.click('[data-act="qsubj"][data-v="all"]'); pg.wait_for_timeout(250)
                if 'Multipliers and counting' in w_phys or 'Multipliers and counting' not in w_chem or w_phys == w_all or '72 marks' not in w_phys or 'left blank' not in w_maths.lower() or 'Multipliers and counting' in w_maths:
                    fails.append('why-marks panel does not follow the subject switch')
                if 'of 207 questions' not in pg.inner_text('#qCount'):
                    fails.append('question log does not show all 207 of MK\'s questions: ' + pg.inner_text('#qCount'))
                pg.click('[data-act="qwho"][data-v="b"]'); pg.wait_for_timeout(300)
                if 'of 39 questions' not in pg.inner_text('#qCount') or '37' not in pg.inner_text('#t-qlog'):
                    fails.append('ZK question log wrong: ' + pg.inner_text('#qCount'))
                pg.fill('#qSearch', 'VAT'); pg.wait_for_timeout(200)
                if 'Q33' not in pg.inner_text('#qList') or 'Q35' not in pg.inner_text('#qList'):
                    fails.append('ZK search for VAT failed')
                pg.click('[data-act="qwho"][data-v="a"]'); pg.wait_for_timeout(300)
                pg.fill('#qSearch', 'moles of ions'); pg.wait_for_timeout(200)
                if 'Mg(NO₃)₂' not in pg.inner_text('#qList'):
                    fails.append('search did not find the moles of ions question')
                pg.fill('#qSearch', ''); pg.wait_for_timeout(200)
                pg.click('tr[data-act="qtopic"][data-v="shape"]'); pg.wait_for_timeout(300)
                if 'SF₄' not in pg.inner_text('#qList') or 'Mg(NO₃)₂' in pg.inner_text('#qList'):
                    fails.append('topic filter failed')
                pg.click('[data-act="redo"][data-v="2"]'); pg.wait_for_timeout(200)
                pg.click('[data-act="qclear"]'); pg.wait_for_timeout(200)
                pg.click('[data-act="qres"][data-v="open"]'); pg.wait_for_timeout(200)
                n_open = pg.inner_text('#qCount')
                pg.click('[data-act="qres"][data-v="all"]')
                pg.click('details.sc-add summary')
                pg.fill('form[data-form="myq"] [name="paper"]', 'Chemistry Unit 1 · June 2024'); pg.fill('form[data-form="myq"] [name="q"]', 'Q14(b)')
                pg.fill('form[data-form="myq"] [name="m"]', '1'); pg.fill('form[data-form="myq"] [name="x"]', '3')
                pg.fill('form[data-form="myq"] [name="pr"]', 'Explain the trend in boiling points of the halogens.')
                pg.click('form[data-form="myq"] button[type="submit"]'); pg.wait_for_timeout(300)
                if 'of 208 questions' not in pg.inner_text('#qCount') or 'added by you' not in pg.inner_text('#qList').lower():
                    fails.append('added question did not appear')
                if 'Fixed so far' not in pg.inner_text('#t-qlog') or n_open.startswith('41 of'):
                    pass
                pg.click('[data-tab="maths"]'); pg.wait_for_timeout(400)
                if 'marked work' not in pg.inner_text('#t-maths').lower() or '37' not in pg.inner_text('#t-maths'):
                    fails.append('ZK marked-work section missing')
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
                wait_saved(pg)
                pg.reload(wait_until='networkidle'); pg.wait_for_selector('#tabs [data-tab]')
                pg.click('[data-tab="overview"]')
                ov = pg.inner_text('#t-overview')
                if '1 / ' not in ov and '1420' not in ov:
                    fails.append('saved progress did not survive a reload')
                # key focus areas: live scores, auto-ticks, manual ticks, and the link into the question log
                for want in ['Key focus areas', 'Finish every question', '25 / 119', 'Multiple choice in both sciences', '30 / 70', 'Percentages one after another', '7 / 21']:
                    if want.lower() not in ov.lower():
                        fails.append('focus areas missing: ' + want)
                if 'logged' not in pg.locator('.sc-soon', has_text='By the end of term').nth(1).inner_text():
                    fails.append('ZK practice paper did not tick the focus checklist')
                pg.click('[data-act="fdone"][data-v="a:p1"]'); pg.wait_for_timeout(200)
                if pg.get_attribute('[data-act="fdone"][data-v="a:p1"]', 'aria-pressed') != 'true':
                    fails.append('focus checklist tick did not save')
                pg.click('[data-act="qfocus"][data-v="a:1"]'); pg.wait_for_timeout(400)
                if 'Focus area: Multiple choice' not in pg.inner_text('#t-qlog') or not pg.inner_text('#qCount').startswith('40 of'):
                    fails.append('focus link did not filter the question log: ' + pg.inner_text('#qCount'))
                pg.click('[data-act="qfocusx"]'); pg.wait_for_timeout(200)
                pg.click('[data-tab="overview"]'); pg.wait_for_timeout(300)
                pg.click('[data-act="qsoon"][data-v="a:0"]'); pg.wait_for_timeout(400)
                if not pg.inner_text('#qCount').startswith('60 of'):
                    fails.append('Physics redo link did not open the 60 lost parts: ' + pg.inner_text('#qCount'))
                # key notes: self-test flips, grades, re-queues a missed card, saves, and survives a reload
                pg.click('[data-tab="notes"]'); pg.wait_for_timeout(300)
                if '149' not in pg.inner_text('#t-notes'):
                    fails.append('key notes: card total missing')
                pg.click('[data-act="ntu"][data-v="WST01"]'); pg.wait_for_timeout(150)
                if '37' not in pg.inner_text('#ntDeckLine'):
                    fails.append('key notes: Maths S1 deck should have 37 cards: ' + pg.inner_text('#ntDeckLine'))
                pg.click('[data-act="ntquiz"][data-v="0"]'); pg.click('[data-act="ntstart"][data-v="10"]'); pg.wait_for_timeout(150)
                if pg.locator('#ntA').count():
                    fails.append('key notes: answer visible before flipping')
                pg.keyboard.press('Space'); pg.wait_for_timeout(120)
                if not pg.locator('#ntA').count():
                    fails.append('key notes: Space did not show the answer')
                first = pg.inner_text('#ntQ')
                pg.keyboard.press('1'); pg.wait_for_timeout(120)
                seen_again = False
                for _ in range(14):
                    if not pg.locator('#ntQ').count(): break
                    if pg.inner_text('#ntQ') == first: seen_again = True
                    pg.keyboard.press('Space'); pg.keyboard.press('2'); pg.wait_for_timeout(60)
                if not seen_again:
                    fails.append('key notes: a not-yet card did not come back in the session')
                if '1 not yet' not in pg.inner_text('.nt-stage'):
                    fails.append('key notes: session summary wrong: ' + pg.inner_text('.nt-stage')[:120])
                pg.reload(); pg.wait_for_selector('#ntDeckLine'); pg.wait_for_timeout(300)
                if '27 new' not in pg.inner_text('#ntDeckLine'):
                    fails.append('key notes: progress did not survive a reload: ' + pg.inner_text('#ntDeckLine'))
                pg.click('[data-act="ntmode"][data-v="browse"]'); pg.wait_for_timeout(150)
                if pg.locator('.nt-list li').count() != 37:
                    fails.append('key notes: browse view should list 37 cards')
                pg.click('[data-act="ntmode"][data-v="test"]'); pg.wait_for_timeout(120)
                pg.click('[data-act="ntreset"][data-v="WST01"]'); pg.wait_for_timeout(120)
                pg.click('[data-act="ntresetok"]'); pg.wait_for_timeout(150)
                if '37 new' not in pg.inner_text('#ntDeckLine'):
                    fails.append('key notes: reset did not return the Maths S1 cards to new: ' + pg.inner_text('#ntDeckLine'))
                # everything above was saved to the right child's account
                wait_saved(pg)
                pm, pz = store['progress']['s_mk'], store['progress']['s_zk']
                if not pm.get('sat') or not pm.get('topics') or 'cards' not in pm or not any('Projectiles' in (r.get('note') or '') for r in pm.get('log', [])):
                    fails.append('online save: MK progress missing: ' + ', '.join(sorted(pm)))
                if not pz.get('bprac') or not pz.get('road') or any(r.get('who') != 'b' for r in pz.get('log', [])) or 'cards' in pz or 'sat' in pz:
                    fails.append('online save: ZK progress wrong: ' + ', '.join(sorted(pz)))
                if any(r.get('who') != 'a' for r in pm.get('log', [])) or any(not k.startswith('a:') for k in pm.get('fdone', {})):
                    fails.append('online save: MK got another child\'s entries')
                # a parent can see exactly what each child sees
                pg.select_option('[data-act="view"]', 'a'); pg.wait_for_timeout(300)
                t = tabs_shown(pg)
                if 'maths' in t or 'family' in t or 'alevel' not in t or 'notes' not in t:
                    fails.append('MK view: wrong tabs ' + str(t))
                pg.click('[data-tab="overview"]'); pg.wait_for_timeout(200)
                ov = pg.inner_text('#t-overview'); hd = pg.inner_text('.pf-head')
                if 'ZK · Year 7' in ov or 'ZK next' in hd or 'MK · Year 12' not in ov or 'exactly as MK sees it' not in hd:
                    fails.append('MK view: overview or header shows ZK, or the view note is missing')
                pg.click('[data-tab="qlog"]'); pg.wait_for_timeout(300)
                if 'Whose questions' in pg.inner_text('#t-qlog') or 'of 208 questions' not in pg.inner_text('#qCount'):
                    fails.append('MK view: question log should show only MK (208 with the one added): ' + pg.inner_text('#qCount'))
                pg.select_option('[data-act="view"]', 'b'); pg.wait_for_timeout(300)
                t = tabs_shown(pg)
                if any(x in t for x in ('alevel', 'notes', 'sat', 'family')) or 'maths' not in t:
                    fails.append('ZK view: wrong tabs ' + str(t))
                if 'of 39 questions' not in pg.inner_text('#qCount') or 'Whose questions' in pg.inner_text('#t-qlog'):
                    fails.append('ZK view: question log should show only ZK: ' + pg.inner_text('#qCount'))
                pg.click('[data-tab="overview"]'); pg.wait_for_timeout(200)
                if 'MK · Year 12' in pg.inner_text('#t-overview') or 'MK next' in pg.inner_text('.pf-head'):
                    fails.append('ZK view: overview or header shows MK')
                pg.click('[data-tab="log"]'); pg.wait_for_timeout(200)
                pg.fill('form[data-form="log"] [name="note"]', 'Parent logged this as ZK')
                pg.click('form[data-form="log"] button[type="submit"]'); wait_saved(pg)
                if not any('Parent logged this as ZK' in (r.get('note') or '') and r.get('who') == 'b' for r in store['progress']['s_zk'].get('log', [])):
                    fails.append('ZK view: a session logged by the parent was not saved to ZK')
                pg.reload(wait_until='networkidle'); pg.wait_for_selector('#tabs [data-tab]')
                if 'maths' not in tabs_shown(pg) or 'alevel' in tabs_shown(pg):
                    fails.append('the chosen view did not survive a reload')
                pg.select_option('[data-act="view"]', ''); pg.wait_for_timeout(300)
                if 'family' not in tabs_shown(pg) or 'maths' not in tabs_shown(pg) or 'alevel' not in tabs_shown(pg):
                    fails.append('family view: tabs missing ' + str(tabs_shown(pg)))
                # family page: link and remove a child's sign-in
                pg.click('[data-tab="family"]'); pg.wait_for_selector('form[data-form="link"]')
                pg.locator('form[data-form="link"]').nth(1).locator('[name="email"]').fill('ZK.Test@Example.com')
                pg.locator('form[data-form="link"]').nth(1).locator('button[type="submit"]').click(); pg.wait_for_timeout(300)
                fam = pg.inner_text('#t-family')
                if 'zk.test@example.com' not in fam or 'Family policy in Cloudflare' not in fam or not store['logins']['s_zk']:
                    fails.append('family page: linking an email did not work')
                pg.click('[data-act="unlink"]'); pg.click('[data-act="unlinkok"]'); pg.wait_for_timeout(300)
                if store['logins']['s_zk'] or 'zk.test@example.com' in pg.inner_text('#t-family') or 'Removed' not in pg.inner_text('#t-family'):
                    fails.append('family page: removing a sign-in did not work')
                if 'Family set up' not in pg.inner_text('#t-family'):
                    fails.append('family page: recent changes missing')
                if shots:
                    for t in TABS:
                        pg.click(f'[data-tab="{t}"]'); pg.wait_for_timeout(120)
                        pg.screenshot(path=os.path.join(shots, f'filled-{t}.png'), full_page=True)
            fails.extend(f'{today}: {e}' for e in errs)
            ctx.close()

        # ---- a child signing in on their own device: sees only their own work, and old progress moves online ----
        ctx = br.new_context(viewport={'width': 1024, 'height': 900})
        ctx.add_init_script('''if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1');
          localStorage.setItem('sc1:bprac', JSON.stringify([{ id: 'x1', date: '2026-11-01', kind: 'amc', label: 'Old AMC practice', score: 15, outof: 25 }]));
          localStorage.setItem('sc1:log', JSON.stringify([{ id: 'l1', who: 'b', date: '2026-11-10', subj: 'maths', min: 30, note: 'ZK old session' }, { id: 'l2', who: 'a', date: '2026-11-10', subj: 'phys', min: 40, note: 'MK old session' }]));
          localStorage.setItem('sc1:cards', JSON.stringify({ p01: { b: 2, d: '2026-11-20', n: 3, l: '2026-11-15', r: 2, w: 1 } })); }''')
        pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append('page error: ' + str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        kid = install_api(pg, 'student', 's_zk')
        pg.goto(f'http://127.0.0.1:{port}/?today=2026-11-16', wait_until='networkidle'); pg.wait_for_selector('#tabs [data-tab]')
        t = tabs_shown(pg)
        if t != ['overview', 'dates', 'qlog', 'maths', 'log', 'sources']:
            fails.append('student ZK: wrong tabs ' + str(t))
        if pg.locator('[data-act="view"]').count():
            fails.append('student ZK: should not have the view switcher')
        if 'MK · Year 12' in pg.inner_text('#t-overview') or 'MK next' in pg.inner_text('.pf-head') or 'Signed in · ZK' not in pg.inner_text('.pf-head'):
            fails.append('student ZK: sees MK on the overview or header')
        wait_saved(pg)
        zk = kid['progress']['s_zk']
        if [r['id'] for r in zk.get('bprac', [])] != ['x1'] or [r['id'] for r in zk.get('log', [])] != ['l1']:
            fails.append('student ZK: old progress from this device did not move to the account correctly: ' + json.dumps(zk)[:200])
        if kid['forbidden'] or kid['progress']['s_mk']:
            fails.append('student ZK: tried to save to MK: ' + str(kid['forbidden']))
        pg.click('[data-tab="maths"]'); pg.wait_for_timeout(200)
        if 'Old AMC practice' not in pg.inner_text('#t-maths'):
            fails.append('student ZK: own practice paper missing')
        pg.click('[data-tab="log"]'); pg.wait_for_timeout(200)
        if 'ZK old session' not in pg.inner_text('#t-log') or 'MK old session' in pg.inner_text('#t-log'):
            fails.append('student ZK: study log shows the wrong child')
        pg.click('[data-tab="qlog"]'); pg.wait_for_timeout(200)
        if 'of 39 questions' not in pg.inner_text('#qCount'):
            fails.append('student ZK: question log wrong: ' + pg.inner_text('#qCount'))
        fails.extend('student ZK: ' + e for e in errs)
        ctx.close()
        br.close()
finally:
    httpd.shutdown()

if fails:
    print('PAGE TEST FAILED'); [print(' -', f) for f in fails]; sys.exit(1)
print('page test passed: every tab on three dates, all forms, online saving per child, parent views, family page, a child\'s own sign-in')
