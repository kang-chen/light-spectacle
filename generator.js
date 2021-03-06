"use strict";

let generator = () => {

  let con = console;

  let events = {
    // COMMENT: "COMMENT"
    // SIGNUP: "SIGNUP",
    // TASK_ASSIGN: "TASK_ASSIGN",
    // TASK_COMPLETE: "TASK_COMPLETE",
    // TASK_POST: "TASK_POST"
    TASK: "TASK"
  }
	let makeName = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
	}
  let initPusher = (options) => {

    let onEvent = options.onEvent;

    if (options.random) {
      con.log("Generator - running in random mode! Pusher is not connected!");
      let doIt = () => {
        var keys = Object.keys(events);
        var key = keys[Math.floor(keys.length * Math.random())];
        var ev = events[key];
        onEvent(ev, {
          // fake model
          id: Math.floor( Math.random() * 100),
          name: makeName(),
          coments : Math.floor( Math.random() * 10),
          assigned : false,
        });
        setTimeout(doIt, 100 + Math.random() * 16000);
      }
      return setTimeout(doIt, 1000);
    }

    con.log("Generator - initPusher");

    let channelName = 'public-notifications';

    let pusher = new Pusher(config.pusherToken, {
      authEndpoint: config.pusherEndPoint,
      encrypted: true
    });

    Pusher.log = onEvent;

    let channel = pusher.subscribe(channelName);
    channel.bind('pusher:subscription_error', (status) => {
      onEvent("pusher:subscription_error", status);
    });
    channel.bind('pusher:subscription_succeeded', (data) => {
      channel.bind('new_task_posted', (data) => {
        onEvent(events.TASK_POST, data);
      });
    });
  }

  return {
    init: initPusher
  }

}
