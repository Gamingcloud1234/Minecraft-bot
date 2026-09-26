require('dotenv').config();
const mineflayer = require('mineflayer');

function createBotInstance() {
  const bot = mineflayer.createBot({
    host: process.env.MC_HOST || 'neo.play.hosting',
    port: parseInt(process.env.MC_PORT || '25590', 10),
    username: process.env.MC_USERNAME || 'NeoBot',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('NeoBot has spawned into the world!');

    setTimeout(() => {
      const password = process.env.BOT_PASSWORD || 'Neobot12';
      if (password) {
        bot.chat(`/login ${password}`);
        console.log('Sent login command to the server.');
      } else {
        console.log('Warning: BOT_PASSWORD environment variable not found!');
      }
    }, 3000);
  });

  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}. Reconnecting in 10 seconds...`);
    setTimeout(createBotInstance, 10000);
  });

  bot.on('error', (err) => {
    console.log('Minecraft bot error:', err);
  });
}

createBotInstance();
