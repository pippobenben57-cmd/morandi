(function () {
  const D = window.EXHIBIT;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const figs = Object.values(D.figures).sort((a, b) => a.key - b.key);
  const order = figs.map((f) => f.num);
  const museum = $('#museum');
  const unitOfKey = (k) => D.units.find((u) => k >= u.from && k < u.to + 1);
  const unitOf = (num) => unitOfKey(D.figures[num].key);
  const unitName = (u) => (u.no ? `第 ${u.no} 单元 · ` : '') + u.cn;

  /* ---------------- build ---------------- */
  const rooms = []; // map entries
  let html = '';

  // 展览介绍
  const F = D.front;
  rooms.push({ id: 'about', n: '展', title: '关于这个展览', range: '乔治·莫兰迪：独白 · 浦东美术馆 2026' });
  html += `
  <section class="room" id="about" data-name="关于这个展览">
    <div class="room-inner">
      <p class="kicker reveal">The Exhibition</p>
      <h2 class="room-title reveal">乔治·莫兰迪：独白</h2>
      <div class="facts reveal">
        <div><b>6.17 — 10.28</b><span>2026 年展期</span></div>
        <div><b>200+</b><span>件展品</span></div>
        <div><b>140+</b><span>件莫兰迪原作</span></div>
        <div><b>32</b><span>个展区单元</span></div>
      </div>
      <div class="prose reveal">${F.exhibition.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <p class="about-site reveal">${esc(F.about_site)}</p>
    </div>
  </section>`;

  // 认识莫兰迪
  rooms.push({ id: 'artist', n: '人', title: '认识莫兰迪', range: '生平 · 学者怎么看他' });
  html += `
  <section class="room alt" id="artist" data-name="认识莫兰迪">
    <div class="room-inner">
      <p class="kicker reveal">Giorgio Morandi, 1890–1964</p>
      <h2 class="room-title reveal">认识莫兰迪</h2>
      <div class="prose reveal">${F.artist.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="timeline reveal">${D.timeline.map((t) => `<div class="tl-item"><div class="tl-y">${esc(t.y)}</div><div class="tl-h">${esc(t.h)}</div><div class="tl-t">${esc(t.t)}</div></div>`).join('')}</div>
      <h3 class="sub-title reveal">他们怎么看莫兰迪</h3>
      <div class="scholars">${F.scholars.map(([h, t]) => `<div class="scholar reveal"><h4>${esc(h)}</h4><p>${esc(t)}</p></div>`).join('')}</div>
    </div>
  </section>`;

  // 展厅
  let floor = 0, alt = false;
  D.units.forEach((u) => {
    const works = figs.filter((f) => unitOfKey(f.key) === u);
    if (!works.length) return;
    if (u.floor !== floor) {
      floor = u.floor;
      html += `<div class="floor-mark" id="floor-${floor}"><span>${floor === 1 ? '一楼' : '二楼'}</span><em>${floor === 1 ? '工作室摄影 · 影像' : '主展线 · 第 1—32 单元'}</em></div>`;
    }
    alt = !alt;
    const id = 'unit-' + u.from;
    rooms.push({ id, n: u.no || '·', title: u.cn, range: u.en, floor: u.floor });
    const compares = (D.compares || []).filter((c) => c.pairs.length && works.some((w) => w.num === c.pairs[c.pairs.length - 1].num));
    html += `
    <section class="room hall ${alt ? '' : 'alt'}" id="${id}" data-name="${esc(unitName(u))}">
      <div class="room-inner">
        <div class="hall-head reveal">
          <div class="hall-no">${u.no ? esc(u.no) : '·'}</div>
          <div>
            <div class="hall-range">${u.no ? `第 ${esc(u.no)} 单元` : (u.floor === 1 ? '一楼' : '二楼')}</div>
            <h2 class="room-title">${esc(u.cn)}</h2>
            ${u.en ? `<div class="hall-en">${esc(u.en)}</div>` : ''}
          </div>
        </div>
        ${u.intro ? `<div class="hall-intro reveal"><p>${esc(u.intro)}</p></div>` : ''}
      </div>
      <div class="wall-wrap reveal">
        <button class="wall-btn prev" aria-label="向左">‹</button>
        <div class="wall">${works.map(workHTML).join('')}</div>
        <button class="wall-btn next" aria-label="向右">›</button>
      </div>
      ${works.length > 2 ? '<div class="wall-hint">← 左右滑动 · 点击作品看介绍 →</div>' : ''}
      <div class="room-inner">${compares.map(compareHTML).join('')}</div>
    </section>`;
  });

  // 离开展厅之后
  rooms.push({ id: 'exit', n: '尾', title: '离开展厅之后', range: '六个判断 · 怎样再看一幅莫兰迪' });
  html += `
  <section class="room dark" id="exit" data-name="离开展厅之后">
    <div class="room-inner">
      <p class="kicker reveal">After the Exhibition</p>
      <h2 class="room-title reveal">走完整场展览，留下六个判断</h2>
      <div class="ideas">${D.ideas.map((x, i) => `<div class="idea reveal"><div class="n">0${i + 1}</div><h4>${esc(x.h)}</h4><p>${linkFigs(esc(x.t))}</p></div>`).join('')}</div>
      <p class="kicker reveal" style="margin-top:96px">A Five-Minute Look</p>
      <h2 class="room-title reveal">怎样再看一幅莫兰迪</h2>
      <div class="five reveal">${D.five.map((x) => `<div class="five-row"><h5>${esc(x.h)}</h5><p>${esc(x.t)}</p></div>`).join('')}</div>
    </div>
  </section>`;

  // 延伸阅读
  rooms.push({ id: 'reading', n: '读', title: '延伸阅读', range: '观看关键词 · 十二篇导读 · 参考文献' });
  html += `
  <section class="room" id="reading" data-name="延伸阅读">
    <div class="room-inner">
      <p class="kicker reveal">Further Reading</p>
      <h2 class="room-title reveal">六个观看关键词</h2>
      <div class="keywords reveal">${D.keywords.map((k) => `<div class="kw"><div class="n">${esc(k.n)}</div><h4>${esc(k.h)}</h4><p>${esc(k.t)}</p><div class="ex">${linkFigs(esc(k.ex))}</div></div>`).join('')}</div>
      <h2 class="room-title reveal" style="margin-top:96px">十二篇导读：生平与艺术哲学</h2>
      <div class="intro-grid">${D.intros.map((it, i) => `<button class="intro-card reveal" data-intro="${i}"><span class="n">${esc(it.n)}</span><span class="t">${esc(it.title)}</span><span class="l">${esc(it.lead)}</span></button>`).join('')}</div>
      <h2 class="room-title reveal" style="margin-top:96px">参考文献</h2>
      <ul class="refs-list reveal">${D.references.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>
  </section>
  <section class="closing">
    <blockquote class="reveal">一个有限的世界，<br>可以被无限次地<br>重新看见。</blockquote>
    <p class="reveal">邓奔奔 · 上海浦东美术馆 · 2026 年 9 月 9 日</p>
    <p class="reveal" style="margin-top:8px;font-size:11px;letter-spacing:.1em">图像均为现场拍摄 · 背景音乐：巴赫《哥德堡变奏曲》咏叹调，石坂公美子演奏（Open Goldberg Variations，CC0 公共领域）</p>
    <button class="btn-ghost reveal" id="backTop">回到开头</button>
  </section>`;

  museum.innerHTML = html;

  function workHTML(f) {
    const [w, h] = f.size || [3, 4];
    return `<button class="work" data-fig="${f.num}" aria-label="${esc(f.title)}">
      <div class="frame" style="aspect-ratio:${w}/${h}"><img data-src="thumb/${f.num}.jpg" alt="${esc(f.title)}" width="${w}" height="${h}"></div>
      <div class="label"><span class="no">图 ${f.disp}${f.kind ? ' · ' + esc(f.kind) : ''}</span><span class="ti">${esc(f.title)}</span>${f.sub ? `<span class="sb">${esc(f.sub)}</span>` : ''}${D.deep[f.num] ? '<span class="deep">有细读</span>' : ''}</div>
    </button>`;
  }
  function compareHTML(c) {
    return `<div class="compare reveal">
      <p class="kicker">比较</p><h3>${esc(c.title)}</h3>
      <div class="compare-pair">${c.pairs.filter((p) => D.figures[p.num]).map((p) => `<button data-fig="${p.num}"><img data-src="thumb/${p.num}.jpg" alt="${esc(D.figures[p.num].title)}"><div class="cap"><b>${esc(D.figures[p.num].title)}</b>${esc(p.cap)}</div></button>`).join('')}</div>
      <div class="compare-text">${c.text.filter(Boolean).map((t) => `<p>${linkFigs(esc(t))}</p>`).join('')}</div>
    </div>`;
  }
  function linkFigs(s) {
    return s.replace(/图(\d{1,3})/g, (m, n) => D.disp[n] ? `<a href="#fig-${D.disp[n]}" data-fig="${D.disp[n]}" class="figlink">${m}</a>` : m);
  }

  /* ---------------- lazy images & reveal ---------------- */
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      const img = e.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add('loaded');
      io.unobserve(img);
    });
  }, { rootMargin: '400px 600px' });
  document.querySelectorAll('img[data-src]').forEach((i) => io.observe(i));
  document.querySelectorAll('.compare-pair img').forEach((i) => i.classList.add('loaded'));
  const ro = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));

  document.querySelectorAll('.wall-wrap').forEach((w) => {
    const wall = $('.wall', w);
    $('.prev', w).onclick = () => wall.scrollBy({ left: -wall.clientWidth * 0.7, behavior: 'smooth' });
    $('.next', w).onclick = () => wall.scrollBy({ left: wall.clientWidth * 0.7, behavior: 'smooth' });
  });

  /* ---------------- topbar & map ---------------- */
  const hallName = $('#hallName'), progress = $('#progress');
  const sections = [...document.querySelectorAll('section[data-name]')];
  let current = '';
  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let s = sections[0];
    for (const sec of sections) if (sec.offsetTop <= y) s = sec;
    if (s.dataset.name !== current) {
      current = s.dataset.name; hallName.textContent = current;
      document.querySelectorAll('#mapList a').forEach((a) => a.classList.toggle('here', a.getAttribute('href') === '#' + s.id));
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  let lastFloor = null;
  $('#mapList').innerHTML = rooms.map((r) => {
    let head = '';
    if (r.floor && r.floor !== lastFloor) { lastFloor = r.floor; head = `<li class="map-floor">${r.floor === 1 ? '一楼' : '二楼'}</li>`; }
    return `${head}<li><a href="#${r.id}"><span class="n">${esc(r.n)}</span><span class="t">${esc(r.title)}</span><span class="r">${esc(r.range)}</span></a></li>`;
  }).join('');
  const map = $('#map');
  $('#mapBtn').onclick = () => { map.hidden = false; };
  $('#mapClose').onclick = () => { map.hidden = true; };
  map.onclick = (e) => { if (e.target === map || e.target.closest('a')) map.hidden = true; };

  /* ---------------- music ---------------- */
  const bgm = $('#bgm'), musicBtn = $('#musicBtn');
  // 背景音乐：巴赫《哥德堡变奏曲》咏叹调 → 咏叹调返始，交替循环
  const tracks = ['audio/aria.mp3', 'audio/aria_dacapo.mp3'];
  let track = 0;
  bgm.addEventListener('ended', () => { track = (track + 1) % tracks.length; bgm.src = tracks[track]; bgm.play().catch(() => {}); });
  let fadeT;
  function fadeTo(v, done) {
    clearInterval(fadeT);
    fadeT = setInterval(() => {
      const d = v - bgm.volume;
      if (Math.abs(d) < 0.02) { bgm.volume = v; clearInterval(fadeT); done && done(); return; }
      bgm.volume = Math.min(1, Math.max(0, bgm.volume + Math.sign(d) * 0.02));
    }, 60);
  }
  function playMusic() {
    bgm.volume = 0;
    const p = bgm.play();
    if (p) p.then(() => { musicBtn.classList.add('playing'); fadeTo(0.55); }).catch(() => {});
  }
  function stopMusic() { musicBtn.classList.remove('playing'); fadeTo(0, () => bgm.pause()); }
  musicBtn.onclick = () => (bgm.paused || !musicBtn.classList.contains('playing') ? playMusic() : stopMusic());

  /* ---------------- entrance ---------------- */
  const entrance = $('#entrance');
  function enter(withMusic) {
    entrance.classList.add('gone');
    document.body.classList.remove('locked');
    if (withMusic) playMusic();
    setTimeout(() => { entrance.hidden = true; }, 1500);
  }
  $('#enterWithMusic').onclick = () => enter(true);
  $('#enterSilent').onclick = () => enter(false);
  $('#backTop').onclick = () => $('#about').scrollIntoView({ behavior: 'smooth' });

  /* ---------------- viewer ---------------- */
  const viewer = $('#viewer'), vImg = $('#vImg'), vText = $('#vText'), vCount = $('#vCount');
  let idx = -1, auto = null;
  function openFig(num, push = true) {
    const i = order.indexOf(num);
    if (i < 0) return;
    idx = i;
    const f = D.figures[num], dp = D.deep[num], u = unitOf(num);
    viewer.hidden = false; document.body.classList.add('locked');
    vImg.classList.add('fading');
    const img = new Image();
    img.onload = () => { vImg.src = img.src; vImg.alt = f.title; vImg.classList.remove('fading'); };
    img.src = `img/${num}.jpg`;
    vCount.textContent = `${i + 1} / ${order.length}`;
    const secs = f.secs.filter((s) => s[0] !== '再看一眼');
    const look = f.secs.find((s) => s[0] === '再看一眼');
    vText.innerHTML = `
      ${u ? `<div class="tag">${esc(unitName(u))}</div>` : ''}
      <div class="tag kind">图 ${f.disp}${f.kind ? ' · ' + esc(f.kind) : ''}</div>
      <h2>${esc(f.title)}</h2>
      ${f.sub ? `<p class="sub">${esc(f.sub)}</p>` : '<div style="height:12px"></div>'}
      ${secs.map((s) => `<h3>${esc(s[0])}</h3><p>${linkFigs(esc(s[1]))}</p>`).join('')}
      ${look ? `<div class="look">再看一眼 · ${linkFigs(esc(look[1]))}</div>` : ''}
      ${dp && dp.secs.length ? `<div class="deepread">
        <div class="dk">细读 · DEEP LOOKING</div>
        <h4>${esc(dp.headline)}</h4>
        ${dp.secs.map((s, k) => `<div class="sec"><span class="i">0${k + 1}</span><div><h5>${esc(s[0])}</h5><p>${linkFigs(esc(s[1]))}</p></div></div>`).join('')}
        ${dp.refs.length ? `<div class="refs">对照 ${dp.refs.map((r) => `<button data-fig="${r}">${esc(D.figures[r].title)}</button>`).join('')}</div>` : ''}
      </div>` : ''}`;
    vText.scrollTop = 0;
    if (push) history.replaceState(null, '', '#fig-' + num);
    [order[i + 1], order[i - 1]].forEach((n) => { if (n) new Image().src = `img/${n}.jpg`; });
    if (auto) startTimer();
  }
  function closeViewer() {
    viewer.hidden = true; document.body.classList.remove('locked'); stopAuto();
    history.replaceState(null, '', location.pathname + location.search);
    const el = document.querySelector(`.work[data-fig="${order[idx]}"]`);
    if (el) el.scrollIntoView({ block: 'center', inline: 'center' });
  }
  const step = (d) => openFig(order[(idx + d + order.length) % order.length]);
  $('#vPrev').onclick = () => step(-1);
  $('#vNext').onclick = () => step(1);
  $('#vClose').onclick = closeViewer;

  const vAuto = $('#vAuto'), vTimer = $('#vTimer');
  let timerStart = 0, raf;
  const durFor = () => Math.min(26000, 7000 + vText.textContent.length * 18);
  function startTimer() {
    cancelAnimationFrame(raf);
    timerStart = performance.now();
    const dur = durFor();
    const tick = (t) => {
      const p = (t - timerStart) / dur;
      vTimer.style.width = Math.min(100, p * 100) + '%';
      const max = vText.scrollHeight - vText.clientHeight;
      if (max > 0 && p > 0.15) vText.scrollTop = Math.min(max, max * (p - 0.15) / 0.8);
      if (p >= 1) { step(1); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function stopAuto() { auto = null; cancelAnimationFrame(raf); vTimer.style.width = 0; vAuto.classList.remove('on'); vAuto.textContent = '▶ 自动导览'; }
  vAuto.onclick = () => {
    if (auto) return stopAuto();
    auto = true; vAuto.classList.add('on'); vAuto.textContent = '❚❚ 暂停导览';
    if (bgm.paused) playMusic();
    startTimer();
  };
  vText.addEventListener('wheel', () => { if (auto) timerStart = performance.now() - durFor() * 0.1; }, { passive: true });

  let sx = null;
  $('.viewer-stage').addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  $('.viewer-stage').addEventListener('touchend', (e) => {
    if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  /* ---------------- reader (导读) ---------------- */
  const reader = $('#reader'), rBody = $('#rBody');
  function openIntro(i) {
    const it = D.intros[i];
    rBody.innerHTML = `
      <p class="kicker">导读</p>
      <div class="n">${esc(it.n)}</div>
      <h2>${esc(it.title)}</h2>
      <p class="lead">${esc(it.lead)}</p>
      ${it.secs.map((s) => `<h3>${esc(s[0])}</h3><p>${linkFigs(esc(s[1]))}</p>`).join('')}
      ${it.refs.length ? `<div class="refs" style="margin-top:40px">相关作品 ${it.refs.map((r) => `<button data-fig="${r}">${esc(D.figures[r].title)}</button>`).join('')}</div>` : ''}
      <div class="reader-nav">
        ${i > 0 ? `<button data-intro="${i - 1}">‹ ${esc(D.intros[i - 1].n)}</button>` : '<span></span>'}
        ${i < D.intros.length - 1 ? `<button data-intro="${i + 1}">${esc(D.intros[i + 1].n)} ›</button>` : '<span></span>'}
      </div>`;
    reader.hidden = false; reader.scrollTop = 0; document.body.classList.add('locked');
  }
  function closeReader() { reader.hidden = true; if (viewer.hidden) document.body.classList.remove('locked'); }
  $('#rClose').onclick = closeReader;

  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-fig]');
    if (f) { e.preventDefault(); if (!reader.hidden) reader.hidden = true; openFig(f.dataset.fig); return; }
    const it = e.target.closest('[data-intro]');
    if (it) openIntro(+it.dataset.intro);
  });
  document.addEventListener('keydown', (e) => {
    if (!viewer.hidden) {
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Escape') closeViewer();
      else if (e.key === ' ') { e.preventDefault(); vAuto.click(); }
    } else if (!reader.hidden && e.key === 'Escape') closeReader();
    else if (!map.hidden && e.key === 'Escape') map.hidden = true;
  });

  const m = location.hash.match(/^#fig-(s?\d{3,4})$/);
  document.body.classList.add('locked');
  if (m && D.figures[m[1]]) { entrance.hidden = true; document.body.classList.remove('locked'); openFig(m[1], false); }
  onScroll();
})();
