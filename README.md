# MES Cáp/Dây điện — Hệ thống điều hành sản xuất

Ứng dụng web quản lý sản xuất (MES) cho nhà máy cáp/dây điện: quản lý đơn hàng (PO), định mức nguyên vật liệu (BOM), kho NVL, ghi nhận bán thành phẩm (BTP) theo từng công đoạn, đóng gói, phế liệu và chốt PO — kèm dashboard trực quan (KPI, biểu đồ, tiến độ theo công đoạn/màu).

**Đây là ứng dụng web tĩnh (static site) — không cần server, không cần build, không cần cài đặt gì.** Toàn bộ giao diện, logic và dữ liệu mẫu nằm gọn trong 1 file `index.html`. Dữ liệu người dùng nhập được lưu tự động vào `localStorage` của trình duyệt.

## 🚀 Chạy thử ngay

> ⚠️ **Quan trọng:** Không double-click mở trực tiếp `index.html` (giao thức `file://`) — nhiều trình duyệt sẽ chặn tải thư viện và Service Worker, khiến trang không load được. Hãy deploy lên GitHub Pages (xem bên dưới) hoặc chạy qua server cục bộ:
> ```bash
> python3 -m http.server 8080
> ```
> rồi mở `http://localhost:8080`.

Chỉ cần mở file `index.html` bằng trình duyệt (Chrome/Edge/Safari, khuyến nghị bản mới) **thông qua http/https**. Lần đầu mở cần có Internet để tải các thư viện (React, Recharts, font) từ CDN; các lần sau trình duyệt sẽ cache lại.

## 📦 Cấu trúc dự án

```
.
├── index.html                     # Toàn bộ ứng dụng (HTML + CSS + React/JSX)
├── manifest.json                  # Web App Manifest (cài đặt như 1 ứng dụng - PWA)
├── sw.js                          # Service Worker (cache để dùng được cả khi mất mạng)
├── icon.svg / icon-192.png / icon-512.png / apple-touch-icon.png
├── .github/workflows/deploy.yml   # Tự động deploy lên GitHub Pages khi push vào main
├── LICENSE
└── README.md
```

## 📲 Cài như ứng dụng (PWA)

Sau khi deploy lên GitHub Pages (bắt buộc phải là `https://`, service worker **không hoạt động** khi mở file trực tiếp `file://`):

- **Android/Chrome:** trình duyệt sẽ hiện gợi ý "Thêm vào màn hình chính" / biểu tượng cài đặt trên thanh địa chỉ.
- **iOS/Safari:** vào menu Chia sẻ → "Thêm vào Màn hình chính".
- Sau khi cài, ứng dụng mở như 1 app riêng (không thanh địa chỉ), và **vẫn mở được khi mất mạng** nhờ Service Worker đã cache lại lần đầu.


## 🌐 Deploy lên GitHub Pages

**Cách 1 — Tự động (khuyến nghị, đã cấu hình sẵn):**

1. Tạo repo mới trên GitHub, push toàn bộ thư mục này lên nhánh `main`.
2. Vào **Settings → Pages** của repo, ở mục **Source** chọn **GitHub Actions**.
3. Push code (hoặc chạy lại workflow) — GitHub Actions sẽ tự build và publish. Sau vài phút, trang sẽ có tại:
   `https://<tên-tài-khoản>.github.io/<tên-repo>/`

**Cách 2 — Thủ công, không cần workflow:**

1. Push code lên nhánh `main`.
2. Vào **Settings → Pages**, mục **Source** chọn nhánh `main`, thư mục `/ (root)`.
3. Lưu lại, chờ vài phút để GitHub build trang.

## 🖥️ Chạy local bằng server tĩnh (tuỳ chọn)

Mở trực tiếp file `index.html` là đủ, nhưng nếu muốn chạy qua server cục bộ (một số trình duyệt hạn chế tính năng khi mở file `file://`):

```bash
# Python có sẵn trên hầu hết máy
python3 -m http.server 8080
# rồi mở http://localhost:8080
```

## 🧩 Công nghệ sử dụng

- **React 18** + **Babel Standalone** (biên dịch JSX ngay trên trình duyệt, không cần bước build)
- **Recharts** — biểu đồ cột/tròn/đường
- **Tailwind CSS** — đã biên dịch sẵn thành CSS tĩnh (không dùng bản CDN runtime)
- **localStorage** — lưu dữ liệu người dùng ngay trên trình duyệt (không có backend/server)

## ⚠️ Lưu ý về dữ liệu

- Dữ liệu chỉ lưu trên trình duyệt/máy đang dùng (localStorage), **không đồng bộ** giữa các thiết bị hoặc trình duyệt khác nhau.
- Xoá cache/dữ liệu trình duyệt sẽ mất toàn bộ dữ liệu đã nhập.
- Đây là bản dùng để demo/nội bộ; nếu triển khai thật cho nhiều người dùng cùng lúc, cần bổ sung backend + cơ sở dữ liệu thật (ứng dụng hiện có thể dùng làm phần giao diện/frontend).

## 📄 Giấy phép

Phát hành theo giấy phép MIT — xem file [LICENSE](./LICENSE).
