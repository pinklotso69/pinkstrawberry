//CREDIT: @maklo
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const ONLY_FILE = "GroupOnly.json";
const ANTIPROMO_FILE = "./antipromosi.json";
const ANTIFOTO_FILE = "./antifoto.json";
const ANTILINK_FILE = "./antilink.json";
const ANTISTICKER_FILE = "./antisticker.json";


const BOT_TOKEN = "8733908330:AAEJ-a-IgNiPUYU3hBIo9dTptvtrVsc4mRQ"; // Ganti dengan token bot, buat di BOTFATHER

//KALO ADA AWAIT.PAW => DIGANTI AWAIT.SOCK

// ----- ( jangan ubah kalo gapaham) ------ \\
const ROLE_FILE = "roles.json";
const GITHUB_REPO = "ISI REPO LU/ISI NAMA RAW GITHUB LU"; //isi repo github dengan RAW
const GITHUB_FILE_PATH = "token.json"; //path json diluar
const GITHUB_PAT = "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"; //token GHP

const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_FILE_PATH}?timestamp=${Date.now()}`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;


// --------------------- ( Bot Setting ) ---------------------- \\
function isAntistickerEnabled(){
  if(!fs.existsSync(ANTISTICKER_FILE)){
    fs.writeFileSync(ANTISTICKER_FILE, JSON.stringify({enabled:false},null,2));
  }

  const data = JSON.parse(fs.readFileSync(ANTISTICKER_FILE));
  return data.enabled;
}

function setAntisticker(status){
  fs.writeFileSync(ANTISTICKER_FILE, JSON.stringify({enabled:status},null,2));
}

function isAntilinkEnabled(){
  const data = JSON.parse(fs.readFileSync(ANTILINK_FILE));
  return data.enabled;
}

function setAntilink(status){
  fs.writeFileSync(ANTILINK_FILE, JSON.stringify({enabled: status}, null, 2));
}

function isAntifotoEnabled(){
  const data = JSON.parse(fs.readFileSync(ANTIFOTO_FILE));
  return data.enabled;
}

function setAntifoto(status){
  fs.writeFileSync(ANTIFOTO_FILE, JSON.stringify({enabled: status}, null, 2));
}

function isAntipromoEnabled(){
  const data = JSON.parse(fs.readFileSync(ANTIPROMO_FILE));
  return data.enabled;
}

function setAntipromo(status){
  fs.writeFileSync(ANTIPROMO_FILE, JSON.stringify({enabled: status}, null, 2));
}

function getUserRole(userId) {
  try {
    const rolesPath = path.join(__dirname, "roles.json"); 
    const data = fs.readFileSync(rolesPath, "utf-8");
    const roles = JSON.parse(data);

    return roles[userId] || "USER"; 
  } catch (err) {
    console.error("Error membaca roles.json:", err.message);
    return "USER";
  }
}

function isGroupOnly() {
         if (!fs.existsSync(ONLY_FILE)) return false;
        const data = JSON.parse(fs.readFileSync(ONLY_FILE));
        return data.groupOnly;
        }


function setGroupOnly(status)
            {
            fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: status }, null, 2));
            }
     
//// FETCH TOKEN /////           
async function fetchTokens() {
  try {
    const response = await axios.get(GITHUB_RAW_URL, { headers: { "Cache-Control": "no-cache" } });
    return response.data?.tokens || [];
  } catch (error) {
    return [];
  }
}

async function updateTokens(newTokens) {
  try {
    const { data } = await axios.get(GITHUB_API_URL, {
      headers: { Authorization: `token ${GITHUB_PAT}` },
    });

    const updatedContent = Buffer.from(JSON.stringify({ tokens: newTokens }, null, 2)).toString("base64");

    await axios.put(
      GITHUB_API_URL,
      { message: "Update token list", content: updatedContent, sha: data.sha },
      { headers: { Authorization: `token ${GITHUB_PAT}` } }
    );

    return true;
  } catch (error) {
    return false;
  }
}


const bot = new TelegramBot(BOT_TOKEN, { polling: true });


let rolesCache = null;

function loadRoles() {
  if (rolesCache) return rolesCache;

  if (!fs.existsSync(ROLE_FILE)) {
    rolesCache = {
      owner: [],
      ceo: [],
      moderator: [],
      partner: [],
      reseller: []
    };
    fs.writeFileSync(ROLE_FILE, JSON.stringify(rolesCache, null, 2));
    return rolesCache;
  }

  rolesCache = JSON.parse(fs.readFileSync(ROLE_FILE));
  return rolesCache;
}

function saveRoles(data) {
  fs.writeFileSync(ROLE_FILE, JSON.stringify(data, null, 2));
}


function isOwner(userId) {
  return loadRoles().owner.includes(userId);
}

function isCeo(userId) {
  return loadRoles().ceo.includes(userId);
}

function isModerator(userId) {
  return loadRoles().moderator.includes(userId);
}

function isPartner(userId) {
  return loadRoles().partner.includes(userId);
}

function isReseller(userId) {
  return loadRoles().reseller.includes(userId);
}


function hasAccess(userId) {
  const roles = loadRoles();

  return (
    roles.owner.includes(userId) ||
    roles.ceo.includes(userId) ||
    roles.moderator.includes(userId) ||
    roles.partner.includes(userId) ||
    roles.reseller.includes(userId)
  );
}

const OWNER_ID = 8109540941; // ganti ID LU



// ===== MENU UTAMA =====
async function mainMenu(chatId, messageId = null) {

  const text = `
<pre>ＡＴＯＭＩＣ° ＣＲＡＳＨＥＲＳ°</pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無実の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: @pacenicwlee
 ◉ Version: 1.0 VIP
 ◉ Language: JavaScript
 ◉ Prefix: /

© Ambalab' Mklo 
`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "𝙈𝙀𝙉𝙐 𝘼𝘿𝘿𝙏𝙊𝙆𝙀𝙉",
          callback_data: "menu_addtoken",
          style: "danger"
        }
      ],
      [
        {
          text: "𝙈𝙀𝙉𝙐 𝙊𝙒𝙉𝙀𝙍",
          callback_data: "menu_owner",
          style: "success"
        }
      ]
    ]
  };

  if (messageId) {

    return bot.editMessageCaption(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "HTML",
      reply_markup: keyboard
    });

  } else {

    await bot.sendPhoto(chatId, "https://files.catbox.moe/yxdpdv.jpg", {
      caption: text,
      parse_mode: "HTML",
      reply_markup: keyboard
    });

    await bot.sendAudio(chatId, "./image/DATABASEATOMIC.mp3", {
      title: "Atomic Crashers",
      performer: "Atomic System"
    });

  }
}


bot.onText(/\/start/, (msg) => {

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!hasAccess(userId)) {
    return bot.sendMessage(chatId, `
<blockquote>❌ AKSES DITOLAK</blockquote>

<pre>
ANDA TIDAK MEMILIKI AKSES
SILAHKAN HUBUNGI OWNER
</pre>@pacenicwlee
`, { parse_mode: "HTML" });
  }

  mainMenu(chatId);

});


bot.on("callback_query", async (query) => {

  if (!query.message) return;

  const data = query.data;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  try {

    if (data === "menu_addtoken") {

      const text = `
<pre>MENU ADDTOKEN</pre>

• /addtoken
• /deltoken
• /listtoken
• /addrole
• /linkgb
• /myrole
`;

      await bot.editMessageCaption(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "⬅️ Back",
                callback_data: "menu_start",
                style: "primary"
              }
            ]
          ]
        }
      });

    }

    else if (data === "menu_owner") {

      if (!isOwner(userId)) {
        return bot.answerCallbackQuery(query.id, {
          text: "⚠️ Menu khusus owner!",
          show_alert: true
        });
      }

      const text = `
<pre>MENU OWNER</pre>

• /gruponly on/off
• /antipromosi on/off
• /antifoto on/off
• /antilink on/off
• /antistiker on/off
`;

      await bot.editMessageCaption(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "⬅️ Back",
                callback_data: "menu_start",
                style: "primary"
              }
            ]
          ]
        }
      });

    }

    else if (data === "menu_start") {
      await mainMenu(chatId, messageId);
    }

  } catch (err) {
    console.log("Callback Error:", err.message);
  }

  bot.answerCallbackQuery(query.id);

});
/// ------ group on/off ------- /////
bot.onText(/^\/gruponly (on|off)/i, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id;
      
      if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, `
┏━━━━━━━━━━━━━━━━━━━━━━━┓  
┃   ( ⚠️ ) Akses Ditolak ( ⚠️ )
┣━━━━━━━━━━━━━━━━━━━━━━━┫  
┃ Anda tidak memliki izin untuk ini
┗━━━━━━━━━━━━━━━━━━━━━━━┛`);
  }
      const mode = match[1].toLowerCase();
      const status = mode === "on";
      setGroupOnly(status);

      bot.sendMessage(msg.chat.id, `Fitur *Group Only* sekarang: ${status ? "AKTIF" : "NONAKTIF"}`, {
      parse_mode: "Markdown",
      });
      });
//// ------- Addroles --------- ////
bot.onText(/\/addrole (\d+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const targetId = parseInt(match[1]);
  const chatType = msg.chat.type;

  if (isGroupOnly() && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  if (!isOwner(userId) && !isCeo(userId)) {
    return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
  }

  bot.sendMessage(chatId, `Pilih role untuk ID: ${targetId}`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "PARTNER", callback_data: `role_partner_${targetId}` }],
        [{ text: "RESELLER", callback_data: `role_reseller_${targetId}` }],
        [{ text: "MODERATOR", callback_data: `role_moderator_${targetId}` }],
        [{ text: "CEO", callback_data: `role_ceo_${targetId}` }],
        [{ text: "OWNER", callback_data: `role_owner_${targetId}` }]
      ]
    }
  });

});


bot.on("callback_query", (query) => {

  const data = query.data;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  if (!data.startsWith("role_")) return;

  const split = data.split("_");
  const role = split[1];
  const targetId = parseInt(split[2]);

  const roles = loadRoles();

  if (!roles[role]) {
    return bot.answerCallbackQuery(query.id);
  }

  if (roles[role].includes(targetId)) {
    bot.sendMessage(chatId, `⚠️ ${role} sudah ada!`);
    return bot.answerCallbackQuery(query.id);
  }

  roles[role].push(targetId);
  saveRoles(roles);

  
  bot.editMessageReplyMarkup(
    { inline_keyboard: [] },
    {
      chat_id: chatId,
      message_id: messageId
    }
  );

  bot.sendMessage(chatId, `✅ ${role} berhasil ditambahkan: ${targetId}`);

  bot.answerCallbackQuery(query.id);

});
/// ----- addtoken -------- ////
bot.onText(/\/addtoken (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const chatType = msg.chat.type;
  const newToken = match[1].trim();

  
  if (isGroupOnly() && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  
  if (!hasAccess(msg.from.id)) {
    return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
  }

  let tokens = await fetchTokens();

  
  if (tokens.includes(newToken)) {
    await bot.sendMessage(chatId, "⚠️ TOKEN SUDAH ADA!");
    bot.deleteMessage(chatId, messageId).catch(() => {});
    return;
  }

  
  tokens.push(newToken);
  const success = await updateTokens(tokens);

 
  if (success) {
    await bot.sendMessage(chatId, "✅ Token berhasil ditambahkan!");
  } else {
    await bot.sendMessage(chatId, "❌ Gagal menambahkan token!");
  }

  
  bot.deleteMessage(chatId, messageId).catch(() => {});

});
//// -------- deltoken -------- /////
bot.onText(/\/deltoken (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const chatType = msg.chat.type;
  const tokenToRemove = match[1].trim();

  
  if (isGroupOnly() && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

 
  if (!hasAccess(msg.from.id)) {
    return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
  }

  let tokens = await fetchTokens();

 
  if (!tokens.includes(tokenToRemove)) {
    await bot.sendMessage(chatId, "⚠️ TOKEN TIDAK ADA DI DATABASE");
    bot.deleteMessage(chatId, messageId).catch(() => {});
    return;
  }

  
  tokens = tokens.filter(token => token !== tokenToRemove);
  const success = await updateTokens(tokens);

  
  if (success) {
    await bot.sendMessage(chatId, "✅ Token berhasil dihapus!");
  } else {
    await bot.sendMessage(chatId, "❌ Gagal menghapus token!");
  }

  
  bot.deleteMessage(chatId, messageId).catch(() => {});

});
//// ---------- listoken ---------- ////
bot.onText(/\/listtoken/, async (msg) => {
  const chatId = msg.chat.id;
  const tokens = await fetchTokens();
    if (!hasAccess(msg.from.id)) return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");

  if (tokens.length === 0) return bot.sendMessage(chatId, "⚠️ Tidak ada token tersimpan.");

  let tokenList = tokens.map((t) => `${t.slice(0, 3)}***${t.slice(-3)}`).join("\n");
  bot.sendMessage(chatId, `📋 **Daftar Token:**\n\`\`\`${tokenList}\`\`\``, { parse_mode: "Markdown" });
});
//// linkgb ///
const groupLink = "https://t.me/+JaDMPlxpTC1mNDQ1"; 

bot.onText(/\/linkgb/, (msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;

  
  if (chatType !== "group" && chatType !== "supergroup") {
    return bot.sendMessage(chatId, "❌ Bot ini hanya bisa digunakan di grup.");
  }

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📎 Link GB",
            url: groupLink
          }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "✨ Klik tombol di bawah untuk join grup GB:", opts);
});
/// My role ///
bot.onText(/\/myrole/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username ? "@" + msg.from.username : "Tidak ada";
  const firstName = msg.from.first_name || "Tidak ada";

  
  if (!hasAccess(userId)) {
    return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
  }

  
  const role = getUserRole(userId);

  const text = `
👤 Info Akun Kamu:

• ID Telegram: <b>${userId}</b>
• Username: <b>${username}</b>
• Nama: <b>${firstName}</b>
• Role: <b>${role}</b>
  `;

  bot.sendMessage(chatId, text, { parse_mode: "HTML" });
});
/// Antipromosi///
bot.onText(/\/antipromosi (on|off)/, (msg, match) => {

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const chatType = msg.chat.type;
  const arg = match[1];

  
  if (isGroupOnly() && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

 
  if (!isOwner(userId) && !isModerator(userId)) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin!");
  }

  if (arg === "on") {
    setAntipromo(true);
    bot.sendMessage(chatId, "✅ AntiPromosi diaktifkan!");
  } else {
    setAntipromo(false);
    bot.sendMessage(chatId, "⚠️ AntiPromosi dimatikan!");
  }

});
/// ------- Antifoto --------- ///
bot.onText(/\/antifoto (on|off)/, (msg, match) => {

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const chatType = msg.chat.type;
  const arg = match[1];


  if (isGroupOnly() && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

 
  if (!isOwner(userId) && !isModerator(userId)) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin!");
  }

  if (arg === "on") {
    setAntifoto(true);
    bot.sendMessage(chatId, "📵 AntiFoto diaktifkan!");
  } else {
    setAntifoto(false);
    bot.sendMessage(chatId, "⚠️ AntiFoto dimatikan!");
  }

});


/// ---- Anti link ------ ///
bot.onText(/\/antilink (on|off)/, (msg, match) => {

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const chatType = msg.chat.type;
  const arg = match[1];

  if (isGroupOnly() && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  if (!isOwner(userId) && !isModerator(userId)) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin!");
  }

  if (arg === "on") {
    setAntilink(true);
    bot.sendMessage(chatId,"🔗 AntiLink diaktifkan!");
  } else {
    setAntilink(false);
    bot.sendMessage(chatId,"⚠️ AntiLink dimatikan!");
  }

});
/// ----- anti stiker ------ ///
bot.onText(/\/antistiker (on|off)/, (msg, match) => {

  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  const userId = msg.from.id;
  const arg = match[1].toLowerCase();

  if (isGroupOnly() && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

 
  if (!isOwner(userId) && !isModerator(userId)) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin!");
  }

  if(arg === "on"){
    setAntisticker(true);
    bot.sendMessage(chatId,"✅ Anti Sticker diaktifkan!");
  }else{
    setAntisticker(false);
    bot.sendMessage(chatId,"⚠️ Anti Sticker dimatikan!");
  }

});
/// Bot.on massage///
bot.on("message",(msg)=>{

const chatId = msg.chat.id;
const chatType = msg.chat.type;

if(chatType !== "group" && chatType !== "supergroup") return;

const text = (msg.text || "").toLowerCase();


if(text.startsWith("/")) return;


if(isAntipromoEnabled()){

const promoPattern = /(t\.me\/|https?:\/\/|buy|sell|noktel|sc|bebas spam|apk|panel|reseller|@|diskon|harga|jual|open|pt|partner|moderator|pt function|partner function|murbug|murban)/i;

if(promoPattern.test(text)){
bot.deleteMessage(chatId,msg.message_id).catch(()=>{});
bot.sendMessage(chatId,`⚠️ ${msg.from.first_name}, pesan promosi tidak diperbolehkan!`);
return;
}

}


if(isAntifotoEnabled() && msg.photo){

bot.deleteMessage(chatId,msg.message_id).catch(()=>{});

bot.sendMessage(chatId,
`📵 ${msg.from.first_name}, mengirim foto tidak diperbolehkan!`);

return;
}


if(isAntistickerEnabled() && msg.sticker){

bot.deleteMessage(chatId,msg.message_id).catch(()=>{});

bot.sendMessage(chatId,
`🧩 ${msg.from.first_name}, mengirim sticker tidak diperbolehkan!`);

return;
}


if(isAntilinkEnabled()){

const linkRegex = /(https?:\/\/|ftp:\/\/|www\.|t\.me\/|telegram\.me\/|wa\.me\/|chat\.whatsapp\.com\/|discord\.gg\/|discord\.com\/invite\/|tiktok\.com\/|vt\.tiktok\.com\/|vm\.tiktok\.com\/|m\.tiktok\.com\/|instagram\.com\/|instagr\.am\/|facebook\.com\/|fb\.com\/|twitter\.com\/|x\.com\/|youtube\.com\/|youtu\.be\/|linktr\.ee\/|bio\.link\/|bit\.ly\/|tinyurl\.com\/|cutt\.ly\/|rebrand\.ly\/|shorturl\.at\/|adf\.ly\/|goo\.gl\/|is\.gd\/|soo\.gd\/|drive\.google\.com\/|dropbox\.com\/|mega\.nz\/|mediafire\.com\/|zippyshare\.com\/|\.com\b|\.net\b|\.org\b|\.xyz\b|\.site\b|\.top\b|\.info\b|\.biz\b|\.online\b|\.store\b|\.io\b|\.gg\b|\.dev\b|\.app\b|\.tk\b|\.ml\b|\.ga\b|\.cf\b|\.gq\b|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|:\d{2,5})/i;

if(linkRegex.test(text)){

bot.deleteMessage(chatId,msg.message_id).catch(()=>{});

bot.sendMessage(
chatId,
`🚫 ${msg.from.first_name}, mengirim link tidak diperbolehkan!`
);

return;
}

}

});


fetchTokens();
console.log("🚀 DATABASE ATOMIC ONN...");
