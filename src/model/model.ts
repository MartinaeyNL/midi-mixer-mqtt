import {IClientOptions} from "mqtt/types/lib/client-options";
import {Assignment, Button, MidiMixerApi} from "midi-mixer-plugin";

export interface MMAPI extends MidiMixerApi {

}

export class MMAssignment extends Assignment {

}

export enum CustomTrigger {
    VOLUME
}

export type MMTrigger = Button | CustomTrigger

export interface PluginSettings {
    host: string;
    username: string;
    password: string;
    clientId?: string;
    numberOfAssignments: number;
    volumePublishingTopic: string;
    volumePublishingMessage: string;
    assignBtnPublishingTopic: string;
    assignBtnPublishingMessage?: string;
    muteBtnPublishingTopic: string;
    muteBtnPublishingMessage?: string;
    runBtnPublishingTopic: string;
    runBtnPublishingMessage?: string;
    volumeChangedThrottle: number;
}

export interface MQTTClientOptions extends IClientOptions {

}