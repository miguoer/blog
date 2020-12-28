# CI&CD
公司的源码是放在Gitlab上，测试那边使用Jenkins做的CI。下面主要介绍怎么完成本地推送代码到Gitlab后自动触发Jenkins完成构建部署。

## Jenkins
Jenkins上创建基本的构建任务这里就不说了，主要讲怎么配置触发器和Gitlab配合完成自动构建。

Jenkins上构建触发器有很多种方式，如果安装了Gitlab Plugin可以选择这个选项。如果没有安装，可以选择触发远程构建选项。这两个本质都是提供一个webhook的url给到外部，可以直接通过访问这个url触发Jenkins的构建。

这里选择触发远程构建来实现, token设置为luckypanda-front，JENKINS_URL是Jenkins服务的地址。通过浏览器输入JENKINS_URL/view/Front/job/LUCKY-PANDA-FRONT/build?token=luckypanda-front 可以测试是否能触发Jenkins构建
```shell
JENKINS_URL/view/Front/job/LUCKY-PANDA-FRONT/build?token=luckypanda-front

```

接下来配置Gitlab
## Gitlab
Gitlab支持自定义webhook，在项目/settings/Integrations里创建一个webhook, URL就填写上Jenkins上设置的。

点击addWebhook。添加成功后可以测试一下连通性。如果不行，可能是Jenkins配置问题，需要给匿名用户添加build权限。

## 本质
各种CI工具实现Git提交自动部署本质上都是利用了Git hooks的特性。Git代码仓库是一个裸库，通过自定义hooks实现执行不同events时执行对应的hooks脚本，hooks脚本对远程CI服务器发起请求，完成自动化构建任务。



