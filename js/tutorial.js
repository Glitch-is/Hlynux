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
    ],

    check: function(com){
        if(Tutorial.tasks[Tutorial.index].check(com))
        {
            //Display congratz
            console.log("You're one swood dude");
            Tutorial.next();
        }
    },

    next: function(){
        Tutorial.index++;
        if(Tutorial.index === Tutorial.tasks.length)
        {
            //Finished mesg?
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
