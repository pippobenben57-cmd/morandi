(function () {
  const D = window.EXHIBIT;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const figs = Object.keys(D.figures).sort().map((k) => D.figures[k]);
  const order = figs.map((f) => f.num);
  const museum = $('#museum');

  /* ---------------- build rooms ---------------- */
  const rooms = []; // {id, n, title, range}
  let html = '';

  // 序厅
  rooms.push({ id: 'preface', n: '序', title: '序厅 · 先认识他', range: '生平 · 关键词 · 十二节导论' });
  html += `
  <section class="room" id="preface" data-name="序厅 · 先认识他">
    <div class="room-inner">
      <p class="kicker reveal">Prologue · 写在前面</p>
      <h2 class="room-title reveal">从完整记录，走向深入的鉴赏</h2>
      <p class="lead reveal">献给愿意在一只瓶子、一片白墙和一束花前多停留一会儿的你。</p>
      <div class="preface-note">
        <div class="reveal"><h4>从拍下的每一张图开始</h4><p>完整保留 186 条现场图像记录，按图 001 至图 186 的顺序陈列：作品、局部、展签、墙文、器物及档案。186 张图并不等于 186 件不同的艺术作品。</p></div>
        <div class="reveal"><h4>先读思想，再回到每一幅画</h4><p>十二节导论介绍生平、艺术学习与思想问题。展览沿官方 32 个单元的展线推进，本站按笔记分为 13 章，每幅作品都附有观察与短解，并另有 121 篇深读，讲解形式选择、鉴赏意义与比较练习。</p></div>
        <div class="reveal"><h4>事实、图像与解读各有位置</h4><p>带《书名号》的题名、年份和媒介尽量依据可辨展签；其他标题是便于阅读的画面描述。分析与比较是本册的解读，不冒充艺术家原话。</p></div>
      </div>
    </div>
  </section>
  <section class="room alt" id="timeline">
    <div class="room-inner">
      <p class="kicker reveal">A Life in Brief</p>
      <h2 class="room-title reveal">生平与创作线索</h2>
      <div class="timeline reveal">${D.timeline.map((t) => `<div class="tl-item"><div class="tl-y">${esc(t.y)}</div><div class="tl-h">${esc(t.h)}</div><div class="tl-t">${esc(t.t)}</div></div>`).join('')}</div>
    </div>
  </section>
  <section class="room" id="keywords">
    <div class="room-inner">
      <p class="kicker reveal">Ways of Looking</p>
      <h2 class="room-title reveal">六个观看关键词 · 先看见，再命名</h2>
      <div class="keywords reveal">${D.keywords.map((k) => `<div class="kw"><div class="n">${esc(k.n)}</div><h4>${esc(k.h)}</h4><p>${esc(k.t)}</p><div class="ex">${linkFigs(esc(k.ex))}</div></div>`).join('')}</div>
    </div>
  </section>
  <section class="room alt" id="intros">
    <div class="room-inner">
      <p class="kicker reveal">Life, Art &amp; a Way of Seeing</p>
      <h2 class="room-title reveal">十二节导论：生平与艺术哲学</h2>
      <p class="lead reveal">先读思想，再进入展厅。每节导论都可以跳到对应的现场照片。</p>
      <div class="intro-grid">${D.intros.map((it, i) => `<button class="intro-card reveal" data-intro="${i}"><span class="n">${esc(it.n)}</span><span class="t">${esc(it.title)}</span><span class="l">${esc(it.lead)}</span></button>`).join('')}</div>
    </div>
  </section>`;

  // 13 halls
  D.chapters.forEach((c, ci) => {
    const works = figs.filter((f) => f.chapter === c.n);
    const id = 'hall-' + c.n;
    rooms.push({ id, n: c.n, title: c.title, range: c.range, units: unitsIn(works) });
    html += `
    <section class="room hall ${ci % 2 ? 'alt' : ''}" id="${id}" data-name="第 ${c.n} 章 · ${esc(c.title)}">
      <div class="room-inner">
        <div class="hall-head reveal">
          <div class="hall-no">${c.n}</div>
          <div><div class="hall-range">第 ${c.n} 章 · ${esc(c.range)} · 官方单元 ${unitsIn(works).map((u) => u.no || '城市漫步').join('、')}</div><h2 class="room-title">${esc(c.title)}</h2></div>
        </div>
        <div class="hall-intro reveal">${c.intro.filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      </div>
      ${unitsIn(works).map((u) => `
      <div class="unit reveal" id="unit-${u.from}">
        <div class="room-inner unit-head">
          <span class="unit-no">${u.no ? esc(u.no) : '—'}</span>
          <div>
            <div class="unit-cn">${esc(u.cn)}</div>
            ${u.en ? `<div class="unit-en">${esc(u.en)}</div>` : ''}
            <div class="unit-meta">${u.no ? `官方第 ${esc(u.no)} 单元` : '序章影片单元'} · 图 ${u.from}–${u.to} · ${u.works.length} 张${u.guess ? ' · <em>墙文未拍到，名称为作品内容描述</em>' : ''}</div>
          </div>
        </div>
        <div class="wall-wrap">
          <button class="wall-btn prev" aria-label="向左">‹</button>
          <div class="wall">${u.works.map(workHTML).join('')}</div>
          <button class="wall-btn next" aria-label="向右">›</button>
        </div>
      </div>`).join('')}
      <div class="wall-hint">← 左右滑动浏览每面墙 · 点击画作近看 →</div>
      <div class="room-inner">${D.compares.filter((x) => x.after === c.n).map(compareHTML).join('')}</div>
    </section>`;
  });

  // 尾厅
  rooms.push({ id: 'exit', n: '尾', title: '离开展厅之后', range: '六个判断 · 五分钟再看一幅画' });
  html += `
  <section class="room dark" id="exit" data-name="尾厅 · 离开展厅之后">
    <div class="room-inner">
      <p class="kicker reveal">Six Ideas to Keep</p>
      <h2 class="room-title reveal">走完整场展览，留下六个判断</h2>
      <div class="ideas">${D.ideas.map((x, i) => `<div class="idea reveal"><div class="n">0${i + 1}</div><h4>${esc(x.h)}</h4><p>${linkFigs(esc(x.t))}</p></div>`).join('')}</div>
      <p class="kicker reveal" style="margin-top:96px">A Five-Minute Look</p>
      <h2 class="room-title reveal">怎样再看一幅莫兰迪</h2>
      <div class="five reveal">${D.five.map((x) => `<div class="five-row"><h5>${esc(x.h)}</h5><p>${esc(x.t)}</p></div>`).join('')}</div>
    </div>
  </section>
  <section class="closing">
    <blockquote class="reveal">一个有限的世界，<br>可以被无限次地<br>重新看见。</blockquote>
    <p class="reveal">邓奔奔的莫兰迪观展笔记 · 上海浦东美术馆 · 2026 年 9 月 9 日</p>
    <p class="reveal" style="margin-top:8px;font-size:11px;letter-spacing:.1em">图像均为现场拍摄 · 背景音乐为本站原创生成</p>
    <button class="btn-ghost reveal" id="backTop">回到序厅</button>
  </section>`;

  museum.innerHTML = html;

  function unitsIn(works) {
    const nums = new Set(works.map((w) => w.num));
    return D.units.filter((u) => nums.has(u.from)).map((u) => ({ ...u, works: works.filter((w) => w.num >= u.from && w.num <= u.to) }));
  }
  function unitOf(num) { return D.units.find((u) => num >= u.from && num <= u.to); }
  function workHTML(f) {
    const [w, h] = f.size || [3, 4];
    return `<button class="work" data-fig="${f.num}" aria-label="图 ${f.num} ${esc(f.title)}">
      <div class="frame" style="aspect-ratio:${w}/${h}"><img data-src="thumb/${f.num}.jpg" alt="${esc(f.title)}" width="${w}" height="${h}"></div>
      <div class="label"><span class="no">图 ${f.num} · ${esc(f.type)}</span><span class="ti">${esc(f.title)}</span>${esc(f.sub)}${f.hasDeep ? '<br><span class="deep">含逐画精讲</span>' : ''}</div>
    </button>`;
  }
  function compareHTML(c) {
    return `<div class="compare reveal">
      <p class="kicker">比较专题</p><h3>${esc(c.title)}</h3>
      <div class="compare-pair">${c.pairs.map((p) => `<button data-fig="${p.num}"><img data-src="thumb/${p.num}.jpg" alt="图 ${p.num}"><div class="cap"><b>图 ${p.num}</b>${esc(p.cap)}</div></button>`).join('')}</div>
      <div class="compare-text">${c.text.filter(Boolean).map((t) => `<p>${linkFigs(esc(t))}</p>`).join('')}</div>
    </div>`;
  }
  function linkFigs(s) {
    return s.replace(/图\s?(\d{3})/g, (m, n) => D.figures[n] ? `<a href="#fig-${n}" data-fig="${n}" style="color:inherit;text-decoration:underline;text-decoration-color:rgba(169,120,92,.6);text-underline-offset:3px">${m}</a>` : m);
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

  const ro = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));

  /* ---------------- walls ---------------- */
  document.querySelectorAll('.wall-wrap').forEach((w) => {
    const wall = $('.wall', w);
    $('.prev', w).onclick = () => wall.scrollBy({ left: -wall.clientWidth * 0.7, behavior: 'smooth' });
    $('.next', w).onclick = () => wall.scrollBy({ left: wall.clientWidth * 0.7, behavior: 'smooth' });
  });

  /* ---------------- topbar: hall name, progress, map ---------------- */
  const hallName = $('#hallName'), progress = $('#progress');
  const sections = [...document.querySelectorAll('section[data-name]')];
  let current = '';
  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let s = sections[0];
    for (const sec of sections) if (sec.offsetTop <= y) s = sec;
    if (s.dataset.name !== current) {
      current = s.dataset.name; hallName.textContent = current;
      document.querySelectorAll('#mapList a').forEach((a) => a.classList.toggle('here', s.id === a.getAttribute('href').slice(1) || (s.id.startsWith('hall') === false && a.getAttribute('href') === '#preface' && ['timeline', 'keywords', 'intros'].includes(s.id))));
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  $('#mapList').innerHTML = rooms.map((r) => `<li><a href="#${r.id}"><span class="n">${r.n}</span><span class="t">${esc(r.title)}</span><span class="r">${esc(r.range)}</span></a>${r.units ? `<ul class="map-units">${r.units.map((u) => `<li><a href="#unit-${u.from}"><b>${u.no ? esc(u.no) : '—'}</b>${esc(u.cn)}${u.guess ? ' <i>*</i>' : ''}</a></li>`).join('')}</ul>` : ''}</li>`).join('') + '<li class="map-foot">* 墙文未拍到，名称为作品内容描述</li>';
  const map = $('#map');
  $('#mapBtn').onclick = () => { map.hidden = false; };
  $('#mapClose').onclick = () => { map.hidden = true; };
  map.onclick = (e) => { if (e.target === map || e.target.closest('a')) map.hidden = true; };

  /* ---------------- music ---------------- */
  const bgm = $('#bgm'), musicBtn = $('#musicBtn');
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
    try { localStorage.setItem('morandi-music', '1'); } catch (e) {}
  }
  function stopMusic() {
    musicBtn.classList.remove('playing');
    fadeTo(0, () => bgm.pause());
    try { localStorage.setItem('morandi-music', '0'); } catch (e) {}
  }
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
  $('#backTop').onclick = () => $('#preface').scrollIntoView({ behavior: 'smooth' });

  /* ---------------- viewer ---------------- */
  const viewer = $('#viewer'), vImg = $('#vImg'), vText = $('#vText'), vCount = $('#vCount');
  let idx = -1, auto = null;
  function openFig(num, push = true) {
    const i = order.indexOf(num);
    if (i < 0) return;
    idx = i;
    const f = D.figures[num], dp = D.deep[num];
    const ch = D.chapters.find((c) => c.n === f.chapter);
    viewer.hidden = false; document.body.classList.add('locked');
    vImg.classList.add('fading');
    const img = new Image();
    img.onload = () => { vImg.src = img.src; vImg.alt = f.title; vImg.classList.remove('fading'); };
    img.src = `img/${num}.jpg`;
    vCount.textContent = `${num} / 186`;
    const secs = f.secs.filter((s) => s[0] !== '再看一眼' && s[0] !== '对照原图');
    const look = f.secs.find((s) => s[0] === '再看一眼');
    vText.innerHTML = `
      <div class="tag">第 ${f.chapter} 章 · ${esc(ch ? ch.title : '')}</div>
      ${(u => u ? `<div class="tag" style="margin-top:4px">${u.no ? `官方第 ${esc(u.no)} 单元` : '序章'} · ${esc(u.cn)}${u.en ? ' · ' + esc(u.en) : ''}${u.guess ? '（墙文未拍到）' : ''}</div>` : '')(unitOf(num))}
      <div class="tag" style="margin-top:4px">图 ${num} · ${esc(f.type)}</div>
      <h2>${esc(f.title)}</h2>
      <p class="sub">${esc(f.sub)}</p>
      ${secs.map((s) => `<h3>${esc(s[0])}</h3><p>${linkFigs(esc(s[1]))}</p>`).join('')}
      ${look ? `<div class="look">再看一眼 · ${linkFigs(esc(look[1]))}</div>` : ''}
      ${dp ? `<div class="deepread">
        <div class="dk">逐画精讲 · DEEP LOOKING</div>
        <h4>${esc(dp.headline)}</h4>
        ${dp.secs.map((s, k) => `<div class="sec"><span class="i">0${k + 1}</span><div><h5>${esc(s[0])}</h5><p>${linkFigs(esc(s[1]))}</p></div></div>`).join('')}
        ${dp.refs.length ? `<div class="refs">对照原图 ${dp.refs.map((r) => `<button data-fig="${r}">图 ${r}</button>`).join('')}</div>` : ''}
      </div>` : ''}`;
    vText.scrollTop = 0;
    if (push) history.replaceState(null, '', '#fig-' + num);
    // preload neighbours
    [order[i + 1], order[i - 1]].forEach((n) => { if (n) new Image().src = `img/${n}.jpg`; });
    if (auto) startTimer();
  }
  function closeViewer() {
    viewer.hidden = true; document.body.classList.remove('locked'); stopAuto();
    history.replaceState(null, '', location.pathname + location.search);
    // scroll the wall so the last viewed work is visible
    const el = document.querySelector(`.work[data-fig="${order[idx]}"]`);
    if (el) { el.scrollIntoView({ block: 'center', inline: 'center' }); }
  }
  const step = (d) => openFig(order[(idx + d + order.length) % order.length]);
  $('#vPrev').onclick = () => step(-1);
  $('#vNext').onclick = () => step(1);
  $('#vClose').onclick = closeViewer;

  // auto tour
  const vAuto = $('#vAuto'), vTimer = $('#vTimer');
  let timerStart = 0, raf;
  function durFor() { return Math.min(26000, 9000 + vText.textContent.length * 18); }
  function startTimer() {
    cancelAnimationFrame(raf);
    timerStart = performance.now();
    const dur = durFor();
    const tick = (t) => {
      const p = (t - timerStart) / dur;
      vTimer.style.width = Math.min(100, p * 100) + '%';
      // gently scroll the text along with the timer
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

  // swipe on image (mobile)
  let sx = null;
  $('.viewer-stage').addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  $('.viewer-stage').addEventListener('touchend', (e) => {
    if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  /* ---------------- reader (intros) ---------------- */
  const reader = $('#reader'), rBody = $('#rBody');
  function openIntro(i) {
    const it = D.intros[i];
    rBody.innerHTML = `
      <p class="kicker">导论 · Life &amp; Artistic Thought</p>
      <div class="n">${esc(it.n)}</div>
      <h2>${esc(it.title)}</h2>
      <p class="lead">${esc(it.lead)}</p>
      ${it.secs.map((s) => `<h3>${esc(s[0])}</h3><p>${linkFigs(esc(s[1]))}</p>`).join('')}
      ${it.refs.length ? `<div class="refs" style="margin-top:40px">对照原图 ${it.refs.map((r) => `<button data-fig="${r}">图 ${r}</button>`).join('')}</div>` : ''}
      <div class="reader-nav">
        ${i > 0 ? `<button data-intro="${i - 1}">‹ 导论 ${esc(D.intros[i - 1].n)}</button>` : '<span></span>'}
        ${i < D.intros.length - 1 ? `<button data-intro="${i + 1}">导论 ${esc(D.intros[i + 1].n)} ›</button>` : `<button data-go="hall-01">进入第 01 章 ›</button>`}
      </div>`;
    reader.hidden = false; reader.scrollTop = 0; document.body.classList.add('locked');
  }
  function closeReader() { reader.hidden = true; if (viewer.hidden) document.body.classList.remove('locked'); }
  $('#rClose').onclick = closeReader;

  /* ---------------- global clicks & keys ---------------- */
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-fig]');
    if (f) { e.preventDefault(); if (!reader.hidden) reader.hidden = true; openFig(f.dataset.fig); return; }
    const it = e.target.closest('[data-intro]');
    if (it) { openIntro(+it.dataset.intro); return; }
    const go = e.target.closest('[data-go]');
    if (go) { closeReader(); document.getElementById(go.dataset.go).scrollIntoView({ behavior: 'smooth' }); }
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

  // deep link: #fig-123 opens that work directly (after entering)
  const m = location.hash.match(/^#fig-(\d{3})$/);
  document.body.classList.add('locked');
  if (m) { entrance.hidden = true; document.body.classList.remove('locked'); openFig(m[1], false); }
  onScroll();
})();
