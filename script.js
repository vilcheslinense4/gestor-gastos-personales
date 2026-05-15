const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 1. Obtener datos de LocalStorage
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

// Si hay algo guardado, lo carga; si no, empieza con una lista vacía
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 2. Añadir nueva transacción
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Por favor, añade un concepto y una cantidad');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value // El + lo convierte de texto a número
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// 3. Generar ID aleatorio
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// 4. Mostrar la transacción en la lista (HTML)
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Añadir clase basada en el valor (positivo o negativo)
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}€</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// 5. Actualizar el saldo, ingresos y gastos
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balance.innerText = `${total}€`;
  money_plus.innerText = `+${income}€`;
  money_minus.innerText = `-${expense}€`;
}

// 6. Eliminar transacción por ID
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// 7. Actualizar LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 8. Inicializar la App
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
