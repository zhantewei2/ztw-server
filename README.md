web framework for node.js


```js
const {Server}=require('ztw-server');
const app=new Server();

app.use(async(ctx,next)=>
  ctx.body='hello world'
);
app.listen(3000);

```

### Installation

Before installing, download and install Node.js. Node.js 8.x or higher is required.
```shell
npm install ztw-server

```

Middleware
---
### Static
static(`UrlPath`,`NativeDirectory`,`Options`)

- UrlPath 
- NativeDirectory 
- Options
    - **etag**   304
    - **memory** use memory to cache files
    - **maxAge** Cache-Control max-age
    - **callback** return file with the current settings if no file is found.
##### Example
```javascript
const {Static,Server}=require('ztw-server')

app.use(
  Static('/static','vueDist',{
    memory:true,
    etag:true,
    maxAge:60*60*24,
    callback:'index.html'
  })
)
```

### Router

