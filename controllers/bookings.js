const Supabase = require('../db/supabase.js');
const {isAvailable} = require('../utils/Availability.js')


// getAllBookings,
const getAllBookings = async (req, res) => {
    const { user_id: owner_id } = req.user
    const { data, error } = await Supabase
        .from('bookings')
        .select('* cars(*)')
    if (error) {
        res.status(400).json({ error: error.message })
    } 
    
    // I think this can be done in the query above, but I'm not sure how to do it. 
    let filteredBooking = data.filter((booking) => {
        return booking.cars.owner_id === owner_id
    })
    res.status(200).json(filteredBooking); 
    }

// getMyBookings,
const getMyBookings = async (req, res) => {
    const { user_id: renter_id } = req.user
    const { data, error } = await Supabase
        .from('bookings')
        .select('*')
        .eq('renter_id', renter_id)
    if (error) {
        res.status(400).json({ error: error.message })
    } else {
        res.status(200).json(data)
    }
    }


    
// cancelBooking
 const cancelBooking = async (req, res) => {
    const { user_id: renter_id } = req.user
    const booking_id  = req.params.id;
    const {data:deletedBooking,error } = await Supabase.from("bookings")
                                        .delete()
                                        .eq("renter_id", renter_id)
                                        .eq("id", booking_id)
                                        .select("*")
        if (error){
        console.log(error.message)
        return res.status(401).json({error})
        }
        res.status(200).json(deletedBooking);
    }


// checkAvailablity
const checkAvailablity = async (req, res) => {
    const { id: CarId} = req.params
    const {startDate, endDAte} = req.query

    const { availablity, error} = await isAvailable(CarId, startDate, endDAte)
    if (error) {
        return res.status(400).json({ error: error.message })
    }
    


    //also check if the car is currently on a rent (from rents table)

    const { data: rents, error: error2 } = await Supabase
        .from('rents')
        .select('*')
        .eq('car_id', CarId)
        .eq("status", "ongoing")
    if (error2) return res.status(400).json({ error: error2.message })
        
    
    

    // and, check if the car is active (from cars table)
    const { data: car, error: error3 } = await Supabase
        .from('cars')
        .select('*')
        .eq('id', CarId).single()


   availablity = availablity && rents.length == 0 && car.is_active
    res.status(200).json({"availablity": availablity, error: null})
    }

module.exports = {
    getAllBookings,
    getMyBookings,
    cancelBooking,
    checkAvailablity
}