"""namuhub --- namu.wiki contribution graph"""
from flask import Flask, jsonify, render_template, request, url_for

app = Flask('namuhub')

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/<user>', methods=['GET'])
def index_user(user=''):
    return render_template('index.html', **{'user': user})

@app.route('/', methods=['POST'])
def namu():
    user = request.POST.get('user', None)
    if not user:
        return '', 501

