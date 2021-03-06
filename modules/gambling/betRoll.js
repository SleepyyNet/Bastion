/**
 * @file betRoll command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
let recentUsers = [];

exports.run = async (Bastion, message, args) => {
  let cooldown = 60;

  if (!recentUsers.includes(message.author.id)) {
    if (!args.money || args.money < 1 || !/^(one|two|three|four|five|six)$/i.test(args.outcome)) {
      /**
       * The command was ran with invalid parameters.
       * @fires commandUsage
       */
      return Bastion.emit('commandUsage', message, this.help);
    }

    args.money = parseInt(args.money);

    let minAmount = 5;
    if (args.money < minAmount) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('invalidInput', 'errors'), string('minBet', 'errorMessage', minAmount), message.channel);
    }

    let outcomes = [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six'
    ];
    let outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    try {
      let user = await Bastion.db.get(`SELECT bastionCurrencies FROM profiles WHERE userID=${message.author.id}`);
      user.bastionCurrencies = parseInt(user.bastionCurrencies);

      if (args.money > user.bastionCurrencies) {
        /**
        * Error condition is encountered.
        * @fires error
        */
        return Bastion.emit('error', string('insufficientBalance', 'errors'), string('insufficientBalance', 'errorMessage', user.bastionCurrencies), message.channel);
      }

      recentUsers.push(message.author.id);

      let result;
      if (outcome.toLowerCase() === args.outcome.toLowerCase()) {
        let prize = args.money < 50 ? args.money + outcomes.length : args.money < 100 ? args.money : args.money * 2;
        result = `Congratulations! You won the bet.\nYou won **${prize}** Bastion Currencies.`;

        /**
         * User's account is debited with Bastion Currencies
         * @fires userDebit
         */
        Bastion.emit('userDebit', message.author, prize);
      }
      else {
        result = 'Sorry, you lost the bet. Better luck next time.';

        /**
         * User's account is credited with Bastion Currencies
         * @fires userCredit
         */
        Bastion.emit('userCredit', message.author, args.money);
      }

      await message.channel.send({
        embed: {
          color: Bastion.colors.BLUE,
          title: `Rolled :${outcome}:`,
          description: result
        }
      });

      setTimeout(() => {
        recentUsers.splice(recentUsers.indexOf(message.author.id), 1);
      }, cooldown * 1000);
    }
    catch (e) {
      Bastion.log.error(e);
    }
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', string('cooldown', 'errors'), string('gamblingCooldown', 'errorMessage', message.author, cooldown), message.channel);
  }
};

exports.config = {
  aliases: [ 'br' ],
  enabled: true,
  argsDefinitions: [
    { name: 'outcome', type: String, alias: 'o', defaultOption: true },
    { name: 'money', type: Number, alias: 'm' }
  ]
};

exports.help = {
  name: 'betroll',
  description: string('betRoll', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'betroll < one/two/three/four/five/six > <-m amount>',
  example: [ 'betroll three -m 100' ]
};
