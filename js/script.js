const navbarNav = document.querySelector(".navbar-nav");
const menuButton = document.querySelector("#menu-button");

menuButton.addEventListener("click", (event) => {
  event.preventDefault();

  navbarNav.classList.toggle("active");
});

document.querySelectorAll(".navbar-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navbarNav.classList.remove("active");
  });
});

const orderForm = document.querySelector("#order-form");

const customerName = document.querySelector("#customer-name");
const coffeeMenu = document.querySelector("#coffee-menu");
const quantity = document.querySelector("#quantity");

const resultMessage = document.querySelector("#result-message");
const resultDetail = document.querySelector("#result-detail");

const menuOrderButtons = document.querySelectorAll(".menu-order-button");

menuOrderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedMenu = button.dataset.menu;

    coffeeMenu.value = selectedMenu;

    document.querySelector("#order").scrollIntoView({
      behavior: "smooth",
    });

    customerName.focus();
  });
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nama = customerName.value.trim();
  const menu = coffeeMenu.value;
  const jumlah = Number(quantity.value);

  if (nama === "") {
    showError("Nama harus diisi.");
    return;
  }

  if (menu === "") {
    showError("Silakan pilih menu.");
    return;
  }

  if (jumlah < 1) {
    showError("Jumlah pesanan minimal 1.");
    return;
  }

  const formData = new FormData();

  formData.append("nama", nama);
  formData.append("menu", menu);
  formData.append("jumlah", jumlah);

  try {
    const response = await fetch("backend/proses_pesanan.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.status) {
      showError(result.message);
      return;
    }

    resultMessage.textContent = result.message;

    resultDetail.innerHTML = `
      <p>
        <strong>Nama:</strong>
        ${escapeHTML(result.data.nama)}
      </p>

      <p>
        <strong>Menu:</strong>
        ${escapeHTML(result.data.menu)}
      </p>

      <p>
        <strong>Harga:</strong>
        ${formatRupiah(result.data.harga)}
      </p>

      <p>
        <strong>Jumlah:</strong>
        ${result.data.jumlah}
      </p>

      <div class="result-total">
        Total:
        ${formatRupiah(result.data.total)}
      </div>
    `;

    orderForm.reset();
  } catch (error) {
    console.error(error);

    showError("Tidak dapat terhubung ke server.");
  }
});

function showError(message) {
  resultMessage.innerHTML = `
    <span class="error-message">
      ${escapeHTML(message)}
    </span>
  `;

  resultDetail.innerHTML = "";
}

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

function escapeHTML(text) {
  const element = document.createElement("div");

  element.textContent = text;

  return element.innerHTML;
}
