import { ActivityType, PermissionFlagsBits } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité et force le statut de streaming violet",
  category: 'utility',
  userPermissions: [PermissionFlagsBits.Administrator],

  runMessage: async (client, message, args) => {
    // 1. Sécurité Administrateur
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour modifier l'activité du bot.");
    }

    // 2. Vérification des arguments
    if (!args || args.length < 1) {
      return message.channel.send(
        `❌ **Utilisation incorrecte. Exemples :**\n` +
        `• \`+activity streaming .gg/astryn\` ➔ 🟣 **Badge Violet**\n` +
        `• \`+activity playing Valorant\` ➔ 🟢 **Joue à**\n` +
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
      // 🟢 LE SECRET DU SECOURS : On vide d'abord le cache pour forcer Discord à écouter le changement de couleur
      await client.user.setPresence({ activities: [], status: 'invisible' });

      let activityPayload;
      let statusColor = 'online';

      if (subActivity === 'streaming') {
        activityPayload = {
          name: statusText,
          type: ActivityType.Streaming,
          // 🟢 NOTE : Si tu as une chaîne Twitch active ou celle d'un streamer connu en live (ex: squeezie, kamet0), 
          // remplace ce lien par le sien pour que le badge s'allume instantanément à coup sûr !
          url: "https://twitch.tv" 
        };
      } else if (subActivity === 'idle') {
        statusColor = 'idle';
        activityPayload = { name: statusText, type: ActivityType.Playing };
      } else if (subActivity === 'dnd') {
        statusColor = 'dnd';
        activityPayload = { name: statusText, type: ActivityType.Playing };
      } else {
        activityPayload = { name: statusText, type: ActivityType.Playing };
      }

      // Application de la présence
      await client.user.setPresence({
        activities: [activityPayload],
        status: statusColor
      });

      const emojiMap = { streaming: '🟣', playing: '🟢', idle: '🟡', dnd: '🔴' };
      const currentEmoji = emojiMap[subActivity] || '🟢';

      return message.channel.send(`${currentEmoji} Statut mis à jour ! L'activité **${statusText}** a été poussée.`);

    } catch (error) {
      return message.channel.send(`❌ Erreur lors du changement d'activité : \`${error.message}\``);
    }
  }
};
