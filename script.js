const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const monthFilter = document.getElementById('month-filter');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Por favor, rellena los campos');
    return;
  }

  const transaction = {
    id: Math.floor(Math.random() * 100000000),
    text: text.value,
    amount: +amount.value,
    date: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  };

  transactions.push(transaction);
  updateUI();
  
  text.value = '';
  amount.value = '';
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
}

function updateUI() {
  list.innerHTML = '';
  
  // 1. Llenar el filtro de meses sin duplicados y sin undefined
  const months = [...new Set(transactions.map(t => t.date))].filter(m => m != null);
  const currentFilter = monthFilter.value;
  
  monthFilter.innerHTML = '<option value="all">Todos los meses</option>';
  months.forEach(m => {
    const option = document.createElement('option');
    option.value = m;
    option.text = m;
    monthFilter.appendChild(option);
  });
  monthFilter.value = currentFilter;

  // 2. Filtrar transacciones
  const filtered = monthFilter.value === 'all' 
    ? transactions 
    : transactions.filter(t => t.date === monthFilter.value);

  // 3. Dibujar lista
  filtered.forEach(t => {
    const sign = t.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(t.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
      <div>
        <strong>${t.text}</strong><br>
        <small style="color:#aaa">${t.date}</small>
      </div>
      <div class="right-side">
        <span>${sign}${Math.abs(t.amount)}€</span>
        <button class="delete-btn" onclick="removeTransaction(${t.id})">Borrar</button>
      </div>
    `;
    list.appendChild(item);
  });

  // 4. Actualizar totales
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `${total}€`;
  money_plus.innerText = `+${income}€`;
  money_minus.innerText = `-${expense}€`;

  localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', addTransaction);
monthFilter.addEventListener('change', updateUI);

// Iniciar app
updateUI();
