import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * @returns {string} 当前时区
 */
export const getTimezone = () => dayjs.tz.guess()

/**
 * @param  {number} timestamp
 * @param  {string} time human readable time, default: YYYY-MM-DD
 * format参考文档： https://dayjs.gitee.io/docs/zh-CN/parse/string-format
 */
export const unix2date = (timestamp, formatter = 'YYYY/MM/DD') => timestamp ? dayjs.unix(timestamp).format(formatter) : '--'

/**
 * @returns {number} unixtime
 */
export const startOfDay = (time, formatter) => dayjs(time, formatter).startOf('day').unix()

/**
 * @returns {number} unixtime
 */
export const endOfDay = (time, formatter) => dayjs(time, formatter).endOf('day').unix()

/**
 * @returns {string} formatted duration
 */
export const getDuration = (millseconds) => {
    const duration = dayjs.duration(millseconds)
    const seconds = duration.seconds()
    const minutes = duration.minutes()
    const hours = duration.hours()
    const days = Math.floor(duration.asDays())
    let result = ''
    if (!duration || duration.asSeconds() < 1) {
        result = '0s'
    } else if (duration.asSeconds() <= 59) {
        result = seconds ? `${seconds}s` : ''
    } else {
        result = `${days ? `${days}D` : ''}${hours ? `${hours}h` : ''}${minutes ? `${minutes}m` : ''}`
    }
    return result
}

/**
 * @param {number} count 数字
 * @param {string} unit 时间单位 hours/days/...
 */
export const timeBefore = (count, unit) => dayjs().subtract(count, unit)
