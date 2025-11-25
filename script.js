let selectedItem = "";

async function loadProducts(){
  const itemsBox = document.getElementById('items');
  itemsBox.innerHTML = '<p class="muted">Loading products…</p>';
  try{
    const res = await fetch('/api/products');
    if(!res.ok) throw new Error('Products fetch failed ' + res.status);
    const products = await res.json();
    if(!products || !products.length){ itemsBox.innerHTML = '<p class="muted">No products found.</p>'; return; }
    itemsBox.innerHTML = '';
    products.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">Rs ${p.price}</p>
        <button class="btn" onclick="buy('${escapeHtml(p.name)}')">Buy Now</button>
      `;
      itemsBox.appendChild(card);
    });
  }catch(e){
    itemsBox.innerHTML = '<p class="muted">Unable to load products. See console.</p>';
    console.error(e);
  }
}

function buy(item){
  selectedItem = item;
  document.getElementById('popupTitle').textContent = 'Order — ' + item;
  document.getElementById('popup').style.display = 'flex';
}

function closePopup(){ document.getElementById('popup').style.display = 'none'; }

async function orderNow(){
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();

  if(!name || !phone || !address){ alert('Please fill name, phone, address'); return; }

  const payload = { itemName: selectedItem, customer: { name, phone, email, address }, date: new Date().toISOString() };

  // Save to server (GitHub via Vercel). If unavailable, caller serverside returns appropriate message.
  try{
    const res = await fetch('/api/save-order', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('Order API error ' + res.status);
    const json = await res.json();
    alert('Order placed! ' + (json.message||''));
  }catch(e){
    console.error(e);
    alert('Order saved locally (server unavailable). It will not be persisted remotely.');
    // local fallback: save to localStorage
    const existing = JSON.parse(localStorage.getItem('ad7_orders')||'[]');
    existing.unshift(payload);
    localStorage.setItem('ad7_orders', JSON.stringify(existing));
  } finally {
    closePopup();
  }
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

window.addEventListener('load', loadProducts);
