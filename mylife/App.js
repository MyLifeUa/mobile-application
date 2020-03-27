import Profile from './screens/Profile'
import Login from './screens/Login'
import Register from './screens/Register'


export default function App() {
    return (
        <Login></Login>
    );
}


function getData(access_token) {
    fetch('https://api.fitbit.com/1.2/user/-/sleep/date/2017-06-27.json', {
    method: 'GET',
    headers: {
    Authorization: `Bearer ${access_token}`,
    },
    // body: `root=auto&path=${Math.random()}`
    })
    .then(res => res.json())
    .then(res => {
    console.log(`res: ${JSON.stringify(res)}`);
    })
    .catch(err => {
    console.error('Error: ', err);
    });
}