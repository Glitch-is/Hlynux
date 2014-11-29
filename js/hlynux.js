function directory(name, subdirs, modified, access, owner, group)
{
    this["~"] = {type: "d", name: name, modified: getDateTime(), access: (typeof access !== 'undefined' ? access : "755"), owner: (typeof owner !== 'undefined' ? owner : Hlynux.envVars["USER"]), group: (typeof group !== 'undefined' ? group : Hlynux.envVars["USER"]), subdirs: (typeof subdirs !== 'undefined' ? subdirs : {})}
};

function file(name, content, modified, access, owner, group)
{
    this["~"] = {type: "f", name: name, modified: getDateTime(), access: (typeof access !== 'undefined' ? access : "755"), owner: (typeof owner !== 'undefined' ? owner : Hlynux.envVars["USER"]), group: (typeof group !== 'undefined' ? group : Hlynux.envVars["USER"]), content: (typeof content !== 'undefined' ? content : "")}
};

function link(name, path, modified, access, owner, group)
{
    this["~"] = {type: "l", name: name, modified: getDateTime(), owner: (typeof owner !== 'undefined' ? owner : Hlynux.envVars["USER"]), group: (typeof group !== 'undefined' ? group : Hlynux.envVars["USER"]), access: (typeof access !== 'undefined' ? access : "755"), path: path}
};

function getIN(cmd)
{
    return Terminal.Commands[cmd].STDIN;
};

function getOUT(cmd)
{
    return Terminal.Commands[cmd].STDOUT;
};

function updateFS()
{
    localStorage.setItem("fs", JSON.stringify(Hlynux.filesystem));
};

function getFS()
{
    return JSON.parse(localStorage.getItem("fs"));
};

function getTime() {
    var now     = new Date();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();

    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }
    var time = hour+':'+minute+':'+second;
    return time;
};

function getDate() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();

    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }
    var date = year+'/'+month+'/'+day;
    return date;
};

function getDateTime() {
    return getDate() + " " + getTime();
};

var Hlynux = {
    cwd: "/",

    envVars: {USER: "glitch", HOSTNAME: "hlynux", get PS1() { return Hlynux.getPS1; }, get HOME() { return Hlynux.getHomeDir(); } },

    getPS1: function(){
        return Hlynux.foreColor(getTime(), "#0000FF") + " " + Hlynux.envVars["USER"] + " " + Hlynux.foreColor(Hlynux.getCurDir(), "aqua") + Hlynux.foreColor(" > ", "white");
    },

    getCurDir: function(){
        var home = this.getHomeDir();
        if(this.cwd.slice(0, home.length) == home)
        {
            return "~" + ((Hlynux.cwd[Hlynux.cwd.length - 1] == "/") ? Hlynux.cwd.slice(0, Hlynux.cwd.length - 1) : Hlynux.cwd).slice(home.length);
        }
        return this.cwd;
    },

    getHomeDir: function(){
        return "/home/" + Hlynux.envVars["USER"];
    },

    boot: function(){
        // Initalize Hlynux
        var FS = getFS();
        if(FS == "" || FS != "null")
            this.initFS();
        else
            this.filesystem = FS;
        manual();
    },

    filesystem: {},

    initFS: function(){
        this.filesystem["home"] = new directory("home");
        this.filesystem["home"]["glitch"] = new directory("glitch");
        this.filesystem["home"]["glitch"]["test"] = new file("test");
        this.filesystem["home"]["glitch"][".history"] = new file(".history");
        this.filesystem["home"]["glitch"]["Code"] = new directory("Code");
        this.filesystem["bin"] = new link("bin", "/usr/bin/");
        this.filesystem["usr"] = new directory("usr");
        this.filesystem["usr"]["share"] = new directory("share");
        this.filesystem["usr"]["share"]["man"] = new directory("man");
        this.filesystem["usr"]["bin"] = new directory("usr");
        this.filesystem["usr"]["bin"]["test.js"] = new file("test.js", "print('This is a JavaScript test');\nfor(var i = 1; i <= 10; i++)\n{\nprint(i);\n};");
        this.filesystem["usr"]["lib"] = new directory("lib");
        this.filesystem["boot"] = new directory("boot");
        this.filesystem["dev"] = new directory("dev");
        this.filesystem["dev"]["null"] = new directory("null");
        this.filesystem["lib"] = new link("lib", "/usr/lib/");
        this.filesystem["lost+found"] = new directory("lost+found");
        this.filesystem["mnt"] = new directory("mnt");
        this.filesystem["opt"] = new directory("opt");
        this.filesystem["proc"] = new directory("proc");
        this.filesystem["root"] = new directory("root");
        this.filesystem["run"] = new directory("run");
        this.filesystem["srv"] = new directory("srv");
        this.filesystem["sys"] = new directory("sys");
        this.filesystem["tmp"] = new directory("tmp");
        this.filesystem["var"] = new directory("var");
    },

    addHistory: function(com){
        this.path("~/.history")["~"]["content"]+=com+"\n";
        updateFS();
    },

    exportVar: function(arg){
        // var arg = getIN("export")[0];
        var v = arg[0];
        var data = $.trim(arg.join(" ").split("=")[1]);
        Hlynux.envVars[v] = data;
    },

    cats: function(arg, cmd){
        cmd.print("<img src='http://sjoerd.luon.net/posts/2012/07/hacker-cat.jpg'/>");
    },

    echo: function(arg){
        // var arg = getIN("echo")[0];
        var s = arg.join(" ");
        var ret = [];
        var arr = s.split(" ");
        for(w in arr)
        {
            if(arr[w][0] == "$")
            {
                v = arr[w].substr(1);
                arr[w] = Hlynux.envVars[v];
            }
            ret.push(arr[w]);
        }
        // getOUT("echo").push(ret.join(" "));
        cmd.print(ret.join(" "));
    },

    cat: function(arg, cmd){
        // var arg = getIN("cat")[0];
        if(arg.length >= 1){
            var file = arg[0];
            f = Hlynux.path(file);
            if(f !== false && typeof f["~"]["content"] !== "undefined")
            {
                arr = f["~"]["content"];//.split("\n");
                // getOUT("cat").push(arr);
                cmd.print(arr);
            }
        } else {
            cmd.print(cmd.STDIN.join("\n"));
        }
    },
    write: function(arg){
        console.log(arg);
        // var arg = getIN("touch")[0];
        var p = arg;
        var name = p.split("/").slice(-1)[0];
        if(Hlynux.path(p,false) === false)
        {
            var dir = Hlynux.path(Hlynux.upDirPath(p));
            dir[name] = new file(name);
        }
        var f = Hlynux.path(p);
        f["~"]["modified"] = getDateTime();
        f["~"]["content"] = cmd.STDIN.join("\n") + "\n";
        updateFS()
    },

    append: function(arg, cmd){
        console.log(arg);
        var file = Hlynux.path($.trim(arg));
        file["~"]["content"] += cmd.STDIN + "\n";
        updateFS();
    },

    alias: function(arg, cmd){
        // var arg = getIN("alias")[0];
        var v = arg[0];
        // var s = $.trim(arg.join(" ").split("=")[1]);
        Terminal.aliases[v] = new UserCommand(arg[1],arg.slice(2), cmd.directive);
    },

    date: function(arg, cmd){
        cmd.print(getDateTime());
        // getOUT("date").push(getDateTime());
    },

    expandRelative: function(path, cwd){
        if(typeof cwd === "undefined") cwd = "";
        for(var offset=0; offset < path.length; offset++){
            if(path[offset] === "~"){
                cwd = Hlynux.envVars["HOME"];
            } else if (path[offset] === "..") {
                cwd = Hlynux.upDirPath(cwd);
            } else if (path[offset] === "."){
                // Do nothing?
            } else if (cwd[cwd.length - 1] == "/") {
                cwd = cwd + path[offset];
            } else {
                cwd = cwd + "/" + path[offset];
            }
        }
        return cwd;

    },

    expandPath: function(path) {
        var cwd = Hlynux.cwd;
        if(path === "/"){
            return "/";//Hlynux.filesystem;
        } else if (path[0] === "/") {
            cwd = "/";
        }
        return Hlynux.expandRelative(path.split("/"), cwd);

    },

    path: function(path, errors){
        if(arguments.length < 2) errors = true;
        // console.log(path);
        var cwd = Hlynux.cwd;
        if(path === "/"){
            return Hlynux.filesystem;
        } else if (path[0] === "/") {
            cwd = "/";
        }
        var absPath = Hlynux.expandRelative(path.split("/"), cwd).split("/");
        absPath = absPath.slice(1, absPath.length);

        try {
            var ret = Hlynux.filesystem;
            absPath.forEach(function(item){
                if(item === "") return;
                if(!(item in ret)) throw new TypeError("Invalid Path");
                ret = ret[item];
            });
            return ret;
        } catch(e) {
            if(!errors) return false;
            console.log("Path: " + e.message);
            print(Hlynux.errorCol("path: No such file or directory: ") + path);
            return false;
        }

    },

    errorCol: function(s){
        return this.foreColor(s, "#FF0000");
    },

    foreColor: function(s, c){
        return "<span style='color: "+c+";'>" + s + "</span>";
    },

    backColor: function(s, c){
        return "<span style='background: "+c+";'>" + s + "</span>";
    },

    bold: function(s){
        return "<b>" + s + "</b>";
    },

    getFileCol: function(t){
        switch (t)
        {
            case "d":
                return "#5959FF";
            case "l":
                return "aqua";
            default:
                return "#00FF00";
        }
    },

    upDirPath: function (p) {
        var a = p;
        p = Hlynux.expandPath(p);
        if(typeof p === "undefined")
        {
            p = Hlynux.cwd + "/" + a;
        }
        var arr = p.split("/");
        while (arr.slice(-1)[0] == "")
            arr = arr.slice(0, arr.length - 1);
        if(arr.length > 1)
        {
            arr = arr.slice(0, arr.length - 1).join("/");
            if(arr.length == 0 || arr[0] == "")
                arr = "/";
        }
        else
            arr = "/"
        return arr;
    },

    ln: function(arg)
    {
        // var arg = getIN("ln")[0];
        var opt;
        var f;
        var l;
        if(arg[0][0] == "-")
        {
            opt = arg[0].slice(1);
            f = arg[1];
            l = arg[2];
        }
        else
        {
            //hard
            f = arg[0];
            f = Hlynux.path(f, true);
            l = arg[1];
            var arr = l.split("/");
            var dir = arr[arr.length - 1];
            Hlynux.path(Hlynux.upDirPath(l))[dir] = new link(dir, f);
        }
        if($.inArray("s", opt) >= 0)
        {
            //soft
            f = Hlynux.path(f, true);
            var arr = l.split("/");
            var dir = arr[arr.length - 1];
            Hlynux.path(Hlynux.upDirPath(l))[dir] = new link(dir, f);
        }
        updateFS()
    },

    mkdir: function(arg){
        // var arg = getIN("mkdir")[0];
        var p = arg[0];
        if(Hlynux.path(p) === false)
        {
            var arr = p.split("/");
            var dir = arr[arr.length - 1];
            Hlynux.path(Hlynux.upDirPath(p))[dir] = new directory(dir);
        }
        else
            cmd.print(Hlynux.errorCol("mkdir: cannot create directory '"+p+"': File exists"));
            // getOUT("mvdir").push(Hlynux.errorCol("mkdir: cannot create directory '"+p+"': File exists"));
        updateFS()
    },

    rmdir: function(arg){
        // var arg = getIN("rmdir")[0];
        var p = arg[0]
        p = Hlynux.path(p, true);
        if(Object.keys(Hlynux.path(p)).length == 1)
        {
            var arr = p.split("/");
            var dir = arr[arr.length - 1];
            delete Hlynux.path(Hlynux.upDirPath(p))[dir];
        }
        else
            cmd.print(Hlynux.errorCol("rmdir: failed to remove '"+p+"': Directory not empty"));
            // getOUT("rmdir").push(Hlynux.errorCol("rmdir: failed to remove '"+p+"': Directory not empty"))
        updateFS()
    },

    mv: function(arg){
        // var arg = getIN("mv")[0];
        var o = arg[0];
        var d = arg[1];
        Hlynux.path(Hlynux.upDirPath(d))[d] = Hlynux.path(o);
        delete Hlynux.path(o);
        updateFS()
    },

    cp: function(arg){
        // var arg = getIN("cp")[0];
        var o = arg[0];
        var d = arg[1];
        Hlynux.path(Hlynux.upDirPath(d))[d] = Hlynux.path(o);
        updateFS()
    },

    rm: function(arg){
        // var arg = getIN("rm")[0];
        var p = arg[0];
        console.log(p);
        var name = p.split("/").slice(-1)[0];
        console.log(name);
        var dir = Hlynux.path(Hlynux.upDirPath(p));
        if(dir[name]["~"]["type"] == "f")
        {
            delete dir[name];
        }
        updateFS()
    },

    touch: function(arg){
        // var arg = getIN("touch")[0];
        var p = arg[0];
        var name = p.split("/").slice(-1)[0];
        if(Hlynux.path(p, false) === false)
        {
            // console.log(Hlynux.upDirPath(p));
            var p = Hlynux.path(Hlynux.upDirPath(p));
            p[name] = new file(name);
        }
        else
        {
            var p = Hlynux.path(p);
            p["~"]["modified"] = getDateTime();
        }
        updateFS()
    },

    js: function(arg, cmd){
        // var arg = getIN("js")[0];
        if(typeof arg[0] === undefined)
        {
            var jsInterp = function(data){
                try
                {
                    window.eval(data);
                }
                catch(err)
                {
                    cmd.print(Hlynux.errorCol(err));
                }
            }
            Terminal.spawn = false;
            Terminal.update = true;
            Terminal.interp = true;
            read("js> ", jsInterp);
        }
        else
        {
            var f = Hlynux.path(arg[0]);
            if(f["~"]["type"] == "f")
            {
                try
                {
                    window.eval(f["~"]["content"]);
                }
                catch(err)
                {
                    // console.log(err.message);
                    // getOUT("js").push(Hlynux.errorCol(err.message));
                    cmd.print(Hlynux.errorCol("js: Not a file: ") + arg[0]);
                }
            }
            else
                cmd.print(Hlynux.errorCol("js: Not a file: ") + arg[0]);
                // getOUT("js").push(Hlynux.errorCol("js: Not a file: ") + arg[0]);
        }
        updateFS();
    },

    cd: function(arg, cmd){
        // var arg = getIN("cd")[0];
        var dir = arg[0];
        if(typeof dir === "undefined" || dir == "")
        {
            Hlynux.cwd = Hlynux.envVars["HOME"];
            return;
        }
        var d = Hlynux.expandPath(dir, true);
        console.log(d);
        var t;
        if(d['~'] !== undefined){
            t = Hlynux.path(dir)
            if(t !== false)
                t = t["~"]["type"];
        }
        else
            t = "d";
        if(typeof d !== "undefined")
        {
            if(t == "l")
                Hlynux.cwd = Hlynux.path(dir)["~"]["path"];
            else if(t == "d")
            {
                Hlynux.cwd = d;
            }
        }
        else
            cmd.print(Hlynux.errorCol("cd: no such file or directory: ") + dir);
            // getOUT("cd").push(Hlynux.errorCol("cd: no such file or directory: ") + dir);
    },

    ls: function(arg, cmd){
        // var arg = getIN("ls")[0];
        var opt;
        var dir = "";
        if(typeof arg[0] !== "undefined" && arg[0][0] == "-")
        {
            opt = arg[0].slice(1);
            dir = arg[1];
        }
        else
            dir = arg[0];
        if(typeof dir === "undefined")
            dir = Hlynux.cwd;
        if(dir != "/" && Hlynux.path(dir)["~"]["type"] == "l")
            dir = Hlynux.path(dir)["~"]["path"];
        var ret = [];
        var sub = Hlynux.path(dir);
        for (x in sub)
        {
            if(x != "~")
            {
                var name = x;
                var t = sub[x]["~"]["type"];
                var inf = (($.inArray("l", opt) >= 0) ? Hlynux.fileInfo(sub[x]) : "") + Hlynux.foreColor(Hlynux.bold(name), Hlynux.getFileCol(t)) + ($.inArray("l", opt) >= 0 && t == "l" ? " -> " + sub[name]["~"]["path"] : "");
                if($.inArray("a", opt) == -1)
                {
                    if(x[0] != ".")
                        ret.push(inf);
                }
                else
                    ret.push(inf);
            }
        }
        if($.inArray("l", opt) == -1)
            ret = ret.join("&nbsp;&nbsp;");
        // getOUT("ls").push(ret);
        cmd.print(ret);
    },

    fileInfo: function(f) {
        return f["~"]["type"] + Hlynux.getAccessString(f["~"]["access"]) +" "+ f["~"]["owner"] + " " + f["~"]["group"] + " " + f["~"]["modified"] + " "
    },

    getAccessString: function(i){
        var ret = "";
        for(x in i)
            ret += Hlynux.getAccessNumber(i[x]);
        return ret;
    },

    getAccessNumber: function(i){
        switch(i)
        {
            case "7":
                return "rwx";
            case "6":
                return "rw-";
            case "5":
                return "r-x";
            case "4":
                return "r--";
            case "3":
                return "-wx";
            case "2":
                return "-w-";
            case "1":
                return "--x";
            case "0":
                return "---";
            default:
                return "XXX";
        }
    },

    chmod: function(arg, cmd) {
        // var arg = getIN("chmod")[0];
        var mode = arg[0];
        var file = Hlynux.path(arg[1]);
        file["~"]["access"] = mode;
        updateFS()
    },

    chown: function(arg, cmd) {
        // var arg = getIN("chown")[0];
        var owner  = arg[0]
        var file = Hlynux.path(arg[1]);
        file["~"]["owner"] = owner;
        updateFS()
    },

    clear: function(){
        $("#out").html("");
    },

    man: function(arg, cmd){
        com = arg[0];
        Hlynux.less(["/usr/share/man/" + com]);
    },

    less: function(arg, cmd){
        $("#txt").off("input keydown keyup");
        $("#out").hide();
        $("#cmd").hide();
        $("body").append("<div id='extra'></div>");
        Terminal.Top = true
        $("body").on("keydown", function(e){
            if((e.which == 67 && e.ctrlKey) || e.which == 81)
            {
                e.preventDefault();
                $("body").off("keydown");
                $("#extra").html("");
                $("#extra").hide();
                $("#out").show();
                $("#cmd").show();
                Terminal.Top = false;
                read(Hlynux.envVars["PS1"], Terminal.CommandHandler);
            }
        });
        var file = Hlynux.path(arg[0]);
        if(file !== false)
        {
            $("#extra").show();
            var a = file["~"]["content"].split("\n");
            for (x in a)
            {
                $("#extra").append("<div class='line'>"+a[x]+"</div>");
            }
            $("#extra").append("<div class='line'>"+Hlynux.backColor(Hlynux.foreColor("(END) 'q' to quit", "black"), "#00FF00")+"</div>");
            window.scrollTo(0, 0);
        }
        else if(typeof arg[0] !== "undefined")
        {
            $("#extra").show();
            var a = arg[0].split("\n");
            for (x in a)
            {
                $("#extra").append("<div class='line'>"+a[x]+"</div>");
            }
            $("#extra").append("<div class='line'>"+Hlynux.backColor(Hlynux.foreColor("(END) 'q' to quit", "black"), "#00FF00")+"</div>");
            window.scrollTo(0, 0);
        }
    },

    startx: function(){
        $("#txt").off("input keydown keyup");
        $("#out").hide();
        $("#cmd").hide();

        DisplayServer.init();
    },

    pwd: function(args, cmd){
        // getOUT("pwd").push(Hlynux.cwd);
        cmd.print(Hlynux.cwd);
    }
};

var manual = function(){
    var files = {
        example:    "<r><b>NAME</b></r>\n" +
                    "-->example - this is an example manual entry\n" +
                    "-->\n" +
                    "<r><b>DESCRIPTION</b></r>\n" +
                    "-->Use this as a guide line to make manul entries for other utilities or programs\n" +
                    "-->\n" +
                    "<r><b>EXAMPLE</b></r>\n" +
                    "-->Give examples on the programs usage\n" +
                    "-->\n" +
                    "<r><b>ENVIRONMENT</b></r>\n" +
                    "-->Are there any environment variables that the program uses?\n" +
                    "-->\n" +
                    "<r><b>FILES</b></r>\n" +
                    "-->What files does that program use and why?\n" +
                    "-->\n" +
                    "<r><b>SEE ALSO</b></r>\n" +
                    "--><r><b>hlynux</b></r>\n",

        hlynux: "<r><b>NAME</b></r>\n" +
                "-->Hlynux - The official Glitch Network Operating System\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->Hlynux simulates a Linux shell and is purely written in JavaScript\n" +
                "-->\n" +
                "<r><b>COMMANDS</b></r>\n" +
                "-->List of the available commands\n" +
                "-->\n" +
                "-->--><r><b>ls</r></b>" +
                "-->--><r><b>cd</r></b>" +
                "-->--><r><b>mkdir</r></b>" +
                "-->--><r><b>rmdir</r></b>" +
                "-->--><r><b>pwd</r></b>" +
                "-->--><r><b>date</r></b>" +
                "-->--><r><b>export</r></b>" +
                "-->--><r><b>echo</r></b>" +
                "-->--><r><b>alias</r></b>" +
                "-->--><r><b>cat</r></b>" +
                "-->--><r><b>cats</r></b>" +
                "-->--><r><b>clear</r></b>" +
                "-->--><r><b>chmod</r></b>" +
                "-->--><r><b>chown</r></b>" +
                "-->--><r><b>mv</r></b>" +
                "-->--><r><b>cp</r></b>" +
                "-->--><r><b>rm</r></b>" +
                "-->--><r><b>touch</r></b>" +
                "-->--><r><b>js</r></b>" +
                "-->--><r><b>ln</r></b>" +
                "-->--><r><b>less</r></b>" +
                "-->--><r><b>man</r></b>" +
                "-->--><r><b>startx</r></b>" +
                "-->--><r><b>write</r></b>" +
                "-->--><r><b>append</r></b>",

        man:    "<r><b>NAME</b></r>\n" +
                "-->man - an interface to the on-line reference manuals\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b</r>\n" +
                "--><r>man</r> is the system's manual pager. Each page argument given to man is normally the name of a program, utility or function. The manual page associated with each of these arguments is then found and displayed\n" +
                "-->\n" +
                "-->A manual page consists of several sections.\n" +
                "--><r><b>NAME</b></r>, <r><b>SYNOPSIS</b></r>, <r><b>DESCRIPTION</b></r>, <r><b>OPTIONS</b></r>, <r><b>RETURN VALUE</b></r>, <r><b>ERRORS</b></r>, <r><b>ENVIRONMENT</b></r>, <r><b>FILES</b></r>, <r><b>NOTES</b></r>, <r><b>BUGS</b></r>, <r><b>EXAMPLE</b></r>, <r><b>SEE ALSO</b></r>\n" +
                "-->\n" +
                "--><r>red text</r>-->type exactly as shown.\n" +
                "--><b>bold text</b>-->replace with appropriate argument.\n" +
                "-->[<r>-abc</r>]-->any or all argument within [  ] are optional.\n" +
                "--><r>-a</r>|<r>-b</r>-->options delimited by | cannot be used together.\n" +
                "-->\n" +
                "<r><b>EXAMPLES</b</r>\n" +
                "--><r>man</r> <b>ls</b>\n" +
                "-->-->Display the manual page for the <b>item</b> (program) <b>ls</b>\n" +
                "-->\n" +
                "<r><b>ENVIRONMENT</b</r>\n" +
                "--><r><b>MANPATH</b></r>\n" +
                "-->-->If $<r><b>MANPATH</b></r> is set, its value is used as the path to search for manual pages.\n" +
                "-->\n" +
                "<r><b>FILES</b</r>\n" +
                "--><b>/usr/share/man</b>\n" +
                "-->-->A global manual page hierarchy.\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b</r>\n" +
                "--><r><b>hlynux</b></r>\n",

        ls:    "<r><b>NAME</b></r>\n" +
                "-->ls - list directory contents\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>ls</b></r> [<b>OPTION</b>]... [<b>FILE</b>]\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->List information about the FILEs (the current directory by default).\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r>ls</r> <b>dir</b>\n" +
                "-->-->Lists all directories within <b>dir</b>\n" +
                "-->\n" +
                "--><r>ls</r> <r>-l</r>\n" +
                "-->-->Lists all directories within the current directory in a list and gives additional details\n" +
                "-->\n" +
                "--><r>ls</r> <r>-a</r>\n" +
                "-->-->Lists all directories within the current directory including hidden files (files starting with dot)\n" +
                "-->\n" +
                "<r><b>OPTIONS</b></r>\n" +
                "--><r><b>-a</b></r>\n" +
                "-->-->Lists all files including hidden files\n" +
                "-->\n" +
                "--><r><b>-l</b></r>\n" +
                "-->-->Displays all files in a list and displays additional file information\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>cd</b></r>\n",

        cd:    "<r><b>NAME</b></r>\n" +
                "-->cd - change the working directory\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>cd</b></r> <r>[</r><b>directory</b><r>]</r>\n" +
                "-->\n" +
                "--><r><b>cd</b></r> -\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->Changes the current directory to the given argument, if argument is empty it defaults to the users's home directory specified in the $<b>HOME</b> environment variable.\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r><b>cd</b></r> <b>directory</b>\n" +
                "-->-->Changes the working directory to <b>directory</b> specified in the command\n" +
                "-->\n" +
                "<r><b>ENVIRONMENT</b></r>\n" +
                "--><b>HOME</b>-->The name of the directory, used when no directory operand is specified.\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>ls</b></r>\n",

        pwd:    "<r><b>NAME</b></r>\n" +
                "-->pwd - print the working directory\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>pwd</b></r>\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->Print out the full filename of the current working directory.\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>cd</b></r>\n",

        mkdir:  "<r><b>NAME</b></r>\n" +
                "-->mkdir - make directories\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>mkdir</b></r> <b>DIRECTORY</b>\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->Create the DIRECTORY, if it does not already exist.\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r>mkdir</r> <b>dir</b>\n" +
                "-->-->Creates the directory <b>dir</b> in the current working directory\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>cd</b></r>, <r><b>pwd</b></r>\n",

        date:   "<r><b>NAME</b></r>\n" +
                "-->date - print the system date and time\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>date</b></r>\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->Display the current system date and time\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>\n",

        export: "<r><b>NAME</b></r>\n" +
                "--> export - set the export attribute for variables\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>export</b></r> name = <r>[</r><b>word</b><r>]</r>...\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->The shell shall give the <b>export</b> attribute to the variables corresponding to the specified <b>names</b>, which shall cause them to be in the environment of subsequently executed commands.\n" +
                "-->If the name  of  a  variable  is  followed  by = <b>word</b>, then the value of that variable shall be set to <b>word</b>.\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>\n",

        echo:  "<r><b>NAME</b></r>\n" +
                "-->echo - display a line of text\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>echo</b></r> [<b>STRING</b>]...\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->Echo the STRING(s) to standard output\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r>echo</r> <b>Hello World</b>\n" +
                "-->-->Displays the string '<b>Hello World</b>'\n" +
                "-->\n" +
                "--><r>echo</r> <b>Hello, $USER</b>\n" +
                "-->-->Displays the string '<b>Hello, glitch</b>'\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>export</b></r>\n",

        alias:  "<r><b>NAME</b></r>\n" +
                "-->alias - define or display aliases\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>alias</b></r> [<b>alias-name</b>[=<b>string</b>]]\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->The <b>alias</b> utility shall create or redefine alias definitions or write the values of existing alias definitions to standard outpu.\n" +
                "-->An alias definition provides a string value that shall replace a command name when it is encountered.\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r><b>alias l = ls -la</b></r>\n" +
                "-->-->Create a short alias for a commonly used ls command\n" +
                "-->\n" +
                "--><r><b>alias .. = cd ..</b></r>\n" +
                "-->-->A short command for going up a single directory\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>\n",

        cat:    "<r><b>NAME</b></r>\n" +
                "-->cat - concatenate files and print on the standard output\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>cat</b></r> [<b>OPTION</b>]... [<b>FILE</b>]...\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "-->Concatenate FILE(s), or standard input, to standard output.\n" +
                "-->\n" +
                "<r><b>OPTIONS</b></r>\n" +
                "--><r><b>-b</b></r>\n" +
                "-->-->Number nonempty output lines, overrides <r><b>-n</b></r>\n" +
                "-->\n" +
                "--><r><b>-n</b></r>\n" +
                "-->-->number all output lines\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r><b>cat</b></r> <b>file</b>\n" +
                "-->-->Displays the contents of <b>file</b> to standard output\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>less</b></r>\n",

        clear:  "<r><b>NAME</b></r>\n" +
                "-->clear - clear the terminal screen\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>clear</b></r>\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "--><r><b>clear</b></r> clears your screen if this is possible. It looks in the environment for the terminal type and then in the <r><b>terminfo</b></r> database to figure out how ti clear the screen.\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>less</b></r>\n",

        chmod:  "<r><b>NAME</b></r>\n" +
                "-->chmod - change file mode bits\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>chmod</b></r> [<b>OPTION</b>]... <b>OCTAL-MODE FILE</b>]\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "--><r><b>chmod</b></r> changes the file mode bits of each given file according to <b>mode</b>. which can be either a symbolic representation of changes to make, or an octal number representing the bit pattern for the new mode bits.\n" +
                "-->\n" +
                "<r><b>OPTIONS</b></r>\n" +
                "--><r><b>-r</b></r>\n" +
                "-->-->Recursivly changes mode of files\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r><b>chmod</b></r> 777 <b>file</b>\n" +
                "-->-->Changes the mode of <b>file</b> to full access for all groups and users\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>chown</b></r>\n",

        chown:  "<r><b>NAME</b></r>\n" +
                "-->chown - change file owner and group\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>chown</b></r> [<b>OPTION</b>]... [<b>OWNER</b>]:[<b>GROUP</b>] <b>FILE</b>]\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "--><r><b>chown</b></r> changes the user and/or group ownership of each given file. \n" +
                "-->\n" +
                "<r><b>OPTIONS</b></r>\n" +
                "--><r><b>-r</b></r>\n" +
                "-->-->Recursivly changes owner of files\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r><b>chown</b></r> root <b>file</b>\n" +
                "-->-->Changes the owner of <b>file</b> to root\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>chmod</b></r>\n",

        less:   "<r><b>NAME</b></r>\n" +
                "-->less - file perusal filter for crt viewing\n" +
                "-->\n" +
                "<r><b>SYNOPSIS</b></r>\n" +
                "--><r><b>less</b></r> <b>FILE</b>\n" +
                "-->\n" +
                "<r><b>DESCRIPTION</b></r>\n" +
                "--><b>Less</b> is used to display files in a new traversable screen. It's way faster than opening up an editor like <b>vi</b> because it doesn't have to read the entire input file at any given time which makes it very lightweight.\n" +
                "-->Commands are based on both <b>more</b> and <b>vi</b>.\n" +
                "-->\n" +
                "<r><b>EXAMPLE</b></r>\n" +
                "--><r><b>less</b></r> <b>file</b>\n" +
                "-->-->Displays the contents of <b>file</b> in a new less screen\n" +
                "-->\n" +
                "<r><b>SEE ALSO</b></r>\n" +
                "--><r><b>hlynux</b></r>, <r><b>cat</b></r>\n",
    };

    for (m in files)
    {
        Hlynux.filesystem["usr"]["share"]["man"][m] = new file(m, files[m].replace(/<r>/g, "<span style='color: #FF5959;'>").replace(/<\/r>/g, "</span>").replace(/-->/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"));
    }
};

$(function() {
    Hlynux.boot();
});
