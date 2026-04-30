import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    // Konfigurasi Transporter Nodemailer (menggunakan Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gunakan App Password, bukan password biasa
      },
    });

    // Menyiapkan email yang akan dikirim ke Anda (badarrahman1905@gmail.com)
    const mailOptions = {
      from: `"${name}" <${email}>`, // Alias pengirim
      to: "badarrahman1905@gmail.com", // Email tujuan (email Admin/Anda)
      subject: `Pesan CS Baru dari ${name} (Neo Store)`,
      text: `Anda menerima pesan baru dari halaman Support Neo Store.\n\nPengirim: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #ff6700; margin-top: 0;">Pesan Customer Service Baru</h2>
          <p>Anda menerima pesan baru dari halaman Support <strong>Neo Store</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Pengirim:</strong> ${name}</p>
          <p><strong>Email Pengirim:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Pesan:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
          <br/>
          <p style="font-size: 12px; color: #888;">Email ini dikirim secara otomatis oleh sistem Neo Store.</p>
        </div>
      `,
    };

    // Mengirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Pesan berhasil dikirim ke Customer Service" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Gagal mengirim email:", error);
    return NextResponse.json(
      { error: "Gagal mengirim email. Pastikan konfigurasi EMAIL_USER dan EMAIL_PASS di .env sudah benar." },
      { status: 500 }
    );
  }
}
