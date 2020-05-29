# Node.js折腾记一（改进）：文件夹目录树获取

## 前言
> #### 这是第一个版本：
> 1. 用来干什么：想干嘛干嘛
> 2. 为什么写：写来玩，学习`node.js`文件系统相关api；树结构这种东西还是挺不错的，会用会造才是真的会
> 3. 用了什么： `fs.readdir(dir)`, `fs.stat(dir).isFile()`, `path`处理路径等
> 4. 思路：
>    - 读取当前文件夹（不是文件夹的另作处理），获得其下所有文件和目录组成的数组；
>    - 循环该数组，判断是文件夹还是文件，文件的话直接push到`childFiles`（对象有两个属性：` short`文件名，`full`完整文件路径）
>    - 文件夹的话，先把当前文件夹作为`key`，存到父级文件夹的`childDir`属性下，然后自调用传当前文件夹路径
>    - 每一层文件夹都包含三个属性：`dir`文件夹路径，`childFiles`子文件，`childDir`子文件夹，存储为对象结构
>    - 以上步骤重复，直到达到最底层空文件夹或该文件夹只有文件

#### 改进：
> * 添加目录过滤规则（正则表达式）;根据正则表达式，过滤(i)或只获取(c)；
默认过滤`["/node_modules|.git/i"]`
> * 过滤的正则表达式格式：`["regx"]`，如`["/node_modules|.git/i"]`、`["/components/"]`
> * 添加结构树输出，类似`tree`或 [treer](https://github.com/derycktse/treer#readme) ，类似在掘金到处可见的项目结构那种
> * 通过`npm scripts`使用不同的命令，添加不同的参数，`process.env`传递变量（过滤类型`i/c`，正则）

源码可以戳这里：[github地址](https://github.com/zero9527/node-test)

## 一、输出的内容
* #### components-dir-tree.json
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

* #### components-dir-tree.json: output
```js
"output": "D:\\node-test\n└─ components\n    ├─ components-dir-tree1.json\n    ├─ file.2.js\n    ├─ file.bakeup.js\n    ├─ file.js\n    ├─ index.js\n    ├─ log.js\n    ├─ node-test-dir-tree.json\n    ├─ run-sh.js\n    ├─ test\n      └─ aa\n        ├─ bb.js\n        └─ cc\n    └─ timeFormat.js\n"
```
```js
 D:\node-test
├─ components
    ├─ components-dir-tree1.json
    ├─ file.2.js
    ├─ file.bakeup.js
    ├─ file.js
    ├─ index.js
    ├─ log.js
    ├─ node-test-dir-tree.json
    ├─ run-sh.js
    ├─ test
      └─ aa
        ├─ bb.js
        └─ cc
    └─ timeFormat.js
├─ index.js
├─ json
    ├─ a.json
    └─ b.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
    └─ generateComponent.js
└─ sh
    └─ sh1.js
```
<!--cmd-->
![](../static/images/node.js-dir-1.png)


## 二、主函数 `getDirTree`：
```js
//components/file.2.js:
const fs = require('fs');
// 获取获取目录的类型，过滤i: ignore/包含c: contain
const type = process.env.getDirTreeType;
// 正则表达式 ["/node_modules|.git/i"]
let reg = process.env.getDirTreeReg;

// 正则表达式转换
let modifier = reg.substring(reg.lastIndexOf('/')+1, reg.lastIndexOf(']')) || 'i'; // 修饰符
reg = reg.substring(reg.indexOf('/')+1, reg.lastIndexOf('/')); // 截取表达式模型

reg = new RegExp(reg, modifier); // 生成正则表达式

let firstRun = true; // getDirTree首次执行
let output = ''; // 生成目录结构字符串
/**
 * 获取目录下的文件树
 * @param {读取的路径} dir 
 * @returns 返回 dir目录下的文件树
 */
function getDirTree(dir) {
  let obj = {
    dir: dir,
    childFiles: [],
    childDir: {}
  };
  let objStr = JSON.stringify(obj);
  if (firstRun && isFile(dir)) return console.log(`${dir}: 不是文件夹`.redBG);

  let files = readDir(dir);
  
  if (firstRun) {
    output=`${dir}\n`;
    // 根据正则过滤文件、文件夹
    files = filesFilter(files);
    // 过滤之后的文件、文件夹列表
    log('files: ', files);
  }

  firstRun = false;

  // 遍历文件
  files.forEach((file, index) => {
    let tempdir = `${dir}\\${file}`;
    let dirname = getDirName(tempdir);
    // dir深度
    let dirDeep = new Array(tempdir.split('\\').length - 2).fill(0);
    
    dirDeep = dirDeep.reduce((acc,cur) => 
      acc = (dirDeep.length > 1 ? '  ' : '') + acc, 
      index === files.length - 1 ? '└─ ' : '├─ '
    );
    
    output += `${dirDeep}${dirname}\n`;
    obj.output = output;

    log('output: \n'.green, output);

    if (isFile(tempdir)) {
      obj.childFiles.push({
        short: file, // 文件名
        full: tempdir // 完整路径
      });
      
    } else {
      // console.log('tempdir: ',tempdir);
      
      // 在当前文件夹的对象下 childDir 属性(1)，以文件夹名作为key(2)，
      // (2)的值是该目录下 路径dir、childFiles子文件、childDir子文件夹组成的对象或null
      obj.childDir[dirname] = getDirTree(tempdir);
    }
  });
  return JSON.stringify(obj) === objStr ? null : obj;
}
```


## 三、工具函数 
* #### 目录过滤：
```js
// 根据正则过滤文件、文件夹
function filesFilter(files) {
  switch (type) {
    case 'i': // 过滤掉忽略的文件、文件夹
      files = files.filter(item => !reg.test(item));
      break;
    case 'c': // 包含
      files = files.filter(item => reg.test(item));
      break;
    default:
      break;
  }
  return files;
}

```

* #### 其他`readDir`/`isFile`/`getDirName`等
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


## 四、调用
* #### package.json:
```js
{
  ...
  "scripts": {
    "gettreer": "node index.js --i",
    "gettreer:i": "node index.js --i",
    "gettreer:c": "node index.js --c",
  },
  ...
}
```

* #### 函数主体
```js
// components/index.js
// 获取目录树初始化
function getDirTreeInit() {
  program
    .version('0.0.1')
    .option('-i --i [i]', 'ignore file or files')
    .option('-c --c [c]', 'contain file or files')
    .parse(process.argv);
  
  // 接受命令行参数 npm run gettreer:i ["/node_modules|.git/i"]
  let reg = (typeof program.i === 'string' && program.i) 
    || (typeof program.c === 'string' && program.c)  
    || '[/node_modules|.git/i]';
  process.env.getDirTreeType = program.c ? 'c' : 'i'; // 忽略过滤ignore
  process.env.getDirTreeReg = reg; // 正则表达式

  const { getDirTree, getDirName } = '' 
    ? require('./file.js') // 上个版本
    : require('./file.2.js'); // 本次改进版本

  let treeObj = getDirTree(componentDir);
  // console.log('treeObj: ',treeObj);

  if (treeObj) {
    let outdir = `${__dirname}\\${getDirName(componentDir)}-dir-tree.json`;

    // 写入文件
    fs.writeFile(outdir, JSON.stringify(treeObj, '', '\t'), 'utf8', (err) => {
      if (err) throw err;
      console.log(`目录树已输出为文件保存: ${outdir}`.greenBG);
    });
  }
}
```


#### 到这里就结束了！