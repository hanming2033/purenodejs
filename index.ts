// dependencies: import from other modules
// these modules must export some object/method
import * as http from 'http'
import * as url from 'url'

import { StringDecoder } from 'string_decoder'
import { ParsedUrlQuery } from 'querystring'

const server = http.createServer((req: http.ServerRequest, res: http.ServerResponse) => {
  if (!req || !req.url || !req.method) return
  const parsedUrl = url.parse(req.url, true)

  const path = parsedUrl.pathname

  const trimmedPath = path ? path.replace(/^\/+|\/+$/g, '') : ''

  const qryStrObj = parsedUrl.query

  const method = req.method.toLocaleLowerCase()

  const headers = req.headers

  const decoder = new StringDecoder('utf8')
  let stream = ''
  req.on('data', (data: Buffer) => {
    stream += decoder.write(data)
  })

  req.on('end', () => {
    stream += decoder.end()

    // choose the resolver this request should go to, default is notFound
    const resolve: resolver = router[trimmedPath] ? router[trimmedPath] : router.notFound
    // construct data object(from the path, headers... derived above) to send to the resolver
    const data: IDataFromReq = { trimmedPath, qryStrObj, method, headers, payload: stream }
    // route the request to the resolver specified in the router
    const { statusCode, result } = resolve(data)
    // convert the result into a string
    // result here is the result we send to user
    const resultStr = JSON.stringify(result)
    // return the response: header & result
    res.setHeader('Content-Type','application/json')
    res.writeHead(statusCode)
    res.end(resultStr)
    console.log('returning this response : ', statusCode, resultStr)
  })
})

server.listen(3000, () => console.log('Server is listening on 3000'))

// Router: match incoming path to some hanlders
// define a request router & resolvers
const router: IRouter = {
  sample: data => {
    console.log(data)
    return { statusCode: 200, result: { name: 'sample resolver' } }
  },
  notFound: data => {
    console.log(data)
    return { statusCode: 404, result: {} }
  }
}

// interfaces
interface IDataFromReq {
  trimmedPath: string
  qryStrObj: ParsedUrlQuery
  method: string
  headers: http.IncomingHttpHeaders
  payload: string
}

interface IResults {
  statusCode: number
  result: { [key: string]: any }
}

type resolver = (data: any) => IResults

interface IRouter {
  [key: string]: resolver
}
