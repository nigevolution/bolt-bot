import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys";

const start = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("🟢 BOT CONECTADO COM SUCESSO!");
    }

    if (connection === "close") {
      console.log("🔴 DESCONECTADO. REINICIANDO...");
      start();
    }
  });

  // 🔥 FORÇA O PAREAMENTO
  setTimeout(async () => {
    const phone = process.env.PHONE;
    if (!phone) return console.log("❌ Defina a variável PHONE no Railway.");

    const code = await sock.requestPairingCode(phone);
    console.log("\n================================");
    console.log("PAIRING CODE:", code);
    console.log("================================\n");
  }, 3000);
};

start();
