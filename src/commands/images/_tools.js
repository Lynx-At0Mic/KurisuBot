module.exports = {
    Canvas: require('canvas'),
    
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

        if(attachmentList[0]){
			if(attachmentList[0].name.endsWith('png') || attachmentList[0].name.endsWith('jpg') || attachmentList[0].name.endsWith('jpeg')){
				return attachmentList[0];
			}
		}

        return false;
    }
}