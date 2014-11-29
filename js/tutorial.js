function animate(name, out) {
    var inA = ["bounceIn", "bounceInDown", "bounceInUp","bounceInLeft","bounceInRight","flipInY","lightSpeedIn", "rotateIn","rollIn", "zoomInDown", "zoomInUp", "zoomInLeft", "zoomInRight"];
    var outA = ["bounceOut", "bounceOutDown", "bounceOutUp","bounceOutLeft","bounceOutRight", "flipOutY","lightSpeedOut", "rotateOut","rollOut", "zoomOutDown", "zoomOutUp", "zoomOutLeft", "zoomOutRight"];
    $('#'+name).removeClass().addClass(((out ? outA[Math.floor(Math.random()*outA.length)]: inA[Math.floor(Math.random()*inA.length)])) + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        setTimeout(function()
        {
            if(out)
                $("#"+name).remove();
            else
                animate(name, true);
        }, 1000);
    });
};

var Tutorial = {

    enabled: false,

    index: -1,

    tasks: [
        {
            title: "Toto, I've a feeling we're not in Kansas anymore.",
            desc: "This terminal might look intimidating at first, but don't worry I'll hold your hand every step of the way.<br/>First let's check our surroundings.<br/>Use the <code>ls</code> command to 'list' all of the directories and files",
            check: function(com){
                return com.trim().split()[0] === "ls";
            }
        },
        {
            title: "Let's get out of this place",
            desc: "This place looks spooky, right? We should go somewhere safer.<br/>Let's change directories with the <code>cd</code> command. The <code>cd</code> command takes in a directory as an arguement, which will be your destination. When no argument is given it defaults to the user's home directory",
            check: function(com){
                return com.trim().split()[0] === "cd";
            }
        },
        {
            title: "Where are we now?",
            desc: "Use the <code>pwd</code> command to see where you are, <code>pwd</code> is short for 'print working directory'",
            check: function(com){
                return com.trim().split()[0] === "pwd";
            }
        },
        {
            title: "What time is it?",
            desc: "Use the <code>date</code> command to see what time it is",
            check: function(com){
                return com.trim().split()[0] === "date";
            }
        },
        {
            title: "RTFM!",
            desc: "One important thing to learn early on is how to use the manual. The manual for commands can be reached through the <code>man</code> command by supplying the name of the command as an arguement<br/>Check out the manual for <code>ls</code>",
            check: function(com){
                return com.trim() === "man ls";
            }
        },
        {
            title: "Let's create some directories",
            desc: "We create new directories with the <code>mkdir</code> command.<br/>Create the directory <code>dir</code><br/>Don't forget to read the manual if you get lost",
            check: function(com){
                return com.trim() === "mkdir dir";
            }
        },
        {
            title: "Alright, What about files?",
            desc: "We can create files with the <code>touch</code> command.<br/>Create the file <code>file</code>",
            check: function(com){
                return com.trim() === "touch file";
            }
        },
        {
            title: "Can we move it?",
            desc: "We can move files and directories with the <code>mv</code> command. <code>mv</code> takes a target and a destination as it's arguments.<br/>Move <code>file</code> to the directory you created earlier <code>dir</code>. Don't forget <code>man</code>",
            check: function(com){
                return com.trim() === "mv file dir";
            }
        },
        {
            title: "How can we read files?",
            desc: "Using the <code>less</code> command we can display the contents of a file.<br/>Try reading the <code>.history</code> file in your home directory. Note that this file is hidden due to the period at the begging of the file name. We can list all hidden files and regular files in a list like so <code>ls -la</code>",
            check: function(com){
                return com.trim() === "less .history";
            }
        },
        {
            title: "Let's make it do something cool",
            desc: "We can use the <code>echo</code> command to do some fun stuff. <code>echo</code> is used to print out any given text and it can take in variables as well. Try making it say hello to you like so <code>echo hello $USER</code>",
            check: function(com){
                return com.trim() === "echo hello $USER";
            }
        },
        {
            title: "Making variables",
            desc: "With the <code>export</code> command we can create our own variables. Try creating the variable age and assigning it to your age like so <code>export age = 18</code><br/>And try echoing it out now <code>echo I am $age</code>",
            check: function(com){
                return com.trim() === "echo I am $age";
            }
        },
        {
            title: "My fingers hurt",
            desc: "Let's say you wanted to create a shortcut of sorts to a command you used frequently, we could use the <code>alias</code> command to shorten the name of it like so <code>alias d = date</code>. Now when you type <code>d</code> the terminal will interpret it as <code>date</code>",
            check: function(com){
                return com.trim() === "alias d = date";
            }
        },
        {
            title: "Dear diary...",
            desc: "Unfortunatly Hlynux doesn't have a 'typical' editor, but we can still write to files.<br/>By using output redirection we can divert the standard input to a file using the <code>&gt;&gt;</code> directive. This appends the standard input to a file. Write something to the <code>file</code> we created earlier. When you've finished writing whatever you want press enter because it appends on every new line and then end the editing with <code>ctrl+c</code>",
            check: function(com){
                return com.trim() === ">> file";
            }
        },
        {
            title: "Check your privileges",
            desc: "Note that when you do <code>ls -la</code> you can see permissions for a file. If you look at the permissions of the file you just write to it would look like this <code>frwxr-xr-x</code>. Let's say we wanted everyone on the system to have write access to the file you just wrote to you would do <code>chmod 777 file</code>",
            check: function(com){
                return com.trim() === "chmod 777 file";
            }
        },
        {
            title: "Get owned",
            desc: "Similarly you can change the owner of a file with the <code>chown</code> command. Change the owner of <code>file</code> to <code>user</code>",
            check: function(com){
                return com.trim() === "chown user file";
            }
        },
        {
            title: "Links",
            desc: "If you navigate to the <code>/</code> directory you can see a couple of aqua colored directories with some arrows. Those files are links that direct you to other directories on the system. They can be created with the <code>ln</code> command. Create the link <code>test</code> that directs you to the <code>/home</code> directory. <code>ln home test</code>",
            check: function(com){
                return com.trim() === "ln home test";
            }
        },
        {
            title: "JavaScript",
            desc: "The <code>js</code> command allows you to run javascript within Hlynux. When given no arguements it executes a javascript interpreter. Press <code>ctrl+c</code> to quit. Here you can use the <code>print()</code> function to print out text to the terminal",
            check: function(com){
                return com.trim() === "js";
            }
        },
        {
            title: "JavaScript files",
            desc: "If you go to the <code>/bin</code> directory you will find a <code>test.js</code> file. You can run it with <code>js test.js</code>",
            check: function(com){
                return com.trim() === "js test.js";
            }
        },
        {
            title: "Let's create our own JavaScript files",
            desc: "We can create our own JavaScript programs by writing to a file like we did earlier, create the <code>program.js</code>, write what ever JavaScript you want and run it",
            check: function(com){
                return com.trim() === "js program.js";
            }
        },
    ],

    check: function(com){
        if(Tutorial.tasks[Tutorial.index].check(com))
        {
            var gratz = ["Gratz!!1", "Radical", "Nice", "Well Done", "Sweet", "Wow", "Fantastic", "Neat", "Swell", "Exquisite"]
            $("#gratz").remove();
            $("body").append("<h1 id='gratz'>"+gratz[Math.floor(Math.random()*gratz.length)]+"</h1>")
            $('#gratz').css({
                'font-size': '5rem',
                'float' : 'left',
                'position' : 'absolute',
                'left' : '45%',
                'top' : '44%'
            });
            animate("gratz");
            Tutorial.next();
        }
    },

    next: function(){
        Tutorial.index++;
        if(Tutorial.index === Tutorial.tasks.length)
        {
            $("#gratz").remove();
            $("body").append("<h1 id='gratz'>Congratulations<br/>You finished the Tutorial</h1>")
            $('#gratz').css({
                'font-size': '5rem',
                'float' : 'left',
                'position' : 'absolute',
                'left' : '45%',
                'top' : '44%'
            });
            animate("gratz");
            Tutorial.enabled = false;
            $("#tuts").hide();
        }
        else
            $("#tuts").html("<h4>"+Tutorial.tasks[Tutorial.index].title+"</h4><p>"+Tutorial.tasks[Tutorial.index].desc+"</p>");
    },

    init: function(){
        Tutorial.enabled = true;
        Tutorial.index = -1;
        $("#tuts").show();
        Tutorial.next();
    }
}
$(function() {
    $("#tuts").hide();
});
