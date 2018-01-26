var app = {
  init: function() {
    this.fetch().then(function() {
      app.getRooms(app.messages);
      app.rooms.forEach(function(room) {
        app.renderRoom(room);
      });
      app.renderAllMessagesForSelectedRoom();
      app.listenToSelectChange();
      app.lestenToSubmitMessage();
      app.listenToUsernameClick();
    });
    setInterval(function(){
      app.refresh();
    }, 7000);
  },
  server: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
  messages: [],
  rooms: [],
  send: function(message) {
    $.ajax({
      url: this.server,
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
  fetch: function() {
    return $.ajax( {
      type: 'GET',
      url: this.server,
      data: {
        skip: 1000,
        limit: 10000,
      },
      success: function(data) {
        app.messages = data.results;
        // return data.results;
      }
    });
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  renderMessage: function(message) {
    let $wrapper = $(`<div class='wrapper'></div>`);
    let $message = $(`<div class='message'></div><br>`);
    let $username = $(`<div class='username'><b></b></div>`);
    let unText = decodeURI("@" + message.username);
    if ( app.friends[unText] ) {
      $message.addClass('friend');
    }
    $message.text(message.text, message.username);
    $username.text(unText);
    $wrapper.append($username, $message);
    if ( message.username !== '' && message.text !== '' ) {
      $('#chats').prepend($wrapper);
    }
  },
  getRooms: function(messages) {
    messages.forEach(function(message) {
      if ( app.rooms.indexOf(message.roomname) === -1 && message.roomname ) {
        app.rooms.push(message.roomname);
      }
    });
  },
  renderRoom: function(roomname) {
    $('#roomSelect').append($(`<option></option>`).text(roomname));
  },
  renderAllMessagesForSelectedRoom: function(){
    app.clearMessages();
    if ( $('select').val() === 'new room...' ) {
      $('select').val(app.rooms[0]);
    }
    app.messages.filter(function(message) {
      return message.roomname === $('select').val();
    }).forEach(function(message) {
      app.renderMessage(message);
    });
  },
  listenToSelectChange: function() {
    $('select').change(function() {
      if ( $('select').val() === 'new room...' ) {
        var newRoomName = prompt('type new room name...');
        if ( newRoomName !== null ) {
          app.rooms.push(newRoomName);
          app.renderRoom(newRoomName);
          $('select').val(newRoomName);
        }
      }
      app.renderAllMessagesForSelectedRoom();
      app.listenToUsernameClick();
    });
  },
  lestenToSubmitMessage: function() {
    $('#submit').click( function() {
      var message = app.makeMessage();
      app.renderMessage(message);
      app.send(message);
      $('#input').val('');
      app.refresh();
    });
  },
  getRoomname: function() {
    return $('select').val();
  },
  getUserName: function() {
    return window.location.search.split('=')[1];
  },
  getText: function() {
    return $('#input').val();
  },
  makeMessage: function() {
    var m = {};
    m.roomname = app.getRoomname();
    m.username = app.getUserName();
    m.text = app.getText();
    return m;
  },
  refresh: function() {
    var oldRooms = app.rooms.slice();
    app.fetch().then(function(data) {
      var b = data.results;
      app.getRooms(b);
      if ( oldRooms.length !== app.rooms.length ) {
        app.rooms.forEach(function(room) {
          app.renderRoom(room);
        });
      }
      app.renderAllMessagesForSelectedRoom();
      app.listenToUsernameClick();
    });
  },
  listenToUsernameClick: function() {
    $('.username').on( 'click', app.handleUsernameClick );
  },
  friends: {},
  handleUsernameClick: function() {
    var un = $(this).text();
    if ( app.friends[un] === undefined) {
      app.friends[un] = 1;
    } else {
      delete app.friends[un];
    }
    app.renderAllMessagesForSelectedRoom();
    app.listenToUsernameClick();
  }
};

app.init();