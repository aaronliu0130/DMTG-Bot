# DMTG-Bot
A simple bot coded for the Dank Memer Trending Game Discord server.<br>
Helps manage the daily trending game seeking.

## Installation
1. Install the latest version of NodeJS.
2. Open your terminal.
3. Type `git -v`. If it doesn't show a version and says 'command not found', download Git.
4. Clone the repo with Git:
```bash
git clone https://github.com/VillainsRule/DMTG-Bot.git
```
5. Open the Bot folder
```bash
cd DMTG-Bot
```
6. Install dependencies (was too lazy to make a package.json)
```bash
npm i discord.js express
```
7. Fill in the needed config in system.json. You can try using the command to easily open the file (if it doesn't work, open it manually):
```bash
open -e system.json
```
8. Start it!
```bash
node index.js
```

I was too lazy to generate a package.json.<br>
Make it yourself.
<br>
<br>
note: there is bot status config in events/ready.js if you want to customize that
