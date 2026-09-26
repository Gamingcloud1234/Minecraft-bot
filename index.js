require('dotenv').config();
const mineflayer = require('mineflayer');

let reconnectTimeout = null;

function createBotInstance() {
  console.log('Attempting to connect to Minecraft server...');

  const bot = mineflayer.createBot({
    host: process.env.MC_HOST || 'neo.play.hosting',
    port: parseInt(process.env.MC_PORT || '25590', 10),
    username: process.env.MC_USERNAME || 'NeoBot',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('NeoBot has successfully spawned into the world!');

    setTimeout(() => {
      const password = process.env.BOT_PASSWORD || 'Neobot12';
      if (password && bot) {
        bot.chat(`/login ${password}`);
        console.log('Sent login command to the server.');
      }
    }, 3000);
  });

  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}. Reconnecting in 10 seconds...`);
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    console.log('Minecraft bot error:', err.message || err);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked from server:', reason);
  });
}

function scheduleReconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  reconnectTimeout = setTimeout(() => {
    createBotInstance();
  }, 10000);
}

// Global exception handlers to prevent Railway/Node process crashes
process.on('uncaughtException', (err) => {
  console.error('Caught uncaughtException (prevented crash):', err.message);
  scheduleReconnect();
});

process.on('unhandledRejection', (reason) => {
  console.error('Caught unhandledRejection (prevented crash):', reason);
});

// Start the bot
createBotInstance();
