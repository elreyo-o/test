import { ApplicationCommandOptionType, ActivityType } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité et la couleur du statut du bot",
  userPermissions: ['Administrator'], // Seuls les admins peuvent l'utiliser
  options: [
    {
      name: 'type',
      description: "Le type d'activité (playing, streaming, listening, watching, competing, clear)",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Playing (Vert)', value: 'playing' },
        { name: 'Streaming (🟣 Violet)', value: 'streaming' },
        { name: 'Listening (Vert)', value: 'listening' },
        { name: 'Watching (Vert)', value: 'watching' },
        { name: 'Competing (Vert)', value: 'competing' },
        { name: 'Clear (Réinitialiser)', value: 'clear' }
      ]
    },
    {
      name: 'message',
      description: "Le texte à afficher sous le nom du bot",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],

  run: async (client, interaction) => {
    const type = interaction.options.getString('type');
    const message = interaction.options.getString('message');

    if (type === 'clear') {
      await client.user.setPresence({ activities: [], status: 'online' });
      return interaction.reply({ content: "✅ L'activité du bot a été entièrement réinitialisée.", ephemeral: true });
    }

    if (!message) {
      return interaction.reply({ content: "❌ Tu dois spécifier un message pour cette activité !", ephemeral: true });
    }

    try {
      let activityType;
      let url = undefined;

      if (type === 'streaming') {
        activityType = ActivityType.Streaming;
        url = "https://twitch.tv"; // Obligatoire pour le badge violet
      } else if (type === 'listening') {
        activityType = ActivityType.Listening;
      } else if (type === 'watching') {
        activityType = ActivityType.Watching;
      } else if (type === 'competing') {
        activityType = ActivityType.Competing;
      } else {
        activityType = ActivityType.Playing;
      }

      // Application du statut en direct
      await client.user.setPresence({
        activities: [{ name: message, type: activityType, url: url }],
        status: 'online'
      });

      return interaction.reply({ content: `✅ Statut mis à jour avec succès sur : **${message}** !`, ephemeral: true });

    except (error) {
      return interaction.reply({ content: `❌ Erreur : ${error.message}`, ephemeral: true });
    }
  }
};
