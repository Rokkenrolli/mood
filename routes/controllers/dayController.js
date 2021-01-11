
import * as dayService from "../../services/dayService.js";
import * as dayApi from "../apis/daysApi.js"



const day = async ({ render, session, request }) => {
  const body = request.body();
  const params = await body.value;
  const change = params && params.get('changed') ? params.get('changed') : false
  console.log("rendering day")
  const user = await session.get('user')
  const id = user.id
  let time = change;
  if (!time) {
    time = new Date(Date.now()).getHours() < 15 ? "MORNING" : "EVENING"
  }
  let date;
  if (params && params.has('day')) {
    date = params.get('day')
  } else if (await session.get('day')) {
    date = await session.get('day')
  }
  else {
    date = new Date(Date.now()).toISOString().substr(0, 10)
  }
  console.log(date)
  const today = await dayService.getDay(Number(id), date)
  render('behaviour.ejs', { day: today, exists: today ? true : false, time: time, date: date });
};

const landingPage = async ({ request, render, session }) => {

  const user = await session.get('user')
  const auth = await session.get('authenticated')
  const weekSummary = user ? await dayApi.getWeek({ request, session }) : {}
  user && auth ? render('index.ejs', { user: user, week: weekSummary }) : render('landingpage.ejs');
}

const summaryPage = async ({ request, render, session }) => {
  const user = await session.get('user')
  const weekSummary = user ? await dayApi.getWeekAVG({ request, session }) : {}
  const monthSummary = user ? await dayApi.getMonth({ request, session }) : {}
  render('summary.ejs', { week: weekSummary, month: monthSummary })
}

const redirectWithDay = async ({ params, session, response }) => {
  const user = await session.get('user')
  const query = await dayService.getDayById(Number(params.id), Number(user.id))
  if (query) {
    await session.set('day', (new Date(query.day)).toISOString().substr(0, 10))
    response.redirect('/behaviour/reporting')
  }
}

export { day, landingPage, redirectWithDay, summaryPage };