/* eslint-disable no-console */
const fs = require('vinyl-fs');
const Ftp = require('vinyl-ftp');
const config = require('./ftp.auth.json');

const FTP_DIR = './CG_UIComponents/cg-slider';

const conn = new Ftp({
  host: config.host,
  user: config.user,
  password: config.password,
  parallel: 10,
  log: (...args) => {
    console.log(args.join(''));
  },
});

fs.src('./build/**', { buffer: false }).pipe(conn.dest(FTP_DIR));
