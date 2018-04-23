import gql from 'graphql-tag'

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    verified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Site {
    id: Int!
    url: String!
    repo: String!
    build_command: String!
    public_directory: String!
  }

  type Query {
    allUsers: [User!]!
    me: User
    mySites: [Site!]!
  }

  type Mutation {
    updateUser(username: String!, newUsername: String!): [Int!]!
    deleteUser(username: String!): Int!
    register(username: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
    addSite(
      url: String!
      repo: String!
      build_command: String!
      public_directory: String!
    ): Site!
    buildSite(id: Int!): String!
  }
`
