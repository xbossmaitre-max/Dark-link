const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const Prefixes = [
  "help", "HELP", "%help",
  "aide", "AIDE", "aide", "%aide"
];

module.exports = {
  config: {
    name: "help",
    aliases: ["aide"],
    version: "1.17",
    author: "XxGhostxX",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly with pages",
    },
    category: "info",
    guide: {
      en: "{pn} help [page] - Display commands list with pagination\n{pn} help [cmdName] - Display details for a specific command\n{pn} help guide - Show how to use the pagination system",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID, body } = event;

    const prefixUsed = Prefixes.find((p) => body && body.startsWith(p));
    if (!prefixUsed) return;

    const cleanArgs = body.substring(prefixUsed.length).trim().split(" ");

    const itemsPerPage = 20;
    const totalCommands = commands.size;
    const totalPages = Math.ceil(totalCommands / itemsPerPage);

    if (cleanArgs.length === 0 || !isNaN(cleanArgs[0])) {
      const page = Math.max(1, Math.min(totalPages, parseInt(cleanArgs[0]) || 1));
      const commandArray = Array.from(commands.keys());
      const startIndex = (page - 1) * itemsPerPage;
      const commandsToShow = commandArray.slice(startIndex, startIndex + itemsPerPage);

      let msg = `\n❥∧︵ ∧\n. ᗒ(⟢ω⟣)ᗕ  ★[ᕼᗴᒪᑕ]★》\n╭∪─∪────────⭓\n│●๋ [⚞𝐆𝐇𝐎𝐒𝐓⚟]\n├───────────⭓\n│📚 - 𝐋𝐢𝐬𝐭𝐞 𝐝𝐞𝐬 𝐜𝐦𝐝𝐬\n╰───────────⭓\n\n╭─⭓〘𝙋𝘼𝙂𝙀 [${page}/${totalPages}]〙⭓`;

      commandsToShow.forEach((cmdName) => {
        const cmd = commands.get(cmdName);
        if (cmd.config.role > role) return;
        msg += `\n│-『${cmdName}』`;
      });

      if (page === totalPages) {
        msg += `\n╰───────────⭓\n\n📲 𝙋𝙧𝙚𝙨𝙚𝙣𝙖𝙩𝙞𝙤𝙣 𝙙𝙪 𝘾𝙧𝙚́𝙖𝙩𝙚𝙪𝙧 :\n💬 Pour me contacter, visitez mon profil Facebook :\n🔗 https://www.facebook.com/8Xx.GHOST.xX8`;
      } else {
        msg += `╰───────────⭓\n\n╭───────────⭓\n│${totalCommands} 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬\n│𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞𝐬\n├───────────⭓`;
        msg += `\n│🔄 Utilise "${prefixUsed} help [page]" pour naviguer entre les pages.\n╰───────────⭓`;
      }
      await message.reply(msg);
    } else if (cleanArgs[0].toLowerCase() === "guide") {
      const guideMessage = `📖 **Guide d'utilisation de la commande help :**\n\n` +
        `1. **${prefixUsed} help [page]** - Affiche la liste des commandes disponibles par page.\n` +
        `   Exemple : ${prefixUsed} help 1 - Affiche la première page des commandes.\n` +
        `   Exemple : ${prefixUsed} help 2 - Affiche la deuxième page des commandes.\n\n` +
        `2. **${prefixUsed} help [cmdName]** - Affiche des informations détaillées sur une commande spécifique.\n` +
        `   Exemple : ${prefixUsed} help kick - Affiche des informations sur la commande "kick".\n\n` +
        `3. **${prefixUsed} help guide** - Affiche ce guide sur l'utilisation de la pagination.\n`;
      await message.reply(guideMessage);
    } else {
      const commandName = cleanArgs[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));
      if (!command) {
        return message.reply(`❌ La commande /${commandName}/ est introuvable.`);
      }
      const { config } = command;
      const usage = config.guide?.en || "Aucun guide disponible.";
      const description = config.longDescription?.en || "Pas de description disponible.";
      const author = config.author || "Inconnu";
      const roleText = roleTextToString(config.role);

      const response = `╭───────────⭓\n│📜 **Commande :** ${config.name}\n├───────────⭓\n│👑 **Auteur :** ${author}\n╰───────────⭓\n` +
        `💡 **Description :** ${description}\n` +
        `\n\n🔒 **Rôle requis :** ${roleText}\n` +
        `\n\n📖 **Utilisation :** ${usage.replace(/{pn}/g, prefixUsed).replace(/{name}/g, config.name)}`;
      await message.reply(response);
    }
  }
};

function roleTextToString(role) {
  switch (role) {
    case 0:
      return "Tout le monde";
    case 1:
      return "Administrateurs de groupe";
    case 2:
      return "Administrateurs";
    default:
      return "Rôle inconnu";
  }
}
