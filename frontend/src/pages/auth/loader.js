import { redirect } from 'react-router-dom';

const loader = async () => {
  const isLogin = JSON.parse(localStorage.getItem('login'));
  if (isLogin) {
    return redirect('/', { replace: true });
  }
  return null;
};

export { loader };
