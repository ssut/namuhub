"""namuhub --- namu.wiki contribution graph"""
from flask import Flask, jsonify, render_template, request, url_for

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')
