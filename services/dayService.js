import { executeQuery } from "../database/database.js";

const getUser = async (id) => {
    const query = await executeQuery("SELECT * FROM registers WHERE id=$1;", Number(id))
    return query && query.rowsOfObjects() ? query.rowsOfObjects()[0] : {}
}

const getDay = async (id, day) => {

    const query = await executeQuery("SELECT * FROM days WHERE day::date=$2::date AND user_id=$1;", Number(id), day)

    return query.rowsOfObjects() ? query.rowsOfObjects()[0] : {}
}

const getDayById = async (id, user_id) => {
    const query = await executeQuery("SELECT * FROM days WHERE id=$1 AND user_id=$2;", Number(id), Number(user_id))
    return query && query.rowsOfObjects() ? query.rowsOfObjects()[0] : {}
}
const getAll = async ({ session }) => {
    console.log("getting all  days")
    const user = await session.get('user');
    console.log(user)
    if (!user) {
        return;
    }
    const query = await executeQuery("SELECT * FROM days WHERE user_id=$1;", Number(user.id))

    return query && query.rowsOfObjects() ? query.rowsOfObjects() : []
}//

const getDayComplete = async (day) => {
    const query = await executeQuery("SELECT AVG(sleepquality) as sq, AVG(sleepduration) as sd, AVG(studyduration) as std, AVG(sportduration) as spd,  AVG(nmood) as nAvg, AVG(mmood) as mAvg FROM days WHERE day::date=$1::date;", day)
    return query && query.rowsOfObjects() ? query.rowsOfObjects() : []
}

const getWeekAPI = async () => {
    const query = await executeQuery("SELECT AVG(sleepquality) as sq, AVG(sleepduration) as sd, AVG(studyduration) as std, AVG(sportduration) as spd,  AVG(nmood) as nAvg, AVG(mmood) as mAv" +
        " FROM days WHERE day::date >= NOW()::date - integer '7' AND day::date <= NOW()::date;")
    return query && query.rowsOfObjects() ? query.rowsOfObjects()[0] : []
}

const addDay = async (id, day) => { //create day skeleton with only date

    if (!(id)) {
        return;
    }
    console.log(day)
    console.log(new Date(day))

    const existing = await executeQuery("SELECT * FROM days WHERE day::date = $1::date AND user_id = $2;", day, Number(id))
    if (existing.rowCount > 0) {
        return false
    }

    const query = await executeQuery("INSERT INTO days (user_id, day) values ($1, $2);", Number(id), day)



    console.log(query);
    return true
}

const updateDay = async (sleepduration, sportduration, studyduration, mmood, eat, sleepquality, nmood, user_id, day) => { //update values depending


    const query = await executeQuery("UPDATE days SET sleepduration=$1," +
        "sportduration=$2, studyduration = $3, mmood = $4, eat = $5, sleepquality = $6, nmood = $7 WHERE user_id = $8 AND day::date=$9::date;",
        sleepduration ? sleepduration : null,
        sportduration ? sportduration : null,
        studyduration ? studyduration : null,
        mmood ? mmood : null,
        eat ? eat : null,
        sleepquality ? sleepquality : null,
        nmood ? nmood : null,
        user_id,
        day
    )
    console.log(query)

}

const getWeek = async (id, week, year) => {
    const query = await executeQuery("SELECT * FROM days WHERE user_id=$1 AND DATE_PART('week', day::date)= $2 AND DATE_PART('year', day::date)=$3 ORDER BY(day::Date);", id, week, year)
    return query ? query.rowsOfObjects() : []
}

const getWeekAVG = async (id, week, year) => {
    console.log("params: " + id + ", " + week + ", " + year)
    const query = await executeQuery("SELECT AVG(sleepquality) as sq, AVG(sleepduration) as sd, AVG(studyduration) as std, AVG(sportduration) as spd,  AVG(nmood) as nAvg, AVG(mmood) as mAvg, COUNT(nmood) as nightcount, COUNT(mmood) as morningcount, COUNT(id) FROM days WHERE DATE_PART('week', day::date)= $1 AND DATE_PART('year', day::date)=$2 AND user_id=$3;", week, year, id)
    console.log(query)
    return query ? query.rowsOfObjects()[0] : {};
}

const getMonthAVG = async (id, month, year) => {
    const query = await executeQuery("SELECT AVG(sleepquality) as sq, AVG(sleepduration) as sd, AVG(studyduration) as std, AVG(sportduration) as spd,  AVG(nmood) as nAvg, AVG(mmood) as mAvg, COUNT(nmood) as nightcount, COUNT(mmood) as morningcount, COUNT(id) FROM days WHERE DATE_PART('month', day::date)= $1 AND DATE_PART('year', day::date)=$2 AND user_id=$3;", month, year, id)
    return query ? query.rowsOfObjects()[0] : {};
}


export { getUser, getDay, getAll, addDay, updateDay, getDayById, getWeekAVG, getMonthAVG, getWeek, getDayComplete, getWeekAPI }