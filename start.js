import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

console.log("BOT INICIANDO...")

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      console.log("QR CODE:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("BOT CONECTADO COM SUCESSO 🚀")
    }

    if (connection === "close") {
      if ((lastDisconnect?.error?.output?.statusCode) !== DisconnectReason.loggedOut) {
        console.log("Reconectando...")
        start()
      } else {
        console.log("Deslogado.")
      }
    }
  })
}

start()
