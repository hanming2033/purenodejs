// dependencies: import from other modules
// these modules must export some object/method
import * as http from 'http'
import * as url from 'url'

import { StringDecoder } from 'string_decoder'

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
    const chosenResolver: hanlder = router[trimmedPath] ? router[trimmedPath] : router.notFound
    // construct data object(from the path, headers... derived above) to send to the resolver
    const data = { trimmedPath, qryStrObj, method, headers, payload: stream }
    // route the request to the resolver specified in the router
    chosenResolver(data, (statusCode, result) => {
      // concept of this resolver:
      // 1. pass in the data into resolver
      // 2. resolver process the data and call this callback with statusCode and result
      // 2. this callback simply converts the result into json and return statusCode and json

      // convert the result into a string
      // result here is the result we send to user
      const resultStr = JSON.stringify(result)
      // return the response
      res.writeHead(statusCode)
      res.end(resultStr)
      console.log('returning this response : ', statusCode, resultStr)
    })
  })
})

// 2. tell server to listen on a port
server.listen(3000, () => console.log('Server is listening on 3000'))

// Router: match incoming path to some hanlders
// define a request router & resolvers
const router: IRouter = {
  sample: (data, returnResultFn) => {
    console.log(data)
    // callback a http status code, and a result object
    returnResultFn(200, { name: 'sample resolver' })
  },
  notFound: (data, returnResultFn) => {
    console.log(data)
    returnResultFn(404, {})
  }
}

type cbReturnResultFn = (statusCode: number, result: { [key: string]: any }) => void
type hanlder = (data: any, returnResultFn: cbReturnResultFn) => void
interface IRouter {
  [key: string]: hanlder
}
