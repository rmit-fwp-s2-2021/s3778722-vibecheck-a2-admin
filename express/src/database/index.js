const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");
const user = require("./models/user.js");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
  port: config.PORT,
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.comment = require("./models/comment.js")(db.sequelize, DataTypes);
db.postLike = require("./models/postLike.js")(db.sequelize, DataTypes);
db.commentLike = require("./models/commentLike.js")(db.sequelize, DataTypes);
db.follow = require("./models/follow.js")(db.sequelize, DataTypes);

// Relate post and user.
db.user.hasMany(db.post, { onDelete: "cascade", hooks: true });
db.post.belongsTo(db.user);

db.user.hasMany(db.comment, { onDelete: "cascade", hooks: true });
db.post.hasMany(db.comment, { onDelete: "cascade", hooks: true });

db.post.hasMany(db.postLike, { onDelete: "cascade", hooks: true });
db.postLike.belongsTo(db.post, {
  onDelete: "cascade",
});
db.postLike.belongsTo(db.user, {
  onDelete: "cascade",
});

db.comment.hasMany(db.commentLike, { onDelete: "cascade", hooks: true });
db.comment.belongsTo(db.user, {
  onDelete: "cascade",
});
db.comment.belongsTo(db.post, {
  onDelete: "cascade",
});

db.commentLike.belongsTo(db.comment, {
  onDelete: "cascade",
});
db.commentLike.belongsTo(db.user, {
  onDelete: "cascade",
});

db.follow.belongsTo(db.user, { foreignKey: "userEmail" });

db.follow.belongsTo(db.user, { foreignKey: "followEmail" });
db.user.hasMany(db.follow);
// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });

  //await seedData();
};
/*
async function seedData() {
  const count = await db.user.count();

  // Only seed data if necessary.
  if (count > 0) return;

  const argon2 = require("argon2");

  let hash = await argon2.hash("abc123", { type: argon2.argon2id });
  await db.user.create({
    username: "mbolger",
    password_hash: hash,
    first_name: "Matthew",
    last_name: "Bolger",
  });

  hash = await argon2.hash("def456", { type: argon2.argon2id });
  await db.user.create({
    username: "shekhar",
    password_hash: hash,
    first_name: "Shekhar",
    last_name: "Kalra",
  });
}
*/
module.exports = db;
