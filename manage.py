#!/usr/bin/env python3
"""command interface for namuhub"""
import argparse
import os

from waitress import serve

from namuhub import app

__all__ = ['main']

def runserver(args):
    if args.debug:
        app.run(host=args.host, port=args.port, debug=args.debug,
                threaded=True)
    else:
        serve(app, host=args.host, port=args.port)

def collectstatic(args):
    try:
        from react import jsx
    except ImportError:
        print('Please install PyReact package:')
        print(' >>> pip install PyReact')
        exit(1)
    transformer = jsx.JSXTransformer()
    for fn in next(os.walk('namuhub/static/jsx'))[2]:
        transformer.transform('namuhub/static/jsx/{}'.format(fn),
                              js_path='namuhub/static/js/{}'.format(fn))

def main():
    parser = argparse.ArgumentParser(prog='namuhub')
    subparsers = parser.add_subparsers(dest='command')

    server_parser = subparsers.add_parser('server')
    server_parser.set_defaults(function=runserver)
    server_parser.add_argument('-H', '--host',
                               default='0.0.0.0',
                               help="host to listen. [default: %(default)s]")
    server_parser.add_argument('-p', '--port',
                               type=int,
                               default=24682,
                               help="port to listen. [default: %(default)s]")
    server_parser.add_argument('-d', '--debug',
                               default=False,
                               action='store_true',
                               help="enable debug mode. [default: %(default)s]")

    assets_parser = subparsers.add_parser('collectstatic')
    assets_parser.set_defaults(function=collectstatic)

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        exit(1)
    args.function(args)

if __name__ == '__main__':
    main()
