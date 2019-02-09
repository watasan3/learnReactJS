import React from 'react'
import Counter from './Counter'
import Timer from './Timer'

export default class App extends React.Component {

  render () {
    return (
      <div>
        <Counter />
        <Timer />
      </div>
    )
  }
}