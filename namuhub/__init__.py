"""namuhub --- namu.wiki contribution graph"""
import time
from collections import defaultdict
from datetime import timedelta

from flask import Flask, jsonify, render_template, request, url_for

from namuhub import namu as namuwiki

app = Flask('namuhub')

def context(append={}):
    ctx = {
        'debug': app.config['DEBUG'],
    }
    ctx.update(append)
    return ctx

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', **context())

@app.route('/<user>', methods=['GET'])
def index_user(user=''):
    return render_template('index.html', **context({'user': user}))

@app.route('/', methods=['POST'])
def namu():
    user = request.form.get('user', None)
    if not user:
        return jsonify({}), 501

    contribs = namuwiki.contrib(user)
    data = defaultdict(lambda: [])
    # First, separate contributions into list by their activity date
    for contrib in contribs:
        date = (contrib.when + timedelta(hours=9)).date().strftime('%Y-%m-%d')
        data[date].append(contrib)
    # Next, we should serialize it as dict object to make sure that all the values are JSON serialiable
    # However, this may be inefficient but I don't care about performance at this point because it doesn't matter while it's a small project
    for key, value in data.items():
        value = [c.as_dict() for c in value]
        # Almost done, fix timezone and convert its date property to unix timestamp number that can be parsed by javascript's date object
        for i, c in enumerate(value):
            value[i]['when'] = int(time.mktime((c['when'] + timedelta(hours=9)).utctimetuple())) * 1000
        # Overwrite existing value
        data[key] = value

    return jsonify(data)

