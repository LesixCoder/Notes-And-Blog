function myPromise(constructor){
  let self=this;
  self.status="pending";
  self.value=undefined;//if pending->resolved
  self.reason=undefined;//if pending->rejected
  self.onFullfilledArray=[];//to deal with async(resolved)
  self.onRejectedArray=[];//to deal with async(rejeced)
  function resolve(value){
    //pending->resolved
    if(self.status==="pending"){
      self.status="resolved";
      self.value=value;
      self.onFullfilledArray.forEach(function(f){
        f(self.value);
      })
    }
  }
  function reject(reason){
    if(self.status==="pending"){
      self.status="rejected";
      self.reason=reason;
      self.onRejectedArray.forEach(function(f){
        f(self.reason);
      })
    }
  }
  //According to the definition that the function "constructor" accept two parameters
  //error catch
  try {
    constructor(resolve,reject);
  } catch (e) {
    reject(e);
  }
}
myPromise.prototype.then=function(onFullfilled,onRejected){
  onFullfilled=typeof onFullfilled==="function"?onFullfilled:function(x){return x};
  onRejected=typeof onRejected==="function"?onRejected:function(e){throw e};
  let self=this;
  let promise2;
  switch (self.status) {
    case "pending":
       promise2=new myPromise(function(resolve,reject){
         self.onFullfilledArray.push(function(){
            setTimeout(function(){
              try {
                let temple=onFullfilled(self.value);
                resolvePromise(promise2,temple,resolve,reject);
              } catch (e) {
                reject(e)
              }
            })
         });
         self.onRejectedArray.push(function(){
            setTimeout(function(){
              try {
                let temple=onRejected(self.reason);
                resolvePromise(promise2,temple,resolve,reject);
              } catch (e) {
                reject(e)
              }
            })
         })
       });
       break;
    case "resolved":
       promise2=new myPromise(function(resolve,reject){
            setTimeout(function(){
              try {
                let temple=onFullfilled(self.value);
                resolvePromise(promise2,temple,resolve,reject);
              } catch (e) {
                reject(e)
              }
            })
       });
       break;
    case "rejected":
        promise2=new myPromise(function(resolve,reject){
              setTimeout(function(){
                try {
                  let temple=onRejected(self.reason);
                  resolvePromise(promise2,temple,resolve,reject);
                } catch (e) {
                  reject(e)
                }
              })
           });
       break;
    default:
  }
  return promise2;
}
function resolvePromise(promise,x,resolve,reject){
  // promise must != temple
  if(promise===x){
    return reject(new TypeError("Cyclic reference"));
  }
  let isUsed;
  if(x!==null&&(typeof x==="object"||typeof x==="function")){
    try{
      let then=x.then;
      if(typeof then==="function"){
        //
        then.call(x,function(y){
          if(isUsed)return;
          isUsed=true;
          resolvePromise(promise,y,resolve,reject)
        },function(e){
          if(isUsed)return;
          isUsed=true;
          reject(e);
        })
      }else{
        resolve(x);
      }
    }catch(e){
      if(isUsed)return;
      isUsed=true;
      reject(e);
    }
  }else{
    resolve(x);
  }
}
myPromise.deferred=function(){
  let dfd={};
  dfd.promise=new myPromise(function(resolve,reject){
    dfd.resolve=resolve;
    dfd.reject=reject;
  });
  return dfd;
}
export default myPromise;