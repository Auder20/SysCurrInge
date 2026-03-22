import { useContext } from 'react';
import CoordinatorContext from '../context/CoordinatorContext';

const useCoordinator = () => {
  const context = useContext(CoordinatorContext);
  
  if (!context) {
    throw new Error('useCoordinator must be used within a CoordinatorProvider');
  }
  
  return context;
};

export default useCoordinator;
