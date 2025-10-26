import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  const { name = "Saurus", message = "Halo Dunia!", time = "23.00" } = req.query;

  // Ukuran canvas
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");

  // Latar belakang WA
  ctx.fillStyle = "#ECE5DD";
  ctx.fillRect(0, 0, 800, 400);

  // Bubble chat
  ctx.fillStyle = "#DCF8C6";
  ctx.roundRect(400, 150, 370, 80, 10);
  ctx.fill();

  // Nama pengirim
  ctx.fillStyle = "#075E54";
  ctx.font = "bold 18px Arial";
  ctx.fillText(name, 420, 170);

  // Pesan
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(message, 420, 200);

  // Waktu
  ctx.fillStyle = "#555";
  ctx.font = "12px Arial";
  ctx.fillText(time, 730, 220);

  // Output ke browser
  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer());
}