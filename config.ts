const environments: IEnvironments = {
  staging: { port: 3000, envName: 'staging' },
  production: { port: 5000, envName: 'production' }
}

// determin which envrionment was passed as command-line arguments
const currentEnv = typeof process.env.NODE_ENV === 'string' ? environments[process.env.NODE_ENV.toLowerCase()] : environments.staging

export default currentEnv

interface IEnvironment {
  port: number
  envName: string
}

interface IEnvironments {
  [key: string]: IEnvironment
}
