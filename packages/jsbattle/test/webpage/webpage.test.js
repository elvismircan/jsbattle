import 'babel-polyfill';
import assert from "assert";
import config from './lib/config.js';
import mlog from './lib/mlog.js';
import puppeteer from 'puppeteer';

describe('Web Page', function() {
  this.slow(10000);
  this.timeout(30000);
  this.browser = null;
  this.page = null;
  this.mlog = mlog;
  //this.mlog.disabled = false;
  this.config = config;

  this.consoleLog = [];

  this.createNewPage = async () => {
    if(this.page) {
      await this.page.close();
    }
    this.page = await this.browser.newPage();
    this.consoleLog = [];
    this.page.on('console', msg => {
      for (let i = 0; i < msg.args().length; ++i) {
        this.consoleLog.push(`${i}: ${msg.args()[i]}`);
      }
    });
    await this.page.emulate({
      'name': 'Desktop',
      'userAgent': 'Chrome',
      'viewport': {
        'width': 1200,
        'height': 800,
        'deviceScaleFactor': 1,
        'isMobile': false,
        'hasTouch': false,
        'isLandscape': true
      }
    });
  }

  before(async () => {
    this.mlog.log('Starting Chrome...');
    this.browser = await puppeteer.launch({args: ['--no-sandbox']});
    await this.createNewPage();
    this.mlog.log('Chrome page loaded');
  });

  after(async () => {
    this.mlog.log("Closing Chrome");
    await this.browser.close();
    this.mlog.log("Tests completed. Bye bye");
  });
  let self = this;

  afterEach(async function () {

    if(this.currentTest.state == 'failed') {
      let filename = this.currentTest.title.replace(/[\\\?\%\*]/g, '_');
      await self.page.screenshot({
        path: __dirname + `/../../tmp/${filename}.png`
      });
      console.log("Browser console output:\n\n" + self.consoleLog.join("\n"));
    }

  });

  require('./testcases/schema.js').bind(this)();
  require('./testcases/navi.js').bind(this)();
  require('./testcases/tanklist.js').bind(this)();
  require('./testcases/battle.js').bind(this)();
  require('./testcases/airepo.js').bind(this)();
  require('./testcases/editor.js').bind(this)();
  require('./testcases/challenge.js').bind(this)();

});
