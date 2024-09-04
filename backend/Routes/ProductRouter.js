const ensureAuthenticated = require('../Middlewares/Auth');
const {add,view,edit,release,today,thisWeek,thisMonth,thisQuarter,thisHalfYear,thisYear} = require('../Controllers/AuthController');

const router = require('express').Router();

router.get('/',ensureAuthenticated,today);
router.get('/Week',ensureAuthenticated,thisWeek);
router.get('/Month',ensureAuthenticated,thisMonth);
router.get('/Quarter',ensureAuthenticated,thisQuarter);
router.get('/HalfYear',ensureAuthenticated,thisHalfYear);
router.get('/Year',ensureAuthenticated,thisYear);
router.post('/add',ensureAuthenticated,add);
router.post('/view',ensureAuthenticated,view);
router.put('/edit',ensureAuthenticated,edit);
router.post('/release',ensureAuthenticated,release);

module.exports = router;