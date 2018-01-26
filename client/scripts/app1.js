var app = {
  init: function() {
    this.fetch(true);
  },
  send: function(m) {
    var message = m || new Message(getUserName(), getMessage(), getRoomname());
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
  fetch : function(displayStuf=false) {
    $.ajax( {
      type: 'GET',
      url: url,
      data: {
        skip: 1000,
        limit: 10000,
      },
      success: function(data) {
        var oldMessages = messages;
        messages = data.results;
        getRooms(data);
        if ( displayStuf ) {
          populateRoomsDropdown(rooms);
          app.renderMessage(filterMessages());
        }
        if ( oldMessages.length !== messages.length) {
          app.renderMessage(filterMessages());
        }
      }
    });
  },
  clearMessages : function() {
    $('#chats').empty();
  },
  renderMessage : function(arrayofMessages) {
    $('#chats').empty();
    arrayofMessages.forEach(function(message) {
      let $wrapper = $(`<div class='wrapper'></div>`);
      let $message = $(`<div class='message'></div><br>`);
      let $username = $(`<div class='username'><b></b></div>`);
      $message.text(message.text);
      $username.text(message.username);
      $wrapper.append($username);
      $wrapper.append($message);
      $('#chats').prepend($wrapper);
      $('.username').click( function() {

        if ( friends[$(this).text()] === undefined ) {
          friends[$(this).text()] = true;
        } else {
          delete friends[$(this).text()];
        }

        if ( friends.hasOwnProperty(message.username) ) {
          $(".username").filter( function(a, element) {
            return element.textContent === message.username;
          }).addClass('friend');
        } else {
          $(".username").filter( function(a, element) {
            return element.textContent === message.username;
          }).removeClass('friend');
        }
      // app.renderMessage();
      });
    });
  },
  renderRoom : function(roomname) {
    // Add a room to the room list
    // Refresh room list
  },
  refresh : function() {
    // Refresh messages/rooms only on change
    var oldMessages = messages;
    messages = this.fetch();
    if ( oldMessages.length !== messages.length) {
      populateRoomsDropdown(rooms);
      filterMessages();
      displayMessages(messages);
    }
  },
};

app.server = 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages';
let url = 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages';
let rooms = {};
let messages = [];
let friends = {};

class Message {
  constructor(username, text, roomname) {
    this.username = username;
    this.roomname = roomname;
    this.text = text;
  }
}

//Once when page is loaded
//Once change in roomName

$('select').change(function() {
  let newRoomname = '';
  $('#chats').empty();
  if ( getRoomname() === 'new room...') {
    newRoomname = prompt('Type your new room name');
    $('select').append($(`<option></option>`).text(newRoomname));
    $('select').val(newRoomname);
  }
  renderMessage(filterMessages());
});



let filterMessages = function() {
  return messages.filter(message => message.roomname === getRoomname());
};

let getRoomname = function() {
  return $('select').val();
};

window.getUserName = function() {
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
  // debugger
  currentRoom = getRoomname();
  $('select').empty();
  for ( var prop in rooms ) {
    if ( prop !== '' ) {
      $('select').append($(`<option></option>`).text(prop));
    }
  }
  $('select').append($(`<option>new room...</option>`));
  // debugger
  currentRoom = currentRoom || rooms.lobby;
  $('select').val(currentRoom);
};

$('#submit').click( function() {
  app.send();
  app.fetch(true);
  $('#input').val('');
});



app.init();


setInterval(function(){
  app.fetch();
}, 5000);
