export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
  })

  User.associate = models => {
    models.User.hasMany(models.Site)
  }

  return User
}
