const  fs=require('fs');
const switchType=require('../../util/type');

module.exports=function(req,res){
	const ctx={
		store:{}
	};
	Object.defineProperty(ctx,'body',{
		get:()=>null,
		set:(value)=>{
			res.end(typeof value == 'object'?JSON.stringify(value):value);
		}
	});
	ctx.req=req;
	ctx.res=res;
	ctx.sendFile=(path)=>{
		const {type}=switchHeader(path);
		res.setHeader('Content-Type',type);
		fs.createReadStream(path).pipe(res);
	};
	return ctx;
};