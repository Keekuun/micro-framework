import ip from "ip"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default {
    port: {
        main: 40000,
        micro: 40001
    },

    host: ip.address(),
    __dirname
}
