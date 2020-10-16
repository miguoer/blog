# 优秀的库
- module-alias
功能：Nodejs端创建模块的别名

- underscore

- loadsh

- chokidar
这个库可以帮助监听文件夹内容的变化，当变化发生时，方便我们触发一些操作
```javascript
const chokidar = require("chokidar");
const from = "./\\*"
const to = "root@47.77.33.222:/root/static"
const watcher = chokidar.watch(process.cwd());
watcher.on("change", function(filePath) {
    //do something
})
```

- expect
方便在窗口输入内容
```javascript
const shell = require("shelljs")
const path = require("path");

const chokidar = require("chokidar");
const from = "./\\*"
const to = "root@47.77.33.222:/root/static"
const watcher = chokidar.watch(process.cwd());

const password = "ddddddd"

watcher.on("change", function(filePath) {
    //do something
    shell.exec(expect ${expectPath} ${filePath} ${to} ${password});
})


// expect.exp
#!/usr/bin/expect
set from [lindex $argv 0]
set to [lindex $argv 1]
set password [lindex $argv 2]
set timeout 30
spawn bash -c "scp $from $to"
expect {
    "*password:" {send "$password\r"}
}
interact


```

