import verifyJWT from '../verifyJWT.js'
import { bookingCollection } from '../../config/db.js'

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

    // GET /api/bookings (private): shudhu nijer booking
  app.get('/api/bookings', verifyJWT, async(req, res) => {
    const result = await bookingCollection
      .find({ userEmail: req.user.user.email })
      .sort({ createdAt: -1 })
      .toArray()
    res.send(result)
  })

}