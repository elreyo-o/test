import { ActivityType } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité et la couleur du statut du bot via préfixe",
  aliases: ['act'], // Permet de faire +act aussi

  run: async (client, message, args) => {
    // Sécurité : Seuls les membres avec la permission Administrateur peuvent l'utiliser
    if (!message.member.permissions.has('Administrator')) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour modifier l'activité du bot.");
    }

    if (!args[0]) {
      return message.channel.send(
        `❌ **Utilisation incorrecte. Exemples :**\n` +
        `• \`${client.config?.commands?.prefix || '+'}activity streaming .gg/astryn\` ➔ 🟣 **Badge Violet**\n` +
        `• \`${client.config?.commands?.prefix || '+'}activity playing Valorant\` ➔ 🟢 **Joue à**\n` +
        `• \`${client.config?.commands?.prefix || '+'}activity listening Spotify\` ➔ 🟢 **Écoute**\n` +
        `• \`${client.config?.commands?.prefix || '+'}activity watching un film\` ➔ 🟢 **Regarde**\n` +
        `• \`${client.config?.commands?.prefix || '+'}activity clear\` ➔ 🔄 **Réinitialiser**`
      );
    }

    const subActivity = args[0].toLowerCase();

    // --- SOUS-COMMANDE : CLEAR ---
    if (subActivity === 'clear') {
      await client.user.setPresence({ activities: [], status: 'online' });
      return message.channel.send("✅ L'activité du bot a été entièrement réinitialisée.");
    }

    // Récupérer le reste du message pour le statut
    const statusText = args.slice(1).join(" ").strip ? args.slice(1).join(" ").trim() : args.slice(1).join(" ");
    if (!statusText) {
      return message.channel.send(`❌ Tu dois spécifier un texte après la sous-commande \`${subActivity}\`.`);
    }

    try {
      let activityType;
      let url = undefined;
      let statusColor = 'online';

      if (subActivity === 'streaming') {
        activityType = ActivityType.Streaming;
        url = "https://twitch.tv"; // Obligatoire pour le badge violet
      } else if (subActivity === 'listening') {
        activityType = ActivityType.Listening;
      } else if (subActivity === 'watching') {
        activityType = ActivityType.Watching;
      } else if (subActivity === 'competing') {
        activityType = ActivityType.Competing;
      } else if (subActivity === 'playing') {
        activityType = ActivityType.Playing;
      } else if (subActivity === 'idle') {
        activityType = ActivityType.Playing;
        statusColor = 'idle'; // Devient jaune
      } else if (subActivity === 'dnd') {
        activityType = ActivityType.Playing;
        statusColor = 'dnd'; // Devient rouge
      } else {
        return message.channel.send("❌ Type d'activité inconnu. Options : `playing`, `streaming`, `listening`, `watching`, `idle`, `dnd`, `clear`.");
      }

      // Application immédiate de la présence sur l'API Discord
      await client.user.setPresence({
        activities: [{ name: statusText, type: activityType, url: url }],
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
