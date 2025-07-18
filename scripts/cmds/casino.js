module.exports = {
  config: {
    name: "casino",
    version: "3.0",
    author: "Ghost",
    role: 0,
    shortDescription: "6 choix, mais la honte est garantie",
    longDescription: "Un jeu où tu gagnes rarement et où choisir 💩 est ta pire erreur",
    category: "game",
    guide: {
      en: "{p}casino {money} / Réponds avec un numéro entre 1 et 6"
    }
  },

  onStart: async function ({ args, message, event, api, usersData }) {
    try {
      const amount = parseInt(args[0]);

      // Vérifie si le montant est valide
      if (isNaN(amount) || amount <= 0) {
        const invalidAmountReplies = [
          "💩 Mets un montant valable, champion de la médiocrité !",
          "🙄 C'est pas la Banque Alimentaire ici, réessaye avec un vrai chiffre.",
          "😂 T'es nul, même en maths. Mets un chiffre valide !",
          "💀 Sérieux ? T'es fauché à ce point ? C'est triste."
        ];
        return message.reply(invalidAmountReplies[Math.floor(Math.random() * invalidAmountReplies.length)]);
      }

      // Vérifie si le montant est au moins 50
      if (amount < 50) {
        const lowBetReplies = [
          "😂 Tu veux que je fasse quoi avec moins de 50 balles ? Achète-toi un avenir !",
          "🙄 Sérieux, c'est 50 minimum ici. Va mendier ailleurs.",
          "💩 Avec 50 balles, tu peux à peine t'acheter un café. Remets-toi en question.",
          "🤣 Même mon chien mise plus que ça, et il n'a pas de boulot."
        ];
        return message.reply(lowBetReplies[Math.floor(Math.random() * lowBetReplies.length)]);
      }

      // Vérifie si l'utilisateur a assez d'argent
      const senderID = event.senderID;
      const userData = await usersData.get(senderID);

      if (amount > userData.money) {
        const noMoneyReplies = [
          "🤣 T'as même pas assez d'argent pour perdre ! Quel clown.",
          "🪙 Reviens quand t'auras volé un portefeuille, là t'es ridicule.",
          "😂 Sérieux, t'as combien sur ton compte ? Trois centimes ?",
          "💰 La pauvreté te va si bien. Va bosser avant de jouer, fainéant."
        ];
        return message.reply(noMoneyReplies[Math.floor(Math.random() * noMoneyReplies.length)]);
      }

      // Envoie le message initial
      const sentMessage = await message.reply("🎰 Bienvenue au Casino ! Fais ton choix entre 1 et 6, mais choisis pas 💩 sinon c'est la fin pour toi !");
      
      const emojis = ['😂', '💩', '💵', '💵', '😱', '🤡'];
      emojis.sort(() => Math.random() - 0.5);

      const winningPositions = emojis.reduce((acc, emoji, index) => {
        if (emoji === '💵') acc.push(index);
        return acc;
      }, []);

      // Enregistre la réponse
      global.GoatBot.onReply.set(sentMessage.messageID, {
        commandName: "casino",
        messageID: sentMessage.messageID,
        winningPositions,
        amount: amount,
        senderID: senderID,
        emojiMap: emojis
      });

    } catch (error) {
      console.error("Erreur dans la commande casino :", error);
      const errorReplies = [
        "🤬 T'as tout cassé, bravo. Apprends à coder, peut-être ?",
        "💀 Une erreur ? Non, c'est sûrement toi qui foire.",
        "😡 Génial. Ça marche pas et c'est toi le problème.",
        "🙃 Super. Ça marche pas et c'est toi qui rate tout."
      ];
      message.reply(errorReplies[Math.floor(Math.random() * errorReplies.length)]);
    }
  },

  onReply: async function ({ message, event, Reply, api, usersData }) {
    try {
      if (!event || !message || !Reply) return;

      const userAnswer = event.body.trim();

      // Vérifie la réponse
      if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > 6) {
        const invalidReplies = [
          "🙄 C'est entre 1 et 6. T'as appris à compter ou pas ?",
          "💩 Sérieux ? Réponds correctement ou retourne à l'école.",
          "😂 Tu sais lire ou non ?",
          "🤣 Tu veux encore faire perdre plus d'argent ?"
        ];
        return message.reply(invalidReplies[Math.floor(Math.random() * invalidReplies.length)]);
      }

      // Vérifie si le joueur a gagné
      const chosenPosition = parseInt(userAnswer) - 1;
      const winningPositions = Reply.winningPositions;

      const senderID = Reply.senderID;
      const userData = await usersData.get(senderID);

      if (winningPositions.includes(chosenPosition)) {
        const winnings = Reply.amount * 2;
        await usersData.set(senderID, { money: userData.money + winnings });
        await message.reply(`🎉 Incroyable, t'as gagné ${winnings} balles ! C'est sûrement un bug.`);
      } else if (chosenPosition === 1) { // Si le joueur choisit 💩
        await message.reply(`💩 Bravo, Einstein ! T'as choisi 💩. C'est sûrement ton esprit qui t'a guidé vers ton destin : la nullité absolue.`);
      } else {
        const lostAmount = Reply.amount;
        await usersData.set(senderID, { money: userData.money - lostAmount });
        await message.reply(`❌ HAHAHA ! T'as perdu ${lostAmount} balles. Merci pour le don.`);
      }

      // Met à jour le message avec les emojis
      const revealedEmojis = Reply.emojiMap.map((emoji, index) => {
        return (index === chosenPosition) ? '💵' : (index === 1 ? '💩' : emoji);
      }).join('');

      await api.editMessage(revealedEmojis, Reply.messageID);

    } catch (error) {
      console.error("Erreur dans la gestion de la réponse :", error);
    }
  }
};
