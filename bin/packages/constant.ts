import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const DEBS_PATH = path.join(__dirname, '../../public/repo/debs')
export const PACKAGES_DIR = path.join(__dirname, '../../public/repo/packageInfo')

export const BASE_URL = 'https://ginsu.dev'
