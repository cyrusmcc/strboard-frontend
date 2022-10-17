import api from "./api";

// @ts-ignore
let MESSAGE_API = "https://" + import.meta.env.VITE_HOST + "/api/messages/";

// @ts-ignore
if (import.meta.env.VITE_HOST.includes("localhost")) {
    // @ts-ignore
    MESSAGE_API = "http://" + import.meta.env.VITE_HOST + "/api/messages/";
}

class MessageService {
    getMessages() {
        return api.get(MESSAGE_API + "get-random", {
            params: {
                numToRetrieve: 8
            }
        }
        ).then(response => {
            return response.data
        })
    }

    getMessage(id: number) {
        return api.get(MESSAGE_API + "get/", {
            params: {
                id
            }
        }).then(response => {
            return response.data
        });
    }

    createMessage(messageContent: String, replyToId: number) {
        return api.post(MESSAGE_API + "new", {
            messageContent,
            replyToId
        });
    }

    reportMessage(id: number, reason: String) {
        return api.post(MESSAGE_API + "new-report/" + {
            id,
            reason
        });
    }
}

export default new MessageService();