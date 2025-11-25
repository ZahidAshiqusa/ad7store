export default async function handler(req, res){
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const username = process.env.GITHUB_USER;
  const filePath = 'products.json';

  try{
    // fetch current products
    const getRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });

    let sha = null;
    let products = [];

    if(getRes.status === 200){
      const file = await getRes.json();
      sha = file.sha;
      products = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    }

    if(req.method === 'GET'){
      return res.status(200).json(products);
    }

    if(req.method === 'POST'){
      const { name, price, image } = req.body;
      if(!name || !price || !image) return res.status(400).json({ error: 'Missing fields' });
      products.push({ id: Date.now(), name, price, image });
    }

    if(req.method === 'PUT'){
      const { id, name, price, image } = req.body;
      const idx = products.findIndex(p => p.id == id);
      if(idx === -1) return res.status(404).json({ error: 'Not found' });
      products[idx] = { id, name, price, image };
    }

    if(req.method === 'DELETE'){
      const { id } = req.body;
      products = products.filter(p => p.id != id);
    }

    // write back
    const newContent = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');
    const putRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Update products', content: newContent, sha })
    });

    if(!putRes.ok){
      const err = await putRes.text();
      console.error('GitHub PUT failed', putRes.status, err);
      return res.status(500).json({ error: 'GitHub write failed', details: err });
    }

    return res.status(200).json({ success: true });
  }catch(e){
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
