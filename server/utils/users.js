// [{
//   id: 'dfni4uhfshfkjnze',
//   name: 'Jdub',
//   room: 'My Room'
// },
// {

// }]

//addUser(id, name, room)
//removeUser(id)
//getUser(id)
//getUserList(room)

class Users {
  constructor () {
    this.users = [];
  }
  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    var found = this.getUser(id);

    if (found) {
      this.users = this.users.filter((user) => {
        return user.id !== id;
      });
    }
    return found;
  }
  getUser(id) {
    var found = this.users.filter((user) => {
      return user.id === id;
    });
    return found[0];
  }
  getUserList(room) {
    var filtered = this.users.filter((user) => {
      return user.room === room;
    });
    var namesArray = filtered.map((user) => {
      return user.name;
    });

    return namesArray;
  }
}

module.exports = {Users};

// class Person {
//   constructor (id, name, room) {
//     this.id = id;
//     this.name = name;
//     this.room = room;
//   }
//   getUserDescription() {
//     return `${this.id}`;
//   }
// }

// var me = new Person('sdjkfbwh4w34ads', 'Jdub', 'My Room');

// console.log(me);