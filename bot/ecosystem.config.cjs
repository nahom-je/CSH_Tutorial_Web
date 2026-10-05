// ecosystem.config.cjs — PM2 process manager config for NeXT-TeCH Bot
// Usage:
//   npm install -g pm2
//   pm2 start ecosystem.config.cjs
//   pm2 save              ← saves the process list
//   pm2 startup           ← auto-start on server reboot (follow the printed command)
//
// Other useful commands:
//   pm2 logs next-tech-bot      ← live logs
//   pm2 restart next-tech-bot   ← restart
//   pm2 stop next-tech-bot      ← stop
//   pm2 delete next-tech-bot    ← remove from PM2

module.exports = {
  apps: [
    {
      name: "next-tech-bot",
      script: "src/bot.js",
      interpreter: "node",
      node_args: "--experimental-vm-modules",
      // Automatically restart if it crashes
      auto_restart: true,
      restart_delay: 3000,       // wait 3s before restarting
      max_restarts: 10,          // stop trying after 10 crashes in a row
      // Restart if memory exceeds 300MB
      max_memory_restart: "300M",
      // Pass through all env vars from the .env file
      env_file: ".env",
      // Log settings
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
