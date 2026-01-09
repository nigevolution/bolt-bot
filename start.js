import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

async function start() {
  console.log("INICIANDO BOT...")

  const { state, saveCreds } = await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      console.log("QR RECEBIDO:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "close") {
      if ((lastDisconnect?.error?.output?.statusCode) !== DisconnectReason.loggedOut) {
        console.log("Reconectando...")
        start()
      } else {
        console.log("Deslogado do WhatsApp.")
      }
    }

    if (connection === "open") {
      console.log("BOT CONECTADO COM SUCESSO 🚀")
    }
  })
}

start()
