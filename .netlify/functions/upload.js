const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.handler = async (event) => {
  try {
    // Menangani pengunggahan gambar menggunakan Multer
    await upload.single("image")(event);

    // Gambar yang diunggah sekarang tersedia di `event.file`

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Gambar berhasil diunggah" }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan saat mengunggah gambar" }),
    };
  }
};
