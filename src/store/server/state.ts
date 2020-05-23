export interface State {
  serverStatus: 'down' | 'starting' | 'up'
  runServer: boolean
}

export default function(): State {
  return {
    serverStatus: 'down',
    runServer: true // ? set as a param as well ?
  }
}
