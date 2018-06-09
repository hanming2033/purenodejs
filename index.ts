// dependencies: import from other modules
// these modules must export some object/method
import * as http from 'http'
import * as url from 'url'

// how http works
// 1. define what the server does with http module
// each time a request comes in, server will call the function with req and res object filled in
// req is a bunch of info about what user is asking for e.g. url
// res will be the object which returns by the server. this method manipulate the object
const server = http.createServer((req: http.ServerRequest, res: http.ServerResponse) => {
  if (!req || !req.url) return
  // url lib is to parse url
  // 1.get url and parse it
  // true: send the url to the query string module which returns url object
  const parsedUrl = url.parse(req.url, true)

  // 2.get path from url
  // returns the untrimmed path that the user requested 
  // path without the tld
  const path = parsedUrl.pathname
  // trim off the beining and ending slashes
  // localhost:3000/hello/world => hello/world
  const trimmedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''

  // get the query string as an object
  // disect query from url
  // localhost:3000/query?hello=world => { hello: 'world' }
  const qryStrObj = parsedUrl.query

  if (!req.method) return
  // get http method: get, post, put ...
  const method = req.method.toLocaleLowerCase()

  // TODO: continue headers
  // get headers as an object
  const headers = req.headers

  // 3.send response
  res.end('hello world\n')

  // 4.log the request path
  console.log(headers)
  console.log(method)
  console.log(qryStrObj)
})
// 2. tell server to listen on a port
server.listen(3000, () => console.log('Server is listening on 3000'))
