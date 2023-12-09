import EventEmitter from "eventemitter3";
import {CustomTrigger, MMAPI, MMAssignment, MMTrigger} from "../model/model";
import {throttle} from "lodash";
import {Button} from "midi-mixer-plugin";

export interface AssignmentEvent {
    id: string,
    trigger: MMTrigger,
    val?: any
}

export class AssignmentService extends EventEmitter {

    protected mm: MMAPI;
    protected assignments: MMAssignment[];

    constructor(mm: MMAPI) {
        super();
        this.mm = mm;
        this.assignments = [];
    }


    public registerAssignments(amount: number, volumeThrottleMs: number) {
        if(this.assignments.length > 0) {
            this.clearAssignments();
        }
        for(let i = 0; i < amount; i++) {
            const id = `${i}` // TEMP: Update this
            const assignment = new MMAssignment(id, {
                name: `MQTT Assignment ${i}`
            })
            assignment.on("volumeChanged", throttle(val => this._onVolumeChanged(id, val), volumeThrottleMs));
            assignment.on("mutePressed", _ => this._onMutePressed(id));
            assignment.on("assignPressed", _ => this._onAssignPressed(id));
            assignment.on("runPressed", _ => this._onRunPressed(id));
            this.assignments.push(assignment);
        }
        console.log(`Registered ${amount} assignments.`)
    }

    public clearAssignments() {
        this.assignments.forEach(a => {
            this.mm.removeAssignment(a.id);
        })
        this.assignments = [];
    }

    protected _onVolumeChanged(id: string, volume: number) {
        this.emit("trigger", { id: id, trigger: CustomTrigger.VOLUME, val: volume } as AssignmentEvent)
    }

    protected _onMutePressed(id: string) {
        this.emit("trigger", { id: id, trigger: Button.Mute } as AssignmentEvent)
    }

    protected _onAssignPressed(id: string) {
        this.emit("trigger", { id: id, trigger: Button.Assign } as AssignmentEvent)
    }

    protected _onRunPressed(id: string) {
        this.emit("trigger", { id: id, trigger: Button.Run } as AssignmentEvent)
    }
}