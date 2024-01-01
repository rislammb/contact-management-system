const tableKey = 'cms-table';
let cmsTable;

const enableDisableNameInput = option => {
  const newPersonName = document.getElementById('newPersonName');
  if (option === 'enable') {
    newPersonName.disabled = false;
  } else if (option === 'disable') newPersonName.disabled = true;
};

const refreshDOMTable = () => {
  if (localStorage.getItem(tableKey)) {
    cmsTable = JSON.parse(localStorage.getItem(tableKey));
  } else {
    cmsTable = {};
  }

  let cmsTableKeys = Object.keys(cmsTable); // ['Boby Tones', 'George Romario']

  const tableContainer = document.getElementById('cmsTableContainer');
  const oldTableBody = document.getElementById('tableBody');
  tableContainer.removeChild(oldTableBody);

  let newTableBody = document.createElement('span');
  newTableBody.id = 'tableBody';

  for (let i = 0; i < cmsTableKeys.length; i++) {
    const currentRow = document.createElement('div');
    currentRow.className = 'cms-table-row';

    const currentNameCol = document.createElement('div');
    currentNameCol.className = 'cms-table-column cms-name';
    currentNameCol.innerHTML = cmsTableKeys[i];
    currentRow.appendChild(currentNameCol);

    const currentPhoneCol = document.createElement('div');
    currentPhoneCol.className = 'cms-table-column cms-phone';
    currentPhoneCol.innerHTML = cmsTable[cmsTableKeys[i]].phone;
    currentRow.appendChild(currentPhoneCol);

    const currentAdressCol = document.createElement('div');
    currentAdressCol.className = 'cms-table-column cms-address';
    currentAdressCol.innerHTML = cmsTable[cmsTableKeys[i]].address;
    currentRow.appendChild(currentAdressCol);

    const currentEditBtn = document.createElement('div');
    currentEditBtn.className = 'cms-table-column cms-edit';
    currentEditBtn.innerHTML = '<img src="./pen.png" alt="edit" width="24" />';
    currentRow.appendChild(currentEditBtn);

    const currentDeleteBtn = document.createElement('div');
    currentDeleteBtn.className = 'cms-table-column cms-delete';
    currentDeleteBtn.innerHTML = '<i class="img src="./trash-bin.png" alt="delete" width="24" />';
    currentRow.appendChild(currentDeleteBtn);

    newTableBody.appendChild(currentRow);
  }
  tableContainer.appendChild(newTableBody);

  const addNewEntryBtn = document.getElementById('cmsAddNewEntry');
  addNewEntryBtn.addEventListener('click', () => {
    enableDisableNewUserModal('enable');
    enableDisableNameInput('enable');
  });

  const newPersonSubmitBtn = document.getElementById('newPersonSubmitBtn');
  const newPersonCancelBtn = document.getElementById('newPersonCancelBtn');

  newPersonSubmitBtn.addEventListener('click', $event => {
    $event.preventDefault();
    if (inputValid()) {
      addNewPerson();
    } else {
      if (document.querySelector('.input-err'))
        document.querySelector('.input-err').remove();
      const alertDiv = document.createElement('div');
      alertDiv.className = 'input-err';
      alertDiv.innerText = 'Input must not be empty';
      const nameInputDiv = document.getElementById('nameInputDiv');
      newPersonModal.insertBefore(alertDiv, nameInputDiv);

      setTimeout(() => document.querySelector('.input-err').remove(), 1200);
    }
  });

  newPersonCancelBtn.addEventListener('click', $event => {
    $event.preventDefault();
    enableDisableNewUserModal('disable');
  });

  const editBtns = document.getElementsByClassName('cms-edit');
  const deleteBtns = document.getElementsByClassName('cms-delete');

  for (let i = 0; i < editBtns.length; i++) {
    editBtns[i].addEventListener('click', $event => {
      enableDisableNewUserModal('enable');
      const nameToEdit = $event.target.parentElement.children[0].innerText;
      const personToEdit = cmsTable[nameToEdit];

      const newPersonName = document.getElementById('newPersonName');
      const newPersonPhone = document.getElementById('newPersonPhone');
      const newPersonAddress = document.getElementById('newPersonAddress');
      newPersonName.value = nameToEdit;
      newPersonPhone.value = personToEdit.phone;
      newPersonAddress.value = personToEdit.address;

      enableDisableNameInput('disable');
    });
  }

  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener('click', $event => {
      const nameToDelete = $event.target.parentElement.children[0].innerText;
      let isSure = window.confirm(
        'Are you sure you want to delete ' + nameToDelete + '?'
      );
      if (isSure) deleteUserFromTable(nameToDelete);
    });
  }
};

const enableDisableNewUserModal = option => {
  document.getElementById('newPersonName').value = '';
  document.getElementById('newPersonPhone').value = '';
  document.getElementById('newPersonAddress').value = '';
  const newPersonModal = document.getElementById('newPersonModal');
  newPersonModal.className = `${option}-modal`;
  const backdrop = document.getElementById('backdrop');
  backdrop.className = `${option}-modal`;
};

const inputValid = () => {
  let newPersonName = document.getElementById('newPersonName').value.trim();
  let newPersonPhone = document.getElementById('newPersonPhone').value.trim();
  let newPersonAddress = document
    .getElementById('newPersonAddress')
    .value.trim();
  if (newPersonName === '' || newPersonPhone === '' || newPersonAddress === '')
    return false;
  else return true;
};

const addNewPerson = () => {
  let newPersonName = document.getElementById('newPersonName').value.trim();
  let newPersonPhone = document.getElementById('newPersonPhone').value.trim();
  let newPersonAddress = document
    .getElementById('newPersonAddress')
    .value.trim();

  cmsTable[newPersonName] = {
    phone: newPersonPhone,
    address: newPersonAddress
  };
  localStorage.setItem(tableKey, JSON.stringify(cmsTable));
  enableDisableNewUserModal('disable');
  refreshDOMTable();
};

const deleteUserFromTable = userName => {
  let tempTable = {};
  let cmsTableKeys = Object.keys(cmsTable);
  for (let i = 0; i < cmsTableKeys.length; i++) {
    if (userName !== cmsTableKeys[i])
      tempTable[cmsTableKeys[i]] = cmsTable[cmsTableKeys[i]];
  }
  cmsTable = tempTable;
  localStorage.setItem(tableKey, JSON.stringify(cmsTable));
  refreshDOMTable();
};

refreshDOMTable();
