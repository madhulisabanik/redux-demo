const { default: axios } = require('axios');
const redux = require('redux');
const thunkMiddleware = require('redux-thunk').default;
const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

const initialState = {
    loading: false,
    user: [],
    error: ''
}

const FETCH_USER_REQUESTED = 'FETCH_USER_REQUESTED';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

function fetchUserRequest() {
    return {
        type: FETCH_USER_REQUESTED
    }
}

function fetchUserSuccess(user) {
    return {
        type: FETCH_USER_SUCCESS,
        payload: user
    }
}

function fetchUserFailure(error) {
    return {
        type: FETCH_USER_FAILURE,
        payload: error
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_USER_REQUESTED:
            return{
                ...state,
                loading: true
            }
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: ''
            }
        case FETCH_USER_FAILURE: 
            return {
                ...state,
                loading: false,
                user: [],
                error: action.payload
            }
        default:
            return state
    }
}

// Calling API
const fetchUsers = () => {
    return function(dispatch) {
        dispatch(fetchUserRequest())
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then((response) => {
            const users = response.data.map((user) => user.id)
            dispatch(fetchUserSuccess(users))
        })
        .catch((error) => {
            //error.message is the error message
            dispatch(fetchUserFailure(error.message))
        })
    }
}

const store = createStore(reducer, applyMiddleware(thunkMiddleware))

store.subscribe(() => {
    console.log(store.getState())
})
store.dispatch(fetchUsers())