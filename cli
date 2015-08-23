#!/usr/bin/env python3
"""command interface for namuhub"""
import argparse

from waitress import serve

from namuhub import app

__all__ = ['main']

def runserver(args):
    if args.debug:
        app.run(host=args.host, port=args.port, debug=args.debug,
                threaded=True)
    else:
        serve(app, host=args.host, port=args.port)

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

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        exit(1)
    args.function(args)

if __name__ == '__main__':
    main()
