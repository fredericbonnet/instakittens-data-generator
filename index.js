/**
 * JSON database generator for the Instakittens project.
 */
const fs = require('fs');
const faker = require('faker');

/** Unsplash photo database */
const images = require('./images.json');

// Uncomment to set a seed for deterministic results
faker.seed(123);

const DB_FILE = 'db.json';
const ACCOUNTS_FILE = 'accounts.json';

const NB_USERS = 20;
const MAX_ALBUMS_PER_USER = 10;
const MAX_PHOTOS_PER_ALBUM = 20;
const MAX_COMMENTS_PER_PHOTO = 10;

const ALBUM_TYPES = ['PUBLIC', 'RESTRICTED', 'PRIVATE'];

/** Accounts for authentication */
const accounts = [];

/** Users */
const users = [];

/** Albums */
const albums = [];

/** Photos */
const photos = [];

/** Comments */
const comments = [];

// Create admin account
const admin = {
  username: 'admin',
  password: faker.internet.password(),
  role: 'admin',
};
accounts.push(admin);

// Create users and accounts
for (let i = 0; i < NB_USERS; i++) {
  // User data
  const id = users.length + 1;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = `${firstName}.${lastName}`;
  const password = faker.internet.password();
  const email = `${username}@${faker.internet.domainName()}`;
  const avatar = faker.image.avatar();

  // Add to user list
  const user = {
    id,
    username,
    firstName,
    lastName,
    email,
    avatar,
  };
  users.push(user);

  // Add to accounts
  const account = {
    userId: id,
    username,
    password,
    role: 'user',
  };
  accounts.push(account);

  // Create albums
  const nbAlbums = faker.random.number({ min: 1, max: MAX_ALBUMS_PER_USER });
  for (let i = 0; i <= nbAlbums; i++) {
    // Album data
    const id = albums.length + 1;
    const user_id = user.id;
    const title = faker.lorem.sentence(4).slice(0, -1);
    const type = faker.random.arrayElement(ALBUM_TYPES);
    const description = faker.lorem.sentence(10);

    // Add to album list
    const album = { id, user_id, title, type, description };
    albums.push(album);

    // Create photos
    const nbPhotos = faker.random.number({ min: 1, max: MAX_PHOTOS_PER_ALBUM });
    for (let i = 0; i <= nbPhotos; i++) {
      // Photo data
      const id = photos.length + 1;
      const album_id = album.id;
      const title = faker.lorem.sentence(4).slice(0, -1);
      const url = faker.random.arrayElement(images);
      const date = faker.date.past();
      const description = faker.lorem.sentence(10);

      // Add to photo list
      const photo = { id, album_id, title, url, date, description };
      photos.push(photo);

      // Create comments
      const nbComments = faker.random.number({
        min: 1,
        max: MAX_COMMENTS_PER_PHOTO,
      });
      for (let i = 0; i <= nbComments; i++) {
        // Comment data
        const id = comments.length + 1;
        const photo_id = photo.id;
        const user_id = faker.random.number({ min: 1, max: NB_USERS });
        const relDate = faker.random.number({ max: 1000 * 60 * 60 * 24 * 7 }); // one week
        const date = new Date(photo.date.getTime() + relDate);
        const message = faker.lorem.sentences();

        // Add to comment list
        const comment = { id, photo_id, user_id, date, message };
        comments.push(comment);
      }
    }
  }
}

// Output database file
const db = { users, albums, photos, comments };
fs.writeFileSync(DB_FILE, JSON.stringify(db, undefined, 2));

// Output accounts file
fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, undefined, 2));
