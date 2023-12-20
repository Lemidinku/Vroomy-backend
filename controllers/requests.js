
const Supabase = require('../db/supabase.js');


// tested and working
const addRequest = async (req, res) => {
    const { user_id } = req.headers;
    const { car_id, start_date, end_date } = req.body;

    /* 
    
    
    check if the car is available for the requested dates. 
    let's assume the car is available for now.
    
    
    */



    const { data, error } = await Supabase
        .from('requests')
        .insert([{"status": "pending", start_date: start_date, return_date: end_date, "renter_id": user_id , "car_id": car_id}])
        .select("*").single()
    if (error) {
        return res.status(401).json({ error: error.message });
    }
    res.status(200).json(data); 
}

// for testing purposes only
 const addRequestStatic = async (req, res) => {
    let today = new Date().toISOString().split('T')[0]
    const { data, error } = await Supabase
        .from('requests')
        .insert([{"status": "pending", start_date:"2023-12-19" , return_date:'2023-12-30', "renter_id": "9eb930e1-73d9-42a0-b928-545425d76160" , "car_id": 30}])
        .select("*").single()
    if (error) {
        return res.status(401).json({ error: error.message });
    }
    res.status(200).json(data); 

}

// tested and working
// a renter can see all the requests they have sent
const getSentRequests = async (req, res) => {
    const { user_id } = req.headers;
    const { data, error } = await Supabase
        .from('requests')
        .select("*")
        .eq("renter_id", user_id)
    if (error) {
        return res.status(401).json({ error: error.message });
    }
    res.status(200).json(data); 
}

// a car owner can see all the requests they have recieved
const getRecievedRequests = async (req, res) => {
    const { user_id } = req.headers;
    const { data, error } = await Supabase
        .from('requests')
        .select('cars(*), *')
        .eq("cars.owner_id", user_id)
    if (error) {
        return res.status(401).json({ error: error.message });
    }

    // I think this can be done in the query above, but I'm not sure how to do it. 
    let filteredData = data.filter((request) => {
        return request.cars.owner_id === user_id
    })
    res.status(200).json(filteredData); 
}
// tested and working
// a renter can cancel a request they have sent
  const cancelRequest = async (req, res) => {
    const { user_id } = req.headers;
    const request_id  = req.params.id;
    console.log(request_id)
    const {data:deletedRequest,error } = await Supabase.from("requests")
                                        .delete()
                                        .eq("renter_id", user_id)
                                        .eq("id", request_id)
                                        .select("*")
        if (error){
        console.log(error.message)
        return res.status(401).json({error})
        }
        res.status(200).json(deletedRequest);
    }

// tested and working
const handleRequest = async (req, res) => {
        const { user_id } = req.headers;
        const {status} = req.body
        const request_id = req.params.id

        if ( (status !== "accepted" && status !== "declined")) return res.status(401).json({error: "invalid status"})
        const { data:returnedRequest,error } = await Supabase.from("requests")
                                                    .delete()
                                                    .eq("id", request_id)
                                                    .select("*")
                                                    .single()

        if (error){
          return res.status(401).json({error})
        }
        
        // if the status is accepted, then we need to insert a new booking record
        if (status == "accepted") {
            const { data, error: err } = await Supabase
                .from('bookings')
                .insert([{"start_date":returnedRequest.start_date,
                        "return_date": returnedRequest.return_date, 
                        "renter_id": returnedRequest.renter_id , 
                        "car_id": returnedRequest.car_id,
                         }]) 
                .select("*").single()
                if (err) {
                    return res.status(401).json({ error: err.message });
                }
                res.status(200).json(data); 


        /* update the car to be unavailable for the requested dates, 
        by deleting any overlapping requests with this booking.
        this can be done in the database using a trigger or 
        can be handled explicitly here.
        */
       
}
else  res.status(200).json(returnedRequest);


  }

// for testing purposes only
// const addBooking = async (req, res) => {
//    const {data, error} = await Supabase
//     .from('bookings')
//     .insert([{"start_date": "2023-12-17",
//             "return_date": "2023-12-23", 
//             "renter_id": "9eb930e1-73d9-42a0-b928-545425d76160" , 
//             "car_id": 34}]).select("*").single()
//     if (error) {
//         return res.status(401).json({ error: error.message });
//     }
//     res.status(200).json(data);
    
// }

module.exports = {
    addRequest,
    getRecievedRequests,
    getSentRequests,
    handleRequest,
    addRequestStatic,
    cancelRequest,

    // addBooking

};
