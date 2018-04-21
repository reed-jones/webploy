import { deploy } from './actions'

export const GitHub = ({ event, params }) => {
  switch (event) {
    case 'push':
      deploy({ baseUrl: 'https://github.com', ...params })
      break
  }
}

export const GitLab = ({ event, params }) => {
  // TODO
}

export const BitBucket = ({ event, params }) => {
  // TODO
}
