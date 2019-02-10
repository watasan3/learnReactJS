import React from 'react'
import Counter from './Counter'
import MultiCounter from './MultiCounter'
import Timer from './Timer'
import Increment from './Increment'
import TextArea from './TextArea'

export default class App extends React.Component {

  render () {
    return (
      <div>
        <h1>useStateのサンプル</h1>
        <Counter />
        <MultiCounter />
        <hr/>
        <h1>useEffectのサンプル</h1>
        <Timer />
        <hr/>
        <h1>useRef+useLayoutEffect+useImperativeHandleのサンプル</h1>
        <TextArea />
        <hr/>
        <h1>useReducer+useContextのサンプル</h1>
        <Increment />
      </div>
    )
  }
}