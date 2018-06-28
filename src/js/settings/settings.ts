import * as fs from 'fs';
import * as os from 'os';

export default class Settings {
    private default_settings = {
        always_show_explorer: true,
        theme: '../css/simonloir.scode.dark.css',
        color_scheme: '../css/simonloir.scode.hl.css',
        language: 'en'
    };

    private _settings: Object;

    public scode_dir = os.homedir() + '/.scode2.18/';

    public settings_path = this.scode_dir + 'settings.json';

    public scode_opened_files_dir = this.scode_dir + 'files.2.0.json';

    constructor() {
        this.load();
    }

    /**
     * Loads the settings of the editor.
     */
    private load(): void {
        if (fs.existsSync(this.settings_path)) {
            try {
                this._settings = JSON.parse(
                    fs.readFileSync(this.settings_path, 'utf8')
                );
            } catch (error) {
                this.repair();
            }
        } else {
            if (this.isFirstUse == true)
                (this._settings = this.default_settings), this.install();
            else this.repair();
        }
    }

    /**
     * Sets a setting in scode configuration file
     * @param key
     * @param value
     */
    public set(key: string, value: string) {
        this._settings[key] = value;
    }

    /**
     * Gets the whole settings or only one
     * @param key
     */
    public get(key?: string) {
        if (key != undefined) {
            return this._settings[key];
        } else {
            return this._settings;
        }
    }

    /**
     * Gets the last files that where opened in the tabmanager
     */
    public getLastOpenedFiles(): Array<string> {
        if (fs.existsSync(this.scode_opened_files_dir) == true) {
            return JSON.parse(
                fs.readFileSync(this.scode_opened_files_dir, 'utf-8')
            );
        } else {
            return [];
        }
    }

    /**
     * Verfifies if it's the first time that scode is started.
     */
    public get isFirstUse() {
        if (fs.existsSync(this.scode_dir)) {
            return false;
        }
        return true;
    }

    /**
     * Repairs the program
     */
    private repair() {
        alert('program will be repaired\n\nerror 0xmust_repair_installation');
        this.install();
        alert('Repaired, click ok to restart');
        window.location.reload();
    }

    /**
     * Creates configuration files
     */
    private install() {
        if (!fs.existsSync(this.scode_dir)) fs.mkdirSync(this.scode_dir);
        if (!fs.existsSync(this.settings_path))
            fs.writeFileSync(
                this.settings_path,
                JSON.stringify(this.default_settings),
                'utf8'
            );
    }
}
