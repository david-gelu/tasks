import moment from 'moment'
const formatDate = (date: string) => {
  return moment(date).format("ll")
}

export default formatDate
