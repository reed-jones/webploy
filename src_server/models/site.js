export default (sequelize, DataTypes) => {
  const Site = sequelize.define('Site', {
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    repo: {
      type: DataTypes.STRING,
    },
    build_command: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    public_directory: {
      type: DataTypes.STRING,
      defaultValue: '/',
    },
  })

  Site.associate = models => {
    models.Site.belongsTo(models.User)
  }

  return Site
}
