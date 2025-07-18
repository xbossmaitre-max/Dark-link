const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "daily",
    version: "1.2",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    description: {
      vi: "Nhận quà hàng ngày",
      en: "Receive daily gift"
    },
    category: "game",
    guide: {
      vi: "   {pn}: Nhận quà hàng ngày"
        + "\n   {pn} info: Xem thông tin quà hàng ngày",
      en: "   {pn}"
        + "\n   {pn} info: View daily gift information"
    },
    envConfig: {
      rewardFirstDay: {
        coin: 100,
        exp: 10
      }
    }
  },

  langs: {
    vi: {
      monday: "Thứ 2",
      tuesday: "Thứ 3",
      wednesday: "Thứ 4",
      thursday: "Thứ 5",
      friday: "Thứ 6",
      saturday: "Thứ 7",
      sunday: "Chủ nhật",
      alreadyReceived: "Bạn đã nhận quà rồi, đồ ham hố!",
      received: "Bạn đã nhận được %1 coin và %2 exp",
      randomMessages: [
        "Chúc mừng bạn!",
        "Quà đã được nhận!",
        "Chúc bạn một ngày tốt lành!",
        "Hãy tận hưởng phần thưởng của bạn!"
      ]
    },
    en: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      alreadyReceived: [
        "Tu crois que je suis un distributeur automatique, sale larve ?! Tu as déjà récupéré ton cadeau, dégage !",
        "Arrête de me harceler, t'as déjà eu ton foutu cadeau ! Va pleurnicher ailleurs.",
        "Encore toi ? Sérieux, t'es plus collant qu'un chewing-gum sous une chaussure. Pas de cadeau pour toi, vermine.",
        "Retourne d’où tu viens, parasite ! T’as déjà récupéré ton cadeau aujourd’hui.",
        "Franchement, t'es aussi lourd qu'un sac de pierres. Laisse-moi tranquille, t’as eu ton cadeau !",
        "Tu veux quoi, encore ? T'as déjà pris ce qui t'est dû, casse-toi maintenant !"
      ],
      received: [
        "Voilà ton cadeau, espèce de parasite inutile : %1 coin et %2 exp. Essaye de pas tout gaspiller en idioties, gros naze.",
        "Tu reçois %1 coin et %2 exp. Va-t’en maintenant avant que je change d’avis, tête de pioche.",
        "%1 coin et %2 exp. Voilà. Content ? Maintenant dégage, abruti.",
        "Tu veux un trophée aussi ? Tiens, %1 coin et %2 exp. Retourne te perdre.",
        "Alors, t'es content maintenant ? %1 coin et %2 exp. C’est tout ce que tu mérites.",
        "Allez, prends tes %1 coin et %2 exp et va faire quelque chose d’utile avec."
      ],
      creator: [
        "Oh, mais c'est le grand patron ! Voici un cadeau royal : %1 coin et %2 exp. Profite, roi des parasites !",
        "À genoux devant le créateur suprême ! %1 coin et %2 exp rien que pour toi, chef !",
        "Le boss est là ! Voilà %1 coin et %2 exp pour ton règne éternel. Gloire à toi !",
        "Le créateur lui-même a décidé de t’accorder %1 coin et %2 exp. Ne sois pas un ingrat, profite.",
        "C’est l'heure de donner au maître ! Voici %1 coin et %2 exp. Sers-toi, mon seigneur.",
        "Rien n'est trop beau pour toi ! Profite de tes %1 coin et %2 exp. T’es le roi ici."
      ],
      randomMessages: [
        "Congratulations!",
        "Gift received!",
        "Have a great day!",
        "Enjoy your reward!"
      ]
    }
  },

  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    try {
      const reward = envCommands[commandName].rewardFirstDay;
      const randomResponse = (responses, coin, exp) => {
        const response = responses[Math.floor(Math.random() * responses.length)];
        return response.replace("%1", coin).replace("%2", exp);
      };

      const sendRandomMessage = () => {
        const randomMessages = getLang("randomMessages");
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        message.reply(randomMessage);
      };

      if (args[0] == "info") {
        let msg = "Voici ce que tu peux recevoir mỗi ngày :\n\n";
        for (let i = 1; i < 8; i++) {
          const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** (i - 1));
          const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** (i - 1));
          const day = i == 7 ? getLang("sunday") :
            i == 6 ? getLang("saturday") :
              i == 5 ? getLang("friday") :
                i == 4 ? getLang("thursday") :
                  i == 3 ? getLang("wednesday") :
                    i == 2 ? getLang("tuesday") :
                      getLang("monday");
          msg += `${day}: ${getCoin} coin, ${getExp} exp\n`;
        }
        message.reply(msg);
        sendRandomMessage();
        return;
      }

      const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
      const date = new Date();
      const currentDay = date.getDay();
      const { senderID } = event;

      const userData = await usersData.get(senderID);
      if (userData.data.lastTimeGetReward === dateTime) {
        message.reply(randomResponse(getLang("alreadyReceived"), 0, 0));
        sendRandomMessage();
        return;
      }

      const isCreator = senderID === "61556172651835";
      const getCoin = isCreator
        ? Math.floor(reward.coin * 5)
        : Math.floor(reward.coin * (1 + 20 / 100) ** (currentDay - 1));
      const getExp = isCreator
        ? Math.floor(reward.exp * 5)
        : Math.floor(reward.exp * (1 + 20 / 100) ** (currentDay - 1));
      userData.data.lastTimeGetReward = dateTime;
      await usersData.set(senderID, {
        money: userData.money + getCoin,
        exp: userData.exp + getExp,
        data: userData.data
      });

      const response = isCreator
        ? randomResponse(getLang("creator"), getCoin, getExp)
        : randomResponse(getLang("received"), getCoin, getExp);
      message.reply(response);
      sendRandomMessage();
    } catch (error) {
      console.error("Error in daily command:", error);
      message.reply("An error occurred while processing your request. Please try again later.");
    }
  }
};
