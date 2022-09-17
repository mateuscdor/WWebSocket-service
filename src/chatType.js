async function chatType(msg) {
    const tipe = Object.keys(msg.message)[0] || false; 
    switch (tipe) {
        case "imageMessage":
            return { type: "image", media: true, valid: true };
        case "extendedTextMessage":
            return { type: "text", media: false, valid: true };
        case "videoMessage":
            return { type: "video", media: true, valid: true };
        case "stickerMessage":
            return { type: "sticker", media: true, valid: true };
        case "documentMessage":
            return { type: "document", media: false, valid: true };
        case "audioMessage":
            return { type: "audio", media: false, valid: true };
        case "locationMessage":
            return { type: "location", media: false, valid: true };
        case "contantMessage":
            return { type: "contact", media: false, valid: true };
        default:
            return { valid: false };
    }
}

module.exports = { chatType };
