module.exports = {
    getLastImage: async function(message, limit=5){
        let attachmentList = [];
        await message.channel.messages.fetch({ limit: limit})
        .then(messages => {
            for(let msg of messages){
                if(msg[1].attachments.last()){  
                    attachmentList.push(msg[1].attachments.last());
                }
            }
        });

        return attachmentList[0] || false;
    }
}