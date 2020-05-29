# Node.js折腾记一：读指定文件夹，输出该文件夹的文件树

## 前言
1. 用来干什么：想干嘛干嘛
2. 为什么写：写来玩，学习`node.js`文件系统相关api；树结构这种东西还是挺不错的，会用会造才是真的会
3. 用了什么： `fs.readdir(dir)`, `fs.stat(dir).isFile()`, `path`处理路径等
4. 思路：
   - 读取当前文件夹（不是文件夹的另作处理），获得其下所有文件和目录组成的数组；
   - 循环该数组，判断是文件夹还是文件，文件的话直接push到`childFiles`（对象有两个属性：`short`文件名，`full`完整文件路径）
   - 文件夹的话，先把当前文件夹作为`key`，存到父级文件夹的`childDir`属性下，然后自调用传当前文件夹路径
   - 每一层文件夹都包含三个属性：`dir`文件夹路径，`childFiles`子文件，`childDir`子文件夹，存储为对象结构
   - 以上步骤重复，直到达到最底层空文件夹或该文件夹只有文件

- ### 输出的样子`components-dir-tree.json`
```json
{
    "dir": "D:\\node-test\\components",
    "childFiles": [
        {
            "short": "components-dir-tree.json",
            "full": "D:\\node-test\\components\\components-dir-tree.json"
        },
        {
            "short": "file.js",
            "full": "D:\\node-test\\components\\file.js"
        },
        {
            "short": "index.js",
            "full": "D:\\node-test\\components\\index.js"
        }
    ],
    "childDir": {
        "no": null,
        "test": {
            "dir": "D:\\node-test\\components\\test",
            "childFiles": [],
            "childDir": {
                "aa": {
                    "dir": "D:\\node-test\\components\\test\\aa",
                    "childFiles": [
                        {
                            "short": "bb.js",
                            "full": "D:\\node-test\\components\\test\\aa\\bb.js"
                        }
                    ],
                    "childDir": {
                        "cc": null
                    }
                }
            }
        }
    }
}
```

- ### 目录结构(仅components)
```
...
|-- components
    -- index.js
    -- file.js
    -- components-dir-tree.json  // 生成的文件树对象的输出文件，方便查看
    -- no
    -- test
       -- aa
        -- cc
```

- ### 使用
*将输出结果格式化写入到json文件，看起来一目了然*
```js
components/index.js:
/**
 * init
 */
require('console-color-mr');  // 命令行样式
const fs = require('fs');
const path = require('path');
const { getDirTree, getDirName }  = require('./file.js');

const componentDir = path.resolve(__dirname, './');
// console.log('componentDir: ', componentDir);

const ComponentInit = (function init() {
  console.log('______ init ______'.blueBG, '\n');
  let treeObj = getDirTree(componentDir);
  
  if (treeObj) {
    let outdir = `${__dirname}\\${getDirName(componentDir)}-dir-tree.json`;
    
    // 写入文件
    fs.writeFile(outdir, JSON.stringify(treeObj, '', '\t'), 'utf8', (err) => {
      if (err) throw err;
      console.log(`目录树已输出为文件保存: ${outdir}`.greenBG);
    });
  }
  return init;
})();

module.exports = ComponentInit;
```

- ### 主函数 `getDirTree`：
```js
/components/file.js
const fs = require('fs');

/**
 * 获取目录下的文件树
 * @param {读取的路径} dir
 * @returns 返回 dir 目录下的文件树
 */
function getDirTree(dir) {
  let obj = {
    dir: dir, // 文件夹路径
    childFiles: [], // 子文件
    childDir: {} // 子目录
  };
  let objStr = JSON.stringify(obj);
  if (isFile(dir)) return console.log(`${dir}: 不是文件夹`.redBG);
  
  // 读取目录
  let files = readDir(dir);
  if (!files.length) console.log(`${dir}: 文件夹为空`.redBG);
  
  // 遍历文件
  files.forEach(file => {
    let tempdir = `${dir}\\${file}`;
    if (isFile(tempdir)) {
      obj.childFiles.push({
        short: file, // 文件名
        full: tempdir // 完整路径
      });
      
    } else {
      // console.log('tempdir: ',tempdir);
      let dirname = getDirName(tempdir);
      // 在当前文件夹的对象下 childDir 属性(1)，以文件夹名作为key(2)，
      // (2)的值是该目录下 路径dir、childFiles子文件、childDir子文件夹组成的对象或null
      obj.childDir[dirname] = getDirTree(tempdir);
    }
  });
  return JSON.stringify(obj) === objStr ? null : obj;
}
```

- ### 工具函数 `readDir`/`isFile`
```js
// 读取路径下的文件、文件夹
function readDir(dir) {
  return fs.readdirSync(dir, (err, files) => {
    if (err) throw err;
    // console.log(`${dir}, files: `.green, files);
    // if (!files.length) console.log(`${dir}: 文件夹为空`.redBG);
    return files;
  })
}

// 判断制定路径是否是文件
function isFile(dir) {
  return fs.statSync(dir).isFile();
}

// 获取目录名
function getDirName(dir) {
  let tempdir = dir.substr(dir.lastIndexOf('\\')+1, dir.length);
  return tempdir;
}

// const components_out = readFile(path.resolve(__dirname, './components-dir-tree.json'));
// console.log('components-dir-tree: ', components_out);

// 读取指定目录的文件
function readFile(dir) {
  let result = fs.readFileSync(dir, 'utf-8');
  return (
    result 
    ? {
      dir: dir,
      result: result
    } 
    : null
  );
}

module.exports = {
  getDirTree,
  readDir,
  isFile,
  readFile
}
```

> 有兴趣继续改造的小伙伴可以戳：[node-test](https://github.com/zero9527/node-test)

##### 到这里就结束了！