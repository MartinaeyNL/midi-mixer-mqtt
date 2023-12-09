import {MqttService} from "./service/mqtt-service";
import {CustomTrigger, MMAPI, PluginSettings} from "./model/model";
import {MqttMMService} from "./service/mm-service";
import {AssignmentEvent, AssignmentService} from "./service/assignment-service";
import {Button} from "midi-mixer-plugin";

let mm: MMAPI = $MM;

const mmService: MqttMMService = new MqttMMService(mm);
const assignmentService: AssignmentService = new AssignmentService(mm);
const mqttService: MqttService = new MqttService(mm);
let mmSettings: PluginSettings;

mm.onClose(_onMMClose)
assignmentService.on("trigger", _onMIDITrigger)

// START
console.log("Starting MQTT Plugin...");

console.log("Getting settings from MIDI Mixer...");
mmService.getSettings().then(settings => {

    // Handle settings
    mmSettings = settings;
    console.log("Registering assignments...");
    assignmentService.registerAssignments(settings.numberOfAssignments, settings.volumeChangedThrottle);

    // Applying a small delay
    setTimeout(() => {

        // Continue to connect MQTT
        console.log("Connecting to MQTT...");
        mqttService.connect(mmSettings);

    }, 500)

}).catch((e) => {
    console.error(e);
    mm.showNotification(e);
})

function _onMMClose() {
    mqttService.disconnect();
}

function _onMIDITrigger(ev: AssignmentEvent) {
    switch (ev.trigger) {
        case CustomTrigger.VOLUME: {
            let topic = mmSettings.volumePublishingTopic.replace("{id}", ev.id);
            let message = mmSettings.volumePublishingMessage.replace("{id}", ev.id);
            mqttService.send(mmSettings, topic, message, ev.val);
            break;
        }
        case Button.Assign: {
            let topic = mmSettings.assignBtnPublishingTopic.replace("{id}", ev.id);
            let message = mmSettings.assignBtnPublishingMessage?.replace("{id}", ev.id) || '';
            mqttService.send(mmSettings, topic, message || '');
            break;
        }
        case Button.Mute: {
            let topic = mmSettings.muteBtnPublishingTopic.replace("{id}", ev.id);
            let message = mmSettings.muteBtnPublishingMessage?.replace("{id}", ev.id) || '';
            mqttService.send(mmSettings, topic, message);
            break;
        }
        case Button.Run: {
            let topic = mmSettings.runBtnPublishingTopic.replace("{id}", ev.id);
            let message = mmSettings.runBtnPublishingMessage?.replace("{id}", ev.id) || '';
            mqttService.send(mmSettings, topic, message);
            break;
        }
        default: {
            break;
        }
    }
}