import moment from "moment"

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (milisecs, toTimeForCurrentDay = true) => {
  const date = new Date(milisecs);
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(date)
}

function datediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second-first)/(1000*60*60*24));
}

export const formatChatTime = (milisecs) => {
  var t = new Date(milisecs);
  return moment(t).format('h:mm a');
}

export const formatChatDate = (milisecs) => {
  var fulldays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var t = new Date(milisecs);
  var dt = t,
      date = dt.getDate(),
      month = months[dt.getMonth()],
      timeDiff = t - Date.now(),
      diffDays = new Date().getDate() - date,
      diffMonths = new Date().getMonth() - dt.getMonth(),
      diffYears = new Date().getFullYear() - dt.getFullYear();

  if(diffYears === 0 && diffDays === 0 && diffMonths === 0){
    return "Today";
  }else if(diffYears === 0 && diffDays === 1) {
    return "Yesterday";
  }else if(diffYears === 0 && diffDays === -1) {
    return "Tomorrow";
  }else if(diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
    return fulldays[dt.getDay()];
  }else if(diffYears >= 1){
    return month + " " + date + ", " + new Date(milisecs).getFullYear();
  }else {
    return month + " " + date;
  }
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'advisor') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#ebbd4c1a', // for option hover bg-color
    primary: '#ebbd4c', // for selected option bg-color
    neutral10: '#ebbd4c', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const randomString = (len = 50, charSet = '') => {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < len; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }

  return randomString + nowSecs();
}

export const nowSecs = () => {
  return Math.floor(Date.now());
}

export const roundNumber = (value, decimal) => {
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal)
}

export const currencyFormat = (value, decimal) => {
  return value.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}

export const dateStartTime = (time) => {
  const date = new Date(time)
  const dateStr = moment(date).format('YYYY-MM-DD');
  const diff = (new Date()).getTimezoneOffset() * 60 * 1000;
  return new Date(dateStr).getTime() - diff;
}

export const formatReportDate = (strDate) => {
  if (strDate && strDate.includes(':')) {
    const nodes = strDate.split(':');
    if (nodes.length == 3) {
      return nodes[0] + ':' + nodes[1];
    }
  }
  return strDate;
}