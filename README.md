# learnReactJS

# 環境構築

NodeJSインストール
まずバージョン管理用のNodeJSツールをインストールします。
このバージョン管理ツール経由でNodeJSをインストールをすると
後々NodeJSがアップグレードした場合でも切り替えが楽です。
今回は8.6.0のNodeJSをインストールします。

* Windows:![Nodist](https://github.com/marcelklehr/nodist)

[インストーラ](https://github.com/marcelklehr/nodist/releases)でNodistをインストール後

```
$ nodist dist
$ nodist 8.6.0
$ node -v
```

* Mac OSX:![Nodebrew](https://github.com/hokaccha/nodebrew)

Nodebrewダウンロード

```
curl -L git.io/nodebrew | perl - setup
```

.bash_profileに環境変数パスを通す

```.bash_profile
export PATH=$HOME/.nodebrew/current/bin:$PATH
```

.bash_prodileを適用

```
$ source ~/.bash_profile
```

NodeJSインストール

```
$ nodebrew install-binary v8.6.0
$ nodebrew use v8.6.0
$ node -v
```