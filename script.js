const U = id => `https://images.unsplash.com/photo-${id}?w=600&q=80`;
const CATS = [
  { id: 'burger', name: 'Burgers', img: U('1568901346375-23c9450c58cd') },
  { id: 'pizza', name: 'Pizza', img: U('1513104890138-7c749659a591') },
  { id: 'hotdog', name: 'Hot Dogs', img: U('1612392062631-94dd858cba88') },
  { id: 'fries', name: 'French Fries', img: U('1573080496219-bb080dd4f877') },
  { id: 'chicken', name: 'Chicken', img: U('1626645738196-c2a7c87a8f58') },
  { id: 'drink', name: 'Drinks', img: U('1622483767028-3f66f32aef97') }
];
const PRODUCTS = [
  { id: 1, name: 'Burger', cat: 'burger', price: 28000, rate: 4.7, img: U('1568901346375-23c9450c58cd') },
  { id: 2, name: 'Cheeseburger', cat: 'burger', price: 32000, rate: 4.8, img: U('1550547660-d9450f859349') },
  { id: 3, name: 'Double Burger', cat: 'burger', price: 45000, rate: 4.9, img: U('1553979459-d2229ba7433b') },
  { id: 4, name: 'Chicken Burger', cat: 'burger', price: 30000, rate: 4.6, img: U('1606755962773-d324e0a13086') },
  { id: 5, name: 'Pepperoni Pizza', cat: 'pizza', price: 79000, rate: 4.9, img: U('1628840042765-356cda07504e') },
  { id: 6, name: 'Margherita Pizza', cat: 'pizza', price: 69000, rate: 4.6, img: U('1513104890138-7c749659a591') },
  { id: 7, name: 'Classic Hot Dog', cat: 'hotdog', price: 22000, rate: 4.5, img: U('1612392062631-94dd858cba88') },
  { id: 8, name: 'French Fries', cat: 'fries', price: 18000, rate: 4.7, img: U('1573080496219-bb080dd4f877') },
  { id: 9, name: 'Nuggets', cat: 'chicken', price: 29000, rate: 4.8, img: U('1626645738196-c2a7c87a8f58') },
  { id: 10, name: 'Fried Chicken', cat: 'chicken', price: 48000, rate: 4.8, img: U('1562967914-608f82629710') },
  { id: 11, name: 'Cola', cat: 'drink', price: 9000, rate: 4.4, img: U('1622483767028-3f66f32aef97') },
  { id: 12, name: 'Milkshake', cat: 'drink', price: 24000, rate: 4.9, img: U('1572490122747-3968b75cc699') }
];

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const money = n => n.toLocaleString('ru-RU') + " so'm";
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let filter = 'all', query = '', discount = 0;

// Rasm yuklanmasa — gradient fon qoladi
const imgTag = (src, alt) => `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">`;

/* Loader */
window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('hide'), 700));

/* Toast */
let tt;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200);
}

/* Kategoriyalar */
$('#cats').innerHTML = CATS.map(c =>
  `<button class="cat reveal" data-cat="${c.id}">${imgTag(c.img, c.name)}<span>${c.name}</span></button>`).join('');
$$('.cat').forEach(b => b.onclick = () => {
  filter = filter === b.dataset.cat ? 'all' : b.dataset.cat;
  $$('.cat').forEach(x => x.classList.toggle('on', x.dataset.cat === filter));
  renderProducts();
  goTo(2);
});

/* Mahsulotlar */
function renderProducts() {
  const list = PRODUCTS.filter(p => (filter === 'all' || p.cat === filter) &&
    p.name.toLowerCase().includes(query.toLowerCase()));
  const cn = CATS.find(c => c.id === filter);
  $('#filterInfo').textContent = (cn ? cn.name : 'Barcha mahsulotlar') + (query ? ` · "${query}"` : '') + ` (${list.length})`;
  $('#grid').innerHTML = list.length ? list.map((p, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="im">${imgTag(p.img, p.name)}</div>
      <div class="bd"><h3>${p.name}</h3>
        <div class="rate"><i class="fa-solid fa-star"></i> ${p.rate}<span>(${Math.round(p.rate * 40)})</span></div>
        <div class="row"><span class="price">${money(p.price)}</span>
        <button class="add" data-id="${p.id}"><i class="fa-solid fa-plus"></i> Add to Cart</button></div>
      </div>
    </article>`).join('') : '<p class="empty">Hech narsa topilmadi. Boshqa so\'z bilan qidiring.</p>';
  $$('.add').forEach(b => b.onclick = () => addToCart(+b.dataset.id));
  tilt($$('.card'));
}

/* 3D tilt */
function tilt(els) {
  els.forEach(el => {
    el.onmousemove = e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
    };
    el.onmouseleave = () => el.style.transform = '';
  });
}
tilt($$('.tilt'));

/* Savat */
function save() { localStorage.setItem('cart', JSON.stringify(cart)); renderCart(); }
function addToCart(id) {
  const it = cart.find(c => c.id === id);
  it ? it.qty++ : cart.push({ id, qty: 1 });
  save(); toast('Savatga qo\'shildi');
}
function total() { return cart.reduce((s, c) => s + PRODUCTS.find(p => p.id === c.id).price * c.qty, 0); }
function renderCart() {
  $('#cartCount').textContent = cart.reduce((s, c) => s + c.qty, 0);
  $('#total').textContent = money(total());
  $('#items').innerHTML = cart.length ? cart.map(c => {
    const p = PRODUCTS.find(x => x.id === c.id);
    return `<div class="ci">${imgTag(p.img, p.name)}
      <div><b>${p.name}</b><br><small>${money(p.price * c.qty)}</small>
      <div class="qty"><button data-a="-" data-id="${c.id}">−</button><span>${c.qty}</span><button data-a="+" data-id="${c.id}">+</button></div></div>
      <button class="del" data-a="x" data-id="${c.id}" aria-label="Delete"><i class="fa-solid fa-trash"></i></button></div>`;
  }).join('') : '<p class="empty">Savat bo\'sh. Menyudan taom tanlang.</p>';
}
$('#items').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  const id = +b.dataset.id, it = cart.find(c => c.id === id);
  if (b.dataset.a === '+') it.qty++;
  if (b.dataset.a === '-') it.qty--;
  if (b.dataset.a === 'x' || it.qty <= 0) cart = cart.filter(c => c.id !== id);
  save();
};

/* Drawer / modallar */
const closeAll = () => { $$('#drawer,.modal,.overlay').forEach(x => x.classList.remove('on')); };
const open = el => { closeAll(); el.classList.add('on'); if (el.id === 'drawer') $('#overlay').classList.add('on'); };
$('#cartBtn').onclick = () => open($('#drawer'));
$('#authBtn').onclick = () => open($('#authModal'));
$('#overlay').onclick = closeAll;
$$('[data-close]').forEach(b => b.onclick = closeAll);
$$('.modal').forEach(m => m.onclick = e => { if (e.target === m) closeAll(); });
document.addEventListener('keydown', e => e.key === 'Escape' && closeAll());

$('#checkoutBtn').onclick = () => {
  if (!cart.length) return toast('Savat bo\'sh!');
  $('#orderTotal').textContent = money(total());
  open($('#orderModal'));
};
$('#promo').oninput = e => {
  const c = e.target.value.trim().toUpperCase();
  discount = c === 'FIRST50' ? .5 : c === 'BOGO1' ? .25 : 0;
  $('#orderTotal').textContent = money(Math.round(total() * (1 - discount)));
};
$('#orderForm').onsubmit = e => {
  e.preventDefault(); cart = []; save(); e.target.reset(); closeAll();
  toast('Buyurtma qabul qilindi! Tez orada bog\'lanamiz.');
};

/* Login / Register */
let user = JSON.parse(localStorage.getItem('user') || 'null');
function renderUser() { $('#authBtn').textContent = user ? `Salom, ${user}` : 'Login / Register'; }
$$('.tabs button').forEach(b => b.onclick = () => {
  $$('.tabs button').forEach(x => x.classList.toggle('on', x === b));
  $('#loginForm').hidden = b.dataset.tab !== 'login';
  $('#regForm').hidden = b.dataset.tab !== 'reg';
});
$('#loginForm').onsubmit = e => {
  e.preventDefault(); user = e.target[0].value.split('@')[0];
  localStorage.setItem('user', JSON.stringify(user)); renderUser(); closeAll(); toast('Xush kelibsiz!');
};
$('#regForm').onsubmit = e => {
  e.preventDefault(); user = e.target[0].value;
  localStorage.setItem('user', JSON.stringify(user)); renderUser(); closeAll(); toast('Ro\'yxatdan o\'tdingiz!');
};
$('#authBtn').addEventListener('dblclick', () => { if (user) { user = null; localStorage.removeItem('user'); renderUser(); toast('Chiqildi'); } });

/* Qidiruv */
$('#search').oninput = e => { query = e.target.value.trim(); renderProducts(); if (query) goTo(2); };
$('#search').onkeydown = e => e.key === 'Enter' && goTo(2);
$('#searchBtn').onclick = () => { $('#search').focus(); goTo(2); };

/* Promo kod nusxalash */
$$('.code').forEach(b => b.onclick = () => {
  navigator.clipboard?.writeText(b.dataset.code); toast(`${b.dataset.code} nusxalandi`);
});

/* Countdown */
const end = Date.now() + 3 * 864e5;
setInterval(() => {
  const d = Math.max(0, end - Date.now()), p = n => String(n).padStart(2, '0');
  const v = [[Math.floor(d / 864e5), 'kun'], [Math.floor(d % 864e5 / 36e5), 'soat'], [Math.floor(d % 36e5 / 6e4), 'min'], [Math.floor(d % 6e4 / 1e3), 'sek']];
  $('#timer').innerHTML = v.map(([n, l]) => `<div>${p(n)}<small>${l}</small></div>`).join('');
}, 1000);

/* Contact form */
$('#contactForm').onsubmit = e => { e.preventDefault(); e.target.reset(); toast('Xabar yuborildi. Rahmat!'); };

/* ===== FULL-PAGE SECTION NAVIGATION ===== */
const secs = $$('#scroller > section');
const ids = secs.map(x => x.id);
let idx = 0, locked = false, lastWheel = 0, settleT;

// Rasmlar alohida (scale+blur), matnlar ketma-ket (fade-up) animatsiya qiladi
secs.forEach(sec => {
  sec.querySelectorAll('.hero-img,.collage,.map,.cat').forEach(el => { el.classList.remove('reveal'); el.classList.add('pic'); });
  sec.querySelectorAll('.reveal,.pic').forEach((el, i) => el.style.setProperty('--i', i));
});

// Navbar / mobil menyu
$('#burger').onclick = () => $('#links').classList.toggle('on');
const mAuth = document.createElement('a');
mAuth.href = '#'; mAuth.textContent = 'Login / Register'; mAuth.style.color = 'var(--yel)';
mAuth.onclick = e => { e.preventDefault(); $('#links').classList.remove('on'); open($('#authModal')); };
$('#links').append(mAuth);
$$('a[href^="#"]').forEach(a => {
  const i = ids.indexOf(a.getAttribute('href').slice(1));
  if (i < 0) return;
  a.addEventListener('click', e => { e.preventDefault(); $('#links').classList.remove('on'); goTo(i); });
});

// Nuqtali indikator
const dots = document.createElement('nav');
dots.id = 'dots';
dots.innerHTML = secs.map((x, i) => `<button aria-label="${x.id}" data-i="${i}"></button>`).join('');
document.body.append(dots);
dots.onclick = e => { const b = e.target.closest('button'); if (b) goTo(+b.dataset.i); };

function setUI() {
  $('#nav').classList.toggle('stuck', idx > 0);
  $$('#links a[href^="#"]').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + ids[idx]));
  $$('#dots button').forEach((b, i) => b.classList.toggle('on', i === idx));
  history.replaceState(null, '', '#' + ids[idx]);
}
function settleLater(sec) {
  clearTimeout(settleT);
  settleT = setTimeout(() => sec.querySelectorAll('.reveal,.pic').forEach(el => el.classList.add('settled')), 3000);
}
function setStates() {
  secs.forEach((s, j) => {
    s.classList.toggle('before', j < idx);
    s.classList.toggle('after', j > idx);
    s.classList.toggle('active', j === idx);
  });
}

function goTo(i) {
  if (locked || i === idx || i < 0 || i >= secs.length) return;
  locked = true;
  const old = idx, up = i < old;
  secs[old].querySelectorAll('.settled').forEach(el => el.classList.remove('settled'));
  idx = i;
  secs.forEach((s, j) => { if (j !== old && j !== i) s.classList.add('nt'); }); // oraliq sectionlar "uchib" o'tmasin
  secs[i].scrollTop = up ? secs[i].scrollHeight : 0;
  setStates();
  void secs[0].offsetWidth;
  requestAnimationFrame(() => secs.forEach(s => s.classList.remove('nt')));
  if (ids[i] === 'popular') renderProducts();
  settleLater(secs[i]); setUI();
  setTimeout(() => locked = false, 1000);
}

// Section ichida kontent baland bo'lsa — chetiga yetguncha ichki scroll
function canScroll(sec, dir) {
  if (sec.scrollHeight <= sec.clientHeight + 4) return false;
  return dir > 0 ? sec.scrollTop + sec.clientHeight < sec.scrollHeight - 4 : sec.scrollTop > 4;
}
const overlayOpen = () => $('#drawer.on,.modal.on');

// Mouse wheel + trackpad
addEventListener('wheel', e => {
  if (overlayOpen() || e.target.closest?.('#drawer,.modal')) return;
  const now = performance.now(), gap = now - lastWheel; lastWheel = now;
  const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY, dir = Math.sign(dy);
  if (!dir) return;
  if (canScroll(secs[idx], dir)) return;       // ichki scroll
  e.preventDefault();
  if (locked || gap < 70 || Math.abs(dy) < 6) return; // inertsiya / animatsiya paytida e'tiborsiz
  goTo(idx + dir);
}, { passive: false });

// Klaviatura
addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA/.test(e.target.tagName) || overlayOpen()) return;
  const dir = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key];
  if (!dir) return;
  e.preventDefault();
  if (canScroll(secs[idx], dir)) return secs[idx].scrollBy({ top: dir * 90, behavior: 'smooth' });
  goTo(idx + dir);
});

// Touch swipe
let ty = 0, atTop = true, atBot = true;
$('#scroller').addEventListener('touchstart', e => {
  ty = e.touches[0].clientY; const s = secs[idx];
  atTop = s.scrollTop <= 4; atBot = s.scrollTop + s.clientHeight >= s.scrollHeight - 4;
}, { passive: true });
$('#scroller').addEventListener('touchend', e => {
  const dy = ty - e.changedTouches[0].clientY;
  if (Math.abs(dy) < 55 || overlayOpen()) return;
  if (dy > 0 && atBot) goTo(idx + 1);
  if (dy < 0 && atTop) goTo(idx - 1);
}, { passive: true });

// Sichqoncha parallaksi (hero)
addEventListener('mousemove', e => {
  if (idx !== 0) return;
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  $$('.blob').forEach((b, i) => b.style.translate = `${x * (i ? -60 : 60)}px ${y * (i ? -60 : 60)}px`);
  $$('.float').forEach((f, i) => f.style.translate = `${x * (20 + i * 8)}px ${y * (20 + i * 8)}px`);
});

// Boshlang'ich holat (URL hash bo'yicha)
idx = Math.max(0, ids.indexOf(location.hash.slice(1)));
secs.forEach(s => s.classList.add('nt'));
secs.forEach((s, j) => { s.classList.toggle('before', j < idx); s.classList.toggle('after', j > idx); });
requestAnimationFrame(() => requestAnimationFrame(() => secs.forEach(s => s.classList.remove('nt'))));
setTimeout(() => { secs[idx].classList.add('active'); settleLater(secs[idx]); setUI(); }, 900);

renderProducts(); renderCart(); renderUser();