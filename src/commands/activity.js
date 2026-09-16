import { ActivityType } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie le statut personnalisé du bot",
  aliases: ['act'],

  run: async (client, message, args) => {
    if (!message.member.permissions.has('Administrator')) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour modifier l'activité du bot.");
    }

    if (!args || args.length < 1) {
      return message.channel.send(
        `❌ **Utilisation incorrecte. Exemples :**\n` +
        `• \`+activity streaming .gg/astryn\` ➔ Text personnalisé avec émoji\n` +
        `• \`+activity clear\` ➔ Réinitialiser`
      );
    }

    const subActivity = args[0].toLowerCase();

    if (subActivity === 'clear') {
      await client.user.setPresence({ activities: [], status: 'online' });
      return message.channel.send("✅ L'activité du bot a été réinitialisée.");
    }

    const statusText = args.slice(1).join(" ").trim();
    if (!statusText) {
      return message.channel.send(`❌ Tu dois spécifier un texte après la sous-commande.`);
    }

    try {
      let finalText = statusText;
      
      // Si tu demandes "streaming", on simule le live avec un émoji violet visible par tout le monde
      if (subActivity === 'streaming') {
        finalText = `🟣 En Live : ${statusText}`;
      } else if (subActivity === 'playing') {
        finalText = `🎮 Joue à : ${statusText}`;
      } else if (subActivity === 'listening') {
        finalText = `🎵 Écoute : ${statusText}`;
      }

      // Appliquer le statut Custom (Bypasse les restrictions d'Intents de Discord)
      await client.user.setPresence({
        activities: [{
          name: 'custom',
          type: ActivityType.Custom,
          state: finalText
        }],
        status: 'online'
      });

      return message.channel.send(`✅ Statut mis à jour sur : **${finalText}** !`);

    } catch (error) {
      return message.channel.send(`❌ Erreur lors du changement d'activité : \`${error.message}\``);
    }
  }
};
