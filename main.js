let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let phoneInput = document.getElementById("phone");
let addressInput = document.getElementById("address");
let submitButton = document.getElementById("submit-btn");

let editingUserId = null;

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newData = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    id: editingUserId || new Date().getTime(),
  };

  let existingData = JSON.parse(localStorage.getItem("users")) || [];

  if (editingUserId) {
    existingData = existingData.map((user) =>
      user.id === editingUserId ? newData : user
    );
    editingUserId = null;
  } else {
    existingData.push(newData);
  }

  localStorage.setItem("users", JSON.stringify(existingData));
  console.log("Data stored:", existingData);

  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  addressInput.value = "";
  submitButton.innerHTML = "Add New User";

  renderUserTable();
});

function renderUserTable() {
  const userTable = document.getElementById("userTable");
  userTable.innerHTML = "";

  const userData = JSON.parse(localStorage.getItem("users")) || [];
  console.log("renderUserTable: ", userData);

  userData.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.address}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editUser('${
            user.id
          }')">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteUser('${
            user.id
          }')">Delete</button>
        </td>
      `;
    userTable.appendChild(row);
  });
}

renderUserTable();

function deleteUser(userId) {
  console.log({ userId });
  let userData = JSON.parse(localStorage.getItem("users"));
  userData = userData.filter((user) => user.id !== userId);
  localStorage.setItem("users", JSON.stringify(userData));
  renderUserTable();
}

function editUser(userId) {
  console.log("Editing user with ID:", userId);
  let userData = JSON.parse(localStorage.getItem("users"));
  console.log({ userData });
  const userToEdit = userData.find((user) => user.id === Number(userId));

  console.log({ userToEdit });

  if (userToEdit) {
    nameInput.value = userToEdit.name;
    emailInput.value = userToEdit.email;
    phoneInput.value = userToEdit.phone;
    addressInput.value = userToEdit.address;

    editingUserId = userToEdit.id;
    submitButton.innerHTML = "Update";
  }
}
