export default async function handler(req, res){
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const username = process.env.GITHUB_USER;
  const filePath = 'orders.json';

  try{
    const getRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
      headers: { Authorization: `token ${token}` }
    });

    if(getRes.status !== 200){
      return res.status(200).json([]);
    }

    const file = await getRes.json();
    const orders = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    return res.status(200).json(orders);
  }catch(e){
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
