const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusMessage = document.querySelector("#status");
const usersList = document.querySelector("#users-list");
let users = [];
function renderUsers(list) {
  usersList.innerHTML = "";
  if (list.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No users match your filter.";
    usersList.appendChild(li);
    return;
  }
  list.forEach((user) => {
    const li = document.createElement("li");
    const name = document.createElement("h3");
    name.textContent = user.name;
    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;
    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;
    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;
    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(city);
    li.appendChild(company);
    usersList.appendChild(li);
  });
}
async function loadUsers() {
  try {
    loadButton.disabled = true;
    statusMessage.textContent = "Loading users...";
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    users = await response.json();
    renderUsers(users);
    statusMessage.textContent = `Successfully loaded ${users.length} users.`;
  } catch (error) {
    statusMessage.textContent = "Error loading users. Please try again.";
  } finally {
    loadButton.disabled = false;
  }
}
loadButton.addEventListener("click", loadUsers);
filterInput.addEventListener("input", () => {
  const searchText = filterInput.value.toLowerCase();
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );
  renderUsers(filteredUsers);
});
