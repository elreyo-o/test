import { ActivityType } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité et force le statut de streaming violet",
  aliases: ['act'],

  run: async (client, message, args) => {
    // Sécurité Administrateur
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
      let activityPayload;
      let statusColor = 'online';

      // 🟣 LE FIX VISUEL DU BADGE VIOLET
      if (subActivity === 'streaming') {
        activityPayload = {
          name: statusText,
          type: ActivityType.Streaming,             // FORÇAGE DU TYPE DE DIFFUSION EN DIRECT
          url: "https://twitch.tv"       // LIEN STRICTEMENT OBLIGATOIRE POUR LE BADGE VIOLET
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

      // Envoi de la requête de présence à l'API de Discord
      await client.user.setPresence({
        activities: [activityPayload],
        status: statusColor
      });

      const emojiMap = { streaming: '🟣', playing: '🟢', idle: '🟡', dnd: '🔴' };
      const currentEmoji = emojiMap[subActivity] || '🟢';

      return message.channel.send(`${currentEmoji} Statut mis à jour ! L'activité **${statusText}** est en ligne.`);

    } catch (error) {
      return message.channel.send(`❌ Erreur lors du changement d'activité : \`${error.message}\``);
    }
  }
};
