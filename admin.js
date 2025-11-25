const ADMIN_PASSWORD = "ad7admin"; // change after deploy

function login(){
  const pass = document.getElementById('pass').value;
  if(pass === ADMIN_PASSWORD){
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadProducts();
  } else {
    alert('Wrong password');
  }
}

async function loadProducts(){
  const res = await fetch('/api/products');
  const products = await res.json();
  const list = document.getElementById('productList');
  list.innerHTML = '';
  if(!products || !products.length){ list.innerHTML = '<p class="muted">No products yet.</p>'; return; }
  products.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.style.marginBottom = '12px';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">Rs ${p.price}</p>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn" onclick='editProduct(${p.id})'>Edit</button>
        <button class="btn alt" onclick='deleteProduct(${p.id})'>Delete</button>
      </div>
    `;
    list.appendChild(el);
  });
}

async function addProduct(){
  const name = document.getElementById('pname').value.trim();
  const price = document.getElementById('pprice').value.trim();
  const image = document.getElementById('pimage').value.trim();
  if(!name||!price||!image){ alert('Please fill all fields'); return; }
  await fetch('/api/products', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, price, image }) });
  alert('Product added');
  document.getElementById('pname').value='';document.getElementById('pprice').value='';document.getElementById('pimage').value='';
  loadProducts();
}

async function deleteProduct(id){
  if(!confirm('Delete this product?')) return;
  await fetch('/api/products', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
  alert('Deleted');
  loadProducts();
}

async function editProduct(id){
  const name = prompt('New name?');
  const price = prompt('New price?');
  const image = prompt('New image URL?');
  if(name===null) return;
  await fetch('/api/products', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, name, price, image }) });
  alert('Updated');
  loadProducts();
}
