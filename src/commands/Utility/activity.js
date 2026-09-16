import { ApplicationCommandOptionType, ActivityType, PermissionFlagsBits } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité et active le statut de streaming violet",
  category: 'utility',
  userPermissions: [PermissionFlagsBits.Administrator], // Limité aux Administrateurs
  options: [
    {
      name: 'texte',
      description: "Le texte à afficher à côté du badge (ex: .gg/astryn)",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  // 🟣 EXECUTION POUR LA SLASH COMMAND (/activity)
  run: async (client, interaction) => {
    const texte = interaction.options.getString('texte');

    try {
      await client.user.setPresence({
        activities: [{
          name: texte,
          type: ActivityType.Streaming,
          url: "https://twitch.tv" // URL obligatoire pour allumer le badge violet
        }],
        status: 'online'
      });

      return interaction.reply({ content: `🟣 Statut de streaming mis à jour sur : **${texte}** !`, ephemeral: false });
    } catch (error) {
      return interaction.reply({ content: `❌ Erreur : ${error.message}`, ephemeral: true });
    }
  },

  // 🟣 EXECUTION POUR LE MESSAGE TEXTUEL (Raccourci préfixe)
  runMessage: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour utiliser cette commande.");
    }

    const texte = args.join(" ").trim();
    if (!texte) {
      return message.channel.send("❌ Tu dois spécifier un texte ! Exemple : `+activity .gg/astryn` ");
    }

    try {
      await client.user.setPresence({
        activities: [{
          name: texte,
          type: ActivityType.Streaming,
          url: "https://twitch.tv"
        }],
        status: 'online'
      });

      return message.channel.send(`🟣 Statut de streaming mis à jour sur : **${texte}** !`);
    } catch (error) {
      return message.channel.send(`❌ Erreur : ${error.message}`);
    }
  }
};
