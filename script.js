// === Aplikasi Manajemen Stok Barang ===
// Penyimpanan data menggunakan localStorage

// ---------- Variabel global ----------
let currentUser = null;
let selectedBarangIndex = null;
let dataBarang = JSON.parse(localStorage.getItem("dataBarang")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

// ---------- Utility ----------
function saveData() {
  localStorage.setItem("dataBarang", JSON.stringify(dataBarang));
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// ---------- Login & Register ----------
function registerUser() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!username || !password) {
    alert("Isi semua kolom!");
    return;
  }
  if (users.find(u => u.username === username)) {
    alert("Username sudah terdaftar!");
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registrasi berhasil! Silakan login.");
  showPage("loginPage");
}

function loginUser() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Username atau password salah!");
    return;
  }
  currentUser = user;
  showPage("mainPage");
  renderTable();
}

function logout() {
  currentUser = null;
  showPage("loginPage");
}

// ---------- Manajemen Barang ----------
function renderTable() {
  const tbody = document.getElementById("barangTable");
  tbody.innerHTML = "";

  dataBarang.forEach((b, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${b.kode}</td>
      <td>${b.nama}</td>
      <td>${b.jumlah}</td>
      <td>${b.kategori}</td>
      <td>
        <button onclick="editBarang(${i})">✏️</button>
        <button onclick="hapusBarang(${i})">🗑️</button>
        <button onclick="barangMasuk(${i})">➕</button>
        <button onclick="barangKeluar(${i})">➖</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function tambahBarang() {
  const kode = document.getElementById("kode").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const kategori = document.getElementById("kategori").value.trim();

  if (!kode || !nama || isNaN(jumlah)) {
    alert("Isi semua kolom dengan benar!");
    return;
  }

  if (selectedBarangIndex === null) {
    // tambah baru
    dataBarang.push({ kode, nama, jumlah, kategori });
  } else {
    // edit
    dataBarang[selectedBarangIndex] = { kode, nama, jumlah, kategori };
    selectedBarangIndex = null;
  }

  saveData();
  clearForm();
  renderTable();
}

function clearForm() {
  document.getElementById("kode").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("jumlah").value = "";
  document.getElementById("kategori").value = "";
}

function editBarang(index) {
  const b = dataBarang[index];
  document.getElementById("kode").value = b.kode;
  document.getElementById("nama").value = b.nama;
  document.getElementById("jumlah").value = b.jumlah;
  document.getElementById("kategori").value = b.kategori;
  selectedBarangIndex = index;
}

function hapusBarang(index) {
  if (confirm("Yakin ingin menghapus barang ini?")) {
    dataBarang.splice(index, 1);
    saveData();
    renderTable();
  }
}

function barangMasuk(index) {
  const jumlahMasuk = parseInt(prompt("Jumlah barang masuk:"));
  if (!isNaN(jumlahMasuk) && jumlahMasuk > 0) {
    dataBarang[index].jumlah += jumlahMasuk;
    saveData();
    renderTable();
  }
}

function barangKeluar(index) {
  const jumlahKeluar = parseInt(prompt("Jumlah barang keluar:"));
  if (!isNaN(jumlahKeluar) && jumlahKeluar > 0) {
    if (dataBarang[index].jumlah >= jumlahKeluar) {
      dataBarang[index].jumlah -= jumlahKeluar;
      saveData();
      renderTable();
    } else {
      alert("Stok tidak mencukupi!");
    }
  }
}

// ---------- Import dari Excel ----------
function importExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const rows = text.split("\n").map(r => r.split(","));

    // Asumsi format CSV: kode,nama,jumlah,kategori
    for (let i = 1; i < rows.length; i++) {
      const [kode, nama, jumlah, kategori] = rows[i];
      if (kode && nama && !isNaN(parseInt(jumlah))) {
        dataBarang.push({
          kode: kode.trim(),
          nama: nama.trim(),
          jumlah: parseInt(jumlah),
          kategori: kategori ? kategori.trim() : "",
        });
      }
    }
    saveData();
    renderTable();
  };
  reader.readAsText(file);
}

// ---------- Inisialisasi ----------
document.addEventListener("DOMContentLoaded", function () {
  showPage("loginPage");
});
function logout(){
  clearSession(() => {
    currentUser = null;
    currentRole = "user";
    mainPage.style.display = "none";
    loginPage.style.display = "block";
    // sembunyikan admin tools saat logout
    const tools = document.getElementById("adminTools");
    if(tools) tools.style.display = "none";
  });
}
