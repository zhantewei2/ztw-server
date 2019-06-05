const path=require('path');
const {run_promise} =require('../util/tool.js');
const getType=require('../util/type.js');

const fs=require('fs');

const readToMemory=(nativePath)=>{
  const dict={};
  const read=(readPath,relativePath='')=>{
    try{
      const stat=fs.lstatSync(readPath);
      if(stat.isDirectory()){
        const fileList=fs.readdirSync(readPath);
        for(let fileName of fileList){
          read(path.join(readPath,fileName),path.join(relativePath,fileName))
        }
      }else{
        const body=fs.readFileSync(readPath);
        const {type,extension}=getType({name:relativePath});
        stat.extension=extension;
        dict[relativePath]={
          body,
          contentType:type,
          stat
        }
      }
    }catch(e){
      throw new Error('read memory failure');
    }
  };
  read(nativePath);
  return dict;
};

module.exports.readToMemory=readToMemory;