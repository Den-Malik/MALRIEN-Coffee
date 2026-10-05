<?php

header("Content-Type: application/json");

require_once "../config/database.php";


// =========================
// MENERIMA DATA
// =========================

$nama = trim($_POST["nama"] ?? "");
$menu = trim($_POST["menu"] ?? "");
$jumlah = intval($_POST["jumlah"] ?? 0);


// =========================
// VALIDASI
// =========================

if ($nama === "") {
    echo json_encode([
        "status" => false,
        "message" => "Nama harus diisi."
    ]);

    exit;
}


if ($menu === "") {
    echo json_encode([
        "status" => false,
        "message" => "Menu kopi harus dipilih."
    ]);

    exit;
}


if ($jumlah < 1) {
    echo json_encode([
        "status" => false,
        "message" => "Jumlah pesanan minimal 1."
    ]);

    exit;
}


// =========================
// DATA MENU
// =========================

$coffeeMenu = [
    "americano" => [
        "name" => "Americano",
        "price" => 20000
    ],

    "cappuccino" => [
        "name" => "Cappuccino",
        "price" => 25000
    ],

    "caramel-latte" => [
        "name" => "Caramel Latte",
        "price" => 28000
    ]
];


if (!array_key_exists($menu, $coffeeMenu)) {
    echo json_encode([
        "status" => false,
        "message" => "Menu yang dipilih tidak tersedia."
    ]);

    exit;
}


// =========================
// PROSES DATA
// =========================

$selectedCoffee = $coffeeMenu[$menu];

$namaMenu = $selectedCoffee["name"];
$harga = $selectedCoffee["price"];

$total = $harga * $jumlah;


// =========================
// SIMPAN DATABASE
// =========================

$sql = "INSERT INTO pesanan
        (nama, menu, harga, jumlah, total)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssiii",
    $nama,
    $namaMenu,
    $harga,
    $jumlah,
    $total
);


if ($stmt->execute()) {

    echo json_encode([
        "status" => true,
        "message" => "Pesanan berhasil disimpan.",
        "data" => [
            "nama" => $nama,
            "menu" => $namaMenu,
            "harga" => $harga,
            "jumlah" => $jumlah,
            "total" => $total
        ]
    ]);

} else {

    echo json_encode([
        "status" => false,
        "message" => "Pesanan gagal disimpan."
    ]);
}


$stmt->close();
$conn->close();

?>