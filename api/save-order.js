export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const username = process.env.GITHUB_USER;
  const filePath = 'orders.json';

  const body = req.body;

  if(!body || !body.itemName || !body.customer) {
    return res.status(400).json({ error: 'Missing payload' });
  }

  // fetch existing orders file from repo
  try{
    const getRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });

    let sha = null;
    let orders = [];

    if(getRes.status === 200){
      const file = await getRes.json();
      sha = file.sha;
      orders = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    }

    orders.push(body);

    const newContent = Buffer.from(JSON.stringify(orders, null, 2)).toString('base64');

    // PUT file
    const putRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Add order from AD7STORE',
        content: newContent,
        sha
      })
    });

    if(!putRes.ok){
      const err = await putRes.text();
      console.error('GitHub PUT failed', putRes.status, err);
      return res.status(500).json({ error: 'GitHub write failed', details: err });
    }

    return res.status(200).json({ success: true, message: 'Saved to GitHub' });
  }catch(e){
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
