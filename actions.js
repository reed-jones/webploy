import execa from 'execa'
import fs from 'fs'

// get/set defaults from .env file
const {
  WEB_ROOT = '/var/www/auto-deploy',
  TEMP_OUTPUT_DIR = '/var/www/temp',
} = process.env

// run full deploy script
export const deploy = async ({ baseUrl, user, project }) => {
  // get extra details from package.json after pull
  let config = {
    baseUrl,
    user,
    project,
    webRoot: WEB_ROOT,
    tempOutputDir: TEMP_OUTPUT_DIR,
  }

  try {
    // decide to clone or pull repo
    await cloneOrPull(config)

    // get rest of config from package.json
    config = await updateConfig(config)

    // install nodejs deps
    await installNodeDependencies(config)

    // run build script
    await buildProject(config)

    // move to production directory
    await moveProject(config)

    console.log('Everything is complete!')
  } catch (err) {
    console.log(err)
    console.log('Could Not Deploy')
  }
}

export const cloneOrPull = async ({
  baseUrl,
  tempOutputDir,
  webRoot,
  user,
  project,
}) => {
  let project_already_exists = fs.existsSync(`${tempOutputDir}/${project}`)

  try {
    if (project_already_exists) {
      await pullProject({ tempOutputDir, webRoot, user, project })
    } else {
      await cloneProject({ tempOutputDir, baseUrl, webRoot, user, project })
    }
  } catch (err) {
    throw err
  }
}

export const pullProject = async ({ tempOutputDir, user, project }) => {
  console.log('Pulling Project')
  try {
    await execa.shell(`cd ${tempOutputDir}/${project} && git pull`)
    console.log('Project pulled successfully')
  } catch (err) {
    console.log('could not pull project')
    throw err
  }
}

export const cloneProject = async ({
  baseUrl,
  tempOutputDir,
  user,
  project,
}) => {
  console.log('Cloning Project')
  try {
    await execa.shell(
      `git clone ${baseUrl}/${user}/${project} ${tempOutputDir}/${project}`,
    )
    console.log('Project cloned successfully')
  } catch (err) {
    console.log('could not clone project')
    throw err
  }
}

export const updateConfig = async config => {
  let { webploy_config } = require(`${config.tempOutputDir}/${
    config.project
  }/package.json`)

  if (!webploy_config) {
    throw 'Dist_Dir could not be found'
  }
  return { ...config, ...webploy_config }
}

export const installNodeDependencies = async ({ tempOutputDir, project }) => {
  console.log('Installing Dependencies')
  try {
    await execa.shell(`cd ${tempOutputDir}/${project} && yarn install`)
    console.log('Node modules installed')
  } catch (err) {
    console.log('could not install node dependencies')
    throw err
  }
}

export const buildProject = async ({
  tempOutputDir,
  project,
  build_script,
}) => {
  console.log('Building Project')
  try {
    await execa.shell(`cd ${tempOutputDir}/${project} && yarn ${build_script}`)
    console.log('project built')
  } catch (err) {
    console.log('Could not build project')
    throw err
  }
}

export const moveProject = async ({
  webRoot,
  tempOutputDir,
  project,
  dist_dir,
}) => {
  // check if production version already exists
  if (fs.existsSync(`${webRoot}/${project}`)) {
    try {
      console.log('moving existing deployment')
      await moveDirectory({
        oldDir: `${webRoot}/${project}`,
        newDir: `${webRoot}/${project}_${new Date().getTime()}`,
      })
    } catch (err) {
      console.log('could not move existing deployment')
      throw err
    }
  }

  try {
    console.log('moving new build')
    await moveDirectory({
      oldDir: `${tempOutputDir}/${project}/${dist_dir}`,
      newDir: `${webRoot}/${project}`,
    })
  } catch (err) {
    console.log('could not move new build')
  }
}

export const moveDirectory = async ({ oldDir, newDir }) => {
  console.log('moving build')
  try {
    await execa('mv', [`${oldDir}`, `${newDir}`])
    console.log('project moved')
  } catch (err) {
    console.log('could not move build')
    throw err
  }
}
