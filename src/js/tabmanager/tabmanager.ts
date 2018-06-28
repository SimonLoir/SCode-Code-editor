import * as path from 'path';
import * as fs from 'fs';
import tab from './tabs';
/**
 * This file is part of the tabmanager module.
 */
export default class Tabmanager {
    private _tabs: any = {};
    public tabmanager: ExtJsObject;
    private _language: Object;
    private _extensions = {
        code: [
            '.js',
            '.ts',
            '.html',
            '.css',
            '.md',
            '.scss',
            '.json',
            '.sass',
            '.xml',
            '.xhtml',
            '.html5',
            '.htm'
        ],
        images: ['.png', '.jpg', '.jpeg', '.gif'],
        documents: ['psd', 'pdf', 'afdesign', 'afphoto'],
        xml_documents: ['.xml', '.xhtml', '.html5', '.htm', '.html']
    };

    /**
     * Creates a new tabmanager
     * @param default_files Files that have to be opened on startup
     */
    constructor(default_files?: Array<string>) {
        if (default_files != undefined) {
            default_files.forEach(file => {
                this.newTab(file);
            });
        }
    }

    /**
     * Creates a new tab in the tabmanager
     * @param filename the name of the file.
     */
    public newTab(filename: string, editor = true, throw_error = true) {
        if (!fs.existsSync(filename)) {
            if (throw_error === true)
                throw new Error(
                    "Cannot open the file because the file doesn't exist. File path : " +
                        filename
                );

            if (throw_error === false) return alert('error 0xfile_not_found');
        }

        let new_tab = new tab(
            filename,
            path.extname(filename).replace('.', '')
        );

        let tab_container = this.tabmanager.child('div');
        tab_container.addClass('scode_tabmnager_tab_content');

        let tabs = $(
            this.tabmanager.get(0).querySelector('#scode_tabmanager_tabs')
        );

        let tab_title = tabs.child('span');
        tab_title.html(path.basename(filename) + ' ');
        tab_title.addClass('scode_tabmanager_tabs');

        tab_title.click(function() {
            $('.scode_tabmnager_tab_content').css('display', 'none');

            tab_container.css('display', 'block');
        });

        tab_title.click();

        tab_title
            .child('span')
            .html('×')
            .click(
                function(e: Event) {
                    e.preventDefault();
                    e.stopPropagation();

                    tab_container.remove();

                    delete this._tabs[filename];

                    let left_opened = Object.keys(this._tabs);

                    if (left_opened.length > 0) {
                        this._tabs[left_opened[0]].tab_title.click();
                    } else {
                        $('#default').css('display', 'block');
                    }

                    tab_title.remove();
                }.bind(this)
            );

        if (
            editor == true &&
            this._extensions.code.indexOf(path.extname(filename)) >= 0
        ) {
            new_tab.codeEditor(
                fs.readFileSync(filename, 'utf-8'),
                tab_container
            );
        } else if (
            editor == false &&
            this._extensions.code.indexOf(path.extname(filename)) >= 0
        ) {
            new_tab.viewer(filename, tab_container);
        } else if (editor == false) {
            alert('err 0xsc002 action not allowed');
        } else {
            alert('err 0xsc001 file is not supported');
        }

        this._tabs[filename] = {
            tab: new_tab,
            tab_container,
            tab_title
        };
    }

    /**
     * Sets the language of the tabmanager
     */
    public set language(languagePack) {
        this._language = languagePack;
    }
}
