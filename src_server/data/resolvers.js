import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { deploy } from '../deploymentActions'

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
    mySites: (parent, args, { models, user }) => {
      return models.Site.findAll({ where: { UserID: user.id } })
    },
  },

  Mutation: {
    updateUser: (parent, { username, newUsername }, { models }) =>
      models.User.update({ username: newUsername }, { where: { username } }),
    deleteUser: (parent, args, { models }) =>
      models.User.destroy({ where: args }),
    register: async (parent, args, { models, secret }) => {
      const user = args
      user.password = await bcrypt.hash(user.password, 12)
      user.verified = false
      await models.User.create(user)
      return jwt.sign(
        {
          user: { id: user.id },
        },
        secret, // replace with cert
        {
          expiresIn: '1y',
        },
      )
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

      return jwt.sign(
        {
          user: { id: user.id },
        },
        secret, // replace with cert
        {
          expiresIn: '1y',
        },
      )
    },
    addSite: async (parent, args, { models, user }) => {
      const site = await models.Site.create(args)
      site.setUser([user.id])
      return site
    },
    buildSite: async (parent, { id }, { models, user }) => {
      const site = await models.Site.findOne({ where: { id, UserId: user.id } })
      // if user is owner of website,
      // deploy build
      if (site) {
        deploy({ clone_url: site.repo, project: site.url })
      }
      return 1
    },
  },
}
