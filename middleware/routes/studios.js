import { ObjectId } from 'mongodb'
import { studioCollection } from '../../config/db.js'

export default function studioRoutes(app) {

  // http://localhost:8000/api/studios?limit=6&sort=rating
  // http://localhost:8000/api/studios?category=Photo Studios
  app.get('/api/studios', async(req, res) => {
    const { category, sort, limit } = req.query

    const filter = {}
    if (category) {
      filter.category = category
    }

    let query = studioCollection.find(filter)

    if (sort === 'rating') {
      query = query.sort({ rating: -1 })
    }

    if (Number(limit) > 0) {
      query = query.limit(Number(limit))
    }

    const result = await query.toArray()
    res.send(result)
  })

  // http://localhost:8000/api/studios/<studio id>
  app.get('/api/studios/:id', async(req, res) => {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid studio id' })
    }

    const result = await studioCollection.findOne({ _id: new ObjectId(id) })
    res.send(result)
  })

}