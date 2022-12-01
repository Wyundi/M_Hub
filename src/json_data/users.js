const {ObjectId} = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcryptjs = require('bcryptjs');
const helpers = require('../helpers')
const saltRounds = 12;

const createUser = async (
  username, password
) => {
  if (!username || !password) throw 'Error: please enter a username or password';
  username = helpers.checkUserName(username);
  password = helpers.checkPassword(password);

  const userCollection = await users();
  const userFound = await userCollection.findOne({username: {$regex: username, $options: 'i'}});
  if (userFound) throw 'Error: the username is already used';

  const hash = await bcryptjs.hash(password, saltRounds);
  let newUser = {
    username: username,
    password: hash
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if(insertInfo.insertedCount === 0) throw 'Error: user add failed';

  const newId = insertInfo.insertedId.toString();
  const user = await getUser(newId);
  if (user) return true;
};

const checkUser = async (username, password) => {
  if (!username || !password) throw 'Error: please enter a username or password';
  username = helpers.checkUserName(username);
  password = helpers.checkPassword(password);

  const userCollection = await users();
  const userFound = await userCollection.findOne({username: {$regex: username, $options: 'i'}});
  if(userFound === null) throw 'Error: username or password is invalid';

  let compareToMatch = false;
  try {
    compareToMatch = await bcryptjs.compare(password, userFound.password);
  } catch (e) {
    //no op
  }

  if (compareToMatch) {
    return {authenticated: true};
  } else throw 'Error: password is not valid'
};

async function getUser(id) {
  id = ObjectId(id);
  const userCollection = await users();
  const userFound = await userCollection.findOne({_id: id});
  if (userFound === null) throw 'Error: no user found with that id';
  return userFound;
}

module.exports = {
  createUser,
  checkUser
};
