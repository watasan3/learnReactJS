# 環境構築

NodeJSインストール  
まずバージョン管理用のNodeJSツールをインストールします。  
このバージョン管理ツール経由でNodeJSをインストールをすると  
後々NodeJSがアップグレードした場合でも切り替えが楽です。  
今回は8.6.0のNodeJSをインストールします。  


* Mac OSX: [Nodebrew](https://github.com/hokaccha/nodebrew)

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

エディタは個人的に[Visual Studio Code](https://code.visualstudio.com/)がおすすめ  
VSCodeをお使いの人はついでに[VSCodeで爆速コーディング環境を構築する(主にReactJS向け設定)](https://qiita.com/teradonburi/items/c4cbd7dd5b4810e1a3a9)も読むと幸せになれるかも  