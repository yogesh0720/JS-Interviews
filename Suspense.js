/*
React Suspense lets components “wait” for async operations like code-splitting or data fetching and show fallback UI.

Cleaner async UI handling and better UX.
*/

const Dashboard = React.lazy(() => import("./Dashboard"));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>;
