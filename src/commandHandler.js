const { createSticker, StickerTypes } = require("wa-sticker-formatter");
const { chatType } = require("./chatType");
const { downloadMediaMessage } = require("@adiwajshing/baileys");

async function commandHandler(chat, client, message, command) {
    const msgType = await chatType(chat);
    console.log(msgType);
    const from = chat.key.remoteJid || '';


    if(from === '') {
        console.log(`[OCAN] Oops failed get number from!`);
        return
    }

    //STICKER
    if(msgType.valid) {
        if(msgType.type === "image" || msgType.type === "video") {
            let caption = Object.values(chat.message)[0].caption || '';
            let stickerType;
            switch(true) {
                case caption.toLowerCase().includes("crop"):
                    stickerType = StickerTypes.CROPPED;
                    break;
                case caption.toLowerCase().includes("full"):
                    stickerType = StickerTypes.FULL;
                    break;
                case caption.toLowerCase().includes("bulat"):
                    stickerType = StickerTypes.CIRCLE;
                    break;
                default:
                    stickerType = StickerTypes.DEFAULT;
                    break;
            }

            const stickerOptions = {
                pack: "Ocan-bot",
                author: "+62 859-1066-03535",
                type: stickerType,
                categories: ['🤩', '🎉'],
                quality: 50,
            };

            const mediaData = await downloadMediaMessage(chat, "buffer", {});
            const generateSticker = await createSticker(mediaData, stickerOptions);
            await client.sendMessage(chat.key.remoteJid, {
                sticker: generateSticker,
            });
        }
    }
}

module.exports = { commandHandler };
