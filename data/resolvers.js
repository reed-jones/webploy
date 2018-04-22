import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default {
  Query: {
    allUsers: (parent, { username }, { models }) => models.User.findAll(),
    me: (parent, { username }, { models, user }) => {
      if (user) {
        return models.User.findOne({
          where: {
            id: user.id,
          },
        })
      }
      // not logged in
      return null
    },
  },

  Mutation: {
    updateUser: (parent, { username, newUsername }, { models }) =>
      models.User.update({ username: newUsername }, { where: { username } }),
    deleteUser: (parent, args, { models }) =>
      models.User.destroy({ where: args }),
    register: async (parent, args, { models }) => {
      const user = args
      user.password = await bcrypt.hash(user.password, 12)
      return models.User.create(user)
    },
    login: async (parent, { email, password }, { models, secret }) => {
      const user = await models.User.findOne({ where: { email } })
      if (!user) {
        throw new Error('No user with that email')
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Incorrect Password')
      }

      const token = jwt.sign(
        {
          user: { id: user.id, username: user.username },
        },
        secret, // replace with cert
        {
          expiresIn: '1y',
        },
      )
      return token
    },
  },
}
