# Background Remover Website

A modern web app inspired by remove.bg, built with Flask and `rembg` to remove backgrounds from uploaded images automatically.

## Features
- Drag-and-drop upload area
- Modern responsive design
- Background removal using AI
- Before/after comparison
- Download processed PNG
- Simple Python backend

## Tech Stack
- Python
- Flask
- Pillow
- rembg

## Run locally

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the app:
   ```bash
   python app.py
   ```

4. Open in the browser:
   ```bash
   http://127.0.0.1:5000
   ```

## Notes
- The app removes image backgrounds and returns a transparent PNG output.
- For best results, use clear subject images with a well-defined foreground object.
