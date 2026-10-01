const STORAGE_KEY = 'communityStockAppV1';
const seed = {
  products: [
    { id: 'p1', code: 'P001', name: 'น้ำดื่ม 600 มล.', price: 7, stock: 24, unit: 'ขวด' },
    { id: 'p2', code: 'P002', name: 'บะหมี่กึ่งสำเร็จรูป', price: 7, stock: 48, unit: 'ซอง' },
    { id: 'p3', code: 'P003', name: 'ขนมปังแซนด์วิช', price: 25, stock: 6, unit: 'ถุง' },
    { id: 'p4', code: 'P004', name: 'นมกล่องรสจืด', price: 13, stock: 0, unit: 'กล่อง' },
    { id: 'p5', code: 'P005', name: 'กาแฟกระป๋อง', price: 15, stock: 18, unit: 'กระป๋อง' },
    { id: 'p6', code: 'P006', name: 'ไข่ไก่ เบอร์ 2', price: 5, stock: 30, unit: 'ฟอง' }
  ],
  sales: []
};
let state = loadState();
let cart = {};
let editingProductId = null;

const $ = (selector) => document.querySelector(selector);
const money = (value) => `฿${Number(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
function loadState() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(seed); } catch { return structuredClone(seed); } }
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function todayKey() { return new Date().toISOString().slice(0, 10); }
function todaySales() { return state.sales.filter((sale) => sale.date === todayKey()); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400); }

function renderSummary() {
  const sales = todaySales();
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);
  $('#productCount').textContent = state.products.length;
  $('#lowStockCount').textContent = state.products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  $('#todaySales').textContent = money(total).replace('.00', '');
  $('#todayBills').textContent = `${sales.length} บิล`;
  $('#reportTotal').textContent = money(total);
  $('#todayLabel').textContent = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderSellProducts() {
  const query = ($('#sellSearch').value || '').trim().toLowerCase();
  const products = state.products.filter((p) => `${p.name} ${p.code}`.toLowerCase().includes(query));
  $('#sellProducts').innerHTML = products.length ? products.map((p) => {
    const stockClass = p.stock === 0 ? 'out' : p.stock <= 10 ? 'low' : '';
    return `<button class="product-card" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
      <span class="product-code">${escapeHtml(p.code)}</span><h3>${escapeHtml(p.name)}</h3>
      <div class="product-price">${money(p.price).replace('.00', '')}</div>
      <div class="product-stock ${stockClass}">${p.stock === 0 ? 'หมดแล้ว' : `เหลือ ${p.stock} ${escapeHtml(p.unit)}`}</div>
    </button>`;
  }).join('') : '<p class="empty">ไม่พบสินค้าที่ค้นหา</p>';
}

function cartTotal() { return Object.values(cart).reduce((sum, item) => sum + item.product.price * item.quantity, 0); }
function renderCart() {
  const items = Object.values(cart);
  $('#cartCount').textContent = `${items.reduce((sum, item) => sum + item.quantity, 0)} รายการ`;
  $('#cartItems').innerHTML = items.length ? items.map((item) => `<div class="cart-line">
    <div class="cart-line-name">${escapeHtml(item.product.name)}<small>${money(item.product.price)} × ${item.quantity}</small></div>
    <div class="quantity"><button data-cart-minus="${item.product.id}" aria-label="ลดจำนวน">−</button><strong>${item.quantity}</strong><button data-cart-plus="${item.product.id}" aria-label="เพิ่มจำนวน">+</button></div>
  </div>`).join('') : '<p class="empty">ยังไม่มีสินค้าในบิล</p>';
  $('#cartTotal').textContent = money(cartTotal());
}

function renderStock() {
  const query = ($('#stockSearch').value || '').trim().toLowerCase();
  const products = state.products.filter((p) => `${p.name} ${p.code}`.toLowerCase().includes(query));
  $('#stockList').innerHTML = products.length ? products.map((p) => `<div class="stock-row">
    <div class="stock-main"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.code)} · ${money(p.price)} / ${escapeHtml(p.unit)}</small></div>
    <div class="stock-actions"><button data-stock="${p.id}" data-delta="-1">−</button><strong>${p.stock}</strong><button data-stock="${p.id}" data-delta="1">+</button><button data-edit-product="${p.id}" title="แก้ไข">แก้</button><button class="delete-button" data-delete-product="${p.id}" title="ลบ">ลบ</button></div>
  </div>`).join('') : '<p class="empty">ไม่พบสินค้า</p>';
}

function renderSales() {
  const sales = todaySales();
  $('#salesList').innerHTML = sales.length ? sales.slice().reverse().map((sale) => `<div class="sale-row"><div class="sale-main"><strong>บิล #${escapeHtml(sale.invoice)}</strong><small>${new Date(sale.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} · ${sale.items} รายการ</small></div><strong>${money(sale.total)}</strong></div>`).join('') : '<p class="empty">ยังไม่มีรายการขายวันนี้</p>';
}
function renderAll() { renderSummary(); renderSellProducts(); renderCart(); renderStock(); renderSales(); }

function addToCart(id) { const product = state.products.find((p) => p.id === id); if (!product || product.stock <= 0) return showToast('สินค้านี้หมดแล้ว'); if (!cart[id]) cart[id] = { product, quantity: 0 }; if (cart[id].quantity >= product.stock) return showToast('จำนวนเกินสต็อกที่มี'); cart[id].quantity += 1; renderCart(); }
function changeCart(id, delta) { if (!cart[id]) return; const next = cart[id].quantity + delta; if (next <= 0) delete cart[id]; else if (next <= cart[id].product.stock) cart[id].quantity = next; else return showToast('จำนวนเกินสต็อกที่มี'); renderCart(); }

function checkout() {
  const items = Object.values(cart); if (!items.length) return showToast('กรุณาเลือกสินค้าก่อน');
  items.forEach((item) => { const product = state.products.find((p) => p.id === item.product.id); product.stock -= item.quantity; });
  state.sales.push({ invoice: String(state.sales.length + 1).padStart(4, '0'), date: todayKey(), createdAt: new Date().toISOString(), items: items.reduce((sum, item) => sum + item.quantity, 0), total: cartTotal() });
  cart = {}; saveState(); renderAll(); showToast('บันทึกการขายเรียบร้อย');
}

$('#sellSearch').addEventListener('input', renderSellProducts);
$('#stockSearch').addEventListener('input', renderStock);
$('#checkoutBtn').addEventListener('click', checkout);
$('#clearCartBtn').addEventListener('click', () => { cart = {}; renderCart(); });
$('#sellProducts').addEventListener('click', (event) => { const button = event.target.closest('[data-add]'); if (button) addToCart(button.dataset.add); });
$('#cartItems').addEventListener('click', (event) => { const plus = event.target.closest('[data-cart-plus]'); const minus = event.target.closest('[data-cart-minus]'); if (plus) changeCart(plus.dataset.cartPlus, 1); if (minus) changeCart(minus.dataset.cartMinus, -1); });
$('#stockList').addEventListener('click', (event) => {
  const stockButton = event.target.closest('[data-stock]');
  const editButton = event.target.closest('[data-edit-product]');
  const deleteButton = event.target.closest('[data-delete-product]');
  if (stockButton) {
    const product = state.products.find((p) => p.id === stockButton.dataset.stock);
    product.stock = Math.max(0, product.stock + Number(stockButton.dataset.delta)); saveState(); renderAll(); return;
  }
  if (editButton) { openEditProduct(editButton.dataset.editProduct); return; }
  if (deleteButton) { deleteProduct(deleteButton.dataset.deleteProduct); }
});

document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active')); document.querySelectorAll('.view').forEach((view) => view.classList.remove('active-view')); tab.classList.add('active'); $(`#${tab.dataset.view}`).classList.add('active-view'); }));

function openAddProduct() {
  editingProductId = null;
  $('#productDialogEyebrow').textContent = 'สินค้าใหม่'; $('#productDialogTitle').textContent = 'เพิ่มสินค้า';
  $('#productForm').reset(); $('#productForm').querySelector('[name="unit"]').value = 'ชิ้น'; $('#productDialog').showModal();
}
function openEditProduct(id) {
  const product = state.products.find((p) => p.id === id); if (!product) return;
  editingProductId = id;
  $('#productDialogEyebrow').textContent = 'แก้ไขข้อมูล'; $('#productDialogTitle').textContent = 'แก้ไขสินค้า';
  for (const [key, value] of Object.entries({ name: product.name, code: product.code, unit: product.unit, price: product.price, stock: product.stock })) $('#productForm').querySelector(`[name="${key}"]`).value = value;
  $('#productDialog').showModal();
}
function deleteProduct(id) {
  const product = state.products.find((p) => p.id === id); if (!product) return;
  if (!confirm(`ต้องการลบสินค้า “${product.name}” ใช่หรือไม่?`)) return;
  delete cart[id]; state.products = state.products.filter((p) => p.id !== id); saveState(); renderAll(); showToast('ลบสินค้าเรียบร้อย');
}
$('#addProductBtn').addEventListener('click', openAddProduct);
$('#productForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get('name')).trim(); const code = String(form.get('code')).trim() || `P${String(state.products.length + 1).padStart(3, '0')}`; const duplicate = state.products.some((p) => p.code.toLowerCase() === code.toLowerCase() && p.id !== editingProductId); if (duplicate) return showToast('รหัสสินค้านี้มีอยู่แล้ว');
  const data = { name, code, unit: String(form.get('unit')).trim(), price: Number(form.get('price')), stock: Number(form.get('stock')) };
  if (editingProductId) Object.assign(state.products.find((p) => p.id === editingProductId), data); else state.products.push({ id: `p${Date.now()}`, ...data });
  saveState(); event.currentTarget.reset(); editingProductId = null; $('#productDialog').close(); renderAll(); showToast('บันทึกข้อมูลสินค้าเรียบร้อย');
});
$('#resetDataBtn').addEventListener('click', () => { if (confirm('เริ่มข้อมูลตัวอย่างใหม่? ข้อมูลขายและสินค้าที่บันทึกไว้ในเครื่องนี้จะถูกล้าง')) { state = structuredClone(seed); cart = {}; saveState(); renderAll(); showToast('เริ่มข้อมูลตัวอย่างแล้ว'); } });
renderAll();
