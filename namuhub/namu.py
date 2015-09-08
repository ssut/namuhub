# coding: utf-8
"""namu.wiki contrib grabber"""
import re
import urllib.parse
from datetime import datetime, timedelta

from bs4 import BeautifulSoup
import requests

__all__ = 'contrib', 

URL = 'https://namu.wiki/contribution/author/{author}/document'
URL_IP = 'https://namu.wiki/contribution/ip/{author}/document'
DATE_FORMAT = r'%Y-%m-%d %H:%M:%S'
RE_IP = re.compile('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')

class NamuContrib(object):
    """contribution object"""

    def __init__(self, document, revision, changes, when, desc='', revert=None):
        self.document = document
        self.revision = revision
        self.changes = changes
        self.when = when
        self.desc = desc
        self.revert = revert
        if revision == 1:
            self.new = True

    @property
    def when(self):
        return self._when

    @when.setter
    def when(self, when):
        if isinstance(when, datetime):
            self._when = when
        else:
            self._when = datetime.strptime(when, DATE_FORMAT) - timedelta(hours=9)

    def as_dict(self):
        obj = {
            'document': self.document,
            'revision': self.revision,
            'changes': self.changes,
            'when': self.when,
            'desc': self.desc,
            'revert': self.revert,
            'new': self.new,
        }
        return obj

    def __repr__(self):
        return '<NamuContrib doc=%s rev=%s changes=%s when=%s desc=%s>' % (
            self.document, self.revision, self.changes, self.when, self.desc)

def extint(input):
    """Extract numbers from a string"""
    num = None
    try:
        num = int(''.join([s for s in input if s.isdigit()]))
    except ValueError:
        pass
    return num

def contrib(username):
    """contributions"""
    result = []

    url = URL.format(author=username)
    if '.' in username and RE_IP.match(username):
        url = URL_IP.format(author=username)

    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'lxml')
    soup.encoding = 'utf-8'

    rows = soup.select('article table tbody tr')
    item = None
    hasdetail = False
    for i, row in enumerate(rows):
        if not item and not hasdetail:
            info = row.select('td')[0]
            document = info.select('a')[0].string
            try:
                qs = {k: ''.join(v) for k, v in
                      urllib.parse.parse_qs(info.select('a')[2].attrs['href'].split('?')[-1]).items()}
            except IndexError:
                revision = 1
            else:
                revision = int(qs['rev'])
            changes = int(info.select('span')[-1].string)
            when = row.select('td')[2].string.strip()
            item = NamuContrib(document=document, revision=revision, changes=changes, when=when)

            # Find reverts
            revert = info.select('a + i')
            if revert:
                revert = extint(revert[0].string)
                item.revert = revert
        elif item and hasdetail:
            desc = row.select('td')[0].string
            item.desc = desc
            hasdetail = False
        if 'no-line' in row.attrs.get('class', []):
            hasdetail = True

        if item and not hasdetail:
            result.append(item)
            item = None

    return result
