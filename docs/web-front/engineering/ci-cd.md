# CI&CD

做自动化部署可以分为本地部署和 Jenkins 部署。

公司的源码是放在 Gitlab 上，测试那边使用 Jenkins 做的 CI。下面先介绍怎么完成本地推送代码到 Gitlab 后自动触发 Jenkins 完成构建部署。

## Jenkins

Jenkins 上创建基本的构建任务这里就不说了，主要讲怎么配置触发器和 Gitlab 配合完成自动构建。

Jenkins 上构建触发器有很多种方式，如果安装了 Gitlab Plugin 可以选择这个选项。如果没有安装，可以选择触发远程构建选项。这两个本质都是提供一个 webhook 的 url 给到外部，可以直接通过访问这个 url 触发 Jenkins 的构建。

这里选择触发远程构建来实现, token 设置为 luckypanda-front，JENKINS_URL 是 Jenkins 服务的地址。通过浏览器输入 JENKINS_URL/view/Front/job/LUCKY-PANDA-FRONT/build?token=luckypanda-front 可以测试是否能触发 Jenkins 构建

```shell
JENKINS_URL/view/Front/job/LUCKY-PANDA-FRONT/build?token=luckypanda-front

```

接下来配置 Gitlab

### Gitlab

Gitlab 支持自定义 webhook，在项目/settings/Integrations 里创建一个 webhook, URL 就填写上 Jenkins 上设置的。

点击 addWebhook。添加成功后可以测试一下连通性。如果不行，可能是 Jenkins 配置问题，需要给匿名用户添加 build 权限。

### 本质

各种 CI 工具实现 Git 提交自动部署本质上都是利用了 Git hooks 的特性。Git 代码仓库是一个裸库，通过自定义 hooks 实现执行不同 events 时执行对应的 hooks 脚本，hooks 脚本对远程 CI 服务器发起请求，完成自动化构建任务。

## 本地的 deploy 脚本

首先可以使用 scipty 扩展项目脚本，在.sh 文件中我们可以写如下的部署命令。
由于服务器可能没有权限配置免密，使用的是 sshpass 来输入密码。这里需要注意的一个问题是，`!` 是个特殊字符，如果密码中包含这个字符就需要做转义处理，否则执行会报错。另外，本地脚本执行 rm 命令时尤其需要注意，尽量写绝对路径，不要写相对路径，如果对 shell 脚本不熟悉，很有可能写出来的变量为空的情况，而如果是 root 权限的话，会导致 remove 掉服务器所有的内容，这是致命的。

```shell
#!/usr/bin/env sh

#抛出遇到的错误
set -e

cur_date="`date +%Y-%m-%d`"
echo $cur_date
server_file="server-${cur_date}.tar.gz"
client_file="client-${cur_date}.tar.gz"

if [ ! -f $server_file ];then
  echo "$server_file 文件不存在"
else
  echo "删除$server_file"
  rm -f $server_file
fi


if [ ! -f $client_file ];then
  echo "$client_file 文件不存在"
else
  echo "删除$client_file"
  rm -f $client_file
fi


echo "开始构建${pwd}"

npm run build:test

echo "打包完成"
echo "开始压缩"

tar -zcvf $server_file -C ./dist .
tar -zcvf $client_file -C ./dist/assets .

echo "压缩完成，开始上传服务器"
server_host="root@192.168.0.221"
server_port="22"
server_dist="/scss/LuckyPanda"
server_pwd="********"

client_host="wtttest@192.168.0.154"
client_port="22"
client_dist="/images/lpn-front/assets"
client_pwd="********"

# 检查服务器目录是否存在
sshpass -p "$server_pwd" ssh -p $server_port $server_host "mkdir -p $server_dist/"

sshpass -p "$client_pwd" ssh -p $client_port $client_host "mkdir -p $client_dist/"

# 上传
sshpass -p "$server_pwd" scp -P $server_port $server_file $server_host:$server_dist/

sshpass -p "$client_pwd" scp -P $client_port $client_file $client_host:$client_dist/

echo "资源上传成功，开始部署"

sshpass -p "$server_pwd"  ssh -p $server_port $server_host "tar -xvf $server_dist/$server_file -C $server_dist/"

sshpass -p "$client_pwd" ssh -p $client_port $client_host "tar -xzf $client_dist/$client_file -C $client_dist/"

sshpass -p "$server_pwd" ssh -p $server_port $server_host "rm  $server_dist/$server_file"

sshpass -p "$client_pwd" ssh -p $client_port $client_host "rm  $client_dist/$client_file"


# 安装服务端依赖
# sshpass -p "$server_pwd" ssh -p $server_port $server_host "cd $server_dist/; npm install;"

# 重启服务
sshpass -p "$server_pwd" ssh -p $server_port $server_host " cd $server_dist/; pm2 restart pm2.json"



```
