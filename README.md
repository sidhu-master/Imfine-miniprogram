# Imfine-miniprogram

无恙每日微信小程序。

## 项目关系

- 小程序 appid：`wx43a98b4b47a98376`
- 公众号菜单入口：`产品 / 无恙每日` -> `pages/dailyHome/index`
- AI 陪伴接口：`https://api.sidhu.net.cn/mp/ai/companion`
- 公开入口在公司层 `company-wechat-gateway`，产品逻辑在 `Imfine-server`：无恙每日后端负责陪伴人设、记忆系统和上下文组装，再调用后端模型基础设施。API key 不下发到小程序。

## 开发

使用微信开发者工具打开本仓库，项目配置在 `project.config.json`，小程序源码根目录为 `miniprogram/`。
