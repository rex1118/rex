/* ============================================================
   fx.js — 모든 페이지 공통 "잔잔한 연출" (가벼운 버전 / 트래픽 0)
   · 천천히 떠다니는 입자   · 클릭하면 모양이 톡 터짐   · 카드 살짝 기울기
   · 프사 클릭 이스터에그(프사 톡 = 하트 펑 + 또잉 바운스)   · 생일 D-Day 계산 도우미(fxDday)

   ★★ 사람마다 바꿀 곳은 아래 "설정" 4줄뿐입니다 ★★
   우히 = 하트(♡). 다른 사람은 별(★) · 토끼(🐰) · 음표(♪) · 물방울(💧) 등으로 교체.
   - 글자 모양(♡ ★ ♪ ✦ ☆)은 그 사람 메인색(--main)으로 칠해집니다.
   - 이모지(🐰 ⭐ 💧)는 색칠 대신 이모지 그대로 보입니다. (둘 다 OK)

   사용법: 각 페이지 </body> 바로 위에 한 줄
     · 메인(루트 index.html):  <script src="fx.js"></script>
     · 서브폴더 페이지:         <script src="../fx.js"></script>
   색은 페이지의 --main 변수를 그대로 써서 다크모드까지 자동 적용됩니다.
   ============================================================ */

/* ─────────── 설정 (이 사람에 맞게 바꾸세요) ─────────── */
var FX_FLOAT = ['♡','✦','♡','✧','◆'];        // 떠다니는 입자 (초록 하트 + 반짝임 + 픽셀)
var FX_CLICK = '🦖';                          // 클릭하면 톡 터지는 모양 (공룡!)
var FX_COUNT = 14;                            // 떠다니는 입자 개수 (많을수록 무거움)
var FX_TILT  = true;                          // 카드 마우스오버 살짝 기울기 (끄려면 false)
/* 예)  별 테마 :  FX_FLOAT=['★','✦','☆'];   FX_CLICK='★';
        토끼 테마:  FX_FLOAT=['🐰','✦','♡'];  FX_CLICK='🐰';
        음표 테마:  FX_FLOAT=['♪','♫','✦'];   FX_CLICK='♪';                 */
/* ────────────────────────────────────────────────────── */

(function () {
  var mqReduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqFine   = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;

  var css = `
    body::before{ display:none !important; }            /* 빽빽한 정적 배경무늬 끄기 */
    #fx{ position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
    .fx-p{ position:absolute; top:-26px; color:var(--main); opacity:0; will-change:transform,opacity; animation:fxFall linear infinite; }
    @keyframes fxFall{
      0%{ transform:translateY(-26px) translateX(0) rotate(0); opacity:0; }
      12%{ opacity:.5; } 88%{ opacity:.4; }
      100%{ transform:translateY(103vh) translateX(var(--drift,20px)) rotate(210deg); opacity:0; }
    }
    .container, .wrap{ perspective:1300px; }
    .card{ transition:transform .25s ease, box-shadow .25s ease; will-change:transform; }
    .card.fx-tilting{ box-shadow:var(--shadow-hover); }
    .fx-heart{ position:fixed; z-index:500; pointer-events:none; color:var(--main); transform:translate(-50%,-50%); animation:fxHeart .95s ease-out forwards; }
    @keyframes fxHeart{
      0%{ opacity:0; transform:translate(-50%,-50%) scale(.4); }
      18%{ opacity:.85; }
      100%{ opacity:0; transform:translate(calc(-50% + var(--hx,0px)), calc(-50% - 62px)) scale(1.05); }
    }
    @keyframes fxBoing{ 0%{ transform:scale(1); } 28%{ transform:scale(.84); } 52%{ transform:scale(1.14); } 74%{ transform:scale(.95); } 100%{ transform:scale(1); } }
    .fx-boing{ animation:fxBoing .5s ease; }
    @media (prefers-reduced-motion: reduce){ #fx{ display:none; } .card{ transition:none; } .fx-heart{ display:none; } .fx-boing{ animation:none; } }
  `;
  var st = document.createElement('style'); st.id = 'fx-style'; st.textContent = css; document.head.appendChild(st);

  function build() {
    /* 떠다니는 입자 */
    if (!mqReduce) {
      var fx = document.getElementById('fx');
      if (!fx) { fx = document.createElement('div'); fx.id = 'fx'; fx.setAttribute('aria-hidden','true'); document.body.appendChild(fx); }
      if (!fx.childElementCount) {
        for (var i = 0; i < FX_COUNT; i++) {
          var p = document.createElement('span'); p.className = 'fx-p';
          p.textContent = FX_FLOAT[(Math.random() * FX_FLOAT.length) | 0];
          var dur = 13 + Math.random() * 11;
          p.style.left = (Math.random() * 100).toFixed(2) + 'vw';
          p.style.fontSize = (9 + Math.random() * 7).toFixed(1) + 'px';
          p.style.animationDuration = dur.toFixed(1) + 's';
          p.style.animationDelay = (-Math.random() * dur).toFixed(1) + 's';
          p.style.setProperty('--drift', (Math.random() * 60 - 30).toFixed(0) + 'px');
          fx.appendChild(p);
        }
      }
    }
    /* 카드 살짝 기울기 (데스크톱 마우스에서만) */
    if (FX_TILT && mqFine && !mqReduce) {
      document.querySelectorAll('.card').forEach(function (card) {
        if (card.dataset.fxTilt) return; card.dataset.fxTilt = '1';
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var rx = (0.5 - (e.clientY - r.top) / r.height) * 5;
          var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
          card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
          card.classList.add('fx-tilting');
        });
        card.addEventListener('mouseleave', function () { card.style.transform = ''; card.classList.remove('fx-tilting'); });
      });
    }
    /* 프사 톡(이스터에그): 프사를 클릭하면 모양이 펑 */
    var av = document.querySelector('.avatar-wrap, #avatarWrap, .avatar');
    if (av && !av.dataset.fxPop) {
      av.dataset.fxPop = '1'; av.style.cursor = 'pointer';
      av.addEventListener('click', function (e) {
        window.fxHearts(e.clientX, e.clientY, 10);
        if (!mqReduce) { av.classList.remove('fx-boing'); void av.offsetWidth; av.classList.add('fx-boing'); }
      });
    }
  }

  /* 모양 뿌리기 (전역 공용) */
  window.fxHearts = function (x, y, n) {
    if (mqReduce) return;
    for (var i = 0; i < n; i++) {
      var h = document.createElement('span'); h.className = 'fx-heart'; h.textContent = FX_CLICK;
      h.style.left = x + 'px'; h.style.top = y + 'px';
      h.style.fontSize = (12 + Math.random() * 8).toFixed(0) + 'px';
      h.style.setProperty('--hx', (Math.random() * 64 - 32).toFixed(0) + 'px');
      h.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';
      document.body.appendChild(h);
      (function (el) { setTimeout(function () { el.remove(); }, 1200); })(h);
    }
  };

  /* 생일 D-Day 도우미: fxDday('03-15') → 다음 생일까지 남은 일수(숫자). 오늘이면 0.
     사용 예) document.getElementById('dday').textContent = 'D-' + fxDday('03-15'); */
  window.fxDday = function (mmdd) {
    try {
      var t = String(mmdd).split(/[-./]/); var m = parseInt(t[0],10), d = parseInt(t[1],10);
      if (!m || !d) return null;
      var now = new Date(); now.setHours(0,0,0,0);
      var y = now.getFullYear(); var next = new Date(y, m-1, d);
      if (next < now) next = new Date(y+1, m-1, d);
      return Math.round((next - now) / 86400000);
    } catch (e) { return null; }
  };

  /* 아무 데나 클릭하면 모양 톡 (입력창·버튼·링크·프사 위에선 생략) */
  document.addEventListener('click', function (e) {
    if (e.target.closest('input, textarea, button, a, .iq-modal, .iq-ov, .avatar-wrap, #avatarWrap, .avatar')) return;
    window.fxHearts(e.clientX, e.clientY, 4);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
