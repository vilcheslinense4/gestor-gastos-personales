const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const monthFilter = document.getElementById('month-filter');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Añade concepto y cantidad');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    };
    transactions.push(transaction);
    updateUI();
    text.value = '';
    amount.value = '';
  }
}

function generateID() { return Math.floor(Math.random() * 100000000); }

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
  item.innerHTML = `
    <div>
      <strong>${transaction.text}</strong> <br>
      <small style="color: #aaa; font-size: 0.7rem;">${transaction.date}</small>
    </div>
    <div class="list-info">
      <span>${sign}${Math.abs(transaction.amount)}€</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Borrar</button>
    </div>
  `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `${total}€`;
  money_plus.innerText = `+${income}€`;
  money_minus.innerText = `-${expense}€`;
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function fillFilter() {
  const currentSelection = monthFilter.value;
  const months = [...new Set(transactions.map(t => t.date))];
  monthFilter.innerHTML = '<option value="all">Todos los meses</option>';
  months.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    option.text = month;
    monthFilter.appendChild(option);
  });
  monthFilter.value = currentSelection;
}

function updateUI() {
  list.innerHTML = '';
  const filterValue = monthFilter.value;
  const filtered = filterValue === 'all' 
    ? transactions 
    : transactions.filter(t => t.date === filterValue);
  
  filtered.forEach(addTransactionDOM);
  updateValues();
  updateLocalStorage();
  fillFilter();
}

monthFilter.addEventListener('change', updateUI);
form.addEventListener('submit', addTransaction);

// Inicializar
updateUI();
