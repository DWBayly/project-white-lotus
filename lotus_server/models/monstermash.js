const Jimp = require('jimp');
const uuidv1 = require('uuid/v1');
const path = require('path');

// composites the first two indexes of the array containing monster parts
function composeSS(x,y){
  return new Promise((resolve,reject) => {
    Jimp.read(x).then(function (im1) {
      Jimp.read(y).then(function (im2) {
        im1.composite(im2,0,0);
        resolve(im1);
      });
    }).catch(function (err) {
      console.error(err);
      reject(err);
    });
  });
}

// Composites composites an image to the image being built.
function composeIS(img, str){
  return new Promise((resolve, reject)=>{
    Jimp.read(str).then(function(im2){
      img.composite(im2, 0, 0);
      resolve(img);
    }).catch(function (err) {
      console.error(err);
      reject(err);
    });
  });
}

// Recursively composites images until we've run out of images then returns the final image.
function mash(arr,index,img){
  return new Promise((resolve)=>{
    if(index >= arr.length){
      resolve(img);
    } else {
      composeIS(img, arr[index]).then(function(r1){
        mash(arr,index+1,r1).then(function(r2){
          resolve(r2);
        });
      });
    }
  });
}

// Starts compositing chain, with composeSS then runs mash.
// Once completed, it writes the image and returns the image url for adding to the database.
const monsterMash = (arr) => {
  return new Promise((resolve)=>{
    if(arr.length===1){
      Jimp.read(arr[0]).then(function(r1){
        let x = uuidv1();
        r2.write(`${x}.png`);
        resolve(`${x}.png`);
      });
    } else {
      composeSS(arr[0],arr[1]).then(function(r1){
        mash(arr, 2, r1).then(function(r2){
          let x = uuidv1();
          r2.write(path.join(__dirname, `../dist/assets/monsters/${x}.png`));
          resolve(`/assets/monsters/${x}.png`);
        });
      });
    }
  });
};

module.exports = monsterMash;
