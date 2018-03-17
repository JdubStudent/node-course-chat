const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Joel',
      room: 'Node'
    },
    {
      id: '2',
      name: 'Bob',
      room: 'Node'
    },
    {
      id: '3',
      name: 'Steve',
      room: 'Node'
    }];
  });

  it('should create a new Users', () => {
    var testUsers = new Users();
    var user = {
      id: '123asd',
      name: 'Bob',
      room: 'Node'
    };
    var res = testUsers.addUser(user.id, user.name, user.room);

    expect(testUsers.users).toEqual([user]);
  });

  it('should return a list of names', () => {
    var userList = users.getUserList('Node');

    expect(userList).toEqual(['Joel','Bob','Steve']);
  });

});