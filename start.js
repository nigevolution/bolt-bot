import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import Pino from "pino"

const phone = process.env.PHONE

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    logger: Pino({ level: "silent" }),
    auth: state,
    browser: ["Bolt-Bot", "Chrome", "1.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("BOT CONECTADO COM SUCESSO")
    }
  })

  if (!state.creds.registered) {
    console.log("Gerando código de pareamento para:", phone)

    const code = await sock.requestPairingCode(phone)
    console.log("=================================")
    console.log("PAIRING CODE:", code)
    console.log("=================================")
  }
}

start()
