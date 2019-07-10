const fs=require('fs');
const staticOpts=require('./options.js');
const getType=require('../util/type.js');
const {run_promise}=require('../util/tool.js');
const path=require('path');
const {readToMemory}=require('./memory.js');
const {ErrNotFound,ErrResponse} =require('../util/error');

module.exports=(
	urlPath,
  nativePath,
	opts={}
	//memory
)=>{
	urlPath=urlPath||'/';
	const urlPathLen=urlPath.length;
	const handle_url=(url)=>{
 
	  if( url.indexOf(urlPath)===0 ){
      return url.slice(urlPathLen);
    }else{
	    return false;
    }
  };
  const {run,runCatch}=staticOpts(opts);


	if(opts.memory){
    const dict=readToMemory(nativePath);
    const end=async({ctx,target})=>{
      ctx.res.setHeader('Content-Type',target.contentType);
      ctx.res.end(target.body);
    };
	  return async(ctx,next)=>{
      const relPath = handle_url(ctx.req.url);
      if (relPath===false) return await next();
      try {
        const target = dict[relPath];
        if(!target)throw new ErrNotFound('empty');
        await run(target.stat,ctx,end,{ctx,target});
      }catch(e){
        if (!(e instanceof ErrNotFound))throw e;
        if(opts.callback){
          const target=dict[opts.callback];
          if(!target)throw ErrResponse('callback failure');
          await run(target.stat,ctx,end,{ctx,target})
        }else{
          await next();
        }
      }
    }
	}else{
	  const end=async({realPath,ctx,type})=>{
	    ctx.res.setHeader('Content-Type',type);
	    fs.createReadStream(realPath).pipe(ctx.res);
    };
	  return async(ctx,next)=>{
      let relPath=handle_url(ctx.req.url);
      if (!relPath) return await next();
      let realPath=path.join(nativePath,relPath);
      try {
        const {type,extension}=getType({name:relPath});
        const stat=await run_promise(fs.lstat,realPath);
        if(!stat||stat.isDirectory())throw new ErrNotFound('empty');
        stat.extension=extension;
        await run(stat,ctx,end,{realPath,ctx,type})
      }catch(e){
        console.log(e.toString());
        if(!(e instanceof ErrNotFound))throw e;
        if(opts.callback){
          relPath=opts.callback;
          realPath=path.join(nativePath,relPath);
          const {type,extension}=getType({name:relPath});
          const stat=await run_promise(fs.lstat,realPath);
          if(!stat)throw ErrResponse('callback failure');
          stat.extension=extension;
          await run(stat,ctx,end,{realPath,ctx,type});
        }else{
          await next();
        }
      }
	  }
  }
};