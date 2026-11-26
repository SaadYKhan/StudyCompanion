/* Account strip: shows who is signed in and which children they see, from /api/me.
   Stays hidden if the API isn't there (for example when the site is opened from a file). */
(function () {
  'use strict';
  var head = document.querySelector('.pf-head');
  if (!head || !window.fetch) return;

  var css = document.createElement('style');
  css.textContent =
    '.sc-acct{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem .7rem;margin:.55rem 0 0;font-size:.8rem;color:var(--pf-steel,#9fb0cf)}' +
    '.sc-acct b{color:var(--pf-gold-hi,#e4c785);font-weight:600}' +
    '.sc-acct .chip{border:1px solid var(--pf-line-2,#2b4579);border-radius:999px;padding:.12rem .6rem}' +
    '.sc-acct .warn{color:#f0c674}' +
    '.sc-acct button{font:inherit;font-size:.78rem;cursor:pointer;background:transparent;color:var(--pf-gold,#c9a24e);border:1px solid var(--pf-gold-lo,#8a6a28);border-radius:6px;padding:.15rem .6rem}' +
    '.sc-acct button:hover{background:rgba(201,162,78,.12)}.sc-acct button[disabled]{opacity:.6;cursor:wait}';
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.className = 'sc-acct';
  box.id = 'acct';
  box.hidden = true;
  var tabs = document.getElementById('tabs');
  head.insertBefore(box, tabs);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function day(s) { if (!s) return ''; var d = new Date(s.replace(' ', 'T') + 'Z'); return isNaN(d) ? s : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
  function names(list) { return list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1]; }

  function render(me) {
    if (!me || !me.signedIn) { box.hidden = true; return; }
    if (!me.linked) {
      box.innerHTML = '<span class="chip warn">Signed in as ' + esc(me.email) + ', not linked to a family yet</span>';
      box.hidden = false; return;
    }
    var parent = me.students.filter(function (s) { return s.role === 'parent'; }).map(function (s) { return s.name; });
    var own = me.students.filter(function (s) { return s.role !== 'parent'; }).map(function (s) { return s.name; });
    var role = parent.length ? 'Parent of ' + names(parent) : own.length ? 'Student account: ' + names(own) : 'No children linked';
    var q = me.students.reduce(function (n, s) { return n + s.questions; }, 0);
    var upd = me.students.map(function (s) { return s.updated; }).filter(Boolean).sort().pop();
    var html = '<span class="chip">Signed in · <b>' + esc(me.user.name || me.user.email) + '</b> · ' + esc(role) + '</span>';
    html += q ? '<span>Online: ' + q + ' questions saved' + (upd ? ', last change ' + esc(day(upd)) : '') + '</span>'
              : '<span class="warn">Online: nothing saved yet</span>';
    if (me.legacy && me.legacy.needed)
      html += '<button type="button" id="acctImport">Save the question log to your account (' + me.legacy.questions + ' questions)</button>';
    box.innerHTML = html;
    box.hidden = false;
    var b = document.getElementById('acctImport');
    if (b) b.addEventListener('click', function () {
      b.disabled = true; b.textContent = 'Saving…';
      fetch('/api/import-legacy', { method: 'POST', credentials: 'same-origin' })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || r.status); return j; }); })
        .then(function () { load(); })
        .catch(function (e) { b.disabled = false; b.textContent = 'Saving failed (' + e.message + '), try again'; });
    });
  }

  function load() {
    fetch('/api/me', { credentials: 'same-origin', headers: { accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(render)
      .catch(function () { box.hidden = true; });
  }
  load();
})();
