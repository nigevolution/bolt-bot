import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import fs from "fs"

console.clear()
console.log("====================================")
console.log("   TB-BASS IR • WhatsApp BOT")
console.log("====================================")
console.log("BOT INICIANDO...")
console.log("AGUARDANDO QR CODE...\n")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    browser: ["Ubuntu","Chrome","22.04"],
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error instanceof Boom) &&
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut

      console.log("Conexão encerrada. Reconectando...", shouldReconnect)

      if (shouldReconnect) startBot()
    }

    if (connection === "open") {
      console.log("\n==============================")
      console.log("   BOT CONECTADO COM SUCESSO")
      console.log("==============================\n")
    }
  })
}

startBot()
