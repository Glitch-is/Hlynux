(function(){
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
            else
            {
                Terminal.histID = 0;
            }
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


    var UserCommand = function(command, args, directive){
        if (!(this instanceof UserCommand)) return new UserCommand(command,args,directive);
        this.commandString = command;
        if(typeof Terminal !== "undefined"){ // Lazy way to handle aliases
            if(command in Terminal.Commands){
                this.command = Terminal.Commands[command];
            }
            else if (command in Terminal.aliases){
                this.command = Terminal.aliases[command].command;
                this.args = Terminal.aliases[command].args;
                this.directive = Terminal.aliases[command].directive;
            } else {
                print(Hlynux.errorCol("sh: command not found: ") + command);
                this.invalid = true;
            }
        }
        this.args = args || [];
        this.directive = directive || UserCommand.Directives.NONE;
        this.STDIN = [];
        this.STDOUT = [];
        this.readOffset = 0;
    }
    UserCommand.Directives = {
        NONE: 0,
        PIPE: 1,
        WRITE: 2,
        APPEND: 3
    }
    UserCommand.DirectiveCodes = {
        "|": UserCommand.Directives.PIPE,
        ">": UserCommand.Directives.WRITE,
        ">>": UserCommand.Directives.APPEND
    };
    UserCommand.prototype.execute = function(){
        this.command(this.args,this);
    }
    UserCommand.prototype.print = function(str){
        this.STDOUT.push(str);
    }
    UserCommand.prototype.output = function(str){
        print(this.STDOUT);
    }
    UserCommand.prototype.toString = function(){
        return this.command + " " + this.args.join(" ");
    }
    UserCommand.prototype.read = function(){
        if(this.readoffset >= this.STDIN.length) throw new ArgumentError("Reading nonexistent input?");
        var s = this.STDIN[this.readOffset];
        this.readOffset++;
        return s;
    }
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
            "ls": Hlynux.ls,
            "cd": Hlynux.cd,
            "mkdir": Hlynux.mkdir,
            "rmdir": Hlynux.rmdir,
            "pwd": Hlynux.pwd,
            "date": Hlynux.date,
            "export": Hlynux.exportVar,
            "echo": Hlynux.echo,
            "alias": Hlynux.alias,
            "cat": Hlynux.cat,
            "cats": Hlynux.cats,
            "clear": Hlynux.clear,
            "chmod": Hlynux.chmod,
            "chown": Hlynux.chown,
            "mv": Hlynux.mv,
            "cp": Hlynux.cp,
            "rm": Hlynux.rm,
            "touch": Hlynux.touch,
            "js": Hlynux.js,
            "ln": Hlynux.ln,
            "write": Hlynux.write,
            "append": Hlynux.append
        },


        aliases: {
            "l": new UserCommand("ls",["-la"]),
            "c": new UserCommand("cd"),
            "..": new UserCommand("cd","..")
        },

        CommandHandler: function(com) {
            console.log(com);
            if(com == "")
                return;
            Hlynux.addHistory(com);
            var c = Terminal.CommandParser(com);
            if (c !== false)
                Terminal.execute(c);

        },

        CommandParser: function(com){
            var c = com.split(" "), commands = [];
            if (c.length < 1) throw new ArgumentError("fail");
            var command, args, directive = UserCommand.Directives.NONE;
            var i = 0;
            while(i < c.length){
                command = c[i].trim();
                var j = i+1;
                args = [];
                while(j < c.length && !(c[j].trim() in UserCommand.DirectiveCodes)){
                    args.push(c[j].trim());
                    j++;
                }
                directive = UserCommand.Directives.NONE;
                if(j < c.length){ // Must have encountered a directive
                    directive = UserCommand.DirectiveCodes[c[j].trim()];
                }
                cmd = UserCommand(command,args,directive);
                if (cmd.invalid)
                    return false;
                else
                    commands.push(cmd);

                if(directive == UserCommand.Directives.WRITE){
                    if(j+1 >= c.length) throw new ArgumentError("Cannot redirect output to nuttn");
                    commands.push(new UserCommand("write",c[j+1]));
                    j++;
                } else if(directive == UserCommand.Directives.APPEND){
                    if(j+1 >= c.length) throw new ArgumentError("Cannot redirect output to nuttn");
                    commands.push(new UserCommand("append",c[j+1]));
                    j++;
                }
                i += j + 1;
            }
            console.log(commands);
            return commands;
        },

        execute: function(commands) {
            for(var i = 0;i < commands.length;i++){
                cmd = commands[i];
                cmd.execute();
                
                switch(cmd.directive){
                    case UserCommand.Directives.NONE:
                        cmd.output();
                        break;
                    case UserCommand.Directives.PIPE:
                    case UserCommand.Directives.WRITE:
                    case UserCommand.Directives.APPEND:
                        if(i+1 < commands.length){
                            commands[i+1].STDIN = cmd.STDOUT;
                        }
                        break;
                }
            }
        }
    };

    $(function() {
        setTimeout(function(){$("#txt").focus()},1);
        Terminal.init();
    });
})();
