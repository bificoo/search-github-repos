import utc from "dayjs/plugin/utc"
import duration from "dayjs/plugin/duration"
import customParseFormat from "dayjs/plugin/customParseFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import dayjs, { ConfigType } from "dayjs"
require("dayjs/locale/zh-tw")
require("dayjs/locale/zh-cn")

dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime, {
  thresholds: [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y" },
    { l: "yy", d: "year" },
  ],
})
dayjs.extend(updateLocale)
dayjs.locale("zh-tw")
const day = (config?: ConfigType, format?: string, strict?: boolean) => {
  return dayjs(config, format, strict)
}

day.utc = dayjs.utc
day.duration = dayjs.duration

export default day
