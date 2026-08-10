const config = window.STORE_CONFIG;
const products = window.STORE_PRODUCTS;
let cart = JSON.parse(localStorage.getItem('dtai-cart') || '[]');
const money = value => new Intl.NumberFormat('vi-VN').format(value) + 'đ';
const grid = document.querySelector('#product-grid');
const drawer = document.querySelector('#cart-drawer');
const backdrop = document.querySelector('#drawer-backdrop');

function renderProducts(filter = 'all') {
  grid.innerHTML = products.filter(p => filter === 'all' || p.type === filter).map(p => `
    <article class="product-card" data-type="${p.type}">
      <div class="product-art ${p.tone}"><span>${p.icon}</span><small>DƯƠNG TUYẾT AI</small></div>
      <div class="product-body"><div class="product-meta"><span>${p.label}</span><i>${p.tag}</i></div><h3>${p.title}</h3><p>${p.desc}</p>
      <div class="product-buy"><strong>${money(p.price)}</strong><button ${p.comingSoon ? 'disabled' : ''} data-add="${p.id}">${p.comingSoon ? 'Sắp mở bán' : 'Thêm vào giỏ'} <span>＋</span></button></div></div>
    </article>`).join('');
}
function saveCart() { localStorage.setItem('dtai-cart', JSON.stringify(cart)); updateCart(); }
function updateCart() {
  const items = cart.map(id => products.find(p => p.id === id)).filter(Boolean);
  document.querySelector('#cart-count').textContent = items.length;
  document.querySelector('#cart-items').innerHTML = items.map(p => `<div class="cart-item"><div class="cart-thumb ${p.tone}">${p.icon}</div><div><small>${p.label}</small><b>${p.title}</b><strong>${money(p.price)}</strong></div><button data-remove="${p.id}" aria-label="Xóa ${p.title}">×</button></div>`).join('');
  document.querySelector('#cart-total').textContent = money(items.reduce((sum, p) => sum + p.price, 0));
  document.querySelector('#cart-empty').hidden = items.length > 0;
  document.querySelector('#cart-summary').hidden = items.length === 0;
}
function openCart() { drawer.classList.add('open'); backdrop.classList.add('show'); drawer.setAttribute('aria-hidden','false'); }
function closeCart() { drawer.classList.remove('open'); backdrop.classList.remove('show'); drawer.setAttribute('aria-hidden','true'); }
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200); }

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]'); const remove = e.target.closest('[data-remove]');
  if (add) { if (!cart.includes(add.dataset.add)) cart.push(add.dataset.add); saveCart(); toast('Đã thêm sản phẩm vào giỏ'); }
  if (remove) { cart = cart.filter(id => id !== remove.dataset.remove); saveCart(); }
});
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(x => x.classList.remove('active')); btn.classList.add('active'); renderProducts(btn.dataset.filter); }));
document.querySelector('#open-cart').onclick = openCart; document.querySelector('#close-cart').onclick = closeCart; backdrop.onclick = closeCart; document.querySelector('#continue-shopping').onclick = closeCart;
const dialog = document.querySelector('#checkout-dialog');
document.querySelector('#checkout').onclick = () => { closeCart(); dialog.showModal(); };
document.querySelector('#close-checkout').onclick = () => dialog.close();

const zaloUrl = config.zaloPhone ? `https://zalo.me/${config.zaloPhone.replace(/\D/g,'')}` : '#';
const emailUrl = config.email ? `mailto:${config.email}` : '#';
[['#footer-zalo',zaloUrl],['#zalo-confirm',zaloUrl],['#footer-email',emailUrl],['#email-support',emailUrl]].forEach(([sel,url]) => document.querySelector(sel).href = url);
document.querySelector('#bank-name').textContent = config.bankName || 'Cần điền trong config.js';
document.querySelector('#bank-account').textContent = config.bankAccount || 'Cần điền trong config.js';
document.querySelector('#bank-owner').textContent = config.bankOwner;
document.querySelector('#transfer-note').textContent = 'Họ và tên + SĐT';
renderProducts(); updateCart();
