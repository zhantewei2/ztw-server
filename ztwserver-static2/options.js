const handleRun=(opts)=>{
	//etag:
  let run=async(stat,ctx)=>{};
	if(opts.etag){
		const old=run;
		run=async(stat,ctx)=>{
			let mtime=Date.parse(stat.mtime);
			if(ctx.req.headers['if-none-match']==mtime){
				ctx.res.writeHead(304);
				ctx.res.end();
				return true;
			}
			ctx.res.setHeader('Etag',mtime);
			return await old(stat,ctx);
		}
	}
	//cache:
	if(opts.maxAge!==undefined){
		const old=run;
		run=async(stat,ctx)=>{
			ctx.res.setHeader('Cache-Control','max-age='+opts.maxAge);
			return await old(stat,ctx);
		}
	}
	if(opts.gzip){
		const old=run;
		run=async(stat,ctx)=>{
			if(typeof opts.gzip=='object'){
				if(opts.gzip.indexOf(stat.extension)!=-1)ctx.res.setHeader('Content-Encoding','gzip');
			}else{
				ctx.res.setHeader('Content-Encoding','gzip');
			}
			return await old(stat,ctx);
		}
	}

	return async(stat,ctx,end,params)=>{
	  const result=await run(stat,ctx);
	  if(!result)await end(params);
  }
};
const handleCatch=async(opts)=>{
  if(opts.callback){

  }
};
module.exports=opts=>({
  run:handleRun(opts),
  runCatch:handleCatch(opts)
});
