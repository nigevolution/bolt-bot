import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"
import readline from "readline"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: ["Ubuntu","Chrome","22.04"]
  })

  sock.ev.on("creds.update", saveCreds)

  if (!sock.authState.creds.registered) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question("DIGITE SEU NÚMERO COM DDI (ex: 5511999999999): ", async (num) => {
      const code = await sock.requestPairingCode(num)
      console.log("\n==============================")
      console.log("PAIRING CODE:", code)
      console.log("==============================\n")
      rl.close()
    })
  }

  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("\nBOT CONECTADO COM SUCESSO\n")
    }
  })
}

startBot()
