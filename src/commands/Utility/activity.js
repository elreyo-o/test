import { ActivityType, PermissionFlagsBits } from 'discord.js';

export default {
  name: 'activity',
  description: "Modifie l'activité visuelle du bot",
  category: 'utility',
  userPermissions: [PermissionFlagsBits.Administrator],
  options: [
    {
      name: 'texte',
      description: "Le texte à afficher (ex: .gg/astryn)",
      type: 3, // String
      required: true,
    }
  ],

  // 🟣 SLASH COMMAND (/activity)
  run: async (client, interaction) => {
    const texte = interaction.options.getString('texte');

    try {
      // 🟢 STRATÉGIE : Utiliser un Custom Status humain enrichi pour contourner le blocage du badge
      await client.user.setPresence({
        activities: [{
          name: 'custom',
          type: ActivityType.Custom,
          state: `🟣 En direct sur : ${texte}`
        }],
        status: 'online'
      });

      return interaction.reply({ content: `✅ Statut personnalisé poussé : **🟣 En direct sur : ${texte}**` });
    } catch (error) {
      return interaction.reply({ content: `❌ Erreur : ${error.message}`, ephemeral: true });
    }
  },

  // 🟣 COMMANDE TEXTUELLE (+activity)
  runMessage: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.channel.send("❌ Vous devez être **Administrateur** pour utiliser cette commande.");
    }

    const texte = args.join(" ").trim();
    if (!texte) {
      return message.channel.send("❌ Tu devez spécifier un texte ! Exemple : `+activity .gg/astryn`");
    }

    try {
      await client.user.setPresence({
        activities: [{
          name: 'custom',
          type: ActivityType.Custom,
          state: `🟣 En direct sur : ${texte}`
        }],
        status: 'online'
      });

      return message.channel.send(`✅ Statut personnalisé poussé : **🟣 En direct sur : ${texte}**`);
    } catch (error) {
      return message.channel.send(`❌ Erreur : ${error.message}`);
    }
  }
};

