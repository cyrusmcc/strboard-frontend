import { reactive } from '@vue/reactivity'

type socket = WebSocket | null;

// @ts-ignore
let WS_API = "wss://" + import.meta.env.VITE_HOST + "/ws";

// @ts-ignore
if (import.meta.env.VITE_HOST.includes("localhost")) {
    // @ts-ignore
    WS_API = "ws://" + import.meta.env.VITE_HOST + "/ws";
}

let ws: socket = null;

const totalStars = reactive({
    num: 0,
})

class SocketService {

    connect() {
        if (ws === null) ws = new WebSocket(WS_API);
        ws.onopen = () => {
            const data = JSON.stringify({
                'message': 'subscribe'
            });
            if (ws) ws.send(data);
        }
        ws.onmessage = (event) => {
            totalStars.num = parseInt(event.data);
        }
        ws.onclose = () => {
        }
        ws.onerror = (error) => {
            if (ws) ws.close();
        }
    }

    disconnect() {
        if (ws) ws.close();
    }

    getTotalStars() {
        return totalStars.num;
    }

}

export default new SocketService();