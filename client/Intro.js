import React from 'react'
import Joyride from 'react-joyride'
import { autobind } from 'core-decorators'

export default function Intro(...params){
  return function IntroWrap(WrappedComponent) {
    @autobind  
    class Enhancer extends React.Component {
  
      constructor(props) {
        super(props)
    
        this.state = {
          isReady: false,
          isRunning: false,
          stepIndex: 0,
          steps: [],
          selector: '',
        }
      }
    
      componentDidMount() {
        setTimeout(() => {
          this.setState({
            isReady: true,
            isRunning: true,
          })
        }, 1000)
    
        this.addSteps(params[0])
      }
    
      addSteps(steps) {
        let newSteps = steps
    
        if (!Array.isArray(newSteps)) {
          newSteps = [newSteps]
        }
    
        if (!newSteps.length) {
          return;
        }
    
        // Force setState to be synchronous to keep step order.
        this.setState(currentState => {
          currentState.steps = currentState.steps.concat(newSteps);
          return currentState
        })
      }
    
      next() {
        this.joyride.next()
      }
    
      onClickSwitch(e) {
        e.preventDefault()
        const el = e.currentTarget
        const state = {}
    
        if (el.dataset.key === 'joyrideType') {
          this.joyride.reset()
    
          this.setState({
            isRunning: false,
          });
    
          setTimeout(() => {
            this.setState({
              isRunning: true,
            })
          }, 300)
    
          state.joyrideType = e.currentTarget.dataset.type
        }
    
        if (el.dataset.key === 'joyrideOverlay') {
          state.joyrideOverlay = el.dataset.type === 'active'
        }
    
        this.setState(state)
      }
  
      render() {
        const {
          isReady,
          isRunning,
          joyrideOverlay,
          joyrideType,
          selector,
          stepIndex,
          steps,
        } = this.state
  
        return (
          <div>
            <Joyride
              ref={c => (this.joyride = c)}
              debug={true}
              run={isRunning}
              showOverlay={true}
              showStepsProgress={true}
              stepIndex={stepIndex}
              steps={steps}
              type={'continuous'}
              />
            <WrappedComponent {...this.props}/>
          </div>
        )
      }
    }
    return Enhancer
  }
}
