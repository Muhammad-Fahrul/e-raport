import { lazy } from 'react';

export function lazyLoad(path) {
  return lazy(() => {
    const [x, y, z, filename] = path.split('/');
    return import(`./${x}/${y}/${z}/${filename}.jsx`);
  });
}
