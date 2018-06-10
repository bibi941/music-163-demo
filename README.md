# 仿网易云音乐移动端
本项目采用移动端播放,移动端具有歌曲播放、切换、暂停、搜索、循环、歌词滚动等功能，PC 端歌曲上传、删除、修改等功能。使用 jQuery、MVC设计模式以及 LeanCloud、七牛作为数据库实现。

由于后台管理端口采用七牛作为数据库，七牛API需要一个server才能启动上传moudle，我用node.js写了一个serve，后台上传歌曲需要开启这个简单的server

## Build Setup

``` 
# install dependencies
npm install http-server

# serve with backstage at localhost:8888
node server.js 8888 

# serve with http-server at 192.168.0.6:8080
hs -c-1
```
## 后台管理界面
由于歌词随动的实现需要，所以必须上传有时间轴的标准歌词
![](https://user-gold-cdn.xitu.io/2018/6/10/163ea25e4fc6c048?w=695&h=400&f=png&s=56706)

## 首页
完美还原网易云移动端界面,由于数据库容量有限,只上传了10首歌曲，首页歌单采用扑克牌算法，让每次刷新都是不同的推荐歌单。
![](https://user-gold-cdn.xitu.io/2018/6/10/163ea25e515b6fb5?w=250&h=432&f=png&s=134043)

## 歌曲详情页面
采用audio+svg+css3 filter实现了本页基本效果，歌词滚动采用的Regex匹配相应的标准歌词格式达到随动效果
![](https://user-gold-cdn.xitu.io/2018/6/10/163ea25e51ab01fc?w=245&h=432&f=png&s=57766)

## 歌单页面
也是采用svg+sprite实现了本页面的效果
![](https://user-gold-cdn.xitu.io/2018/6/10/163ea25e51f84c7a?w=241&h=432&f=png&s=54212)
