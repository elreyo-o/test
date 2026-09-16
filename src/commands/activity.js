import { ActivityType } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité et la couleur du statut du bot via préfixe",
  aliases: ['act'],

  run: async (client, message, args) => {
    if (!message.member.permissions.has('Administrator')) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour modifier l'activité du bot.");
    }

    if (!args || args.length < 1) {
      return message.channel.send(
        `❌ **Utilisation incorrecte. Exemples :**\n` +
        `• \`+activity streaming .gg/astryn\` ➔ 🟣 **Mode Custom (Violet/Streaming)**\n` +
        `• \`+activity playing Valorant\` ➔ 🟢 **Joue à**\n` +
        `• \`+activity idle Absent\` ➔ 🟡 **Inactif (Jaune)**\n` +
        `• \`+activity dnd Occupé\` ➔ 🔴 **Ne pas déranger (Rouge)**\n` +
        `• \`+activity clear\` ➔ 🔄 **Réinitialiser**`
      );
    }

    const subActivity = args[0].toLowerCase();

    if (subActivity === 'clear') {
      await client.user.setPresence({ activities: [], status: 'online' });
      return message.channel.send("✅ L'activité du bot a été entièrement réinitialisée.");
    }

    const statusText = args.slice(1).join(" ").trim();
    if (!statusText) {
      return message.channel.send(`❌ Tu dois spécifier un texte après la sous-commande \`${subActivity}\`.`);
    }

    try {
      let statusColor = 'online';
      let payload = { name: statusText, type: ActivityType.Custom };

      if (subActivity === 'streaming') {
        // On force le Custom de secours avec l'émoji violet pour remplacer le badge bloqué
        payload = { name: `🔴 En Live : ${statusText}`, type: ActivityType.Custom, state: statusText };
        statusColor = 'online';
      } else if (subActivity === 'idle') {
        statusColor = 'idle';
        payload = { name: statusText, type: ActivityType.Playing };
      } else if (subActivity === 'dnd') {
        statusColor = 'dnd';
        payload = { name: statusText, type: ActivityType.Playing };
      } else {
        payload = { name: statusText, type: ActivityType.Playing };
      }

      // Application forcée
      await client.user.setPresence({
        activities: [payload],
        status: statusColor
      });

      const emojiMap = { streaming: '🟣', playing: '🟢', idle: '🟡', dnd: '🔴' };
      const currentEmoji = emojiMap[subActivity] || '🟢';

      return message.channel.send(`${currentEmoji} Statut mis à jour avec succès sur : **${statusText}** !`);

    } catch (error) {
      return message.channel.send(`❌ Erreur lors du changement d'activité : \`${error.message}\``);
    }
  }
};
