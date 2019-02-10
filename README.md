# ReactHook
React 16.8以降に追加された機能です。  
Stateless Functional Componentにstateを後付けで持たせることができる機能です。(Statelessでなくなりますので実質Functional Componentになりますね)  
Stateless Functional Componentでstateを後でつけたいという場合はクラスに書き直さずにReactHookを使うと良いです。  
参考：[React 16.8: 正式版となったReact Hooksを今さら総ざらいする](https://qiita.com/uhyo/items/246fb1f30acfeb7699da)

# useState


# useEffect

# useRef+useLayoutEffect+useImperativeHandleのサンプル

useImperativeHandle：ref参照にメソッドを生成するということ等ができますが、Reactのprops経由などで制御するという思想と反しているため、あまり積極的には使うべきではありません。

# userReducer + useContext

# その他
useDebugValue：カスタムフックのデバッグ用のhookです。ライブラリ開発には使えるかもしれません。ここでは触れません

