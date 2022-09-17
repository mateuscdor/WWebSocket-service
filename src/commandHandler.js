const { createSticker, StickerTypes } = require("wa-sticker-formatter");
const { chatType } = require("./chatType");
const { downloadMediaMessage } = require("@adiwajshing/baileys");

async function commandHandler(chat, client, message, command) {
    // const msgType = await chatType(chat);
    // if(msgType.media) {
    //     console.log(msgType);
    // }
    const didix = chat.key.remoteJid.replace("@s.whatsapp.net", "");
    if (didix === "6285221913659") {
        console.log(chat);
        const mediaData = await downloadMediaMessage(chat, "buffer", {});
        const stickerOptions = {
            pack: "Ocan-bot",
            author: "+62 859-1066-03535",
            type: StickerTypes.CROPPED,
            categories: ['🤩', '🎉'],
            quality: 50,
        };
        const generateSticker = await createSticker(mediaData, stickerOptions);
        await client.sendMessage(chat.key.remoteJid, {
            sticker: generateSticker,
        });
    }
}

module.exports = { commandHandler };
