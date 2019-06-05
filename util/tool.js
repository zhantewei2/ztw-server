const {ErrNotFound} =require('./error');
module.exports.run_promise=(fn,...args)=>
  new Promise((resolve,reject)=>{
    fn.call(fn,...args,(err,result)=>{
        if(err)return reject(new ErrNotFound(err.toString()));
        resolve(result);
      })
  });
