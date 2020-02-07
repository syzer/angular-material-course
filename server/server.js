import express from 'express'
import {getAllCourses, getCourseById} from './get-courses.route'
import {searchJournal} from './search-lessons.route'

const app = express()

app.use((req, res, next) => {
  console.warn(req.query)
  next()
})

app.route('/api/courses').get(getAllCourses)
app.route('/api/courses/:id').get(getCourseById)
app.route('/api/lessons').get(searchJournal)

// app.route('/api').post()

app.use((req, res, next) => {
  console.warn(res)
  next()
})

const httpServer = app.listen(9000, () => {
  console.log('HTTP REST API Server running at http://localhost:' + httpServer.address().port)
})




