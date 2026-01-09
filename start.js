import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      if ((lastDisconnect?.error?.output?.statusCode) !== DisconnectReason.loggedOut) {
        start()
      } else {
        console.log("Deslogado do WhatsApp.")
      }
    }
    if (connection === "open") {
      console.log("BOT ONLINE 🚀")
    }
  })
}

start()
