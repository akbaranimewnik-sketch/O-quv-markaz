# RENESANS O'QUV MARKAZI - LMS & CRM VEB PLATFORMASI

Zamonaviy, tezkor va to'liq funksional o'quv markaz boshqaruv tizimi (CRM / LMS). Tizim 3 ta asosiy boshqaruv panelidan iborat: **Admin Panel**, **Menijer Panel** va **O'qituvchi Panel**.

---

## 🚀 Loyihani Ishga Tushirish

Loyihani hech qanday murakkab kutubxonalarsiz, to'g'ridan-to'g'ri ishga tushirish mumkin:

### 1-usul: Node.js orqali (Mahalliy server)
Buyruqlar qatorida (Terminal yoki PowerShell):
```bash
node server.js
```
So'ng brauzerda oching:
👉 **[http://localhost:3000](http://localhost:3000)**

### 2-usul: To'g'ridan-to'g'ri brauzerda ochish
Loyihaning `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox) ikki marta bosib ochishingiz mumkin. Barcha ma'lumotlar brauzerning `localStorage` xotirasida xavfsiz saqlanadi.

---

## 📌 Asosiy Panellar va Imkoniyatlar

### 1. 🛡️ Admin Panel (Administrator)
* **O'quvchi qo'shish & boshqarish:** Yangi o'quvchi qo'shish, ma'lumotlarini tahrirlash, guruhga biriktirish va o'chirish.
* **O'quvchilarning telefon raqamlari:** Har bir o'quvchining o'z shaxsiy telefon raqami (`+998 XX XXX-XX-XX`) jadvalda juda aniq ko'rinib turadi. Bir bosishda qo'ng'iroq qilish (`tel:`) yoki Telegram orqali xabar yozish imkoniyati mavjud. Ota-onasi raqami ham biriktirilgan.
* **O'qituvchi qo'shish & boshqarish:** Yangi ustozlarni fani, oylik maoshi va ish tajribasi bilan tizimga kiritish.
* **O'qituvchi qilgan davomatni ko'rish:** O'qituvchi dars vaqtida olgan har qanday davomat zudlik bilan Admin panelidagi **"Davomat Monitoringi"** bo'limida aks etadi. Guruh va sana bo'yicha saralash, kelgan/kelmagan foizini ko'rish mumkin.
* **Guruhlar & Kurslar:** Fanlar, haftaning qaysi kunlari, xona va oylik kurs narxlarini ko'rish.

---

### 2. 📊 Menijer Panel (Moliya & Statistika)
* **Kirim va Chiqimlar hisobi:** 
  - Markazga tushgan to'lovlar (Oylik to'lov, kitoblar, imtihonlar).
  - Markaz xarajatlari (O'qituvchilar oyligi, bino ijarasi, kommunal, internet, reklama/SMM, kantselyariya).
* **Kassa Balansi & Sof Foyda:** Jami kirim va chiqimlar taqqoslanib, sof oylik foyda real vaqtda hisoblanadi.
* **O'quvchilar Soni & Statistikasi:** 
  - Jami nechta o'quvchi o'qishi;
  - Faol o'quvchilar soni;
  - To'lov qilgan va qarzdor o'quvchilar nisbati;
  - Guruhlar kesimida o'quvchilar soni va oylik kutilayotgan tushum.
* **Qarzdorlar Ro'yxati:** Qarzi bor o'quvchilarga bir bosishda to'lov qabul qilish, SMS yoki Telegram orqali eslatma yuborish.

---

### 3. 👨‍🏫 O'qituvchi Panel (Ustoz Ish Stoli)
* **Mening Guruhlarim:** Faqat o'qituvchining o'ziga tegishli dars guruhlari, dars kunlari va vaqtlari.
* **Kunlik Davomat Olish:**
  - O'quvchilarni bir bosishda belgilash: **Keldi**, **Kelmadi**, **Sababli**, **Kechikdi**;
  - Hammani birdaniga "Keldi" qilish tugmasi;
  - Dars mavzusi va o'qituvchi izohini kiritish;
  - **"Davomatni Saqlash"** tugmasi bosilganda ma'lumotlar avtomatik Admin va Menejer ko'rsatkichlarida yangilanadi.
* **O'quvchilarim & Kontaktlar:** O'z guruhidagi o'quvchilarning telefon raqamlari ro'yxati.

---

## 🎨 Dizayn va Qulayliklar
- **Rolni bir bosishda almashtirish:** Yuqori panelda `Admin`, `Menijer`, `O'qituvchi` tugmalari orqali xohlagan panelga o'tish;
- **Light / Dark Mode:** Tungi va kunduzgi rejimni o'zgartirish;
- **Qidiruv tizimi:** O'quvchi, o'qituvchi yoki telefon raqami bo'yicha global tezkor qidiruv;
- **O'zbek tilida to'liq interfeys:** Barcha so'zlar, xabarlar va valyutalar O'zbekiston sharoitiga moslashtirilgan;
- **Mobil moslashuvchanlik:** Telefon, planshet va kompyuter ekranlariga to'liq moslashadi.
# O-quv-markaz
