const redux = require('redux');
const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;

const reduxLogger = require('redux-logger');
const logger = reduxLogger.createLogger();

// Define Action
const CAKE_ORDERED = 'CAKE_ORDERED';
const CAKE_RESTOCK = 'CAKE_RESTOCK';
const ICECREAM_ORDERED = 'ICECREAM_ORDERED';
const ICECREAM_RESTOCK = 'ICECREAM_RESTOCK';

// Define Action creator
function cakeOrdered(qty = 1) {
    return {
        type: CAKE_ORDERED,
        payload: qty
    }
}

function cakeRestock(qty = 1) {
    return {
        type: CAKE_RESTOCK,
        payload: qty
    }
}

function iceCreamOrdered(qty = 1) {
    return {
        type: ICECREAM_ORDERED,
        payload: qty
    }
}

function iceCreamRestock(qty = 1) {
    return {
        type: ICECREAM_RESTOCK,
        payload: qty
    }
}

// Define State
const initialCakeState = {
    numOfCakes: 10
}

const initialIceCreamState = {
    numOfIceCreams: 20
}

// Define Reducer (prevState, action) => newState
const cakeReducer = (state = initialCakeState, action) => {
    switch(action.type) {
        case CAKE_ORDERED: 
            return{
                ...state,
                numOfCakes: state.numOfCakes - 1
            }
        case CAKE_RESTOCK: 
            return{
                ...state,
                numOfCakes: state.numOfCakes + action.payload
            }
        default:
            return state
    }
}

const iceCreamReducer = (state = initialIceCreamState, action) => {
    switch(action.type) {
        case ICECREAM_ORDERED: 
            return{
                ...state,
                numOfIceCreams: state.numOfIceCreams - 1
            }
        case ICECREAM_RESTOCK: 
            return{
                ...state,
                numOfIceCreams: state.numOfIceCreams + action.payload
            }
        case CAKE_ORDERED: // Let's assume with every cake ordered, an icecream will be given as rewards
            return{
                ...state,
                numOfIceCreams: state.numOfIceCreams - 1 // Though the iceCreamReducer can access to the CAKE_ORDERED action, but it can only update it's own state, i.e. numOfIceCreams. In redux-toolkit, this can be achieved by using extraReducers
            }
        default:
            return state
    }
}

// Create Combined Reducers
const rootReducer = combineReducers({
    cake: cakeReducer,
    iceCream: iceCreamReducer
})

// Create Store expects reducer as a parameter, which actually holds the initial state of the app
const store = createStore(rootReducer, applyMiddleware(logger))
console.log("Initial state: ", store.getState())

// Create Listner
const unsubscribe = store.subscribe(() => {
    //console.log("Updated State: ", store.getState())
    // Redux Logger will log the rest
})

// Dispatch action, pass the action/action creator here
store.dispatch(cakeOrdered())
store.dispatch(cakeOrdered())
store.dispatch(cakeOrdered())
store.dispatch(cakeRestock(3))

store.dispatch(iceCreamOrdered())
store.dispatch(iceCreamOrdered())
store.dispatch(iceCreamRestock(3))

// Unsubscribe the listner
unsubscribe()