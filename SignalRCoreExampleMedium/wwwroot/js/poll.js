"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/pollHub").build();
var chartBlock = '\u25A3'; //(U+25A3) is "▣" 

connection.on("ReceiveMessage", function (user, message, myChannelId, myChannelVal) {
    // alert("myChannelId=" + myChannelId + ",myChannelVal=" + myChannelVal);
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // var encodedMsg = user + " says " + msg;
    var pollResultMsg = user + " votou em '" + myChannelVal + "'.";

    // var liMessage = document.createElement("li");
    // liMessage.textContent = encodedMsg;
    // document.getElementById("messagesList").appendChild(liMessage);

    var ulPoll = document.getElementById("messagesList");
    var liPollResult = document.createElement("li");
    liPollResult.textContent = pollResultMsg;

    // append to top
    ulPoll.insertBefore(liPollResult, ulPoll.childNodes[0]);

    // append to end
    // document.getElementById("messagesList").appendChild(liPollResult);

    // append to chart block
    document.getElementById(myChannelId + 'Block').innerHTML += chartBlock;
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = ""; //document.getElementById("messageInput").value;
    //var myCaptain = document.getElementById("myCaptain").value;

    if (!user) {
        user = "[Anônimo]";
    }

    if ($('input:radio[name=myChannel]').is(':checked')) {
        var myChannelId = $('input[name=myChannel]:checked').attr('id');
        var myChannelVal = $('input[name=myChannel]:checked').val();
        connection.invoke("SendMessage", user, message, myChannelId, myChannelVal).catch(function (err) {
            return console.error(err.toString());
        });
    } else {
        return console.log("No captain selected.");
    }

    event.preventDefault();
});