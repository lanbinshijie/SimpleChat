import express from 'express'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import { createTable } from './database/create'
import { accountExists, getAccountByPassword } from './database/functions'
import { get } from 'http'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

createTable()

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  const Authorization = req.header('Authorization')
  const token = Authorization?.replace('Bearer ', '').trim()
  let userAccount = token
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    },
    userAccount)
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  // 获取Key对应的用户
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  const Authorization = req.header('Authorization')
  const token = Authorization?.replace('Bearer ', '').trim()
  let userAccount = token
  try {
    const response = await chatConfig(userAccount)
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    const AvailableUser = JSON.parse(process.env.AVAILABLE_USERS)
    let username = 'Teacher'

    if (!token)
      throw new Error('Secret key is empty')
    if (await accountExists(token)){
      let user = await getAccountByPassword(token);
      console.log(user);
      // @ts-ignore
      username = user.accountName;
    } else {
      throw new Error('密钥无效 | Secret key is invalid')
    }

    res.send({ status: 'Success', message: '鉴权成功！欢迎'+username+'！', data: username })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(5005, () => globalThis.console.log('Server is running on port 3002'))
