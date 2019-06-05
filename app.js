
const {Server,Static,Router} =require('./main');

const app=new Server();

app.use(Static('/static','dir',{
  memory:true,
  etag:true,
  callback:'index.html'
}));

app.use(async(ctx)=>{
  ctx.body='end';
});

app.listen(3000);