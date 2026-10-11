from flask import Flask, render_template, request, send_file
from PIL import Image
from rembg import remove
import io

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/remove-bg", methods=["POST"])
def remove_bg():
    if "image" not in request.files:
        return {"error": "No image uploaded."}, 400

    uploaded_file = request.files["image"]

    if uploaded_file.filename == "":
        return {"error": "No file selected."}, 400

    try:
        image = Image.open(uploaded_file.stream)
        image = image.convert("RGBA")
        output = remove(image)

        if output.mode not in ("RGBA", "RGB", "P"):
            output = output.convert("RGBA")

        img_bytes = io.BytesIO()
        output.save(img_bytes, format="PNG")
        img_bytes.seek(0)

        return send_file(img_bytes, mimetype="image/png", as_attachment=True, download_name="background_removed.png")
    except Exception as exc:
        return {"error": f"Failed to process image: {str(exc)}"}, 500

@app.route("/health")
def health():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
