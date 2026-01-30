/*
useMemo memoizes values
useCallback memoizes functions

Note: Used to prevent unnecessary recalculations and re-renders.
*/

const filteredUsers = useMemo(() => {
  return users.filter((u) => u.active);
}, [users]);

const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);
