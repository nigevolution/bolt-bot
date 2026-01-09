import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys";

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    browser: ["BoltBot", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  if (!sock.authState.creds.registered) {
    const phone = process.env.PHONE;
    console.log("📲 Gerando código para:", phone);

    const code = await sock.requestPairingCode(phone);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("PAIRING CODE:", code);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) start();
    }
    if (connection === "open") console.log("🤖 BOT CONECTADO COM SUCESSO");
  });
}

start();
