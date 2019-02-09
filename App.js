import React from 'react'
import Counter from './Counter'
import MultiCounter from './MultiCounter'
import Timer from './Timer'


export default class App extends React.Component {

  render () {
    return (
      <div>
        <Counter />
        <MultiCounter />
        <Timer />
      </div>
    )
  }
}