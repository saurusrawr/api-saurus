import { createCanvas, loadImage, registerFont } from 'canvas';

// Daftarkan font
registerFont('./assets/Roboto-Medium.ttf', { family: 'Roboto' });

export default async function handler(req, res) {
  const { nama = 'Saurus', caption = 'Halo Dunia!', profilUrl = '' } = req.query;

  try {
    // Canvas ukuran 720x1280
    const width = 720;
    const height = 1280;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load background
    const bgUrl = 'https://files.catbox.moe/3gwr1l.jpg';
    const bg = await loadImage(bgUrl);
    ctx.drawImage(bg, 0, 0, width, height);

    // Load profil
    let pp;
    if (profilUrl) {
      try {
        const img = await loadImage(profilUrl);
        pp = img;
      } catch {
        pp = await loadImage('https://telegra.ph/file/a059a6a734ed202c879d3.jpg');
      }
    } else {
      pp = await loadImage('https://telegra.ph/file/a059a6a734ed202c879d3.jpg');
    }

    // Profil bulat
    const ppX = 40;
    const ppY = 250;
    const ppSize = 70;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(pp, ppX, ppY, ppSize, ppSize);
    ctx.restore();

    // Nama user
    ctx.font = '28px Roboto';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(nama, ppX + ppSize + 15, ppY + ppSize / 2);

    // Caption bawah
    ctx.font = 'bold 30px Roboto';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const captionX = width / 2;
    const captionY = height - 650;
    const maxWidth = width - 100;
    const lineHeight = 42;

    wrapTextCenter(ctx, caption, captionX, captionY, maxWidth, lineHeight);

    // Output PNG
    const buffer = canvas.toBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(buffer);
  } catch (e) {
    console.error('FAKESTORY ERROR:', e);
    res.status(500).json({ error: 'Gagal generate gambar', log: e.message });
  }
}

// Fungsi wrap text tengah
function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && line !== '') {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
