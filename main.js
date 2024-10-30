let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let phoneInput = document.getElementById("phone");
let addressInput = document.getElementById("address");
let submitButton = document.getElementById("submit-btn");

let editingUserId = null;

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if(nameInput.value.length === 0 || emailInput.value.length === 0 || phoneInput.value.length === 0 || addressInput.value.length === 0  ){
    alert("Please fill all the Input")
    return;
  }
  let cleanedPhone = phoneInput.value.replace(/[-+]/g, '');
  if (!cleanedPhone.match(/^\d{1,30}$/)) {
    alert("Phone Number is invalid");
    return;
  }

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

function renderUserTable(searchType = "", searchValue = "") {
  const userTable = document.getElementById("userTable");
  userTable.innerHTML = "";

  let userData = JSON.parse(localStorage.getItem("users")) || [];

  
  if (searchType && searchValue) {
    userData = userData.filter((user) => {
      if (searchType === "Search") {
        // Search: case-insensitive 
        return (
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.address.toLowerCase().includes(searchValue.toLowerCase())
        );
      } else if (searchType === "Filter") {
        // Filter: exact, case-sensitive 
        return (
          user.name === searchValue ||
          user.email === searchValue ||
          user.phone === searchValue ||
          user.address === searchValue
        );
      }
      return true;
    });
  }

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



function deleteUser(userId) {
  console.log({ userId });
  console.log("deleteUser called")
  let userData = JSON.parse(localStorage.getItem("users"));
  console.log({userData})
  userData = userData.filter((user) => user.id !== Number(userId));
  console.log({userData})
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





function handleSearchOrFilter() {
  
  const selectElement = document.getElementById("actionSelect");
  const selectedOption = selectElement.options[selectElement.selectedIndex].text;
  
  const inputValue = document.getElementById("search").value;
  
  renderUserTable(selectedOption, inputValue);
}



renderUserTable();
