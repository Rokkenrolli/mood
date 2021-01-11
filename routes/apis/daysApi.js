import * as daysService from "../../services/dayService.js";


Date.prototype.getWeek = () => { //helper to parse week
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}



const addDay = async ({ session, response, request }) => {
    const body = request.body();
    const params = await body.value;
    const day = params.get('calendar');
    const user = await session.get('user');
    console.log(day)
    const adding = await daysService.addDay(user.id, day)
    if (!adding) {
        return response.body = "day exists"
    }
    await session.set('day', day)
    response.redirect('/behaviour/reporting')
}

const updateDay = async ({ session, request, response, render }) => {
    const body = request.body()
    const param = await body.value
    console.log(param)
    const user = await session.get('user')
    const user_id = user.id
    const day = param.get('day')
    const sleepduration = param.get('sleepduration')
    const sportduration = param.get('sportduration')
    const studyduration = param.get('studyduration')
    const mmood = param.get('mmood')
    const eat = param.get('eat')
    const sleepquality = param.get('sleepquality')
    const nmood = param.get('nmood')

    await daysService.updateDay(sleepduration, sportduration, studyduration, mmood, eat, sleepquality, nmood, user_id, day)
    console.log(day)
    await session.set('day', day)
    response.redirect('/behaviour/reporting')
}

const getWeek = async ({ request, session }) => {
    const user = await session.get('user');
    const body = request.body()
    const params = await body.value;
    const now = new Date()
    const week = params && params.has('week') ? params.get('week') : `${now.getFullYear()}-W${now.getWeek()}`;
    const year = week.substring(0, 4)
    const weekn = week.substring(6)
    const weekDays = await daysService.getWeek(Number(user.id), Number(weekn), Number(year))
    return weekDays
}

const getDay = async ({ params, response }) => {
    const day = `${params.year}-${params.month}-${params.day}`
    const res = await daysService.getDayComplete(day)
    response.body = res
}

const getWeekApi = async ({ response }) => {
    const res = await daysService.getWeekAPI()
    response.body = res ? res[0] : {}
}

const getWeekAVG = async ({ request, session }) => {
    const user = await session.get('user');
    const body = request.body()
    const params = await body.value;
    const now = new Date()
    const week = params && params.has('week') ? params.get('week') : `${now.getFullYear()}-W${now.getWeek()}`;
    const year = week.substring(0, 4)
    const weekn = week.substring(6)
    console.log(week)

    const query = await daysService.getWeekAVG(Number(user.id), Number(weekn), Number(year))

    return { res: query, week: weekn, year: year }

}
const getMonth = async ({ request, session }) => {
    const user = await session.get('user');
    const body = request.body()
    const params = await body.value;
    const now = new Date()
    const month = params && params.has('month') ? params.get('month') : `${now.getFullYear()}-${now.getMonth() + 1}`;
    const year = month.substring(0, 4)
    const monthn = month.substring(5)
    console.log(month)
    const query = await daysService.getMonthAVG(Number(user.id), Number(monthn), Number(year))
    console.log(query)

    return { res: query, month: monthn, year: year }

}
export { addDay, updateDay, getWeekAVG, getMonth, getWeek, getDay, getWeekApi };