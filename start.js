import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
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

  let pairingRequested = false

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update

    if (connection === "open") {
      console.log("BOT CONECTADO")

      if (!state.creds.registered && !pairingRequested) {
        pairingRequested = true

        setTimeout(async () => {
          const code = await sock.requestPairingCode(phone)
          console.log("=================================")
          console.log("PAIRING CODE:", code)
          console.log("=================================")
        }, 3000)
      }
    }
  })
}

start()
