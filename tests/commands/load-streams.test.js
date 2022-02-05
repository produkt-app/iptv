const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

beforeEach(() => {
  fs.emptyDirSync('tests/__data__/output')
  fs.emptyDirSync('tests/__data__/temp')
  fs.copyFileSync('tests/__data__/input/channels.db', 'tests/__data__/temp/channels.db')

  const stdout = execSync(
    'DB_FILEPATH=tests/__data__/temp/channels.db LOGS_PATH=tests/__data__/output/logs node scripts/commands/load-streams.js --cluster-id=1 --timeout=1',
    { encoding: 'utf8' }
  )
})

it('return results', () => {
  let output = content('tests/__data__/output/logs/load-streams/cluster_1.log')
  let expected = content('tests/__data__/expected/logs/load-streams/cluster_1.log')

  expect(output).toEqual(expected)
})

function content(filepath) {
  const data = fs.readFileSync(path.resolve(filepath), {
    encoding: 'utf8'
  })

  return data
    .split('\n')
    .filter(l => l)
    .map(l => {
      return JSON.parse(l)
    })
}
