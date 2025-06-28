import codeCoverageTask from '@cypress/code-coverage/task'
import { PluginConfig }  from 'cypress'                // aide au typage facultative

const pluginConfig: PluginConfig = (on, config) => {
  // ① enregistre les tâches (coverage:collect, coverage:report, …)
  codeCoverageTask(on, config)

  // ② toujours renvoyer *config* (et non le résultat de la fonction)
  return config
}

export default pluginConfig
