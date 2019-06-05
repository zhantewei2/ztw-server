const url=require('url');
module.exports=function(host='',parentUrl){
	let ctx0,arr=[];
	let push=(path,method,cb)=>{
		path=path&&host+'/'+path;
		const matchpostFix='';
		arr.push({
			method:method,
			cb:cb,
			path:path,
			pathReg:new RegExp('^'+path+'((\\?|#)[^\\/]*?)?$')
		})               
	}
	this.use=(cb)=>push(null,null,cb);
	this.get=(path,cb)=>push(path,'GET',cb);
	this.post=(path,cb)=>push(path,'POST',cb);
	this.put=(path,cb)=>push(path,'PUT',cb);
	this.routes=(parentUrl=null)=>async(ctx,next)=>{

		/*
		const route=arr.find(item=>{
			if(isEnd=item.method){
				return item.method==ctx.req.method&&item.path==ctx.req.url;
			}else{
				return ctx.req.url.indexOf(item.path)==0;
			}
			
		})
		*/
		let _pUrl=parentUrl||ctx.req.url;

		if(_pUrl.slice(-1)=='/')_pUrl=_pUrl.slice(0,-1);
		let item;
		if(_pUrl.indexOf(host)!=0){
			return await next();
		}
		for(let i=0,len=arr.length;i<len;i++){
			item=arr[i];
			if(!item.method&&!item.path){
				await new Promise(resolve=>item.cb(ctx,resolve));
			}
			else if(!item.method&&_pUrl.indexOf(item.path)==0){
				await new Promise(resolve=>item.cb(_pUrl.slice(item.path.length))(ctx,resolve));
			}
			else if(item.method==ctx.req.method&&_pUrl.match(item.pathReg)){

				return item.cb(ctx);
			}
		}
		
		await next();
	}
	this.spawn=(path,myRouter)=>{
		push(path,null,myRouter.routes);
	}
}