module.exports = async (client, message, db) => {
    if (message.content.startsWith('>eval ') && message.author.id === '1003477997728313405') eval(message.content.split('>eval ')[1])
}