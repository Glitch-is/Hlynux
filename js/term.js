function print(s) {
    if(typeof s == "object")
    {
        for (x in s)
            print(s[x]);
    }
    else
    {
        var div = $("<div class='line' style='width:100%'>");
        div.append(s)
        $("#out").append(div);
    }
}

function bottom(){
    $("html, body").animate({ scrollTop: $(document).height() }, 1);
};

function read(promp, fun) {
    var msg;
    var updatePrump = function(){
        if(typeof promp == "function")
            msg = promp();
        else
            msg = promp;
    };
    updatePrump();

    $("#txt").off("input keydown keyup");
    $("#txt").val("");
    updateCMD(msg);
    $("#txt").on("keydown", function(e){
        if(e.which == 9) // Tab
        {
            e.preventDefault();
            if($("#txt").val() == "")
                return;
            var a = $("#txt").val().split(" ");
            b = a[a.length - 1];
            var res = [];
            var keys =Object.keys(Terminal.Commands);
            for (c in keys)
            {
                if(keys[c].length >= b.length && keys[c].slice(0, b.length) == b)
                    res.push(keys[c]);
            }
            var dirs = Hlynux.path(Hlynux.cwd);
            for (d in dirs)
            {
                if(d != "~" && d.length >= b.length)
                {
                    if(d.slice(0, b.length) == b)
                        res.push(d);
                }
            }
            if(res.length == 1)
            {
                a[a.length - 1]  = res[0];
                $("#txt").val(a.join(" "));
            }
            else if(res.length > 1)
            {
                var div = $("<div class='line' style='width:100%'>" + Hlynux.envVars["PS1"]());
                div.append(document.createTextNode($("#txt").val()));
                $("#out").append(div);
                print(res.join("&nbsp;&nbsp;"));
            }
        }
        else if(e.which == 38) { // Up
            var a = Hlynux.path("~/.history")["~"]["content"].split("\n");
            if(Terminal.histID < a.length)
                Terminal.histID++;
            $("#txt").val(a[(a.length - 1) - Terminal.histID]);
        }
        else if(e.which == 40) { // Down
            var a = Hlynux.path("~/.history")["~"]["content"].split("\n");
            if(Terminal.histID > 0)
            {
                Terminal.histID--;
                $("#txt").val(a[(a.length - 1) - Terminal.histID]);
            }
            else
                $("#txt").val("");
        }
        else if(e.which == 13) // Enter
            e.preventDefault();
        updateCMD(msg);
    });
    $("#txt").on("input keyup", function(e) {
        if(e.which == 9) { // Tab
            e.preventDefault();
            return false;
        }
        else if(e.which == 13) { // Enter
            e.preventDefault();
            $("#txt").val($("#txt").val().split("\n")[0]);
            var a = document.createTextNode($("#txt").val());
            var div = $("<div class='line' style='width:100%'><span>" + msg + "</span>");
            div.append(a)
            $("#out").append(div);
            fun($("#txt").val());
            updatePrump();
            $("#txt").val("");
            bottom();
            if(Terminal.update)
            {
                Terminal.update = false;
                return;
            }
            if(Terminal.spawn)
            {
                Terminal.spawn = true;
                updateCMD(msg);
                $("#txt").off("input keydown keyup");
                $("#cmd").html("");
                read(promp, fun);
                return;
            }
            if(Terminal.interp)
                updateCMD(msg);
            return;
        }
        else if(e.which == 67 && e.ctrlKey) // Ctrl + C
        {
            read(Hlynux.envVars["PS1"], Terminal.CommandHandler);
            return;
        }
        else
        {
            Terminal.histID = 0;
        }
        updateCMD(msg);
    });
};

function updateCMD(promp){
    var b = $("#txt").val();
    var beg = document.createTextNode(b.slice(0, Terminal.curPos()));
    var end = document.createTextNode(b.slice(Terminal.curPos()+1, b.length));
    var curs = "<span class='cursor'>" + (Terminal.curPos() < b.length ? b[Terminal.curPos()] : "&nbsp;") + "</span>"
    var a = document.createTextNode(b);

    var line =  $("<div class='line' style='width:100%'><span>" + promp + "</span>");
    line.append(beg);
    line.append(curs);
    line.append(end);
    $("#cmd").html(line);
};

var Terminal = {
    author: "Glitch",
    version: "0.7",

    init: function() {
        this.bindKeys();
        this.greeting();
        read(Hlynux.envVars["PS1"], Terminal.CommandHandler);
    },
    greeting: function()
    {
        print("&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;______&nbsp;&nbsp;___&nbsp;&nbsp;&nbsp;____&nbsp;&nbsp;___&nbsp;&nbsp;__");
        print("&nbsp;&nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/\\&nbsp;\\/&nbsp;/&nbsp;\|&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;|/&nbsp;/");
        print("&nbsp;&nbsp;/&nbsp;/_/&nbsp;/&nbsp;/&nbsp;&nbsp;\\&nbsp;&nbsp;/&nbsp;&nbsp;|/&nbsp;/&nbsp;/&nbsp;/&nbsp;/|&nbsp;&nbsp;&nbsp;/ ");
        print("&nbsp;/&nbsp;__&nbsp;&nbsp;/&nbsp;/___/&nbsp;/&nbsp;/|&nbsp;&nbsp;/&nbsp;/_/&nbsp;//&nbsp;&nbsp;&nbsp;|  ");
        print("/_/&nbsp;/_/_____/_/_/&nbsp;|_/\\____//_/|_|  ");
        print("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Version " + this.version + " By " + this.author);
    },

    histID: 0,
    spawn: true,
    update: false,
    interp: false,

    bindKeys: function() {
        $(window).on("click focus", function() {
            bottom();
            setTimeout(function(){$("#txt").focus()},1);
        });
    },

    curPos: function(){
        return $("#txt").prop("selectionStart");
    },

    Commands: {
        "ls": new command("ls", Hlynux.ls),
        "cd": new command("cd", Hlynux.cd),
        "mkdir": new command("mkdir", Hlynux.mkdir),
        "rmdir": new command("rmdir", Hlynux.rmdir),
        "pwd": new command("pwd", Hlynux.pwd),
        "date": new command("date", Hlynux.date),
        "export": new command("export", Hlynux.exportVar),
        "echo": new command("echo", Hlynux.echo),
        "alias": new command("alias", Hlynux.alias),
        "cat": new command("cat", Hlynux.cat),
        "cats": new command("cats", Hlynux.cats),
        "clear": new command("clear", Hlynux.clear),
        "chmod": new command("chmod", Hlynux.chmod),
        "chown": new command("chown", Hlynux.chown),
        "mv": new command("mv", Hlynux.mv),
        "cp": new command("cp", Hlynux.cp),
        "rm": new command("rm", Hlynux.rm),
        "touch": new command("touch", Hlynux.touch),
        "js": new command("js", Hlynux.js),
        "ln": new command("ln", Hlynux.ln)
    },

    CommandHandler: function(com) {
        if(com == "")
            return;
        Hlynux.addHistory(com);

        Terminal.execute(com);

    },

    execute: function(com) {
        var c = com.split(" ");
        var comObj = Terminal.Commands[c[0]];
        if(comObj != undefined)
        {
            comObj.STDIN.push(com.split(" ").slice(1));
            comObj.func();
            print(comObj.STDOUT);
            comObj.cleanUp();
        }
        else if (Hlynux.aliases[c[0]] != undefined)
            Terminal.CommandHandler(Hlynux.aliases[c[0]]);
        else
            print(Hlynux.errorCol("sh: command not found: ") + c[0]);
    }
};

$(function() {
    setTimeout(function(){$("#txt").focus()},1);
    Terminal.init();
});
