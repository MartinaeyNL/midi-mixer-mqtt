import * as mqtt from "mqtt";
import {IPublishPacket, MqttClient, Packet} from "mqtt";
import {MMAPI, MQTTClientOptions, PluginSettings} from "../model/model";
import {IConnackPacket, IDisconnectPacket} from "mqtt-packet";
import {Util} from "../util";

export class MqttService {

    protected mm: MMAPI;
    protected client?: MqttClient;
    protected connectionOptions: MQTTClientOptions = {
        clean: true,
        connectTimeout: 4000
    }

    constructor(mm: MMAPI) {
        this.mm = mm;
    }

    public connect(settings: PluginSettings) {
        if(!this.client?.connected) {
            this._doConnect(settings.username, settings.password, settings.clientId);

        }
    }

    public disconnect() {
        if(this.client && !this.client.disconnecting) {
            this.client.end();
        }
    }

    public send(settings: PluginSettings, topic: string, message: string, value?: string) {
        topic = Util.formatStr(settings, topic);
        message = Util.formatStr(settings, message).replace("{value}", value || '');
        this.client?.publish(topic, message)
    }

    /* -------------------------- */

    protected _doConnect(username: string, password: string, clientId?: string) {
        this.mm.setSettingsStatus("status", "Connecting to MQTT Broker...");

        let connectionOptions = this.connectionOptions;
        connectionOptions.username = username;
        connectionOptions.password = password;
        if(clientId) {
            connectionOptions.clientId = clientId;
        }

        this.client = mqtt.connect(connectionOptions);
        this._addMQTTListeners();
    }

    protected _addMQTTListeners() {
        if(this.client) {
            this.client.on('connect', packet => this._onMQTTConnect(this.mm, packet));
            this.client.on("message", (packet: IPublishPacket) => this._onMQTTMessage(this.mm, packet));
            this.client.on("packetsend", packet => this._onMQTTPacketSend(this.mm, packet));
            this.client.on("packetreceive", packet => this._onMQTTPacketReceive(this.mm, packet));
            this.client.on("disconnect", packet => this._onMQTTDisconnect(this.mm, packet));
            this.client.on("error", error => this._onMQTTError(this.mm, error));
            this.client.on("close", () => this._onMQTTClose(this.mm));
            this.client.on("end", () => this._onMQTTEnd(this.mm));
            this.client.on('reconnect', () => this._onMQTTReconnect(this.mm));
            this.client.on("offline", () => this._onMQTTOffline(this.mm));
            this.client.on("outgoingEmpty", () => this._onMQTTOutgoingEmpty(this.mm));
        }
    }

    /* ----------------------------------------- */

    protected _onMQTTConnect(mm: MMAPI, packet: IConnackPacket) {
        mm.showNotification("Connected to MQTT broker.");
        console.log(packet);
    }

    protected _onMQTTMessage(mm: MMAPI, packet: IPublishPacket) {
        console.log(packet);
    }

    protected _onMQTTPacketSend(mm: MMAPI, packet: Packet) {
        console.log(packet);
    }

    protected _onMQTTPacketReceive(mm: MMAPI, packet: Packet) {
        console.log(packet);
    }

    protected _onMQTTDisconnect(mm: MMAPI, packet: IDisconnectPacket) {
        mm.showNotification("Disconnected from MQTT broker.");
        console.log(packet);
    }

    protected _onMQTTError(mm: MMAPI, error: Error) {
        console.error(error);
    }

    protected _onMQTTClose(mm: MMAPI) {
        console.log("onMQTTClose()");
    }

    protected _onMQTTEnd(mm: MMAPI) {
        console.log("onMQTTEnd()");
    }

    protected _onMQTTReconnect(mm: MMAPI) {
        console.log("onMQTTReconnect()");
    }

    protected _onMQTTOffline(mm: MMAPI) {
        console.log("onMQTTOffline()");
    }

    protected _onMQTTOutgoingEmpty(mm: MMAPI) {
        console.log("onMQTTOutgoingEmpty()");
    }
}
