import { deploy } from './deploymentActions'

export const GitHub = (req, res) => {
  const event = req.get('X-Github-Event')
  // const params
  const { name, owner, clone_url } = req.body.repository

  switch (event) {
    case 'push':
      deploy({ clone_url, project: name })
      res.sendStatus(200)
      break
    default:
      res.sendStatus(500)
  }
}

export const GitLab = ({ event, params }) => {
  // TODO
}

export const BitBucket = ({ event, params }) => {
  // TODO
}
