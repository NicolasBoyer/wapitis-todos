import { UTILS } from 'wapitis'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CONSTANT: Record<string, unknown> = {}

CONSTANT.DATASKEY = 'wapitis-todosTest-datas'
CONSTANT.DATAS = UTILS.load(CONSTANT.DATASKEY as string)
