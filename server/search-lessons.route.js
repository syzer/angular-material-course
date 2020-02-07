import {ITEMS} from './db-data'
import {pipe as _, length, tap} from 'ramda'

export function searchJournal(req, res) {
  const queryParams = req.query

  const courseId = Number(queryParams.courseId),
    filter = queryParams.filter || '',
    sortOrder = queryParams.sortOrder,
    sortColumn = queryParams.sortColumn || 'seqNo',
    pageNumber = parseInt(queryParams.pageNumber, 0) || 0,
    pageSize = parseInt(queryParams.pageSize, 0)

  let journals = Object.values(ITEMS)
    .filter(item => item.courseId === courseId)
    .sort((l1, l2) => {
      if (sortColumn === 'seqNo') {
        return l1.id - l2.id
      }
      if (sortColumn === 'duration') {
        return l1.duration - l2.duration
      }
      if (sortColumn === 'description') {
        return String(l1.description) - l2.description
      }
    })

  if (filter) {
    journals = journals.filter(journal =>
      journal.description.trim().toLowerCase().search(filter.toLowerCase()) >= 0
      || filter <= journal.id
      || +filter.split(' ')[0] <= journal.id
      || journal.description.trim().toLowerCase().search((filter.split(' ')[1] || 'XXX').toLowerCase()) >= 0
    )
  }

  if (sortOrder === 'desc') {
    journals = journals.reverse()
  }

  const initialPos = pageNumber * pageSize

  const lessonsPage = journals.slice(initialPos, initialPos + pageSize)

  // setTimeout(() => {
  res.status(200).json({payload: lessonsPage})
  // }, 1000)

}
