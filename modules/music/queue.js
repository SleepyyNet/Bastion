/**
 * @file queue command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = (Bastion, message) => {
  if (!message.guild.music || !message.guild.music.songs) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('emptyQueue', 'errors'), string('notPlaying', 'errorMessage'), message.channel);
  }

  let fields = [ {
    name: `▶ ${message.guild.music.songs[0].title}`,
    value: `Requested by: ${message.guild.music.songs[0].requester}`
  } ];
  for (let i = 1; i < (message.guild.music.songs.length < 10 ? message.guild.music.songs.length : 9); i++) {
    fields.push({
      name: `${i}. ${message.guild.music.songs[i].title}`,
      value: `Requested by: ${message.guild.music.songs[i].requester}`
    });
  }

  message.guild.music.textChannel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Music queue',
      description: `${message.guild.music.songs.length - 1} songs in queue`,
      fields: fields
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'queue',
  description: string('queue', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'queue',
  example: []
};
