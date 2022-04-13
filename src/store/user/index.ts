import { useSelector } from 'react-redux';
import { userSelector } from './selectors';

export type { TUserState } from './types';
export { default, UserState } from './slice';
export const useUser = () => useSelector(userSelector)