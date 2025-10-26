// zephyra.js
import makeWASocket, { useSingleFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import fs from 'fs';
import pino from 'pino';

// Auth state
const { state, saveState } = useSingleFileAuthState('./zephyra_auth.json');

// Buat socket
const client = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
});

// Simpan state ketika berubah
client.ev.on('creds.update', saveState);

// Event message
client.ev.on('messages.upsert', async (m) => {
    try {
        const msg = m.messages[0];
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!text) return;

        // Contoh command sederhana
        if (text.toLowerCase() === '!ping') {
            await client.sendMessage(sender, { text: 'Pong! Zephyra-Ai aktif 🚀' });
        }
    } catch (err) {
        console.error(err);
    }
});

// Handle disconnect
client.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
        if (shouldReconnect) {
            startZephyra(); // restart
        }
    } else if (connection === 'open') {
        console.log('Zephyra-Ai connected ✅');
    }
});

async function startZephyra() {
    // bisa taruh logic reconnect di sini
}

console.log('Zephyra-Ai sedang dijalankan...');