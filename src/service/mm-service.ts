import {MMAPI, MMAssignment, PluginSettings} from "../model/model";
import {Util} from "../util";

export class MqttMMService {

    protected mm: MMAPI;
    protected assignments: MMAssignment[];

    constructor(mm: MMAPI) {
        this.mm = mm;
        this.assignments = []
    }

    public async getSettings(): Promise<PluginSettings> {
        let settings: PluginSettings;

        // Getting settings from MIDI Mixer
        const mmSettings = await this.mm.getSettings().catch(() => {
            return Promise.reject("Could not receive settings.");
        });

        // Try to format settings correctly, taking {variables} into count.
        try {
            settings = (mmSettings as any) as PluginSettings;
            settings = Util.formatObject(settings, settings) as PluginSettings;
        } catch (e) {
            return Promise.reject(e);
        }

        // Check for correct use
        if(!settings.username) {
            return Promise.reject("Cannot connect to MQTT Broker. Username is not set.");
        }
        if(!settings.password) {
            return Promise.reject("Cannot connect to MQTT Broker. Password is not set.");
        }
        if(!settings.numberOfAssignments) {
            return Promise.reject("Cannot connect to MQTT Broker. Number of Assignments is not set.");
        }
        if(!settings.volumePublishingTopic) {
            return Promise.reject("Cannot connect to MQTT Broker. Volume publishing topic is not present.");
        }
        if(!settings.volumePublishingMessage) {
            return Promise.reject("Cannot connect to MQTT Broker. Volume publishing message is not present.");
        }
        if(!settings.assignBtnPublishingTopic) {
            return Promise.reject("Cannot connect to MQTT Broker. 'Assign button' topic is not present.");
        }
        if(!settings.muteBtnPublishingTopic) {
            return Promise.reject("Cannot connect to MQTT Broker. 'Mute button' topic is not present.");
        }
        if(!settings.runBtnPublishingTopic) {
            return Promise.reject("Cannot connect to MQTT Broker. 'Run button' topic is not present.");
        }
        if(!settings.volumeChangedThrottle) {
            return Promise.reject("Cannot connect to MQTT Broker. Volume changed throttle is not set.");
        }

        return settings;
    }


}