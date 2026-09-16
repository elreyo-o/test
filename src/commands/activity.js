import { ActivityType } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité et force le statut de streaming violet",
  aliases: ['act'],

  run: async (client, message, args) => {
    if (!message.member.permissions.has('Administrator')) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour modifier l'activité du bot.");
    }

    if (!args || args.length < 1) {
      return message.channel.send(
        `❌ **Utilisation incorrecte. Exemples :**\n` +
        `• \`+activity streaming .gg/astryn\` ➔ 🟣 **Allumer le Badge Violet**\n` +
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
      // 🟢 ÉTAPE CRITIQUE : On réinitialise complètement l'activité pour briser le cache de l'hébergeur
      await client.user.setPresence({ activities: [], status: 'invisible' });
      
      let activityPayload = {
        name: statusText,
        type: ActivityType.Playing
      };
      
      let statusColor = 'online';

      if (subActivity === 'streaming') {
        // 🟣 Forçage strict de l'URL Twitch : indispensable pour allumer le badge violet sur Discord
        activityPayload = {
          name: statusText,
          type: ActivityType.Streaming,
          url: "https://twitch.tv"
        };
      } else if (subActivity === 'idle') {
        statusColor = 'idle';
      } else if (subActivity === 'dnd') {
        statusColor = 'dnd';
      }

      // Appliquer l'activité finale
      await client.user.setPresence({
        activities: [activityPayload],
        status: statusColor
      });

      const emojiMap = { streaming: '🟣', playing: '🟢', idle: '🟡', dnd: '🔴' };
      const currentEmoji = emojiMap[subActivity] || '🟢';

      return message.channel.send(`${currentEmoji} Statut mis à jour avec succès ! L'activité **${statusText}** a été poussée.`);

    } catch (error) {
      return message.channel.send(`❌ Erreur lors de la synchronisation : \`${error.message}\``);
    }
  }
};
