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
            this.client.on('connect', this._onMQTTConnect);
            this.client.on("message", this._onMQTTMessage);
            this.client.on("packetsend", this._onMQTTPacketSend);
            this.client.on("packetreceive", this._onMQTTPacketReceive);
            this.client.on("disconnect", this._onMQTTDisconnect);
            this.client.on("error", this._onMQTTError);
            this.client.on("close", this._onMQTTClose);
            this.client.on("end", this._onMQTTEnd);
            this.client.on('reconnect', this._onMQTTReconnect);
            this.client.on("offline", this._onMQTTOffline);
            this.client.on("outgoingEmpty", this._onMQTTOutgoingEmpty);
        }
    }

    /* ----------------------------------------- */

    protected _onMQTTConnect(packet: IConnackPacket) {
        this.mm.showNotification("Connected to MQTT broker.");
        console.log(packet);
    }

    protected _onMQTTMessage(packet: IPublishPacket) {
        console.log(packet);
    }

    protected _onMQTTPacketSend(packet: Packet) {
        console.log(packet);
    }

    protected _onMQTTPacketReceive(packet: Packet) {
        console.log(packet);
    }

    protected _onMQTTDisconnect(packet: IDisconnectPacket) {
        this.mm.showNotification("Disconnected from MQTT broker.");
        console.log(packet);
    }

    protected _onMQTTError(error: Error) {
        console.error(error);
    }

    protected _onMQTTClose() {
        console.log("onMQTTClose()");
    }

    protected _onMQTTEnd() {
        console.log("onMQTTEnd()");
    }

    protected _onMQTTReconnect() {
        console.log("onMQTTReconnect()");
    }

    protected _onMQTTOffline() {
        console.log("onMQTTOffline()");
    }

    protected _onMQTTOutgoingEmpty() {
        console.log("onMQTTOutgoingEmpty()");
    }
}
