# ReactHook
React 16.8以降に追加された機能です。  
Stateless Functional Componentにstateを後付けで持たせることができる機能です。(Statelessでなくなりますので実質Functional Componentになりますね)  
Stateless Functional Componentでstateを後でつけたいという場合はクラスに書き直さずにReactHookを使うと良いです。  
参考：[React 16.8: 正式版となったReact Hooksを今さら総ざらいする](https://qiita.com/uhyo/items/246fb1f30acfeb7699da)

# useState


# useEffect

# useContext


# パフォーマンスに関して
通常のReact.ComponentやReact.PureComponentよりもFunctional Componentはライフサイクルメソッドがないためレンダリングは高速です。  
ただし再レンダリング可否に関しては制御できないので、頻繁に更新されるようなコンポーネントの配下に子コンポーネントとして配置するのは向いていません。  
（その場合は、親コンポーネント側をPureComponentにするか、shouldComponentUpdateメソッドで親側で再レンダリング制御する必要があります）  
