import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

import { selectCurrentToken } from '../pages/auth/redux/authSlice';

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isMentor = false;
  let isStudent = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { id, username, role, urlImg } = decoded.user;

    isMentor = role === 'mentor';
    isStudent = role === 'student';

    return { id, username, role, urlImg, isMentor, isStudent };
  }

  return { id: '', username: '', role: null, isMentor, isStudent };
};
export default useAuth;
