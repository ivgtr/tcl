import program from 'commander'
import Nedb from 'nedb'

import tweet from './commands/tweet'
import { Login, Logout } from './commands/oauth'

const path = `${__dirname}/configs/database`

const main = async (): Promise<void> => {
  const db = await new Nedb({
    filename: path,
    autoload: true
  })

  const userCheck = await new Promise((resolve) => {
    db.findOne({ selected: true }, (err, doc) => {
      if (!doc) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })

  if (!userCheck) {
    await Login(db)
    return
  }

  program
    .option('-l, --login', 'ログインする')
    .option('-lo, --logout', 'ログアウトする')
    .option('-t, --tweet [tweet]', 'ツイートする')
    .option('-tl, --timeline', 'タイムラインを取得します')
    .option('-c, --console', 'testだよ')
    .parse(process.argv)

  if (program.login) Login(db)
  if (program.logout) Logout(db, path)
  if (program.tweet) {
    if (typeof program.tweet === 'string') {
      tweet(db, program.tweet)
      return
    }
    tweet(db, '')
    return
  }
  if (program.timeline) {
    console.log('未実装')
  }
  if (program.console) {
    console.log('機能のテスト')
    db.find({ selected: true }, async (err, result) => {
      if (result.length) {
        console.log(`現在のユーザーは: ${result.slice(-1)[0].name}`)
      } else {
        console.log('ログインしていません')
      }
    })
  }
  // For default, show help
  const NO_COMMAND_SPECIFIED = process.argv.length <= 2
  if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help()
  }
}

export default main
