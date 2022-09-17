"use strinct";
const {
    default: makeWASocket,
    AnyMessageContent,
    MessageType,
    delay,
    downloadMediaMessage,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    MessageRetryMap,
    useMultiFileAuthState,
} = require("@adiwajshing/baileys");
const qrcode = require("qrcode-terminal");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const { join } = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

//local package
const { commandHandler } = require("./src/commandHandler");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(
        "baileys_auth_info"
    );
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: state,
        //msgRetryCounterMap,
        logger: pino({ level: "silent" }),
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.badSession) {
                console.log(
                    `Bad Session File, Please Delete Session and Scan Again`
                );
                sock.logout();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                startBot();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                startBot();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log(
                    "Connection Replaced, Another New Session Opened, Please Close Current Session First"
                );
                sock.logout();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Scan Again And Run.`);
                sock.logout();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                startBot();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                startBot();
            }
            // else if (reason === DisconnectReason.Multidevicemismatch) { console.log("Multi device mismatch, please scan again"); sock.logout(); }
            else
                hisoka.end(`Unknown DisconnectReason: ${reason}|${connection}`);
        }
        console.log("Connected...", update);
    });

    sock.ev.process(async (events) => {
        if (events["creds.update"]) {
            await saveCreds();
        }

        if (events["messages.upsert"]) {
            const upsert = events["messages.upsert"];
            //console.log('recv messages ', JSON.stringify(upsert, undefined, 2))

            if (upsert.type === "notify") {
                try {
                    for (const msg of upsert.messages) {
                        // const body = msg.message?.extendedTextMessage?.text;
                        // console.log(body);
                        await commandHandler(msg,sock)

                        // const body = msg.message?.extendedTextMessage?.text;
                        // const group = msg.message?.conversation;
                        // const namez = msg.pushName;
                        // const didi = msg.key.remoteJid;
                        

                        // if (message.quotedMsg != null) {

                        // }
                        // const alls =
                        //     msg.message?.extendedTextMessage?.text ||
                        //     msg.message?.conversation ||
                        //     msg.message?.listResponseMessage?.title ||
                        //     msg.message?.imageMessage?.caption ||
                        //     msg.message?.videoMessage?.caption;
                        // const list = msg.message?.listResponseMessage?.title;
                        // const stsx =
                        //     msg.message?.imageMessage?.caption ||
                        //     msg.message?.videoMessage?.caption;
                        // const sendMessageWTyping = async (msg, didi) => {
                        //     await sock.presenceSubscribe(didi);
                        //     await delay(500);

                        //     await sock.sendPresenceUpdate("composing", didi);
                        //     await delay(2000);

                        //     await sock.sendPresenceUpdate("paused", didi);

                        //     await sock.sendMessage(didi, msg);
                        // };
                        // console.log(
                        //     `nomor : ${didix} nama : ${namez}`
                        // );
                        // console.log(msg.message)
                        // fs.appendFileSync(
                        //     "keyid.txt",
                        //     "" + didix + "\n",
                        //     (err) => {
                        //         if (err) {
                        //             console.log("error", err);
                        //         }
                        //         //console.log('DONE');
                        //     }
                        // );
                        // //const stsx = (msg.message?.videoMessage?.caption);
                        // if (
                        //     alls === "menu" ||
                        //     alls === "Menu" ||
                        //     alls === ".menu" ||
                        //     alls === "p" ||
                        //     alls === "P"
                        // ) {
                        //     await sock.readMessages([msg.key]);
                        //     const buttons = [
                        //         {
                        //             buttonId: "id1",
                        //             buttonText: { displayText: "about aleya" },
                        //             type: 1,
                        //         },
                        //         {
                        //             buttonId: "id2",
                        //             buttonText: { displayText: "menus" },
                        //             type: 1,
                        //         },
                        //     ];
                        //     const buttonMessage = {
                        //         image: { url: "./cantik.png" },
                        //         caption: "intro bot mu",
                        //         footerText: " ",
                        //         headerType: 4,
                        //         buttons: buttons,
                        //     };

                        //     await sendMessageWTyping(
                        //         buttonMessage,
                        //         msg.key.remoteJid
                        //     );
                        // } else if (
                        //     msg.message?.buttonsResponseMessage
                        //         ?.selectedButtonId === "id2" ||
                        //     body === "menus" ||
                        //     group === "menus"
                        // ) {
                        //     await sock.readMessages([msg.key]);
                        //     const sections = [
                        //         {
                        //             title: " ",
                        //             rows: [
                        //                 { title: "how to use klik here" },
                        //                 { title: "tle aku cinta kamu" },
                        //                 { title: "tlj arigato" },
                        //                 { title: "tli another world" },
                        //                 { title: "update anime" },
                        //                 { title: "strg" },
                        //                 { title: "rmeme" },
                        //                 { title: "nh" },
                        //                 {
                        //                     title: "gs siapa yang paling ganteng di indonesia",
                        //                 },
                        //                 { title: "ys indonesia raya" },
                        //                 { title: "strd" },
                        //                 { title: "vn" },
                        //                 { title: "spk test" },
                        //                 { title: "sts" },
                        //                 {
                        //                     title: "yt https://youtu.be/tPEE9ZwTmy0",
                        //                 },
                        //                 {
                        //                     title: "ymp3 https://youtu.be/tPEE9ZwTmy0",
                        //                 },
                        //             ],
                        //         },
                        //     ];

                        //     const listMessage = {
                        //         text: "intro bot mu",
                        //         ListType: 2,
                        //         buttonText: "MENU",
                        //         sections,
                        //     };

                        //     await sendMessageWTyping(
                        //         listMessage,
                        //         msg.key.remoteJid
                        //     );
                        // } else if (
                        //     msg.message?.buttonsResponseMessage
                        //         ?.selectedButtonId === "id1"
                        // ) {
                        //     await sock.readMessages([msg.key]);
                        //     await sendMessageWTyping(
                        //         {
                        //             text: "𝙏𝙝𝙚 𝙬𝙤𝙧𝙡𝙙 𝙞𝙨𝙣'𝙩 𝙥𝙚𝙧𝙛𝙚𝙘𝙩. 𝘽𝙪𝙩 𝙞𝙩'𝙨 𝙩𝙝𝙚𝙧𝙚 𝙛𝙤𝙧 𝙪𝙨, 𝙙𝙤𝙞𝙣𝙜 𝙩𝙝𝙚 𝙗𝙚𝙨𝙩 𝙞𝙩 𝙘𝙖𝙣. 𝙩𝙝𝙖𝙩'𝙨 𝙬𝙝𝙖𝙩 𝙢𝙖𝙠𝙚𝙨 𝙞𝙩 𝙨𝙤 𝙙𝙖𝙢𝙣 𝙗𝙚𝙖𝙪𝙩𝙞𝙛𝙪𝙡.\n ~ 𝙍𝙤𝙮 𝙈𝙪𝙨𝙩𝙖𝙣𝙜 (𝙁𝙪𝙡𝙡 𝙈𝙚𝙩𝙖𝙡 𝘼𝙡𝙘𝙝𝙚𝙢𝙞𝙨𝙩).\n\n\n 𝙎𝙤 𝙝𝙚𝙧𝙚 𝙞'𝙢 𝘼𝙡𝙚𝙮𝙖 𝙜𝙞𝙩𝙖 𝙩𝙤 𝙘𝙪𝙧𝙚 𝙮𝙤𝙪𝙧 𝙙𝙚𝙥𝙧𝙚𝙨𝙨𝙞𝙤𝙣 \n\n version bot : v1.9.2-lite",
                        //         },
                        //         msg.key.remoteJid
                        //     );
                        // }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
    return sock;
}
// run in main file
startBot();
