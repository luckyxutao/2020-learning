import actionTypes from './type';
const initState = {
  counter : 0,
  list : null
}
export default function counter(state = initState, action) {
    switch (action.type) {
      case actionTypes.SAVE_LOCAL:
        const { data:{list},query} = action;
        debugger
        return {
          ...state,
          list
        }
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