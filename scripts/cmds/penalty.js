const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const cacheDir = path.join(__dirname, 'cache');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const initialImageUrl = 'https://i.ibb.co/gmKRSrJ/Screenshot-208.png';
const savedImageUrl = 'https://i.ibb.co/JtsPh4R/Screenshot-205.png';
const missedImageUrl = 'https://i.ibb.co/7rQyN4y/Screenshot-206.png';
const successImageUrl = 'https://i.ibb.co/S6y5CKC/Screenshot-210.png';

module.exports = {
  config: {
    name: "penalty",
    version: "1.0",
    author: "Vex_Kshitiz",
    role: 0,
    shortDescription: "Jeu de tir au but",
    longDescription: "Jeu de tir au but avec des paris",
    category: "game",
    guide: {
      en: "{p}penalty {pari}"
    }
  },

  onStart: async function ({ api, args, message, event, usersData }) {
    try {
      if (args.length !== 1 || isNaN(parseInt(args[0]))) {
        return message.reply("❌ | Donne-moi un pari valide. Ce n'est pas compliqué !");
      }

      const betAmount = parseInt(args[0]);
      const senderID = event.senderID;
      const userData = await usersData.get(senderID);

      if (betAmount > userData.money) {
        return message.reply("❌ | Tu n'as pas assez d'argent pour parier ! Arrête de rêver.");
      }

      const initialImage = await loadImage(initialImageUrl);
      const imagePath = await saveImageToCache(initialImage);
      const sentMessage = await message.reply({ attachment: fs.createReadStream(imagePath) });

      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: "penalty",
        uid: senderID,
        bet: betAmount,
        result: null
      });

    } catch (error) {
      console.error("Error in penalty command:", error);
      message.reply("❌ | Une erreur est survenue. Essaie encore !");
    }
  },

  onReply: async function ({ api, message, event, args, usersData }) {
    const replyData = global.GoatBot.onReply.get(event.messageReply.messageID);

    if (!replyData || replyData.uid !== event.senderID) return;

    const { commandName, uid, bet } = replyData;
    if (commandName !== "penalty") return;

    const userData = await usersData.get(uid);

    // Liste des directions valides
    const validDirections = ["gauche", "droite", "milieu", "coin gauche", "coin droit"];
    const shotDirection = args[0].toLowerCase();

    if (!validDirections.includes(shotDirection)) {
      return message.reply("❌ | Choisis une direction valide ! Tape 'gauche', 'droite', 'milieu', 'coin gauche' ou 'coin droit'. C'est facile !");
    }

    const goalChance = Math.random();
    let isGoal = false;
    if (shotDirection === "gauche" || shotDirection === "droite") {
      isGoal = goalChance < 0.5;
    } else if (shotDirection === "milieu") {
      isGoal = goalChance < 0.7;
    } else if (shotDirection === "coin gauche" || shotDirection === "coin droit") {
      isGoal = goalChance < 0.4;
    }

    // Réponses aléatoires insultantes
    const insults = [
      "Tu es aussi nul que ta connexion Internet !",
      "C'est pas un tir au but, c'est un tir dans le vide !",
      "Tu veux vraiment me faire rire ? T'es même pas capable de marquer !",
      "Félicitations, t'as raté comme ta vie !",
      "T'as autant de chance qu'un pingouin sur une planche de surf !",
      "Même le gardien se moque de toi, bravo !",
      "T'es un vrai champion pour rater des occasions en or !",
      "Si tu étais aussi bon au foot qu'à faire des excuses, t'aurais gagné !",
      "T'as raté, comme d'habitude. T'es vraiment qu'un amateur !",
      "T'as un avenir de footballeur... mais pas ici !",
    ];

    let resultImage;
    let resultMessage;
    let insultMessage = insults[Math.floor(Math.random() * insults.length)];

    if (isGoal) {
      resultImage = await loadImage(successImageUrl);
      resultMessage = `⚽️ BUT ! Tu as marqué, bravo ! Tu gagnes ${bet * 2} pièces.`;
      await usersData.set(uid, { money: userData.money + bet });
    } else if (goalChance < 0.1) {
      resultImage = await loadImage(savedImageUrl);
      resultMessage = `🧤 Sauvé par le gardien ! Tu as perdu ${bet} pièces.`;
      await usersData.set(uid, { money: userData.money - bet });
    } else {
      resultImage = await loadImage(missedImageUrl);
      resultMessage = `😓 Tir raté ! Tu as perdu ${bet} pièces.`;
      await usersData.set(uid, { money: userData.money - bet });
    }

    const imagePath = await saveImageToCache(resultImage);
    await message.reply({ attachment: fs.createReadStream(imagePath) });
    await message.reply(resultMessage);
    await message.reply(insultMessage);

    global.GoatBot.onReply.delete(event.messageReply.messageID);
  }
};

async function saveImageToCache(image) {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);

  const imagePath = path.join(cacheDir, `penalty_${Date.now()}.png`);
  await fs.promises.writeFile(imagePath, canvas.toBuffer());
  return imagePath;
}
