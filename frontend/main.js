import './style.css';
const API_BASE = 'http:
let token = localStorage.getItem('token');
let employees = [];
let editId = null;
let deleteId = null;
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const employeeModal = document.getElementById('employee-modal');
const closeEmployeeModalBtn = document.getElementById('close-modal-btn');
const cancelEmployeeModalBtn = document.getElementById('cancel-modal-btn');
const employeeForm = document.getElementById('employee-form');
const modalTitle = document.getElementById('modal-title');
const employeesTbody = document.getElementById('employees-tbody');
const emptyState = document.getElementById('empty-state');
const tableContainer = document.querySelector('.table-container');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const searchInput = document.getElementById('search-input');
const toastContainer = document.getElementById('toast-container');
function init() {
  if (token) {
    showDashboard();
    fetchEmployees();
  } else {
    showLogin();
  }
}
function showLogin() {
  loginView.classList.remove('hidden');
  dashboardView.classList.add('hidden');
}
function showDashboard() {
  loginView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
}
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="ph ${type === 'success' ? 'ph-check-circle' : 'ph-x-circle'}"></i>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}
function handleAuthError(res) {
  if (res.status === 401 || res.status === 403) {
    logout();
    showToast('Session expired. Please login again.', 'error');
    throw new Error('Unauthorized');
  }
  return res;
}
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const btn = loginForm.querySelector('button');
  const orgHtml = btn.innerHTML;
  btn.innerHTML = 'Connecting...';
  btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    token = data.token;
    localStorage.setItem('token', token);
    showToast('Login successful!');
    showDashboard();
    fetchEmployees();
    loginForm.reset();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.innerHTML = orgHtml;
    btn.disabled = false;
  }
});
function logout() {
  token = null;
  localStorage.removeItem('token');
  showLogin();
}
logoutBtn.addEventListener('click', logout);
async function fetchEmployees() {
  try {
    const res = await fetch(`${API_BASE}/employees`, { headers: getHeaders() });
    handleAuthError(res);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    employees = data.employees || [];
    renderEmployees(employees);
  } catch (err) {
    if(err.message !== 'Unauthorized') showToast(err.message, 'error');
  }
}
function renderEmployees(dataToRender) {
  employeesTbody.innerHTML = '';
  if (dataToRender.length === 0) {
    emptyState.classList.remove('hidden');
    tableContainer.classList.add('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  tableContainer.classList.remove('hidden');
  dataToRender.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${emp.employee_id}</strong></td>
      <td>
        <div style="display: flex; flex-direction: column;">
          <strong>${emp.full_name}</strong>
          <span style="font-size: 0.8rem; color: var(--color-text-muted)">Joined ${new Date(emp.joining_date).toLocaleDateString()}</span>
        </div>
      </td>
      <td><span style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">${emp.department}</span></td>
      <td>${emp.designation}</td>
      <td>${emp.email}<br><span style="font-size: 0.8rem; color: var(--color-text-muted)">${emp.phone_number}</span></td>
      <td class="actions-cell">
        <button class="icon-btn action-edit" onclick="openEditModal(${emp.id})"><i class="ph ph-pencil-simple"></i></button>
        <button class="icon-btn action-delete" onclick="openDeleteModal(${emp.id})"><i class="ph ph-trash"></i></button>
      </td>
    `;
    employeesTbody.appendChild(tr);
  });
}
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = employees.filter(emp => 
    emp.full_name.toLowerCase().includes(term) || 
    emp.employee_id.toLowerCase().includes(term) ||
    emp.department.toLowerCase().includes(term) ||
    emp.email.toLowerCase().includes(term)
  );
  renderEmployees(filtered);
});
function openModal() { employeeModal.classList.remove('hidden'); }
function closeModal() { 
  employeeModal.classList.add('hidden'); 
  employeeForm.reset();
  editId = null;
}
addEmployeeBtn.addEventListener('click', () => {
  modalTitle.textContent = 'Add New Employee';
  document.getElementById('emp-string-id').disabled = false;
  openModal();
});
closeEmployeeModalBtn.addEventListener('click', closeModal);
cancelEmployeeModalBtn.addEventListener('click', closeModal);
employeeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    employee_id: document.getElementById('emp-string-id').value,
    full_name: document.getElementById('emp-name').value,
    email: document.getElementById('emp-email').value,
    phone_number: document.getElementById('emp-phone').value,
    department: document.getElementById('emp-dept').value,
    designation: document.getElementById('emp-designation').value,
    salary: parseFloat(document.getElementById('emp-salary').value),
    joining_date: document.getElementById('emp-join').value
  };
  const btn = employeeForm.querySelector('button[type="submit"]');
  const orgHtml = btn.innerHTML;
  btn.innerHTML = 'Saving...';
  btn.disabled = true;
  try {
    const isEdit = !!editId;
    const url = isEdit ? `${API_BASE}/employees/${editId}` : `${API_BASE}/employees`;
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    handleAuthError(res);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast(`Employee ${isEdit ? 'updated' : 'added'} successfully!`);
    closeModal();
    fetchEmployees();
  } catch(err) {
    if(err.message !== 'Unauthorized') showToast(err.message, 'error');
  } finally {
    btn.innerHTML = orgHtml;
    btn.disabled = false;
  }
});
window.openEditModal = (id) => {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;
  editId = emp.id;
  modalTitle.textContent = 'Edit Employee';
  document.getElementById('emp-string-id').value = emp.employee_id;
  document.getElementById('emp-string-id').disabled = true; 
  document.getElementById('emp-name').value = emp.full_name;
  document.getElementById('emp-email').value = emp.email;
  document.getElementById('emp-phone').value = emp.phone_number;
  document.getElementById('emp-dept').value = emp.department;
  document.getElementById('emp-designation').value = emp.designation;
  document.getElementById('emp-salary').value = emp.salary;
  document.getElementById('emp-join').value = emp.joining_date.split('T')[0]; 
  openModal();
};
window.openDeleteModal = (id) => {
  deleteId = id;
  deleteModal.classList.remove('hidden');
};
function closeDeleteModal() {
  deleteId = null;
  deleteModal.classList.add('hidden');
}
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
confirmDeleteBtn.addEventListener('click', async () => {
  if (!deleteId) return;
  const btn = confirmDeleteBtn;
  const orgHtml = btn.innerHTML;
  btn.innerHTML = 'Deleting...';
  btn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/employees/${deleteId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    handleAuthError(res);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showToast('Employee deleted successfully');
    closeDeleteModal();
    fetchEmployees();
  } catch(err) {
    if(err.message !== 'Unauthorized') showToast(err.message, 'error');
  } finally {
    btn.innerHTML = orgHtml;
    btn.disabled = false;
  }
});
init();
