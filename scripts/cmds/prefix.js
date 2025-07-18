module.exports = {
    config: {
        name: "prefix",
        version: "1.2",
        author: "XxGhostxx",
        countDown: 5,
        role: 0,
        shortDescription: "Affiche le préfixe du bot",
        longDescription: "Répond avec une réponse aléatoire pour montrer le préfixe du bot",
        category: "reply"
    },
    onStart: async function () {
        // Code à exécuter au démarrage du module, si nécessaire
    },
    onChat: async function ({ event, message, getLang }) {
        if (event.body && event.body.toLowerCase() === "prefix") {
            // Liste des emojis que tu as fournis
            const emojis = [
                "😑", "😐", "😶", "😛", "😋", "🙃", "🙂", "😭", "🤣", "😂",
                "😅", "😆", "😁", "😄", "😗", "😔", "🤭", "😡", "😓", "😞",
                "😟", "😥", "😢", "🤢", "🤮", "😫", "🤯", "🤧", "🤒", "😎",
                "😒", "🧐", "🤨"
            ];

            // Liste des réponses avec l'emoji inséré dans le décor
            const responses = [
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] Pourquoi tu me regardes comme ça ?\n Voici mon prefix %",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] Tu m'énerves déjà, c'est bien fait !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] T'as pas compris que mon prefix est [%] ?",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] T’es sérieux là ? Tu veux pas le savoir ?\nC'est % et tâche de pas l'oublier",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] Désolé, mais c’est [%], pas la peine de demander !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] Tu veux vraiment connaître mon prefix ? C’est [%]",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] C'est mon prefix, tu vois pas ? [%]",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] C’est tellement évident, c'est [%] !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] Tu veux un indice ? C’est [%], faut pas être trop bête !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] Bah oui c’est ça, tu le sais déjà !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] T’as vu ? Le préfixe c’est [%], maintenant bouge !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] N’oublie pas, le prefix c’est [%], idiot !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] T’as l’air tellement perdu, utilise [%] !",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] T’es vraiment aussi bête que ça ? Le prefix est [%]",
                ".  /)    /)───────◆\n  (｡•ㅅ•｡) ❥ᘜᕼOՍT㋛ᗷOT\n╭∪─∪───────◆\n╰[%] T’as compris maintenant ? Le prefix c’est [%] 😒"
            ];

            // Sélectionner un emoji aléatoire
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

            // Sélectionner une réponse aléatoire et insérer l'emoji aléatoire
            const randomResponse = responses[Math.floor(Math.random() * responses.length)].replace("[%]", randomEmoji);

            // Envoyer la réponse
            return message.reply(randomResponse);
        }
    }
};
