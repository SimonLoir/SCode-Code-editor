exports.newTerminal = function (){
    terminal_last_id ++;
    var x_term = $(document.body).child("div");
    x_term.css('z-index', 100);
    x_term.css('position', "fixed");
    x_term.css('overflow', "hidden");
    x_term.css('bottom', "25px");
    x_term.css('height', "250px");
    x_term.css('max-height', "90%");
    x_term.css('left', "0");
    x_term.css('right', "0");
    x_term.css('background', "rgb(34,34,34)");
    x_term.css('padding', "15px");
    x_term.get(0).setAttribute("data-id", "t" + terminal_last_id);

    terms[x_term.get(0).getAttribute("data-id")] = {
        name:""
    }


    var x_x_term = x_term;
    var x_term_resizer = x_term.child("div");

    var m_pos;
    function resize(e) {
        var parent = resize_el.parentNode;
        var dx = m_pos - e.y;
        m_pos = e.y;
        parent.style.height = (parseInt(getComputedStyle(parent, '').height) + dx) + "px";
        term.fit();
    }

    var resize_el = x_term_resizer.get(0);
    resize_el.addEventListener("mousedown", function (e) {
        m_pos = e.y;
        document.addEventListener("mousemove", resize, false);
    }, false);
    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", resize, false);
    }, false);

    x_term_resizer.css('position', "absolute");
    x_term_resizer.css('top', "0px");
    x_term_resizer.css('left', "0");
    x_term_resizer.css('right', "0");
    x_term_resizer.css('background', "#ccc");
    x_term_resizer.css('height', "4px");
    x_term_resizer.css('cursor', "n-resize");

    var term = new Terminal();
    term.open(x_term.get(0));
    term.cursorBlink = true
    term.fit()
    var pty = require('node-pty');

    var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

    var ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cwd: folder[0],
        env: process.env
    });

    ptyProcess.on('data', function (data) {
        term.write(data)
    });

    ptyProcess.on('close', function (data) {
        x_term.remove();
    });

    ptyProcess.on('exit', function (data) {
        x_term.remove();
    });

    term.textarea.onkeydown = function (e) {
        if (e.key == "Backspace") {
            ptyProcess.write("\b");
        } else if (e.key == "Enter") {
            ptyProcess.write("\r");
        }else if (e.key == "c" && e.ctrlKey == true) {
            ptyProcess.write("\x03");
        }else if (e.keyCode == 32) {
            ptyProcess.write(' ');
        }else if (e.keyCode == 9) {
            ptyProcess.write('\t');
        }else if (e.keyCode < 37) {
        }else if(e.keyCode == 37){
            ptyProcess.write("\u001b[D");
        }else if(e.keyCode == 38){
            ptyProcess.write("\u001b[A");
        }else if(e.keyCode == 39){
            ptyProcess.write("\u001b[C");
        }else if(e.keyCode == 40){
            ptyProcess.write("\u001b[B");
        } else {
            ptyProcess.write(e.key);
        }

        if(e.keyCode == 9){
            return false;
        }

    }

    term.attachCustomKeyEventHandler(function (e) {
        if (e.keyCode == 9) {
            // Do nothing
            return false;
        }
    });

}