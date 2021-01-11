import { Router } from "../deps.js";
import * as daysController from "./controllers/dayController.js";
import * as daysApi from "./apis/daysApi.js";
import * as authController from "./controllers/authController.js"
import * as auth from "./apis/authApi.js";
import { oakCors } from "../deps.js"
const router = new Router();

router.get('/', daysController.landingPage)

router.post('/day/:id', daysController.redirectWithDay)
router.get('/behaviour/reporting', daysController.day)
router.post('/behaviour/reporting', daysController.day)
router.get('/behaviour/summary', daysController.summaryPage)
router.post('/behaviour/summary', daysController.summaryPage)
router.get('/logout', auth.logout)

router.get('/api/:year/:month/:day', oakCors(), daysApi.getDay)
router.get('/api/summary', oakCors(), daysApi.getWeekApi)
router.post('/api/addDay', daysApi.addDay)
router.post('/api/update', daysApi.updateDay)

router.get('/auth/login', authController.showLogin)
router.post('/auth/login', auth.authenticate)
router.get('/auth/registration', authController.showRegister)
router.post('/auth/registration', auth.register)



export { router };