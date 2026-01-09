import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys";

const start = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    browser: ["Bolt-Bot", "Chrome", "110"],
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
        console.log("Reconectando...");
        start();
      }
    }

    if (connection === "open") {
      console.log("BOT ONLINE COM SUCESSO");
    }
  });

  if (!sock.authState.creds.registered) {
    const phone = process.env.PHONE;
    console.log("Gerando código para:", phone);

    setTimeout(async () => {
      const code = await sock.requestPairingCode(phone);
      console.log("══════════════════════════");
      console.log("CÓDIGO WHATSAPP:", code);
      console.log("══════════════════════════");
    }, 3000);
  }
};

start();
