var app = {
  init: function() {},
  send: function() {
    var message = new Message(getUserName(), getMessage(), getRoomname());
    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
};
let url = 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages';
let rooms = {};

class Message {
  constructor(username, text, roomname) {
    this.username = username;
    this.roomname = roomname;
    this.text = text;
  }
}

//TODO:
var escapingFunction = function(txt) {

};

// MESSAGES
var getMessages = function() {
  $.ajax( {
    type: 'GET',
    url: url,
    data: {
      skip: 1000,
      limit: 10000,
    },
    success: function(data) {
      getRooms(data);
      populateRoomsDropdown(rooms);
      data.results.forEach(function(message) {
        console.log(message);
        let $message = $(`<div class='message'></div><br>`);
        $message.text(message.text);
        $('#chats').append($message);
      });
    // }
    }
  });
};

let getRoomname = function() {
  return $('select').val();
};

let getUserName = function() {
  return window.location.search.split('=')[1];
};

let getMessage = function(){
  return $('#input').val();
};

// ROOMS
let getRooms = function(messages) {
  messages.results.forEach(function(message) {
    rooms[message.roomname] = message.roomname;
  });
};

let populateRoomsDropdown = function(rooms) {
  for(var prop in rooms) {
    if(prop !== '') {
      $('select').append(`<option>${prop}</option>`);
    }
  }
};

$('#submit').click( function() {
  app.send();
});
getMessages();

// createdAt :"2017-11-14T18:54:20.222Z"
// objectId :"JHYrvf4FzC"
// roomname :"lobby"
// text :"first"
// updatedAt :"2017-11-14T18:54:20.222Z"
// username :"dan"
