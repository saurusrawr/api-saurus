import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { username = "Saurus", caption = "Halo dunia!", profilUrl } = req.query;

  if (!profilUrl) {
    return res.status(400).json({ status: false, message: "profilUrl wajib diisi" });
  }

  try {
    // Canvas
    const width = 720;
    const height = 1280;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load background
    const bg = await loadImage('https://files.catbox.moe/3gwr1l.jpg');
    ctx.drawImage(bg, 0, 0, width, height);

    // Load profil
    const profileImg = await loadImage(profilUrl);
    const ppSize = 70;
    const ppX = 40;
    const ppY = 250;

    // Buat lingkaran profil
    ctx.save();
    ctx.beginPath();
    ctx.arc(ppX + ppSize/2, ppY + ppSize/2, ppSize/2, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profileImg, ppX, ppY, ppSize, ppSize);
    ctx.restore();

    // Username
    ctx.font = '28px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(username, ppX + ppSize + 15, ppY + ppSize/2);

    // Caption
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const captionX = width / 2;
    const captionY = height - 650;
    const maxWidth = width - 100;
    const lineHeight = 42;

    function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
      let line = '';
      for (let i = 0; i < text.length; i++) {
        let testLine = line + text[i];
        let testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && line !== '') {
          ctx.fillText(line, x, y);
          line = text[i];
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      if (line) ctx.fillText(line, x, y);
    }

    wrapTextCenter(ctx, caption, captionX, captionY, maxWidth, lineHeight);

    // Output
    const buffer = canvas.toBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(buffer);

  } catch (e) {
    console.error(e);
    res.status(500).json({ status: false, message: "Gagal generate gambar", error: e.message });
  }
  }
