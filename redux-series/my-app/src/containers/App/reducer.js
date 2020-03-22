const initState = {
  counter : 0
}
export default function counter(state = initState, action) {
    switch (action.type) {
      case 'INCREMENT':
        return {
          ...state,
          counter : state.counter+1
        }
      case 'DECREMENT':
        return {
          ...state,
          counter : state.counter-1
        }
      default:
        return state
    }
}