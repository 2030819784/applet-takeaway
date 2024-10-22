## 地址配置

- /utils/http 下的 baseURL 改为<http://localhost:9000>,即为本地测试.

## 开发工具指南
- HBuilder X <https://dcloud.io/hbuilderx.html>
- 微信开发者工具 <https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html>
- VS Code

# 推荐项目启动方式
- 将项目导入HBuilder X后启用微信模拟器，启动后会自动打开微信开发者工具
- 通过VS Code编辑器进行编写代码
- 使用VS Code开发，即可安装插件：uni-helper、uni-create-view、uniapp小程序扩展

## 技术栈

- 前端框架：[uni-app](https://uniapp.dcloud.net.cn/) (Vue3 + TS + Setup)
- 状态管理：[pinia](https://pinia.vuejs.org/zh/)
- 组件库：[uni-ui](https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html)

## 运行程序

1. 安装依赖

```shell
# npm
npm i --registry=https://registry.npmmirror.com

# pnpm
pnpm i --registry=https://registry.npmmirror.com
```

2. 运行程序

```shell
# 微信小程序端
npm run dev:mp-weixin

# H5端
npm run dev:h5

# App端
需 HbuilderX 工具，运行 - 运行到手机或模拟器
```

3. 微信开发者工具导入 `/dist/dev/mp-weixin` 目录

### 工程结构解析

```
├── .husky                     # Git Hooks
├── .vscode                    # VS Code 插件 + 设置
├── dist                       # 打包文件夹（可删除重新打包）
├── src                        # 源代码
│   ├── components             # 全局组件
│   ├── pages                  # 主包页面
│       ├── index               # 首页
│       ├── cart                # 购物车
│       ├── user                # 我的
│       └── login               # 登录页
│   ├── services               # 所有请求
│   ├── static                 # 存放应用引用的本地静态资源的目录
│       ├── images              # 普通图片
│       └── tabs                # tabBar 图片
│   ├── stores                 # 全局 pinia store
│       ├── modules             # 模块
│       └── index.ts            # store 入口
│   ├── styles                 # 全局样式
│       └── fonts.scss          # 字体图标
│   ├── types                  # 类型声明文件
│       └── component.d.ts      # 全局组件类型声明
│   ├── utils                  # 全局方法
│   ├── App.vue                # 入口页面
│   ├── main.ts                # Vue初始化入口文件
│   ├── pages.json             # 配置页面路由等页面类信息
│   ├── manifest.json          # 配置appid等打包信息
│   └── uni.scss               # uni-app 内置的常用样式变量
├── .editorconfig              # editorconfig 配置
├── .eslintrc.cjs              # eslint 配置
├── .prettierrc.json           # prettier 配置
├── .gitignore                 # git 忽略文件
├── index.html                 # H5 端首页
├── package.json               # package.json 依赖
├── tsconfig.json              # typescript 配置
└── vite.config.ts             # vite 配置
```

## git 说明

- git 提交前会进行规范检查和格式化（husky）

```bash
# husky不生效可执行
npx husky install

# 跳过规范检查（强烈建议非必要不要跳过）
git commit --no-verify -m 'xxx: yyy'
git commit --amend
git pull ...
```

| 名称 | 作用 |
| --- | --- |
| feat: A new feature | 添加新功能 |
| fix: A bug fix | 错误修复 |
| docs: Documentation only changes | 仅文档更改 |
| style: Changes that do not affect the meaning of the | 不影响代码含义的更改（空格、格式、缺少分号等 |
| refactor: A code change that neither fixes a bug nor | 既不修复错误也不添加功能的代码更改 |
| perf: A code change that improves performance | ：提高性能的代码更改 |
| test: Adding missing tests or correcting existing tests | 添加缺失的测试或纠正现有的测试 |
| build: Changes that affect the build system or external dependencies | 影响构建系统或外部依赖项的更改 |
| ci: Changes to our CI configuration files and scripts | 对我们的 CI 配置文件和脚本的更改 |
| chore: Other changes that don't modify src or test | 不修改 src 或测试文件的其他更改 |
| revert: Reverts a previous commit | 还原以前的提交 |

- 代码规范 <https://juejin.cn/post/7040090590326816776>
- 项目提交相关 git 命令, git add .:添加文件，git commit -m 'feat: 新增某个功能' : 提交信息(!!!), git push : 向 git 仓库推送代码，git pull : 拉去最新代码，git branch: 查看分支  
  <https://www.liaoxuefeng.com/wiki/896043488029600/896954848507552>
