import {PluginSettings} from "./model/model";

export class Util {

    public static formatObject(settings: PluginSettings, object: object): object {
        Object.keys(object).forEach(key => {
            const val = (object as any)[key];
            if (val && typeof val === 'string') {
                (object as any)[key] = this.formatStr(settings, val);
            }
        })
        return object;
    }

    public static formatStr(settings: PluginSettings, str: string): string {
        return str
            .replace("{host}", settings.host)
            .replace("{username}", settings.username)
            .replace("{password}", settings.password)
            .replace("{clientId}", settings.clientId || '')
    }
}