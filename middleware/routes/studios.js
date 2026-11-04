import { ObjectId } from 'mongodb'
import { studioCollection } from '../../config/db.js'
import verifyJWT from '../verifyJWT.js'

export default function studioRoutes(app) {

  // http://localhost:8000/api/studios?limit=6&sort=rating
  // http://localhost:8000/api/studios?category=Photo Studios
  app.get('/api/studios', async (req, res) => {
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
  app.get('/api/studios/:id', async (req, res) => {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid studio id' })
    }

    const result = await studioCollection.findOne({ _id: new ObjectId(id) })
    res.send(result)
  })



// Add new studio
app.post('/api/studios', verifyJWT, async (req, res) => {
  const {
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    image,
    gallery,
    amenities,
    overview
  } = req.body

  const studio = {
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    image,
    gallery: gallery?.length ? gallery : [image],
    amenities,
    overview,
    ownerName: req.user.user.name,
    ownerEmail: req.user.user.email,
    rating: 0,
    reviews: [],
    createdAt: new Date()
  }

  const result = await studioCollection.insertOne(studio)
  res.send(result)
})

  //  logged-in user's studios

  app.get('/api/my-studios', verifyJWT, async (req, res) => {
    const email = req.user.user.email

    const result = await studioCollection.find({
      ownerEmail: email
    }).toArray()

    res.send(result)
  })

// Update studio (only owner can update)

app.put('/api/studios/:id', verifyJWT, async (req, res) => {
  const { id } = req.params

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid studio id' })
  }

  const email = req.user.user.email

  const studio = await studioCollection.findOne({
    _id: new ObjectId(id)
  })

  if (!studio) {
    return res.status(404).send({ message: 'Studio not found' })
  }

  if (studio.ownerEmail !== email) {
    return res.status(403).send({ message: 'Forbidden!' })
  }

  const {
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    image,
    gallery,
    amenities,
    overview
  } = req.body

  const updatedStudio = {
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    image,
    gallery: gallery?.length ? gallery : [image],
    amenities,
    overview
  }

  const result = await studioCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedStudio }
  )

  res.send(result)
})

  // Delete studio (only owner can delete)
  app.delete('/api/studios/:id', verifyJWT, async (req, res) => {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid studio id' })
    }

    const email = req.user.user.email

    const studio = await studioCollection.findOne({
      _id: new ObjectId(id)
    })

    if (!studio) {
      return res.status(404).send({ message: 'Studio not found' })
    }

    if (studio.ownerEmail !== email) {
      return res.status(403).send({ message: 'Forbidden!' })
    }

    const result = await studioCollection.deleteOne({
      _id: new ObjectId(id)
    })

    res.send(result)
  })

}