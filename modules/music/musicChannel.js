/**
 * @file musicChannel command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    if (!(parseInt(args[0]) < 9223372036854775807)) {
      await Bastion.db.run(`UPDATE guildSettings SET musicTextChannel=null, musicVoiceChannel=null WHERE guildID=${message.guild.id}`);

      return message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: 'Default music channel removed.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    await Bastion.db.run(`UPDATE guildSettings SET musicTextChannel=${message.channel.id}, musicVoiceChannel=${args[0]} WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        title: 'Default music channel set',
        fields: [
          {
            name: 'Text channel for music commands',
            value: `<#${message.channel.id}>`
          },
          {
            name: 'Music channel',
            value: message.guild.channels.filter(c => c.type === 'voice').get(args[0]) ? message.guild.channels.filter(c => c.type === 'voice').get(args[0]).name : 'Invalid'
          }
        ]
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'musicchannel',
  description: string('musicChannel', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'musicChannel [VOICE_CHANNEL_ID]',
  example: [ 'musicChannel 308278968078041098', 'musicChannel' ]
};
