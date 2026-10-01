const STORAGE_KEY = 'communityStockAppV1';
const seed = {
  products: [
    { id: 'p1', code: 'P001', name: 'น้ำดื่ม 600 มล.', price: 7, stock: 48, unit: 'ขวด' },
    { id: 'p2', code: 'P002', name: 'น้ำดื่ม 1.5 ลิตร', price: 14, stock: 24, unit: 'ขวด' },
    { id: 'p3', code: 'P003', name: 'น้ำอัดลม 325 มล.', price: 15, stock: 30, unit: 'กระป๋อง' },
    { id: 'p4', code: 'P004', name: 'กาแฟกระป๋อง', price: 15, stock: 24, unit: 'กระป๋อง' },
    { id: 'p5', code: 'P005', name: 'นมกล่องรสจืด 225 มล.', price: 13, stock: 18, unit: 'กล่อง' },
    { id: 'p6', code: 'P006', name: 'เครื่องดื่มเกลือแร่ 500 มล.', price: 15, stock: 12, unit: 'ขวด' },
    { id: 'p7', code: 'P007', name: 'บะหมี่กึ่งสำเร็จรูป รสหมูสับ', price: 7, stock: 60, unit: 'ซอง' },
    { id: 'p8', code: 'P008', name: 'ข้าวหอมมะลิ 5 กก.', price: 185, stock: 8, unit: 'ถุง' },
    { id: 'p9', code: 'P009', name: 'น้ำมันพืช 1 ลิตร', price: 55, stock: 10, unit: 'ขวด' },
    { id: 'p10', code: 'P010', name: 'น้ำปลา 700 มล.', price: 35, stock: 14, unit: 'ขวด' },
    { id: 'p11', code: 'P011', name: 'ซีอิ๊วขาว 700 มล.', price: 38, stock: 12, unit: 'ขวด' },
    { id: 'p12', code: 'P012', name: 'น้ำตาลทราย 1 กก.', price: 28, stock: 20, unit: 'ถุง' },
    { id: 'p13', code: 'P013', name: 'เกลือป่น 500 กรัม', price: 10, stock: 15, unit: 'ถุง' },
    { id: 'p14', code: 'P014', name: 'ไข่ไก่ เบอร์ 2', price: 5, stock: 60, unit: 'ฟอง' },
    { id: 'p15', code: 'P015', name: 'ปลากระป๋อง 155 กรัม', price: 22, stock: 24, unit: 'กระป๋อง' },
    { id: 'p16', code: 'P016', name: 'ขนมปังแซนด์วิช', price: 35, stock: 7, unit: 'ถุง' },
    { id: 'p17', code: 'P017', name: 'ขนมขบเคี้ยวซองเล็ก', price: 10, stock: 36, unit: 'ซอง' },
    { id: 'p18', code: 'P018', name: 'บิสกิตซอง', price: 12, stock: 25, unit: 'ซอง' },
    { id: 'p19', code: 'P019', name: 'ลูกอมมินต์', price: 10, stock: 20, unit: 'ซอง' },
    { id: 'p20', code: 'P020', name: 'ไส้กรอกแพ็กเล็ก', price: 35, stock: 9, unit: 'แพ็ก' },
    { id: 'p21', code: 'P021', name: 'สบู่ก้อน', price: 15, stock: 18, unit: 'ก้อน' },
    { id: 'p22', code: 'P022', name: 'ยาสีฟัน 90 กรัม', price: 42, stock: 12, unit: 'หลอด' },
    { id: 'p23', code: 'P023', name: 'แปรงสีฟัน', price: 25, stock: 15, unit: 'อัน' },
    { id: 'p24', code: 'P024', name: 'แชมพูซอง', price: 8, stock: 30, unit: 'ซอง' },
    { id: 'p25', code: 'P025', name: 'ผงซักฟอก 800 กรัม', price: 45, stock: 10, unit: 'ถุง' },
    { id: 'p26', code: 'P026', name: 'น้ำยาล้างจาน 500 มล.', price: 32, stock: 14, unit: 'ขวด' },
    { id: 'p27', code: 'P027', name: 'กระดาษทิชชูม้วน', price: 12, stock: 24, unit: 'ม้วน' },
    { id: 'p28', code: 'P028', name: 'ถุงขยะดำ ขนาดกลาง', price: 35, stock: 8, unit: 'แพ็ก' },
    { id: 'p29', code: 'P029', name: 'ถ่านไฟฉาย AA แพ็ก 2 ก้อน', price: 35, stock: 10, unit: 'แพ็ก' },
    { id: 'p30', code: 'P030', name: 'ถุงพลาสติกหูหิ้ว', price: 5, stock: 50, unit: 'แพ็ก' }
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
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  $('#cartCount').textContent = `${itemCount} รายการ`;
  $('#cartItems').innerHTML = items.length ? items.map((item) => `<div class="cart-line">
    <div class="cart-line-name">${escapeHtml(item.product.name)}<small>${money(item.product.price)} × ${item.quantity}</small></div>
    <div class="quantity"><button data-cart-minus="${item.product.id}" aria-label="ลดจำนวน">−</button><strong>${item.quantity}</strong><button data-cart-plus="${item.product.id}" aria-label="เพิ่มจำนวน">+</button></div>
  </div>`).join('') : '<p class="empty">ยังไม่มีสินค้าในบิล</p>';
  $('#cartTotal').textContent = money(cartTotal());
  $('#mobileCartSummary').textContent = `${itemCount} รายการ · ${money(cartTotal())}`;
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
  $('#salesList').innerHTML = sales.length ? sales.slice().reverse().map((sale) => `<details class="sale-detail"><summary><div class="sale-row"><div class="sale-main"><strong>บิล #${escapeHtml(sale.invoice)}</strong><small>${new Date(sale.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} · ${sale.items} รายการ</small></div><strong>${money(sale.total)}</strong><span class="sale-chevron">⌄</span></div></summary><div class="sale-lines">${sale.details?.length ? sale.details.map((item) => `<div class="sale-line"><span>${escapeHtml(item.name)}<small>${item.quantity} ${escapeHtml(item.unit)} × ${money(item.price)}</small></span><strong>${money(item.quantity * item.price)}</strong></div>`).join('') : '<p class="empty">บิลนี้เป็นรายการเก่าที่ไม่มีรายละเอียดสินค้า</p>'}<div class="sale-detail-total"><span>รวมบิล</span><strong>${money(sale.total)}</strong></div></div></details>`).join('') : '<p class="empty">ยังไม่มีรายการขายวันนี้</p>';
}
function renderAll() { renderSummary(); renderSellProducts(); renderCart(); renderStock(); renderSales(); }

function addToCart(id) { const product = state.products.find((p) => p.id === id); if (!product || product.stock <= 0) return showToast('สินค้านี้หมดแล้ว'); if (!cart[id]) cart[id] = { product, quantity: 0 }; if (cart[id].quantity >= product.stock) return showToast('จำนวนเกินสต็อกที่มี'); cart[id].quantity += 1; renderCart(); }
function changeCart(id, delta) { if (!cart[id]) return; const next = cart[id].quantity + delta; if (next <= 0) delete cart[id]; else if (next <= cart[id].product.stock) cart[id].quantity = next; else return showToast('จำนวนเกินสต็อกที่มี'); renderCart(); }

function checkout() {
  const items = Object.values(cart); if (!items.length) return showToast('กรุณาเลือกสินค้าก่อน');
  items.forEach((item) => { const product = state.products.find((p) => p.id === item.product.id); product.stock -= item.quantity; });
  state.sales.push({ invoice: String(state.sales.length + 1).padStart(4, '0'), date: todayKey(), createdAt: new Date().toISOString(), items: items.reduce((sum, item) => sum + item.quantity, 0), total: cartTotal(), details: items.map((item) => ({ name: item.product.name, code: item.product.code, unit: item.product.unit, price: item.product.price, quantity: item.quantity })) });
  cart = {}; saveState(); renderAll(); showToast('บันทึกการขายเรียบร้อย');
}

$('#sellSearch').addEventListener('input', renderSellProducts);
$('#stockSearch').addEventListener('input', renderStock);
$('#checkoutBtn').addEventListener('click', checkout);
$('#clearCartBtn').addEventListener('click', () => { cart = {}; renderCart(); });
$('#viewCartBtn').addEventListener('click', () => { $('#sellView').classList.add('active-view'); document.querySelectorAll('.view').forEach((view) => { if (view.id !== 'sellView') view.classList.remove('active-view'); }); document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === 'sellView')); $('#cartItems').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
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
$('#loadSampleBtn').addEventListener('click', () => {
  if (!confirm('โหลดสินค้าตัวอย่าง 30 รายการใช่หรือไม่? รายการสินค้าและสต็อกเดิมจะถูกแทนที่ แต่ประวัติการขายจะยังอยู่')) return;
  state.products = structuredClone(seed.products); cart = {}; saveState(); renderAll(); showToast('โหลดสินค้าตัวอย่าง 30 รายการแล้ว');
});
$('#closeProductDialog').addEventListener('click', () => { editingProductId = null; $('#productDialog').close(); });
$('#productForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get('name')).trim(); const code = String(form.get('code')).trim() || `P${String(state.products.length + 1).padStart(3, '0')}`; const duplicate = state.products.some((p) => p.code.toLowerCase() === code.toLowerCase() && p.id !== editingProductId); if (duplicate) return showToast('รหัสสินค้านี้มีอยู่แล้ว');
  const data = { name, code, unit: String(form.get('unit')).trim(), price: Number(form.get('price')), stock: Number(form.get('stock')) };
  if (editingProductId) Object.assign(state.products.find((p) => p.id === editingProductId), data); else state.products.push({ id: `p${Date.now()}`, ...data });
  saveState(); event.currentTarget.reset(); editingProductId = null; $('#productDialog').close(); renderAll(); showToast('บันทึกข้อมูลสินค้าเรียบร้อย');
});
$('#resetDataBtn').addEventListener('click', () => {
  if (!confirm('ล้างข้อมูลทั้งหมดใช่หรือไม่? สินค้า สต็อก และประวัติการขายจะถูกลบจนหมด')) return;
  state = { products: [], sales: [] }; cart = {}; localStorage.removeItem(STORAGE_KEY); renderAll(); showToast('ล้างข้อมูลทั้งหมดแล้ว');
});
renderAll();
