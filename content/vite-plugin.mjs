// Vite plugin for the YAML content in /content (edited in Pages CMS).
//  - `virtual:content` exports site settings, policies and a card-sized summary of every visible cabin.
//  - Each content/cabins/*.yml file becomes a module exporting the full cabin (loaded per page, so
//    galleries and long copy are code-split and never land in the shared bundle).
// A hidden cabin (hidden: true) is left out of the summaries, so no page or card is built for it.
import path from 'node:path'
import {
  CABINS_DIR,
  CONTENT_DIR,
  cabinSummary,
  listCabinFiles,
  loadCabins,
  loadPolicies,
  loadSettings,
  readCabin,
} from './lib.mjs'

const VIRTUAL = 'virtual:content'
const RESOLVED = '\0' + VIRTUAL

export default function contentPlugin() {
  return {
    name: 'happy-hocking-content',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    load(id) {
      if (id === RESOLVED) {
        this.addWatchFile(CONTENT_DIR)
        for (const f of listCabinFiles()) this.addWatchFile(f)
        const data = { settings: loadSettings(), policies: loadPolicies(), cabins: loadCabins().map(cabinSummary) }
        return `export default ${JSON.stringify(data)}`
      }
      const file = id.split('?')[0]
      if (file.endsWith('.yml') && path.resolve(file).startsWith(CABINS_DIR)) {
        return `export default ${JSON.stringify(readCabin(file))}`
      }
    },
    handleHotUpdate(ctx) {
      if (ctx.file.startsWith(CONTENT_DIR)) {
        const mod = ctx.server.moduleGraph.getModuleById(RESOLVED)
        if (mod) ctx.server.moduleGraph.invalidateModule(mod)
        ctx.server.ws.send({ type: 'full-reload' })
      }
    },
  }
}
