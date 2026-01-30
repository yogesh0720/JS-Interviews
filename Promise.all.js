/*
Promise → single async task
Promise.all → multiple async tasks in parallel

Note:
If any promise fails, Promise.all rejects immediately.
*/
function fetchUser() {
  return "fetchUser..";
}
function fetchOrders() {
  //return "fetchOrders..";
  throw new Error("Errror in fetchOrders");
}
Promise.all([fetchUser(), fetchOrders()]).then(([user, orders]) => {
  console.log(user, orders);
});
