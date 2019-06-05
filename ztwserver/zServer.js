const callCtx=require('./ctx/ctx.js');
const http=require('http');
class zServer{
	constructor(){
		this.routerArr=[];
	}
	use(cb){
		this.routerArr.push(cb);
	}
	configUse(){
		this.routerArr.reverse();
		let runFn=()=>{},ctx0;
		this.routerArr.forEach(v=>{
			const old=runFn;
			runFn=async()=>{
			 	await v(ctx0,old);
			}
		});
		return async(ctx)=>{
			ctx0=ctx;
			await runFn();
		};
	}
	listen(port){
		const fn=this.configUse();
		const app=http.createServer(async(req,res)=> {
      const ctx = callCtx(req, res);
      try {
        await fn(ctx);
      } catch (e) {
        console.error(e);
        res.statusCode=400;
        res.end();
      }
    });
		app.listen(port);
		console.log(`----- server listen on ${port} -------`)
	}
}
module.exports=zServer;