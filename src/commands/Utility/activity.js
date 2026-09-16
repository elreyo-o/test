import { ActivityType, PermissionFlagsBits } from 'discord.js';

export default {
  name: 'activity',
  description: "Force le statut de streaming violet officiel",
  category: 'utility',
  userPermissions: [PermissionFlagsBits.Administrator],

  runMessage: async (client, message, args) => {
    // 1. Sécurité Administrateur
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour modifier l'activité du bot.");
    }

    if (!args || args.length < 1) {
      return message.channel.send("❌ Utilisation : `+activity <votre_texte>` (Ex: `+activity .gg/astryn`) ");
    }

    // On prend tout le texte écrit après +activity
    const statusText = args.join(" ").trim();

    try {
      // 🟢 STRATÉGIE DE FORÇAGE EN LIGNE DIRECTE : 
      // On bypass le framework et on envoie la présence brute à l'API Discord
      client.user.setPresence({
        status: "online",
        activities: [
          {
            name: statusText,
            type: ActivityType.Streaming,
            url: "https://twitch.tv" // On utilise l'URL de ton screen qui n'existe pas, Discord s'en fiche !
          }
        ]
      });

      return message.channel.send(`🟣 **Badge Violet Forcé !** Le bot affiche désormais : *En direct sur Twitch* avec le texte : **${statusText}**`);

    } catch (error) {
      return message.channel.send(`❌ Erreur lors du forçage : \`${error.message}\``);
    }
  }
};

