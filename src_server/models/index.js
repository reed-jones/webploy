import Sequelize from 'sequelize'

const {
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOSTNAME,
  DB_DIALECT,
} = process.env

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOSTNAME,
  dialect: DB_DIALECT,
  operatorsAliases: Sequelize.Op,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
})

const db = {
  User: sequelize.import('./user'),
  Site: sequelize.import('./site'),
}

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
