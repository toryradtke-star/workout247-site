import { defineCliConfig } from 'sanity/cli'
import { dataset, projectId } from './sanity/env'

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: 'workout247',
  autoUpdates: false,
})
