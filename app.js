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
  // 大图：手机用 1400 像素版（img_m），电脑用 2400 像素版（img）
  const BIG = window.innerWidth < 900 ? 'img_m' : 'img';
  const IV = '?i=3'; // 图片版本号：更换图片后递增，避免手机显示缓存里的旧图
  const bigSrc = (n) => `${BIG}/${n}.jpg${IV}`;

  /* ---------------- 开场画与精选导览 ---------------- */
  const KEY = '146'; // 《静物》1956，开场与终场同一幅
  const TOUR = [
    [KEY, '先看一会儿。你最先注意到的是瓶子，还是它们之间的距离？'],
    ['020', '数一数画里有多少条斜线。十年之后，这些斜线都去哪儿了？'],
    ['026', '盖住题目看：这张桌子，像不像一座小小的舞台？'],
    ['038', '用手指遮住那块黄布，画面的重心会往哪边偏？'],
    ['045', '白墙为什么这么亮？看看紧挨着它的是什么颜色。'],
    ['s4364', '瓶子的轮廓，是被画出来的，还是被黑色“围”出来的？'],
    ['058', '这么浓的紫色，为什么没有让画面吵起来？'],
    ['067', '先退远一点看这只白瓶，再看下一张近拍。'],
    ['068', '同一片白，里面藏着多少种颜色、多少道笔触？'],
    ['080', '只看那条路：它是被画上去的，还是被留出来的？'],
    ['s4415', '这一年他入狱数周。他画的，是两只空了的壳。'],
    ['091', '两件器物之间那道缝，如果再窄一点，会发生什么？'],
    ['107', '这束花，就是他工作室里那束丝绸花。他留下了什么，删去了什么？'],
    ['130', '记住壶嘴的方向和下面的小盒子，然后看下一幅。'],
    ['131', '壶嘴转了过去。下面的那些小东西，也跟着重新排队了吗？'],
    ['150', '这是他三十年里每天看见的窗外。你的窗外，有这样一处吗？'],
    ['163', '影子伸得这么长，画为什么没有倒下？'],
    ['166', '都说他晚年越画越淡。找一找，那一抹蓝在哪里？'],
    ['181', '去世前一年的水彩：瓶子在哪里结束，纸又从哪里开始？'],
    [KEY, '又回到了最初这一幅。现在，你看见了什么不同？'],
  ].filter(([n]) => D.figures[n]);

  /* ---------------- build ---------------- */
  const rooms = [];
  let html = '';
  const F = D.front, kf = D.figures[KEY];

  html += `
  <section class="room opening" id="opening" data-name="先看一幅画">
    <div class="room-inner">
      <p class="kicker reveal">Before Everything</p>
      <figure class="key-work reveal">
        <button data-fig="${KEY}" class="key-img"><img src="${bigSrc(KEY)}" alt="${esc(kf.title)}"></button>
        <figcaption>${esc(kf.title)} · ${esc(kf.sub)}</figcaption>
      </figure>
      <p class="key-q reveal">先看一会儿。<br>你最先注意到的是瓶子，还是它们之间的距离？</p>
      <div class="paths reveal">
        <button class="path" id="startTour"><b>精选导览</b><span>${TOUR.length} 站 · 约 15 分钟 · 从这幅画出发，再回到这幅画</span></button>
        <a class="path" href="#about"><b>完整展览</b><span>按现场展线，从展览介绍开始慢慢看</span></a>
      </div>
    </div>
  </section>`;

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

  // 终场：回到同一幅画
  rooms.push({ id: 'finale', n: '终', title: '再看一次', range: '回到最初那一幅画' });
  html += `
  <section class="room dark finale" id="finale" data-name="再看一次">
    <div class="room-inner">
      <p class="kicker reveal">Da Capo</p>
      <figure class="key-work reveal">
        <button data-fig="${KEY}" class="key-img"><img data-src="${bigSrc(KEY)}" alt="${esc(kf.title)}"></button>
        <figcaption>${esc(kf.title)} · ${esc(kf.sub)}</figcaption>
      </figure>
      <p class="key-q reveal">又回到了最初这一幅。<br>现在，你看见了什么不同？</p>
      <div class="paths reveal"><button class="path light" id="againBtn"><b>再看一次</b><span>静静地看这幅画，伴随巴赫《咏叹调返始》</span></button></div>
    </div>
  </section>`;

  rooms.push({ id: 'exit', n: '尾', title: '离开展厅之后', range: '六个观看线索 · 怎样再看一幅莫兰迪' });
  html += `
  <section class="room dark" id="exit" data-name="离开展厅之后">
    <div class="room-inner">
      <p class="kicker reveal">After the Exhibition</p>
      <h2 class="room-title reveal">离开展厅后，带走六个观看线索</h2>
      <div class="ideas">${D.ideas.map((x, i) => `<div class="idea reveal"><div class="n">0${i + 1}</div><h4>${esc(x.h)}</h4><p>${linkFigs(esc(x.t))}</p></div>`).join('')}</div>
      <p class="kicker reveal" style="margin-top:96px">A Five-Minute Look</p>
      <h2 class="room-title reveal">怎样再看一幅莫兰迪</h2>
      <div class="five reveal">${D.five.map((x) => `<div class="five-row"><h5>${esc(x.h)}</h5><p>${esc(x.t)}</p></div>`).join('')}</div>
    </div>
  </section>
  <section class="closing">
    <blockquote class="reveal">一个有限的世界，<br>可以被无限次地<br>重新看见。</blockquote>
    <p class="reveal">邓奔奔 · 上海浦东美术馆 · 2026 年 9 月 9 日</p>
    <p class="reveal" style="margin-top:8px;font-size:11px;letter-spacing:.1em">图像均为现场拍摄 · 背景音乐：巴赫《哥德堡变奏曲》咏叹调，石坂公美子演奏（Open Goldberg Variations，CC0 公共领域）</p>
    <div class="closing-actions reveal">
      <button class="btn-ghost" id="moreBtn">继续深读</button>
      <button class="btn-ghost" id="backTop">回到开头</button>
    </div>
  </section>`;

  rooms.push({ id: 'reading', n: '读', title: '继续深读', range: '观看关键词 · 十二篇导读 · 参考文献' });
  html += `
  <section class="room" id="reading" data-name="继续深读" hidden>
    <div class="room-inner">
      <p class="kicker">Further Reading</p>
      <h2 class="room-title">六个观看关键词</h2>
      <div class="keywords">${D.keywords.map((k) => `<div class="kw"><div class="n">${esc(k.n)}</div><h4>${esc(k.h)}</h4><p>${esc(k.t)}</p><div class="ex">${linkFigs(esc(k.ex))}</div></div>`).join('')}</div>
      <h2 class="room-title" style="margin-top:96px">十二篇导读：生平与艺术哲学</h2>
      <div class="intro-grid">${D.intros.map((it, i) => `<button class="intro-card" data-intro="${i}"><span class="n">${esc(it.n)}</span><span class="t">${esc(it.title)}</span><span class="l">${esc(it.lead)}</span></button>`).join('')}</div>
      <h2 class="room-title" style="margin-top:96px">参考文献</h2>
      <ul class="refs-list">${D.references.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>
  </section>`;

  museum.innerHTML = html;

  function workHTML(f) {
    const [w, h] = f.size || [3, 4];
    return `<button class="work" data-fig="${f.num}" aria-label="${esc(f.title)}">
      <div class="frame" style="aspect-ratio:${w}/${h}"><img data-src="thumb/${f.num}.jpg${IV}" alt="${esc(f.title)}" width="${w}" height="${h}"></div>
      <div class="label"><span class="no">图 ${f.disp}${f.kind ? ' · ' + esc(f.kind) : ''}</span><span class="ti">${esc(f.title)}</span>${f.sub ? `<span class="sb">${esc(f.sub)}</span>` : ''}${D.deep[f.num] ? '<span class="deep">有细读</span>' : ''}</div>
    </button>`;
  }
  function compareHTML(c) {
    return `<div class="compare reveal">
      <p class="kicker">比较</p><h3>${esc(c.title)}</h3>
      <div class="compare-pair">${c.pairs.filter((p) => D.figures[p.num]).map((p) => `<button data-fig="${p.num}"><img data-src="thumb/${p.num}.jpg${IV}" alt="${esc(D.figures[p.num].title)}"><div class="cap"><b>${esc(D.figures[p.num].title)}</b>${esc(p.cap)}</div></button>`).join('')}</div>
      <div class="compare-text">${c.text.filter(Boolean).map((t) => `<p>${linkFigs(esc(t))}</p>`).join('')}</div>
    </div>`;
  }
  function linkFigs(s) {
    return s.replace(/图(\d{1,3})/g, (m, n) => D.disp[n] ? `<a href="#fig-${D.disp[n]}" data-fig="${D.disp[n]}" class="figlink">${m}</a>` : m);
  }

  /* ---------------- lazy images & reveal ---------------- */
  // 图片排队加载：同一时间最多下载 4 张；新进入视野的区块排到队首，
  // 同一面墙内按从左到右的顺序，眼前的画总是最先出现。
  const queue = []; let active = 0; const MAXC = 4;
  function pump() {
    while (active < MAXC && queue.length) {
      const img = queue.shift();
      if (!img.dataset.src) continue;
      active++;
      const done = () => { img.classList.add('loaded'); active--; pump(); };
      img.onload = done; img.onerror = done;
      img.src = img.dataset.src;
      delete img.dataset.src;
    }
  }
  function enqueue(imgs) {
    const list = [...imgs].filter((i) => i.dataset.src);
    list.forEach((i) => { const k = queue.indexOf(i); if (k >= 0) queue.splice(k, 1); });
    queue.unshift(...list); pump();
  }
  const io = new IntersectionObserver((ents) => {
    ents.filter((e) => e.isIntersecting).reverse().forEach((e) => {
      enqueue(e.target.querySelectorAll('img[data-src]'));
      io.unobserve(e.target);
    });
  }, { rootMargin: '100% 0px' });
  document.querySelectorAll('.wall-wrap, .compare, .key-work').forEach((b) => io.observe(b));
  enqueue([...document.querySelectorAll('img[data-src]')].filter((img) => !img.closest('.wall-wrap, .compare, .key-work')));
  // 左右滑动时，把墙上即将出现的画提到队首
  document.querySelectorAll('.wall').forEach((wall) => wall.addEventListener('scroll', () => {
    const right = wall.getBoundingClientRect().right + window.innerWidth;
    enqueue([...wall.querySelectorAll('img[data-src]')].filter((i) => i.getBoundingClientRect().left < right));
  }, { passive: true }));
  document.querySelectorAll('.compare-pair img, .key-img img').forEach((i) => i.classList.add('loaded'));
  const ro = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));

  document.querySelectorAll('.wall-wrap').forEach((w) => {
    const wall = $('.wall', w);
    $('.prev', w).onclick = () => wall.scrollBy({ left: -wall.clientWidth * 0.7, behavior: 'smooth' });
    $('.next', w).onclick = () => wall.scrollBy({ left: wall.clientWidth * 0.7, behavior: 'smooth' });
  });

  /* ---------------- topbar & map ---------------- */
  const hallName = $('#hallName'), progress = $('#progress');
  let sections = [...document.querySelectorAll('section[data-name]')];
  let current = '';
  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let s = sections[0];
    for (const sec of sections) if (!sec.hidden && sec.offsetTop <= y) s = sec;
    if (s.dataset.name !== current) {
      current = s.dataset.name; hallName.textContent = current;
      document.querySelectorAll('#mapList a').forEach((a) => a.classList.toggle('here', a.getAttribute('href') === '#' + s.id));
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  let lastFloor = null;
  $('#mapList').innerHTML = `<li><a href="#opening"><span class="n">始</span><span class="t">先看一幅画</span><span class="r">开场 · 精选导览入口</span></a></li>` + rooms.map((r) => {
    let head = '';
    if (r.floor && r.floor !== lastFloor) { lastFloor = r.floor; head = `<li class="map-floor">${r.floor === 1 ? '一楼' : '二楼'}</li>`; }
    return `${head}<li><a href="#${r.id}"><span class="n">${esc(r.n)}</span><span class="t">${esc(r.title)}</span><span class="r">${esc(r.range)}</span></a></li>`;
  }).join('');
  const map = $('#map');
  $('#mapBtn').onclick = () => { map.hidden = false; };
  $('#mapClose').onclick = () => { map.hidden = true; };
  map.onclick = (e) => {
    const a = e.target.closest('a');
    if (a && a.getAttribute('href') === '#reading') showReading();
    if (e.target === map || a) map.hidden = true;
  };

  /* ---------------- reading (继续深读) ---------------- */
  const reading = $('#reading');
  function showReading() {
    if (reading.hidden) { reading.hidden = false; sections = [...document.querySelectorAll('section[data-name]')]; }
    setTimeout(() => reading.scrollIntoView({ behavior: 'smooth' }), 30);
  }
  $('#moreBtn').onclick = showReading;
  $('#backTop').onclick = () => $('#opening').scrollIntoView({ behavior: 'smooth' });

  /* ---------------- music ----------------
     展览配乐（默认）：开场咏叹调播放一遍；终场“再看一次”时播放《咏叹调返始》。
     持续伴听：两首交替循环。音乐只由入口选择和音乐开关控制。 */
  const bgm = $('#bgm'), musicBtn = $('#musicBtn');
  const ARIA = 'audio/aria.mp3', DACAPO = 'audio/aria_dacapo.mp3';
  let musicOn = false, mode = 'exhibit';
  try { mode = localStorage.getItem('morandi-music-mode') || 'exhibit'; } catch (e) {}
  let fadeT;
  function fadeTo(v, done) {
    clearInterval(fadeT);
    fadeT = setInterval(() => {
      const d = v - bgm.volume;
      if (Math.abs(d) < 0.02) { bgm.volume = v; clearInterval(fadeT); done && done(); return; }
      bgm.volume = Math.min(1, Math.max(0, bgm.volume + Math.sign(d) * 0.02));
    }, 60);
  }
  function play(src) {
    if (src && !bgm.src.endsWith(src)) bgm.src = src;
    bgm.volume = 0;
    const p = bgm.play();
    if (p) p.then(() => { musicBtn.classList.add('playing'); fadeTo(0.55); }).catch(() => {});
  }
  function stopMusic() { musicBtn.classList.remove('playing'); fadeTo(0, () => bgm.pause()); }
  bgm.addEventListener('ended', () => {
    musicBtn.classList.remove('playing');
    if (mode === 'loop' && musicOn) play(bgm.src.endsWith(ARIA) ? DACAPO : ARIA);
  });
  function playReturn() { if (musicOn) play(DACAPO); }
  musicBtn.onclick = () => {
    if (musicBtn.classList.contains('playing')) { musicOn = false; stopMusic(); }
    else { musicOn = true; play(); }
  };
  // 声音设置（放在导览面板里）
  const panel = $('.map-panel');
  const sound = document.createElement('div');
  sound.className = 'sound-set';
  panel.insertBefore(sound, $('#mapList'));
  function renderSound() {
    sound.innerHTML = `<div class="sound-h">声音</div>
      <button data-mode="exhibit" class="${mode === 'exhibit' ? 'on' : ''}"><b>展览配乐</b><span>开场播放《咏叹调》，终场“再看一次”时播放《咏叹调返始》，其余时间安静</span></button>
      <button data-mode="loop" class="${mode === 'loop' ? 'on' : ''}"><b>持续伴听</b><span>两首交替循环，一直有音乐</span></button>`;
  }
  renderSound();
  sound.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]'); if (!b) return;
    e.stopPropagation();
    mode = b.dataset.mode; renderSound();
    try { localStorage.setItem('morandi-music-mode', mode); } catch (err) {}
    if (mode === 'loop' && musicOn && bgm.paused) play();
  });

  /* ---------------- entrance ---------------- */
  const entrance = $('#entrance');
  function enter(withMusic) {
    entrance.classList.add('gone');
    document.body.classList.remove('locked');
    musicOn = withMusic;
    if (withMusic) play(ARIA);
    setTimeout(() => { entrance.hidden = true; }, 1500);
  }
  $('#enterWithMusic').onclick = () => enter(true);
  $('#enterSilent').onclick = () => enter(false);
  $('#againBtn').onclick = () => { playReturn(); tour = -1; openFig(KEY); };

  /* ---------------- viewer ---------------- */
  const viewer = $('#viewer'), vImg = $('#vImg'), vText = $('#vText'), vCount = $('#vCount');
  let idx = -1, auto = null, tour = -1;
  function openFig(num, push = true) {
    const i = order.indexOf(num);
    if (i < 0) return;
    idx = i;
    const f = D.figures[num], dp = D.deep[num], u = unitOf(num);
    viewer.hidden = false; document.body.classList.add('locked');
    vImg.classList.add('fading');
    const img = new Image(), want = bigSrc(num);
    vImg.dataset.want = want;
    img.onload = () => { if (vImg.dataset.want !== want) return; vImg.src = img.src; vImg.alt = f.title; vImg.classList.remove('fading'); };
    img.src = want;
    const inTour = tour >= 0;
    vCount.textContent = inTour ? `精选 ${tour + 1} / ${TOUR.length}` : `${i + 1} / ${order.length}`;
    viewer.classList.toggle('touring', inTour);
    const secs = f.secs.filter((s) => s[0] !== '再看一眼');
    const look = f.secs.find((s) => s[0] === '再看一眼');
    const last = inTour && tour === TOUR.length - 1;
    vText.innerHTML = `
      ${inTour ? `<div class="tour-q">${esc(TOUR[tour][1])}</div>` : ''}
      ${last ? `<div class="tour-end"><button class="pill" data-go="about">进入完整展览</button><button class="pill" data-go="reading">继续深读</button></div>` : ''}
      ${u ? `<div class="tag">${esc(unitName(u))}</div>` : ''}
      <div class="tag kind">图 ${f.disp}${f.kind ? ' · ' + esc(f.kind) : ''}</div>
      <h2>${esc(f.title)}</h2>
      ${f.sub ? `<p class="sub">${esc(f.sub)}</p>` : '<div style="height:12px"></div>'}
      ${secs.map((s) => `<h3>${esc(s[0])}</h3><p>${linkFigs(esc(s[1]))}</p>`).join('')}
      ${look && !inTour ? `<div class="look">再看一眼 · ${linkFigs(esc(look[1]))}</div>` : ''}
      ${dp && dp.secs.length ? `<div class="deepread">
        <div class="dk">细读 · DEEP LOOKING</div>
        <h4>${esc(dp.headline)}</h4>
        ${dp.secs.map((s, k) => `<div class="sec"><span class="i">0${k + 1}</span><div><h5>${esc(s[0])}</h5><p>${linkFigs(esc(s[1]))}</p></div></div>`).join('')}
        ${dp.refs.length ? `<div class="refs">对照 ${dp.refs.map((r) => `<button data-fig="${r}">${esc(D.figures[r].title)}</button>`).join('')}</div>` : ''}
      </div>` : ''}`;
    vText.scrollTop = 0;
    if (push) history.replaceState(null, '', '#fig-' + num);
    const nb = inTour ? [TOUR[tour + 1], TOUR[tour - 1]].map((x) => x && x[0]) : [order[i + 1], order[i - 1]];
    nb.forEach((n) => { if (n) new Image().src = bigSrc(n); });
    if (last) playReturn();
    if (auto) startTimer();
  }
  function closeViewer() {
    const wasTour = tour >= 0;
    viewer.hidden = true; document.body.classList.remove('locked'); stopAuto(); tour = -1;
    viewer.classList.remove('touring');
    history.replaceState(null, '', location.pathname + location.search);
    if (wasTour) return;
    const el = document.querySelector(`.work[data-fig="${order[idx]}"]`);
    if (el) el.scrollIntoView({ block: 'center', inline: 'center' });
  }
  function step(d) {
    if (tour >= 0) {
      const t = tour + d;
      if (t < 0 || t >= TOUR.length) { if (t >= TOUR.length) stopAuto(); return; }
      tour = t; openFig(TOUR[t][0]); return;
    }
    openFig(order[(idx + d + order.length) % order.length]);
  }
  function startTour() { tour = 0; openFig(TOUR[0][0]); }
  $('#startTour').onclick = startTour;
  $('#vPrev').onclick = () => step(-1);
  $('#vNext').onclick = () => step(1);
  $('#vClose').onclick = closeViewer;

  // 自动换画：不开音乐；主要介绍随时间慢慢滚动（细读部分留给观众手动阅读）；
  // 停留时间按主要介绍的字数计算（16—50 秒）；观众一碰文字就自动暂停
  const vAuto = $('#vAuto'), vTimer = $('#vTimer');
  let timerStart = 0, raf;
  function startTimer() {
    cancelAnimationFrame(raf);
    timerStart = performance.now();
    const deep = vText.querySelector('.deepread');
    const mainChars = (deep ? vText.textContent.length - deep.textContent.length : vText.textContent.length);
    const DUR = Math.max(16000, Math.min(50000, 8000 + mainChars * 90));
    const deepTop = deep ? deep.getBoundingClientRect().top - vText.getBoundingClientRect().top + vText.scrollTop : 0;
    const tick = (t) => {
      const p = (t - timerStart) / DUR;
      vTimer.style.width = Math.min(100, p * 100) + '%';
      const end = deep ? Math.max(0, deepTop - vText.clientHeight * 0.6) : vText.scrollHeight - vText.clientHeight;
      if (end > 0 && p > 0.12) vText.scrollTop = Math.min(end, end * Math.min(1, (p - 0.12) / 0.78));
      if (p >= 1) { step(1); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function stopAuto() { auto = null; cancelAnimationFrame(raf); vTimer.style.width = 0; vAuto.classList.remove('on'); vAuto.textContent = '▶ 自动换画'; }
  vAuto.textContent = '▶ 自动换画';
  vAuto.onclick = () => {
    if (auto) return stopAuto();
    auto = true; vAuto.classList.add('on'); vAuto.textContent = '❚❚ 暂停';
    startTimer();
  };
  ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach((ev) => vText.addEventListener(ev, () => { if (auto) stopAuto(); }, { passive: true }));

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
    const go = e.target.closest('[data-go]');
    if (go) { closeViewer(); if (go.dataset.go === 'reading') showReading(); else $('#' + go.dataset.go).scrollIntoView({ behavior: 'smooth' }); return; }
    const f = e.target.closest('[data-fig]');
    if (f) { e.preventDefault(); if (!reader.hidden) reader.hidden = true; if (!f.closest('#vText')) tour = -1; openFig(f.dataset.fig); return; }
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
