import gql from 'graphql-tag'

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`
export const REGISTER_MUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
    }
  }
`
export const ADD_SITE_MUTATION = gql`
  mutation(
    $url: String!
    $repo: String!
    $build_command: String!
    $public_directory: String!
  ) {
    addSite(
      url: $url
      repo: $repo
      build_command: $build_command
      public_directory: $public_directory
    ) {
      id
      url
    }
  }
`

export const BUILD_SITE_MUTATION = gql`
  mutation($id: Int!) {
    buildSite(id: $id)
  }
`
