import verifyJWT from '../verifyJWT.js'
import { bookingCollection } from '../../config/db.js'
import { ObjectId } from 'mongodb'

export default function bookingRoutes(app) {

  // POST /api/bookings (private)
  app.post('/api/bookings', verifyJWT, async(req, res) => {
    const { studioId, studioTitle, date, startTime, endTime, totalPrice } = req.body

    if (!studioId || !date || !startTime || !endTime || endTime <= startTime) {
      return res.status(400).send({ message: 'Please provide a valid date and time range' })
    }

    // Double-booking check: same studio, same date, Confirmed, time overlap
    const conflict = await bookingCollection.findOne({
      studioId: studioId,
      date: date,
      status: 'Confirmed',
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    })

    if (conflict) {
      return res.status(409).send({
        message: 'This time slot is already booked. Please choose another time.',
      })
    }

    const newBooking = {
      studioId: studioId,
      studioTitle: studioTitle,
      userName: req.user.user.name,
      userEmail: req.user.user.email,
      date: date,
      startTime: startTime,
      endTime: endTime,
      totalPrice: Number(totalPrice),
      status: 'Pending',
      createdAt: new Date(),
    }

    const result = await bookingCollection.insertOne(newBooking)
    res.send(result)
  })

    // GET /api/bookings (private)
  app.get('/api/bookings', verifyJWT, async(req, res) => {
    const result = await bookingCollection
      .find({ userEmail: req.user.user.email })
      .sort({ createdAt: -1 })
      .toArray()
    res.send(result)
  })

    // PATCH /api/bookings/:id (private)
  app.patch('/api/bookings/:id', verifyJWT, async(req, res) => {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid booking id' })
    }

    const booking = await bookingCollection.findOne({ _id: new ObjectId(id) })

    if (!booking) {
      return res.status(404).send({ message: 'Booking not found' })
    }

    if (booking.userEmail !== req.user.user.email) {
      return res.status(403).send({ message: 'Forbidden' })
    }

    if (booking.status !== 'Pending') {
      return res.status(400).send({ message: 'Only pending bookings can be cancelled' })
    }

    const result = await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'Cancelled' } }
    )
    res.send(result)
  })

}