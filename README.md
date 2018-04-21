# WebPloy

My github autodeploy service for static sites. Some DevOps required.

WebPloy exposes api endpoints to be used with github webhooks. Currently WebPloy only respondes to GitHub push events, however more [events](https://developer.github.com/webhooks/) are planned for the future, as well as potentially adding other providers, such as GitLab and BitBucket. WebPloy, currently doesn't touch your webserver config either, so that is where your own DevOps comes into play. All WebPloy does is clone/pull a project from github, install the needed node dependencies, run the build script specified in your projects package.json following the example below, and move the built project into your specified web_root directory (making a backup of the existing directory if it exists, of course).

To get started, add

```js
//package.json
{
  ...
  ...
  "scripts": {
    "build": "parcel build index.html --public-url /"
  },
  ...
  ...
  "webploy_config": {
    "build_script": "build",
    "dist_dir": "dist"
  }
}
```

_NOTE: your build_script command can be any npm script, so pick the one that minifies/compiles your assets etc. The dist_dir is wherever your completed build is saved to._

The Webhook URL to register with github, is `your-deploy-domain.tld/<username>/<project-repo>`
