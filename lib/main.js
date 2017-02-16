
import React from 'react';
import DOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux'
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {onSuccess} from 'redux-axios-middleware/lib/defaults';

const DUMMY_API = 'https://jsonplaceholder.typicode.com';

///////////////////////////////////////////////////////////////
// REDUCERS

const rootReducer = (state = {users: [], fetching: false, didFail: false}, action) => {
    if (action.type === 'FETCH_USERS') {
        return {users: [], fetching: true, didError: false};
    }
    else if (action.type === 'FETCH_USERS_SUCCESS') {
        return {users: action.payload.data, fetching: false, didFail: false};
    }
    else if (action.type === 'FETCH_USERS_FAIL') {
        return {users: [], fetching: false, didFail: true};
    }
    else {
        return state;
    }
};


///////////////////////////////////////////////////////////////
// ACTIONS

const fetchUsers = () =>
    ({
        type: 'FETCH_USERS',
        payload: {
            request: {
                url: '/users',
            },
        }
    });

const fetchBrokenUsers = () =>
    ({
        type: 'FETCH_USERS',
        payload: {
            request: {
                url: '/failed_users',
            },
        }
    });

///////////////////////////////////////////////////////////////
// COMPONENTS

const _Status = ({fetching, didFail}) =>
    <div>
        {!!fetching &&
            <div className="progress"><div className="indeterminate"></div></div>
        }
        {!!didFail &&
            <div className="card-panel red darken-4">
                Ooops something went wrong :(</div>
        }
    </div>

const _UsersBtn = ({dispatch}) =>
    <span>
        <a className="waves-effect waves-light btn"
           onClick={() => dispatch(fetchUsers())}>Fetch Users</a>
        <a className="waves-effect waves-light btn"
           style={{marginLeft: 10}}
           onClick={() => dispatch(fetchBrokenUsers())}>Fetch Broken Users</a>
    </span>

const _UserListView = ({users}) =>
    <ul className="collection">
        {
            users.map(user => <li className="collection-item" key={user.id}>{user.email}</li>)
        }
    </ul>

const App = () =>
    <section style={{margin: 60}}>
        <UsersBtn />
        <Status />
        <UserListView />
    </section>

const Status = connect(state => state)(_Status)
const UsersBtn = connect()(_UsersBtn)
const UserListView = connect(state => state)(_UserListView)


///////////////////////////////////////////////////////////////
// MAIN

window.main = () => {
    const client = axios.create({
        baseURL: DUMMY_API,
        responseType: 'json'
    });

    const store = createStore(
        rootReducer,
        applyMiddleware(
            axiosMiddleware(client),
        )
    );

    DOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.querySelector('main')
    );
};
