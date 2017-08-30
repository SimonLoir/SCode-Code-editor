# SCode
SCode is a smart code editor that works on Windows and GNU/Linux. SMath is made with Electron and could work on a mac (but I don't have any mac :-) ).

SCode has his own icon set that works on every plateforms (maybe not mac, I don't know...)

## Installation

In order to install the developement version, you can clone this repository

<code>git clone https://github.com/SimonLoir/SCode-Text-editor.git</code>

Then use 

<code>npm install</code>

which will install all the dependencies

You will also have to install electron 

<code>npm install electron</code>

and then use 

<code>npm test</code>

to run the app for the first time

The project website [(en)](https://simonloir.be/scode/en) [(fr)](https://simonloir.be/scode/fr)

## Configuration

You can change the settings of SCode in your user directory (/home/{username}/.scode/settings.json or C:\user\{username}\.scode\settings.json)

If you want to see the working directory panel, you will have to modify the file settings.json and add the line

<code>"always_show_workdir_and_opened_files":true</code>

and then press Ctrl+F5 to reload the editor with the new configuration.

## Supported languages

SCode supports Javascript, HTML, css, markdown and will soon support PHP

## License

 MIT License

<pre>
Copyright (c) 2017 Simon Loir

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</pre>
