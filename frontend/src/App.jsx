import './App.css';

import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';

import store from './app/store.js';
import { ROLES } from './config/roles.js'
import { lazyLoad } from './lazyLoad.js';

import MainLayout from './layout/MainLayout';
import PersistLogin from './layout/PersistLogin.jsx';
import RequireAuth from './layout/RequireAuth.jsx';

const NotFound = lazyLoad('pages/public/notFound/NotFound');
const Register = lazyLoad('pages/auth/register/Register');
const Login = lazyLoad('pages/auth/login/Login');
import { loader as loginLoader } from './pages/auth/loader.js';

const UserList = lazyLoad('pages/user/userList/UserList');
const User = lazyLoad('pages/user/user/User');
const EditUser = lazyLoad('pages/user/editUser/EditUser');
const RecordList = lazyLoad('pages/record/recordList/RecordList');

const Home = lazyLoad('pages/user/home/Home');
const Dashboard = lazyLoad('pages/user/dashboard/Dashboard');
const Profile = lazyLoad('pages/user/profile/Profile');

const Raport = lazyLoad('pages/raport/raport/Raport');
const StudentList = lazyLoad('pages/student/studentList/StudentList');
const Student = lazyLoad('pages/student/editStudent/Student');

const BooleanType = lazyLoad('pages/report/booleanType/BooleanType');
const ArrayType = lazyLoad('pages/report/arrayType/ArrayType');

const allRoles = [...Object.values(ROLES)];

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} loader={loginLoader} />

      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth roles={allRoles} />}>
          <Route index element={<Home />} />
          <Route path="me" element={<Profile />} />
          <Route path="me/edit" element={<EditUser />} />

          <Route path="users">
            <Route index element={<UserList />} />
            <Route path=":username" element={<User />} />
          </Route>

          <Route
            path="students/:username/records/:raportId"
            element={<RecordList />}
          />

          <Route path="mentor" element={<RequireAuth roles={[ROLES.mentor]} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports" element={<BooleanType />} />
            <Route path="reports/array" element={<ArrayType />} />
            <Route path="raports/:raportId" element={<Raport />} />
            <Route path="students">
              <Route index element={<StudentList />} />
              <Route path=":username" element={<Student />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
