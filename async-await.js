//async/await is syntactic sugar over promises, making async code look synchronous.

function fetchUser() {
  return "fetchUser..";
}
function fetchOrders() {
  //return "fetchOrders..";
  throw new Error("Errror in fetchOrders");
}

async function loadData() {
  const user = await fetchUser();
  const orders = await fetchOrders();
  console.log(user, orders);
}
loadData();
