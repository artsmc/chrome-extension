import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as morgan from 'morgan';
import * as path from 'path';
import * as status from 'express-status-monitor';

import { ExpressRouter } from './routes/_Router';
import * as multer from 'multer';
import * as express from 'express';
import * as cors from 'cors';
import * as hbs from 'express-handlebars';
const app = express();
const upload = multer();
// setup the logger
app.use(status());
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200MB' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Requested-With, Session, authorization, x-api-key',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // Pass to next layer of middleware
  next();
});
app.use((req, res, next)  => {
  console.log(req.originalUrl);
  next();
});
app.engine('hbs', hbs({ extname: '.hbs' }));
app.set('views', path.join('./dist/server/views'));
app.set('view engine', 'hbs');
app.set('trust proxy', true);
app.get('/terms', (req, res, next) => {
    res.render('terms');
});
app.get('*.js', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    res.sendFile(req.url, { maxAge: '10000', dotfiles: 'allow', root: './dist/server/public/assets' });
});
app.get('*.otf', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'font/opentype');
    res.sendFile(req.url, { maxAge: '10000', dotfiles: 'allow', root: './dist/server/public/assets' });
});

app.get('*.css', (req, res, next) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    res.sendFile(req.url, { maxAge: '10000', dotfiles: 'allow', root: './dist/server/public/assets' });
});
app.use(express.static('./dist/server/public/assets', { maxAge: '10000', dotfiles: 'allow' }));

// ROUTE /APP/api
app.use(`/api/v1`, ExpressRouter);
app.listen(app.get('port'), () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log('Press CTRL-C to stop\n');
});
app.use(`/`, express.static('./client/dist/client/'));
export default app;


